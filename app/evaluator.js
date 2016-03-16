(function () {
    'use strict';

    var specialForms = require('./specialForms.js');

    module.exports.evaluate = function evaluate(expr, env) {
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
        }
    };

}());