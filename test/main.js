var expect = require('chai').expect;
var main = require('../app/main.js');
var env = require('../app/environment');

describe('Main runner test', function () {
    it('should declare two variables and sum them', function () {
        var program = 'do(define(x,1),define(y,6),+(x,y))';
        expect(main.run([program],env)).to.equal(7);
    });
    
    it('should declare a function and call it', function() {
        var program = [
            'do(',
            '   define(sum,',
            '       fun(x,y,+(x,y))',
            '   ),',
            '   print(sum(1,6))',
            ')'
        ];
        expect(main.run(program,env)).to.equal(7);
    });

});
