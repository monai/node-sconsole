var sconsole = require('..').create();

sconsole.setup({
    ident: '',
    stdio: true,
    syslog: true
});

sconsole.dir({'ok': 'bo'}, { colors: true });
sconsole.dir({'ok': 'bo'}, { colors: true });
sconsole.warn('warning');
