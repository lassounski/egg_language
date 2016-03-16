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
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to DEFINE');
        if (args[0].type === 'word') {
            var value = evaluator.evaluate(args[1], env);
            env[args[0].name] = value;
        } else
            throw new SyntaxError('First argument should be of type word in DEFINE');
    };

})();