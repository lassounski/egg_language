'use strict';

var specialForms = require('../app/specialForms.js').specialForms;
var getArgumentNames = require('../app/specialForms.js').getArgumentNames;
var env = require('../app/environment.js');
var expect = require('chai').expect;
var main = require('../app/main');

describe('Special forms IF test', function () {
    it('should throw an exception for an invalid number of arguments when calling if', function () {
        expect(
                function () {
                    specialForms['if'](['1', '3', '1', 'extra'], env);
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
            {type: 'value', value: true}
            , {type: 'value', value: 7}
            , {type: 'value', value: -7}
        ], env))
                .to.equal(7);
    });

    it('should return the second parameter for a fake expression', function () {
        expect(specialForms['if']([
            {type: 'value', value: false}
            , {type: 'value', value: 7}
            , {type: 'value', value: -7}
        ], env))
                .to.equal(-7);
    });
});

describe('Special forms WHILE test', function () {
    it('should throw an exception for an invalid number of arguments', function () {
        expect(
                function () {
                    specialForms['while'](['1', '3', '1', 'extra'], env);
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
            {type: 'value', value: false}
            , {type: 'value', value: 7}
        ], env))
                .to.equal(false);
    });
});

describe('Special forms DEFINE test', function () {
    it('should throw an exception when passed the wrong number of parameters', function () {
        expect(specialForms['define'].bind(specialForms, [1, 2, 3], env)).to.throw(SyntaxError);
        expect(specialForms['define'].bind(specialForms, [], env)).to.throw(SyntaxError);
    });

    it('should\'t throw an exception when passed the correct number of parameters', function () {
        expect(specialForms['define']([{type: 'word', name: 'x'}, {type: 'value', value: 7}], env));
    });

    it('should throw an exception when the first parameter is not a word', function () {
        expect(specialForms['define'].bind(specialForms, [
            {type: 'value', value: 'x'}
            , {type: 'value', value: 7}
        ], env)).to.throw(SyntaxError);
    });

    it('should define a new variable in the environment', function () {
        specialForms['define']([
            {type: 'word', name: 'x'}
            , {type: 'value', value: 7}
        ], env);
        expect(env).to.have.property('x', 7);

        specialForms['define']([
            {type: 'word', name: 'x'}
            , {type: 'value', value: 'delaru rules'}
        ], env);
        expect(env).to.have.property('x', 'delaru rules');
    });

    it('should define an array in the environment', function () {
        specialForms['define']([
            {type: 'word', name: 'vector'}
            , {
                type: 'apply',
                operator: {
                    type: 'word',
                    name: 'array'
                },
                args: [
                    {type: 'value',
                        value: 1},
                    {type: 'value',
                        value: 2},
                    {type: 'value',
                        value: 3}
                ]
            }
        ], env);
        expect(env['vector']).to.deep.equal([1,2,3]);
    });

});

describe('Special forms DO test', function () {
    it('should execute multiple statements', function () {
        expect(specialForms['do']([
            {type: 'apply',
                operator: {
                    type: 'word',
                    name: 'define'
                },
                args: [
                    {type: 'word',
                        name: 'x'},
                    {type: 'value',
                        value: 1}
                ]},
            {type: 'apply',
                operator: {
                    type: 'word',
                    name: 'define'
                },
                args: [
                    {type: 'word',
                        name: 'y'},
                    {type: 'value',
                        value: 6}
                ]},
            {type: 'apply',
                operator: {
                    type: 'word',
                    name: '+'
                },
                args: [
                    {type: 'word',
                        name: 'y'},
                    {type: 'word',
                        name: 'x'}
                ]}

        ], env)).to.equal(7);
    });
});

