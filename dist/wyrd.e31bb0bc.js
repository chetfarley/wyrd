// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js","ieee754":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js","isarray":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/isarray/index.js","buffer":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/airtable/lib/airtable.umd.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var Buffer = require("buffer").Buffer;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;

    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }

    g.Airtable = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }

          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }

        return n[i].exports;
      }

      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }

      return o;
    }

    return r;
  }()({
    1: [function (require, module, exports) {
      "use strict"; // istanbul ignore file

      var AbortController;

      if (typeof window === 'undefined') {
        AbortController = require('abort-controller');
      } else if ('signal' in new Request('')) {
        AbortController = window.AbortController;
      } else {
        /* eslint-disable @typescript-eslint/no-var-requires */
        var polyfill = require('abortcontroller-polyfill/dist/cjs-ponyfill');
        /* eslint-enable @typescript-eslint/no-var-requires */


        AbortController = polyfill.AbortController;
      }

      module.exports = AbortController;
    }, {
      "abort-controller": 20,
      "abortcontroller-polyfill/dist/cjs-ponyfill": 19
    }],
    2: [function (require, module, exports) {
      "use strict";

      var AirtableError =
      /** @class */
      function () {
        function AirtableError(error, message, statusCode) {
          this.error = error;
          this.message = message;
          this.statusCode = statusCode;
        }

        AirtableError.prototype.toString = function () {
          return [this.message, '(', this.error, ')', this.statusCode ? "[Http code " + this.statusCode + "]" : ''].join('');
        };

        return AirtableError;
      }();

      module.exports = AirtableError;
    }, {}],
    3: [function (require, module, exports) {
      "use strict";

      var __assign = this && this.__assign || function () {
        __assign = Object.assign || function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];

            for (var p in s) {
              if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
          }

          return t;
        };

        return __assign.apply(this, arguments);
      };

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var get_1 = __importDefault(require("lodash/get"));

      var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

      var keys_1 = __importDefault(require("lodash/keys"));

      var fetch_1 = __importDefault(require("./fetch"));

      var abort_controller_1 = __importDefault(require("./abort-controller"));

      var object_to_query_param_string_1 = __importDefault(require("./object_to_query_param_string"));

      var airtable_error_1 = __importDefault(require("./airtable_error"));

      var table_1 = __importDefault(require("./table"));

      var http_headers_1 = __importDefault(require("./http_headers"));

      var run_action_1 = __importDefault(require("./run_action"));

      var package_version_1 = __importDefault(require("./package_version"));

      var exponential_backoff_with_jitter_1 = __importDefault(require("./exponential_backoff_with_jitter"));

      var userAgent = "Airtable.js/" + package_version_1.default;

      var Base =
      /** @class */
      function () {
        function Base(airtable, baseId) {
          this._airtable = airtable;
          this._id = baseId;
        }

        Base.prototype.table = function (tableName) {
          return new table_1.default(this, null, tableName);
        };

        Base.prototype.makeRequest = function (options) {
          var _this = this;

          var _a;

          if (options === void 0) {
            options = {};
          }

          var method = get_1.default(options, 'method', 'GET').toUpperCase();
          var url = this._airtable._endpointUrl + "/v" + this._airtable._apiVersionMajor + "/" + this._id + get_1.default(options, 'path', '/') + "?" + object_to_query_param_string_1.default(get_1.default(options, 'qs', {}));
          var controller = new abort_controller_1.default();

          var headers = this._getRequestHeaders(Object.assign({}, this._airtable._customHeaders, (_a = options.headers) !== null && _a !== void 0 ? _a : {}));

          var requestOptions = {
            method: method,
            headers: headers,
            signal: controller.signal
          };

          if ('body' in options && _canRequestMethodIncludeBody(method)) {
            requestOptions.body = JSON.stringify(options.body);
          }

          var timeout = setTimeout(function () {
            controller.abort();
          }, this._airtable._requestTimeout);
          return new Promise(function (resolve, reject) {
            fetch_1.default(url, requestOptions).then(function (resp) {
              clearTimeout(timeout);

              if (resp.status === 429 && !_this._airtable._noRetryIfRateLimited) {
                var numAttempts_1 = get_1.default(options, '_numAttempts', 0);
                var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts_1);
                setTimeout(function () {
                  var newOptions = __assign(__assign({}, options), {
                    _numAttempts: numAttempts_1 + 1
                  });

                  _this.makeRequest(newOptions).then(resolve).catch(reject);
                }, backoffDelayMs);
              } else {
                resp.json().then(function (body) {
                  var err = _this._checkStatusForError(resp.status, body) || _getErrorForNonObjectBody(resp.status, body);

                  if (err) {
                    reject(err);
                  } else {
                    resolve({
                      statusCode: resp.status,
                      headers: resp.headers,
                      body: body
                    });
                  }
                }).catch(function () {
                  var err = _getErrorForNonObjectBody(resp.status);

                  reject(err);
                });
              }
            }).catch(function (err) {
              clearTimeout(timeout);
              err = new airtable_error_1.default('CONNECTION_ERROR', err.message, null);
              reject(err);
            });
          });
        };
        /**
         * @deprecated This method is deprecated.
         */


        Base.prototype.runAction = function (method, path, queryParams, bodyData, callback) {
          run_action_1.default(this, method, path, queryParams, bodyData, callback, 0);
        };

        Base.prototype._getRequestHeaders = function (headers) {
          var result = new http_headers_1.default();
          result.set('Authorization', "Bearer " + this._airtable._apiKey);
          result.set('User-Agent', userAgent);
          result.set('Content-Type', 'application/json');

          for (var _i = 0, _a = keys_1.default(headers); _i < _a.length; _i++) {
            var headerKey = _a[_i];
            result.set(headerKey, headers[headerKey]);
          }

          return result.toJSON();
        };

        Base.prototype._checkStatusForError = function (statusCode, body) {
          var _a = (body !== null && body !== void 0 ? body : {
            error: {}
          }).error,
              error = _a === void 0 ? {} : _a;
          var type = error.type,
              message = error.message;

          if (statusCode === 401) {
            return new airtable_error_1.default('AUTHENTICATION_REQUIRED', 'You should provide valid api key to perform this operation', statusCode);
          } else if (statusCode === 403) {
            return new airtable_error_1.default('NOT_AUTHORIZED', 'You are not authorized to perform this operation', statusCode);
          } else if (statusCode === 404) {
            return new airtable_error_1.default('NOT_FOUND', message !== null && message !== void 0 ? message : 'Could not find what you are looking for', statusCode);
          } else if (statusCode === 413) {
            return new airtable_error_1.default('REQUEST_TOO_LARGE', 'Request body is too large', statusCode);
          } else if (statusCode === 422) {
            return new airtable_error_1.default(type !== null && type !== void 0 ? type : 'UNPROCESSABLE_ENTITY', message !== null && message !== void 0 ? message : 'The operation cannot be processed', statusCode);
          } else if (statusCode === 429) {
            return new airtable_error_1.default('TOO_MANY_REQUESTS', 'You have made too many requests in a short period of time. Please retry your request later', statusCode);
          } else if (statusCode === 500) {
            return new airtable_error_1.default('SERVER_ERROR', 'Try again. If the problem persists, contact support.', statusCode);
          } else if (statusCode === 503) {
            return new airtable_error_1.default('SERVICE_UNAVAILABLE', 'The service is temporarily unavailable. Please retry shortly.', statusCode);
          } else if (statusCode >= 400) {
            return new airtable_error_1.default(type !== null && type !== void 0 ? type : 'UNEXPECTED_ERROR', message !== null && message !== void 0 ? message : 'An unexpected error occurred', statusCode);
          } else {
            return null;
          }
        };

        Base.prototype.doCall = function (tableName) {
          return this.table(tableName);
        };

        Base.prototype.getId = function () {
          return this._id;
        };

        Base.createFunctor = function (airtable, baseId) {
          var base = new Base(airtable, baseId);

          var baseFn = function baseFn(tableName) {
            return base.doCall(tableName);
          };

          baseFn._base = base;
          baseFn.table = base.table.bind(base);
          baseFn.makeRequest = base.makeRequest.bind(base);
          baseFn.runAction = base.runAction.bind(base);
          baseFn.getId = base.getId.bind(base);
          return baseFn;
        };

        return Base;
      }();

      function _canRequestMethodIncludeBody(method) {
        return method !== 'GET' && method !== 'DELETE';
      }

      function _getErrorForNonObjectBody(statusCode, body) {
        if (isPlainObject_1.default(body)) {
          return null;
        } else {
          return new airtable_error_1.default('UNEXPECTED_ERROR', 'The response from Airtable was invalid JSON. Please try again soon.', statusCode);
        }
      }

      module.exports = Base;
    }, {
      "./abort-controller": 1,
      "./airtable_error": 2,
      "./exponential_backoff_with_jitter": 6,
      "./fetch": 7,
      "./http_headers": 9,
      "./object_to_query_param_string": 11,
      "./package_version": 12,
      "./run_action": 16,
      "./table": 17,
      "lodash/get": 77,
      "lodash/isPlainObject": 89,
      "lodash/keys": 93
    }],
    4: [function (require, module, exports) {
      "use strict";
      /**
       * Given a function fn that takes a callback as its last argument, returns
       * a new version of the function that takes the callback optionally. If
       * the function is not called with a callback for the last argument, the
       * function will return a promise instead.
       */

      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

      function callbackToPromise(fn, context, callbackArgIndex) {
        if (callbackArgIndex === void 0) {
          callbackArgIndex = void 0;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */


        return function () {
          var callArgs = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            callArgs[_i] = arguments[_i];
          }

          var thisCallbackArgIndex;

          if (callbackArgIndex === void 0) {
            // istanbul ignore next
            thisCallbackArgIndex = callArgs.length > 0 ? callArgs.length - 1 : 0;
          } else {
            thisCallbackArgIndex = callbackArgIndex;
          }

          var callbackArg = callArgs[thisCallbackArgIndex];

          if (typeof callbackArg === 'function') {
            fn.apply(context, callArgs);
            return void 0;
          } else {
            var args_1 = []; // If an explicit callbackArgIndex is set, but the function is called
            // with too few arguments, we want to push undefined onto args so that
            // our constructed callback ends up at the right index.

            var argLen = Math.max(callArgs.length, thisCallbackArgIndex);

            for (var i = 0; i < argLen; i++) {
              args_1.push(callArgs[i]);
            }

            return new Promise(function (resolve, reject) {
              args_1.push(function (err, result) {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
              fn.apply(context, args_1);
            });
          }
        };
      }

      module.exports = callbackToPromise;
    }, {}],
    5: [function (require, module, exports) {
      "use strict";

      var didWarnForDeprecation = {};
      /**
       * Convenience function for marking a function as deprecated.
       *
       * Will emit a warning the first time that function is called.
       *
       * @param fn the function to mark as deprecated.
       * @param key a unique key identifying the function.
       * @param message the warning message.
       *
       * @return a wrapped function
       */

      function deprecate(fn, key, message) {
        return function () {
          var args = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }

          if (!didWarnForDeprecation[key]) {
            didWarnForDeprecation[key] = true;
            console.warn(message);
          }

          fn.apply(this, args);
        };
      }

      module.exports = deprecate;
    }, {}],
    6: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var internal_config_json_1 = __importDefault(require("./internal_config.json")); // "Full Jitter" algorithm taken from https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/


      function exponentialBackoffWithJitter(numberOfRetries) {
        var rawBackoffTimeMs = internal_config_json_1.default.INITIAL_RETRY_DELAY_IF_RATE_LIMITED * Math.pow(2, numberOfRetries);
        var clippedBackoffTimeMs = Math.min(internal_config_json_1.default.MAX_RETRY_DELAY_IF_RATE_LIMITED, rawBackoffTimeMs);
        var jitteredBackoffTimeMs = Math.random() * clippedBackoffTimeMs;
        return jitteredBackoffTimeMs;
      }

      module.exports = exponentialBackoffWithJitter;
    }, {
      "./internal_config.json": 10
    }],
    7: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      }; // istanbul ignore file


      var node_fetch_1 = __importDefault(require("node-fetch"));

      module.exports = typeof window === 'undefined' ? node_fetch_1.default : window.fetch.bind(window);
    }, {
      "node-fetch": 20
    }],
    8: [function (require, module, exports) {
      "use strict";
      /* eslint-enable @typescript-eslint/no-explicit-any */

      function has(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      }

      module.exports = has;
    }, {}],
    9: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var keys_1 = __importDefault(require("lodash/keys"));

      var isBrowser = typeof window !== 'undefined';

      var HttpHeaders =
      /** @class */
      function () {
        function HttpHeaders() {
          this._headersByLowercasedKey = {};
        }

        HttpHeaders.prototype.set = function (headerKey, headerValue) {
          var lowercasedKey = headerKey.toLowerCase();

          if (lowercasedKey === 'x-airtable-user-agent') {
            lowercasedKey = 'user-agent';
            headerKey = 'User-Agent';
          }

          this._headersByLowercasedKey[lowercasedKey] = {
            headerKey: headerKey,
            headerValue: headerValue
          };
        };

        HttpHeaders.prototype.toJSON = function () {
          var result = {};

          for (var _i = 0, _a = keys_1.default(this._headersByLowercasedKey); _i < _a.length; _i++) {
            var lowercasedKey = _a[_i];
            var headerDefinition = this._headersByLowercasedKey[lowercasedKey];
            var headerKey = void 0;
            /* istanbul ignore next */

            if (isBrowser && lowercasedKey === 'user-agent') {
              // Some browsers do not allow overriding the user agent.
              // https://github.com/Airtable/airtable.js/issues/52
              headerKey = 'X-Airtable-User-Agent';
            } else {
              headerKey = headerDefinition.headerKey;
            }

            result[headerKey] = headerDefinition.headerValue;
          }

          return result;
        };

        return HttpHeaders;
      }();

      module.exports = HttpHeaders;
    }, {
      "lodash/keys": 93
    }],
    10: [function (require, module, exports) {
      module.exports = {
        "INITIAL_RETRY_DELAY_IF_RATE_LIMITED": 5000,
        "MAX_RETRY_DELAY_IF_RATE_LIMITED": 600000
      };
    }, {}],
    11: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var isArray_1 = __importDefault(require("lodash/isArray"));

      var isNil_1 = __importDefault(require("lodash/isNil"));

      var keys_1 = __importDefault(require("lodash/keys"));
      /* eslint-enable @typescript-eslint/no-explicit-any */
      // Adapted from jQuery.param:
      // https://github.com/jquery/jquery/blob/2.2-stable/src/serialize.js


      function buildParams(prefix, obj, addFn) {
        if (isArray_1.default(obj)) {
          // Serialize array item.
          for (var index = 0; index < obj.length; index++) {
            var value = obj[index];

            if (/\[\]$/.test(prefix)) {
              // Treat each array item as a scalar.
              addFn(prefix, value);
            } else {
              // Item is non-scalar (array or object), encode its numeric index.
              buildParams(prefix + "[" + (_typeof(value) === 'object' && value !== null ? index : '') + "]", value, addFn);
            }
          }
        } else if (_typeof(obj) === 'object') {
          // Serialize object item.
          for (var _i = 0, _a = keys_1.default(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = obj[key];
            buildParams(prefix + "[" + key + "]", value, addFn);
          }
        } else {
          // Serialize scalar item.
          addFn(prefix, obj);
        }
      }

      function objectToQueryParamString(obj) {
        var parts = [];

        var addFn = function addFn(key, value) {
          value = isNil_1.default(value) ? '' : value;
          parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        };

        for (var _i = 0, _a = keys_1.default(obj); _i < _a.length; _i++) {
          var key = _a[_i];
          var value = obj[key];
          buildParams(key, value, addFn);
        }

        return parts.join('&').replace(/%20/g, '+');
      }

      module.exports = objectToQueryParamString;
    }, {
      "lodash/isArray": 79,
      "lodash/isNil": 85,
      "lodash/keys": 93
    }],
    12: [function (require, module, exports) {
      "use strict";

      module.exports = "0.11.4";
    }, {}],
    13: [function (require, module, exports) {
      "use strict";

      var __assign = this && this.__assign || function () {
        __assign = Object.assign || function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];

            for (var p in s) {
              if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
          }

          return t;
        };

        return __assign.apply(this, arguments);
      };

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var isFunction_1 = __importDefault(require("lodash/isFunction"));

      var keys_1 = __importDefault(require("lodash/keys"));

      var record_1 = __importDefault(require("./record"));

      var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

      var has_1 = __importDefault(require("./has"));

      var query_params_1 = require("./query_params");
      /**
       * Builds a query object. Won't fetch until `firstPage` or
       * or `eachPage` is called.
       *
       * Params should be validated prior to being passed to Query
       * with `Query.validateParams`.
       */


      var Query =
      /** @class */
      function () {
        function Query(table, params) {
          this._table = table;
          this._params = params;
          this.firstPage = callback_to_promise_1.default(firstPage, this);
          this.eachPage = callback_to_promise_1.default(eachPage, this, 1);
          this.all = callback_to_promise_1.default(all, this);
        }
        /**
         * Validates the parameters for passing to the Query constructor.
         *
         * @params {object} params parameters to validate
         *
         * @return an object with two keys:
         *  validParams: the object that should be passed to the constructor.
         *  ignoredKeys: a list of keys that will be ignored.
         *  errors: a list of error messages.
         */


        Query.validateParams = function (params) {
          var validParams = {};
          var ignoredKeys = [];
          var errors = [];

          for (var _i = 0, _a = keys_1.default(params); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = params[key];

            if (has_1.default(Query.paramValidators, key)) {
              var validator = Query.paramValidators[key];
              var validationResult = validator(value);

              if (validationResult.pass) {
                validParams[key] = value;
              } else {
                errors.push(validationResult.error);
              }
            } else {
              ignoredKeys.push(key);
            }
          }

          return {
            validParams: validParams,
            ignoredKeys: ignoredKeys,
            errors: errors
          };
        };

        Query.paramValidators = query_params_1.paramValidators;
        return Query;
      }();
      /**
       * Fetches the first page of results for the query asynchronously,
       * then calls `done(error, records)`.
       */


      function firstPage(done) {
        if (!isFunction_1.default(done)) {
          throw new Error('The first parameter to `firstPage` must be a function');
        }

        this.eachPage(function (records) {
          done(null, records);
        }, function (error) {
          done(error, null);
        });
      }
      /**
       * Fetches each page of results for the query asynchronously.
       *
       * Calls `pageCallback(records, fetchNextPage)` for each
       * page. You must call `fetchNextPage()` to fetch the next page of
       * results.
       *
       * After fetching all pages, or if there's an error, calls
       * `done(error)`.
       */


      function eachPage(pageCallback, done) {
        var _this = this;

        if (!isFunction_1.default(pageCallback)) {
          throw new Error('The first parameter to `eachPage` must be a function');
        }

        if (!isFunction_1.default(done) && done !== void 0) {
          throw new Error('The second parameter to `eachPage` must be a function or undefined');
        }

        var path = "/" + this._table._urlEncodedNameOrId();

        var params = __assign({}, this._params);

        var inner = function inner() {
          _this._table._base.runAction('get', path, params, null, function (err, response, result) {
            if (err) {
              done(err, null);
            } else {
              var next = void 0;

              if (result.offset) {
                params.offset = result.offset;
                next = inner;
              } else {
                next = function next() {
                  done(null);
                };
              }

              var records = result.records.map(function (recordJson) {
                return new record_1.default(_this._table, null, recordJson);
              });
              pageCallback(records, next);
            }
          });
        };

        inner();
      }
      /**
       * Fetches all pages of results asynchronously. May take a long time.
       */


      function all(done) {
        if (!isFunction_1.default(done)) {
          throw new Error('The first parameter to `all` must be a function');
        }

        var allRecords = [];
        this.eachPage(function (pageRecords, fetchNextPage) {
          allRecords.push.apply(allRecords, pageRecords);
          fetchNextPage();
        }, function (err) {
          if (err) {
            done(err, null);
          } else {
            done(null, allRecords);
          }
        });
      }

      module.exports = Query;
    }, {
      "./callback_to_promise": 4,
      "./has": 8,
      "./query_params": 14,
      "./record": 15,
      "lodash/isFunction": 83,
      "lodash/keys": 93
    }],
    14: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.paramValidators = void 0;

      var typecheck_1 = __importDefault(require("./typecheck"));

      var isString_1 = __importDefault(require("lodash/isString"));

      var isNumber_1 = __importDefault(require("lodash/isNumber"));

      var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

      var isBoolean_1 = __importDefault(require("lodash/isBoolean"));

      exports.paramValidators = {
        fields: typecheck_1.default(typecheck_1.default.isArrayOf(isString_1.default), 'the value for `fields` should be an array of strings'),
        filterByFormula: typecheck_1.default(isString_1.default, 'the value for `filterByFormula` should be a string'),
        maxRecords: typecheck_1.default(isNumber_1.default, 'the value for `maxRecords` should be a number'),
        pageSize: typecheck_1.default(isNumber_1.default, 'the value for `pageSize` should be a number'),
        offset: typecheck_1.default(isNumber_1.default, 'the value for `offset` should be a number'),
        sort: typecheck_1.default(typecheck_1.default.isArrayOf(function (obj) {
          return isPlainObject_1.default(obj) && isString_1.default(obj.field) && (obj.direction === void 0 || ['asc', 'desc'].includes(obj.direction));
        }), 'the value for `sort` should be an array of sort objects. ' + 'Each sort object must have a string `field` value, and an optional ' + '`direction` value that is "asc" or "desc".'),
        view: typecheck_1.default(isString_1.default, 'the value for `view` should be a string'),
        cellFormat: typecheck_1.default(function (cellFormat) {
          return isString_1.default(cellFormat) && ['json', 'string'].includes(cellFormat);
        }, 'the value for `cellFormat` should be "json" or "string"'),
        timeZone: typecheck_1.default(isString_1.default, 'the value for `timeZone` should be a string'),
        userLocale: typecheck_1.default(isString_1.default, 'the value for `userLocale` should be a string'),
        returnFieldsByFieldId: typecheck_1.default(isBoolean_1.default, 'the value for `returnFieldsByFieldId` should be a boolean')
      };
    }, {
      "./typecheck": 18,
      "lodash/isBoolean": 81,
      "lodash/isNumber": 86,
      "lodash/isPlainObject": 89,
      "lodash/isString": 90
    }],
    15: [function (require, module, exports) {
      "use strict";

      var __assign = this && this.__assign || function () {
        __assign = Object.assign || function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];

            for (var p in s) {
              if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
          }

          return t;
        };

        return __assign.apply(this, arguments);
      };

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

      var Record =
      /** @class */
      function () {
        function Record(table, recordId, recordJson) {
          this._table = table;
          this.id = recordId || recordJson.id;
          this.setRawJson(recordJson);
          this.save = callback_to_promise_1.default(save, this);
          this.patchUpdate = callback_to_promise_1.default(patchUpdate, this);
          this.putUpdate = callback_to_promise_1.default(putUpdate, this);
          this.destroy = callback_to_promise_1.default(destroy, this);
          this.fetch = callback_to_promise_1.default(fetch, this);
          this.updateFields = this.patchUpdate;
          this.replaceFields = this.putUpdate;
        }

        Record.prototype.getId = function () {
          return this.id;
        };

        Record.prototype.get = function (columnName) {
          return this.fields[columnName];
        };

        Record.prototype.set = function (columnName, columnValue) {
          this.fields[columnName] = columnValue;
        };

        Record.prototype.setRawJson = function (rawJson) {
          this._rawJson = rawJson;
          this.fields = this._rawJson && this._rawJson.fields || {};
        };

        return Record;
      }();

      function save(done) {
        this.putUpdate(this.fields, done);
      }

      function patchUpdate(cellValuesByName, opts, done) {
        var _this = this;

        if (!done) {
          done = opts;
          opts = {};
        }

        var updateBody = __assign({
          fields: cellValuesByName
        }, opts);

        this._table._base.runAction('patch', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function (err, response, results) {
          if (err) {
            done(err);
            return;
          }

          _this.setRawJson(results);

          done(null, _this);
        });
      }

      function putUpdate(cellValuesByName, opts, done) {
        var _this = this;

        if (!done) {
          done = opts;
          opts = {};
        }

        var updateBody = __assign({
          fields: cellValuesByName
        }, opts);

        this._table._base.runAction('put', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function (err, response, results) {
          if (err) {
            done(err);
            return;
          }

          _this.setRawJson(results);

          done(null, _this);
        });
      }

      function destroy(done) {
        var _this = this;

        this._table._base.runAction('delete', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function (err) {
          if (err) {
            done(err);
            return;
          }

          done(null, _this);
        });
      }

      function fetch(done) {
        var _this = this;

        this._table._base.runAction('get', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function (err, response, results) {
          if (err) {
            done(err);
            return;
          }

          _this.setRawJson(results);

          done(null, _this);
        });
      }

      module.exports = Record;
    }, {
      "./callback_to_promise": 4
    }],
    16: [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var exponential_backoff_with_jitter_1 = __importDefault(require("./exponential_backoff_with_jitter"));

      var object_to_query_param_string_1 = __importDefault(require("./object_to_query_param_string"));

      var package_version_1 = __importDefault(require("./package_version"));

      var fetch_1 = __importDefault(require("./fetch"));

      var abort_controller_1 = __importDefault(require("./abort-controller"));

      var userAgent = "Airtable.js/" + package_version_1.default;

      function runAction(base, method, path, queryParams, bodyData, callback, numAttempts) {
        var url = base._airtable._endpointUrl + "/v" + base._airtable._apiVersionMajor + "/" + base._id + path + "?" + object_to_query_param_string_1.default(queryParams);
        var headers = {
          authorization: "Bearer " + base._airtable._apiKey,
          'x-api-version': base._airtable._apiVersion,
          'x-airtable-application-id': base.getId(),
          'content-type': 'application/json'
        };
        var isBrowser = typeof window !== 'undefined'; // Some browsers do not allow overriding the user agent.
        // https://github.com/Airtable/airtable.js/issues/52

        if (isBrowser) {
          headers['x-airtable-user-agent'] = userAgent;
        } else {
          headers['User-Agent'] = userAgent;
        }

        var controller = new abort_controller_1.default();
        var normalizedMethod = method.toUpperCase();
        var options = {
          method: normalizedMethod,
          headers: headers,
          signal: controller.signal
        };

        if (bodyData !== null) {
          if (normalizedMethod === 'GET' || normalizedMethod === 'HEAD') {
            console.warn('body argument to runAction are ignored with GET or HEAD requests');
          } else {
            options.body = JSON.stringify(bodyData);
          }
        }

        var timeout = setTimeout(function () {
          controller.abort();
        }, base._airtable._requestTimeout);
        fetch_1.default(url, options).then(function (resp) {
          clearTimeout(timeout);

          if (resp.status === 429 && !base._airtable._noRetryIfRateLimited) {
            var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts);
            setTimeout(function () {
              runAction(base, method, path, queryParams, bodyData, callback, numAttempts + 1);
            }, backoffDelayMs);
          } else {
            resp.json().then(function (body) {
              var error = base._checkStatusForError(resp.status, body); // Ensure Response interface matches interface from
              // `request` Response object


              var r = {};
              Object.keys(resp).forEach(function (property) {
                r[property] = resp[property];
              });
              r.body = body;
              r.statusCode = resp.status;
              callback(error, r, body);
            }).catch(function () {
              callback(base._checkStatusForError(resp.status));
            });
          }
        }).catch(function (error) {
          clearTimeout(timeout);
          callback(error);
        });
      }

      module.exports = runAction;
    }, {
      "./abort-controller": 1,
      "./exponential_backoff_with_jitter": 6,
      "./fetch": 7,
      "./object_to_query_param_string": 11,
      "./package_version": 12
    }],
    17: [function (require, module, exports) {
      "use strict";

      var __assign = this && this.__assign || function () {
        __assign = Object.assign || function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];

            for (var p in s) {
              if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
          }

          return t;
        };

        return __assign.apply(this, arguments);
      };

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

      var deprecate_1 = __importDefault(require("./deprecate"));

      var query_1 = __importDefault(require("./query"));

      var record_1 = __importDefault(require("./record"));

      var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

      var Table =
      /** @class */
      function () {
        function Table(base, tableId, tableName) {
          if (!tableId && !tableName) {
            throw new Error('Table name or table ID is required');
          }

          this._base = base;
          this.id = tableId;
          this.name = tableName; // Public API

          this.find = callback_to_promise_1.default(this._findRecordById, this);
          this.select = this._selectRecords.bind(this);
          this.create = callback_to_promise_1.default(this._createRecords, this);
          this.update = callback_to_promise_1.default(this._updateRecords.bind(this, false), this);
          this.replace = callback_to_promise_1.default(this._updateRecords.bind(this, true), this);
          this.destroy = callback_to_promise_1.default(this._destroyRecord, this); // Deprecated API

          this.list = deprecate_1.default(this._listRecords.bind(this), 'table.list', 'Airtable: `list()` is deprecated. Use `select()` instead.');
          this.forEach = deprecate_1.default(this._forEachRecord.bind(this), 'table.forEach', 'Airtable: `forEach()` is deprecated. Use `select()` instead.');
        }

        Table.prototype._findRecordById = function (recordId, done) {
          var record = new record_1.default(this, recordId);
          record.fetch(done);
        };

        Table.prototype._selectRecords = function (params) {
          if (params === void 0) {
            params = {};
          }

          if (arguments.length > 1) {
            console.warn("Airtable: `select` takes only one parameter, but it was given " + arguments.length + " parameters. Use `eachPage` or `firstPage` to fetch records.");
          }

          if (isPlainObject_1.default(params)) {
            var validationResults = query_1.default.validateParams(params);

            if (validationResults.errors.length) {
              var formattedErrors = validationResults.errors.map(function (error) {
                return "  * " + error;
              });
              throw new Error("Airtable: invalid parameters for `select`:\n" + formattedErrors.join('\n'));
            }

            if (validationResults.ignoredKeys.length) {
              console.warn("Airtable: the following parameters to `select` will be ignored: " + validationResults.ignoredKeys.join(', '));
            }

            return new query_1.default(this, validationResults.validParams);
          } else {
            throw new Error('Airtable: the parameter for `select` should be a plain object or undefined.');
          }
        };

        Table.prototype._urlEncodedNameOrId = function () {
          return this.id || encodeURIComponent(this.name);
        };

        Table.prototype._createRecords = function (recordsData, optionalParameters, done) {
          var _this = this;

          var isCreatingMultipleRecords = Array.isArray(recordsData);

          if (!done) {
            done = optionalParameters;
            optionalParameters = {};
          }

          var requestData;

          if (isCreatingMultipleRecords) {
            requestData = __assign({
              records: recordsData
            }, optionalParameters);
          } else {
            requestData = __assign({
              fields: recordsData
            }, optionalParameters);
          }

          this._base.runAction('post', "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function (err, resp, body) {
            if (err) {
              done(err);
              return;
            }

            var result;

            if (isCreatingMultipleRecords) {
              result = body.records.map(function (record) {
                return new record_1.default(_this, record.id, record);
              });
            } else {
              result = new record_1.default(_this, body.id, body);
            }

            done(null, result);
          });
        };

        Table.prototype._updateRecords = function (isDestructiveUpdate, recordsDataOrRecordId, recordDataOrOptsOrDone, optsOrDone, done) {
          var _this = this;

          var opts;

          if (Array.isArray(recordsDataOrRecordId)) {
            var recordsData = recordsDataOrRecordId;
            opts = isPlainObject_1.default(recordDataOrOptsOrDone) ? recordDataOrOptsOrDone : {};
            done = optsOrDone || recordDataOrOptsOrDone;
            var method = isDestructiveUpdate ? 'put' : 'patch';

            var requestData = __assign({
              records: recordsData
            }, opts);

            this._base.runAction(method, "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function (err, resp, body) {
              if (err) {
                done(err);
                return;
              }

              var result = body.records.map(function (record) {
                return new record_1.default(_this, record.id, record);
              });
              done(null, result);
            });
          } else {
            var recordId = recordsDataOrRecordId;
            var recordData = recordDataOrOptsOrDone;
            opts = isPlainObject_1.default(optsOrDone) ? optsOrDone : {};
            done = done || optsOrDone;
            var record = new record_1.default(this, recordId);

            if (isDestructiveUpdate) {
              record.putUpdate(recordData, opts, done);
            } else {
              record.patchUpdate(recordData, opts, done);
            }
          }
        };

        Table.prototype._destroyRecord = function (recordIdsOrId, done) {
          var _this = this;

          if (Array.isArray(recordIdsOrId)) {
            var queryParams = {
              records: recordIdsOrId
            };

            this._base.runAction('delete', "/" + this._urlEncodedNameOrId(), queryParams, null, function (err, response, results) {
              if (err) {
                done(err);
                return;
              }

              var records = results.records.map(function (_a) {
                var id = _a.id;
                return new record_1.default(_this, id, null);
              });
              done(null, records);
            });
          } else {
            var record = new record_1.default(this, recordIdsOrId);
            record.destroy(done);
          }
        };

        Table.prototype._listRecords = function (limit, offset, opts, done) {
          var _this = this;

          if (!done) {
            done = opts;
            opts = {};
          }

          var listRecordsParameters = __assign({
            limit: limit,
            offset: offset
          }, opts);

          this._base.runAction('get', "/" + this._urlEncodedNameOrId() + "/", listRecordsParameters, null, function (err, response, results) {
            if (err) {
              done(err);
              return;
            }

            var records = results.records.map(function (recordJson) {
              return new record_1.default(_this, null, recordJson);
            });
            done(null, records, results.offset);
          });
        };

        Table.prototype._forEachRecord = function (opts, callback, done) {
          var _this = this;

          if (arguments.length === 2) {
            done = callback;
            callback = opts;
            opts = {};
          }

          var limit = Table.__recordsPerPageForIteration || 100;
          var offset = null;

          var nextPage = function nextPage() {
            _this._listRecords(limit, offset, opts, function (err, page, newOffset) {
              if (err) {
                done(err);
                return;
              }

              for (var index = 0; index < page.length; index++) {
                callback(page[index]);
              }

              if (newOffset) {
                offset = newOffset;
                nextPage();
              } else {
                done();
              }
            });
          };

          nextPage();
        };

        return Table;
      }();

      module.exports = Table;
    }, {
      "./callback_to_promise": 4,
      "./deprecate": 5,
      "./query": 13,
      "./record": 15,
      "lodash/isPlainObject": 89
    }],
    18: [function (require, module, exports) {
      "use strict";
      /* eslint-enable @typescript-eslint/no-explicit-any */

      function check(fn, error) {
        return function (value) {
          if (fn(value)) {
            return {
              pass: true
            };
          } else {
            return {
              pass: false,
              error: error
            };
          }
        };
      }

      check.isOneOf = function isOneOf(options) {
        return options.includes.bind(options);
      };

      check.isArrayOf = function (itemValidator) {
        return function (value) {
          return Array.isArray(value) && value.every(itemValidator);
        };
      };

      module.exports = check;
    }, {}],
    19: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }

      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
      }

      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };

        return _setPrototypeOf(o, p);
      }

      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        }

        return _assertThisInitialized(self);
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object);
          if (object === null) break;
        }

        return object;
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== "undefined" && Reflect.get) {
          _get = Reflect.get;
        } else {
          _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);

            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);

            if (desc.get) {
              return desc.get.call(receiver);
            }

            return desc.value;
          };
        }

        return _get(target, property, receiver || target);
      }

      var Emitter = /*#__PURE__*/function () {
        function Emitter() {
          _classCallCheck(this, Emitter);

          Object.defineProperty(this, 'listeners', {
            value: {},
            writable: true,
            configurable: true
          });
        }

        _createClass(Emitter, [{
          key: "addEventListener",
          value: function addEventListener(type, callback) {
            if (!(type in this.listeners)) {
              this.listeners[type] = [];
            }

            this.listeners[type].push(callback);
          }
        }, {
          key: "removeEventListener",
          value: function removeEventListener(type, callback) {
            if (!(type in this.listeners)) {
              return;
            }

            var stack = this.listeners[type];

            for (var i = 0, l = stack.length; i < l; i++) {
              if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
              }
            }
          }
        }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
            var _this = this;

            if (!(event.type in this.listeners)) {
              return;
            }

            var debounce = function debounce(callback) {
              setTimeout(function () {
                return callback.call(_this, event);
              });
            };

            var stack = this.listeners[event.type];

            for (var i = 0, l = stack.length; i < l; i++) {
              debounce(stack[i]);
            }

            return !event.defaultPrevented;
          }
        }]);

        return Emitter;
      }();

      var AbortSignal = /*#__PURE__*/function (_Emitter) {
        _inherits(AbortSignal, _Emitter);

        function AbortSignal() {
          var _this2;

          _classCallCheck(this, AbortSignal);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AbortSignal).call(this)); // Some versions of babel does not transpile super() correctly for IE <= 10, if the parent
          // constructor has failed to run, then "this.listeners" will still be undefined and then we call
          // the parent constructor directly instead as a workaround. For general details, see babel bug:
          // https://github.com/babel/babel/issues/3041
          // This hack was added as a fix for the issue described here:
          // https://github.com/Financial-Times/polyfill-library/pull/59#issuecomment-477558042

          if (!_this2.listeners) {
            Emitter.call(_assertThisInitialized(_this2));
          } // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
          // we want Object.keys(new AbortController().signal) to be [] for compat with the native impl


          Object.defineProperty(_assertThisInitialized(_this2), 'aborted', {
            value: false,
            writable: true,
            configurable: true
          });
          Object.defineProperty(_assertThisInitialized(_this2), 'onabort', {
            value: null,
            writable: true,
            configurable: true
          });
          return _this2;
        }

        _createClass(AbortSignal, [{
          key: "toString",
          value: function toString() {
            return '[object AbortSignal]';
          }
        }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
            if (event.type === 'abort') {
              this.aborted = true;

              if (typeof this.onabort === 'function') {
                this.onabort.call(this, event);
              }
            }

            _get(_getPrototypeOf(AbortSignal.prototype), "dispatchEvent", this).call(this, event);
          }
        }]);

        return AbortSignal;
      }(Emitter);

      var AbortController = /*#__PURE__*/function () {
        function AbortController() {
          _classCallCheck(this, AbortController); // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
          // we want Object.keys(new AbortController()) to be [] for compat with the native impl


          Object.defineProperty(this, 'signal', {
            value: new AbortSignal(),
            writable: true,
            configurable: true
          });
        }

        _createClass(AbortController, [{
          key: "abort",
          value: function abort() {
            var event;

            try {
              event = new Event('abort');
            } catch (e) {
              if (typeof document !== 'undefined') {
                if (!document.createEvent) {
                  // For Internet Explorer 8:
                  event = document.createEventObject();
                  event.type = 'abort';
                } else {
                  // For Internet Explorer 11:
                  event = document.createEvent('Event');
                  event.initEvent('abort', false, false);
                }
              } else {
                // Fallback where document isn't available:
                event = {
                  type: 'abort',
                  bubbles: false,
                  cancelable: false
                };
              }
            }

            this.signal.dispatchEvent(event);
          }
        }, {
          key: "toString",
          value: function toString() {
            return '[object AbortController]';
          }
        }]);

        return AbortController;
      }();

      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        // These are necessary to make sure that we get correct output for:
        // Object.prototype.toString.call(new AbortController())
        AbortController.prototype[Symbol.toStringTag] = 'AbortController';
        AbortSignal.prototype[Symbol.toStringTag] = 'AbortSignal';
      }

      function polyfillNeeded(self) {
        if (self.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
          console.log('__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill');
          return true;
        } // Note that the "unfetch" minimal fetch polyfill defines fetch() without
        // defining window.Request, and this polyfill need to work on top of unfetch
        // so the below feature detection needs the !self.AbortController part.
        // The Request.prototype check is also needed because Safari versions 11.1.2
        // up to and including 12.1.x has a window.AbortController present but still
        // does NOT correctly implement abortable fetch:
        // https://bugs.webkit.org/show_bug.cgi?id=174980#c2


        return typeof self.Request === 'function' && !self.Request.prototype.hasOwnProperty('signal') || !self.AbortController;
      }
      /**
       * Note: the "fetch.Request" default value is available for fetch imported from
       * the "node-fetch" package and not in browsers. This is OK since browsers
       * will be importing umd-polyfill.js from that path "self" is passed the
       * decorator so the default value will not be used (because browsers that define
       * fetch also has Request). One quirky setup where self.fetch exists but
       * self.Request does not is when the "unfetch" minimal fetch polyfill is used
       * on top of IE11; for this case the browser will try to use the fetch.Request
       * default value which in turn will be undefined but then then "if (Request)"
       * will ensure that you get a patched fetch but still no Request (as expected).
       * @param {fetch, Request = fetch.Request}
       * @returns {fetch: abortableFetch, Request: AbortableRequest}
       */


      function abortableFetchDecorator(patchTargets) {
        if ('function' === typeof patchTargets) {
          patchTargets = {
            fetch: patchTargets
          };
        }

        var _patchTargets = patchTargets,
            fetch = _patchTargets.fetch,
            _patchTargets$Request = _patchTargets.Request,
            NativeRequest = _patchTargets$Request === void 0 ? fetch.Request : _patchTargets$Request,
            NativeAbortController = _patchTargets.AbortController,
            _patchTargets$__FORCE = _patchTargets.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,
            __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL = _patchTargets$__FORCE === void 0 ? false : _patchTargets$__FORCE;

        if (!polyfillNeeded({
          fetch: fetch,
          Request: NativeRequest,
          AbortController: NativeAbortController,
          __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL: __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL
        })) {
          return {
            fetch: fetch,
            Request: Request
          };
        }

        var Request = NativeRequest; // Note that the "unfetch" minimal fetch polyfill defines fetch() without
        // defining window.Request, and this polyfill need to work on top of unfetch
        // hence we only patch it if it's available. Also we don't patch it if signal
        // is already available on the Request prototype because in this case support
        // is present and the patching below can cause a crash since it assigns to
        // request.signal which is technically a read-only property. This latter error
        // happens when you run the main5.js node-fetch example in the repo
        // "abortcontroller-polyfill-examples". The exact error is:
        //   request.signal = init.signal;
        //   ^
        // TypeError: Cannot set property signal of #<Request> which has only a getter

        if (Request && !Request.prototype.hasOwnProperty('signal') || __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
          Request = function Request(input, init) {
            var signal;

            if (init && init.signal) {
              signal = init.signal; // Never pass init.signal to the native Request implementation when the polyfill has
              // been installed because if we're running on top of a browser with a
              // working native AbortController (i.e. the polyfill was installed due to
              // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
              // fake AbortSignal to the native fetch will trigger:
              // TypeError: Failed to construct 'Request': member signal is not of type AbortSignal.

              delete init.signal;
            }

            var request = new NativeRequest(input, init);

            if (signal) {
              Object.defineProperty(request, 'signal', {
                writable: false,
                enumerable: false,
                configurable: true,
                value: signal
              });
            }

            return request;
          };

          Request.prototype = NativeRequest.prototype;
        }

        var realFetch = fetch;

        var abortableFetch = function abortableFetch(input, init) {
          var signal = Request && Request.prototype.isPrototypeOf(input) ? input.signal : init ? init.signal : undefined;

          if (signal) {
            var abortError;

            try {
              abortError = new DOMException('Aborted', 'AbortError');
            } catch (err) {
              // IE 11 does not support calling the DOMException constructor, use a
              // regular error object on it instead.
              abortError = new Error('Aborted');
              abortError.name = 'AbortError';
            } // Return early if already aborted, thus avoiding making an HTTP request


            if (signal.aborted) {
              return Promise.reject(abortError);
            } // Turn an event into a promise, reject it once `abort` is dispatched


            var cancellation = new Promise(function (_, reject) {
              signal.addEventListener('abort', function () {
                return reject(abortError);
              }, {
                once: true
              });
            });

            if (init && init.signal) {
              // Never pass .signal to the native implementation when the polyfill has
              // been installed because if we're running on top of a browser with a
              // working native AbortController (i.e. the polyfill was installed due to
              // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
              // fake AbortSignal to the native fetch will trigger:
              // TypeError: Failed to execute 'fetch' on 'Window': member signal is not of type AbortSignal.
              delete init.signal;
            } // Return the fastest promise (don't need to wait for request to finish)


            return Promise.race([cancellation, realFetch(input, init)]);
          }

          return realFetch(input, init);
        };

        return {
          fetch: abortableFetch,
          Request: Request
        };
      }

      exports.AbortController = AbortController;
      exports.AbortSignal = AbortSignal;
      exports.abortableFetch = abortableFetchDecorator;
    }, {}],
    20: [function (require, module, exports) {}, {}],
    21: [function (require, module, exports) {
      var hashClear = require('./_hashClear'),
          hashDelete = require('./_hashDelete'),
          hashGet = require('./_hashGet'),
          hashHas = require('./_hashHas'),
          hashSet = require('./_hashSet');
      /**
       * Creates a hash object.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */


      function Hash(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      } // Add methods to `Hash`.


      Hash.prototype.clear = hashClear;
      Hash.prototype['delete'] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      module.exports = Hash;
    }, {
      "./_hashClear": 46,
      "./_hashDelete": 47,
      "./_hashGet": 48,
      "./_hashHas": 49,
      "./_hashSet": 50
    }],
    22: [function (require, module, exports) {
      var listCacheClear = require('./_listCacheClear'),
          listCacheDelete = require('./_listCacheDelete'),
          listCacheGet = require('./_listCacheGet'),
          listCacheHas = require('./_listCacheHas'),
          listCacheSet = require('./_listCacheSet');
      /**
       * Creates an list cache object.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */


      function ListCache(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      } // Add methods to `ListCache`.


      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype['delete'] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      module.exports = ListCache;
    }, {
      "./_listCacheClear": 56,
      "./_listCacheDelete": 57,
      "./_listCacheGet": 58,
      "./_listCacheHas": 59,
      "./_listCacheSet": 60
    }],
    23: [function (require, module, exports) {
      var getNative = require('./_getNative'),
          root = require('./_root');
      /* Built-in method references that are verified to be native. */


      var Map = getNative(root, 'Map');
      module.exports = Map;
    }, {
      "./_getNative": 42,
      "./_root": 72
    }],
    24: [function (require, module, exports) {
      var mapCacheClear = require('./_mapCacheClear'),
          mapCacheDelete = require('./_mapCacheDelete'),
          mapCacheGet = require('./_mapCacheGet'),
          mapCacheHas = require('./_mapCacheHas'),
          mapCacheSet = require('./_mapCacheSet');
      /**
       * Creates a map cache object to store key-value pairs.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */


      function MapCache(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      } // Add methods to `MapCache`.


      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype['delete'] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      module.exports = MapCache;
    }, {
      "./_mapCacheClear": 61,
      "./_mapCacheDelete": 62,
      "./_mapCacheGet": 63,
      "./_mapCacheHas": 64,
      "./_mapCacheSet": 65
    }],
    25: [function (require, module, exports) {
      var root = require('./_root');
      /** Built-in value references. */


      var _Symbol = root.Symbol;
      module.exports = _Symbol;
    }, {
      "./_root": 72
    }],
    26: [function (require, module, exports) {
      var baseTimes = require('./_baseTimes'),
          isArguments = require('./isArguments'),
          isArray = require('./isArray'),
          isBuffer = require('./isBuffer'),
          isIndex = require('./_isIndex'),
          isTypedArray = require('./isTypedArray');
      /** Used for built-in method references. */


      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /**
       * Creates an array of the enumerable property names of the array-like `value`.
       *
       * @private
       * @param {*} value The value to query.
       * @param {boolean} inherited Specify returning inherited property names.
       * @returns {Array} Returns the array of property names.
       */

      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value),
            isArg = !isArr && isArguments(value),
            isBuff = !isArr && !isArg && isBuffer(value),
            isType = !isArr && !isArg && !isBuff && isTypedArray(value),
            skipIndexes = isArr || isArg || isBuff || isType,
            result = skipIndexes ? baseTimes(value.length, String) : [],
            length = result.length;

        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
          key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
          isIndex(key, length)))) {
            result.push(key);
          }
        }

        return result;
      }

      module.exports = arrayLikeKeys;
    }, {
      "./_baseTimes": 35,
      "./_isIndex": 51,
      "./isArguments": 78,
      "./isArray": 79,
      "./isBuffer": 82,
      "./isTypedArray": 92
    }],
    27: [function (require, module, exports) {
      /**
       * A specialized version of `_.map` for arrays without support for iteratee
       * shorthands.
       *
       * @private
       * @param {Array} [array] The array to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Array} Returns the new mapped array.
       */
      function arrayMap(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length,
            result = Array(length);

        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }

        return result;
      }

      module.exports = arrayMap;
    }, {}],
    28: [function (require, module, exports) {
      var eq = require('./eq');
      /**
       * Gets the index at which the `key` is found in `array` of key-value pairs.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {*} key The key to search for.
       * @returns {number} Returns the index of the matched value, else `-1`.
       */


      function assocIndexOf(array, key) {
        var length = array.length;

        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }

        return -1;
      }

      module.exports = assocIndexOf;
    }, {
      "./eq": 76
    }],
    29: [function (require, module, exports) {
      var castPath = require('./_castPath'),
          toKey = require('./_toKey');
      /**
       * The base implementation of `_.get` without support for default values.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to get.
       * @returns {*} Returns the resolved value.
       */


      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0,
            length = path.length;

        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }

        return index && index == length ? object : undefined;
      }

      module.exports = baseGet;
    }, {
      "./_castPath": 38,
      "./_toKey": 74
    }],
    30: [function (require, module, exports) {
      var _Symbol2 = require('./_Symbol'),
          getRawTag = require('./_getRawTag'),
          objectToString = require('./_objectToString');
      /** `Object#toString` result references. */


      var nullTag = '[object Null]',
          undefinedTag = '[object Undefined]';
      /** Built-in value references. */

      var symToStringTag = _Symbol2 ? _Symbol2.toStringTag : undefined;
      /**
       * The base implementation of `getTag` without fallbacks for buggy environments.
       *
       * @private
       * @param {*} value The value to query.
       * @returns {string} Returns the `toStringTag`.
       */

      function baseGetTag(value) {
        if (value == null) {
          return value === undefined ? undefinedTag : nullTag;
        }

        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }

      module.exports = baseGetTag;
    }, {
      "./_Symbol": 25,
      "./_getRawTag": 44,
      "./_objectToString": 70
    }],
    31: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var argsTag = '[object Arguments]';
      /**
       * The base implementation of `_.isArguments`.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an `arguments` object,
       */

      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }

      module.exports = baseIsArguments;
    }, {
      "./_baseGetTag": 30,
      "./isObjectLike": 88
    }],
    32: [function (require, module, exports) {
      var isFunction = require('./isFunction'),
          isMasked = require('./_isMasked'),
          isObject = require('./isObject'),
          toSource = require('./_toSource');
      /**
       * Used to match `RegExp`
       * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
       */


      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      /** Used to detect host constructors (Safari). */

      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      /** Used for built-in method references. */

      var funcProto = Function.prototype,
          objectProto = Object.prototype;
      /** Used to resolve the decompiled source of functions. */

      var funcToString = funcProto.toString;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /** Used to detect if a method is native. */

      var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      /**
       * The base implementation of `_.isNative` without bad shim checks.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a native function,
       *  else `false`.
       */

      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }

        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }

      module.exports = baseIsNative;
    }, {
      "./_isMasked": 54,
      "./_toSource": 75,
      "./isFunction": 83,
      "./isObject": 87
    }],
    33: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isLength = require('./isLength'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var argsTag = '[object Arguments]',
          arrayTag = '[object Array]',
          boolTag = '[object Boolean]',
          dateTag = '[object Date]',
          errorTag = '[object Error]',
          funcTag = '[object Function]',
          mapTag = '[object Map]',
          numberTag = '[object Number]',
          objectTag = '[object Object]',
          regexpTag = '[object RegExp]',
          setTag = '[object Set]',
          stringTag = '[object String]',
          weakMapTag = '[object WeakMap]';
      var arrayBufferTag = '[object ArrayBuffer]',
          dataViewTag = '[object DataView]',
          float32Tag = '[object Float32Array]',
          float64Tag = '[object Float64Array]',
          int8Tag = '[object Int8Array]',
          int16Tag = '[object Int16Array]',
          int32Tag = '[object Int32Array]',
          uint8Tag = '[object Uint8Array]',
          uint8ClampedTag = '[object Uint8ClampedArray]',
          uint16Tag = '[object Uint16Array]',
          uint32Tag = '[object Uint32Array]';
      /** Used to identify `toStringTag` values of typed arrays. */

      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      /**
       * The base implementation of `_.isTypedArray` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
       */

      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }

      module.exports = baseIsTypedArray;
    }, {
      "./_baseGetTag": 30,
      "./isLength": 84,
      "./isObjectLike": 88
    }],
    34: [function (require, module, exports) {
      var isPrototype = require('./_isPrototype'),
          nativeKeys = require('./_nativeKeys');
      /** Used for built-in method references. */


      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /**
       * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       */

      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }

        var result = [];

        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }

        return result;
      }

      module.exports = baseKeys;
    }, {
      "./_isPrototype": 55,
      "./_nativeKeys": 68
    }],
    35: [function (require, module, exports) {
      /**
       * The base implementation of `_.times` without support for iteratee shorthands
       * or max array length checks.
       *
       * @private
       * @param {number} n The number of times to invoke `iteratee`.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Array} Returns the array of results.
       */
      function baseTimes(n, iteratee) {
        var index = -1,
            result = Array(n);

        while (++index < n) {
          result[index] = iteratee(index);
        }

        return result;
      }

      module.exports = baseTimes;
    }, {}],
    36: [function (require, module, exports) {
      var _Symbol3 = require('./_Symbol'),
          arrayMap = require('./_arrayMap'),
          isArray = require('./isArray'),
          isSymbol = require('./isSymbol');
      /** Used as references for various `Number` constants. */


      var INFINITY = 1 / 0;
      /** Used to convert symbols to primitives and strings. */

      var symbolProto = _Symbol3 ? _Symbol3.prototype : undefined,
          symbolToString = symbolProto ? symbolProto.toString : undefined;
      /**
       * The base implementation of `_.toString` which doesn't convert nullish
       * values to empty strings.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {string} Returns the string.
       */

      function baseToString(value) {
        // Exit early for strings to avoid a performance hit in some environments.
        if (typeof value == 'string') {
          return value;
        }

        if (isArray(value)) {
          // Recursively convert values (susceptible to call stack limits).
          return arrayMap(value, baseToString) + '';
        }

        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : '';
        }

        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

      module.exports = baseToString;
    }, {
      "./_Symbol": 25,
      "./_arrayMap": 27,
      "./isArray": 79,
      "./isSymbol": 91
    }],
    37: [function (require, module, exports) {
      /**
       * The base implementation of `_.unary` without support for storing metadata.
       *
       * @private
       * @param {Function} func The function to cap arguments for.
       * @returns {Function} Returns the new capped function.
       */
      function baseUnary(func) {
        return function (value) {
          return func(value);
        };
      }

      module.exports = baseUnary;
    }, {}],
    38: [function (require, module, exports) {
      var isArray = require('./isArray'),
          isKey = require('./_isKey'),
          stringToPath = require('./_stringToPath'),
          toString = require('./toString');
      /**
       * Casts `value` to a path array if it's not one.
       *
       * @private
       * @param {*} value The value to inspect.
       * @param {Object} [object] The object to query keys on.
       * @returns {Array} Returns the cast property path array.
       */


      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }

        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }

      module.exports = castPath;
    }, {
      "./_isKey": 52,
      "./_stringToPath": 73,
      "./isArray": 79,
      "./toString": 96
    }],
    39: [function (require, module, exports) {
      var root = require('./_root');
      /** Used to detect overreaching core-js shims. */


      var coreJsData = root['__core-js_shared__'];
      module.exports = coreJsData;
    }, {
      "./_root": 72
    }],
    40: [function (require, module, exports) {
      (function (global) {
        /** Detect free variable `global` from Node.js. */
        var freeGlobal = _typeof(global) == 'object' && global && global.Object === Object && global;
        module.exports = freeGlobal;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    41: [function (require, module, exports) {
      var isKeyable = require('./_isKeyable');
      /**
       * Gets the data for `map`.
       *
       * @private
       * @param {Object} map The map to query.
       * @param {string} key The reference key.
       * @returns {*} Returns the map data.
       */


      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
      }

      module.exports = getMapData;
    }, {
      "./_isKeyable": 53
    }],
    42: [function (require, module, exports) {
      var baseIsNative = require('./_baseIsNative'),
          getValue = require('./_getValue');
      /**
       * Gets the native function at `key` of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {string} key The key of the method to get.
       * @returns {*} Returns the function if it's native, else `undefined`.
       */


      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined;
      }

      module.exports = getNative;
    }, {
      "./_baseIsNative": 32,
      "./_getValue": 45
    }],
    43: [function (require, module, exports) {
      var overArg = require('./_overArg');
      /** Built-in value references. */


      var getPrototype = overArg(Object.getPrototypeOf, Object);
      module.exports = getPrototype;
    }, {
      "./_overArg": 71
    }],
    44: [function (require, module, exports) {
      var _Symbol4 = require('./_Symbol');
      /** Used for built-in method references. */


      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /**
       * Used to resolve the
       * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
       * of values.
       */

      var nativeObjectToString = objectProto.toString;
      /** Built-in value references. */

      var symToStringTag = _Symbol4 ? _Symbol4.toStringTag : undefined;
      /**
       * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
       *
       * @private
       * @param {*} value The value to query.
       * @returns {string} Returns the raw `toStringTag`.
       */

      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
            tag = value[symToStringTag];

        try {
          value[symToStringTag] = undefined;
          var unmasked = true;
        } catch (e) {}

        var result = nativeObjectToString.call(value);

        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }

        return result;
      }

      module.exports = getRawTag;
    }, {
      "./_Symbol": 25
    }],
    45: [function (require, module, exports) {
      /**
       * Gets the value at `key` of `object`.
       *
       * @private
       * @param {Object} [object] The object to query.
       * @param {string} key The key of the property to get.
       * @returns {*} Returns the property value.
       */
      function getValue(object, key) {
        return object == null ? undefined : object[key];
      }

      module.exports = getValue;
    }, {}],
    46: [function (require, module, exports) {
      var nativeCreate = require('./_nativeCreate');
      /**
       * Removes all key-value entries from the hash.
       *
       * @private
       * @name clear
       * @memberOf Hash
       */


      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }

      module.exports = hashClear;
    }, {
      "./_nativeCreate": 67
    }],
    47: [function (require, module, exports) {
      /**
       * Removes `key` and its value from the hash.
       *
       * @private
       * @name delete
       * @memberOf Hash
       * @param {Object} hash The hash to modify.
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }

      module.exports = hashDelete;
    }, {}],
    48: [function (require, module, exports) {
      var nativeCreate = require('./_nativeCreate');
      /** Used to stand-in for `undefined` hash values. */


      var HASH_UNDEFINED = '__lodash_hash_undefined__';
      /** Used for built-in method references. */

      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /**
       * Gets the hash value for `key`.
       *
       * @private
       * @name get
       * @memberOf Hash
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */

      function hashGet(key) {
        var data = this.__data__;

        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? undefined : result;
        }

        return hasOwnProperty.call(data, key) ? data[key] : undefined;
      }

      module.exports = hashGet;
    }, {
      "./_nativeCreate": 67
    }],
    49: [function (require, module, exports) {
      var nativeCreate = require('./_nativeCreate');
      /** Used for built-in method references. */


      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /**
       * Checks if a hash value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf Hash
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */

      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
      }

      module.exports = hashHas;
    }, {
      "./_nativeCreate": 67
    }],
    50: [function (require, module, exports) {
      var nativeCreate = require('./_nativeCreate');
      /** Used to stand-in for `undefined` hash values. */


      var HASH_UNDEFINED = '__lodash_hash_undefined__';
      /**
       * Sets the hash `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf Hash
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the hash instance.
       */

      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
        return this;
      }

      module.exports = hashSet;
    }, {
      "./_nativeCreate": 67
    }],
    51: [function (require, module, exports) {
      /** Used as references for various `Number` constants. */
      var MAX_SAFE_INTEGER = 9007199254740991;
      /** Used to detect unsigned integer values. */

      var reIsUint = /^(?:0|[1-9]\d*)$/;
      /**
       * Checks if `value` is a valid array-like index.
       *
       * @private
       * @param {*} value The value to check.
       * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
       * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
       */

      function isIndex(value, length) {
        var type = _typeof(value);

        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
      }

      module.exports = isIndex;
    }, {}],
    52: [function (require, module, exports) {
      var isArray = require('./isArray'),
          isSymbol = require('./isSymbol');
      /** Used to match property names within property paths. */


      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          reIsPlainProp = /^\w*$/;
      /**
       * Checks if `value` is a property name and not a property path.
       *
       * @private
       * @param {*} value The value to check.
       * @param {Object} [object] The object to query keys on.
       * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
       */

      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }

        var type = _typeof(value);

        if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
          return true;
        }

        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }

      module.exports = isKey;
    }, {
      "./isArray": 79,
      "./isSymbol": 91
    }],
    53: [function (require, module, exports) {
      /**
       * Checks if `value` is suitable for use as unique object key.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
       */
      function isKeyable(value) {
        var type = _typeof(value);

        return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
      }

      module.exports = isKeyable;
    }, {}],
    54: [function (require, module, exports) {
      var coreJsData = require('./_coreJsData');
      /** Used to detect methods masquerading as native. */


      var maskSrcKey = function () {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
        return uid ? 'Symbol(src)_1.' + uid : '';
      }();
      /**
       * Checks if `func` has its source masked.
       *
       * @private
       * @param {Function} func The function to check.
       * @returns {boolean} Returns `true` if `func` is masked, else `false`.
       */


      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }

      module.exports = isMasked;
    }, {
      "./_coreJsData": 39
    }],
    55: [function (require, module, exports) {
      /** Used for built-in method references. */
      var objectProto = Object.prototype;
      /**
       * Checks if `value` is likely a prototype object.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
       */

      function isPrototype(value) {
        var Ctor = value && value.constructor,
            proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
        return value === proto;
      }

      module.exports = isPrototype;
    }, {}],
    56: [function (require, module, exports) {
      /**
       * Removes all key-value entries from the list cache.
       *
       * @private
       * @name clear
       * @memberOf ListCache
       */
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }

      module.exports = listCacheClear;
    }, {}],
    57: [function (require, module, exports) {
      var assocIndexOf = require('./_assocIndexOf');
      /** Used for built-in method references. */


      var arrayProto = Array.prototype;
      /** Built-in value references. */

      var splice = arrayProto.splice;
      /**
       * Removes `key` and its value from the list cache.
       *
       * @private
       * @name delete
       * @memberOf ListCache
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */

      function listCacheDelete(key) {
        var data = this.__data__,
            index = assocIndexOf(data, key);

        if (index < 0) {
          return false;
        }

        var lastIndex = data.length - 1;

        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }

        --this.size;
        return true;
      }

      module.exports = listCacheDelete;
    }, {
      "./_assocIndexOf": 28
    }],
    58: [function (require, module, exports) {
      var assocIndexOf = require('./_assocIndexOf');
      /**
       * Gets the list cache value for `key`.
       *
       * @private
       * @name get
       * @memberOf ListCache
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */


      function listCacheGet(key) {
        var data = this.__data__,
            index = assocIndexOf(data, key);
        return index < 0 ? undefined : data[index][1];
      }

      module.exports = listCacheGet;
    }, {
      "./_assocIndexOf": 28
    }],
    59: [function (require, module, exports) {
      var assocIndexOf = require('./_assocIndexOf');
      /**
       * Checks if a list cache value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf ListCache
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */


      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }

      module.exports = listCacheHas;
    }, {
      "./_assocIndexOf": 28
    }],
    60: [function (require, module, exports) {
      var assocIndexOf = require('./_assocIndexOf');
      /**
       * Sets the list cache `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf ListCache
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the list cache instance.
       */


      function listCacheSet(key, value) {
        var data = this.__data__,
            index = assocIndexOf(data, key);

        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }

        return this;
      }

      module.exports = listCacheSet;
    }, {
      "./_assocIndexOf": 28
    }],
    61: [function (require, module, exports) {
      var Hash = require('./_Hash'),
          ListCache = require('./_ListCache'),
          Map = require('./_Map');
      /**
       * Removes all key-value entries from the map.
       *
       * @private
       * @name clear
       * @memberOf MapCache
       */


      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          'hash': new Hash(),
          'map': new (Map || ListCache)(),
          'string': new Hash()
        };
      }

      module.exports = mapCacheClear;
    }, {
      "./_Hash": 21,
      "./_ListCache": 22,
      "./_Map": 23
    }],
    62: [function (require, module, exports) {
      var getMapData = require('./_getMapData');
      /**
       * Removes `key` and its value from the map.
       *
       * @private
       * @name delete
       * @memberOf MapCache
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */


      function mapCacheDelete(key) {
        var result = getMapData(this, key)['delete'](key);
        this.size -= result ? 1 : 0;
        return result;
      }

      module.exports = mapCacheDelete;
    }, {
      "./_getMapData": 41
    }],
    63: [function (require, module, exports) {
      var getMapData = require('./_getMapData');
      /**
       * Gets the map value for `key`.
       *
       * @private
       * @name get
       * @memberOf MapCache
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */


      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }

      module.exports = mapCacheGet;
    }, {
      "./_getMapData": 41
    }],
    64: [function (require, module, exports) {
      var getMapData = require('./_getMapData');
      /**
       * Checks if a map value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf MapCache
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */


      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }

      module.exports = mapCacheHas;
    }, {
      "./_getMapData": 41
    }],
    65: [function (require, module, exports) {
      var getMapData = require('./_getMapData');
      /**
       * Sets the map `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf MapCache
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the map cache instance.
       */


      function mapCacheSet(key, value) {
        var data = getMapData(this, key),
            size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }

      module.exports = mapCacheSet;
    }, {
      "./_getMapData": 41
    }],
    66: [function (require, module, exports) {
      var memoize = require('./memoize');
      /** Used as the maximum memoize cache size. */


      var MAX_MEMOIZE_SIZE = 500;
      /**
       * A specialized version of `_.memoize` which clears the memoized function's
       * cache when it exceeds `MAX_MEMOIZE_SIZE`.
       *
       * @private
       * @param {Function} func The function to have its output memoized.
       * @returns {Function} Returns the new memoized function.
       */

      function memoizeCapped(func) {
        var result = memoize(func, function (key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }

          return key;
        });
        var cache = result.cache;
        return result;
      }

      module.exports = memoizeCapped;
    }, {
      "./memoize": 94
    }],
    67: [function (require, module, exports) {
      var getNative = require('./_getNative');
      /* Built-in method references that are verified to be native. */


      var nativeCreate = getNative(Object, 'create');
      module.exports = nativeCreate;
    }, {
      "./_getNative": 42
    }],
    68: [function (require, module, exports) {
      var overArg = require('./_overArg');
      /* Built-in method references for those with the same name as other `lodash` methods. */


      var nativeKeys = overArg(Object.keys, Object);
      module.exports = nativeKeys;
    }, {
      "./_overArg": 71
    }],
    69: [function (require, module, exports) {
      var freeGlobal = require('./_freeGlobal');
      /** Detect free variable `exports`. */


      var freeExports = _typeof(exports) == 'object' && exports && !exports.nodeType && exports;
      /** Detect free variable `module`. */

      var freeModule = freeExports && _typeof(module) == 'object' && module && !module.nodeType && module;
      /** Detect the popular CommonJS extension `module.exports`. */

      var moduleExports = freeModule && freeModule.exports === freeExports;
      /** Detect free variable `process` from Node.js. */

      var freeProcess = moduleExports && freeGlobal.process;
      /** Used to access faster Node.js helpers. */

      var nodeUtil = function () {
        try {
          // Use `util.types` for Node.js 10+.
          var types = freeModule && freeModule.require && freeModule.require('util').types;

          if (types) {
            return types;
          } // Legacy `process.binding('util')` for Node.js < 10.


          return freeProcess && freeProcess.binding && freeProcess.binding('util');
        } catch (e) {}
      }();

      module.exports = nodeUtil;
    }, {
      "./_freeGlobal": 40
    }],
    70: [function (require, module, exports) {
      /** Used for built-in method references. */
      var objectProto = Object.prototype;
      /**
       * Used to resolve the
       * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
       * of values.
       */

      var nativeObjectToString = objectProto.toString;
      /**
       * Converts `value` to a string using `Object.prototype.toString`.
       *
       * @private
       * @param {*} value The value to convert.
       * @returns {string} Returns the converted string.
       */

      function objectToString(value) {
        return nativeObjectToString.call(value);
      }

      module.exports = objectToString;
    }, {}],
    71: [function (require, module, exports) {
      /**
       * Creates a unary function that invokes `func` with its argument transformed.
       *
       * @private
       * @param {Function} func The function to wrap.
       * @param {Function} transform The argument transform.
       * @returns {Function} Returns the new function.
       */
      function overArg(func, transform) {
        return function (arg) {
          return func(transform(arg));
        };
      }

      module.exports = overArg;
    }, {}],
    72: [function (require, module, exports) {
      var freeGlobal = require('./_freeGlobal');
      /** Detect free variable `self`. */


      var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
      /** Used as a reference to the global object. */

      var root = freeGlobal || freeSelf || Function('return this')();
      module.exports = root;
    }, {
      "./_freeGlobal": 40
    }],
    73: [function (require, module, exports) {
      var memoizeCapped = require('./_memoizeCapped');
      /** Used to match property names within property paths. */


      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      /** Used to match backslashes in property paths. */

      var reEscapeChar = /\\(\\)?/g;
      /**
       * Converts `string` to a property path array.
       *
       * @private
       * @param {string} string The string to convert.
       * @returns {Array} Returns the property path array.
       */

      var stringToPath = memoizeCapped(function (string) {
        var result = [];

        if (string.charCodeAt(0) === 46
        /* . */
        ) {
          result.push('');
        }

        string.replace(rePropName, function (match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
        });
        return result;
      });
      module.exports = stringToPath;
    }, {
      "./_memoizeCapped": 66
    }],
    74: [function (require, module, exports) {
      var isSymbol = require('./isSymbol');
      /** Used as references for various `Number` constants. */


      var INFINITY = 1 / 0;
      /**
       * Converts `value` to a string key if it's not a string or symbol.
       *
       * @private
       * @param {*} value The value to inspect.
       * @returns {string|symbol} Returns the key.
       */

      function toKey(value) {
        if (typeof value == 'string' || isSymbol(value)) {
          return value;
        }

        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

      module.exports = toKey;
    }, {
      "./isSymbol": 91
    }],
    75: [function (require, module, exports) {
      /** Used for built-in method references. */
      var funcProto = Function.prototype;
      /** Used to resolve the decompiled source of functions. */

      var funcToString = funcProto.toString;
      /**
       * Converts `func` to its source code.
       *
       * @private
       * @param {Function} func The function to convert.
       * @returns {string} Returns the source code.
       */

      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {}

          try {
            return func + '';
          } catch (e) {}
        }

        return '';
      }

      module.exports = toSource;
    }, {}],
    76: [function (require, module, exports) {
      /**
       * Performs a
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * comparison between two values to determine if they are equivalent.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       * @example
       *
       * var object = { 'a': 1 };
       * var other = { 'a': 1 };
       *
       * _.eq(object, object);
       * // => true
       *
       * _.eq(object, other);
       * // => false
       *
       * _.eq('a', 'a');
       * // => true
       *
       * _.eq('a', Object('a'));
       * // => false
       *
       * _.eq(NaN, NaN);
       * // => true
       */
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }

      module.exports = eq;
    }, {}],
    77: [function (require, module, exports) {
      var baseGet = require('./_baseGet');
      /**
       * Gets the value at `path` of `object`. If the resolved value is
       * `undefined`, the `defaultValue` is returned in its place.
       *
       * @static
       * @memberOf _
       * @since 3.7.0
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to get.
       * @param {*} [defaultValue] The value returned for `undefined` resolved values.
       * @returns {*} Returns the resolved value.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }] };
       *
       * _.get(object, 'a[0].b.c');
       * // => 3
       *
       * _.get(object, ['a', '0', 'b', 'c']);
       * // => 3
       *
       * _.get(object, 'a.b.c', 'default');
       * // => 'default'
       */


      function get(object, path, defaultValue) {
        var result = object == null ? undefined : baseGet(object, path);
        return result === undefined ? defaultValue : result;
      }

      module.exports = get;
    }, {
      "./_baseGet": 29
    }],
    78: [function (require, module, exports) {
      var baseIsArguments = require('./_baseIsArguments'),
          isObjectLike = require('./isObjectLike');
      /** Used for built-in method references. */


      var objectProto = Object.prototype;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /** Built-in value references. */

      var propertyIsEnumerable = objectProto.propertyIsEnumerable;
      /**
       * Checks if `value` is likely an `arguments` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an `arguments` object,
       *  else `false`.
       * @example
       *
       * _.isArguments(function() { return arguments; }());
       * // => true
       *
       * _.isArguments([1, 2, 3]);
       * // => false
       */

      var isArguments = baseIsArguments(function () {
        return arguments;
      }()) ? baseIsArguments : function (value) {
        return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
      };
      module.exports = isArguments;
    }, {
      "./_baseIsArguments": 31,
      "./isObjectLike": 88
    }],
    79: [function (require, module, exports) {
      /**
       * Checks if `value` is classified as an `Array` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an array, else `false`.
       * @example
       *
       * _.isArray([1, 2, 3]);
       * // => true
       *
       * _.isArray(document.body.children);
       * // => false
       *
       * _.isArray('abc');
       * // => false
       *
       * _.isArray(_.noop);
       * // => false
       */
      var isArray = Array.isArray;
      module.exports = isArray;
    }, {}],
    80: [function (require, module, exports) {
      var isFunction = require('./isFunction'),
          isLength = require('./isLength');
      /**
       * Checks if `value` is array-like. A value is considered array-like if it's
       * not a function and has a `value.length` that's an integer greater than or
       * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
       * @example
       *
       * _.isArrayLike([1, 2, 3]);
       * // => true
       *
       * _.isArrayLike(document.body.children);
       * // => true
       *
       * _.isArrayLike('abc');
       * // => true
       *
       * _.isArrayLike(_.noop);
       * // => false
       */


      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }

      module.exports = isArrayLike;
    }, {
      "./isFunction": 83,
      "./isLength": 84
    }],
    81: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var boolTag = '[object Boolean]';
      /**
       * Checks if `value` is classified as a boolean primitive or object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
       * @example
       *
       * _.isBoolean(false);
       * // => true
       *
       * _.isBoolean(null);
       * // => false
       */

      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }

      module.exports = isBoolean;
    }, {
      "./_baseGetTag": 30,
      "./isObjectLike": 88
    }],
    82: [function (require, module, exports) {
      var root = require('./_root'),
          stubFalse = require('./stubFalse');
      /** Detect free variable `exports`. */


      var freeExports = _typeof(exports) == 'object' && exports && !exports.nodeType && exports;
      /** Detect free variable `module`. */

      var freeModule = freeExports && _typeof(module) == 'object' && module && !module.nodeType && module;
      /** Detect the popular CommonJS extension `module.exports`. */

      var moduleExports = freeModule && freeModule.exports === freeExports;
      /** Built-in value references. */

      var Buffer = moduleExports ? root.Buffer : undefined;
      /* Built-in method references for those with the same name as other `lodash` methods. */

      var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
      /**
       * Checks if `value` is a buffer.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
       * @example
       *
       * _.isBuffer(new Buffer(2));
       * // => true
       *
       * _.isBuffer(new Uint8Array(2));
       * // => false
       */

      var isBuffer = nativeIsBuffer || stubFalse;
      module.exports = isBuffer;
    }, {
      "./_root": 72,
      "./stubFalse": 95
    }],
    83: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isObject = require('./isObject');
      /** `Object#toString` result references. */


      var asyncTag = '[object AsyncFunction]',
          funcTag = '[object Function]',
          genTag = '[object GeneratorFunction]',
          proxyTag = '[object Proxy]';
      /**
       * Checks if `value` is classified as a `Function` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a function, else `false`.
       * @example
       *
       * _.isFunction(_);
       * // => true
       *
       * _.isFunction(/abc/);
       * // => false
       */

      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        } // The use of `Object#toString` avoids issues with the `typeof` operator
        // in Safari 9 which returns 'object' for typed arrays and other constructors.


        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }

      module.exports = isFunction;
    }, {
      "./_baseGetTag": 30,
      "./isObject": 87
    }],
    84: [function (require, module, exports) {
      /** Used as references for various `Number` constants. */
      var MAX_SAFE_INTEGER = 9007199254740991;
      /**
       * Checks if `value` is a valid array-like length.
       *
       * **Note:** This method is loosely based on
       * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
       * @example
       *
       * _.isLength(3);
       * // => true
       *
       * _.isLength(Number.MIN_VALUE);
       * // => false
       *
       * _.isLength(Infinity);
       * // => false
       *
       * _.isLength('3');
       * // => false
       */

      function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }

      module.exports = isLength;
    }, {}],
    85: [function (require, module, exports) {
      /**
       * Checks if `value` is `null` or `undefined`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
       * @example
       *
       * _.isNil(null);
       * // => true
       *
       * _.isNil(void 0);
       * // => true
       *
       * _.isNil(NaN);
       * // => false
       */
      function isNil(value) {
        return value == null;
      }

      module.exports = isNil;
    }, {}],
    86: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var numberTag = '[object Number]';
      /**
       * Checks if `value` is classified as a `Number` primitive or object.
       *
       * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
       * classified as numbers, use the `_.isFinite` method.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a number, else `false`.
       * @example
       *
       * _.isNumber(3);
       * // => true
       *
       * _.isNumber(Number.MIN_VALUE);
       * // => true
       *
       * _.isNumber(Infinity);
       * // => true
       *
       * _.isNumber('3');
       * // => false
       */

      function isNumber(value) {
        return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
      }

      module.exports = isNumber;
    }, {
      "./_baseGetTag": 30,
      "./isObjectLike": 88
    }],
    87: [function (require, module, exports) {
      /**
       * Checks if `value` is the
       * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
       * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an object, else `false`.
       * @example
       *
       * _.isObject({});
       * // => true
       *
       * _.isObject([1, 2, 3]);
       * // => true
       *
       * _.isObject(_.noop);
       * // => true
       *
       * _.isObject(null);
       * // => false
       */
      function isObject(value) {
        var type = _typeof(value);

        return value != null && (type == 'object' || type == 'function');
      }

      module.exports = isObject;
    }, {}],
    88: [function (require, module, exports) {
      /**
       * Checks if `value` is object-like. A value is object-like if it's not `null`
       * and has a `typeof` result of "object".
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
       * @example
       *
       * _.isObjectLike({});
       * // => true
       *
       * _.isObjectLike([1, 2, 3]);
       * // => true
       *
       * _.isObjectLike(_.noop);
       * // => false
       *
       * _.isObjectLike(null);
       * // => false
       */
      function isObjectLike(value) {
        return value != null && _typeof(value) == 'object';
      }

      module.exports = isObjectLike;
    }, {}],
    89: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          getPrototype = require('./_getPrototype'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var objectTag = '[object Object]';
      /** Used for built-in method references. */

      var funcProto = Function.prototype,
          objectProto = Object.prototype;
      /** Used to resolve the decompiled source of functions. */

      var funcToString = funcProto.toString;
      /** Used to check objects for own properties. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /** Used to infer the `Object` constructor. */

      var objectCtorString = funcToString.call(Object);
      /**
       * Checks if `value` is a plain object, that is, an object created by the
       * `Object` constructor or one with a `[[Prototype]]` of `null`.
       *
       * @static
       * @memberOf _
       * @since 0.8.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       * }
       *
       * _.isPlainObject(new Foo);
       * // => false
       *
       * _.isPlainObject([1, 2, 3]);
       * // => false
       *
       * _.isPlainObject({ 'x': 0, 'y': 0 });
       * // => true
       *
       * _.isPlainObject(Object.create(null));
       * // => true
       */

      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }

        var proto = getPrototype(value);

        if (proto === null) {
          return true;
        }

        var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }

      module.exports = isPlainObject;
    }, {
      "./_baseGetTag": 30,
      "./_getPrototype": 43,
      "./isObjectLike": 88
    }],
    90: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isArray = require('./isArray'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var stringTag = '[object String]';
      /**
       * Checks if `value` is classified as a `String` primitive or object.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a string, else `false`.
       * @example
       *
       * _.isString('abc');
       * // => true
       *
       * _.isString(1);
       * // => false
       */

      function isString(value) {
        return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }

      module.exports = isString;
    }, {
      "./_baseGetTag": 30,
      "./isArray": 79,
      "./isObjectLike": 88
    }],
    91: [function (require, module, exports) {
      var baseGetTag = require('./_baseGetTag'),
          isObjectLike = require('./isObjectLike');
      /** `Object#toString` result references. */


      var symbolTag = '[object Symbol]';
      /**
       * Checks if `value` is classified as a `Symbol` primitive or object.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
       * @example
       *
       * _.isSymbol(Symbol.iterator);
       * // => true
       *
       * _.isSymbol('abc');
       * // => false
       */

      function isSymbol(value) {
        return _typeof(value) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }

      module.exports = isSymbol;
    }, {
      "./_baseGetTag": 30,
      "./isObjectLike": 88
    }],
    92: [function (require, module, exports) {
      var baseIsTypedArray = require('./_baseIsTypedArray'),
          baseUnary = require('./_baseUnary'),
          nodeUtil = require('./_nodeUtil');
      /* Node.js helper references. */


      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      /**
       * Checks if `value` is classified as a typed array.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
       * @example
       *
       * _.isTypedArray(new Uint8Array);
       * // => true
       *
       * _.isTypedArray([]);
       * // => false
       */

      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      module.exports = isTypedArray;
    }, {
      "./_baseIsTypedArray": 33,
      "./_baseUnary": 37,
      "./_nodeUtil": 69
    }],
    93: [function (require, module, exports) {
      var arrayLikeKeys = require('./_arrayLikeKeys'),
          baseKeys = require('./_baseKeys'),
          isArrayLike = require('./isArrayLike');
      /**
       * Creates an array of the own enumerable property names of `object`.
       *
       * **Note:** Non-object values are coerced to objects. See the
       * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
       * for more details.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.keys(new Foo);
       * // => ['a', 'b'] (iteration order is not guaranteed)
       *
       * _.keys('hi');
       * // => ['0', '1']
       */


      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }

      module.exports = keys;
    }, {
      "./_arrayLikeKeys": 26,
      "./_baseKeys": 34,
      "./isArrayLike": 80
    }],
    94: [function (require, module, exports) {
      var MapCache = require('./_MapCache');
      /** Error message constants. */


      var FUNC_ERROR_TEXT = 'Expected a function';
      /**
       * Creates a function that memoizes the result of `func`. If `resolver` is
       * provided, it determines the cache key for storing the result based on the
       * arguments provided to the memoized function. By default, the first argument
       * provided to the memoized function is used as the map cache key. The `func`
       * is invoked with the `this` binding of the memoized function.
       *
       * **Note:** The cache is exposed as the `cache` property on the memoized
       * function. Its creation may be customized by replacing the `_.memoize.Cache`
       * constructor with one whose instances implement the
       * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
       * method interface of `clear`, `delete`, `get`, `has`, and `set`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to have its output memoized.
       * @param {Function} [resolver] The function to resolve the cache key.
       * @returns {Function} Returns the new memoized function.
       * @example
       *
       * var object = { 'a': 1, 'b': 2 };
       * var other = { 'c': 3, 'd': 4 };
       *
       * var values = _.memoize(_.values);
       * values(object);
       * // => [1, 2]
       *
       * values(other);
       * // => [3, 4]
       *
       * object.a = 2;
       * values(object);
       * // => [1, 2]
       *
       * // Modify the result cache.
       * values.cache.set(object, ['a', 'b']);
       * values(object);
       * // => ['a', 'b']
       *
       * // Replace `_.memoize.Cache`.
       * _.memoize.Cache = WeakMap;
       */

      function memoize(func, resolver) {
        if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        var memoized = function memoized() {
          var args = arguments,
              key = resolver ? resolver.apply(this, args) : args[0],
              cache = memoized.cache;

          if (cache.has(key)) {
            return cache.get(key);
          }

          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };

        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      } // Expose `MapCache`.


      memoize.Cache = MapCache;
      module.exports = memoize;
    }, {
      "./_MapCache": 24
    }],
    95: [function (require, module, exports) {
      /**
       * This method returns `false`.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {boolean} Returns `false`.
       * @example
       *
       * _.times(2, _.stubFalse);
       * // => [false, false]
       */
      function stubFalse() {
        return false;
      }

      module.exports = stubFalse;
    }, {}],
    96: [function (require, module, exports) {
      var baseToString = require('./_baseToString');
      /**
       * Converts `value` to a string. An empty string is returned for `null`
       * and `undefined` values. The sign of `-0` is preserved.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {string} Returns the converted string.
       * @example
       *
       * _.toString(null);
       * // => ''
       *
       * _.toString(-0);
       * // => '-0'
       *
       * _.toString([1, 2, 3]);
       * // => '1,2,3'
       */


      function toString(value) {
        return value == null ? '' : baseToString(value);
      }

      module.exports = toString;
    }, {
      "./_baseToString": 36
    }],
    "airtable": [function (require, module, exports) {
      "use strict";

      var __importDefault = this && this.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };

      var base_1 = __importDefault(require("./base"));

      var record_1 = __importDefault(require("./record"));

      var table_1 = __importDefault(require("./table"));

      var airtable_error_1 = __importDefault(require("./airtable_error"));

      var Airtable =
      /** @class */
      function () {
        function Airtable(opts) {
          if (opts === void 0) {
            opts = {};
          }

          var defaultConfig = Airtable.default_config();
          var apiVersion = opts.apiVersion || Airtable.apiVersion || defaultConfig.apiVersion;
          Object.defineProperties(this, {
            _apiKey: {
              value: opts.apiKey || Airtable.apiKey || defaultConfig.apiKey
            },
            _apiVersion: {
              value: apiVersion
            },
            _apiVersionMajor: {
              value: apiVersion.split('.')[0]
            },
            _customHeaders: {
              value: opts.customHeaders || {}
            },
            _endpointUrl: {
              value: opts.endpointUrl || Airtable.endpointUrl || defaultConfig.endpointUrl
            },
            _noRetryIfRateLimited: {
              value: opts.noRetryIfRateLimited || Airtable.noRetryIfRateLimited || defaultConfig.noRetryIfRateLimited
            },
            _requestTimeout: {
              value: opts.requestTimeout || Airtable.requestTimeout || defaultConfig.requestTimeout
            }
          });

          if (!this._apiKey) {
            throw new Error('An API key is required to connect to Airtable');
          }
        }

        Airtable.prototype.base = function (baseId) {
          return base_1.default.createFunctor(this, baseId);
        };

        Airtable.default_config = function () {
          return {
            endpointUrl: undefined || 'https://api.airtable.com',
            apiVersion: '0.1.0',
            apiKey: undefined,
            noRetryIfRateLimited: false,
            requestTimeout: 300 * 1000
          };
        };

        Airtable.configure = function (_a) {
          var apiKey = _a.apiKey,
              endpointUrl = _a.endpointUrl,
              apiVersion = _a.apiVersion,
              noRetryIfRateLimited = _a.noRetryIfRateLimited,
              requestTimeout = _a.requestTimeout;
          Airtable.apiKey = apiKey;
          Airtable.endpointUrl = endpointUrl;
          Airtable.apiVersion = apiVersion;
          Airtable.noRetryIfRateLimited = noRetryIfRateLimited;
          Airtable.requestTimeout = requestTimeout;
        };

        Airtable.base = function (baseId) {
          return new Airtable().base(baseId);
        };

        Airtable.Base = base_1.default;
        Airtable.Record = record_1.default;
        Airtable.Table = table_1.default;
        Airtable.Error = airtable_error_1.default;
        return Airtable;
      }();

      module.exports = Airtable;
    }, {
      "./airtable_error": 2,
      "./base": 3,
      "./record": 15,
      "./table": 17
    }]
  }, {}, ["airtable"])("airtable");
});
},{"buffer":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _airtable = _interopRequireDefault(require("airtable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log('hello world poop hi hi '); // airtable configs

var base = new _airtable.default({
  apiKey: 'keymozIRq1SpsUPa6'
}).base('appIn0GQksTbRvLRb'); // List Dice Steps Records

var table = base('Dice Steps');

var getRecords = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var records;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return table.select({
              // Only data for fields whose names are in this list will be included in the result.
              fields: ['Dice', 'Dice Quality']
            }).eachPage(function page(records, fetchNextPage) {
              records.forEach(function (record) {
                console.log('retrieved', record.get('Dice')); // Print Records into a list

                var diceStep = record.get('Dice');
                var ul = document.getElementById('dice-list');
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(diceStep));
                ul.appendChild(li);
              });
            });

          case 2:
            records = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getRecords() {
    return _ref.apply(this, arguments);
  };
}();

getRecords();
},{"airtable":"node_modules/airtable/lib/airtable.umd.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53740" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/wyrd.e31bb0bc.js.map