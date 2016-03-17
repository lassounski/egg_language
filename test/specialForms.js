var specialForms = require('../app/specialForms.js');
var env = require('../app/environment.js');
var expect = require('chai').expect;

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

    it.skip('should return a value for a true expression', function () {
        expect(specialForms['while']([
            {type: 'value', value: true}
            , {type: 'value', value: 7}
        ], env))
                .to.equal(7);
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