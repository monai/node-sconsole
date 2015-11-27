'use strict';

var priority = {
    alert   : 1,
    crit    : 2,
    debug   : 7,
    emerg   : 0,
    error   : 3, // DEPRECATED
    err     : 3,
    info    : 6,
    notice  : 5,
    panic   : 0, // DEPRECATED
    warn    : 4, // DEPRECATED
    warning : 4
};

var facility = {
    auth     : (4  << 3),
    authpriv : (10 << 3),
    cron     : (9  << 3),
    daemon   : (3  << 3),
    ftp      : (11 << 3),
    kern     : (0  << 3),
    lpr      : (6  << 3),
    mail     : (2  << 3),
    news     : (7  << 3),
    security : (4  << 3), // DEPRECATED
    syslog   : (5  << 3),
    user     : (1  << 3),
    uucp     : (8  << 3),
    local0   : (16 << 3),
    local1   : (17 << 3),
    local2   : (18 << 3),
    local3   : (19 << 3),
    local4   : (20 << 3),
    local5   : (21 << 3),
    local6   : (22 << 3),
    local7   : (23 << 3)
};

module.exports = {
    priority: priority,
    facility: facility
};
