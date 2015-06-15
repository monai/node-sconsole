var constants = require('./constants');
var stdio = require('./stdio');
var syslog = require('./syslog');
var console_ = require('./console');
var util = require('./util');

var options;
var defaults = {
    facility: constants.facility.user,
    ident: process.title,
    stdio: true,
    syslog: true,
    upto: constants.priority.debug,
    stdioFormat: util.stdioFormat,
    syslogFormat: util.syslogFormat
};

var sconsole = {
    _stdio: stdio,
    _syslog: syslog,
    priority: constants.priority,
    facility: constants.facility,
    close: close,
    log: log
};

module.exports = setup;

function setup(options_) {
    var key;
    
    options = getOptions(options_, defaults);
    options.ident = options.ident || process.title;
    sconsole.options = options;
    
    if (options.syslog) {
        syslog.close();
        syslog.open(options);
    }
    
    for (key in constants.priority) {
        sconsole[key] = function(message) {
            log(constants.priority[key], message, util.getStack(3));
        }
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
    stack = stack || util.getStack(3);
    
    if (priority <= options.upto) {
        if (options.stdio) {
            stdio.log(priority, options.stdioFormat(sconsole, priority, message, stack));
        }
        if (options.syslog) {
            syslog.log(priority, options.syslogFormat(sconsole, priority, message, stack));
        }
    }
}

function getOptions(options, defaults) {
    var key;
    
    options = options || {};
    for (key in defaults) {
        if ( ! options.hasOwnProperty(key)) {
            options[key] = defaults[key];
        }
    }
    return options;
}
