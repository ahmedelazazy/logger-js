const util = require('util')
const fs = require('fs')
const callerId = require('caller-id')
const { nowHuman, nowUnix } = require('./datetime')

const DEFAULT_OPTIONS = {
	enableFileLog: false,
	enableFileError: true,
	enableFileInfo: true,
	enableConsoleError: true,
	enableConsoleInfo: true,
	timeZone: 'UTC',
	logsMode: 'append',
}

const INSPECT_OPTIONS = {
	maxArrayLength: null,
	showHidden: false,
	depth: null,
	color: false,
}

let _options = {}

let _config = {
	pathLogsBaseFolder: `${process.env.PWD}/logs`,
	pathLogsFinalFolder: `${process.env.PWD}/logs`,
	pathInfoFile: `${process.env.PWD}/logs/info.txt`,
	pathErrorFile: `${process.env.PWD}/logs/error.txt`,
	pathLogFile: `${process.env.PWD}/logs/log.txt`,
}

function init(options = DEFAULT_OPTIONS) {
	try {
		_options = { ...DEFAULT_OPTIONS, ...options }

		if (!fs.existsSync(_config.pathLogsBaseFolder)) {
			fs.mkdirSync(_config.pathLogsBaseFolder)
		}

		if (_options.logsMode === 'unique') {
			_config.pathLogsFinalFolder = `${_config.pathLogsBaseFolder}/${nowUnix()}`
			_config.pathInfoFile = `${_config.pathLogsFinalFolder}/info.txt`
			_config.pathErrorFile = `${_config.pathLogsFinalFolder}/error.txt`
			_config.pathLogFile = `${_config.pathLogsFinalFolder}/log.txt`

			if (!fs.existsSync(_config.pathLogsFinalFolder)) {
				fs.mkdirSync(_config.pathLogsFinalFolder)
			}
		}

		if (_options.logsMode === 'clear') {
			fs.rmSync(_config.pathInfoFile, { force: true })
			fs.rmSync(_config.pathErrorFile, { force: true })
			fs.rmSync(_config.pathLogFile, { force: true })
		}
	} catch (err) {
		console.error('Erorr while initializing the logger', err.message)
	}
}

async function log({ message, data, error }) {
	try {
		//handle primitive types
		if (arguments.length === 1 && (typeof arguments[0] === 'string' || arguments[0] === 'number' || arguments[0] === 'boolean')) {
			message = arguments[0]
		}

		//handle errors
		if (arguments.length === 1 && Object.prototype.toString.call(arguments[0]) === '[object Error]') {
			error = arguments[0]
		}

		//handle objects
		if (arguments.length === 1 && typeof arguments[0] === 'object') {
			if (!message && !data && !error) data = arguments[0]
		}

		if (!message && !data && !error) return

		const logRecord = {
			datetime: nowHuman(_options.timeZone),
			unix: nowUnix(),
			function: callerId.getString(),
		}

		if (message) logRecord.message = message
		if (data) logRecord.data = data
		if (error) logRecord.error = error

		//console
		if (_options.enableConsoleInfo) {
			if (!logRecord.error) console.log(util.inspect(logRecord, INSPECT_OPTIONS))
		}

		if (_options.enableConsoleError) {
			if (logRecord.error) console.error(`🛑  ${util.inspect(logRecord.error, INSPECT_OPTIONS)}`)
		}

		//files
		if (_options.enableFileLog) {
			await fs.promises.appendFile(_config.pathLogFile, util.inspect(logRecord, INSPECT_OPTIONS) + '\n\n')
		}

		if (_options.enableFileError && logRecord.error) {
			await fs.promises.appendFile(_config.pathErrorFile, util.inspect(logRecord, INSPECT_OPTIONS) + '\n\n')
		}

		if (_options.enableFileInfo && !logRecord.error) {
			await fs.promises.appendFile(_config.pathInfoFile, util.inspect(logRecord, INSPECT_OPTIONS) + '\n\n')
		}
	} catch (err) {
		console.error('Erorr while writing logs', err.message)
	}
}

init()

module.exports = {
	init,
	log,
}
