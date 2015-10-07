var woodchipper = require('../../lib/woodchipper');

/**
 * Specification: $ woodchipper <data>
 */
describe('woodchipper', function() {
    it('module should not be null', function() {
        expect(woodchipper).to.be.ok;
    });

    it('module should have parse method', function() {
        expect(woodchipper.parse).to.be.ok;
    });

    it('module should have process method', function() {
        expect(woodchipper.process).to.be.ok;
    });
});
