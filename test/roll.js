var test = require('tape');
var rolling = require('../');

test('small md5 hashes', function (t) {
    t.plan(3);
    var rh = rolling('md5', 4);
    
    rh.once('hash', function (h) {
        t.equal(h.toString('hex'), '0bee89b07a248e27c83fc3d5951213c1');
    });
    rh.write('abc\n');
    
    rh.once('hash', function (h) {
        t.equal(h.toString('hex'), '74b2848277ccb7edb89ae0bbdc3f751d');
    });
    rh.write('xy');
    rh.write('zw');
    
    rh.once('hash', function (h) {
        t.equal(h.toString('hex'), 'eb430691fe30d16070b5a144c3d3303c');
    });
    rh.end('qr');
});
