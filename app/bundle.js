(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';
    
    var env = Object.create(null);
    
    module.exports = env;
    
    env['true'] = true;
    env['false'] = false;
    
    ['+','==','-','*','/','<','>'].forEach(function(operator){
       env[operator] = new Function('a,b',"return a" + operator + "b"); 
    });
    
}());
},{}],2:[function(require,module,exports){
(function () {
    'use strict';

    var specialForms = require('./specialForms.js').specialForms;

    module.exports.evaluate = function (expr, env) {
        console.log('Evaluating:'+JSON.stringify(expr));
        switch (expr.type) {
            case 'value':
                return expr.value;

            case 'word':
                if (env[expr.name] !== undefined)
                    return env[expr.name];
                throw new ReferenceError('Undefined variable: ' + expr.name);

            case 'apply':
                if (expr.operator.type === 'word' && expr.operator.name in specialForms) {
                    return specialForms[expr.operator.name](expr.args, env);
                }

                var operator = module.exports.evaluate(expr.operator, env);
                return operator.apply(null, expr.args.map(function (arg) {
                    return  module.exports.evaluate(arg, env);
                }));
        }
    };
}());
},{"./specialForms.js":6}],3:[function(require,module,exports){
(function () {
    "use strict";

    var main = require('./main');

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

    main.run(program);

}());
},{"./main":4}],4:[function(require,module,exports){
(function(){
    "use strict";
    
    var evaluator = require('./evaluator.js');
    var parser = require('./parser.js');
    var env = require('./environment.js');
    
    module.exports.run = function(program){
        var oneStringProgram = Array.prototype.slice.call(program,0).join('\n');
        console.log('Env: '+JSON.stringify(env));
        console.log('Initial program:\n '+oneStringProgram+'\n\n');
        return evaluator.evaluate(parser.parse(oneStringProgram),env);
    };
}());
},{"./environment.js":1,"./evaluator.js":2,"./parser.js":5}],5:[function(require,module,exports){
'use strict';

module.exports = {
    skipSpace: skipSpace,
    getNumber: getNumber,
    getWord: getWord,
    getString: getString,
    parseExpression: parseExpression,
    parseApply: parseApply,
    parse: parse
};

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

},{}],6:[function(require,module,exports){
(function () {
    'use strict';

    var specialForms = Object.create(null);

    module.exports = {
        specialForms: specialForms,
        getArgumentNames: getArgumentNames
    };

    var evaluator = require('./evaluator.js');

    specialForms["if"] = function (args, env) {
        if (args.length !== 3)
            throw new SyntaxError('Wrong number of arguments to IF');

        if (evaluator.evaluate(args[0], env) === true) {
            return evaluator.evaluate(args[1], env);
        } else {
            return evaluator.evaluate(args[2], env);
        }
    };

    specialForms["while"] = function (args, env) {
        var index = 0;
        
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to WHILE');
        while (evaluator.evaluate(args[0], env) === true) {
            console.log('WHILE index:'+index++)
            return evaluator.evaluate(args[1], env);
        }
        console.log('WHILE finished');
        return false;
    };

    specialForms['define'] = function (args, env) {
        console.log('Defining: ' + JSON.stringify(args));
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to DEFINE');
        if (args[0].type === 'word') {
            var value = evaluator.evaluate(args[1], env);
            console.log('Adding to environment:' + args[0].name + '=' + value);
            env[args[0].name] = value;
            console.log('Environment is:' + JSON.stringify(env));
        } else
            throw new SyntaxError('First argument should be of type word in DEFINE');
    };

    specialForms['do'] = function (args, env) {
        var value = false;
        console.log('Do:' + JSON.stringify(args));
        args.forEach(function (arg) {
            value = evaluator.evaluate(arg, env);
        });
        return value;
    };

    specialForms['print'] = function (args, env) {
        if (args.length !== 1)
            throw new SyntaxError('Wrong number of arguments to PRINT');
        if (args[0].type === 'word' && env[args[0].name])
            return env[args[0].name];
        else if (['value', 'apply'].indexOf(args[0].type) > -1)
            return evaluator.evaluate(args[0], env);
        else
            throw new SyntaxError('Wrong type of argument passed to PRINT')
    };

    specialForms['fun'] = function (args, env) {
        if (!args.length)
            throw new SyntaxError('Should pass at least one argument to FUN');

        var argumentNames = getArgumentNames(args.splice(0, args.length - 1));
        var functionBody = args[args.length - 1];

        return function () {
            if (arguments.length !== argumentNames.length)
                throw new TypeError('The number of arguments passed to the function differs form its declaration:\n' + 'Expected: ' + argumentNames.length + ' Passed: ' + arguments.length);
            var localEnv = Object.create(env);

            for (var index = 0; index < argumentNames.length; index++) {
                localEnv[argumentNames[index]] = arguments[index];
            }
            return evaluator.evaluate(functionBody, localEnv);
        };
    };

    specialForms['array'] = function (args, env) {
        var elements = args.map(function (arg) {
            if (arg.type !== 'value')
                throw new SyntaxError('An array can accept only numbers');
            return evaluator.evaluate(arg, env);
        });
        return elements;
    };

    specialForms['length'] = function (args, env) {
        if (args.length !== 1)
            throw new SyntaxError('LENGTH should receive only one argument');
        var array = evaluator.evaluate(args[0], env);
        console.log('array '+ args[0].name +' LENGTH:'+array.length);
        return array.length;
    };

    specialForms['element'] = function (args, env) {
        if (args.length !== 2)
            throw new SyntaxError('ELEMENT should receive only two arguments');
        if (args[0].type !== 'word')
            throw new TypeError('The first argument to ELEMENT should be of type word');
        var array = evaluator.evaluate(args[0], env);
        var position = evaluator.evaluate(args[1], env);

        return array[position];
    };

    function getArgumentNames(args) {
        return args.map(function (argument) {
            if (argument.type !== 'word')
                throw new SyntaxError('The argument to the FUN should be of type word. ' + JSON.stringify(argument));
            return argument.name;
        });
    }
})();
},{"./evaluator.js":2}]},{},[3]);
