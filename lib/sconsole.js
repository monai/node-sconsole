'use strict';

var key;
var Console = require('console').Console;
var util = require('util');
var path = require('path');

var constants = require('./constants');
var priority = constants.priority;

var stackRex = /at ([^\(\)]+) \(([^\(\)]+):(\d+):(\d+)\)/;
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
        items: [],
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
        write(instance.items, data);
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

    if (typeof upto === 'string') {
        upto = priority[upto];
    }

    if (upto > instance.upto) {
        instance.upto = upto;
    }

    instance.items.push({
        upto: upto,
        fn: fn
    });
}

function setup(instance, options) {
    var options_;

    if ( ! ('upto' in options)) {
        options.upto = priority.debug;
    }

    if (options.stdio) {
        options_ = util._extend(util._extend({}, options), options.stdio);

        if (options_.stdioFormat) {
            options_.format = options_.stdioFormat;
        }

        instance.use(options_.upto, require('./stdio')(options_));
    }

    if (options.syslog) {
        options_ = util._extend(util._extend({}, options), options.syslog);

        if (options_.syslogFormat) {
            options_.format = options_.syslogFormat;
        }

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

function write(items, data) {
    for (var i = items.length; i--;) {
        if (items[i].upto >= data.priority) {
            items[i].fn.call(null, data);
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
