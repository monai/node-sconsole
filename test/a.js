var sconsole = require('..');

sconsole.setup({
    upto: sconsole.priority.info,
    ident: 'my app',
    stdio: true,
    syslog: {
        upto: sconsole.priority.error
    }
});

setTimeout(function () {
    eval("eval(\"sconsole.log('log')\")");
    sconsole.warning('warning');
    sconsole.error('error');
    sconsole.notice('notice');
}, 1);
