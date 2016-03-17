(function(){
    'use strict';
    
    var env = Object.create(null);
    
    module.exports = env;
    
    env['true'] = true;
    env['false'] = false;
    
    ['+','=='].forEach(function(operator){
       env[operator] = new Function('a,b',"return a" + operator + "b"); 
    });
    
}());