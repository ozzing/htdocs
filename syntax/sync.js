var fs = require('fs');

/*
//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/text.txt', 'utf8');
console.log(result);
console.log('C');
*/


console.log('A');
fs.readFile('syntax/text.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');
