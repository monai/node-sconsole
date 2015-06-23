# node-sconsole

[![Build Status](http://img.shields.io/travis/monai/node-sconsole/develop.svg)](https://travis-ci.org/monai/node-sconsole)
[![NPM Version](http://img.shields.io/npm/v/sconsole.svg)](https://www.npmjs.org/package/sconsole)

Unified logger to console and syslog.

`npm install sconsole`

## How to use

```js
var sconsole = require('sconsole');

sconsole.setup({
    upto: sconsole.priority.info,
    ident: 'my app',
    stdio: true,
    syslog: {
        upto: sconsole.priority.error // overrides value in parent object
    }
});

sconsole.error('error message');
sconsole.warn('warning message');
sconsole.info('info message');
```
## API

### setup(options)

Options:

- `upto` Number default=`sconsole.priority.debug` - log messages up to this priority.
- `stdio` Boolean|Object - console output configuration.
- `syslog` Boolean|Object - syslog output configuration.

`stdio` and `syslog` object values can be defined in top priority options object. See example above.

`stdio` options:

- `true` - write to console using default options.
- `false` - do not write to console.
- `Object` - overrides parent options object. Specific options:
    - `out` Stream - stdout stream for messages with priority >=4.
    - `err` Stream - stderr stream for messages with priority <4.
    - `format` Function - message format function.

`syslog` options:

- `true` - write to syslog using default options.
- `false` - do not write to syslog.
- `Object` - overrides parent options object. Specific options:
    - `upto` Number default=`sconsole.priority.debug` - overrides top level option.
    - `ident` String default=process.title - message prefix used in syslog.
    - `facility` Number default=`sconsole.facility.user` - program type.
    - `format` Function - message format function.

Format function arguments:

- `data` Object - message data.
- `options` Object - options object.

Format function is expected to return string.

### Constants

- `sconsole.priority` - log priority constants, see [constants.js](/lib/constants.js).
- `sconsole.facility` - syslog facilities, see [constants.js](/lib/constants.js).

### Priority and console methods

`sconsole` is replacement for regular [console](https://iojs.org/api/console.html) module. It extends all console's methods so they work as expected, e.g. `sconsole.dir(obj, { colors: true })` will print colored object on iojs. On top of that `sconsole` has methods which represent syslogs' priorities, e.g. `sconsole.notice()`. The methods that are present in console and syslog has console's behavior and syslogs's priority. All the rest console's methods have `console.log()` behavior and `sconsole.priority.debug` priority.

Example:

- `sconsole.dir()` - `console.dir()` behavior, debug priority.
- `sconsole.error()` - `console.error()` behavior, error priority.
- `sconsole.notice()` - `console.log()` behavior, notice priority.

## License

ISC
