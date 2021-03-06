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