var ansiRegex = require('ansi-regex');
var bindings = require('syslog-bindings');

var isOpen = false;
var ansiRe = ansiRegex();

process.on('exit', close);

module.exports = {
    open: open,
    close: close,
    log: log
};

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

function log(priority, message) {
    bindings.syslog(priority, (message +'').replace(ansiRe, ''));
}
