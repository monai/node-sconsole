'use strict';

var chalk = require('chalk');
var util = require('util');
var strftime = require('strftime');

var priority = require('./sconsole').priority;

module.exports = stdio;

function stdio(options) {
    options = util._extend({
        upto: priority.debug,
        out: process.stdout,
        err: process.stderr,
        format: format,
        padding: '     '
    }, options);

    return function write(data) {
        var output = data.priority > priority.err ? options.out : options.err;
        output.write(options.format(data, options));
    };
}

function format(data, options) {
    var level = data.level;
    var stack = data.stack;
    var output = [];

    level = options.padding.slice(0, -level.length) + level;

    if (data.priority == priority.warning) {
        level = chalk.yellow(level);
    } else if (data.priority > priority.error) {
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
