(function () {
    'use strict';

    var specialForms = Object.create(null);
    module.exports = specialForms;

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
        console.log('Defining: '+JSON.stringify(args));
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to DEFINE');
        if (args[0].type === 'word') {
            var value = evaluator.evaluate(args[1], env);
            console.log('Adding to environment:'+args[0].name+'='+value);
            env[args[0].name] = value;
            console.log('Environment is:'+JSON.stringify(env));
        } else
            throw new SyntaxError('First argument should be of type word in DEFINE');
    };

    specialForms['do'] = function (args, env) {
        var value = false;
        console.log('Do:'+args);
        args.forEach(function(arg){
            value = evaluator.evaluate(arg, env);
        });
        return value;
    };

})();