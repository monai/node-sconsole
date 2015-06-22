'use strict';

var chalk = require('chalk');
var bindings = require('syslog-bindings');
var util = require('util');

var sconsole = require('./sconsole');

var isOpen = false;

process.on('exit', close);

module.exports = syslog;

function syslog(options) {
    options = util._extend({
        upto: sconsole.priority.debug,
        ident: process.title,
        facility: sconsole.facility.user,
        format: format
    }, options);

    open(options);

    return function write(data) {
        bindings.syslog(data.priority, chalk.stripColor(options.format(data, options)));
    };
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


function open(options) {
    if ( ! isOpen) {
        bindings.setlogmask(options.upto);
        bindings.openlog(
            options.ident,
            bindings.LOG_PID | bindings.LOG_NDELAY,
            options.facility);
        isOpen = true;
    }
}

function close() {
    if (isOpen) {
        bindings.closelog();
        isOpen = false;
    }
}
