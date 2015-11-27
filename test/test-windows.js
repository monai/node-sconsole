var assert = require('assert');

require.cache[require.resolve('syslog-bindings')] = {
    exports: new Error('Platform win32 is not supported')
};

var sconsole = require('..');
var instance = sconsole.create();

instance.setup({
    stdio: true,
    syslog: true
});

assert.strictEqual(instance.stack.length, 1);
