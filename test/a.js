var sconsole = require('../');

sconsole = sconsole({
    'ident': 'pewpew'
});
sconsole.log(sconsole.priority.err, 'a.js');
sconsole.close();

sconsole.warning('the warning');

setTimeout(function () {
    sconsole.log(sconsole.priority.err, 'a.js');
}, 1000);
