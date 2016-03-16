(function(){
    'use strict';
    
    var env = Object.create(null);
    
    env['true'] = true;
    env['false'] = false;
    
    exports.export = {
      env: env  
    };
}());