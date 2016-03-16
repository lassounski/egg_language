(function () {
    'use strict';

    var specialForms = Object.create(null);
    module.exports = specialForms;

    var evaluator = require('./evaluator.js');

    specialForms["if"] = function (args, env) {
        if (args.length !== 3)
            throw new SyntaxError('Wrong number of arguments to if');

        if (evaluator.evaluate(args[0], env) === true) {
            return evaluator.evaluate(args[1], env);
        } else {
            return evaluator.evaluate(args[2], env);
        }
    };

    specialForms["while"] = function (args, env) {
        if (args.length !== 2)
            throw new SyntaxError('Wrong number of arguments to while');
        while (evaluator.evaluate(args[0], env) === true)
            return evaluator.evaluate(args[1], env);
        return false;
    };

})();