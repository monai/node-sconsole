var syslog = require('./syslog');

var options = {};
var defaults = {
    facility: syslog.facility.user,
    ident: 'node',
    stdout: true,
    stderr: true,
    syslog: true,
    upto: syslog.priority.debug
};

var sconsole = {
    defaults: defaults,
    syslog: syslog,
    close: close,
    log: log,
    priority: syslog.priority,
    facility: syslog.facility
};

module.exports = setup;

function setup(options_) {
    options = getOptions(options_, defaults);
    
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
    if (options.syslog) {
        syslog.log(priority, message);
    }
    
    if (options.stdout) {
        console.log(priority, message);
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
