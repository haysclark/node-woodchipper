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
        this.timeout = 6000;
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

    it('should parse data', function() {
        // one parsing test to rule them all... needs extra time.
        this.timeout = 5000;

        var data = treeherderData.concat();

        var spy = sinon.spy();
        parse(data, spy);

        expect(spy.calledOnce).to.be.true;
        var result = spy.getCall(0).args[1];
        expect(result).to.be.a('string');
        expect(result).to.equal(junitData);
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
