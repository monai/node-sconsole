var bindings = require('syslog-bindings');

var isOpen = false;
var options = {};
var defaults = {
    facility: 'user',
    ident: 'node',
    stdout: true,
    stderr: true,
    syslog: true,
    upto: 'debug'
};

module.exports = setup;
module.exports.close = close;

function setup(options_) {
    close();
    
    options_ = options_ || {};
    for (var i in defaults) {
        if ( ! options_.hasOwnProperty(i)) {
            options_[i] = defaults[i];
        }
    }
    options = options_;
    options.upto = getPriority(options.upto);
    
    open();
    process.on('exit', close);
}

function open() {
    if ( ! isOpen) {
        bindings.setlogmask(options.upto);
        bindings.openlog(
            options.ident,
            bindings.LOG_PID | bindings.LOG_NDELAY,
            options.facility);
    }
}

function close() {
    if (isOpen) {
        bindings.closelog();
    }
}

function log(priority, message) {
    priority = getPriority(priority);
    console.log(priority, message);
    bindings.syslog(priority, message);
}

function getPriority(priority) {
    var priority_ = priority;
    if (typeof priority == 'string') {
        var priority_ = bindings.prioritynames[priority];
        if ( ! priority_) {
            throw new Error('Unknown priority name \''+ priority +'\'');
        }
    }
    return priority_;
}


setup();
log(bindings.LOG_DEBUG, 'ok');
close();
