/* globals assert */

require.cache[require.resolve('../lib/stdio')] = { exports: stdio };
require.cache[require.resolve('../lib/syslog')] = { exports: syslog };

var sconsole = require('..');
var DEBUG = sconsole.priority.debug;
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

assert.equal(b.stack.length, 1);
assert.equal(b.upto, DEBUG);

assert.equal(stdio.fn, b.stack.shift().fn);
assert.equal(stdio.fn.options.upto, DEBUG);

// syslog defaults
c.setup({ syslog: true });

assert.equal(c.stack.length, 1);
assert.equal(c.upto, DEBUG);

assert.equal(c.stack.shift().fn, syslog.fn);
assert.equal(syslog.fn.options.upto, DEBUG);

// both defaults
d.setup({ stdio: true, syslog: true });

assert.equal(d.stack.length, 2);
assert.equal(d.upto, DEBUG);

assert.equal(d.stack.shift().fn, stdio.fn);
assert.equal(stdio.fn.options.upto, DEBUG);
assert.equal(d.stack.shift().fn, syslog.fn);
assert.equal(syslog.fn.options.upto, DEBUG);

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
