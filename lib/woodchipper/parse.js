'use strict';

var DEFAULT_PARSER = 'junit';

function findParser(format, data, callback) {
	// parser module format: ./parser/format.js
	var module = './parser/' + format;
	try {
		var parser = require(module);
		parser(data, callback);
	} catch (err) {
		callback('unknown format: ' + format);
	}
}

/**
 * Routes to data to parser.
 *
 * @param data
 * @param callback
 */
module.exports = function (data, format, callback) {
	if (format == null) {
		format = DEFAULT_PARSER;
	}

	findParser(format, data, callback);
};
