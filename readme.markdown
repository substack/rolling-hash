# rolling-hash

compute rolling hashes

[![build status](https://secure.travis-ci.org/substack/rolling-hash.png)](http://travis-ci.org/substack/rolling-hash)

# example

every 8kb, emit an md5 hash:

``` js
var rolling = require('rolling-hash');
var fs = require('fs');
var file = process.argv[2];

var rh = rolling('md5', 1024 * 8);
rh.on('hash', function (h) {
    console.log(h.toString('hex'));
});
fs.createReadStream(file).pipe(rh);
```

output:

```sh
$ node example/roll.js ~/media/vector/browserify.svg 
6ec02fc2cbed94a6880f96f3b612f185
30f47708feab6543bb6eb20df734554b
e38f209cc5889c995b0040671cff722f
5fa9a0ddd728633710bc76f55073417e
fb78a6057031063b490b547658da90b3
3c9d4359900dd8d38cc20624b25e0993
b0b4be62211604fea64ef1c6665060c6
29ef502933bbeba6fc067f3a676c51c8
0b165a397b709a0ad4ba1cc50e739e6a
699cbcc58ca7e875c3acc177e98254ca
7d846fe3b83efe09846b22c42205aeec
```

# methods

``` js
var rolling = require('rolling-hash')
```

## var rh = rolling(algorithm, opts)

Create a rolling hash writable stream `rh` given a hashing `algorithm`.

If `algorithm` is a string, the names from `crypto.createHash()` will be used
and you can optionally set the kind of encoding to get back with
`opts.encoding`, default: `'buffer'`.

Otherwise `algorithm(buf)` should be a function that returns the hash of the
supplied buffer `buf`.

`opts` should have an `opts.size` that defines the number of bytes between
starting a new hash.

If `opts` is a number, use it as the `opts.size`.

# events

## rh.on('hash', function (hash) {})

This event fires with `hash`, the result of the algorithm function.

# usage

```sh
usage: rolling-hash FILE OPTIONS

OPTIONS are:

  -s SIZE, --size SIZE       Print a hash every SIZE bytes.
  -a ALGO, --algorithm ALGO  Use ALGO as the hash algorithm. Default: md5
  -e ENC, --encoding ENC     Hash encoding to use. Default: hex

Use "-" as FILE to read from stdin.
```

# install

With [npm](https://npmjs.org), to get the library do:

```sh
npm install rolling-hash
```

and to get the `rolling-hash` command do:

```sh
npm install -g rolling-hash
```

# license

MIT
