var expect = require('chai').expect;
var main = require('../app/main.js');

describe.only('Main runner test', function () {
    it('should declare two variables and sum them', function () {
        var program = 'do(define(x,1),define(y,6),+(x,y))';
        expect(main.run(program)).to.equal(7);
    });
});
