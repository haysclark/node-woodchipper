// process will consume a tbpl log and fire off events
// much like mocha.  Reporters will subscribe to the
// events that process dispatches.  The advantage
// of using events is we might be able to re-use
// the mocha reporters directly.

var DEFAULT_REPORTER = 'xunit';

/**
 * Routes to data to parser.
 *
 * @param data
 * @param callback
 */
module.exports = function(data, reporter, callback) {
    if(reporter == null) {
        reporter = DEFAULT_REPORTER;
    }

    locateReporter(reporter, data, callback);
};

function locateReporter(reporter, data, callback) {
    var module = './reporter/' + reporter;
    try {
        var handler = require(module);
        //handler.subscribe(this);
    } catch(err) {
        //return NOOP;
        //callback('unknown format: ' + format);
    }
}