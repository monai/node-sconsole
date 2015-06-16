var constants = require('./constants');
var LOG_ERROR = constants.priority.err;

module.exports = {
    log: log
};

function log(priority, message) {
    var write = (priority > LOG_ERROR) ? console.log : console.error;
    write(message);
}
