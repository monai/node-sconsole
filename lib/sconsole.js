'use strict';

var key;
var Console = require('console').Console;
var util = require('util');
var path = require('path');

var constants = require('./constants');
var priority = constants.priority;

var stackRe = /at ([^\(\)]+) \(([^\(\)]+):(\d+):(\d+)\)/;
var levelMap = {};

priority.log = priority.info;

for (key in Console.prototype) {
    if ( ! (key in priority)) {
        priority[key] = priority.debug;
    }
}

for (key in priority) {
    if ( ! levelMap[priority[key]]) {
        levelMap[priority[key]] = key;
    }
}

module.exports = create();

function create() {
    var key;
    var data = {};
    var console_ = Console({ write: write_ });
    var instance = {
        upto: -1,
        stack: [],
        use: use_,
        setup: setup_,
        create: create,
        priority: priority,
        facility: constants.facility
    };

    for (key in priority) {
        makeMethod(instance, key, priority[key], levelMap[priority[key]], console_, data);
    }

    return instance;

    function write_(message) {
        data.message = message;
        write(instance.stack, data);
    }

    function use_(upto, fn) {
        use(instance, upto, fn);
        return instance;
    }

    function setup_(options) {
        setup(instance, options);
        return instance;
    }
}

function use(instance, upto, fn) {
    if ( ! fn) {
        fn = upto;
        upto = 'debug';
    }

    if (util.isString(upto)) {
        upto = priority[upto];
    }

    if ( ! levelMap[upto]) {
        throw TypeError(util.format('unrecognized priority: \'%s\'', upto));
    }
    
    if ( ! util.isFunction(fn)) {
        throw TypeError('argument \'function\' must be a function');
    }

    if (upto > instance.upto) {
        instance.upto = upto;
    }

    instance.stack.push({
        upto: upto,
        fn: fn
    });
}

function setup(instance, options) {
    var e = util._extend;
    var options_;
    var stdio = options.stdio;
    var syslog = options.syslog;
    var stdioFormat = options.stdioFormat;
    var syslogFormat = options.syslogFormat;

    delete options.stdio;
    delete options.stdioFormat;
    delete options.syslog;
    delete options.syslogFormat;

    if ( ! ('upto' in options)) {
        options.upto = priority.debug;
    }

    if (stdio) {
        options_ = e(e(e({}, options), stdioFormat && { format: stdioFormat }), stdio);
        instance.use(options_.upto, require('./stdio')(options_));
    }

    if (syslog) {
        options_ = e(e(e({}, options), syslogFormat && { format: syslogFormat }), syslog);
        instance.use(options_.upto, require('./syslog')(options_));
    }
}

function makeMethod(instance, method, priority, level, console_, data) {
    instance[method] = function method_() {
        if (instance.upto >= priority) {
            data.method = method;
            data.level = level;
            data.priority = priority;
            data.stack = stack(method_);

            (console_[method] || console_.log).apply(console_, arguments);
        }
    };
}

function write(stack, data) {
    for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i].upto >= data.priority) {
            stack[i].fn.call(null, data);
        }
    }
}

function stack(fn) {
    var tmp = {}, match;
    Error.captureStackTrace(tmp, fn);

    match = tmp.stack.split('\n')[1].match(stackRe);

    return {
        method: match[1],
        path: match[2],
        filename: path.basename(match[2]),
        line: match[3],
        column: match[4]
    };
}
