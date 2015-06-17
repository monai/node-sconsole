'use strict';

var chalk = require('chalk');
var util = require('util');
var strftime = require('strftime');

var wstream = require('./wstream');
var constants = require('./constants');

var LOG_ERROR = constants.priority.err;

module.exports = stdio;

function stdio(options) {
    options = util._extend({
        upto: constants.priority.debug,
        out: process.stdout,
        err: process.stderr,
        format: format,
        padding: '     '
    }, options);

    return wstream.sync(function write(data) {
        var output;

        if (data.priority <= options.upto) {
            output = data.priority > LOG_ERROR ? options.out : options.err;
            output.write(options.format(data, options));
        }
    });
}

function format(data, options) {
    var priority = data.priority;
    var level = data.level;
    var stack = data.stack;
    var output = [];

    level = options.padding.slice(0, -level.length) + level;

    if (priority == constants.priority.warning) {
        level = chalk.yellow(level);
    } else if (priority > constants.priority.error) {
        level = chalk.green(level);
    } else {
        level = chalk.red(level);
    }

    output.push(level, chalk.gray(strftime('%H:%M:%S')));

    if (stack) {
        output.push(util.format('[%s:%s]', stack.filename, stack.line));
    }

    output.push(data.message);

    return output.join(' ');
}
