var Writable = require('readable-stream').Writable;
var Console = require('console').Console;
var util = require('./util');

module.exports = setup;

function setup(sconsole) {
    var stdout, stderr;
    
    stdout = writable(function (chunk, done) {
        sconsole.log(
            sconsole.priority.info,
            chunk.trim(),
            util.getStack(8));
        done(null, chunk);
    });
    
    stderr = writable(function (chunk, done) {
        var stack, priority;
        
        stack = util.getStack(7);
        priority = (stack.method == 'Console.warn')
                   ? sconsole.priority.warning
                   : sconsole.priority.err;
        sconsole.log(
            priority,
            chunk.trim(),
            util.getStack(8));
        done(null, chunk);
    });
    
    return new Console(stdout, stderr);
}

function writable(callback) {
    var stream;
    
    stream =  new Writable({ objectMode: true });
    stream._write = _write;
    return stream;
    
    function _write(chunk, enc, done) {
        return callback.bind(this)(chunk, done);
    }
}
