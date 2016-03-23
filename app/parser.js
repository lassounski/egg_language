'use strict';

module.exports = {
    skipSpaceAndComments: skipSpaceAndComments,
    getNumber: getNumber,
    getWord: getWord,
    getString: getString,
    parseExpression: parseExpression,
    parseApply: parseApply,
    parse: parse
};

function skipSpaceAndComments(string) {
    var noComments = string.replace(/\s*#.*\n/,"");
    return noComments.replace(/\s*/,"");
}

function getString(text) {
    return /^".*"/.exec(text);
}

function getNumber(text) {
    return /^\d+\b/.exec(text);
}

function getWord(text) {
    return /^[^\s(),"]+/.exec(text);
}

function parseExpression(program) {
    program = skipSpaceAndComments(program);
    var match, expr;

    if (match = getString(program))
        expr = {type: 'value', value: match[1]};
    else if (match = getNumber(program))
        expr = {type: 'value', value: Number(match[0])};
    else if (match = getWord(program))
        expr = {type: 'word', name: match[0]};
    else {
        var error = new SyntaxError('Unexpected syntax:' + program);
        throw error;
    }
    return parseApply(expr, program.slice(match[0].length));
}

function parseApply(expr, program) {
    program = skipSpaceAndComments(program);
    if (program[0] !== "(")
        return {expr: expr, rest: program};
    
    program = skipSpaceAndComments(program.slice(1));
    expr = {type: 'apply', operator: expr, args: []};
    while(program[0] !== ')'){
        var arg = parseExpression(program);

        expr.args.push(arg.expr);
        program = skipSpaceAndComments(arg.rest);
        if(program[0] === ',')
            program = skipSpaceAndComments(program.slice(1));
        else if(program[0] !== ')')
            throw new SyntaxError("Expected ',' or ')'");
    }
    return parseApply(expr, program.slice(1));
}

function parse(program){
    var result = parseExpression(program);
    if(skipSpaceAndComments(result.rest).length > 0)
        throw new SyntaxError('Unexpected text after program');
    return result.expr;
}
