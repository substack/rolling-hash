var rolling = require('../');
var fs = require('fs');
var file = process.argv[2];

var rh = rolling('md5', 1024 * 128);
rh.on('hash', function (h) {
    console.log(h);
});
fs.createReadStream(file).pipe(rh);
