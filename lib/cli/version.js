var pjson = require('../../package.json');

/**
 * outputs the version number
 *
 * @param argv
 * @param callback
 */
module.exports = function(argv, callback) {
	callback(null, pjson.version);
};