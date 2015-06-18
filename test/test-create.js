/* globals assert */

var sconsole = require('..');

var writes = 0;

var a = sconsole.create().use(function (data) {
    assert.equal(data.message, 'a\n');
    writes++;
});

var b = sconsole.create().use(function (data) {
    assert.equal(data.message, 'b\n');
    writes++;
});

assert.notEqual(a, b, 'Reused same object');
assert.equal(typeof a.priority, 'object', 'Failed to expose constants');
assert.equal(typeof b.priority, 'object', 'Failed to expose constants');
assert.equal(typeof a.facility, 'object', 'Failed to expose constants');
assert.equal(typeof b.facility, 'object', 'Failed to expose constants');

a.log('a');
assert.equal(writes, 1, 'Middleware not used');

b.log('b');
assert.equal(writes, 2, 'Middleware not used');
