var sconsole = require('../');

sconsole = sconsole({
    'ident': 'zapzap'
});
// sconsole.log(sconsole.priority.info, 'b.js');
// sconsole.close();

var console_ = sconsole.console;

console_.dir(process);
