'use strict';

var woodchipper = require('../woodchipper');
var DEFAULT_TIMEOUT = 100;

function validateArgs(argv) {
	return (argv._.length === 1);
}

function handleStdin(dur, callback) {
	var data;
	var timeout = setTimeout(function () {
		if (data) {
			// data incoming, waiting for stdin end
			return;
		} else {
			callback('timed out after ' + dur);
		}
	}, dur);

	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function (chunk) {
		data = (!!data) ? data : '';
		data += chunk;
	});
	process.stdin.on('end', function () {
		clearTimeout(timeout);
		callback(null, data);
	});
	process.stdin.on('error', callback);
}

function validateTimeout(timeout, callback) {
	if (isNaN(timeout)) {
		callback(timeout + 'is an invalid timeout', false);
	} else if (timeout <= 0) {
		callback('invalid timeout, value must be greater than 0', false);
	} else {
		callback(null, true);
	}
}

function routeToParse(data, argv, callback) {
	// --format or -f
	argv.format = argv.format || argv.f;
	woodchipper.parse(data, argv.format, callback);
}

/**
 * routes argv or stdin input and format to parser
 *
 * @param argv
 * @param callback
 */
module.exports = function (argv, callback) {
	// handle command arguments and piped data via stdin
	if (validateArgs(argv)) {
		routeToParse(argv._[0], argv, callback);
	} else if (argv._.length <= 1) {
		// --timeout or -t
		argv.timeout = argv.timeout || argv.t;
		var timeout = (argv.timeout) ? argv.timeout : DEFAULT_TIMEOUT;
		validateTimeout(timeout, function (err, data) { /* jshint unused: false */
			if (err) {
				callback(err);
				return;
			}
			handleStdin(timeout, function (err, data) {
				if (err) {
					callback('too few arguments');
				}
				routeToParse(data, argv, callback);
			});
		});
	} else {
		callback('too many arguments');
	}
};
