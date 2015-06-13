var sconsole = require('../');

sconsole = sconsole({
    'ident': 'zapzap'
});
sconsole.log(sconsole.priority.err, 'b.js');
sconsole.close();
