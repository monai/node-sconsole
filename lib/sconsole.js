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

function log(priority, message) {
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
