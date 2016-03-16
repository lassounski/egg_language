'use strict';

function skipSpace(string) {
    var first = string.search(/\S/);
    if (first === -1)
        return "";
    return string.slice(first);
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
    program = skipSpace(program);
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
    program = skipSpace(program);
    if (program[0] !== "(")
        return {expr: expr, rest: program};
    
    program = skipSpace(program.slice(1));
    expr = {type: 'apply', operator: expr, args: []};
    while(program[0] !== ')'){
        var arg = parseExpression(program);

        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if(program[0] === ',')
            program = skipSpace(program.slice(1));
        else if(program[0] !== ')')
            throw new SyntaxError("Expected ',' or ')'");
    }
    return parseApply(expr, program.slice(1));
}

function parse(program){
    var result = parseExpression(program);
    if(skipSpace(result.rest).length > 0)
        throw new SyntaxError('Unexpected text after program');
    return result.expr;
}

exports.export = {
    skipSpace: skipSpace,
    getNumber: getNumber,
    getWord: getWord,
    getString: getString,
    parseExpression: parseExpression,
    parseApply: parseApply,
    parse: parse
};