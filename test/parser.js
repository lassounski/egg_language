var expect = require('chai').expect;
var parser = require('../app/parser.js').export;

describe('Parsing text test', function () {
    it('should remove whitespaces from the beggining of a string', function () {
        var result = parser.skipSpace('   Hey there man! Cool!  ');
        expect(result).to.be.equal('Hey there man! Cool!  ');
    });

    it('should get a string in the beginning of text', function () {
        var result = parser.getString("is there a \"string\"?");
        expect(result).to.be.equal(null);

        result = parser.getString("\"string\"?");
        expect(result[0]).to.be.equal("\"string\"");
    });

    it('should get a word in the beginning of text', function () {
        var result = parser.getWord("if(>(5,x))");
        expect(result[0]).to.be.equal("if");

        result = parser.getWord("\"string\"?");
        expect(result).to.be.null;
    });

    it('should get a number in the beginning of text', function () {
        var result = parser.getNumber("there were 4 monkeys");
        expect(result).to.be.equal(null);

        result = parser.getNumber("123a a");
        expect(result).to.be.equal(null);

        result = parser.getNumber("123)");
        expect(result[0]).to.be.equal("123");

        result = parser.getNumber("123.)");
        expect(result[0]).to.be.equal("123");

        result = parser.getNumber("123");
        expect(result[0]).to.be.equal("123");
    });
});

describe('Parse expression test', function () {
    it('should throw exception when parsing illegal string', function () {
        expect(parser.parseExpression.bind(parser, ',error')).to.throw(SyntaxError);
    });
});

describe('Parse apply test', function () {
    it('should return the expression if the first character in program is not a parenthesis', function () {
        var expr = {type: 'value', value: 15};
        var program = ",12)";
        var result = parser.parseApply(expr, program);

        expect(result.expr).to.be.equal(expr);
    });

    it('should create an expression for a program', function () {
        var expectedExpr = {
            type: 'apply',
            operator: {type: "word", name: "+"},
            args: [
                {type:'word', name:'a'}
                , {type:'value', value:10}
            ]
        };
        var returnedExpr = parser.parse('+(a,10)');
        
        expect(returnedExpr).to.deep.equal(expectedExpr);
    });
});

