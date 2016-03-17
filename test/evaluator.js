(function () {
    'use strict';

    var expect = require('chai').expect;
    var evaluator = require('../app/evaluator.js');
    var env = require('../app/environment.js');

    describe('Value evaluation test', function () {
        it('should evaluate a number value to a number', function () {
            var expr = {type:'value', value:7};
            expect(evaluator.evaluate(expr, env)).to.equal(7);
        });
        
        it('should evaluate a string value to a number', function () {
            var expr = {type:'value', value:'Kirill'};
            expect(evaluator.evaluate(expr, env)).to.equal('Kirill');
        });
        
        it('should return a word from the environment when its there', function () {
            var expr = {type:'word', name:'true'};
            expect(evaluator.evaluate(expr, env)).to.equal(true);
        });
        
        it('should throw an error when trying to evaluate an expression for a variable that does no exists in the environment', function () {
            var expr = {type:'word', name: 'inexistable'};
            expect(evaluator.evaluate.bind(evaluator, expr, env)).to.throw(ReferenceError);
        }); 
    });

    describe('Applying function test', function() {
        it('should apply an IF and get the second argument as a result', function() {
            var expr = {
                type: 'apply',
                operator: {
                    type: 'word',
                    name: 'if'
                },
                args: [
                    {type: 'value',
                    value: true},
                    {type: 'value',
                    value: 7},
                    {type: 'value',
                    value: -7}
                ]
            };
            expect(evaluator.evaluate(expr, env)).to.equal(7);
        });
        
        it('should add two numbers', function() {
            var expr = {
                type: 'apply',
                operator: {
                    type: 'word',
                    name: '+'
                },
                args: [
                    {type: 'value',
                    value: 7},
                    {type: 'value',
                    value: -7}
                ]
            };
            expect(evaluator.evaluate(expr, env)).to.equal(0);
        });
        
        it('should equal two numbers', function() {
            var expr = {
                type: 'apply',
                operator: {
                    type: 'word',
                    name: '=='
                },
                args: [
                    {type: 'value',
                    value: 7},
                    {type: 'value',
                    value: 7}
                ]
            };
            expect(evaluator.evaluate(expr, env)).to.equal(true);
        });

    });

}());