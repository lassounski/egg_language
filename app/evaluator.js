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