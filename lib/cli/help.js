var path = require('path'),
    fs = require('fs');

/**
 * returns help information for topc
 *
 * @param topic
 * @param callback
 */
module.exports = function(topic, callback) {
    if(topic == null) {
        topic = 'about';
    }
    findHelpTopic(topic, callback);
};

function findHelpTopic(topic, callback) {
    // filename format: help.topic.txt
    var filepath = [topic];
    filepath.push('txt');
    filepath = filepath.join('.');

    // full doc file path
    var basepath = path.join(__dirname, '..', '..', 'doc', 'cli');
    filepath = path.join(basepath, filepath);

    // get help info
    var data = fs.readFileSync(filepath, 'utf8');
    callback(null, data);
}