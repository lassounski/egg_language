(function(){
    "use strict";
    
    var evaluator = require('./evaluator.js');
    var parser = require('./parser.js');
    var env = require('./environment.js');
    
    module.exports.run = function(){
        var oneStringProgram = Array.prototype.slice.call(arguments,0).join('\n');
        console.log('Env: '+JSON.stringify(env));
        return evaluator.evaluate(parser.parse(oneStringProgram),env);
    };
}());