var expect = require('chai').expect;
var main = require('../app/main.js');

describe('Main runner test', function () {
    it('should declare two variables and sum them', function () {
        var program = [
            'do(define(x,1),',
            '   define(y,6),',
            '   +(x,y)',
            ')'];
        expect(main.run(program)).to.equal(7);
    });

    it.skip('should count a number in a while loop', function () {
        var program = [
            'do(define(counter,1),',
            '   define(return,1),',
            '   while(<(counter,6),',
            '       do(define(counter,+(counter,1)))),',
            '   print(counter))'];
        expect(main.run(program)).to.equal(7);
    });

    it.skip('should count another number in a while loop', function () {
        var program = [
            "do(define(total, 0),",
            "   define(count, 1),",
            "   while(<(count, 11),",
            "         do(define(total, +(total, count)),",
            "            define(count, +(count, 1)))),",
            "   print(total))"];
        expect(main.run(program)).to.equal(55);
    });


});
