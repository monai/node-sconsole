var path = require('path');
var constants = require('./constants');
var stdio = require('./stdio');
var syslog = require('./syslog');
var console_ = require('./console');

var options;
var defaults = {
    facility: constants.facility.user,
    ident: process.title,
    stdio: true,
    syslog: true,
    upto: constants.priority.debug
};

var sconsole = {
    _stdio: stdio,
    _syslog: syslog,
    _getStack: getStack,
    priority: constants.priority,
    facility: constants.facility,
    close: close,
    log: log
};

module.exports = setup;

function setup(options_) {
    options = getOptions(options_, defaults);
    options.ident = options.ident || process.title;
    sconsole.options = options;
    
    if (options.stdio) {
        stdio.setup(options);
    }
    if (options.syslog) {
        syslog.close();
        syslog.open(options);
    }
    
    sconsole.console = console_(sconsole);
    return sconsole;
}

function close() {
    if (options.syslog) {
        syslog.close();
    }
}

function log(priority, message, stack) {
    stack = stack || getStack(3);
    
    if (priority <= options.upto) {
        if (options.stdio) {
            stdio.log(priority, message);
        }
        if (options.syslog) {
            syslog.log(priority, message);
        }
    }
}

function getOptions(options, defaults) {
    options = options || {};
    for (var i in defaults) {
        if ( ! options.hasOwnProperty(i)) {
            options[i] = defaults[i];
        }
    }
    return options;
}

function getStack(n) {
    var out, stackRe, stackRe2, stack, line, match;
    
    out = {};
    stackRe = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    stackRe2 = /at\s+()(.*):(\d*):(\d*)/gi;

    stack = (new Error()).stack.split('\n').slice(n);
    line = stack[0];
    match = stackRe.exec(line) || stackRe2.exec(line);
    
    if (match) {
        out.path = match[2];
        out.filename = path.basename(out.path);
        out.line = match[3];
        out.column = match[4]
    }
    
    return out;
}
