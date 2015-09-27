var argv = require('./argv'),
    help = require('./help'),
    version = require('./version'),
    parse = require('./parse');

/**
 * routes argv settings to cli modules
 *
 * @param argv
 */
module.exports = function(argv) {
    // --help or -h
    argv.help = argv.help || argv.h;
    if(argv.help) {
        help(null, onComplete);
        return;
    }

    // --version or -v
    argv.version = argv.version || argv.v;
    if(argv.version) {
        version(argv, onComplete);
    }

    // default parse action
    parse(argv, onComplete);
};

function onComplete(err, data) {
    if(err) {
        console.error(err);
        help('usage', logger);
        process.exit(1);
    }
    logger(null, data);
};

function logger(err, data) {
    console.log(data + '\n');
};
