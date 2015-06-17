'use strict';

var stream = require('stream');

wstream.sync = sync;
module.exports = wstream;

function wstream(write) {
    var stream_ = new stream.Writable({ objectMode: true });
    stream_._write = write_;

    return stream_;

    function write_(data, encoding, done) {
        write(data, done);
    }
}

function sync(write) {
    var stream_ = new stream.Writable({ objectMode: true });
    stream_._write = write_;

    return stream_;

    function write_(data, encoding, done) {
        write(data);
        done();
    }
}
