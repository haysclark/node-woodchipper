'use strict';

function getNames(data) {
	var names = [];
	var re = /TEST-START.+/g;
	var m;
	while ((m = re.exec(data)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		var name = m[0].split(' | ')[1];
		names.push(name);
	}
	return names;
}

function getTestSuiteName(name) {
	return name.split(' ')[0];
}

function getMatches(data, name, type) {
	var matches = [];
	var lines = data.split('\n');
	var re = new RegExp('(?=.*TEST-' + type + ')(?=.*' + escapeRegExp(name) + ')', 'g');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (re.test(line)) {
			//console.log('---' + type + '--- ' + line);
			matches.push(line);
		}
	}
	return matches;
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
		.replace(/([ ])/g, '.');
}

function getClassName(name) {
	return name.split(' ').slice(1).join(' ');
}

function formatPasses(name, passes) {
	var xml = '';
	passes.forEach(function (pass) {
		xml += '\t\t<testcase classname="' + getClassName(name) + '" name="' + getTestCaseName(pass) + '" time="0.0" />\n';
	});
	return xml;
}

function getTestCaseName(pass) {
	return pass.split(' | ')[2];
}

function formatFailures(name, failures) {
	var xml = '';
	failures.forEach(function (failure) {
		xml += '\t\t<testcase classname="' + getClassName(name) + '" name="' + getTestCaseName(failure) + '" time="0.0">\n';
		xml += '\t\t\t<failure type="' + getFailureType(failure) + '">' + failure.split(' | ')[2] + '\n';
		xml += '\t\t\t</failure>\n';
		xml += '\t\t</testcase>\n';
	});
	return xml;
}

function getFailureType(failure) { /* jshint unused: false */
	return 'Failure'; // treeherder does not seem to have this information
}

function formatErrors(name, errors) {
	var xml = '';
	errors.forEach(function (error) {
		xml += '\t\t<testcase classname="' + getClassName(name) + '" name="' + getTestCaseName(error) + '" time="0.0">\n';
		xml += '\t\t\t<error type="' + getErrorType(error) + '">' + error.split(' | ')[2] + '\n';
		xml += '\t\t</error>\n';
		xml += '\t</testcase>\n';
	});
	return xml;
}

function getErrorType(error) { /* jshint unused: false */
	return 'Error'; // can not create errors in JPM that don't halt
}

/**
 * Treeherder to JUnit XML parser
 *
 * @param {String} data to parse project.
 * @param {Function} callback fired afterwards.
 */
module.exports = function (data, callback) {
	var totalErrors = 0,
		totalFailures = 0,
		totalTests = 0;

	var xml = '';
	var names = getNames(data);
	names.forEach(function (name) {
		xml += '\t<testsuite name="' + getTestSuiteName(name) + '"';
		var passes = getMatches(data, name, 'PASS');
		var failures = getMatches(data, name, 'UNEXPECTED-FAIL');
		var errors = getMatches(data, name, 'ERROR');
		var total = passes.length + failures.length + errors.length;
		xml += ' tests="' + total + '"';
		xml += ' failures="' + failures.length + '"';
		xml += ' errors="' + errors.length + '"';
		xml += '>\n';
		xml += formatPasses(name, passes);
		xml += formatFailures(name, failures);
		xml += formatErrors(name, errors);
		xml += '\t</testsuite>\n';

		totalErrors += errors.length;
		totalFailures += failures.length;
		totalTests += total;
	});
	xml = '<testsuites errors="' + totalErrors + '" failures="' + totalFailures + '" name="tests" tests="' + totalTests + '" time="0.0">\n' + xml;
	xml += '</testsuites>';
	xml = '<?xml version="1.0" encoding="UTF-8" ?>\n' + xml;
	callback(null, xml);
};
