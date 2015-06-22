var tests, pending, active, index;
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var cp = require('child_process');

var limit = require('os').cpus().length * 2;
var exitCode = 0;
var argv = process.argv;

if (argv.indexOf('--test') > 0) {
    process.on('uncaughtException', function (error) {
        console.error(error.stack);
        process.exit(1);
    });

    require('./'+ argv[argv.indexOf('--test') + 1]);
} else {
    tests = fs.readdirSync(__dirname).map(buildTest).filter(Boolean);
    active = 0;
    index = 0;
    pending = tests.length;

    console.log('\nRunning %d test files...\n', pending);

    next();
}

function next() {
    if (active < limit && pending && index < tests.length) {
        runTest(tests[index++]);

        if (++active < limit) {
            next();
        }
    }
}

function runTest(item) {
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
        var total = tests.length;
        var left = total - pending + 1;

        exitCode = code || exitCode;

        console.log('Test %d of %d: \'%s\' ... %s', left, total, item.name, code ? 'FAILED\n' : 'PASSED');
        code && console.log(errors.join('\n'));

        active--;

        if ( ! --pending) {
            console.log('\nDONE');
            process.exit(exitCode);
        }
    }
}

function indent(text) {
    return text.replace(/^/mg, '    ').replace(/^ +$/mg, '');
}

function buildTest(filename) {
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
