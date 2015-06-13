var bindings = require('syslog-bindings');

var isOpen = false;
var syslog = {
    open: open,
    close: close,
    log: log,
    priority: bindings.prioritynames,
    facility: bindings.facilitynames
};

delete syslog.priority.none;
delete syslog.priority.panic;
delete syslog.priority.warn;
delete syslog.facility.mark;
delete syslog.facility.security;

module.exports = syslog;

function open(options) {
    if ( ! isOpen) {
        bindings.setlogmask(options.upto);
        bindings.openlog(
            options.ident,
            bindings.LOG_PID | bindings.LOG_NDELAY,
            options.facility);
        process.on('exit', close);
    }
}

function close() {
    if (isOpen) {
        bindings.closelog();
    }
}

function log(priority, message) {
    bindings.syslog(priority, message);
}
