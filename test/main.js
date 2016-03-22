var expect = require('chai').expect;
var main = require('../app/main.js');
var env = require('../app/environment');

describe('Main runner test', function () {
    it('should declare two variables and sum them', function () {
        var program = [
            'do(define(x,1),',
            '   define(y,6),',
            '   +(x,y)',
            ')'];
        expect(main.run(program)).to.equal(7);
    });

    it('should count a number in a while loop', function () {
        var program = [
            'do(',
            '   define(counter,1),',
            '   define(return,1),',
            '   while(',
            '       <(counter,6),',
            '       do(',
            '           define(counter,+(counter,1))',
            '       ),',
            '    ),',
            '   print(counter)',
            ')'];
        expect(main.run(program)).to.equal(6);
    });

    it('should count another number in a while loop', function () {
        var program = [
            "do(define(total, 0),",
            "   define(count, 1),",
            "   while(<(count, 11),",
            "         do(define(total, +(total, count)),",
            "            define(count, +(count, 1)))),",
            "   print(total))"];
        expect(main.run(program)).to.equal(55);
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

    it('should define an array', function () {
        var program = [
            'do(',
            '   define(',
            '   vetor,array(1,2,3)',
            '   ),',
            '   print(vetor)',
            ')'
        ];
        expect(main.run(program, env)).to.deep.equal([1, 2, 3]);
    });

    it('should run a program with several array operations', function () {
        var program = [
            'do(',
            '   define(i,0),',
            '   define(sum,0),',
            '   define(vetor, array(1,2,3)),',
            '   while(<(i, length(vetor)),',
            '       do(',
            '       define(sum, +(sum, element(vetor, i))),',
            '       define(i, +(i, 1)),',
            '       )',
            '   ),',
            '   print(sum)',
            ')'
        ];
        expect(main.run(program, env)).to.deep.equal(6);
                
        program = [
            "do(define(sumFunc, fun(array,",
            "     do(define(i, 0),",
            "        define(sum, 0),",
            "        while(<(i, length(array)),",
            "          do(define(sum, +(sum, element(array, i))),",
            "             define(i, +(i, 1)))),",
            "        sum))),",
            "   print(sumFunc(array(1, 2, 3))))"
        ];        
        expect(main.run(program, env)).to.deep.equal(6);
    });

    it('should execute a closure function', function() {
        program = [
            "do(",
            "     define(f,",
            "       fun(a,",
            "           fun(b,",
            "               +(a,b)",
            "           )",
            "       )",
            "     ),",
            "     print(f(1)(6))",
            ")"
        ];        
        expect(main.run(program, env)).to.deep.equal(7);
    });

});
