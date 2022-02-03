# Logger JS

A simple package to help logging into Console & Files

## Installation

```
npm i @ahmedelazazy/logger-js
```

## Getting Started

```
const {init, log} = require('@ahmedelazazy/logger-js')

//options - set it once on startup
init({
	enableFileError: true,
	enableFileInfo: true,
	enableConsoleError: true,
	enableConsoleInfo: true,
	flushAtInit: false,
	timeZone: 'America/New_York',
});

log("test logger")
```

## API

### Log: Function (string | number | boolean | object | error | options)

- **String**
- **Number**
- **Boolean**

```
log("test message") //valid
log(1) //valid
log(true) //valid
```

- **Object**

```
log({name: 'A', num: 1}) //valid
```

- **Error object**

```
try {
  invalidFn()
} catch (err) {
  log(err) //valid
}
```

- **Options: {message, data, error}**

```
try {
  const response = await getData()

  log({
      message: "Data fetched successfully",
      data: response
    })

} catch(err){
    log({
      message: "Error while fetching data",
      error: err
    })
}
```

### Init: Function (options)

- **Options**

```
{
	enableFileError: true,
	enableFileInfo: true,
	enableConsoleError: true,
	enableConsoleInfo: true,
	flushAtInit: false,
	timeZone: 'America/New_York',
}
```
