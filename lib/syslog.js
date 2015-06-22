'use strict';

var util = require('util');
var chalk = require('chalk');
var bindings = require('syslog-bindings');

var sconsole = require('./sconsole');

var isOpen = false;

process.on('exit', close);

module.exports = syslog;

function syslog(options) {
    var buffer = [];
    var _write = writeBuffer;
    var e = util._extend;

    if (isOpen) {
        throw Error('syslog already open');
    }

    isOpen = true;

    options = e({
        upto: sconsole.priority.debug,
        ident: process.title,
        facility: sconsole.facility.user,
        format: format
    }, options);

    open(options, function () {
        _write = writeSyslog;
        buffer.forEach(_write);
        buffer = null;
    });

    return function write(data) {
        _write(data);
    };

    function writeBuffer(data) {
        buffer.push(e({}, data));
    }

    function writeSyslog(data) {
        bindings.syslog(data.priority, chalk.stripColor(options.format(data, options)));
    }
}

function format(data) {
    var output = [];
    var stack = data.stack;

    if (stack) {
        output.push(util.format('[%s:%s]', stack.filename, stack.line));
    }

    output.push(data.message.trim());

    return output.join(' ');
}


function open(options, done) {
    bindings.setlogmask(options.upto, function () {
        openlog(options, done);
    });
}

function openlog(options, done) {
    bindings.openlog(
        options.ident,
        bindings.LOG_PID | bindings.LOG_NDELAY,
        options.facility,
        done);
}

function close() {
    bindings.closelog();
}
