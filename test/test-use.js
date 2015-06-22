var assert = require('assert');

var sconsole = require('..');
var LOG_DEBUG = sconsole.priority.debug;
var a = sconsole.create();
var b = sconsole.create();
var c = sconsole.create();
var d = sconsole.create();

// Argument validation
assert.throws(function () { a.use(0); }, /function/);
assert.throws(function () { a.use(null, fn); }, /priority/);
assert.throws(function () { a.use(LOG_DEBUG + 1, fn); }, /priority/);
assert.throws(function () { a.use('something', fn); }, /priority/);

// Single argument
b.use(fn);
assert.equal(b.upto, LOG_DEBUG);
assert.equal(b.stack.length, 1);
assert.equal(b.stack[0].upto, LOG_DEBUG);
assert.equal(b.stack[0].fn, fn);

// Upto values
c.use(0, fn);
assert.equal(c.upto, 0);
c.use(2, fn2);
assert.equal(c.upto, 2);
c.use(1, fn3);
assert.equal(c.upto, 2);

assert.equal(c.stack[0].upto, 0);
assert.equal(c.stack[1].upto, 2);
assert.equal(c.stack[2].upto, 1);

assert.equal(c.stack[0].fn, fn);
assert.equal(c.stack[1].fn, fn2);
assert.equal(c.stack[2].fn, fn3);

// Upto as string argument
d.use('warn', fn);
assert.equal(d.upto, d.priority.warn);
d.use('info', fn);
assert.equal(d.upto, d.priority.info);

function fn() {}
function fn2() {}
function fn3() {}
