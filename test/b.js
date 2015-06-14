var sconsole = require('../');

sconsole = sconsole({
    'ident': ''
});
// sconsole.log(sconsole.priority.info, 'b.js');
// sconsole.close();

var console_ = sconsole.console;

console_.dir({'ok': 'bo'}, { colors: true });
console_.dir({'ok': 'bo'}, { colors: true });
