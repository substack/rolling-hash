var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var Writable = require('readable-stream/writable.js');
var inherits = require('inherits');

module.exports = Rolling;
inherits(Rolling, Writable);

function Rolling (algo, size) {
    var self = this;
    if (!(this instanceof Rolling)) return new Rolling(algo, size);
    Writable.call(this);
    
    this.algo = algo;
    this.size = size;
    this.buffered = 0;
    this.buffers = [];
    
    this.on('finish', function () {
        if (self.buffers.length) {
            self.createHash(Buffer.concat(self.buffers));
        }
        self.buffers = null;
    });
}

Rolling.prototype._write = function (buf, enc, next) {
    if (buf.length + this.buffered < this.size) {
        this.buffers.push(buf);
        this.buffered += buf.length;
        return next();
    }
    
    if (this.buffered) {
        this.buffers.push(buf);
        buf = Buffer.concat(this.buffers);
        this.buffered = 0;
        this.buffers = [];
    }
    
    for (var i = 0; i <= buf.length - this.size; i += this.size) {
        this.createHash(buf.slice(i, i + this.size));
    }
    
    var leftOver = buf.length % this.size;
    if (leftOver) {
        this.buffers.push(buf.slice(buf.length - leftOver));
        this.buffered += leftOver;
    }
    next();
};

Rolling.prototype.createHash = function (buf) {
    var h = crypto.createHash(this.algo);
    h.write(buf);
    this.emit('hash', h.digest('hex'));
};
