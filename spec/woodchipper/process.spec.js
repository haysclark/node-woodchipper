var process = require('../../lib/woodchipper/process');

/**
 * Specification: $ woodchipper.process()
 */
describe('woodchipper.process', function() {
    it('module should not be null', function() {
        expect(process).to.be.ok;
    });
});