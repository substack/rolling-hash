var rolling = require('../');
var fs = require('fs');
var file = process.argv[2];

var rh = rolling('md5', 1024 * 8);
rh.on('hash', function (h) {
    console.log(h.toString('hex'));
});
fs.createReadStream(file).pipe(rh);
