var cli = require('../../lib/cli'),
    sinon = require('sinon'),
    pjson = require('../../package.json'),
    EventEmitter = require('events').EventEmitter;

/**
 * Specification: $ woodchipper [--version] [--help] [--format=<name>] <input>
 */
describe('cli/argv', function() {
    //var stdinEmitter;
    //var realStdin;
    var stdin;
    beforeEach(function() {
        //stdinEmitter = new EventEmitter;
        //process.stdin = stdinEmitter;
        stdin = require('mock-stdin').stdin();
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
        sinon.stub(process, 'exit');
    });

    afterEach(function() {
        console.log.restore();
        console.error.restore();
        process.exit.restore();
        stdin.restore();
        //process.stdin = realStdin;
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

       // process.stdin.setEncoding('utf8');
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
                stdin.send('fakedata');
            }, 50);

            setTimeout(function() {
                // fake stdin end
                stdin.end();
            }, 500);

            setTimeout(function() {
                expect(console.log.called).to.be.true;
                expect(process.exit.called).to.be.false;
                done();
            }, 600);

            var param = { _: [] };
            cli.argv(param);
        });

        it('should error if timeout value is too low', function(done) {
            setTimeout(function() {
                expect(console.error.called).to.be.true;
                expect(process.exit.called).to.be.true;
                expect(process.exit.getCall(0).args[0]).to.equal(1);
                done();
            }, 200);

            var param = { _: [], timeout: -1 };
            cli.argv(param);
        });

        it('should error if timeout is not a number', function(done) {
            setTimeout(function() {
                expect(console.error.called).to.be.true;
                expect(process.exit.called).to.be.true;
                expect(process.exit.getCall(0).args[0]).to.equal(1);
                done();
            }, 200);

            var param = { _: [], timeout: "text" };
            cli.argv(param);
        });

        it('should set parse timeout when timeout set in cli', function(done) {
            setTimeout(function() {
                // fake stdin start
                stdin.send('fakedata');
            }, 50);

            setTimeout(function() {
                // fake stdin end
                stdin.end();
            }, 700);

            setTimeout(function() {
                expect(console.log.called).to.be.true;
                expect(process.exit.called).to.be.false;
                done();
            }, 800);

            var param = { _: [], timeout: 600 };
            cli.argv(param);
        });

        it('should set timeout when t set in cli', function(done) {
            setTimeout(function() {
                // fake stdin start
                stdin.send('fakedata');
            }, 50);

            setTimeout(function() {
                // fake stdin end
                stdin.end();
            }, 700);

            setTimeout(function() {
                expect(console.log.called).to.be.true;
                expect(process.exit.called).to.be.false;
                done();
            }, 800);

            var param = { _: [], t: 600 };
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
