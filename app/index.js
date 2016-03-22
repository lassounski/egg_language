(function () {
    "use strict";

    var main = require('./main');

    var program = [
        'do(',
        '   define(i,0),',
        '   define(sum,0),',
        '   define(vetor, array(1,2,3)),',
        '   while(<(i, length(vetor)),',
        '       do(',
        '       define(sum, +(sum, element(vetor, i))),',
        '       define(i, +(i, 1)),',
        '       )',
        '   ),',
        '   print(sum)',
        ')'
    ];

    main.run(program);

}());