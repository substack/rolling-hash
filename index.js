var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var Writable = require('readable-stream/writable.js');
var inherits = require('inherits');

module.exports = Rolling;
inherits(Rolling, Writable);

function Rolling (algo, size) {
    if (!(this instanceof Rolling)) return new Rolling(algo, size);
    Writable.call(this);
    
    this.algo = algo;
    this.size = size;
    this.offset = 0;
    this.buffers = [];
    
    this.on('end', function () {
        console.error('todo end');
    });
}

Rolling.prototype._write = function (buf, enc, next) {
    var n = this.size, i = this.offset;
    
    if (i % n && (i % n + buf.length < n)) {
        this.buffers.push(buf);
        return;
    }
    else if (i % n) {
        this.buffers.push(buf.slice(0, i % n));
        
        this.createHash(Buffer.concat(this.buffers));
        this.buffers = [];
        
        buf = buf.slice(i % n);
        
        this.offset = 0;
    }
    
    for (var j = 0; j < buf.length; j += n) {
        this.createHash(buf.slice(j, j + n));
    }
    if (buf.length % n) {
        var o = buf.slice(buf.length - buf.length % n);
        this.buffers.push(buf.slice(buf.length - buf.length % n));
        this.offset += buf.length % n;
    }
    
    next();
};

Rolling.prototype.createHash = function (buf) {
    var h = crypto.createHash(this.algo);
    h.write(buf);
    this.emit('hash', h.digest('hex'));
};
