/* globals assert */

require.cache[require.resolve('../lib/stdio')] = { exports: stdio };
require.cache[require.resolve('../lib/syslog')] = { exports: syslog };

var sconsole = require('..');
var a = sconsole.create();
var b = sconsole.create();
var c = sconsole.create();
var d = sconsole.create();

// Inherite all base options
a.setup({
    propA: 'a',
    propB: 'b',
    upto: 4,
    format: 'format',
    stdio: {},
    syslog: {}
});

assert.equal(a.stack.length, 2);
assert.equal(a.upto, 4);

assert.equal(a.stack.shift().fn, stdio.fn);
assert.equal(a.stack.shift().fn, syslog.fn);

assert.deepEqual(stdio.fn.options, { propA: 'a', propB: 'b', upto: 4, format: 'format' });
assert.deepEqual(syslog.fn.options, { propA: 'a', propB: 'b', upto: 4, format: 'format' });

// Inherit correct format
b.setup({
    format: 'format',
    stdioFormat: 'stdioFormat',
    syslogFormat: 'syslogFormat',
    stdio: {},
    syslog: {}
});

assert.equal(stdio.fn.options.format, 'stdioFormat');
assert.equal(syslog.fn.options.format, 'syslogFormat');

// Preserve specialized options
c.setup({
    propA: 'a',
    propB: 'b',
    upto: 4,
    format: 'format',
    stdioFormat: 'stdioFormat',
    syslogFormat: 'syslogFormat',
    stdio: { format: 'stdio', propA: 'A' },
    syslog: { format: 'syslog', propB: 'B' }
});

assert.deepEqual(stdio.fn.options, { propA: 'A', propB: 'b', upto: 4, format: 'stdio' });
assert.deepEqual(syslog.fn.options, { propA: 'a', propB: 'B', upto: 4, format: 'syslog' });

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
