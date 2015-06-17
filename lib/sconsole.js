'use strict';

var key;
var Console = require('console').Console;
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

SConsole.prototype.use = use;
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

    prop.value = -1;
    Object.defineProperty(this, '_upto', prop);

    prop.value = null;
    Object.defineProperty(this, '_data', prop);

    prop.value = [];
    Object.defineProperty(this, '_list', prop);

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

function use(upto, fn) {
    if ( ! fn) {
        fn = upto;
        upto = priority.debug;
    }

    if (typeof upto === 'string') {
        upto = priority[upto];
    }

    if (upto > this._upto) {
        this._upto = upto;
    }

    this._list.push({
        upto: upto,
        fn: fn
    });

    return this;
}

// Helper
function setup(options) {
    var options_;

    if (options.stdio) {
        options_ = util._extend(util._extend({}, options), options.stdio);

        if (options_.stdioFormat) {
            options_.format = options_.stdioFormat;
        }

        this.use(options_.upto, require('./stdio')(options_));
    }

    if (options.syslog) {
        options_ = util._extend(util._extend({}, options), options.syslog);

        if (options_.syslogFormat) {
            options_.format = options_.syslogFormat;
        }

        this.use(options_.upto, require('./syslog')(options_));
    }

    return this;
}

function makeMethod(method, level) {
    var priority_ = priority[level];

    return function method_() {
        if (this._upto >= priority_) {
            if ( ! this._data) {
                this._data = {
                    method: method,
                    level: level,
                    priority: priority_,
                    stack: stack(method_)
                };
            }

            (Console.prototype[method] || Console.prototype.log).apply(this, arguments);

            this._data = null;
        }
    };
}

function _write(message) {
    var i = this._list.length;
    var data = this._data;

    data.message = message;

    for (; i--;) {
        if (this._list[i].upto >= data.priority) {
            this._list[i].fn.call(null, data);
        }
    }
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
