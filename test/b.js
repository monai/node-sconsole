var sconsole = require('../');

sconsole = sconsole({
    'ident': 'zapzap'
});
sconsole.log(sconsole.priority.info, 'b.js');
sconsole.close();
