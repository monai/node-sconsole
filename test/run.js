var argv = process.argv;

if (argv.indexOf('--test') > 0) {
    child();
} else {
    main();
}

function child() {
    process.on('uncaughtException', function (error) {
        console.error(error.stack);
        process.exit(1);
    });

    require('./'+ argv[argv.indexOf('--test') + 1]);
}

function main() {
    var cp = require('child_process');
    var path = require('path');
    var list = require('fs').readdirSync(__dirname).map(build).filter(Boolean);
    var limit = require('os').cpus().length * 2;

    var total = list.length;
    var pending = total;
    var active = 0;
    var index = 0;
    var exitCode = 0;

    console.log('\nRunning %d test files...\n', total);

    next();

    function next() {
        if (active < limit && pending && index < list.length) {
            run(list[index++]);

            if (++active < limit) {
                next();
            }
        }
    }

    function run(item) {
        var errors = [];
        var child = cp.spawn('node', [ path.join(__filename), '--test', item.filename ]).on('exit', exit);

        child.stdout.on('data', stdout).setEncoding('utf8');
        child.stderr.on('data', stderr).setEncoding('utf8');

        function stdout(chunk) {
            console.log('[%s]:', item.name);
            process.stdout.write(indent(chunk));
        }

        function stderr(chunk) {
            errors.push(indent(chunk));
        }

        function exit(code) {
            // Just in case...
            setImmediate(function () {
                exit_(code);
            });
        }

        function exit_(code) {
            var left = total - pending + 1;
            var suffix = 'PASSED';

            if (code) {
                exitCode = code;
                suffix = 'FAILED\n\n'+ errors.join('\n');
            }

            console.log('Test %d of %d: \'%s\' ... %s', left, total, item.name, suffix);

            active--;

            if ( ! --pending) {
                console.log('\nDONE');
                process.exit(exitCode);
            } else {
                next();
            }
        }
    }
}

function indent(text) {
    return text.replace(/^/mg, '    ').replace(/^ +$/mg, '');
}

function build(filename) {
    if (filename.indexOf('test-') === 0 && filename.slice(-3) === '.js') {
        return {
            filename: filename,
            name: filename.slice(5, -3).replace(/(^|-)(\w)/g, toUpper)
        };
    }
}

function toUpper(match, spc, char) {
    return (spc ? ' ' : '') + char.toUpperCase();
}
