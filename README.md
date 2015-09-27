Woodchipper [![Build Status](https://travis-ci.org/haysclark/woodchipper.svg)](https://travis-ci.org/haysclark/woodchipper)[![Coverage Status](https://coveralls.io/repos/haysclark/woodchipper/badge.svg?branch=develop&service=github)](https://coveralls.io/github/haysclark/woodchipper?branch=develop)
===========

A simple module and CLI utility that converts [Treeherder](https://wiki.mozilla.org/Auto-tools/Projects/Treeherder) (the successor to [TBPL](https://wiki.mozilla.org/Sheriffing/TBPL)) output to [JUnit](http://junit.org/) xml.

## Installation

    npm install woodchipper -g

## Usage

    woodchipper [--version] [--help] [--format=<name>] <input>

## Tests

    npm test
    npm run coverage

## Development

    npm install
    npm link
    woodchipper

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.9.0 beta release
* 0.8.9 alpha release