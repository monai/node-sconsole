var constants = require('./constants');

module.exports = {
    log: log
};

function log(priority, message) {
    var write = (priority > constants.priority.err) ? console.log : console.error;
    write(message);
}
