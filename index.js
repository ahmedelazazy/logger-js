const util = require('util')
const fs = require('fs')
const { DateTime } = require('luxon')
const callerId = require('caller-id')

let OPTIONS

let DEFAULT_OPTIONS = {
	enableFileError: true,
	enableFileInfo: true,
	enableConsoleError: true,
	enableConsoleInfo: true,
	flushAtInit: false,
	timeZone: 'America/New_York',
}

const inspectOptions = {
	maxArrayLength: null,
	showHidden: false,
	depth: null,
	color: false,
}

const init = (options = DEFAULT_OPTIONS) => {
	try {
		OPTIONS = { ...DEFAULT_OPTIONS, ...options }

		if (!fs.existsSync(`${process.env.PWD}/logs/`)) {
			fs.mkdirSync(`${process.env.PWD}/logs/`)
		}

		if (OPTIONS.flushAtInit) {
			fs.rmSync(`${process.env.PWD}/logs/info.txt`, { force: true })
			fs.rmSync(`${process.env.PWD}/logs/error.txt`, { force: true })
		}
	} catch (err) {
		console.error('Erorr while initializing the logger', err.message)
	}
}

function nowHuman(timeZone = OPTIONS.timeZone) {
	return DateTime.now().setZone(timeZone).toFormat('f')
}

async function log({ message, data, error }) {
	try {
		//handle primitive types
		if (arguments.length === 1 && (typeof arguments[0] === 'string' || arguments[0] === 'number' || arguments[0] === 'boolean')) {
			message = arguments[0]
		}

		//handle erros
		if (arguments.length === 1 && Object.prototype.toString.call(arguments[0]) === '[object Error]') {
			error = arguments[0]
		}

		//handle objects
		if (arguments.length === 1 && typeof arguments[0] === 'object') {
			if (!message && !data && !error) data = arguments[0]
		}

		if (!message && !data && !error) return

		const fn = callerId.getString()
		const dt = nowHuman()

		if (OPTIONS.enableConsoleInfo || OPTIONS.enableConsoleError) {
			console.log(`${dt} @ ${fn}`)
		}

		if (OPTIONS.enableConsoleInfo) {
			if (message && util.inspect(message, inspectOptions) !== 'undefied') console.log(`${util.inspect(message, inspectOptions)}`)

			if (data && util.inspect(data, inspectOptions) !== 'undefied') console.log(`${util.inspect(data, inspectOptions)}`)
		}

		if (OPTIONS.enableConsoleError) {
			if (error && util.inspect(error, inspectOptions) !== 'undefied') console.error(`🛑  ${util.inspect(error, inspectOptions)}`)
		}

		const logRecord = {
			datetime: nowHuman(),
			function: fn,
		}

		if (message) logRecord.message = message
		if (data) logRecord.data = data
		if (error) logRecord.error = error

		if (OPTIONS.enableFileInfo) {
			await fs.promises.appendFile(`${process.env.PWD}/logs/info.txt`, util.inspect(logRecord, inspectOptions) + '\n\n')
		}

		if (OPTIONS.enableFileError && error) {
			if (error) await fs.promises.appendFile(`${process.env.PWD}/logs/error.txt`, util.inspect(logRecord, inspectOptions) + '\n\n')
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
