var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var Writable = require('readable-stream/writable.js');
var inherits = require('inherits');

module.exports = Rolling;
inherits(Rolling, Writable);

function Rolling (algo, opts) {
    var self = this;
    if (!(this instanceof Rolling)) return new Rolling(algo, opts);
    Writable.call(this);
    
    if (typeof algo === 'object') {
        opts = algo;
        algo = opts.algorithm;
    }
    if (typeof opts === 'number') {
        opts = { size: opts };
    }
    if (!algo) algo = 'md5';
    if (!opts) opts = {};
    var enc = opts.encoding || 'buffer';
    
    if (typeof algo === 'string') {
        this.algo = function (buf) {
            var h = crypto.createHash(algo);
            h.write(buf);
            return h.digest(enc);
        };
    }
    else {
        this.algo = algo;
    }
    this.size = opts.size;
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
    this.emit('hash', this.algo(buf));
};
