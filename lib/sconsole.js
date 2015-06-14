var syslog = require('./syslog');
var stdio = require('./stdio');
var constants = require('./constants');

var options;
var defaults = {
    facility: constants.facility.user,
    ident: 'node',
    stdio: true,
    syslog: true,
    upto: constants.priority.debug
};

var sconsole = {
    defaults: defaults,
    syslog: syslog,
    close: close,
    log: log,
    priority: constants.priority,
    facility: constants.facility
};

module.exports = setup;

function setup(options_) {
    options = getOptions(options_, defaults);
    
    if (options.stdio) {
        stdio.setup(options);
    }
    if (options.syslog) {
        syslog.close();
        syslog.open(options);
    }
    
    return sconsole;
}

function close() {
    if (options.syslog) {
        syslog.close();
    }
}

function log(priority, message) {
    if (options.stdio) {
        stdio.log(priority, message);
    }
    if (options.syslog) {
        syslog.log(priority, message);
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
