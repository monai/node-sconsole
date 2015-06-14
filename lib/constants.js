var bindings = require('syslog-bindings');

modules.exports = {
    priority: priority,
    facility: facility
};

var priority = {
    'alert' :  bindings.LOG_ALERT,
    crit    :  bindings.LOG_CRIT,
    debug   :  bindings.LOG_DEBUG,
    emerg   :  bindings.LOG_EMERG,
    err     :  bindings.LOG_ERR,
    error   :  bindings.LOG_ERR,     /* DEPRECATED*/
    info    :  bindings.LOG_INFO,
    notice  :  bindings.LOG_NOTICE,
    panic   :  bindings.LOG_EMERG,   /* DEPRECATED*/
    warn    :  bindings.LOG_WARNING, /* DEPRECATED*/
    warning :  bindings.LOG_WARNING
};

var facility = {
    auth     : bindings.LOG_AUTH,
    authpriv : bindings.LOG_AUTHPRIV,
    cron     : bindings.LOG_CRON,
    daemon   : bindings.LOG_DAEMON,
    ftp      : bindings.LOG_FTP,
    kern     : bindings.LOG_KERN,
    lpr      : bindings.LOG_LPR,
    mail     : bindings.LOG_MAIL,
    news     : bindings.LOG_NEWS,
    security : bindings.LOG_AUTH, /* DEPRECATED*/
    syslog   : bindings.LOG_SYSLOG,
    user     : bindings.LOG_USER,
    uucp     : bindings.LOG_UUCP,
    local0   : bindings.LOG_LOCAL0,
    local1   : bindings.LOG_LOCAL1,
    local2   : bindings.LOG_LOCAL2,
    local3   : bindings.LOG_LOCAL3,
    local4   : bindings.LOG_LOCAL4,
    local5   : bindings.LOG_LOCAL5,
    local6   : bindings.LOG_LOCAL6,
    local7   : bindings.LOG_LOCAL7
};
