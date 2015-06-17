'use strict';

var ansiRegex = require('ansi-regex');
var bindings = require('syslog-bindings');
var util = require('util');

var wstream = require('./wstream');
var constants = require('./constants');

var isOpen = false;
var ansiRe = ansiRegex();

process.on('exit', close);

module.exports = syslog;

function syslog(options) {
    options = util._extend({
        upto: constants.priority.debug,
        ident: process.title,
        facility: constants.facility.user,
        format: format
    }, options);

    open(options);

    return wstream.sync(function write(data) {
        if (data.priority <= options.upto) {
            bindings.syslog(data.priority, options.format(data, options).replace(ansiRe, ''));
        }
    });
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
