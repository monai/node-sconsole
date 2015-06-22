'use strict';

var util = require('util');
var chalk = require('chalk');
var bindings = require('syslog-bindings');

var sconsole = require('./sconsole');

var options_;
var isOpen = false;
var buffer = [];

process.on('exit', close);

module.exports = syslog;

function syslog(options) {
    options_ = util._extend({
        upto: sconsole.priority.debug,
        ident: process.title,
        facility: sconsole.facility.user,
        format: format
    }, options);
    
    if (isOpen) {
        throw Error('syslog already open');
    }
    
    isOpen = true;
    open(options_, dumpBuffer);
    
    return function write(data) {
        if (isOpen) {
            write_(options_, data);
        } else {
            buffer.push(data);
        }
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
    if (isOpen) {
        bindings.closelog();
        isOpen = false;
    }
}

function write_(options, data) {
    bindings.syslog(data.priority, chalk.stripColor(options.format(data, options)));
}

function dumpBuffer() {
    for (var i = 0, l = buffer.length; i < l; i++) {
        write_(options_, buffer[i]);
    }
    buffer = null;
}
