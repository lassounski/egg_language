var expect = require('chai').expect;
var main = require('../app/main.js');
var env = require('../app/environment');

describe('Main runner test', function () {
    it('should declare two variables and sum them', function () {
        var program = 'do(define(x,1),define(y,6),+(x,y))';
        expect(main.run([program], env)).to.equal(7);
    });

    it('should declare a sum function and call it', function () {
        var program = [
            'do(',
            '   define(sum,',
            '       fun(x,y,+(x,y))',
            '   ),',
            '   print(sum(1,6))',
            ')'
        ];
        expect(main.run(program, env)).to.equal(7);
    });

    it('should declare a power function and call it', function () {
        var program = [
            "do(define(pow, fun(base, exp,",
            "     if(==(exp, 0),",
            "        1,",
            "        *(base, pow(base, -(exp, 1)))))),",
            "   print(pow(2, 10)))"
        ];
        expect(main.run(program, env)).to.equal(1024);
    });

    it('should define an array', function() {
        var program = [
            'do(',
            '   define(',
            '   vetor,array(1,2,3)',
            '   ),',
            '   print(vetor)',
            ')'
        ];
        expect(main.run(program, env)).to.deep.equal([1,2,3]);
    });

});
