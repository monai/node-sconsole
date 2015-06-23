var assert = require('assert');

require.cache[require.resolve('console')] = { exports: { Console: _console() } };

var console_;
var sconsole = require('..');
var a = sconsole.create();

// Ignore call
reset();
a.use('alert', alert);
a.use('error', error);
a.log('message');

assert.equal(a.upto, a.priority.error);
assert.equal(console_.calls.length, 0);

// Write crit to error
reset();
a.use('alert', alert);
a.use('error', error);
a.crit('message');

assert.equal(console_.calls.length, 1);
assert.equal(console_.calls[0], 'log');
assert.equal(error.calls.length, 1);
assert.equal(alert.calls.length, 0);

// Write emerg to both
reset();
a.use('alert', alert);
a.use('error', error);
a.emerg('message');

assert.equal(console_.calls.length, 1);
assert.equal(console_.calls[0], 'log');
assert.equal(error.calls.length, 1);
assert.equal(alert.calls.length, 1);

// Assing debug level to unknown methods
reset();
a.use(alert);
a.stuff('debug');

assert.equal(console_.calls.length, 1);
assert.equal(console_.calls[0], 'stuff');
assert.equal(alert.calls.length, 1);
assert.equal(alert.calls[0].priority, a.priority.debug);

// Message format
reset();
a.use(alert);
(function closure() {
    a.stuff('message');
})();

assert.equal(alert.calls.length, 1);
assert.equal(alert.calls[0].level, 'debug');
assert.equal(alert.calls[0].method, 'stuff');
assert.equal(alert.calls[0].priority, a.priority.debug);
assert.equal(alert.calls[0].message, 'message\n');

assert.equal(typeof alert.calls[0].stack, 'object');
assert.equal(alert.calls[0].stack.method, 'closure');
assert.equal(alert.calls[0].stack.path, __filename);
assert.equal(alert.calls[0].stack.filename, __filename.split(/[\/\\]/).pop());
assert.equal(alert.calls[0].stack.line, 54);
assert.equal(alert.calls[0].stack.column, 7);

function _console() {
    function Console(stdout, stderr) {
        if (this instanceof Console) {
            console_ = this;
            this.stdout = stdout;
            this.calls = [];
        } else {
            return new Console(stdout, stderr);
        }
    }

    Console.prototype.log = function (message) {
        this.calls.push('log');
        this.stdout.write(message +'\n');
    };

    Console.prototype.stuff = function (message) {
        this.calls.push('stuff');
        this.stdout.write(message +'\n');
    };

    Console.prototype.error = Console.prototype.log;

    return Console;
}

function alert(data) {
    alert.calls.push(data);
}

function error(data) {
    error.calls.push(data);
}

function reset() {
    a.upto = -1;
    a.stack = [];
    alert.calls = [];
    error.calls = [];
    console_.calls = [];
}
