var util = require('util');
var constants = require('./constants');

var options;

module.exports = {
    setup: setup,
    log: log
};

function setup(options_) {
    options = options_;
}

function log(priority, message) {
    var write;
    
    write = (priority > constants.priority.err) ? console.log : console.error;
    message = util.format('[%s] %s', options.ident, message);
    
    write(message);
}
