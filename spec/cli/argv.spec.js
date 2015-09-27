var cli = require('../../lib/cli'),
    sinon = require('sinon'),
    pjson = require('../../package.json'),
    EventEmitter = require('events').EventEmitter;

/**
 * Specification: $ woodchipper [--version] [--help] [--format=<name>] <input>
 */
describe('cli/argv', function() {
    var stdinEmitter;
    beforeEach(function() {
        sinon.stub(process, 'exit');
        sinon.stub(process, 'openStdin');
        stdinEmitter = new EventEmitter;
        process.openStdin.onFirstCall().returns(stdinEmitter)
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    afterEach(function() {
        process.exit.restore();
        process.openStdin.restore();
        console.log.restore();
        console.error.restore();
    });

    describe('#Help', function() {
        it('should console.log help text when -h flag used', function() {
            var param = { _: [], h: true };
            cli.argv(param);

            expect(console.log.called).to.be.true;
            expect(console.log.getCall(0).args[0]).to.contain('woodchipper');
        });

        it('should console.log help text when --help flag used', function() {
            var param = { _: [], help: true };
            cli.argv(param);

            expect(console.log.called).to.be.true;
            expect(console.log.getCall(0).args[0]).to.contain('woodchipper');
        });
    });

    describe('#Version', function() {
        it('should console.log version text when -v flag used', function() {
            var param = { _: [''], v: true };
            cli.argv(param);

            expect(console.log.called).to.be.true;
            expect(console.log.getCall(0).args[0]).to.contain(pjson.version);
        });

        it('should console.log version text when --version flag used', function() {
            var param = { _: [''], version: true };
            cli.argv(param);

            expect(console.log.called).to.be.true;
            expect(console.log.getCall(0).args[0]).to.contain(pjson.version);
        });
    });

    describe('#Parse', function() {
        it('should console.log data when data provided', function() {
            var param = { _: ['my data'] };
            cli.argv(param);

            expect(console.log.called).to.be.true;
        });

        it('should console.error message when too few args with no data being pipped', function(done) {
            setTimeout(function() {
                expect(console.error.called).to.be.true;
                expect(process.exit.called).to.be.true;
                expect(process.exit.getCall(0).args[0]).to.equal(1);
                done();
            }, 200);

            var param = { _: [] };
            cli.argv(param);
        });

        it('should console.error message when too few args with no data being pipped', function(done) {
            setTimeout(function() {
                // fake stdin start
                stdinEmitter.emit('data', 'fakedata');
            }, 50);

            setTimeout(function() {
                // fake stdin end
                stdinEmitter.emit('end');
            }, 500);

            setTimeout(function() {
                expect(console.log.called).to.be.true;
                expect(process.exit.called).to.be.false;
                done();
            }, 600);

            var param = { _: [] };
            cli.argv(param);
        });

        it('should console.error message when too many args provides', function() {
            var param = { _: ['one', 'too many'] };
            cli.argv(param);

            expect(console.error.called).to.be.true;
            expect(process.exit.getCall(0).args[0]).to.equal(1);
        });

        it('should console.log output when format is known formatter', function() {
            var param = { _: ['one'],  format: 'junit' };
            cli.argv(param);

            expect(console.log.called).to.be.true;
        });

        it('should console.error message when f is unknown formatter', function() {
            var param = { _: ['one'],  f: 'france' };
            cli.argv(param);

            expect(console.error.called).to.be.true;
            expect(process.exit.getCall(0).args[0]).to.equal(1);
        });

        it('should console.error message when format is unknown formatter', function() {
            var param = { _: ['one'],  format: 'france' };
            cli.argv(param);

            expect(console.error.called).to.be.true;
            expect(process.exit.getCall(0).args[0]).to.equal(1);
        });
    });
});
