# Logger JS

A minimal package to help logging into Console & text files. Flexible API to accept several types.

Has basic options to enable/disable Console logging and enable/disable File logging.

Can control the logs mode to be cleared everytime, appended, or saved into new folder.

### Who shall use this?

If you are looking for a quick way to save your logs formatted with timestamp to text files, here you go.

## Installation

```
npm i @ahmedelazazy/logger-js
```

## Getting Started

```js
const { log } = require('@ahmedelazazy/logger-js')

log('test logger')

// Output:
// {
//   datetime: 'Tue, 2/22/2022, 01:11:39 PM UTC',
//   unix: 1645535436,
//   function: null,
//   message: 'test logger'
// }
```

---

- Optionally call `init` once on startup with the settings

```js
const { log } = require('@ahmedelazazy/logger-js')

const options = { timeZone: 'America/New_York' }

init(options)

log({ message: 'data example', data: { a: 1, b: 2 } })

// Output:
// {
//   datetime: 'Tue, 2/22/2022, 08:08:43 AM EST',
//   unix: 1645535323,
//   function: null,
//   message: 'data example',
//   data: { a: 1, b: 2 }
// }
```

## Log Record Fields

- `datetime` a human readable date/time of the log - the time zone is configured from the `init` options
- `unix` the unix value of the log time
- `function` the name of the function where the record was logged
- `message` optional - a text message
- `data` optional - an object to be logged
- `error` optional - thrown exception

Every record should have at least one of the parameters: message, data or error.

## Init Options

You can customize the log, to enable/disable Console & Files

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| enableFileLog | Boolean | false | If true, will write errors & info into /logs/log.txt |
| enableFileError | Boolean | true | If true, will write errors to /logs/error.txt |
| enableFileInfo | Boolean | true | If true, will write info to /logs/info.txt |
| enableConsoleError | Boolean | true | If true, will log error to Console |
| enableConsoleInfo | Boolean | true | If true, will log info to Console |
| timeZone | String | UTC | The timezone used in the human timestamps. Unix will always using UTC. Example: "America/New_York" |
| logsMode | String | append | **clear**: will overwrite the logs files with every run <br /> path: `/logs/{log\|error\|info}.txt` <br /><br /> **append**: will append the logs to the existing logs files <br /> path: `/logs/{log\|error\|info}.txt` <br /><br /> **unique**: will create a logs folder with the unix value of the startup <br /> path: `/logs/{timestamp}/{log\|error\|info}.txt` |

## API

### `log`: Function (string | number | boolean | object | error | options)

- **String**
- **Number**
- **Boolean**

```js
log('test message') //valid
log(1) //valid
log(true) //valid
```

- **Object**

```js
log({ name: 'A', num: 1 }) //valid
```

- **Error object**

```js
try {
	invalidFn()
} catch (err) {
	log(err) //valid
}
```

- **Options: {message, data, error}**

```js
try {
	const response = await getData()

	log({
		message: 'Data fetched successfully',
		data: response,
	})
} catch (err) {
	log({
		message: 'Error while fetching data',
		error: err,
	})
}
```

---

### `init`: Function (options)

- **Options**

```js
{
	enableFileLog: false,
	enableFileError: true,
	enableFileInfo: true,
	enableConsoleError: true,
	enableConsoleInfo: true,
	timeZone: 'UTC',
	logsMode: 'append',
}
```