describe('Special forms PRINT test', function () {
    it('should print a value type', function () {
        expect(specialForms['print']([{
                type: 'value',
                value: 7
            }], env)).to.equal(7);
    });

    it('should print a variable word type', function () {
        main.run(['define(x,7)'], env);
        expect(specialForms['print']([{
                type: 'word',
                name: 'x'
            }], env)).to.equal(7);
    });

    it('should print the outcome of a apply function', function () {
        main.run(['define(x,7)'], env);
        expect(specialForms['print']([
            {
                "type": "apply",
                "operator": {"type": "word", "name": "+"},
                "args": [
                    {"type": "value", "value": 1},
                    {"type": "value", "value": 6}
                ]
            }
        ], env)).to.equal(7);
    });

    it('should throw an Error if passed an incorrect number of parameters', function () {
        expect(specialForms['print'].bind(specialForms, [{
                type: 'value',
                value: 7
            }, {
                type: 'value',
                value: 7
            }], env)).to.throw(SyntaxError);
    });

    it('should throw an Error if passed an incorrect number of parameters', function () {
        expect(specialForms['print'].bind(specialForms, [{
                type: 'value',
                value: 7
            }, {
                type: 'value',
                value: 7
            }], env)).to.throw(SyntaxError);
    });

    it('should throw an Error if passed an wrong type of parameter', function () {
        expect(specialForms['print'].bind(specialForms, [{
                type: 'delaru',
                value: 7
            }], env)).to.throw(SyntaxError);
    });
});

describe('Special forms FUN test', function () {
    it('should throw an Error if the function does not receive a body', function () {
        expect(specialForms['fun'].bind(specialForms, [], env)).to.throw(SyntaxError);
    });

    it('should throw an Error if the arguments for the function are not words', function () {
        expect(specialForms['fun'].bind(specialForms, [
            {type: 'delaru', name: 'x'}
            , {type: 'value', value: 7}
        ], env)).to.throw(SyntaxError);
    });

    it('getArgumentNames should return the argument names', function () {
        expect(getArgumentNames([
            {type: 'word', name: 'x'}
            , {type: 'word', name: 'y'}
        ])).to.include('x', 'y');
    });

    it('should throw an erro if the number of arguments passed to the function call is different from the number of arguments declared to the function', function () {
        expect(specialForms['fun'].bind(specialForms, [
            {type: 'word', name: 'x'}
            , {type: 'word', name: 'y'},
            {type: 'apply',
                operator: {
                    type: 'word',
                    name: '+'
                },
                args: [
                    {type: 'word',
                        name: 'y'},
                    {type: 'word',
                        name: 'x'}
                ]
            }
        ], env)(1, 2, 3)).to.throw(TypeError);
    });


    it('should add two numbers as a function', function () {
        expect(specialForms['fun']([
            {type: 'word', name: 'x'}
            , {type: 'word', name: 'y'},
            {type: 'apply',
                operator: {
                    type: 'word',
                    name: '+'
                },
                args: [
                    {type: 'word',
                        name: 'y'},
                    {type: 'word',
                        name: 'x'}
                ]
            }
        ], env)(1, 6)).to.equal(7);
    });
});

describe.only('Special forms ARRAY test', function () {
    it('should allow the creation of an array', function () {
        expect(specialForms['array']([
            {type: 'value',
                value: 1},
            {type: 'value',
                value: 2},
            {type: 'value',
                value: 3}
        ], env)).to.deep.equal([1, 2, 3]);
    });

    it('should throw an error when an argument is not of type value at the creation of an array', function () {
        expect(specialForms['array'].bind(specialForms, [
            {type: 'word',
                value: 'x'}
        ], env)).to.throw(SyntaxError);
    });

    it('should allow the creation of an empty array', function () {
        expect(specialForms['array']([], env)).to.deep.equal([]);
    });

    it('should tell the length of an array', function () {
        main.run([
            'do(',
            '   define(',
            '   vetor,array(1,2,3)',
            '   ),',
            '   print(vetor)',
            ')'
        ],env);
        expect(specialForms['length']([{
            type: 'word',
            name: 'vetor'
        }],env)).to.equal(3);
    });
});
