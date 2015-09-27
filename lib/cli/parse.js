var woodchipper = require('../woodchipper');

var TIMEOUT = 100;

/**
 * routes argv or stdin input and format to parser
 *
 * @param argv
 * @param callback
 */
module.exports = function(argv, callback) {
    // handle command arguments and piped data via stdin
    if(validateArgs(argv)) {
        routeToParse(argv._[0], argv, callback);
    } else if(argv._.length <= 1) {
        handleStdin(TIMEOUT, function (err, data) {
            if(err) {
                callback('too few arguments');
            }
            routeToParse(data, argv, callback);
        });
    } else {
        callback('too many arguments');
    }
};

function validateArgs(argv) {
    return (argv._.length == 1);
}

function handleStdin(dur, callback) {
    var stdin = process.openStdin();
    var timeout = setTimeout(function() {
        if(data) {
            // data incoming, waiting for stdin end
            return;
        } else {
            callback('timed out after ' + dur);
        }
    }, dur);

    var data;
    stdin.on('data', function(chunk) {
        data = (!!data) ? data : '';
        data += chunk;
    });
    stdin.on('end', function() {
        clearTimeout(timeout);
        callback(null, data);
    });
}

function routeToParse(data, argv, callback) {
    // --format or -f
    argv.format = argv.format || argv.f;
    woodchipper.parse(data, argv.format, callback);
}
