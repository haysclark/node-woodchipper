var parse = require('../../../lib/woodchipper/parser/junit'),
    fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');

/**
 * Specification: $ woodchipper <data>
 */
describe('woodchipper/parse', function() {
    var treeherderData; // treeherder.txt, sample treeherder output
    var junitData; // junit.xml, expected junit.xml result
    before(function(done) {
        this.timeout(6000);
        loadTestData(done);
    });

    beforeEach(function() {
        sinon.stub(process, 'exit');
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    afterEach(function() {
        process.exit.restore();
        console.log.restore();
        console.error.restore();
    });

    it('module should not be null', function() {
        expect(treeherderData).to.be.ok;
    });

    it('should parse data', function(done) {
        // one parsing test to rule them all... needs extra time.
        this.timeout(15000);
       setTimeout(done, 9000);
        var data = treeherderData.concat();

        parse(data, function(err, data) {
            if(err) {
                throw new Error("parse test should not fail");
            }
            expect(data).to.be.a('string');
            expect(data).to.equal(junitData);
            done();
        });
    });

    /**
     * Loads the testing data
     * @param done
     */
    function loadTestData(done) {
        function check(){
            if(!!treeherderData && !!junitData) {
                done();
            }
        }
        
        var basepath = path.join(__dirname, '..', '..');
        var inputpath = path.join(basepath, 'treeherder.txt');
        fs.readFile(inputpath, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            treeherderData = data;
            check();
        });

        var outputpath = path.join(basepath, 'junit.xml');
        fs.readFile(outputpath, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            junitData = data;
            check();
        });
    }
});
