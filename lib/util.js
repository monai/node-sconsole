var path = require('path');
var util = require('util');
var chalk = require('chalk');
var strftime = require('strftime');
var constants = require('./constants');

module.exports = {
    getStack: getStack,
    stdioFormat: stdioFormat,
    syslogFormat: syslogFormat
}

function getStack(n) {
    var out, stackRe, stackRe2, stack, line, match;
    
    out = {};
    stackRe = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    stackRe2 = /at\s+()(.*):(\d*):(\d*)/gi;

    stack = (new Error()).stack.split('\n').slice(n);
    line = stack[0];
    match = stackRe.exec(line) || stackRe2.exec(line);
    
    if (match) {
        out.path = match[2];
        out.filename = path.basename(out.path);
        out.line = match[3];
        out.column = match[4]
    }
    
    return out;
}

function stdioFormat(priority, message, stack) {
    var out, pr, date, file;
    
    out = [];
    pr = (priority > constants.priority.err) ? chalk.green : chalk.red;
    pr = pr(padding(getPriorityName(priority), 7));
    date = chalk.gray(strftime('%H:%M:%S'));
    file = stack && util.format('[%s:%s]', stack.filename, stack.line)
    
    out.push(pr);
    out.push(date);
    if (stack) {
        out.push(file);
    }
    out.push(message);
    
    return out.join(' ');
}

function syslogFormat(priority, message, stack) {
    var out = [];
    if (stack) {
        out.push(util.format('[%s:%s]', stack.filename, stack.line));
    }
    out.push(message);
    
    return out.join(' ');
}

function getPriorityName(priority) {
    for (var key in constants.priority) {
        if (constants.priority[key] == priority) {
            return key;
        }
    }
    return null;
}

function padding(str, len) {
    return Array(len - str.length + 1).join(' ') + str;
}
