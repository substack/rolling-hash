var rolling = require('../');
var fs = require('fs');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: {
        e: 'encoding',
        a: 'algorithm',
        s: 'size'
    },
    default: {
        encoding: 'hex',
        algorithm: 'md5',
        size: 1024 * 16
    }
});
if (argv.h || argv.help) {
    fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
    return;
}

var input = argv._[0] && argv._[0] !== '-'
    ? fs.createReadStream(argv._[0])
    : process.stdin
;

var rh = rolling(argv);
rh.on('hash', function (h) {
    console.log(h);
});
input.pipe(rh);
