/* globals assert */

require.cache[require.resolve('../lib/stdio')] = { exports: stdio };
require.cache[require.resolve('../lib/syslog')] = { exports: syslog };

var sconsole = require('..');

sconsole.setup({});

assert.equal(sconsole.items.length, 0, 'Unexpected items added to stack');
assert.equal(sconsole.upto, -1, '"upto" changed');

function stdio(options) {
    var fn = function () {};
    fn.options = options;
    return fn;
}

function syslog(options) {
    var fn = function () {};
    fn.options = options;
    return fn;
}
