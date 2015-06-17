'use strict';

var key;
var Console = require('console').Console;
var PassThrough = require('stream').PassThrough;
var util = require('util');
var path = require('path');

var constants = require('./constants');
var priority = constants.priority;

var stackRex = /at ([^\(\)]+) \(([^\(\)]+):(\d+):(\d+)\)/;
var levelMap = {};
var consoleLevelMap = {
    time    : priority.debug,
    timeEnd : priority.debug,
    dir     : priority.debug,
    trace   : priority.debug,
    log     : priority.info
};

util.inherits(SConsole, Console);

SConsole.prototype.pipe = pipe;
SConsole.prototype.setup = setup;

for (key in priority) {
    if ( ! levelMap[priority[key]]) {
        levelMap[priority[key]] = key;
    }
}

for (key in consoleLevelMap) {
    SConsole.prototype[key] = makeMethod(key, levelMap[consoleLevelMap[key]]);
}

for (key in priority) {
    SConsole.prototype[key] = makeMethod(key, levelMap[priority[key]]);
}

module.exports = new SConsole();
module.exports.SConsole = SConsole;

function SConsole() {
    var keys, i;
    var prop = {
      writable: true,
      enumerable: false,
      configurable: true
    };

    prop.value = '';
    Object.defineProperty(this, '_level', prop);
    Object.defineProperty(this, '_method', prop);

    prop.value = -1;
    Object.defineProperty(this, '_priority', prop);

    prop.value = null;
    Object.defineProperty(this, '_stack', prop);

    prop.value = new PassThrough({ objectMode: true });
    Object.defineProperty(this, '_stream', prop);

    prop.value = priority;
    Object.defineProperty(this, 'priority', prop);

    prop.value = constants.facility;
    Object.defineProperty(this, 'facility', prop);

    Console.call(this, { write: _write.bind(this) });

    // bind the prototype functions to this Console instance
    keys = Object.keys(SConsole.prototype);
    for (i = keys.length; i--;) {
        this[keys[i]] = this[keys[i]].bind(this);
    }
}

function pipe(dest, options) {
    return this._stream.pipe(dest, options);
}

// Helper
function setup(options) {
    var options_;

    if (options.stdio) {
        options_ = util._extend(util._extend({}, options), options.stdio);

        if (options_.stdioFormat) {
            options_.format = options_.stdioFormat;
        }

        this.pipe(require('./stdio')(options_));
    }

    if (options.syslog) {
        options_ = util._extend(util._extend({}, options), options.syslog);

        if (options_.syslogFormat) {
            options_.format = options_.syslogFormat;
        }

        this.pipe(require('./syslog')(options_));
    }

    return this;
}

function makeMethod(method, level) {
    return function method_() {
        if ( ! this._method) {
            this._method = method;
            this._level = level;
            this._priority = priority[level];
            this._stack = stack(method_);
        }

        (Console.prototype[method] || Console.prototype.log).apply(this, arguments);

        this._method = '';
    };
}

function _write(message) {
    this._stream.write({
        method: this._method,
        level: this._level,
        priority: this._priority,
        stack: this._stack,
        message: message
    });
}

function stack(fn) {
    var tmp = {}, match;
    Error.captureStackTrace(tmp, fn);

    match = tmp.stack.split('\n')[1].match(stackRex);

    return {
        method: match[1],
        path: match[2],
        filename: path.basename(match[2]),
        line: match[3],
        column: match[4]
    };
}
