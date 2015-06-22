'use strict';

var chalk = require('chalk');
var util = require('util');

var priority = require('./sconsole').priority;

module.exports = stdio;

function stdio(options) {
    options = util._extend({
        out: process.stdout,
        err: process.stderr,
        format: format,
        padding: '      '
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

    output.push(level, chalk.gray(timestamp()));

    if (stack) {
        output.push(util.format('[%s:%s]', stack.filename, stack.line));
    }

    output.push(data.message);

    return output.join(' ');
}

function timestamp() {
    var date = new Date();
    var z = '0';
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    return (h > 9 ? h : z + h) +':'+ (m > 9 ? m : z + m) +':'+ (s > 9 ? s : z + s);
}
