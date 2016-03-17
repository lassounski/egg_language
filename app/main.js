(function(){
    "use strict";
    
    var evaluator = require('./evaluator.js');
    var parser = require('./parser.js').export;
    
    module.exports.run = function(){
        var oneStringProgram = Array.prototype.slice(arguments).join('\n');
        return evaluator.evaluate(parser.parseExpression(oneStringProgram));
    };
}());