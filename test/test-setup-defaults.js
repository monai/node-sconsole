var assert = require('assert');

require.cache[require.resolve('../lib/stdio')] = { exports: stdio };
require.cache[require.resolve('../lib/syslog')] = { exports: syslog };

var sconsole = require('..');
var LOG_DEBUG = sconsole.priority.debug;
var a = sconsole.create();
var b = sconsole.create();
var c = sconsole.create();
var d = sconsole.create();

// Empty options
a.setup({});

assert.equal(a.stack.length, 0);
assert.equal(a.upto, -1);

// stdio defaults
b.setup({ stdio: true });

assert.equal(b.stack.length, 1, "Stack should be updated");
assert.equal(b.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

assert.equal(stdio.fn, b.stack.shift().fn, "First stack item should be stdio");
assert.equal(stdio.fn.options.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

// syslog defaults
c.setup({ syslog: true });

assert.equal(c.stack.length, 1, "Stack should be updated");
assert.equal(c.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

assert.equal(c.stack.shift().fn, syslog.fn, "First stack item should be syslog");
assert.equal(syslog.fn.options.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

// both defaults
d.setup({ stdio: true, syslog: true });

assert.equal(d.stack.length, 2, "Stack should be updated");
assert.equal(d.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

assert.equal(d.stack.shift().fn, stdio.fn, "First stack item should be stdio");
assert.equal(stdio.fn.options.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");
assert.equal(d.stack.shift().fn, syslog.fn, "Second stack item should be syslog");
assert.equal(syslog.fn.options.upto, LOG_DEBUG, "Default 'upto' value is not set to LOG_DEBUG");

function stdio(options) {
    stdio.fn = function () {};
    stdio.fn.options = options;
    return stdio.fn;
}

function syslog(options) {
    syslog.fn = function () {};
    syslog.fn.options = options;
    return syslog.fn;
}
