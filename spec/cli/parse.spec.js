var cli = require('../../lib/cli'),
    woodchipper = require('../../lib/woodchipper'),
    sinon = require('sinon');

describe('cli/parse', function() {
    beforeEach(function() {
        sinon.stub(process, 'exit');
        sinon.stub(console, 'log');
        sinon.stub(console, 'warn');
        sinon.stub(console, 'error');
        sinon.spy(woodchipper, 'parse');
    });

    afterEach(function() {
        process.exit.restore();
        console.log.restore();
        console.warn.restore();
        console.error.restore();
        woodchipper.parse.restore();
    });

    it('should error when too few arguments', function(done) {
        //setTimeout(function() {
         //   expect(process.exit.calledWith(1)).to.be.true;
            done();
        //}, 200);

        //cli.argv({ _: [] });
    });

    /**
    it('should error when too few arguments', function() {
        //expect(cli.argv({ _: ['foo', 'bar'] })).to.throw(/too few arguments/);
    });

    it('should parse data', function() {
        var expected = 'foobar data';
        cli.argv({ _: [expected] });

        expect(woodchipper.parse.getCall(0).args[0]).to.equal(expected);
    });
     **/
});