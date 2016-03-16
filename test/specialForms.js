var specialForms = require('../app/specialForms.js');
var env = require('../app/environment.js').export.env;
var expect = require('chai').expect;

describe('Special forms IF test', function () {
    it('should throw an exception for an invalid number of arguments when calling if', function () {
        expect(
                function () {
                    specialForms['if'](['1', '3', '1','extra'], env);
                }
        ).to.throw(SyntaxError);
    });
    
    it('should not throw an exception for a valid number of arguments when calling if', function () {
        expect(
                function () {
                    specialForms['if'](['1', '3', '1'], env);
                }
        ).to.not.throw(SyntaxError);
    });
    
    it('should return the first parameter for a truthful expression', function () {
        expect(specialForms['if']([
            {type:'value', value:true}
            ,{type:'value', value:7}
            ,{type:'value', value:-7}
        ], env))
                .to.equal(7);
    });
    
    it('should return the second parameter for a fake expression', function () {
        expect(specialForms['if']([
            {type:'value', value:false}
            ,{type:'value', value:7}
            ,{type:'value', value:-7}
        ], env))
                .to.equal(-7);
    });
    
    it.skip('should return the first parameter if the expression is true and he is the only parameter', function () {
        expect(specialForms['if']([
            {type:'value', value:true}
            ,{type:'value', value:7}
        ], env))
                .to.equal(7);
    });
    
});

describe('Special forms WHILE test', function () {
    it('should throw an exception for an invalid number of arguments', function () {
        expect(
                function () {
                    specialForms['while'](['1', '3', '1','extra'], env);
                }
        ).to.throw(SyntaxError);
    });
    
    it('should not throw an exception for a valid number of arguments', function () {
        expect(
                function () {
                    specialForms['while'](['1', '3'], env);
                }
        ).to.not.throw(SyntaxError);
    });
    
    it('should return false when the first parameter is false', function () {
        expect(specialForms['while']([
            {type:'value', value:false}
            ,{type:'value', value:7}
        ], env))
                .to.equal(false);
    });
    
    it.skip('should return a value for a true expression', function () {
        expect(specialForms['while']([
            {type:'value', value:true}
            ,{type:'value', value:7}
        ], env))
                .to.equal(7);
    });
//    
//    it.skip('should return the first parameter if the expression is true and he is the only parameter', function () {
//        expect(specialForms['if']([
//            {type:'value', value:true}
//            ,{type:'value', value:7}
//        ], env))
//                .to.equal(7);
//    });
    
});