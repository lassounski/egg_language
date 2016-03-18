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
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to WHILE');
        while (evaluator.evaluate(args[0], env) === true)
            return evaluator.evaluate(args[1], env);
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
        console.log('Do:' + args);
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
        else if (['value','apply'].indexOf(args[0].type) > -1 )
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

    specialForms['array'] = function(args, env){
        var elements = args.map(function(arg){
           if(arg.type !== 'value')
               throw new SyntaxError('An array can accept only numbers');
           return evaluator.evaluate(arg, env); 
        });
        return elements;
    };

    function getArgumentNames(args) {
        return args.map(function (argument) {
            if (argument.type !== 'word')
                throw new SyntaxError('The argument to the FUN should be of type word. ' + JSON.stringify(argument));
            return argument.name;
        });
    }
})();