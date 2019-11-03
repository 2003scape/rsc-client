(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

(async () => {
    const mcCanvas = document.createElement('canvas');
    const args = window.location.hash.slice(1).split(',');
    const mc = new mudclient(mcCanvas);

    mc.options.middleClickCamera = true;
    mc.options.mouseWheel = true;

    mc.members = args[0] === 'members';
    mc.server = args[1] ? args[1] : '127.0.0.1';
    mc.port = args[2] && !isNaN(+args[2]) ? +args[2] : 43595;

    mc.threadSleep = 10;

    document.body.appendChild(mcCanvas);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower', false);
})();
},{"./src/mudclient":25}],2:[function(require,module,exports){
(function (global, factory) {typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :typeof define === 'function' && define.amd ? define(['exports'], factory) :(factory((global.alawmulaw = {})));}(this, (function (exports) {;'use strict';Object.defineProperty(exports, '__esModule', { value: true });var alawmulaw=function(exports){/** @const @type {!Array<number>} */ var LOG_TABLE=[1,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/**
 @param {number} sample
 @return {number}
 */
function encodeSample(sample){/** @type {number} */ var compandedValue;sample=sample==-32768?-32767:sample;/** @type {number} */ var sign=~sample>>8&128;if(!sign)sample=sample*-1;if(sample>32635)sample=32635;if(sample>=256){/** @type {number} */ var exponent=LOG_TABLE[sample>>8&127];/** @type {number} */ var mantissa=sample>>exponent+3&15;compandedValue=exponent<<4|mantissa}else compandedValue=sample>>4;return compandedValue^(sign^85)}/**
 @param {number} aLawSample
 @return {number}
 */
function decodeSample(aLawSample){/** @type {number} */ var sign=0;aLawSample^=85;if(aLawSample&128){aLawSample&=~(1<<7);sign=-1}/** @type {number} */ var position=((aLawSample&240)>>4)+4;/** @type {number} */ var decoded=0;if(position!=4)decoded=1<<position|(aLawSample&15)<<position-4|1<<position-5;else decoded=aLawSample<<1|1;decoded=sign===0?decoded:-decoded;return decoded*8*-1}/**
 @param {!Int16Array} samples
 @return {!Uint8Array}
 */
function encode(samples){/** @type {!Uint8Array} */ var aLawSamples=new Uint8Array(samples.length);for(var i=0;i<samples.length;i++)aLawSamples[i]=encodeSample(samples[i]);return aLawSamples}/**
 @param {!Uint8Array} samples
 @return {!Int16Array}
 */
function decode(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample(samples[i]);return pcmSamples}var alaw=Object.freeze({encodeSample:encodeSample,decodeSample:decodeSample,encode:encode,decode:decode});/** @private @const @type {number} */ var BIAS=132;/** @private @const @type {number} */ var CLIP=32635;/** @private @const @type {Array<number>} */ var encodeTable=[0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/** @private @const @type {Array<number>} */ var decodeTable=
[0,132,396,924,1980,4092,8316,16764];/**
 @param {number} sample
 @return {number}
 */
function encodeSample$1(sample){/** @type {number} */ var sign;/** @type {number} */ var exponent;/** @type {number} */ var mantissa;/** @type {number} */ var muLawSample;sign=sample>>8&128;if(sign!=0)sample=-sample;if(sample>CLIP)sample=CLIP;sample=sample+BIAS;exponent=encodeTable[sample>>7&255];mantissa=sample>>exponent+3&15;muLawSample=~(sign|exponent<<4|mantissa);return muLawSample}/**
 @param {number} muLawSample
 @return {number}
 */
function decodeSample$1(muLawSample){/** @type {number} */ var sign;/** @type {number} */ var exponent;/** @type {number} */ var mantissa;/** @type {number} */ var sample;muLawSample=~muLawSample;sign=muLawSample&128;exponent=muLawSample>>4&7;mantissa=muLawSample&15;sample=decodeTable[exponent]+(mantissa<<exponent+3);if(sign!=0)sample=-sample;return sample}/**
 @param {!Int16Array} samples
 @return {!Uint8Array}
 */
function encode$1(samples){/** @type {!Uint8Array} */ var muLawSamples=new Uint8Array(samples.length);for(var i=0;i<samples.length;i++)muLawSamples[i]=encodeSample$1(samples[i]);return muLawSamples}/**
 @param {!Uint8Array} samples
 @return {!Int16Array}
 */
function decode$1(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample$1(samples[i]);return pcmSamples}var mulaw=Object.freeze({encodeSample:encodeSample$1,decodeSample:decodeSample$1,encode:encode$1,decode:decode$1});exports.alaw=alaw;exports.mulaw=mulaw;return exports}({});exports.alaw = alawmulaw.alaw;exports.mulaw = alawmulaw.mulaw;})));

},{}],3:[function(require,module,exports){
"use strict"

function iota(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = i
  }
  return result
}

module.exports = iota
},{}],4:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],5:[function(require,module,exports){
module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};

},{}],6:[function(require,module,exports){
var iota = require("iota-array")
var isBuffer = require("is-buffer")

var hasTypedArrays  = ((typeof Float64Array) !== "undefined")

function compare1st(a, b) {
  return a[0] - b[0]
}

function order() {
  var stride = this.stride
  var terms = new Array(stride.length)
  var i
  for(i=0; i<terms.length; ++i) {
    terms[i] = [Math.abs(stride[i]), i]
  }
  terms.sort(compare1st)
  var result = new Array(terms.length)
  for(i=0; i<result.length; ++i) {
    result[i] = terms[i][1]
  }
  return result
}

function compileConstructor(dtype, dimension) {
  var className = ["View", dimension, "d", dtype].join("")
  if(dimension < 0) {
    className = "View_Nil" + dtype
  }
  var useGetters = (dtype === "generic")

  if(dimension === -1) {
    //Special case for trivial arrays
    var code =
      "function "+className+"(a){this.data=a;};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return -1};\
proto.size=0;\
proto.dimension=-1;\
proto.shape=proto.stride=proto.order=[];\
proto.lo=proto.hi=proto.transpose=proto.step=\
function(){return new "+className+"(this.data);};\
proto.get=proto.set=function(){};\
proto.pick=function(){return null};\
return function construct_"+className+"(a){return new "+className+"(a);}"
    var procedure = new Function(code)
    return procedure()
  } else if(dimension === 0) {
    //Special case for 0d arrays
    var code =
      "function "+className+"(a,d) {\
this.data = a;\
this.offset = d\
};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return this.offset};\
proto.dimension=0;\
proto.size=1;\
proto.shape=\
proto.stride=\
proto.order=[];\
proto.lo=\
proto.hi=\
proto.transpose=\
proto.step=function "+className+"_copy() {\
return new "+className+"(this.data,this.offset)\
};\
proto.pick=function "+className+"_pick(){\
return TrivialArray(this.data);\
};\
proto.valueOf=proto.get=function "+className+"_get(){\
return "+(useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]")+
"};\
proto.set=function "+className+"_set(v){\
return "+(useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v")+"\
};\
return function construct_"+className+"(a,b,c,d){return new "+className+"(a,d)}"
    var procedure = new Function("TrivialArray", code)
    return procedure(CACHED_CONSTRUCTORS[dtype][0])
  }

  var code = ["'use strict'"]

  //Create constructor for view
  var indices = iota(dimension)
  var args = indices.map(function(i) { return "i"+i })
  var index_str = "this.offset+" + indices.map(function(i) {
        return "this.stride[" + i + "]*i" + i
      }).join("+")
  var shapeArg = indices.map(function(i) {
      return "b"+i
    }).join(",")
  var strideArg = indices.map(function(i) {
      return "c"+i
    }).join(",")
  code.push(
    "function "+className+"(a," + shapeArg + "," + strideArg + ",d){this.data=a",
      "this.shape=[" + shapeArg + "]",
      "this.stride=[" + strideArg + "]",
      "this.offset=d|0}",
    "var proto="+className+".prototype",
    "proto.dtype='"+dtype+"'",
    "proto.dimension="+dimension)

  //view.size:
  code.push("Object.defineProperty(proto,'size',{get:function "+className+"_size(){\
return "+indices.map(function(i) { return "this.shape["+i+"]" }).join("*"),
"}})")

  //view.order:
  if(dimension === 1) {
    code.push("proto.order=[0]")
  } else {
    code.push("Object.defineProperty(proto,'order',{get:")
    if(dimension < 4) {
      code.push("function "+className+"_order(){")
      if(dimension === 2) {
        code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})")
      } else if(dimension === 3) {
        code.push(
"var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);\
if(s0>s1){\
if(s1>s2){\
return [2,1,0];\
}else if(s0>s2){\
return [1,2,0];\
}else{\
return [1,0,2];\
}\
}else if(s0>s2){\
return [2,0,1];\
}else if(s2>s1){\
return [0,1,2];\
}else{\
return [0,2,1];\
}}})")
      }
    } else {
      code.push("ORDER})")
    }
  }

  //view.set(i0, ..., v):
  code.push(
"proto.set=function "+className+"_set("+args.join(",")+",v){")
  if(useGetters) {
    code.push("return this.data.set("+index_str+",v)}")
  } else {
    code.push("return this.data["+index_str+"]=v}")
  }

  //view.get(i0, ...):
  code.push("proto.get=function "+className+"_get("+args.join(",")+"){")
  if(useGetters) {
    code.push("return this.data.get("+index_str+")}")
  } else {
    code.push("return this.data["+index_str+"]}")
  }

  //view.index:
  code.push(
    "proto.index=function "+className+"_index(", args.join(), "){return "+index_str+"}")

  //view.hi():
  code.push("proto.hi=function "+className+"_hi("+args.join(",")+"){return new "+className+"(this.data,"+
    indices.map(function(i) {
      return ["(typeof i",i,"!=='number'||i",i,"<0)?this.shape[", i, "]:i", i,"|0"].join("")
    }).join(",")+","+
    indices.map(function(i) {
      return "this.stride["+i + "]"
    }).join(",")+",this.offset)}")

  //view.lo():
  var a_vars = indices.map(function(i) { return "a"+i+"=this.shape["+i+"]" })
  var c_vars = indices.map(function(i) { return "c"+i+"=this.stride["+i+"]" })
  code.push("proto.lo=function "+className+"_lo("+args.join(",")+"){var b=this.offset,d=0,"+a_vars.join(",")+","+c_vars.join(","))
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'&&i"+i+">=0){\
d=i"+i+"|0;\
b+=c"+i+"*d;\
a"+i+"-=d}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a"+i
    }).join(",")+","+
    indices.map(function(i) {
      return "c"+i
    }).join(",")+",b)}")

  //view.step():
  code.push("proto.step=function "+className+"_step("+args.join(",")+"){var "+
    indices.map(function(i) {
      return "a"+i+"=this.shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "b"+i+"=this.stride["+i+"]"
    }).join(",")+",c=this.offset,d=0,ceil=Math.ceil")
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'){\
d=i"+i+"|0;\
if(d<0){\
c+=b"+i+"*(a"+i+"-1);\
a"+i+"=ceil(-a"+i+"/d)\
}else{\
a"+i+"=ceil(a"+i+"/d)\
}\
b"+i+"*=d\
}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a" + i
    }).join(",")+","+
    indices.map(function(i) {
      return "b" + i
    }).join(",")+",c)}")

  //view.transpose():
  var tShape = new Array(dimension)
  var tStride = new Array(dimension)
  for(var i=0; i<dimension; ++i) {
    tShape[i] = "a[i"+i+"]"
    tStride[i] = "b[i"+i+"]"
  }
  code.push("proto.transpose=function "+className+"_transpose("+args+"){"+
    args.map(function(n,idx) { return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)"}).join(";"),
    "var a=this.shape,b=this.stride;return new "+className+"(this.data,"+tShape.join(",")+","+tStride.join(",")+",this.offset)}")

  //view.pick():
  code.push("proto.pick=function "+className+"_pick("+args+"){var a=[],b=[],c=this.offset")
  for(var i=0; i<dimension; ++i) {
    code.push("if(typeof i"+i+"==='number'&&i"+i+">=0){c=(c+this.stride["+i+"]*i"+i+")|0}else{a.push(this.shape["+i+"]);b.push(this.stride["+i+"])}")
  }
  code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}")

  //Add return statement
  code.push("return function construct_"+className+"(data,shape,stride,offset){return new "+className+"(data,"+
    indices.map(function(i) {
      return "shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "stride["+i+"]"
    }).join(",")+",offset)}")

  //Compile procedure
  var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"))
  return procedure(CACHED_CONSTRUCTORS[dtype], order)
}

function arrayDType(data) {
  if(isBuffer(data)) {
    return "buffer"
  }
  if(hasTypedArrays) {
    switch(Object.prototype.toString.call(data)) {
      case "[object Float64Array]":
        return "float64"
      case "[object Float32Array]":
        return "float32"
      case "[object Int8Array]":
        return "int8"
      case "[object Int16Array]":
        return "int16"
      case "[object Int32Array]":
        return "int32"
      case "[object Uint8Array]":
        return "uint8"
      case "[object Uint16Array]":
        return "uint16"
      case "[object Uint32Array]":
        return "uint32"
      case "[object Uint8ClampedArray]":
        return "uint8_clamped"
    }
  }
  if(Array.isArray(data)) {
    return "array"
  }
  return "generic"
}

var CACHED_CONSTRUCTORS = {
  "float32":[],
  "float64":[],
  "int8":[],
  "int16":[],
  "int32":[],
  "uint8":[],
  "uint16":[],
  "uint32":[],
  "array":[],
  "uint8_clamped":[],
  "buffer":[],
  "generic":[]
}

;(function() {
  for(var id in CACHED_CONSTRUCTORS) {
    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1))
  }
});

function wrappedNDArrayCtor(data, shape, stride, offset) {
  if(data === undefined) {
    var ctor = CACHED_CONSTRUCTORS.array[0]
    return ctor([])
  } else if(typeof data === "number") {
    data = [data]
  }
  if(shape === undefined) {
    shape = [ data.length ]
  }
  var d = shape.length
  if(stride === undefined) {
    stride = new Array(d)
    for(var i=d-1, sz=1; i>=0; --i) {
      stride[i] = sz
      sz *= shape[i]
    }
  }
  if(offset === undefined) {
    offset = 0
    for(var i=0; i<d; ++i) {
      if(stride[i] < 0) {
        offset -= (shape[i]-1)*stride[i]
      }
    }
  }
  var dtype = arrayDType(data)
  var ctor_list = CACHED_CONSTRUCTORS[dtype]
  while(ctor_list.length <= d+1) {
    ctor_list.push(compileConstructor(dtype, ctor_list.length-1))
  }
  var ctor = ctor_list[d+1]
  return ctor(data, shape, stride, offset)
}

module.exports = wrappedNDArrayCtor

},{"iota-array":3,"is-buffer":4}],7:[function(require,module,exports){
'use strict';var cachedSetTimeout=setTimeout;function createSleepPromise(a,b){var c=b.useCachedSetTimeout,d=c?cachedSetTimeout:setTimeout;return new Promise(function(b){d(b,a)})}function sleep(a){function b(a){return e.then(function(){return a})}var c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},d=c.useCachedSetTimeout,e=createSleepPromise(a,{useCachedSetTimeout:d});return b.then=function(){return e.then.apply(e,arguments)},b.catch=Promise.resolve().catch,b}module.exports=sleep;

},{}],8:[function(require,module,exports){
function init2DInt8Array(x, y) {
    const a = [];

    for (let i = 0; i < x; i += 1) {
        a.push(new Int8Array(y));
    }

    return a;
}

function init2DInt32Array(x, y) {
    const a = [];

    for (let i = 0; i < x; i += 1) {
        a.push(new Int32Array(y));
    }

    return a;
}

class BZState {
    constructor() {
        this.tt = null; // Int32Array
        this.input = null; // Int8Array
        this.nextIn = 0;
        this.availIn = 0;
        this.totalInLo32 = 0;
        this.totalInHi32 = 0;
        this.output = null; // Int8Array
        this.availOut = 0;
        this.decompressedSize = 0;
        this.totalOutLo32 = 0;
        this.totalOutHi32 = 0;
        this.stateOutCh = 0; // char
        this.stateOutLen = 0;
        this.blockRandomised = false;
        this.bsBuff = 0;
        this.bsLive = 0;
        this.blocksize100k = 0;
        this.blockNo = 0;
        this.origPtr = 0;
        this.tpos = 0;
        this.k0 = 0;
        this.nblockUsed = 0;
        this.nInUse = 0;
        this.saveNblock = 0;

        this.unzftab = new Int32Array(256); 
        this.cftab = new Int32Array(257); 
        this.inUse = new Int8Array(256); // this was a bool[]
        this.inUse_16 = new Int8Array(16); 
        this.setToUnseq = new Int8Array(256); 
        this.mtfa = new Int8Array(4096);
        this.mtfbase = new Int32Array(16);
        this.selector = new Int8Array(18002); 
        this.selectorMtf = new Int8Array(18002); 

        this.len = init2DInt8Array(6, 258);
        this.limit = init2DInt32Array(6, 258);
        this.base = init2DInt32Array(6, 258);
        this.perm = init2DInt32Array(6, 258);

        this.minLens = new Int32Array(6);
    }
}

// TODO should we just use functions here instead? it's all static.
class BZLib {
    static decompress(out, outSize, input, inSize, offset) {
        let block = new BZState();

        block.input = input;
        block.nextIn = offset;
        block.output = out;
        block.availOut = 0;
        block.availIn = inSize;
        block.decompressedSize = outSize;
        block.bsLive = 0;
        block.bsBuff = 0;
        block.totalInLo32 = 0;
        block.totalInHi32 = 0;
        block.totalOutLo32 = 0;
        block.totalOutHi32 = 0;
        block.blockNo = 0;
        BZLib.decompressState(block);
        outSize -= block.decompressedSize;

        return outSize;
    }

    static nextHeader(state) {
        let cStateOutCh = state.stateOutCh;
        let cStateOutLen = state.stateOutLen;
        let cNblockUsed = state.nblockUsed;
        let cK0 = state.k0;
        let cTt = state.tt;
        let cTpos = state.tpos;
        let output = state.output;
        let csNextOut = state.availOut;
        let csAvailOut = state.decompressedSize;
        let asdasdasd = csAvailOut;
        let sSaveNblockPP = state.saveNblock + 1;

        returnNotr:
        do {
            if (cStateOutLen > 0) {
                do {
                    if (csAvailOut === 0) {
                        break returnNotr;
                    }

                    if (cStateOutLen === 1) {
                        break;
                    }

                    output[csNextOut] = cStateOutCh;
                    cStateOutLen--;
                    csNextOut++;
                    csAvailOut--;
                } while (true);

                if (csAvailOut === 0) {
                    cStateOutLen = 1;
                    break;
                }

                output[csNextOut] = cStateOutCh;
                csNextOut++;
                csAvailOut--;
            }

            let flag = true;

            while (flag) {
                flag = false;

                if (cNblockUsed === sSaveNblockPP) {
                    cStateOutLen = 0;
                    break returnNotr;
                }

                cStateOutCh = cK0 & 0xff;
                cTpos = cTt[cTpos];
                let k1 = cTpos & 0xff;
                cTpos >>= 8;
                cNblockUsed++;

                if (k1 !== cK0) {
                    cK0 = k1;

                    if (csAvailOut === 0) {
                        cStateOutLen = 1;
                    } else {
                        output[csNextOut] = cStateOutCh;
                        csNextOut++;
                        csAvailOut--;
                        flag = true;
                        continue;
                    }

                    break returnNotr;
                }

                if (cNblockUsed !== sSaveNblockPP) {
                    continue;
                }

                if (csAvailOut === 0) {
                    cStateOutLen = 1;
                    break returnNotr;
                }

                output[csNextOut] = cStateOutCh;
                csNextOut++;
                csAvailOut--;
                flag = true;
            }

            cStateOutLen = 2;
            cTpos = cTt[cTpos];
            let k2 = cTpos & 0xff;
            cTpos >>= 8;

            if (++cNblockUsed !== sSaveNblockPP) {
                if (k2 !== cK0) {
                    cK0 = k2;
                } else {
                    cStateOutLen = 3;
                    cTpos = cTt[cTpos];
                    let k3 = cTpos & 0xff;
                    cTpos >>= 8;

                    if (++cNblockUsed !== sSaveNblockPP) {
                        if (k3 !== cK0) {
                            cK0 = k3;
                        } else {
                            cTpos = cTt[cTpos];
                            let byte3 = cTpos & 0xff;
                            cTpos >>= 8;
                            cNblockUsed++;
                            cStateOutLen = (byte3 & 0xff) + 4;
                            cTpos = cTt[cTpos];
                            cK0 = cTpos & 0xff;
                            cTpos >>= 8;
                            cNblockUsed++;
                        }
                    }
                }
            }
        } while (true);

        let i2 = state.totalOutLo32;
        state.totalOutLo32 += asdasdasd - csAvailOut;

        if (state.totalOutLo32 < i2) {
            state.totalOutHi32++;
        }

        state.stateOutCh = cStateOutCh;
        state.stateOutLen = cStateOutLen;
        state.nblockUsed = cNblockUsed;
        state.k0 = cK0;
        state.tt = cTt;
        state.tpos = cTpos;
        state.output = output;
        state.availOut = csNextOut;
        state.decompressedSize = csAvailOut;
    }

    static decompressState(state) {
        let gMinLen = 0;
        let gLimit = null;
        let gBase = null;
        let gPerm = null;

        state.blocksize100k = 1;

        if (state.tt === null) {
            state.tt = new Int32Array(state.blocksize100k * 100000);
        }

        let goingandshit = true;

        while (goingandshit) {
            let uc = BZLib.getUChar(state);

            if (uc === 23) {
                return;
            }

            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            state.blockNo++;
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getBit(state);
            state.blockRandomised = uc !== 0;

            if (state.blockRandomised) {
                console.log('PANIC! RANDOMISED BLOCK!');
            }

            state.origPtr = 0;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;

            for (let i = 0; i < 16; i++) {
                uc = BZLib.getBit(state);
                state.inUse_16[i] = uc === 1;
            }

            for (let i = 0; i < 256; i++) {
                state.inUse[i] = false;
            }

            for (let i = 0; i < 16; i++) {
                if (state.inUse_16[i]) {
                    for (let j = 0; j < 16; j++) {
                        uc = BZLib.getBit(state);
                        if (uc === 1) {
                            state.inUse[i * 16 + j] = true;
                        }
                    }
                }
            }

            BZLib.makeMaps(state);

            let alphaSize = state.nInUse + 2;
            let nGroups = BZLib.getBits(3, state);
            let nSelectors = BZLib.getBits(15, state);

            for (let i = 0; i < nSelectors; i++) {
                let j = 0;

                do {
                    uc = BZLib.getBit(state);

                    if (uc === 0) {
                        break;
                    }

                    j++;
                } while (true);

                state.selectorMtf[i] = j & 0xff;
            }

            let pos = new Int8Array(6);

            for (let v = 0; v < nGroups; v++) {
                pos[v] = v;
            }

            for (let i = 0; i < nSelectors; i++) {
                let v = state.selectorMtf[i];
                let tmp = pos[v];

                for (; v > 0; v--) {
                    pos[v] = pos[v - 1];
                }

                pos[0] = tmp;
                state.selector[i] = tmp;
            }

            for (let t = 0; t < nGroups; t++) {
                let curr = BZLib.getBits(5, state);

                for (let i = 0; i < alphaSize; i++) {
                    do {
                        uc = BZLib.getBit(state);

                        if (uc === 0) {
                            break;
                        }

                        uc = BZLib.getBit(state);

                        if (uc === 0) {
                            curr++;
                        } else {
                            curr--;
                        }
                    } while (true);

                    state.len[t][i] = curr & 0xff;
                }
            }

            for (let t = 0; t < nGroups; t++) {
                let minLen = 32;
                let maxLen = 0;

                for (let l1 = 0; l1 < alphaSize; l1++) {
                    if (state.len[t][l1] > maxLen) {
                        maxLen = state.len[t][l1];
                    }

                    if (state.len[t][l1] < minLen) {
                        minLen = state.len[t][l1];
                    }
                }

                BZLib.createDecodeTables(state.limit[t], state.base[t], state.perm[t], state.len[t], minLen, maxLen, alphaSize);
                state.minLens[t] = minLen;
            }

            let eob = state.nInUse + 1;
            let nblockMax = 100000 * state.blocksize100k;
            let groupNo = -1;
            let groupPos = 0;

            for (let i = 0; i <= 255; i++) {
                state.unzftab[i] = 0;
            }

            let kk = 4095; // MTFASIZE-1;

            for (let ii = 15; ii >= 0; ii--) {
                for (let jj = 15; jj >= 0; jj--) {
                    state.mtfa[kk] = (ii * 16 + jj) & 0xff;
                    kk--;
                }

                state.mtfbase[ii] = kk + 1;
            }

            let nblock = 0;

            // GETMTFVAL
            if (groupPos === 0) {
                groupNo++;
                groupPos = 50; // BZGSIZE
                let gSel = state.selector[groupNo];
                gMinLen = state.minLens[gSel];
                gLimit = state.limit[gSel];
                gPerm = state.perm[gSel];
                gBase = state.base[gSel];
            }

            groupPos--;
            let zn = gMinLen;
            let zvec = 0;
            let zj = 0;

            for (zvec = BZLib.getBits(zn, state); zvec > gLimit[zn]; zvec = zvec << 1 | zj) {
                zn++;
                zj = BZLib.getBit(state);
            }

            for (let nextSym = gPerm[zvec - gBase[zn]]; nextSym !== eob; ) {
                if (nextSym === 0 || nextSym === 1) { // BZRUNA, BZRUNB
                    let es = -1;
                    let N = 1;

                    do {
                        if (nextSym === 0) {
                            es += N;
                        } else if (nextSym === 1) {
                            es += 2 * N;
                        }

                        N *= 2;

                        // GETMTFVAL, y da fuk did they not subroutine this
                        if (groupPos === 0) {
                            groupNo++;
                            groupPos = 50;
                            let gSel = state.selector[groupNo];
                            gMinLen = state.minLens[gSel];
                            gLimit = state.limit[gSel];
                            gPerm = state.perm[gSel];
                            gBase = state.base[gSel];
                        }

                        groupPos--;
                        let zn_2 = gMinLen;
                        let zvec_2 = 0;
                        let zj_2 = 0;

                        for (zvec_2 = BZLib.getBits(zn_2, state); zvec_2 > gLimit[zn_2]; zvec_2 = zvec_2 << 1 | zj_2) {
                            zn_2++;
                            zj_2 = BZLib.getBit(state);
                        }

                        nextSym = gPerm[zvec_2 - gBase[zn_2]];
                    } while (nextSym === 0 || nextSym === 1);

                    es++;
                    uc = state.setToUnseq[state.mtfa[state.mtfbase[0]] & 0xff];
                    state.unzftab[uc & 0xff] += es;

                    for (; es > 0; es--) {
                        state.tt[nblock] = uc & 0xff;
                        nblock++;
                    }
                } else {
                    let nn = nextSym - 1;

                    if (nn < 16) { // MTFLSIZE
                        let pp = state.mtfbase[0];
                        uc = state.mtfa[pp + nn];

                        for (; nn > 3; nn -= 4) {
                            let z = pp + nn;
                            state.mtfa[z] = state.mtfa[z - 1];
                            state.mtfa[z - 1] = state.mtfa[z - 2];
                            state.mtfa[z - 2] = state.mtfa[z - 3];
                            state.mtfa[z - 3] = state.mtfa[z - 4];
                        }

                        for (; nn > 0; nn--) {
                            state.mtfa[pp + nn] = state.mtfa[(pp + nn) - 1];
                        }

                        state.mtfa[pp] = uc;
                    } else {
                        let lno = (nn / 16) | 0;
                        let off = nn % 16;
                        let pp = state.mtfbase[lno] + off;
                        uc = state.mtfa[pp];

                        for (; pp > state.mtfbase[lno]; pp--) {
                            state.mtfa[pp] = state.mtfa[pp - 1];
                        }

                        state.mtfbase[lno]++;

                        for (; lno > 0; lno--) {
                            state.mtfbase[lno]--;
                            state.mtfa[state.mtfbase[lno]] = state.mtfa[(state.mtfbase[lno - 1] + 16) - 1];
                        }

                        state.mtfbase[0]--;
                        state.mtfa[state.mtfbase[0]] = uc;

                        if (state.mtfbase[0] === 0) {
                            kk = 4095; // MTFASIZE - 1
                            for (let ii = 15; ii >= 0; ii--) {
                                for (let jj = 15; jj >= 0; jj--) {
                                    state.mtfa[kk] = state.mtfa[state.mtfbase[ii] + jj];
                                    kk--;
                                }

                                state.mtfbase[ii] = kk + 1;
                            }

                        }
                    }

                    state.unzftab[state.setToUnseq[uc & 0xff] & 0xff]++;
                    state.tt[nblock] = state.setToUnseq[uc & 0xff] & 0xff;
                    nblock++;

                    // GETMTFVAL here we go AGAIN
                    if (groupPos === 0) {
                        groupNo++;
                        groupPos = 50;
                        let gSel = state.selector[groupNo];
                        gMinLen = state.minLens[gSel];
                        gLimit = state.limit[gSel];
                        gPerm = state.perm[gSel];
                        gBase = state.base[gSel];
                    }

                    groupPos--;
                    let zn_2 = gMinLen;
                    let zvec_2 = 0;
                    let zj_2 = 0;

                    for (zvec_2 = BZLib.getBits(zn_2, state); zvec_2 > gLimit[zn_2]; zvec_2 = zvec_2 << 1 | zj_2) {
                        zn_2++;
                        zj_2 = BZLib.getBit(state);
                    }

                    nextSym = gPerm[zvec_2 - gBase[zn_2]];
                }
            }

            state.stateOutLen = 0;
            state.stateOutCh = 0;
            state.cftab[0] = 0;

            for (let i = 1; i <= 256; i++) {
                state.cftab[i] = state.unzftab[i - 1];
            }

            for (let i = 1; i <= 256; i++) {
                state.cftab[i] += state.cftab[i - 1];
            }

            for (let i = 0; i < nblock; i++) {
                uc = (state.tt[i] & 0xff);
                state.tt[state.cftab[uc & 0xff]] |= i << 8;
                state.cftab[uc & 0xff]++;
            }

            state.tpos = state.tt[state.origPtr] >> 8;
            state.nblockUsed = 0;
            state.tpos = state.tt[state.tpos];
            state.k0 = state.tpos & 0xff;
            state.tpos >>= 8;
            state.nblockUsed++;
            state.saveNblock = nblock;
            BZLib.nextHeader(state);
            goingandshit = state.nblockUsed === state.saveNblock + 1 && state.stateOutLen === 0;
        }
    }

    static getUChar(state) {
        return BZLib.getBits(8, state) & 0xff;
    }

    static getBit(state) {
        return BZLib.getBits(1, state) & 0xff;
    }

    static getBits(i, state) {
        let bits = 0;

        do {
            if (state.bsLive >= i) {
                let v = state.bsBuff >> state.bsLive - i & (1 << i) - 1;
                state.bsLive -= i;
                bits = v;
                break;
            }

            state.bsBuff = state.bsBuff << 8 | state.input[state.nextIn] & 0xff;
            state.bsLive += 8;
            state.nextIn++;
            state.availIn--;
            state.totalInLo32++;

            if (state.totalInLo32 === 0) {
                state.totalInHi32++;
            }
        } while (true);

        return bits;
    }

    static makeMaps(state) {
        state.nInUse = 0;

        for (let i = 0; i < 256; i++) {
            if (state.inUse[i]) {
                state.setToUnseq[state.nInUse] = i & 0xff;
                state.nInUse++;
            }
        }
    }

    static createDecodeTables(limit, base, perm, length, minLen, maxLen, alphaSize) {
        let pp = 0;

        for (let i = minLen; i <= maxLen; i++) {
            for (let j = 0; j < alphaSize; j++)
                if (length[j] === i) {
                    perm[pp] = j;
                    pp++;
                }
        }

        for (let i = 0; i < 23; i++) {
            base[i] = 0;
        }

        for (let i = 0; i < alphaSize; i++) {
            base[length[i] + 1]++;
        }

        for (let i = 1; i < 23; i++) {
            base[i] += base[i - 1];
        }

        for (let i = 0; i < 23; i++) {
            limit[i] = 0;
        }

        let vec = 0;

        for (let i = minLen; i <= maxLen; i++) {
            vec += base[i + 1] - base[i];
            limit[i] = vec - 1;
            vec <<= 1;
        }

        for (let i = minLen + 1; i <= maxLen; i++) {
            base[i] = (limit[i - 1] + 1 << 1) - base[i];
        }
    }    
}

module.exports = BZLib;
},{}],9:[function(require,module,exports){
const C_A = 'a'.charCodeAt(0);
const C_AT = '@'.charCodeAt(0);
const C_DOT = '.'.charCodeAt(0);
const C_EXCLM = '!'.charCodeAt(0);
const C_PRCNT = '%'.charCodeAt(0);
const C_SPACE = ' '.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);
const C_CENT = '\uFFE0'.charCodeAt(0);

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

class ChatMessage {
    static descramble(buff, off, len) {
        try {
            let newLen = 0;
            let l = -1;

            for (let idx = 0; idx < len; idx++) {
                let current = buff[off++] & 0xff;
                let k1 = current >> 4 & 0xf;

                if (l === -1) {
                    if (k1 < 13) {
                        ChatMessage.chars[newLen++] = ChatMessage.charMap[k1];
                    } else {
                        l = k1;
                    }
                } else {
                    ChatMessage.chars[newLen++] = ChatMessage.charMap[((l << 4) + k1) - 195];
                    l = -1;
                }

                k1 = current & 0xf;

                if (l === -1) {
                    if (k1 < 13) {
                        ChatMessage.chars[newLen++] = ChatMessage.charMap[k1];
                    } else {
                        l = k1;
                    }
                } else {
                    ChatMessage.chars[newLen++] = ChatMessage.charMap[((l << 4) + k1) - 195];
                    l = -1;
                }
            }

            let flag = true;

            for (let l1 = 0; l1 < newLen; l1++) {
                let c = ChatMessage.chars[l1];

                if (l1 > 4 && c === C_AT) {
                    ChatMessage.chars[l1] = C_SPACE;
                }

                if (c === C_PRCNT) {
                    ChatMessage.chars[l1] = C_SPACE;
                }

                if (flag && c >= C_A && c <= C_Z) {
                    ChatMessage.chars[l1] += C_CENT;
                    flag = false;
                }

                if (c === C_DOT || c === C_EXCLM) {
                    flag = true;
                }
            }

            return fromCharArray(ChatMessage.chars.slice(0, newLen));
        } catch (e) {
            return '.';
        }
    }

    static scramble(s) {
        if (s.length > 80) {
            s = s.slice(0, 80);
        }

        s = s.toLowerCase();

        let off = 0;
        let lshift = -1;

        for (let k = 0; k < s.length; k++) {
            let currentChar = s.charCodeAt(k);
            let foundCharMapIdx = 0;

            for (let n = 0; n < ChatMessage.charMap.length; n++) {
                if (currentChar !== ChatMessage.charMap[n]) {
                    continue;
                }

                foundCharMapIdx = n;
                break;
            }

            if (foundCharMapIdx > 12) {
                foundCharMapIdx += 195;
            }

            if (lshift === -1) {
                if (foundCharMapIdx < 13) {
                    lshift = foundCharMapIdx;
                } else {
                    ChatMessage.scrambledBytes[off++] = foundCharMapIdx & 0xff;
                }
            } else if (foundCharMapIdx < 13) {
                ChatMessage.scrambledBytes[off++] = ((lshift << 4) + foundCharMapIdx) & 0xff;
                lshift = -1;
            } else {
                ChatMessage.scrambledBytes[off++] = ((lshift << 4) + (foundCharMapIdx >> 4)) & 0xff;
                lshift = foundCharMapIdx & 0xf;
            }
        }

        if (lshift !== -1) {
            ChatMessage.scrambledBytes[off++] = (lshift << 4) & 0xff;
        }

        return off;
    }
}

ChatMessage.scrambledBytes = new Int8Array(100);
ChatMessage.chars = new Uint16Array(100);
ChatMessage.charMap = [
    ' ', 'e', 't', 'a', 'o', 'i', 'h', 'n', 's', 'r',
    'd', 'l', 'u', 'm', 'w', 'c', 'y', 'f', 'g', 'p',
    'b', 'v', 'k', 'x', 'j', 'q', 'z', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', ' ', '!', '?',
    '.', ',', ':', ';', '(', ')', '-', '&', '*', '\\',
    '\'', '@', '#', '+', '=', '\243', '$', '%', '"', '[',
    ']'
];

ChatMessage.charMap = new Uint16Array(ChatMessage.charMap.map(c => {
    return c.charCodeAt(0);
}));

module.exports = ChatMessage;

},{}],10:[function(require,module,exports){
const Packet = require('./packet');

class ClientStream extends Packet {
    constructor(socket) {
        super();
        this.closing = false;
        this.closed = false;
        this.socket = socket;
    }

    closeStream() {
        this.closing = true;
        this.socket.close();
        this.closed = true;
    }

    async readStream() {
        if (this.closing) {
            return 0;
        }

        return await this.socket.read();
    } 

    availableStream() {
        if (this.closing) {
            return 0;
        }

        return this.socket.available();
    }

    async readStreamBytes(len, off, buff) {
        if (this.closing) {
            return;
        }

        await this.socket.readBytes(buff, off, len);
    }

    writeStreamBytes(buff, off, len) {
        if (this.closing) {
            return;
        }

        this.socket.write(buff, off, len);
    }
}

module.exports = ClientStream;
},{"./packet":28}],11:[function(require,module,exports){
class GameBuffer {
    // buffer is an Int8Array
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }

    putByte(i) {
        this.buffer[this.offset++] = i;
    }

    putInt(i) {
        this.buffer[this.offset++] = (i >> 24);
        this.buffer[this.offset++] = (i >> 16);
        this.buffer[this.offset++] = (i >> 8);
        this.buffer[this.offset++] = i;
    }

    putString(s) {
        for (let i = 0; i < s.length; i++) {
            this.buffer[this.offset++] = s.charCodeAt(i);
        }
        
        // null terminate
        this.buffer[this.offset++] = 10;
    }

    putBytes(src, srcPos, len) {
        for (let i = srcPos; i < len; i++) {
            this.buffer[this.offset++] = src[i];
        }
    }

    getUnsignedByte() {
        return this.buffer[this.offset++] & 0xff;
    }

    getUnsignedShort() {
        this.offset += 2;

        return ((this.buffer[this.offset - 2] & 0xff) << 8) + 
            (this.buffer[this.offset - 1] & 0xff);
    }

    getUnsignedInt() {
        this.offset +=4;

        return ((this.buffer[this.offset - 4] & 0xff) << 24) + 
            ((this.buffer[this.offset - 3] & 0xff) << 16) + 
            ((this.buffer[this.offset - 2] & 0xff) << 8) + 
            (this.buffer[this.offset - 1] & 0xff);
    }

    getBytes(dest, destPos, len) {
        for (let i = destPos; i < len; i++) {
            dest[destPos + i] = this.buffer[this.offset++];
        }
    }
}

module.exports = GameBuffer;
},{}],12:[function(require,module,exports){
const Long = require('long');

class GameCharacter {
    constructor() {
        this.hash = new Long();
        this.name = null;
        this.serverIndex = 0;
        this.serverId = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.npcId = 0;
        this.stepCount = 0;
        this.animationCurrent = 0;
        this.animationNext = 0;
        this.movingStep = 0;
        this.waypointCurrent = 0;
        this.message = null;
        this.messageTimeout = 0;
        this.bubbleItem = 0;
        this.bubbleTimeout = 0;
        this.damageTaken = 0;
        this.healthCurrent = 0;
        this.healthMax = 0;
        this.combatTimer = 0;
        this.level = 0;
        this.colourHair = 0;
        this.colourTop = 0;
        this.colourBottom = 0;
        this.colourSkin = 0;
        this.incomingProjectileSprite = 0;
        this.attackingPlayerServerIndex = 0;
        this.attackingNpcServerIndex = 0;
        this.projectileRange = 0;
        this.skullVisible = 0;
        this.waypointsX = new Int32Array(10);
        this.waypointsY = new Int32Array(10);
        this.equippedItem = new Int32Array(12);
        this.level = -1;
    }
}

module.exports = GameCharacter;
},{"long":5}],13:[function(require,module,exports){
const C_OPCODES = require('./opcodes/client');
const ChatMessage = require('./chat-message');
const ClientStream = require('./client-stream');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const GameShell = require('./game-shell');
const Long = require('long');
const S_OPCODES = require('./opcodes/server');
const Utility = require('./utility');
const WordFilter = require('./word-filter');
const sleep = require('sleep-promise');

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

class GameConnection extends GameShell {
    constructor(canvas) {
        super(canvas);

        this.clientStream = null;
        this.friendListCount = 0;
        this.ignoreListCount = 0;
        this.settingsBlockChat = 0;
        this.settingsBlockPrivate = 0;
        this.settingsBlockTrade = 0;
        this.settingsBlockDuel = 0;
        this.sessionID = new Long(0);
        this.worldFullTimeout = 0;
        this.moderatorLevel = 0;
        this.autoLoginTImeout = 0;
        this.packetLastRead = 0;
        this.anInt630 = 0;

        this.server = '127.0.0.1';
        this.port = 43594;
        this.username = '';
        this.password = '';
        this.incomingPacket = new Int8Array(5000);
        this.incomingPacket = new Int8Array(5000);

        this.friendListHashes = [];

        for (let i = 0; i < 200; i += 1) {
            this.friendListHashes.push(new Long(0));
        }

        this.friendListOnline = new Int32Array(200);
        this.ignoreList = [];

        for (let i = 0; i < GameConnection.maxSocialListSize; i += 1) {
            this.ignoreList.push(new Long(0));
        }

        this.anIntArray629 = new Int32Array(GameConnection.maxSocialListSize);
    }

    async login(u, p, reconnecting) {
        if (this.worldFullTimeout > 0) {
            this.showLoginScreenStatus('Please wait...', 'Connecting to server');
            await sleep(2000);
            this.showLoginScreenStatus('Sorry! The server is currently full.', 'Please try again later');
            return;
        }

        try {
            this.username = u;
            u = Utility.formatAuthString(u, 20);

            this.password = p;
            p = Utility.formatAuthString(p, 20);

            if (u.trim().length === 0) {
                this.showLoginScreenStatus('You must enter both a username', 'and a password - Please try again');
                return;
            }

            if (reconnecting) {
                this.drawTextBox('Connection lost! Please wait...', 'Attempting to re-establish');
            } else {
                this.showLoginScreenStatus('Please wait...', 'Connecting to server');
            }


            this.clientStream = new ClientStream(await this.createSocket(this.server, this.port), this);
            this.clientStream.maxReadTries = GameConnection.maxReadTries;

            let l = Utility.usernameToHash(u);

            this.clientStream.newPacket(C_OPCODES.SESSION);
            this.clientStream.putByte(l.shiftRight(16).and(31).toInt());
            this.clientStream.flushPacket();

            let sessId = await this.clientStream.getLong();
            this.sessionID = sessId;

            if (sessId.equals(0)) {
                this.showLoginScreenStatus('Login server offline.', 'Please try again in a few mins');
                return;
            }

            console.log('Verb: Session id: ' + sessId);

            let ai = new Int32Array(4);
            ai[0] = (Math.random() * 99999999) | 0;
            ai[1] = (Math.random() * 99999999) | 0;
            ai[2] = sessId.shiftRight(32).toInt();
            ai[3] = sessId.toInt();

            this.clientStream.newPacket(C_OPCODES.LOGIN);

            if (reconnecting) {
                this.clientStream.putByte(1);
            } else {
                this.clientStream.putByte(0);
            }

            this.clientStream.putShort(GameConnection.clientVersion);
            this.clientStream.putByte(0); // limit30

            this.clientStream.putByte(10);
            this.clientStream.putInt(ai[0]);
            this.clientStream.putInt(ai[1]);
            this.clientStream.putInt(ai[2]);
            this.clientStream.putInt(ai[3]);
            this.clientStream.putInt(0); // uuid
            this.clientStream.putString(u);
            this.clientStream.putString(p);

            this.clientStream.flushPacket();
            this.clientStream.seedIsaac(ai);

            let resp = await this.clientStream.readStream();
            console.log('login response:' + resp);

            if (resp === 25) {
                this.moderatorLevel = 1;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            }

            if (resp === 0) {
                this.moderatorLevel = 0;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            }

            if (resp === 1) {
                this.autoLoginTimeout = 0;
                return;
            }

            if (reconnecting) {
                u = '';
                p = '';
                this.resetLoginVars();
                return;
            }

            if (resp === -1) {
                this.showLoginScreenStatus('Error unable to login.', 'Server timed out');
                return;
            }

            if (resp === 3) {
                this.showLoginScreenStatus('Invalid username or password.', 'Try again, or create a new account');
                return;
            }

            if (resp === 4) {
                this.showLoginScreenStatus('That username is already logged in.', 'Wait 60 seconds then retry');
                return;
            }

            if (resp === 5) {
                this.showLoginScreenStatus('The client has been updated.', 'Please reload this page');
                return;
            }

            if (resp === 6) {
                this.showLoginScreenStatus('You may only use 1 character at once.', 'Your ip-address is already in use');
                return;
            }
            
            if (resp === 7) {
                this.showLoginScreenStatus('Login attempts exceeded!', 'Please try again in 5 minutes');
                return;
            }

            if (resp === 8) {
                this.showLoginScreenStatus('Error unable to login.', 'Server rejected session');
                return;
            }

            if (resp === 9) {
                this.showLoginScreenStatus('Error unable to login.', 'Loginserver rejected session');
                return;
            }

            if (resp === 10) {
                this.showLoginScreenStatus('That username is already in use.', 'Wait 60 seconds then retry');
                return;
            }

            if (resp === 11) {
                this.showLoginScreenStatus('Account temporarily disabled.', 'Check your message inbox for details');
                return;
            }

            if (resp === 12) {
                this.showLoginScreenStatus('Account permanently disabled.', 'Check your message inbox for details');
                return;
            }

            if (resp === 14) {
                this.showLoginScreenStatus('Sorry! This world is currently full.', 'Please try a different world');
                this.worldFullTimeout = 1500;
                return;
            }

            if (resp === 15) {
                this.showLoginScreenStatus('You need a members account', 'to login to this world');
                return;
            }

            if (resp === 16) {
                this.showLoginScreenStatus('Error - no reply from loginserver.', 'Please try again');
                return;
            }

            if (resp === 17) {
                this.showLoginScreenStatus('Error - failed to decode profile.', 'Contact customer support');
                return;
            }

            if (resp === 18) {
                this.showLoginScreenStatus('Account suspected stolen.', 'Press \'recover a locked account\' on front page.');
                return;
            }

            if (resp === 20) {
                this.showLoginScreenStatus('Error - loginserver mismatch', 'Please try a different world');
                return;
            }

            if (resp === 21) {
                this.showLoginScreenStatus('Unable to login.', 'That is not an RS-Classic account');
                return;
            }

            if (resp === 22) {
                this.showLoginScreenStatus('Password suspected stolen.', 'Press \'change your password\' on front page.');
                return;
            } else {
                this.showLoginScreenStatus('Error unable to login.', 'Unrecognised response code');
                return;
            }
        } catch (e) {
            console.error(e);
        }

        if (this.autoLoginTimeout > 0) {
            await sleep(5000);
            this.autoLoginTimeout--;
            await this.login(this.username, this.password, reconnecting);
        }

        if (reconnecting) {
            this.username = '';
            this.password = '';
            this.resetLoginVars();
        } else {
            this.showLoginScreenStatus('Sorry! Unable to connect.', 'Check internet settings or try another world');
        }
    }

    closeConnection() {
        if (this.clientStream !== null) {
            try {
                this.clientStream.newPacket(C_OPCODES.CLOSE_CONNECTION);
                this.clientStream.flushPacket();
            } catch (e) {
                console.error(e);
            }
        }

        this.username = '';
        this.password = '';

        this.resetLoginVars();
    }

    async lostConnection() {
        try {
            throw new Error('');
        } catch (e) {
            console.log('loast connection: ');
            console.error(e);
        }

        console.log('Lost connection');
        this.autoLoginTimeout = 10;
        await this.login(this.username, this.password, true);
    }

    drawTextBox(s, s1) {
        let g = this.getGraphics();
        let font = new Font('Helvetica', 1, 15);
        let w = 512;
        let h = 344;
        g.setColor(Color.black);
        g.fillRect(((w / 2) | 0) - 140, ((h / 2) | 0) - 25, 280, 50);
        g.setColor(Color.white);
        g.drawRect(((w / 2) | 0) - 140, ((h / 2) | 0) - 25, 280, 50);
        this.drawString(g, s, font, (w / 2) | 0, ((h / 2) | 0) - 10);
        this.drawString(g, s1, font, (w / 2) | 0, ((h / 2) | 0) + 10);
    }

    async checkConnection() {
        let l = Date.now();

        if (this.clientStream.hasPacket()) {
            this.packetLastRead = l;
        }

        if (l - this.packetLastRead > 5000) {
            this.packetLastRead = l;
            this.clientStream.newPacket(C_OPCODES.PING);
            this.clientStream.sendPacket();
        }

        try {
            this.clientStream.writePacket(20);
        } catch (e) {
            await this.lostConnection();
            return;
        }

        let psize = await this.clientStream.readPacket(this.incomingPacket);

        if (psize > 0) {
            let ptype = this.clientStream.isaacCommand(this.incomingPacket[0] & 0xff);
            this.handlePacket(ptype, ptype, psize);
        }
    }

    handlePacket(opcode, ptype, psize) {
        console.log('opcode:' + opcode + ' psize:' + psize);

        if (opcode === S_OPCODES.MESSAGE) {
            let s = fromCharArray(this.incomingPacket.slice(1, psize));
            this.showServerMessage(s);
        }

        if (opcode === S_OPCODES.CLOSE_CONNECTION) {
            this.closeConnection();
        }

        if (opcode === S_OPCODES.LOGOUT_DENY) {
            this.cantLogout();
            return;
        }

        if (opcode === S_OPCODES.FRIEND_LIST) {
            this.friendListCount = Utility.getUnsignedByte(this.incomingPacket[1]);

            for (let k = 0; k < this.friendListCount; k++) {
                this.friendListHashes[k] = Utility.getUnsignedLong(this.incomingPacket, 2 + k * 9);
                this.friendListOnline[k] = Utility.getUnsignedByte(this.incomingPacket[10 + k * 9]);
            }

            this.sortFriendsList();
            return;
        }

        if (opcode === S_OPCODES.FRIEND_STATUS_CHANGE) {
            let hash = Utility.getUnsignedLong(this.incomingPacket, 1);
            let online = this.incomingPacket[9] & 0xff;

            for (let i2 = 0; i2 < this.friendListCount; i2++) {
                if (this.friendListHashes[i2].equals(hash)) {
                    if (this.friendListOnline[i2] === 0 && online !== 0) {
                        this.showServerMessage('@pri@' + Utility.hashToUsername(hash) + ' has logged in');
                    }

                    if (this.friendListOnline[i2] !== 0 && online === 0) {
                        this.showServerMessage('@pri@' + Utility.hashToUsername(hash) + ' has logged out');
                    }

                    this.friendListOnline[i2] = online;
                    psize = 0; // not sure what this is for
                    this.sortFriendsList();
                    return;
                }
            }

            this.friendListHashes[this.friendListCount] = hash;
            this.friendListOnline[this.friendListCount] = online;
            this.friendListCount++;
            this.sortFriendsList();
            return;
        }

        if (opcode === S_OPCODES.IGNORE_LIST) {
            this.ignoreListCount = Utility.getUnsignedByte(this.incomingPacket[1]);

            for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                this.ignoreList[i1] = Utility.getUnsignedLong(this.incomingPacket, 2 + i1 * 8);
            }

            return;
        }

        if (opcode === S_OPCODES.PRIVACY_SETTINGS) {
            this.settingsBlockChat = this.incomingPacket[1];
            this.settingsBlockPrivate = this.incomingPacket[2];
            this.settingsBlockTrade = this.incomingPacket[3];
            this.settingsBlockDuel = this.incomingPacket[4];
            return;
        }

        if (opcode === S_OPCODES.FRIEND_MESSAGE) {
            let from = Utility.getUnsignedLong(this.incomingPacket, 1);
            let k1 = Utility.getUnsignedInt(this.incomingPacket, 9); // is this some sort of message id ?

            for (let j2 = 0; j2 < this.maxSocialListSize; j2++) {
                if (this.anIntArray629[j2] === k1) {
                    return;
                }
            }

            this.anIntArray629[this.anInt630] = k1;
            this.anInt630 = (this.anInt630 + 1) % GameConnection.maxSocialListSize;
            let msg = WordFilter.filter(ChatMessage.descramble(this.incomingPacket, 13, psize - 13));
            this.showServerMessage('@pri@' + Utility.hashToUsername(from) + ': tells you ' + msg);
            return;
        } else {
            this.handleIncomingPacket(opcode, ptype, psize, this.incomingPacket);
            return;
        }
    }

    sortFriendsList() {
        let flag = true;

        while (flag) {
            flag = false;

            for (let i = 0; i < this.friendListCount - 1; i++) {
                if (this.friendListOnline[i] !== 255 && this.friendListOnline[i + 1] === 255 || this.friendListOnline[i] === 0 && this.friendListOnline[i + 1] !== 0) {
                    let j = this.friendListOnline[i];
                    this.friendListOnline[i] = this.friendListOnline[i + 1];
                    this.friendListOnline[i + 1] = j;

                    let l = this.friendListHashes[i];
                    this.friendListHashes[i] = this.friendListHashes[i + 1];
                    this.friendListHashes[i + 1] = l;

                    flag = true;
                }
            }
        }
    }

    sendPrivacySettings(chat, priv, trade, duel) {
        this.clientStream.newPacket(C_OPCODES.SETTINGS_PRIVACY);
        this.clientStream.putByte(chat);
        this.clientStream.putByte(priv);
        this.clientStream.putByte(trade);
        this.clientStream.putByte(duel);
        this.clientStream.sendPacket();
    }

    ignoreAdd(s) {
        let l = Utility.usernameToHash(s);

        this.clientStream.newPacket(C_OPCODES.IGNORE_ADD);
        this.clientStream.putLong(l);
        this.clientStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(l)) {
                return;
            }
        }

        if (this.ignoreListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.ignoreList[this.ignoreListCount++] = l;
            return;
        }
    }

    ignoreRemove(l) {
        this.clientStream.newPacket(C_OPCODES.IGNORE_REMOVE);
        this.clientStream.putLong(l);
        this.clientStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(l)) {
                this.ignoreListCount--;

                for (let j = i; j < this.ignoreListCount; j++) {
                    this.ignoreList[j] = this.ignoreList[j + 1];
                }

                return;
            }
        }
    }

    friendAdd(s) {
        this.clientStream.newPacket(C_OPCODES.FRIEND_ADD);
        this.clientStream.putLong(Utility.usernameToHash(s));
        this.clientStream.sendPacket();

        let l = Utility.usernameToHash(s);

        for (let i = 0; i < this.friendListCount; i++) {
            if (this.friendListHashes[i].equals(l)) {
                return;
            }
        }

        if (this.friendListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.friendListHashes[this.friendListCount] = l;
            this.friendListOnline[this.friendListCount] = 0;
            this.friendListCount++;
            return;
        }
    }

    friendRemove(l) {
        this.clientStream.newPacket(C_OPCODES.FRIEND_REMOVE);
        this.clientStream.putLong(l);
        this.clientStream.sendPacket();

        for (let i = 0; i < this.friendListCount; i++) {
            if (!this.friendListHashes[i].equals(l)) {
                continue;
            }

            this.friendListCount--;

            for (let j = i; j < this.friendListCount; j++) {
                this.friendListHashes[j] = this.friendListHashes[j + 1];
                this.friendListOnline[j] = this.friendListOnline[j + 1];
            }

            break;
        }

        this.showServerMessage('@pri@' + Utility.hashToUsername(l) + ' has been removed from your friends list');
    }

    sendPrivateMessage(u, buff, len) {
        this.clientStream.newPacket(C_OPCODES.PM);
        this.clientStream.putLong(u);
        this.clientStream.putBytes(buff, 0, len);
        this.clientStream.sendPacket();
    }

    sendChatMessage(buff, len) {
        this.clientStream.newPacket(C_OPCODES.CHAT);
        this.clientStream.putBytes(buff, 0, len);
        this.clientStream.sendPacket();
    }

    sendCommandString(s) {
        this.clientStream.newPacket(C_OPCODES.COMMAND);
        this.clientStream.putString(s);
        this.clientStream.sendPacket();
    }

    method43() {
        return true;
    }
}

GameConnection.clientVersion = 1;
GameConnection.maxReadTries = 0;
GameConnection.maxSocialListSize = 100;

module.exports = GameConnection;
},{"./chat-message":9,"./client-stream":10,"./game-shell":16,"./lib/graphics/color":17,"./lib/graphics/font":18,"./opcodes/client":26,"./opcodes/server":27,"./utility":36,"./word-filter":38,"long":5,"sleep-promise":7}],14:[function(require,module,exports){
const Utility = require('./utility');
const ndarray = require('ndarray');

class GameData {
    static getModelIndex(s) {
        if (/^na$/i.test(s)) {
            return 0;
        }

        for (let i = 0; i < GameData.modelCount; i++) {
            if (GameData.modelName[i].toLowerCase() === s.toLowerCase()) {
                return i;
            }
        }

        GameData.modelName[GameData.modelCount++] = s;

        return GameData.modelCount - 1;
    }

    static getUnsignedByte() {
        let i = GameData.dataInteger[GameData.offset] & 0xff;
        GameData.offset++;

        return i;
    }

    static getUnsignedShort() {
        let i = Utility.getUnsignedShort(GameData.dataInteger, GameData.offset);
        GameData.offset += 2;

        return i;
    }

    static getUnsignedInt() {
        let i = Utility.getUnsignedInt(GameData.dataInteger, GameData.offset);
        GameData.offset += 4;

        if (i > 99999999) {
            i = 99999999 - i;
        }

        return i;
    }

    static getString() {
        let s = '';
        for (s = ''; GameData.dataString[GameData.stringOffset] !== 0; s = s + String.fromCharCode(GameData.dataString[GameData.stringOffset++])) ;
        GameData.stringOffset++;

        return s;
    }

    static loadData(buffer, isMembers) {
        GameData.dataString = Utility.loadData('string.dat', 0, buffer);
        GameData.stringOffset = 0;
        GameData.dataInteger = Utility.loadData('integer.dat', 0, buffer);
        GameData.offset = 0;

        let i = 0;

        GameData.itemCount = GameData.getUnsignedShort();
        GameData.itemName = [];
        GameData.itemDescription = [];
        GameData.itemCommand = [];
        GameData.itemPicture = new Int32Array(GameData.itemCount);
        GameData.itemBasePrice = new Int32Array(GameData.itemCount);
        GameData.itemStackable = new Int32Array(GameData.itemCount);
        GameData.itemUnused = new Int32Array(GameData.itemCount);
        GameData.itemWearable = new Int32Array(GameData.itemCount);
        GameData.itemMask = new Int32Array(GameData.itemCount);
        GameData.itemSpecial = new Int32Array(GameData.itemCount);
        GameData.itemMembers = new Int32Array(GameData.itemCount);

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemName.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemCommand.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemPicture[i] = GameData.getUnsignedShort();

            if (GameData.itemPicture[i] + 1 > GameData.itemSpriteCount) {
                GameData.itemSpriteCount = GameData.itemPicture[i] + 1;
            }
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemBasePrice[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemStackable[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemUnused[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemWearable[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemMask[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemSpecial[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemMembers[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            if (!isMembers && GameData.itemMembers[i] === 1) {
                GameData.itemName[i] = 'Members object';
                GameData.itemDescription[i] = 'You need to be a member to use this object';
                GameData.itemBasePrice[i] = 0;
                GameData.itemCommand[i] = '';
                GameData.itemUnused[0] = 0;
                GameData.itemWearable[i] = 0;
                GameData.itemSpecial[i] = 1;
            }
        }

        GameData.npcCount = GameData.getUnsignedShort();
        GameData.npcName = [];
        GameData.npcDescription = [];
        GameData.npcCommand = [];
        GameData.npcAttack = new Int32Array(GameData.npcCount);
        GameData.npcStrength = new Int32Array(GameData.npcCount);
        GameData.npcHits = new Int32Array(GameData.npcCount);
        GameData.npcDefense = new Int32Array(GameData.npcCount);
        GameData.npcAttackable = new Int32Array(GameData.npcCount);
        GameData.npcSprite = ndarray(new Int32Array(GameData.npcCount * 12), [GameData.npcCount, 12]);
        GameData.npcColourHair = new Int32Array(GameData.npcCount);
        GameData.npcColourTop = new Int32Array(GameData.npcCount);
        GameData.npcColorBottom = new Int32Array(GameData.npcCount);
        GameData.npcColourSkin = new Int32Array(GameData.npcCount);
        GameData.npcWidth = new Int32Array(GameData.npcCount);
        GameData.npcHeight = new Int32Array(GameData.npcCount);
        GameData.npcWalkModel = new Int32Array(GameData.npcCount);
        GameData.npcCombatModel = new Int32Array(GameData.npcCount);
        GameData.npcCombatAnimation = new Int32Array(GameData.npcCount);

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcName.push(GameData.getString());
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcAttack[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcStrength[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcHits[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcDefense[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcAttackable[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            for (let i5 = 0; i5 < 12; i5++) {
                GameData.npcSprite.set(i, i5, GameData.getUnsignedByte());

                if (GameData.npcSprite.get(i, i5) === 255) {
                    GameData.npcSprite.set(i, i5, -1);
                }
            }
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourHair[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourTop[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColorBottom[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourSkin[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcWidth[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcHeight[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcWalkModel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCombatModel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCombatAnimation[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCommand[i] = GameData.getString();
        }

        GameData.textureCount = GameData.getUnsignedShort();
        GameData.textureName = [];
        GameData.textureSubtypeName = [];

        for (i = 0; i < GameData.textureCount; i++) {
            GameData.textureName.push(GameData.getString());
        }

        for (i = 0; i < GameData.textureCount; i++) {
            GameData.textureSubtypeName.push(GameData.getString());
        }

        GameData.animationCount = GameData.getUnsignedShort();
        GameData.animationName = [];
        GameData.animationCharacterColour = new Int32Array(GameData.animationCount);
        GameData.animationSomething = new Int32Array(GameData.animationCount);
        GameData.animationHasA = new Int32Array(GameData.animationCount);
        GameData.animationHasF = new Int32Array(GameData.animationCount);
        GameData.animationNumber = new Int32Array(GameData.animationCount);

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationName.push(GameData.getString());
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationCharacterColour[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationSomething[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationHasA[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationHasF[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationNumber[i] = GameData.getUnsignedByte();
        }

        GameData.objectCount = GameData.getUnsignedShort();
        GameData.objectName = [];
        GameData.objectDescription = [];
        GameData.objectCommand1 = [];
        GameData.objectCommand2 = [];
        GameData.objectModelIndex = new Int32Array(GameData.objectCount);
        GameData.objectWidth = new Int32Array(GameData.objectCount);
        GameData.objectHeight = new Int32Array(GameData.objectCount);
        GameData.objectType = new Int32Array(GameData.objectCount);
        GameData.objectElevation = new Int32Array(GameData.objectCount);

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectName.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectCommand1.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectCommand2.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectModelIndex[i] = GameData.getModelIndex(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectWidth[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectHeight[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectElevation[i] = GameData.getUnsignedByte();
        }

        GameData.wallObjectCount = GameData.getUnsignedShort();
        GameData.wallObjectName = [];
        GameData.wallObjectDescription = [];
        GameData.wallObjectCommand1 = [];
        GameData.wallObjectCommand2 = [];
        GameData.wallObjectHeight = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectTextureFront = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectTextureBack = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectAdjacent = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectInvisible = new Int32Array(GameData.wallObjectCount);

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectName.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectCommand1.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectCommand2.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectHeight[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectTextureFront[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectTextureBack[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectAdjacent[i] = GameData.getUnsignedByte(); // what's this?
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectInvisible[i] = GameData.getUnsignedByte(); // value is 0 if visible
        }

        GameData.roofCount = GameData.getUnsignedShort(); // the World class does something with these
        GameData.roofHeight = new Int32Array(GameData.roofCount);
        GameData.roofNumVertices = new Int32Array(GameData.roofCount);

        for (i = 0; i < GameData.roofCount; i++) {
            GameData.roofHeight[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.roofCount; i++) {
            GameData.roofNumVertices[i] = GameData.getUnsignedByte();
        }

        GameData.tileCount = GameData.getUnsignedShort(); // and these
        GameData.tileDecoration = new Int32Array(GameData.tileCount);
        GameData.tileType = new Int32Array(GameData.tileCount);
        GameData.tileAdjacent = new Int32Array(GameData.tileCount);

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileDecoration[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileAdjacent[i] = GameData.getUnsignedByte();
        }

        GameData.projectileSprite = GameData.getUnsignedShort();
        GameData.spellCount = GameData.getUnsignedShort();
        GameData.spellName = [];
        GameData.spellDescription = [];
        GameData.spellLevel = new Int32Array(GameData.spellCount);
        GameData.spellRunesRequired = new Int32Array(GameData.spellCount);
        GameData.spellType = new Int32Array(GameData.spellCount);
        GameData.spellRunesId = [];;
        GameData.spellRunesCount = [];

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellName.push(GameData.getString());
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellLevel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellRunesRequired[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            let j = GameData.getUnsignedByte();
            GameData.spellRunesId.push(new Int32Array(j));

            for (let k = 0; k < j; k++) {
                GameData.spellRunesId[i][k] = GameData.getUnsignedShort();
            }
        }

        for (i = 0; i < GameData.spellCount; i++) {
            let j = GameData.getUnsignedByte();
            GameData.spellRunesCount.push(new Int32Array(j));

            for (let k = 0; k < j; k++) {
                GameData.spellRunesCount[i][k] = GameData.getUnsignedByte();
            }
        }

        GameData.prayerCount = GameData.getUnsignedShort();
        GameData.prayerName = [];
        GameData.prayerDescription = [];
        GameData.prayerLevel = new Int32Array(GameData.prayerCount);
        GameData.prayerDrain = new Int32Array(GameData.prayerCount);

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerName.push(GameData.getString());
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerLevel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerDrain[i] = GameData.getUnsignedByte();
        }

        GameData.dataString = null;
        GameData.dataInteger = null;
    }
}

GameData.modelName = [];
GameData.modelName.length = 5000;
GameData.modelName.fill(null);
GameData.textureName = null;
GameData.textureSubtypeName = null;
GameData.objectModelIndex = null;
GameData.objectWidth = null;
GameData.objectHeight = null;
GameData.objectType = null;
GameData.objectElevation = null;
GameData.spellCount = 0;
GameData.npcWidth = null;
GameData.npcHeight = null;
GameData.npcSprite = null;
GameData.npcAttack = null;
GameData.npcStrength = null;
GameData.npcHits = null;
GameData.npcDefense = null;
GameData.npcAttackable = null;
GameData.spellLevel = null;
GameData.spellRunesRequired = null;
GameData.spellType = null;
GameData.spellRunesId = null;
GameData.spellRunesCount = null;
GameData.itemCount = 0;
GameData.itemSpriteCount = 0;
GameData.npcColourHair = null;
GameData.npcColourTop = null;
GameData.npcColorBottom = null;
GameData.npcColourSkin = null;
GameData.wallObjectHeight = null;
GameData.wallObjectTextureFront = null;
GameData.wallObjectTextureBack = null;
GameData.wallObjectAdjacent = null;
GameData.wallObjectInvisible = null;
GameData.tileCount = 0;
GameData.animationCharacterColour = null;
GameData.animationSomething = null;
GameData.animationHasA = null;
GameData.animationHasF = null;
GameData.animationNumber = null;
GameData.wallObjectCount = 0;
GameData.prayerLevel = null;
GameData.prayerDrain = null;
GameData.tileDecoration = null;
GameData.tileType = null;
GameData.tileAdjacent = null;
GameData.modelCount = 0;
GameData.roofHeight = null;
GameData.roofNumVertices = null;
GameData.prayerCount = 0;
GameData.itemName = null;
GameData.itemDescription = null;
GameData.itemCommand = null;
GameData.projectileSprite = 0;
GameData.npcCount = 0;
GameData.spellName = null;
GameData.spellDescription = null;
GameData.textureCount = 0;
GameData.wallObjectName = null;
GameData.wallObjectDescription = null;
GameData.wallObjectCommand1 = null;
GameData.wallObjectCommand2 = null;
GameData.roofCount = 0;
GameData.objectCount = 0;
GameData.npcName = null;
GameData.npcDescription = null;
GameData.npcCommand = null;
GameData.animationName = null;
GameData.itemPicture = null;
GameData.itemBasePrice = null;
GameData.itemStackable = null;
GameData.itemUnused = null;
GameData.itemWearable = null;
GameData.itemMask = null;
GameData.itemSpecial = null;
GameData.itemMembers = null;
GameData.animationCount = 0;
GameData.prayerName = null;
GameData.prayerDescription = null;
GameData.objectName = null;
GameData.objectDescription = null;
GameData.objectCommand1 = null;
GameData.objectCommand2 = null;
GameData.npcWalkModel = null;
GameData.npcCombatModel = null;
GameData.npcCombatAnimation = null;
GameData.dataString = null;
GameData.dataInteger = null;
GameData.stringOffset = 0;
GameData.offset = 0;

module.exports = GameData;
},{"./utility":36,"ndarray":6}],15:[function(require,module,exports){
const Utility = require('./utility');
const Scene = require('./scene');

const COLOUR_TRANSPARENT = 12345678;

class GameModel {
    constructor() {
        this.numVertices = 0;
        this.numFaces = 0;
        this.transformState = 0;
        this.visible = false;
        this.textureTranslucent = false;
        this.transparent = false;
        this.isolated = false;
        this.unlit = false;
        this.unpickable = false;
        this.projected = false;
        this.autocommit = false;
        this.depth = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.z1 = 0;
        this.z2 = 0;
        this.key = 0;
        this.maxVerts = 0;
        this.lightDiffuse = 0;
        this.lightAmbience = 0;
        this.magic = 0;
        this.maxFaces = 0;
        this.baseX = 0;
        this.baseY = 0;
        this.baseZ = 0;
        this.scaleFx = 0;
        this.scaleFy = 0;
        this.scaleFz = 0;
        this.shearXy = 0;
        this.shearXz = 0;
        this.shearYx = 0;
        this.shearYz = 0;
        this.shearZx = 0;
        this.shearZy = 0;
        this.transformKind = 0;
        this.diameter = 0;
        this.lightDirectionX = 0;
        this.lightDirectionY = 0;
        this.lightDirectionZ = 0;
        this.lightDirectionMagnitude = 0;
        this.dataPtr = 0;
        this.orientationYaw = 0;
        this.orientationPitch = 0;
        this.orientationRoll = 0;

        this.projectVertexX = null;
        this.projectVertexY = null;
        this.projectVertexZ = null;
        this.vertexViewX = null;
        this.vertexViewY = null;
        this.vertexIntensity = null;
        this.vertexAmbience = null;
        this.faceNumVertices = null;
        this.faceVertices = null; // keep this one an array of int32arrays
        this.faceFillFront = null;
        this.faceFillBack = null;
        this.normalMagnitude = null;
        this.normalScale = null;
        this.faceIntensity = null;
        this.faceNormalX = null;
        this.faceNormalY = null;
        this.faceNormalZ = null;
        this.faceTag = null;
        this.isLocalPlayer = null;
        this.vertexX = null;
        this.vertexY = null;
        this.vertexZ = null;
        this.vertexTransformedX = null;
        this.vertexTransformedY = null;
        this.vertexTransformedZ = null;
        this.faceTransStateThing = null;
        this.faceBoundLeft = null;
        this.faceBoundRight = null;
        this.faceBoundBottom = null;
        this.faceBoundTop = null;
        this.faceBoundNear = null;
        this.faceBoundFar = null;

        /*switch (args.length) {
        case 2:
            if (Array.isArray(args[0])) {
                return this._from2A(...args);
            }

            return this._from2(...args);
        case 3:
            return this._from3(...args);
        case 7:
            return this._from7(...args);
        }*/
    }

    static _from2(numVertices, numFaces) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        gameModel.allocate(numVertices, numFaces);

        // TODO: maybe make gameModel an int32 array
        gameModel.faceTransStateThing = [];

        for (let v = 0; v < gameModel.numFaces; v++) {
            gameModel.faceTransStateThing.push(new Int32Array([0]));
        }

        return gameModel;
    }

    static _from2A(pieces, count) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        gameModel.merge(pieces, count, true);

        return gameModel;
    }

    static _from3(data, offset, unused) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        let j = Utility.getUnsignedShort(data, offset);
        offset += 2;
        let k = Utility.getUnsignedShort(data, offset);
        offset += 2;

        gameModel.allocate(j, k);

        gameModel.faceTransStateThing = [];
        gameModel.faceTransStateThing.length = k;
        
        for (let i = 0; i < k; i += 1) {
            gameModel.faceTransStateThing[i] = [0];
        }

        for (let l = 0; l < j; l++) {
            gameModel.vertexX[l] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        for (let i1 = 0; i1 < j; i1++) {
            gameModel.vertexY[i1] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        for (let j1 = 0; j1 < j; j1++) {
            gameModel.vertexZ[j1] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        gameModel.numVertices = j;

        for (let k1 = 0; k1 < k; k1++) {
            gameModel.faceNumVertices[k1] = data[offset++] & 0xff;
        }

        for (let l1 = 0; l1 < k; l1++) {
            gameModel.faceFillFront[l1] = Utility.getSignedShort(data, offset);
            offset += 2;

            if (gameModel.faceFillFront[l1] === 32767) {
                gameModel.faceFillFront[l1] = gameModel.magic;
            }
        }

        for (let i2 = 0; i2 < k; i2++) {
            gameModel.faceFillBack[i2] = Utility.getSignedShort(data, offset);
            offset += 2;

            if (gameModel.faceFillBack[i2] === 32767) {
                gameModel.faceFillBack[i2] = gameModel.magic;
            }
        }

        for (let j2 = 0; j2 < k; j2++) {
            let k2 = data[offset++] & 0xff;

            if (k2 === 0) {
                gameModel.faceIntensity[j2] = 0;
            } else {
                gameModel.faceIntensity[j2] = gameModel.magic;
            }
        }

        for (let l2 = 0; l2 < k; l2++) {
            gameModel.faceVertices[l2] = new Int32Array(gameModel.faceNumVertices[l2]);

            for (let i3 = 0; i3 < gameModel.faceNumVertices[l2]; i3++) {
                if (j < 256) {
                    gameModel.faceVertices[l2][i3] = data[offset++] & 0xff;
                } else {
                    gameModel.faceVertices[l2][i3] = Utility.getUnsignedShort(data, offset);
                    offset += 2;
                }
            }
        }

        gameModel.numFaces = k;
        gameModel.transformState = 1;
        
        return gameModel;
    }

    static _from6(pieces, count, autocommit, isolated, unlit, unpickable) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;
        gameModel.autocommit = autocommit;
        gameModel.isolated = isolated;
        gameModel.unlit = unlit;
        gameModel.unpickable = unpickable;

        gameModel.merge(pieces, count, false);

        return gameModel;
    }

    static _from7(numVertices, numFaces, autocommit, isolated, unlit, unpickable, projected) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;
        gameModel.autocommit = autocommit;
        gameModel.isolated = isolated;
        gameModel.unlit = unlit;
        gameModel.unpickable = unpickable;
        gameModel.projected = projected;

        gameModel.allocate(numVertices, numFaces);

        return gameModel;
    }

    allocate(numV, numF) {
        this.vertexX = new Int32Array(numV);
        this.vertexY = new Int32Array(numV);
        this.vertexZ = new Int32Array(numV);
        this.vertexIntensity = new Int32Array(numV);
        this.vertexAmbience = new Int8Array(numV);
        this.faceNumVertices = new Int32Array(numF);

        this.faceVertices = [];
        this.faceVertices.length = numF;
        this.faceVertices.fill(null);
        this.faceFillFront = new Int32Array(numF);
        this.faceFillBack = new Int32Array(numF);
        this.faceIntensity = new Int32Array(numF);
        this.normalScale = new Int32Array(numF);
        this.normalMagnitude = new Int32Array(numF);

        if (!this.projected) {
            this.projectVertexX = new Int32Array(numV);
            this.projectVertexY = new Int32Array(numV);
            this.projectVertexZ = new Int32Array(numV);
            this.vertexViewX = new Int32Array(numV);
            this.vertexViewY = new Int32Array(numV);
        }

        if (!this.unpickable) {
            this.isLocalPlayer = new Int8Array(numF);
            this.faceTag = new Int32Array(numF);
        }

        if (this.autocommit) {
            this.vertexTransformedX = this.vertexX;
            this.vertexTransformedY = this.vertexY;
            this.vertexTransformedZ = this.vertexZ;
        } else {
            this.vertexTransformedX = new Int32Array(numV);
            this.vertexTransformedY = new Int32Array(numV);
            this.vertexTransformedZ = new Int32Array(numV);
        }

        if (!this.unlit || !this.isolated) {
            this.faceNormalX = new Int32Array(numF);
            this.faceNormalY = new Int32Array(numF);
            this.faceNormalZ = new Int32Array(numF);
        }

        if (!this.isolated) {
            this.faceBoundLeft = new Int32Array(numF);
            this.faceBoundRight = new Int32Array(numF);
            this.faceBoundBottom = new Int32Array(numF);
            this.faceBoundTop = new Int32Array(numF);
            this.faceBoundNear = new Int32Array(numF);
            this.faceBoundFar = new Int32Array(numF);
        }

        this.numFaces = 0;
        this.numVertices = 0;
        this.maxVerts = numV;
        this.maxFaces = numF;
        this.baseX = this.baseY = this.baseZ = 0;
        this.orientationYaw = this.orientationPitch = this.orientationRoll = 0;
        this.scaleFx = this.scaleFy = this.scaleFz = 256;
        this.shearXy = this.shearXz = this.shearYx = this.shearYz = this.shearZx = this.shearZy = 256;
        this.transformKind = 0;
    }

    projectionPrepare() {
        this.projectVertexX = new Int32Array(this.numVertices);
        this.projectVertexY = new Int32Array(this.numVertices);
        this.projectVertexZ = new Int32Array(this.numVertices);
        this.vertexViewX = new Int32Array(this.numVertices);
        this.vertexViewY = new Int32Array(this.numVertices);
    }

    clear() {
        this.numFaces = 0;
        this.numVertices = 0;
    }

    reduce(df, dz) {
        this.numFaces -= df;

        if (this.numFaces < 0) {
            this.numFaces = 0;
        }

        this.numVertices -= dz;

        if (this.numVertices < 0) {
            this.numVertices = 0;
        }
    }

    merge(pieces, count, transState) {
        let numF = 0;
        let numV = 0;

        for (let i = 0; i < count; i++) {
            numF += pieces[i].numFaces;
            numV += pieces[i].numVertices;
        }

        this.allocate(numV, numF);

        if (transState) {
            this.faceTransStateThing = [];
            this.faceTransStateThing.length = numF;
        }

        for (let i = 0; i < count; i++) {
            let source = pieces[i];
            source.commit();

            this.lightAmbience = source.lightAmbience;
            this.lightDiffuse = source.lightDiffuse;
            this.lightDirectionX = source.lightDirectionX;
            this.lightDirectionY = source.lightDirectionY;
            this.lightDirectionZ = source.lightDirectionZ;
            this.lightDirectionMagnitude = source.lightDirectionMagnitude;

            for (let srcF = 0; srcF < source.numFaces; srcF++) {
                let dstVs = new Int32Array(source.faceNumVertices[srcF]);
                let srcVs = source.faceVertices[srcF];

                for (let v = 0; v < source.faceNumVertices[srcF]; v++) {
                    dstVs[v] = this.vertexAt(source.vertexX[srcVs[v]], source.vertexY[srcVs[v]], source.vertexZ[srcVs[v]]);
                }

                let dstF = this.createFace(source.faceNumVertices[srcF], dstVs, source.faceFillFront[srcF], source.faceFillBack[srcF]);
                this.faceIntensity[dstF] = source.faceIntensity[srcF];
                this.normalScale[dstF] = source.normalScale[srcF];
                this.normalMagnitude[dstF] = source.normalMagnitude[srcF];

                if (transState) {
                    if (count > 1) {
                        this.faceTransStateThing[dstF] = new Int32Array(source.faceTransStateThing[srcF].length + 1);
                        this.faceTransStateThing[dstF][0] = i;

                        for (let i2 = 0; i2 < source.faceTransStateThing[srcF].length; i2++) {
                            this.faceTransStateThing[dstF][i2 + 1] = source.faceTransStateThing[srcF][i2];
                        }
                    } else {
                        this.faceTransStateThing[dstF] = new Int32Array(source.faceTransStateThing[srcF].length);

                        for (let j2 = 0; j2 < source.faceTransStateThing[srcF].length; j2++) {
                            this.faceTransStateThing[dstF][j2] = source.faceTransStateThing[srcF][j2];
                        }
                    }
                }
            }
        }

        this.transformState = 1;
    }


    vertexAt(x, y, z) {
        for (let l = 0; l < this.numVertices; l++) {
            if (this.vertexX[l] === x && this.vertexY[l] === y && this.vertexZ[l] === z) {
                return l;
            }
        }

        if (this.numVertices >= this.maxVerts) {
            return -1;
        } else {
            this.vertexX[this.numVertices] = x;
            this.vertexY[this.numVertices] = y;
            this.vertexZ[this.numVertices] = z;

            return this.numVertices++;
        }
    }

    createVertex(i, j, k) {
        if (this.numVertices >= this.maxVerts) {
            return -1;
        } else {
            this.vertexX[this.numVertices] = i;
            this.vertexY[this.numVertices] = j;
            this.vertexZ[this.numVertices] = k;

            return this.numVertices++;
        }
    }

    createFace(n, vs, front, back) {
        if (this.numFaces >= this.maxFaces) {
            return -1;
        } else {
            this.faceNumVertices[this.numFaces] = n;
            this.faceVertices[this.numFaces] = vs;
            this.faceFillFront[this.numFaces] = front;
            this.faceFillBack[this.numFaces] = back;
            this.transformState = 1;

            return this.numFaces++;
        }
    }

    split(unused1, unused2, pieceDx, pieceDz, rows, count, pieceMaxVertices, pickable) {
        this.commit();

        let pieceNV = new Int32Array(count);
        let pieceNF = new Int32Array(count);

        for (let i = 0; i < count; i++) {
            pieceNV[i] = 0;
            pieceNF[i] = 0;
        }

        for (let f = 0; f < this.numFaces; f++) {
            let sumX = 0;
            let sumZ = 0;
            let n = this.faceNumVertices[f];
            let vs = this.faceVertices[f];

            for (let i = 0; i < n; i++) {
                sumX += this.vertexX[vs[i]];
                sumZ += this.vertexZ[vs[i]];
            }

            let p = ((sumX / (n * pieceDx)) | 0) + ((sumZ / (n * pieceDz)) | 0) * rows;
            pieceNV[p] += n;
            pieceNF[p]++;
        }

        let pieces = [];

        for (let i = 0; i < count; i++) {
            if (pieceNV[i] > pieceMaxVertices) {
                pieceNV[i] = pieceMaxVertices;
            }

            pieces.push(GameModel._from7(pieceNV[i], pieceNF[i], true, true, true, pickable, true));
            pieces[i].lightDiffuse = this.lightDiffuse;
            pieces[i].lightAmbience = this.lightAmbience;
        }

        for (let f = 0; f < this.numFaces; f++) {
            let sumX = 0;
            let sumZ = 0;
            let n = this.faceNumVertices[f];
            let vs = this.faceVertices[f];

            for (let i = 0; i < n; i++) {
                sumX += this.vertexX[vs[i]];
                sumZ += this.vertexZ[vs[i]];
            }

            let p = ((sumX / (n * pieceDx)) | 0) + ((sumZ / (n * pieceDz)) | 0) * rows;
            this.copyLighting(pieces[p], vs, n, f);
        }

        for (let p = 0; p < count; p++) {
            pieces[p].projectionPrepare();
        }

        return pieces;
    }

    copyLighting(model, srcVs, nV, inF) {
        let dstVs = new Int32Array(nV);

        for (let inV = 0; inV < nV; inV++) {
            let outV = dstVs[inV] = model.vertexAt(this.vertexX[srcVs[inV]], this.vertexY[srcVs[inV]], this.vertexZ[srcVs[inV]]);
            model.vertexIntensity[outV] = this.vertexIntensity[srcVs[inV]];
            model.vertexAmbience[outV] = this.vertexAmbience[srcVs[inV]];
        }

        let outF = model.createFace(nV, dstVs, this.faceFillFront[inF], this.faceFillBack[inF]);

        if (!model.unpickable && !this.unpickable) {
            model.faceTag[outF] = this.faceTag[inF];
        }

        model.faceIntensity[outF] = this.faceIntensity[inF];
        model.normalScale[outF] = this.normalScale[inF];
        model.normalMagnitude[outF] = this.normalMagnitude[inF];
    }

    _setLight_from5(ambience, diffuse, x, y, z) {
        this.lightAmbience = 256 - ambience * 4;
        this.lightDiffuse = (64 - diffuse) * 16 + 128;

        if (!this.unlit) {
            this.lightDirectionX = x;
            this.lightDirectionY = y;
            this.lightDirectionZ = z;
            this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;
            this.light();
        }
    }

    _setLight_from6(gouraud, ambient, diffuse, x, y, z) {
        this.lightAmbience = 256 - ambient * 4;
        this.lightDiffuse = (64 - diffuse) * 16 + 128;

        if (this.unlit) {
            return;
        }

        for (let i = 0; i < this.numFaces; i++) {
            if (gouraud) {
                this.faceIntensity[i] = this.magic;
            } else {
                this.faceIntensity[i] = 0;
            }
        }

        this.lightDirectionX = x;
        this.lightDirectionY = y;
        this.lightDirectionZ = z;
        this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;

        this.light();
    }

    _setLight_from3(x, y, z) {
        if (!this.unlit) {
            this.lightDirectionX = x;
            this.lightDirectionY = y;
            this.lightDirectionZ = z;
            this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;
            this.light();
        }
    }
    
    setLight(...args) {
        switch (args.length) {
        case 6:
            return this._setLight_from6(...args);
        case 5:
            return this._setLight_from5(...args);
        case 3:
            return this._setLight_from3(...args);
        }
    }

    setVertexAmbience(v, ambience) {
        this.vertexAmbience[v] = ambience & 0xff;
    }

    rotate(yaw, pitch, roll) {
        this.orientationYaw = this.orientationYaw + yaw & 0xff;
        this.orientationPitch = this.orientationPitch + pitch & 0xff;
        this.orientationRoll = this.orientationRoll + roll & 0xff;
        this.determineTransformKind();
        this.transformState = 1;
    }

    orient(yaw, pitch, roll) {
        this.orientationYaw = yaw & 0xff;
        this.orientationPitch = pitch & 0xff;
        this.orientationRoll = roll & 0xff;
        this.determineTransformKind();
        this.transformState = 1;
    }

    translate(x, y, z) {
        this.baseX += x;
        this.baseY += y;
        this.baseZ += z;
        this.determineTransformKind();
        this.transformState = 1;
    }

    place(x, y, z) {
        this.baseX = x;
        this.baseY = y;
        this.baseZ = z;
        this.determineTransformKind();
        this.transformState = 1;
    }

    determineTransformKind() {
        if (this.shearXy !== 256 || this.shearXz !== 256 || this.shearYx !== 256 || this.shearYz !== 256 || this.shearZx !== 256 || this.shearZy !== 256) {
            this.transformKind = 4;
        } else if (this.scaleFx !== 256 || this.scaleFy !== 256 || this.scaleFz !== 256) {
            this.transformKind = 3;
        } else if (this.orientationYaw !== 0 || this.orientationPitch !== 0 || this.orientationRoll !== 0) {
            this.transformKind = 2;
        } else if (this.baseX !== 0 || this.baseY !== 0 || this.baseZ !== 0) {
            this.transformKind = 1;
        } else {
            this.transformKind = 0;
        }
    }

    applyTranslate(dx, dy, dz) {
        for (let v = 0; v < this.numVertices; v++) {
            this.vertexTransformedX[v] += dx;
            this.vertexTransformedY[v] += dy;
            this.vertexTransformedZ[v] += dz;
        }
    }

    applyRotation(yaw, roll, pitch) {
        for (let v = 0; v < this.numVertices; v++) {
            if (pitch !== 0) {
                let sin = GameModel.sine9[pitch];
                let cos = GameModel.sine9[pitch + 256];
                let x = this.vertexTransformedY[v] * sin + this.vertexTransformedX[v] * cos >> 15;

                this.vertexTransformedY[v] = this.vertexTransformedY[v] * cos - this.vertexTransformedX[v] * sin >> 15;
                this.vertexTransformedX[v] = x;
            }

            if (yaw !== 0) {
                let sin = GameModel.sine9[yaw];
                let cos = GameModel.sine9[yaw + 256];
                let y = this.vertexTransformedY[v] * cos - this.vertexTransformedZ[v] * sin >> 15;

                this.vertexTransformedZ[v] = this.vertexTransformedY[v] * sin + this.vertexTransformedZ[v] * cos >> 15;
                this.vertexTransformedY[v] = y;
            }

            if (roll !== 0) {
                let sin = GameModel.sine9[roll];
                let cos = GameModel.sine9[roll + 256];
                let x = this.vertexTransformedZ[v] * sin + this.vertexTransformedX[v] * cos >> 15;

                this.vertexTransformedZ[v] = this.vertexTransformedZ[v] * cos - this.vertexTransformedX[v] * sin >> 15;
                this.vertexTransformedX[v] = x;
            }
        }
    }

    applyShear(xy, xz, yx, yz, zx, zy) {
        for (let idx = 0; idx < this.numVertices; idx++) {
            if (xy !== 0) {
                this.vertexTransformedX[idx] += this.vertexTransformedY[idx] * xy >> 8;
            }

            if (xz !== 0) {
                this.vertexTransformedZ[idx] += this.vertexTransformedY[idx] * xz >> 8;
            }

            if (yx !== 0) {
                this.vertexTransformedX[idx] += this.vertexTransformedZ[idx] * yx >> 8;
            }

            if (yz !== 0) {
                this.vertexTransformedY[idx] += this.vertexTransformedZ[idx] * yz >> 8;
            }

            if (zx !== 0) {
                this.vertexTransformedZ[idx] += this.vertexTransformedX[idx] * zx >> 8;
            }

            if (zy !== 0) {
                this.vertexTransformedY[idx] += this.vertexTransformedX[idx] * zy >> 8;
            }
        }
    }

    applyScale(fx, fy, fz) {
        for (let v = 0; v < this.numVertices; v++) {
            this.vertexTransformedX[v] = this.vertexTransformedX[v] * fx >> 8;
            this.vertexTransformedY[v] = this.vertexTransformedY[v] * fy >> 8;
            this.vertexTransformedZ[v] = this.vertexTransformedZ[v] * fz >> 8;
        }
    }

    computeBounds() {
        this.x1 = this.y1 = this.z1 = 999999;
        this.diameter = this.x2 = this.y2 = this.z2 = -999999;

        for (let face = 0; face < this.numFaces; face++) {
            let vs = this.faceVertices[face];
            let v = vs[0];
            let n = this.faceNumVertices[face];
            let x1 = 0;
            let x2 = x1 = this.vertexTransformedX[v];
            let y1 = 0;
            let y2 = y1 = this.vertexTransformedY[v];
            let z1 = 0;
            let z2 = z1 = this.vertexTransformedZ[v];

            for (let i = 0; i < n; i++) {
                v = vs[i];

                if (this.vertexTransformedX[v] < x1) {
                    x1 = this.vertexTransformedX[v];
                } else if (this.vertexTransformedX[v] > x2) {
                    x2 = this.vertexTransformedX[v];
                }

                if (this.vertexTransformedY[v] < y1) {
                    y1 = this.vertexTransformedY[v];
                } else if (this.vertexTransformedY[v] > y2) {
                    y2 = this.vertexTransformedY[v];
                }

                if (this.vertexTransformedZ[v] < z1) {
                    z1 = this.vertexTransformedZ[v];
                } else if (this.vertexTransformedZ[v] > z2) {
                    z2 = this.vertexTransformedZ[v];
                }
            }

            if (!this.isolated) {
                this.faceBoundLeft[face] = x1;
                this.faceBoundRight[face] = x2;
                this.faceBoundBottom[face] = y1;
                this.faceBoundTop[face] = y2;
                this.faceBoundNear[face] = z1;
                this.faceBoundFar[face] = z2;
            }

            if (x2 - x1 > this.diameter) {
                this.diameter = x2 - x1;
            }

            if (y2 - y1 > this.diameter) {
                this.diameter = y2 - y1;
            }

            if (z2 - z1 > this.diameter) {
                this.diameter = z2 - z1;
            }

            if (x1 < this.x1) {
                this.x1 = x1;
            }

            if (x2 > this.x2) {
                this.x2 = x2;
            }

            if (y1 < this.y1) {
                this.y1 = y1;
            }

            if (y2 > this.y2) {
                this.y2 = y2;
            }

            if (z1 < this.z1) {
                this.z1 = z1;
            }

            if (z2 > this.z2) {
                this.z2 = z2;
            }
        }
    }

    light() {
        if (this.unlit) {
            return;
        }

        let divisor = this.lightDiffuse * this.lightDirectionMagnitude >> 8;

        for (let face = 0; face < this.numFaces; face++) {
            if (this.faceIntensity[this.face] !== this.magic) {
                this.faceIntensity[this.face] = ((this.faceNormalX[face] * this.lightDirectionX + this.faceNormalY[face] * this.lightDirectionY + this.faceNormalZ[face] * this.lightDirectionZ) / divisor) | 0;
            }
        }

        let normalX = new Int32Array(this.numVertices);
        let normalY = new Int32Array(this.numVertices);
        let normalZ = new Int32Array(this.numVertices);
        let normalMagnitude = new Int32Array(this.numVertices);

        for (let k = 0; k < this.numVertices; k++) {
            normalX[k] = 0;
            normalY[k] = 0;
            normalZ[k] = 0;
            normalMagnitude[k] = 0;
        }

        for (let face = 0; face < this.numFaces; face++) {
            if (this.faceIntensity[face] === this.magic) {
                for (let v = 0; v < this.faceNumVertices[face]; v++) {
                    let k1 = this.faceVertices[face][v];

                    normalX[k1] += this.faceNormalX[face];
                    normalY[k1] += this.faceNormalY[face];
                    normalZ[k1] += this.faceNormalZ[face];
                    normalMagnitude[k1]++;
                }
            }
        }

        for (let v = 0; v < this.numVertices; v++) {
            if (normalMagnitude[v] > 0) {
                this.vertexIntensity[v] = ((normalX[v] * this.lightDirectionX + normalY[v] * this.lightDirectionY + normalZ[v] * this.lightDirectionZ) / (divisor * normalMagnitude[v])) | 0;
            }
        }
    }

    relight() {
        if (this.unlit && this.isolated) {
            return;
        }

        for (let face = 0; face < this.numFaces; face++) {
            let verts = this.faceVertices[face];

            let aX = this.vertexTransformedX[verts[0]];
            let aY = this.vertexTransformedY[verts[0]];
            let aZ = this.vertexTransformedZ[verts[0]];
            let bX = this.vertexTransformedX[verts[1]] - aX;
            let bY = this.vertexTransformedY[verts[1]] - aY;
            let bZ = this.vertexTransformedZ[verts[1]] - aZ;
            let cX = this.vertexTransformedX[verts[2]] - aX;
            let cY = this.vertexTransformedY[verts[2]] - aY;
            let cZ = this.vertexTransformedZ[verts[2]] - aZ;

            let normX = bY * cZ - cY * bZ;
            let normY = bZ * cX - cZ * bX;
            let normZ;

            for (normZ = bX * cY - cX * bY; normX > 8192 || normY > 8192 || normZ > 8192 || normX < -8192 || normY < -8192 || normZ < -8192; normZ >>= 1) {
                normX >>= 1;
                normY >>= 1;
            }

            let normMag = (256 * Math.sqrt(normX * normX + normY * normY + normZ * normZ)) | 0;

            if (normMag <= 0) {
                normMag = 1;
            }

            this.faceNormalX[face] = ((normX * 0x10000) / normMag) | 0;
            this.faceNormalY[face] = ((normY * 0x10000) / normMag) | 0;
            this.faceNormalZ[face] = ((normZ * 65535) / normMag) | 0;
            this.normalScale[face] = -1;
        }

        this.light();
    }

    apply() {
        if (this.transformState === 2) {
            this.transformState = 0;

            for (let v = 0; v < this.numVertices; v++) {
                this.vertexTransformedX[v] = this.vertexX[v];
                this.vertexTransformedY[v] = this.vertexY[v];
                this.vertexTransformedZ[v] = this.vertexZ[v];
            }

            this.x1 = this.y1 = this.z1 = -9999999;
            this.diameter = this.x2 = this.y2 = this.z2 = 9999999;

            return;
        }

        if (this.transformState === 1) {
            this.transformState = 0;

            for (let v = 0; v < this.numVertices; v++) {
                this.vertexTransformedX[v] = this.vertexX[v];
                this.vertexTransformedY[v] = this.vertexY[v];
                this.vertexTransformedZ[v] = this.vertexZ[v];
            }

            if (this.transformKind >= 2) {
                this.applyRotation(this.orientationYaw, this.orientationPitch, this.orientationRoll);
            }

            if (this.transformKind >= 3) {
                this.applyScale(this.scaleFx, this.scaleFy, this.scaleFz);
            }

            if (this.transformKind >= 4) {
                this.applyShear(this.shearXy, this.shearXz, this.shearYx, this.shearYz, this.shearZx, this.shearZy);
            }

            if (this.transformKind >= 1) {
                this.applyTranslate(this.baseX, this.baseY, this.baseZ);
            }

            this.computeBounds();
            this.relight();
        }
    }

    project(cameraX, cameraY, cameraZ, cameraPitch, cameraRoll, cameraYaw, viewDist, clipNear) {
        this.apply();

        if (this.z1 > Scene.frustumNearZ || this.z2 < Scene.frustumFarZ || this.x1 > Scene.frustumMinX || this.x2 < Scene.frustumMaxX || this.y1 > Scene.frustumMinY || this.y2 < Scene.frustumMaxY) {
            this.visible = false;
            return;
        }

        this.visible = true;

        let yawSin = 0;
        let yawCos = 0;
        let pitchSin = 0;
        let pitchCos = 0;
        let rollSin = 0;
        let rollCos = 0;

        if (cameraYaw !== 0) {
            yawSin = GameModel.sine11[cameraYaw];
            yawCos = GameModel.sine11[cameraYaw + 1024];
        }

        if (cameraRoll !== 0) {
            rollSin = GameModel.sine11[cameraRoll];
            rollCos = GameModel.sine11[cameraRoll + 1024];
        }

        if (cameraPitch !== 0) {
            pitchSin = GameModel.sine11[cameraPitch];
            pitchCos = GameModel.sine11[cameraPitch + 1024];
        }

        for (let v = 0; v < this.numVertices; v++) {
            let x = this.vertexTransformedX[v] - cameraX;
            let y = this.vertexTransformedY[v] - cameraY;
            let z = this.vertexTransformedZ[v] - cameraZ;

            if (cameraYaw !== 0) {
                let X = y * yawSin + x * yawCos >> 15;
                y = y * yawCos - x * yawSin >> 15;
                x = X;
            }

            if (cameraRoll !== 0) {
                let X = z * rollSin + x * rollCos >> 15;
                z = z * rollCos - x * rollSin >> 15;
                x = X;
            }

            if (cameraPitch !== 0) {
                let Y = y * pitchCos - z * pitchSin >> 15;
                z = y * pitchSin + z * pitchCos >> 15;
                y = Y;
            }

            if (z >= clipNear) {
                this.vertexViewX[v] = ((x << viewDist) / z) | 0;
            } else {
                this.vertexViewX[v] = x << viewDist;
            }

            if (z >= clipNear) {
                this.vertexViewY[v] = ((y << viewDist) / z) | 0;
            } else {
                this.vertexViewY[v] = y << viewDist;
            }

            this.projectVertexX[v] = x;
            this.projectVertexY[v] = y;
            this.projectVertexZ[v] = z;
        }
    }

    commit() {
        this.apply();

        for (let i = 0; i < this.numVertices; i++) {
            this.vertexX[i] = this.vertexTransformedX[i];
            this.vertexY[i] = this.vertexTransformedY[i];
            this.vertexZ[i] = this.vertexTransformedZ[i];
        }

        this.baseX = this.baseY = this.baseZ = 0;
        this.orientationYaw = this.orientationPitch = this.orientationRoll = 0;
        this.scaleFx = this.scaleFy = this.scaleFz = 256;
        this.shearXy = this.shearXz = this.shearYx = this.shearYz = this.shearZx = this.shearZy = 256;
        this.transformKind = 0;
    }

    // TODO see if we have to call .slice() anywhere here
    copy(...args) {
        if (!args || !args.length) {
            let pieces = [this]; 
            let gameModel = GameModel._from2A(pieces, 1);
            gameModel.depth = this.depth;
            gameModel.transparent = this.transparent;

            return gameModel;
        }

        const [autocommit, isolated, unlit, pickable] = args;

        let pieces = [this];
        let gameModel = GameModel._from6(pieces, 1, autocommit, isolated, unlit, pickable);
        gameModel.depth = this.depth;

        return gameModel;
    }

    copyPosition(model) {
        this.orientationYaw = model.orientationYaw;
        this.orientationPitch = model.orientationPitch;
        this.orientationRoll = model.orientationRoll;
        this.baseX = model.baseX;
        this.baseY = model.baseY;
        this.baseZ = model.baseZ;
        this.determineTransformKind();
        this.transformState = 1;
    }

    readBase64(buff) {
        for (; buff[this.dataPtr] === 10 || buff[this.dataPtr] === 13; this.dataPtr++) ;

        let hi = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let mid = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let lo = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let val = ((hi * 4096 + mid * 64 + lo) - 0x20000) | 0;

        if (val === 123456) {
            val = this.magic;
        }

        return val;
    }
}

GameModel.sine9 = new Int32Array(512);
GameModel.sine11 = new Int32Array(2048);

GameModel.base64Alphabet = new Int32Array(256);

for (let i = 0; i < 256; i++) {
    GameModel.sine9[i] = (Math.sin(i * 0.02454369) * 32768) | 0;
    GameModel.sine9[i + 256] = (Math.cos(i * 0.02454369) * 32768) | 0;
}

for (let j = 0; j < 1024; j++) {
    GameModel.sine11[j] = (Math.sin(j * 0.00613592315) * 32768) | 0;
    GameModel.sine11[j + 1024] = (Math.cos(j * 0.00613592315) * 32768) | 0;
}

for (let j1 = 0; j1 < 10; j1++) {
    GameModel.base64Alphabet[48 + j1] = j1;
}

for (let k1 = 0; k1 < 26; k1++) {
    GameModel.base64Alphabet[65 + k1] = k1 + 10;
}

for (let l1 = 0; l1 < 26; l1++) {
    GameModel.base64Alphabet[97 + l1] = l1 + 36;
}

GameModel.base64Alphabet[163] = 62;
GameModel.base64Alphabet[36] = 63;

module.exports = GameModel;
},{"./scene":32,"./utility":36}],16:[function(require,module,exports){
const BZLib = require('./bzlib');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const Graphics = require('./lib/graphics/graphics');
const KEYCODES = require('./lib/keycodes');
const Socket = require('./lib/net/socket');
const Surface = require('./surface');
const Utility = require('./utility');
const VERSION = require('./version');
const zzz = require('sleep-promise');
const { TGA } = require('./lib/tga');

class GameShell {
    constructor(canvas) {
        this._canvas = canvas;
        this._graphics = new Graphics(this._canvas);

        this.options = {
            middleClickCamera: false,
            scrollWheel: false
        };

        this.middleButtonDown = false;
        this.mouseScrollDelta = 0;

        this.mouseActionTimeout = 0;
        this.loadingStep = 0;
        this.logoHeaderText = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButtonDown = 0;
        this.lastMouseButtonDown = 0;
        this.timings = [];
        this.resetTimings();
        this.stopTimeout = 0;
        this.interlaceTimer = 0;
        this.loadingProgressPercent = 0;
        this.imageLogo = null;
        this.graphics = null;

        this.appletWidth = 512;
        this.appletHeight = 346;
        this.targetFps = 20;
        this.maxDrawTime = 1000;
        this.timings = [];
        this.loadingStep = 1;
        this.hasRefererLogoNotUsed = false;
        this.loadingProgessText = 'Loading';
        this.fontTimesRoman15 = new Font('TimesRoman', 0, 15);
        this.fontHelvetica13b = new Font('Helvetica', Font.BOLD, 13);
        this.fontHelvetica12 = new Font('Helvetica', 0, 12);
        this.keyLeft = false;
        this.keyRight = false;
        this.keyUp = false;
        this.keyDown = false;
        this.keySpace = false;
        this.threadSleep = 1;
        this.interlace = false;
        this.inputTextCurrent = '';
        this.inputTextFinal = '';
        this.inputPmCurrent = '';
        this.inputPmFinal = '';
    }

    async startApplication(width, height, title, resizeable) {
        window.document.title = title;
        this._canvas.width = width;
        this._canvas.height = height;

        console.log('Started application');
        this.appletWidth = width;
        this.appletHeight = height;

        GameShell.gameFrame = this._canvas.getContext('2d');

        this._canvas.addEventListener('mousedown', this.mousePressed.bind(this));
        this._canvas.addEventListener('contextmenu', this.mousePressed.bind(this));
        this._canvas.addEventListener('mousemove', this.mouseMoved.bind(this));
        this._canvas.addEventListener('mouseup', this.mouseReleased.bind(this));
        this._canvas.addEventListener('mouseout', this.mouseOut.bind(this));
        this._canvas.addEventListener('wheel', this.mouseWheel.bind(this));

        window.addEventListener('keydown', this.keyPressed.bind(this));
        window.addEventListener('keyup', this.keyReleased.bind(this));

        this.loadingStep = 1;

        await this.run();
    }

    setTargetFps(i) {
        this.targetFps = 1000 / i;
    }

    resetTimings() {
        for (let i = 0; i < 10; i += 1) {
            this.timings[i] = 0;
        }
    }

    keyPressed(e) {
        e.preventDefault();

        let code = e.keyCode;
        let chr = e.key.length === 1 ? e.key.charCodeAt(0) : 65535;

        if ([8, 10, 13, 9].indexOf(code) > -1 ) {
            chr = code;
        }

        this.handleKeyPress(chr);

        if (code === KEYCODES.LEFT_ARROW) {
            this.keyLeft = true;
        } else if (code === KEYCODES.RIGHT_ARROW) {
            this.keyRight = true;
        } else if (code === KEYCODES.UP_ARROW) {
            this.keyUp = true;
        } else if (code === KEYCODES.DOWN_ARROW) {
            this.keyDown = true;
        } else if (code === KEYCODES.SPACE) {
            this.keySpace = true;
        } else if (code === KEYCODES.F1) {
            this.interlace = !this.interlace;
        }
    
        let foundText = false;

        for (let i = 0; i < GameShell.charMap.length; i++) {
            if (GameShell.charMap.charCodeAt(i) === chr) {
                foundText = true;
                break;
            }
        }

        if (foundText) {
            if (this.inputTextCurrent.length < 20) {
                this.inputTextCurrent += String.fromCharCode(chr);
            }

            if (this.inputPmCurrent.length < 80) {
                this.inputPmCurrent += String.fromCharCode(chr);
            }
        }

        if (code === KEYCODES.ENTER) {
            this.inputTextFinal = this.inputTextCurrent;
            this.inputPmFinal = this.inputPmCurrent;
        }

        if (code === KEYCODES.BACKSPACE) {
            if (this.inputTextCurrent.length > 0) {
                this.inputTextCurrent = this.inputTextCurrent.substring(0, this.inputTextCurrent.length - 1);
            }

            if (this.inputPmCurrent.length > 0) {
                this.inputPmCurrent = this.inputPmCurrent.substring(0, this.inputPmCurrent.length - 1);
            }
        }

        return false;
    }

    keyReleased(e) {
        e.preventDefault();

        let code = e.keyCode;

        if (code === KEYCODES.LEFT_ARROW) {
            this.keyLeft = false;
        } else if (code === KEYCODES.RIGHT_ARROW) {
            this.keyRight = false;
        } else if (code === KEYCODES.UP_ARROW) {
            this.keyUp = false;
        } else if (code === KEYCODES.DOWN_ARROW) {
            this.keyDown = false;
        } else if (code === KEYCODES.SPACE) {
            this.keySpace = false;
        }

        return false;
    }

    mouseMoved(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseActionTimeout = 0;
    }

    mouseReleased(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseButtonDown = 0;

        if (e.button === 1) {
            this.middleButtonDown = false;
        }
    }

    mouseOut(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseButtonDown = 0;
        this.middleButtonDown = false;
    }

    mousePressed(e) {
        e.preventDefault();

        let x = e.offsetX;
        let y = e.offsetY;

        this.mouseX = x;
        this.mouseY = y;

        if (this.options.middleClickCamera && e.button === 1) {
            this.middleButtonDown = true;
            this.originRotation = this.cameraRotation;
            this.originMouseX = this.mouseX;
            return false;
        }

        if (e.metaKey || e.button === 2) {
            this.mouseButtonDown = 2;
        } else {
            this.mouseButtonDown = 1;
        }

        this.lastMouseButtonDown = this.mouseButtonDown;
        this.mouseActionTimeout = 0;
        this.handleMouseDown(this.mouseButtonDown, x, y);

        return false;
    }

    mouseWheel(e) {
        if (!this.options.mouseWheel) {
            return;
        }

        e.preventDefault();

        if (e.deltaMode === 0) {
            // deltaMode === 0 means deltaY/deltaY is given in pixels (chrome)
            this.mouseScrollDelta = Math.floor(e.deltaY / 14);
        } else if (e.deltaMode === 1) {
            // deltaMode === 1 means deltaY/deltaY is given in lines (firefox)
            this.mouseScrollDelta = Math.floor(e.deltaY);
        }

        return false;
    }

    start() {
        if (this.stopTimeout >= 0) {
            this.stopTimeout = 0;
        }
    }

    stop() {
        if (this.stopTimeout >= 0) {
            this.stopTimeout = 4000 / this.targetFps;
        }
    }

    async run() {
        if (this.loadingStep === 1) {
            this.loadingStep = 2;
            this.graphics = this.getGraphics();
            await this.loadJagex();
            this.drawLoadingScreen(0, 'Loading...');
            await this.startGame();
            this.loadingStep = 0;
        }

        let i = 0;
        let j = 256;
        let sleep = 1;
        let i1 = 0;

        for (let j1 = 0; j1 < 10; j1++) {
            this.timings[j1] = Date.now();
        }

        while (this.stopTimeout >= 0) {
            if (this.stopTimeout > 0) {
                this.stopTimeout--;

                if (this.stopTimeout === 0) {
                    this.onClosing();
                    return;
                }
            }

            let k1 = j;
            let lastSleep = sleep;

            j = 300;
            sleep = 1;

            let time = Date.now();

            if (this.timings[i] === 0) {
                j = k1;
                sleep = lastSleep;
            } else if (time > this.timings[i]) {
                j = ((2560 * this.targetFps) / (time - this.timings[i])) | 0;
            }

            if (j < 25) {
                j = 25;
            }

            if (j > 256) {
                j = 256;
                sleep = (this.targetFps - (time - this.timings[i]) / 10) | 0;

                if (sleep < this.threadSleep) {
                    sleep = this.threadSleep;
                }
            }

            await zzz(sleep);

            this.timings[i] = time;
            i = (i + 1) % 10;

            if (sleep > 1) {
                for (let j2 = 0; j2 < 10; j2++) {
                    if (this.timings[j2] !== 0) {
                        this.timings[j2] += sleep;
                    }
                }
            }

            let k2 = 0;

            while (i1 < 256) {
                await this.handleInputs();
                i1 += j;

                if (++k2 > this.maxDrawTime) {
                    i1 = 0;
                    this.interlaceTimer += 6;

                    if (this.interlaceTimer > 25) {
                        this.interlaceTimer = 0;
                        this.interlace = true;
                    }

                    break;
                }
            }

            this.interlaceTimer--;
            i1 &= 0xff;
            this.draw();

            this.mouseScrollDelta = 0;
        }
    }

    update(g) {
        this.paint(g);
    }

    paint(g) {
        if (this.loadingStep === 2 && this.imageLogo !== null) {
            this.drawLoadingScreen(this.loadingProgressPercent, this.loadingProgessText);
        }
    }

    async loadJagex() {
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);
        
        let buff = await this.readDataFile('jagex.jag', 'Jagex library', 0);

        if (buff !== null) {
            let logo = Utility.loadData('logo.tga', 0, buff);
            this.imageLogo = this.createImage(logo);
        }

        buff = await this.readDataFile(`fonts${VERSION.FONTS}.jag`, 'Game fonts', 5);

        if (buff !== null) {
            Surface.createFont(Utility.loadData('h11p.jf', 0, buff), 0);
            Surface.createFont(Utility.loadData('h12b.jf', 0, buff), 1);
            Surface.createFont(Utility.loadData('h12p.jf', 0, buff), 2);
            Surface.createFont(Utility.loadData('h13b.jf', 0, buff), 3);
            Surface.createFont(Utility.loadData('h14b.jf', 0, buff), 4);
            Surface.createFont(Utility.loadData('h16b.jf', 0, buff), 5);
            Surface.createFont(Utility.loadData('h20b.jf', 0, buff), 6);
            Surface.createFont(Utility.loadData('h24b.jf', 0, buff), 7);
        }
    }

    drawLoadingScreen(percent, text) {
        let midX = ((this.appletWidth - 281) / 2) | 0;
        let midY = ((this.appletHeight - 148) / 2) | 0;

        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);

        if (!this.hasRefererLogoNotUsed) {
            this.graphics.drawImage(this.imageLogo, midX, midY/*, this*/);
        }

        midX += 2;
        midY += 90;

        this.loadingProgressPercent = percent;
        this.loadingProgessText = text;
        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        this.graphics.drawRect(midX - 2, midY - 2, 280, 23);
        this.graphics.fillRect(midX, midY, ((277 * percent) / 100) | 0, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(this.graphics, text, this.fontTimesRoman15, midX + 138, midY + 10);

        if (!this.hasRefererLogoNotUsed) {
            this.drawString(this.graphics, 'Created by JAGeX - visit www.jagex.com', this.fontHelvetica13b, midX + 138, midY + 30);
            this.drawString(this.graphics, '\u00a92001-2002 Andrew Gower and Jagex Ltd', this.fontHelvetica13b, midX + 138, midY + 44);
        } else {
            this.graphics.setColor(new Color(132, 132, 152));
            this.drawString(this.graphics, '\u00a92001-2002 Andrew Gower and Jagex Ltd', this.fontHelvetica12, midX + 138, this.appletHeight - 20);
        }

        // not sure where this would have been used. maybe to indicate a special client?
        if (this.logoHeaderText !== null) {
            this.graphics.setColor(Color.white);
            this.drawString(this.graphics, this.logoHeaderText, this.fontHelvetica13b, midX + 138, midY - 120);
        }
    }

    showLoadingProgress(i, s) {
        let j = ((this.appletWidth - 281) / 2) | 0;
        let k = ((this.appletHeight - 148) / 2) | 0;
        j += 2;
        k += 90;

        this.loadingProgressPercent = i;
        this.loadingProgessText = s;

        let l = ((277 * i) / 100) | 0;
        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        this.graphics.fillRect(j, k, l, 20);
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(j + l, k, 277 - l, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(this.graphics, s, this.fontTimesRoman15, j + 138, k + 10);
    }

    drawString(g, s, font, i, j) {
        g.setFont(font);
        const { width, height } = g.ctx.measureText(s);
        g.drawString(s, i - ((width / 2) | 0), j + ((height / 4) | 0));
    }

    createImage(buff) {
        const tgaImage = new TGA();

        tgaImage.load(buff.buffer);

        const canvas = tgaImage.getCanvas();
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        return imageData;
    }

    async readDataFile(file, description, percent) {
        file = './data204/' + file;

        let archiveSize = 0;
        let archiveSizeCompressed = 0;
        let archiveData = null;

        this.showLoadingProgress(percent, 'Loading ' + description + ' - 0%');

        let fileDownloadStream = Utility.openFile(file);
        let header = new Int8Array(6);

        await fileDownloadStream.readFully(header, 0, 6);

        archiveSize = ((header[0] & 0xff) << 16) + ((header[1] & 0xff) << 8) + (header[2] & 0xff);
        archiveSizeCompressed = ((header[3] & 0xff) << 16) + ((header[4] & 0xff) << 8) + (header[5] & 0xff);

        this.showLoadingProgress(percent, 'Loading ' + description + ' - 5%');

        let read = 0;
        archiveData = new Int8Array(archiveSizeCompressed);

        while (read < archiveSizeCompressed) {
            let length = archiveSizeCompressed - read;

            if (length > 1000) {
                length = 1000;
            }

            await fileDownloadStream.readFully(archiveData, read, length);
            read += length;
            this.showLoadingProgress(percent, 'Loading ' + description + ' - ' + ((5 + (read * 95) / archiveSizeCompressed) | 0) + '%');
        }

        this.showLoadingProgress(percent, 'Unpacking ' + description);

        if (archiveSizeCompressed !== archiveSize) {
            let decompressed = new Int8Array(archiveSize);
            BZLib.decompress(decompressed, archiveSize, archiveData, archiveSizeCompressed, 0);
            return decompressed;
        } else {
            return archiveData;
        }
    }

    getGraphics() {
        //return new Graphics(this.canvas);
        return this._graphics;
    }

    async createSocket(s, i) {
        let socket = new Socket(s, i);
        await socket.connect();
        return socket;
    }
}

GameShell.gameFrame = null;
GameShell.charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"\243$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

module.exports = GameShell;
},{"./bzlib":8,"./lib/graphics/color":17,"./lib/graphics/font":18,"./lib/graphics/graphics":19,"./lib/keycodes":20,"./lib/net/socket":22,"./lib/tga":24,"./surface":35,"./utility":36,"./version":37,"sleep-promise":7}],17:[function(require,module,exports){
class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toCanvasStyle() {
        return `rgba(${this.r},${this.g}, ${this.b}, ${this.a})`;
    }
}

Color.white = new Color(255, 255, 255);
Color.WHITE = Color.white;

Color.lightGray = new Color(192, 192, 192);
Color.LIGHT_GRAY = Color.lightGray;

Color.gray = new Color(128, 128, 128);
Color.GRAY = Color.gray;

Color.darkGray = new Color(64, 64, 64);
Color.DARK_GRAY = Color.darkGray;

Color.black = new Color(0, 0, 0);
Color.BLACK = Color.black;

Color.red = new Color(255, 0, 0);
Color.RED = Color.red;

Color.pink = new Color(255, 175, 175);
Color.PINK = Color.pink;

Color.orange = new Color(255, 200, 0);
Color.ORANGE = Color.orange;

Color.yellow = new Color(255, 255, 0);
Color.YELLOW = Color.yellow;

Color.green = new Color(0, 255, 0);
Color.GREEN = Color.green;

Color.magenta = new Color(255, 0, 255);
Color.MAGENTA = Color.magenta;

Color.cyan = new Color(0, 255, 255);
Color.CYAN = Color.cyan;

Color.blue = new Color(0, 0, 255);
Color.BLUE = Color.blue;

module.exports = Color;
},{}],18:[function(require,module,exports){
class Font {
    constructor(name, type, size) {
        this.name = name;
        this.type = type;
        this.size = size;
    }

    toCanvasFont() {
        return `${this.getType()} ${this.size}px ${this.name}`;
    }

    getType(){
        if (this.type === 1) {
            return 'bold';
        } else if (this.type === 2) {
            return 'italic';
        }

        return 'normal';
    }
}

module.exports = Font;
},{}],19:[function(require,module,exports){
const Font = require('./font');
const Color = require('./color');

class Graphics {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    setColor(color) {
        this.ctx.fillStyle = color.toCanvasStyle();
        this.ctx.strokeStyle = color.toCanvasStyle();
    }

    fillRect(x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
    }

    drawRect(x, y, width, height) {
        this.ctx.strokeRect(x, y, width, height);
    }

    setFont(font) {
        this.ctx.font = font.toCanvasFont();
    }

    drawString(s, x, y) {
        this.ctx.fillText(s, x, y);
    }

    measureTextWidth(s) {
        return this.ctx.measureText(s).width;
    }

    drawImage(image, x, y) {
        this.ctx.putImageData(image, x, y);
    }

    getImage(width, height) {
        return this.ctx.getImageData(0, 0, width, height);
    }
}

module.exports = Graphics;
},{"./color":17,"./font":18}],20:[function(require,module,exports){
module.exports={
   "0": 48,
   "1": 49,
   "2": 50,
   "3": 51,
   "4": 52,
   "5": 53,
   "6": 54,
   "7": 55,
   "8": 56,
   "9": 57,
   "BACKSPACE": 8,
   "TAB": 9,
   "ENTER": 13,
   "SPACE": 32,
   "SHIFT": 16,
   "CTRL": 17,
   "ALT": 18,
   "PAUSE_BREAK": 19,
   "CAPS_LOCK": 20,
   "ESCAPE": 27,
   "PAGE_UP": 33,
   "PAGE_DOWN": 34,
   "END": 35,
   "HOME": 36,
   "LEFT_ARROW": 37,
   "UP_ARROW": 38,
   "RIGHT_ARROW": 39,
   "DOWN_ARROW": 40,
   "INSERT": 45,
   "DELETE": 46,
   "A": 65,
   "B": 66,
   "C": 67,
   "D": 68,
   "E": 69,
   "F": 70,
   "G": 71,
   "H": 72,
   "I": 73,
   "J": 74,
   "K": 75,
   "L": 76,
   "M": 77,
   "N": 78,
   "O": 79,
   "P": 80,
   "Q": 81,
   "R": 82,
   "S": 83,
   "T": 84,
   "U": 85,
   "V": 86,
   "W": 87,
   "X": 88,
   "Y": 89,
   "Z": 90,
   "LEFT_WINDOW_KEY": 91,
   "RIGHT_WINDOW_KEY": 92,
   "SELECT_KEY": 93,
   "NUMPAD_0": 96,
   "NUMPAD_1": 97,
   "NUMPAD_2": 98,
   "NUMPAD_3": 99,
   "NUMPAD_4": 100,
   "NUMPAD_5": 101,
   "NUMPAD_6": 102,
   "NUMPAD_7": 103,
   "NUMPAD_8": 104,
   "NUMPAD_9": 105,
   "MULTIPLY": 106,
   "ADD": 107,
   "SUBTRACT": 109,
   "DECIMAL_POINT": 110,
   "DIVIDE": 111,
   "F1": 112,
   "F2": 113,
   "F3": 114,
   "F4": 115,
   "F5": 116,
   "F6": 117,
   "F7": 118,
   "F8": 119,
   "F9": 120,
   "F10": 121,
   "F11": 122,
   "F12": 123,
   "NUM_LOCK": 144,
   "SCROLL_LOCK": 145,
   "SEMI_COLON": 186,
   "EQUAL_SIGN": 187,
   "COMMA": 188,
   "DASH": 189,
   "PERIOD": 190,
   "FORWARD_SLASH": 191,
   "GRAVE_ACCENT": 192,
   "OPEN_BRACKET": 219,
   "BACK_SLASH": 220,
   "CLOSE_BRAKET": 221,
   "SINGLE_QUOTE": 222
}
},{}],21:[function(require,module,exports){
// a quick shim for downloading files

const sleep = require('sleep-promise');

class FileDownloadStream {
    constructor(file) {
        this.url = file;

        this.xhr = new XMLHttpRequest();
        this.xhr.responseType = 'arraybuffer';
        this.xhr.open('GET', file, true);

        this.buffer = null;
        this.pos = 0;
    }

    async _loadResBytes() {
        return new Promise((resolve, reject) => {
            this.xhr.onerror = e => reject(e);

            this.xhr.onload = () => {
                if (!/^2/.test(this.xhr.status)) {
                    reject(new Error(`unable to download ${this.url}. status code = ${this.xhr.status}`));
                } else {
                    resolve(new Int8Array(this.xhr.response));
                }
            };

            this.xhr.send();
        });
    }

    async readFully(dest, off = 0, len) {
        if (typeof len === 'undefined') {
            len = dest.length;
        }

        if (!this.buffer) {
            this.buffer = await this._loadResBytes();
        } else {
            //await sleep(5);
        }

        dest.set(this.buffer.slice(this.pos, this.pos + len), off);
        this.pos += len;
    }
}

module.exports = FileDownloadStream;

},{"sleep-promise":7}],22:[function(require,module,exports){
class Socket {
    constructor(host, port) {
        this.host = host;
        this.port = port;

        this.client = null;
        this.connected = false;

        // amount of bytes are left to read since last read call (in total)
        this.bytesAvailable = 0; 
        // the message buffers that arrive from the websocket
        this.buffers = [];
        // the current buffer we're reading
        this.currentBuffer = null;
        // amount of bytes we read in current buffer
        this.offset = 0;
        // amount of bytes left in current buffer
        this.bytesLeft = 0;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(`ws://${this.host}:${this.port}`, 'binary');
            this.client.binaryType = 'arraybuffer';

            const onError = err => {
                this.client.removeEventListener('error', onError);
                reject(err);
            };

            this.client.addEventListener('error', onError);

            this.client.addEventListener('close', () => {
                this.connected = false;
                this.clear();
            });

            this.client.addEventListener('message', msg => {
                this.buffers.push(new Int8Array(msg.data));
                this.bytesAvailable += msg.data.byteLength;
                this.refreshCurrentBuffer();
            });

            this.client.addEventListener('open', () => {
                this.connected = true;
                this.client.removeEventListener('error', onError);
                resolve();
            });
        });
    }

    write(bytes, off = 0, len = -1) {
        if (!this.connected) {
            throw new Error('attempting to write to closed socket');
        }

        len = len === -1 ? bytes.length : len;
        this.client.send(bytes.slice(off, off + len));
    }

    refreshCurrentBuffer() {
        if (this.bytesLeft === 0 && this.bytesAvailable > 0) {
            this.currentBuffer = this.buffers.shift();
            this.offset = 0;

            if (this.currentBuffer && this.currentBuffer.length) {
                this.bytesLeft = this.currentBuffer.length;
            } else {
                this.bytesLeft = 0;
            }
        }
    }

    // read the first byte available in the buffer, or wait for one to be sent
    // if none are available.
    async read() {
        if (!this.connected) {
            return -1;
        }

        if (this.bytesLeft > 0) {
            this.bytesLeft--;
            this.bytesAvailable--;

            return this.currentBuffer[this.offset++] & 0xff;
        }

        return new Promise((resolve, reject) => {
            let onClose, onError, onNextMessage;

            onClose = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                resolve(-1);
            };

            onError = err => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                reject(err);
            };

            onNextMessage = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                Promise.resolve().then(async () => {
                    resolve(await this.read());
                });
            };

            this.client.addEventListener('error', onError);
            this.client.addEventListener('close', onClose);
            this.client.addEventListener('message', onNextMessage);
        });
    }

    // read multiple bytes (specified by `len`) and put them into the `dest` 
    // array at specified `off` (0 by default).
    async readBytes(dest, off = 0, len = -1) {
        if (!this.connected) {
            return -1;
        }

        len = len === -1 ? dest.length : len;

        if (this.bytesAvailable >= len) {
            while (len > 0) {
                dest[off++] = this.currentBuffer[this.offset++] & 0xff;
                this.bytesLeft -= 1;
                this.bytesAvailable -= 1;
                len -= 1;

                if (this.bytesLeft === 0) {
                    this.refreshCurrentBuffer();
                }
            }

            return;
        }

        return new Promise((resolve, reject) => {
            let onClose, onError, onNextMessage;

            onClose = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                resolve(-1);
            };

            onError = err => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                reject(err);
            };

            onNextMessage = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                Promise.resolve().then(async () => {
                    resolve(await this.readBytes(dest, off, len));
                });
            };

            this.client.addEventListener('error', onError);
            this.client.addEventListener('close', onClose);
            this.client.addEventListener('message', onNextMessage);
        });
    }

    close() {
        if (!this.connected) {
            return;
        }

        this.client.close();
    }

    available() {
        return this.bytesAvailable;
    }

    clear() {
        if (this.connected) {
            this.client.close();
        }

        this.currentBuffer = null;
        this.buffers.length = 0;
        this.bytesLeft = 0;
    }
}

module.exports = Socket;
},{}],23:[function(require,module,exports){
function PCMPlayer(t){this.init(t)}PCMPlayer.prototype.init=function(t){this.option=Object.assign({},{encoding:"16bitInt",channels:1,sampleRate:8e3,flushingTime:1e3},t),this.samples=new Float32Array,this.flush=this.flush.bind(this),this.interval=setInterval(this.flush,this.option.flushingTime),this.maxValue=this.getMaxValue(),this.typedArray=this.getTypedArray(),this.createContext()},PCMPlayer.prototype.getMaxValue=function(){var t={"8bitInt":128,"16bitInt":32768,"32bitInt":2147483648,"32bitFloat":1};return t[this.option.encoding]?t[this.option.encoding]:t["16bitInt"]},PCMPlayer.prototype.getTypedArray=function(){var t={"8bitInt":Int8Array,"16bitInt":Int16Array,"32bitInt":Int32Array,"32bitFloat":Float32Array};return t[this.option.encoding]?t[this.option.encoding]:t["16bitInt"]},PCMPlayer.prototype.createContext=function(){this.audioCtx=new(window.AudioContext||window.webkitAudioContext),this.gainNode=this.audioCtx.createGain(),this.gainNode.gain.value=1,this.gainNode.connect(this.audioCtx.destination),this.startTime=this.audioCtx.currentTime},PCMPlayer.prototype.isTypedArray=function(t){return t.byteLength&&t.buffer&&t.buffer.constructor==ArrayBuffer},PCMPlayer.prototype.feed=function(t){if(this.isTypedArray(t)){t=this.getFormatedValue(t);var e=new Float32Array(this.samples.length+t.length);e.set(this.samples,0),e.set(t,this.samples.length),this.samples=e}},PCMPlayer.prototype.getFormatedValue=function(t){t=new this.typedArray(t.buffer);var e,i=new Float32Array(t.length);for(e=0;e<t.length;e++)i[e]=t[e]/this.maxValue;return i},PCMPlayer.prototype.volume=function(t){this.gainNode.gain.value=t},PCMPlayer.prototype.destroy=function(){this.interval&&clearInterval(this.interval),this.samples=null,this.audioCtx.close(),this.audioCtx=null},PCMPlayer.prototype.flush=function(){if(this.samples.length){var t,e,i,n,a,s=this.audioCtx.createBufferSource(),r=this.samples.length/this.option.channels,o=this.audioCtx.createBuffer(this.option.channels,r,this.option.sampleRate);for(e=0;e<this.option.channels;e++)for(t=o.getChannelData(e),i=e,a=50,n=0;n<r;n++)t[n]=this.samples[i],n<50&&(t[n]=t[n]*n/50),r-51<=n&&(t[n]=t[n]*a--/50),i+=this.option.channels;this.startTime<this.audioCtx.currentTime&&(this.startTime=this.audioCtx.currentTime),console.log("start vs current "+this.startTime+" vs "+this.audioCtx.currentTime+" duration: "+o.duration),s.buffer=o,s.connect(this.gainNode),s.start(this.startTime),this.startTime+=o.duration,this.samples=new Float32Array}};
module.exports = PCMPlayer;
},{}],24:[function(require,module,exports){
/**
 * @file tgajs - Javascript decoder & (experimental) encoder for TGA files
 * @desc tgajs is a fork from https://github.com/vthibault/jsTGALoader
 * @author Vincent Thibault (Original author)
 * @author Lukas Schmitt
 * @version 1.0.0
 */

/* Copyright (c) 2013, Vincent Thibault. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

(function (_global) {
  'use strict';

  /**
   * @var {object} TGA type constants
   */
  Targa.Type = {
    NO_DATA: 0,
    INDEXED: 1,
    RGB: 2,
    GREY: 3,
    RLE_INDEXED: 9,
    RLE_RGB: 10,
    RLE_GREY: 11
  };

  /**
   * @var {object} TGA origin constants
   */
  Targa.Origin = {
    BOTTOM_LEFT: 0x00,
    BOTTOM_RIGHT: 0x01,
    TOP_LEFT: 0x02,
    TOP_RIGHT: 0x03,
    SHIFT: 0x04,
    MASK: 0x30,
    ALPHA: 0x08
  };

  Targa.HEADER_SIZE = 18;
  Targa.FOOTER_SIZE = 26;
  Targa.LITTLE_ENDIAN = true;
  Targa.RLE_BIT = 0x80;
  Targa.RLE_MASK = 0x7f;
  Targa.RLE_PACKET = 1;
  Targa.RAW_PACKET = 2;
  Targa.SIGNATURE = "TRUEVISION-XFILE.\0";

  /**
   * TGA Namespace
   * @constructor
   */
  function Targa() {
    if (arguments.length == 1) {
      var h = arguments[0];

      this.header = createHeader(h);
      setHeaderBooleans(this.header);
      checkHeader(this.header);
    }
  }

  /**
   * Sets header or default values
   * @param header header
   * @returns {Object}
   */
  function createHeader(header) {
    return {
      /* 0x00  BYTE */  idLength: defaultFor(header.idLength, 0),
      /* 0x01  BYTE */  colorMapType: defaultFor(header.colorMapType, 0),
      /* 0x02  BYTE */  imageType: defaultFor(header.imageType, Targa.Type.RGB),
      /* 0x03  WORD */  colorMapIndex: defaultFor(header.colorMapIndex, 0),
      /* 0x05  WORD */  colorMapLength: defaultFor(header.colorMapLength, 0),
      /* 0x07  BYTE */  colorMapDepth: defaultFor(header.colorMapDepth, 0),
      /* 0x08  WORD */  offsetX: defaultFor(header.offsetX, 0),
      /* 0x0a  WORD */  offsetY: defaultFor(header.offsetY, 0),
      /* 0x0c  WORD */  width: defaultFor(header.width, 0),
      /* 0x0e  WORD */  height: defaultFor(header.height, 0),
      /* 0x10  BYTE */  pixelDepth: defaultFor(header.pixelDepth,32),
      /* 0x11  BYTE */  flags: defaultFor(header.flags, 8)
    };
  }

  function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

  /**
   * Write footer of TGA file to view
   * Byte 0-3 - Extension Area Offset, 0 if no Extension Area exists
   * Byte 4-7 - Developer Directory Offset, 0 if no Developer Area exists
   * Byte 8-25 - Signature
   * @param {Uint8Array} footer
   */
  function writeFooter(footer) {
    var signature = Targa.SIGNATURE;
    var offset = footer.byteLength - signature.length;
    for (var i = 0; i < signature.length; i++) {
      footer[offset + i] = signature.charCodeAt(i);
    }
  }

  /**
   * Write header of TGA file to view
   * @param header
   * @param view DataView
   */
  function writeHeader(header, view) {
    var littleEndian = Targa.LITTLE_ENDIAN;

    view.setUint8(0x00, header.idLength);
    view.setUint8(0x01, header.colorMapType);
    view.setUint8(0x02, header.imageType);
    view.setUint16(0x03, header.colorMapIndex, littleEndian);
    view.setUint16(0x05, header.colorMapLength, littleEndian);
    view.setUint8(0x07, header.colorMapDepth);
    view.setUint16(0x08, header.offsetX, littleEndian);
    view.setUint16(0x0a, header.offsetY, littleEndian);
    view.setUint16(0x0c, header.width, littleEndian);
    view.setUint16(0x0e, header.height, littleEndian);
    view.setUint8(0x10, header.pixelDepth);
    view.setUint8(0x11, header.flags);
  }

  function readHeader(view) {
    var littleEndian = Targa.LITTLE_ENDIAN;

    // Not enough data to contain header ?
    if (view.byteLength  < 0x12) {
      throw new Error('Targa::load() - Not enough data to contain header');
    }

    var header = {};
    header.idLength = view.getUint8(0x00);
    header.colorMapType = view.getUint8(0x01);
    header.imageType =  view.getUint8(0x02);
    header.colorMapIndex = view.getUint16(0x03, littleEndian);
    header.colorMapLength = view.getUint16(0x05, littleEndian);
    header.colorMapDepth = view.getUint8(0x07);
    header.offsetX = view.getUint16(0x08, littleEndian);
    header.offsetY = view.getUint16(0x0a, littleEndian);
    header.width = view.getUint16(0x0c, littleEndian);
    header.height = view.getUint16(0x0e, littleEndian);
    header.pixelDepth = view.getUint8(0x10);
    header.flags = view.getUint8(0x11);

    return header;
  }

  /**
   * Set additional header booleans
   * @param header
   */
  function setHeaderBooleans(header) {
    header.hasEncoding = (header.imageType === Targa.Type.RLE_INDEXED || header.imageType === Targa.Type.RLE_RGB || header.imageType === Targa.Type.RLE_GREY);
    header.hasColorMap = (header.imageType === Targa.Type.RLE_INDEXED || header.imageType === Targa.Type.INDEXED);
    header.isGreyColor = (header.imageType === Targa.Type.RLE_GREY || header.imageType === Targa.Type.GREY);
    header.bytePerPixel = header.pixelDepth >> 3;
    header.origin = (header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    header.alphaBits = header.flags & Targa.Origin.ALPHA;
  }

  /**
   * Check the header of TGA file to detect errors
   *
   * @param {object} header tga header structure
   * @throws Error
   */
  function checkHeader(header) {
    // What the need of a file without data ?
    if (header.imageType === Targa.Type.NO_DATA) {
      throw new Error('Targa::checkHeader() - No data');
    }

    // Indexed type
    if (header.hasColorMap) {
      if (header.colorMapLength > 256 || header.colorMapType !== 1) {
        throw new Error('Targa::checkHeader() - Unsupported colormap for indexed type');
      }
      if (header.colorMapDepth !== 16 && header.colorMapDepth !== 24  && header.colorMapDepth !== 32) {
        throw new Error('Targa::checkHeader() - Unsupported colormap depth');
      }
    }
    else {
      if (header.colorMapType) {
        throw new Error('Targa::checkHeader() - Why does the image contain a palette ?');
      }
    }

    // Check image size
    if (header.width <= 0 || header.height <= 0) {
      throw new Error('Targa::checkHeader() - Invalid image size');
    }

    // Check pixel size
    if (header.pixelDepth !== 8 &&
      header.pixelDepth !== 16 &&
      header.pixelDepth !== 24 &&
      header.pixelDepth !== 32) {
      throw new Error('Targa::checkHeader() - Invalid pixel size "' + header.pixelDepth + '"');
    }

    // Check alpha size
    if (header.alphaBits !== 0 &&
        header.alphaBits !== 1 &&
        header.alphaBits !== 8) {
      throw new Error('Targa::checkHeader() - Unsuppported alpha size');
    }
  }


  /**
   * Decode RLE compression
   *
   * @param {Uint8Array} data
   * @param {number} bytesPerPixel bytes per Pixel
   * @param {number} outputSize in byte: width * height * pixelSize
   */
  function decodeRLE(data, bytesPerPixel, outputSize) {
    var pos, c, count, i, offset;
    var pixels, output;

    output = new Uint8Array(outputSize);
    pixels = new Uint8Array(bytesPerPixel);
    offset = 0; // offset in data
    pos = 0; // offset for output

    while (pos < outputSize) {
      c = data[offset++]; // current byte to check
      count = (c & Targa.RLE_MASK) + 1; // repetition count of pixels, the lower 7 bits + 1

      // RLE packet, if highest bit is set to 1.
      if (c & Targa.RLE_BIT) {
        // Copy pixel values to be repeated to tmp array
        for (i = 0; i < bytesPerPixel; ++i) {
          pixels[i] = data[offset++];
        }

        // Copy pixel values * count to output
        for (i = 0; i < count; ++i) {
          output.set(pixels, pos);
          pos += bytesPerPixel;
        }
      }

      // Raw packet (Non-Run-Length Encoded)
      else {
        count *= bytesPerPixel;
        for (i = 0; i < count; ++i) {
          output[pos++] = data[offset++];
        }
      }
    }

    if (pos > outputSize) {
      throw new Error("Targa::decodeRLE() - Read bytes: " + pos + " Expected bytes: " + outputSize);
    }

    return output;
  }

  /**
   * Encode ImageData object with RLE compression
   *
   * @param header
   * @param imageData from canvas to compress
   */
  function encodeRLE(header, imageData) {
    var maxRepetitionCount = 128;
    var i;
    var data = imageData;
    var output = []; // output size is unknown
    var pos = 0; // pos in imageData array
    var bytesPerPixel = header.pixelDepth >> 3;
    var offset = 0;
    var packetType, packetLength, packetHeader;
    var tgaLength = header.width * header.height * bytesPerPixel;
    var isSamePixel = function isSamePixel(pos, offset) {
      for (var i = 0; i < bytesPerPixel; i++) {
        if (data[pos * bytesPerPixel + i] !== data[offset * bytesPerPixel + i]) {
          return false;
        }
      }
      return true;
    };
    var getPacketType = function(pos) {
      if (isSamePixel(pos, pos + 1)) {
        return Targa.RLE_PACKET;
      }
      return Targa.RAW_PACKET;
    };

    while (pos * bytesPerPixel < data.length && pos * bytesPerPixel < tgaLength) {
      // determine packet type
      packetType = getPacketType(pos);

      // determine packet length
      packetLength = 0;
      if (packetType === Targa.RLE_PACKET) {
        while (pos + packetLength < data.length
        && packetLength < maxRepetitionCount
        && isSamePixel(pos, pos + packetLength)) {
          packetLength++;
        }
      } else { // packetType === Targa.RAW_PACKET
        while (pos + packetLength < data.length
        && packetLength < maxRepetitionCount
        && getPacketType(pos + packetLength) === Targa.RAW_PACKET) {
          packetLength++;
        }
      }

      // write packet header
      packetHeader = packetLength - 1;
      if (packetType === Targa.RLE_PACKET) {
        packetHeader |= Targa.RLE_BIT;
      }
      output[offset++] = packetHeader;

      // write rle packet pixel OR raw pixels
      if (packetType === Targa.RLE_PACKET) {
        for (i = 0; i < bytesPerPixel; i++) {
          output[i + offset] = data[i + pos * bytesPerPixel];
        }
        offset += bytesPerPixel;
      } else {
        for (i = 0; i < bytesPerPixel * packetLength; i++) {
          output[i + offset] = data[i + pos * bytesPerPixel];
        }
        offset += bytesPerPixel * packetLength;
      }
      pos += packetLength;
    }

    return new Uint8Array(output);
  }


  /**
   * Return a ImageData object from a TGA file (8bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} indexes - index to colorMap
   * @param {Array} colorMap
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData8bits(imageData, indexes, colorMap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, index, offset, i, x, y;
    var bytePerPixel = this.header.colorMapDepth >> 3;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i++) {
        offset = (x + width * y) * 4;
        index = indexes[i] * bytePerPixel;
        if (bytePerPixel === 4) {
          imageData[offset    ] = colorMap[index + 2]; // red
          imageData[offset + 1] = colorMap[index + 1]; // green
          imageData[offset + 2] = colorMap[index    ]; // blue
          imageData[offset + 3] = colorMap[index + 3]; // alpha
        } else if (bytePerPixel === 3) {
          imageData[offset    ] = colorMap[index + 2]; // red
          imageData[offset + 1] = colorMap[index + 1]; // green
          imageData[offset + 2] = colorMap[index    ]; // blue
          imageData[offset + 3] = 255; // alpha
        } else if (bytePerPixel === 2) {
          color = colorMap[index] | (colorMap[index + 1] << 8);
          imageData[offset    ] = (color & 0x7C00) >> 7; // red
          imageData[offset + 1] = (color & 0x03E0) >> 2; // green
          imageData[offset + 2] = (color & 0x001F) << 3; // blue
          imageData[offset + 3] = (color & 0x8000) ? 0 : 255; // overlay 0 = opaque and 1 = transparent Discussion at: https://bugzilla.gnome.org/show_bug.cgi?id=683381
        }
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (16bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData16bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 2) {
        color = pixels[i] | (pixels[i + 1] << 8);
        offset = (x + width * y) * 4;
        imageData[offset    ] = (color & 0x7C00) >> 7; // red
        imageData[offset + 1] = (color & 0x03E0) >> 2; // green
        imageData[offset + 2] = (color & 0x001F) << 3; // blue
        imageData[offset + 3] = (color & 0x8000) ? 0 : 255; // overlay 0 = opaque and 1 = transparent Discussion at: https://bugzilla.gnome.org/show_bug.cgi?id=683381
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (24bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData24bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var offset, i, x, y;
    var bpp = this.header.pixelDepth >> 3;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += bpp) {
        offset = (x + width * y) * 4;
        imageData[offset + 3] = 255;  // alpha
        imageData[offset + 2] = pixels[i    ]; // blue
        imageData[offset + 1] = pixels[i + 1]; // green
        imageData[offset    ] = pixels[i + 2]; // red
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (32bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data from TGA file
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData32bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var i, x, y, offset;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 4) {
        offset = (x + width * y) * 4;
        imageData[offset + 2] = pixels[i    ]; // blue
        imageData[offset + 1] = pixels[i + 1]; // green
        imageData[offset    ] = pixels[i + 2]; // red
        imageData[offset + 3] = pixels[i + 3]; // alpha
      }
    }

    return imageData;
  }

  /**
   * Return a ImageData object from a TGA file (32bits). Uses pre multiplied alpha values
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data from TGA file
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData32bitsPre(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var i, x, y, offset, alpha;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 4) {
        offset = (x + width * y) * 4;
        alpha = pixels[i + 3] * 255; // TODO needs testing
        imageData[offset + 2] = pixels[i    ] / alpha; // blue
        imageData[offset + 1] = pixels[i + 1] / alpha; // green
        imageData[offset    ] = pixels[i + 2] / alpha; // red
        imageData[offset + 3] = pixels[i + 3]; // alpha
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (8bits grey)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageDataGrey8bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i++) {
        color = pixels[i];
        offset = (x + width * y) * 4;
        imageData[offset    ] = color; // red
        imageData[offset + 1] = color; // green
        imageData[offset + 2] = color; // blue
        imageData[offset + 3] = 255;   // alpha
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (16bits grey) 8 Bit RGB and 8 Bit Alpha
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageDataGrey16bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 2) {
        color = pixels[i];
        offset = (x + width * y) * 4;
        imageData[offset] = color;
        imageData[offset + 1] = color;
        imageData[offset + 2] = color;
        imageData[offset + 3] = pixels[i + 1];
      }
    }

    return imageData;
  }


  /**
   * Open a targa file using XHR, be aware with Cross Domain files...
   *
   * @param {string} path - Path of the filename to load
   * @param {function} callback - callback to trigger when the file is loaded
   */
  Targa.prototype.open = function targaOpen(path, callback) {
    var req, tga = this;
    req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
      if (this.status === 200) {
        tga.arrayBuffer = req.response;
        tga.load(tga.arrayBuffer);
        if (callback) {
          callback.call(tga);
        }
      }
    };
    req.send(null);
  };


  function readFooter(view) {
    var offset = view.byteLength - Targa.FOOTER_SIZE;
    var signature = Targa.SIGNATURE;

    var footer = {};

    var signatureArray = new Uint8Array(view.buffer, offset + 0x08, signature.length);
    var str = String.fromCharCode.apply(null, signatureArray);

    if (!isSignatureValid(str)) {
      footer.hasFooter = false;
      return footer;
    }

    footer.hasFooter = true;
    footer.extensionOffset = view.getUint32(offset, Targa.LITTLE_ENDIAN);
    footer.developerOffset = view.getUint32(offset + 0x04, Targa.LITTLE_ENDIAN);
    footer.hasExtensionArea = footer.extensionOffset !== 0;
    footer.hasDeveloperArea = footer.developerOffset !== 0;

    if (footer.extensionOffset) {
      footer.attributeType = view.getUint8(footer.extensionOffset + 494);
    }

    return footer;
  }

  function isSignatureValid(str) {
    var signature = Targa.SIGNATURE;

    for (var i = 0; i < signature.length; i++) {
      if (str.charCodeAt(i) !== signature.charCodeAt(i)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Load and parse a TGA file
   *
   * @param {ArrayBuffer} data - TGA file buffer array
   */
  Targa.prototype.load = function targaLoad(data) {
    var dataView = new DataView(data);

    this.headerData = new Uint8Array(data, 0, Targa.HEADER_SIZE);

    this.header = readHeader(dataView); // Parse Header
    setHeaderBooleans(this.header);
    checkHeader(this.header); // Check if a valid TGA file (or if we can load it)

    var offset = Targa.HEADER_SIZE;
    // Move to data
    offset += this.header.idLength;
    if (offset >= data.byteLength) {
      throw new Error('Targa::load() - No data');
    }

    // Read palette
    if (this.header.hasColorMap) {
      var colorMapSize = this.header.colorMapLength * (this.header.colorMapDepth >> 3);
      this.palette = new Uint8Array(data, offset, colorMapSize);
      offset += colorMapSize;
    }

    var bytesPerPixel = this.header.pixelDepth >> 3;
    var imageSize = this.header.width * this.header.height;
    var pixelTotal = imageSize * bytesPerPixel;

    if (this.header.hasEncoding) { // RLE encoded
      var RLELength = data.byteLength - offset - Targa.FOOTER_SIZE;
      var RLEData = new Uint8Array(data, offset, RLELength);
      this.imageData = decodeRLE(RLEData, bytesPerPixel, pixelTotal);
    } else { // RAW pixels
      this.imageData = new Uint8Array(data, offset, this.header.hasColorMap ? imageSize : pixelTotal);
    }
    
    this.footer = readFooter(dataView);

    if (this.header.alphaBits !== 0  || this.footer.hasExtensionArea && (this.footer.attributeType === 3 || this.footer.attributeType === 4)) {
      this.footer.usesAlpha = true;
    }
  };


  /**
   * Return a ImageData object from a TGA file
   *
   * @param {object} imageData - Optional ImageData to work with
   * @returns {object} imageData
   */
  Targa.prototype.getImageData = function targaGetImageData(imageData) {
    var width = this.header.width;
    var height = this.header.height;
    var origin = (this.header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    var x_start, x_step, x_end, y_start, y_step, y_end;
    var getImageData;

    // Create an imageData
    if (!imageData) {
      if (document) {
        imageData = document.createElement('canvas').getContext('2d').createImageData(width, height);
      }
      // In Thread context ?
      else {
        imageData = {
          width: width,
          height: height,
          data: new Uint8ClampedArray(width * height * 4)
        };
      }
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.TOP_RIGHT) {
      y_start = 0;
      y_step = 1;
      y_end = height;
    }
    else {
      y_start = height - 1;
      y_step = -1;
      y_end = -1;
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.BOTTOM_LEFT) {
      x_start = 0;
      x_step = 1;
      x_end = width;
    }
    else {
      x_start = width - 1;
      x_step = -1;
      x_end = -1;
    }

    // TODO: use this.header.offsetX and this.header.offsetY ?

    switch (this.header.pixelDepth) {
      case 8:
        getImageData = this.header.isGreyColor ? getImageDataGrey8bits : getImageData8bits;
        break;

      case 16:
        getImageData = this.header.isGreyColor ? getImageDataGrey16bits : getImageData16bits;
        break;

      case 24:
        getImageData = getImageData24bits;
        break;

      case 32:
        if (this.footer.hasExtensionArea) {
          if (this.footer.attributeType === 3) { // straight alpha
            getImageData = getImageData32bits;
          } else if (this.footer.attributeType === 4) { // pre multiplied alpha
            getImageData = getImageData32bitsPre;
          } else { // ignore alpha values if attributeType set to 0, 1, 2
            getImageData = getImageData24bits;
          }
        } else {
          if (this.header.alphaBits !== 0) {
            getImageData = getImageData32bits;
          } else { // 32 bits Depth, but alpha Bits set to 0
            getImageData = getImageData24bits;
          }
        }

        break;
    }

    getImageData.call(this, imageData.data, this.imageData, this.palette, width, y_start, y_step, y_end, x_start, x_step, x_end);
    return imageData;
  };

  /** (Experimental)
   *  Encodes imageData into TGA format
   *  Only TGA True Color 32 bit with optional RLE encoding is supported for now
   * @param imageData
   */
  Targa.prototype.setImageData = function targaSetImageData(imageData) {

    if (!imageData) {
      throw new Error('Targa::setImageData() - imageData argument missing');
    }

    var width = this.header.width;
    var height = this.header.height;
    var expectedLength = width * height * (this.header.pixelDepth  >> 3);
    var origin = (this.header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    var x_start, x_step, x_end, y_start, y_step, y_end;

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.TOP_RIGHT) {
      y_start = 0; // start bottom, step upward
      y_step = 1;
      y_end = height;
    } else {
      y_start = height - 1; // start at top, step downward
      y_step = -1;
      y_end = -1;
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.BOTTOM_LEFT) {
      x_start = 0; // start left, step right
      x_step = 1;
      x_end = width;
    } else {
      x_start = width - 1; // start right, step left
      x_step = -1;
      x_end = -1;
    }

    if (!this.imageData) {
      this.imageData = new Uint8Array(expectedLength);
    }

    // start top left if origin is bottom left
    // swapping order of first two arguments does the trick for writing
    // this converts canvas data to internal tga representation
    // this.imageData contains tga data
    getImageData32bits(this.imageData, imageData.data, this.palette, width, y_start, y_step, y_end, x_start, x_step, x_end);

    var data = this.imageData;

    if (this.header.hasEncoding) {
      data = encodeRLE(this.header, data);
    }

    var bufferSize = Targa.HEADER_SIZE + data.length + Targa.FOOTER_SIZE;
    var buffer = new ArrayBuffer(bufferSize);

    this.arrayBuffer = buffer;
    // create array, useful for inspecting data while debugging
    this.headerData = new Uint8Array(buffer, 0, Targa.HEADER_SIZE);
    this.RLEData = new Uint8Array(buffer, Targa.HEADER_SIZE, data.length);
    this.footerData = new Uint8Array(buffer, Targa.HEADER_SIZE + data.length, Targa.FOOTER_SIZE);

    var headerView = new DataView(this.headerData.buffer);
    writeHeader(this.header, headerView);
    this.RLEData.set(data);
    writeFooter(this.footerData);
  };

  /**
   * Return a canvas with the TGA render on it
   *
   * @returns {object} CanvasElement
   */
  Targa.prototype.getCanvas = function targaGetCanvas() {
    var canvas, ctx, imageData;

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(this.header.width, this.header.height);

    canvas.width = this.header.width;
    canvas.height = this.header.height;

    ctx.putImageData(this.getImageData(imageData), 0, 0);

    return canvas;
  };


  /**
   * Return a dataURI of the TGA file
   *
   * @param {string} type - Optional image content-type to output (default: image/png)
   * @returns {string} url
   */
  Targa.prototype.getDataURL = function targaGetDatURL(type) {
    return this.getCanvas().toDataURL(type || 'image/png');
  };

  /**
   * Return a objectURL of the TGA file
   * The url can be used in the download attribute of a link
   * @returns {string} url
   */
  Targa.prototype.getBlobURL = function targetGetBlobURL() {
    if (!this.arrayBuffer) {
      throw new Error('Targa::getBlobURL() - No data available for blob');
    }
    var blob = new Blob([this.arrayBuffer], { type: "image/x-tga" });
    return URL.createObjectURL(blob);
  };


  // Find Context
  var shim = {};
  if (typeof(exports) === 'undefined') {
    if (typeof(define) === 'function' && typeof(define.amd) === 'object' && define.amd) {
      define(function () {
        return Targa;
      });
    } else {
      // Browser
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // Commonjs
    shim.exports = exports;
  }


  // Export
  if (shim.exports) {
    shim.exports.TGA = Targa;
  }

})(this);

},{}],25:[function(require,module,exports){
const C_OPCODES = require('./opcodes/client');
const ChatMessage = require('./chat-message');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const GameBuffer = require('./game-buffer');
const GameCharacter = require('./game-character');
const GameConnection = require('./game-connection');
const GameData = require('./game-data');
const GameModel = require('./game-model');
const Long = require('long');
const Panel = require('./panel');
const S_OPCODES = require('./opcodes/server');
const Scene = require('./scene');
const StreamAudioPlayer = require('./stream-audio-player');
const Surface = require('./surface');
const SurfaceSprite = require('./surface-sprite');
const Utility = require('./utility');
const VERSION = require('./version');
const WordFilter = require('./word-filter');
const World = require('./world');

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

class mudclient extends GameConnection {
    constructor(canvas) {
        super(canvas);

        this.menuMaxSize = 250;
        this.pathStepsMax = 8000;
        this.playersMax = 500;
        this.npcsMax = 500;
        this.wallObjectsMax = 500;
        this.playersServerMax = 4000;
        this.groundItemsMax = 5000;
        this.npcsServerMax = 5000;
        this.objectsMax = 1500;
        this.playerStatCount = 18;
        this.questCount = 50;
        this.playerStatEquipmentCount = 5;

        this.localRegionX = 0;
        this.localRegionY = 0;
        this.controlTextListChat = 0;
        this.controlTextListAll = 0;
        this.controlTextListQuest = 0;
        this.controlTextListPrivate = 0;
        this.messageTabSelected = 0;
        this.mouseClickXX = 0;
        this.mouseClickXY = 0;
        this.controlListSocialPlayers = 0;
        this.uiTabSocialSubTab = 0;
        this.privateMessageTarget = new Long(0);
        this.controlListQuest = 0;
        this.uiTabPlayerInfoSubTab = 0;
        this.controlListMagic = 0;
        this.tabMagicPrayer = 0;
        this.packetErrorCount = 0;
        this.mouseButtonDownTime = 0;
        this.mouseButtonItemCountIncrement = 0;
        this.anInt659 = 0;
        this.anInt660 = 0;
        this.cameraRotationX = 0;
        this.scene = null;
        this.loginScreen = 0;
        this.showDialogReportAbuseStep = 0;
        this.tradeConfirmAccepted = false;
        this.audioPlayer = null;
        this.appearanceHeadType = 0;
        this.appearanceSkinColour = 0;
        this.showDialogSocialInput = 0;
        this.anInt707 = 0;
        this.deathScreenTimeout = 0;
        this.cameraRotationY = 0;
        this.combatStyle = 0;
        this.welcomeUnreadMessages = 0;
        this.controlButtonAppearanceHead1 = 0;
        this.controlButtonAppearanceHead2 = 0;
        this.controlButtonAppearanceHair1 = 0;
        this.controlButtonAppearanceHair2 = 0;
        this.controlButtonAppearanceGender1 = 0;
        this.controlButtonAppearanceGender2 = 0;
        this.controlButtonAppearanceTop1 = 0;
        this.controlButtonAppearanceTop2 = 0;
        this.controlButtonAppearanceSkin1 = 0;
        this.controlButtonAppearanceSkin2 = 0;
        this.controlButtonAppearanceBottom1 = 0;
        this.controlButtonAppearanceBottom2 = 0;
        this.controlButtonAppearanceAccept = 0;
        this.logoutTimeout = 0;
        this.tradeRecipientConfirmHash = new Long(0);
        this.loginTimer = 0;
        this.npcCombatModelArray2 = new Int32Array([0, 0, 0, 0, 0, 1, 2, 1]);
        this.systemUpdate = 0;
        this.graphics = null;
        this.regionX = 0;
        this.regionY = 0;
        this.welcomScreenAlreadyShown = false;
        this.mouseButtonClick = 0;
        this.questName = [ 
            'Black knight\'s fortress', 'Cook\'s assistant', 'Demon slayer', 'Doric\'s quest', 'The restless ghost', 'Goblin diplomacy', 'Ernest the chicken', 'Imp catcher', 'Pirate\'s treasure', 'Prince Ali rescue',
            'Romeo & Juliet', 'Sheep shearer', 'Shield of Arrav', 'The knight\'s sword', 'Vampire slayer', 'Witch\'s potion', 'Dragon slayer', 'Witch\'s house (members)', 'Lost city (members)', 'Hero\'s quest (members)',
            'Druidic ritual (members)', 'Merlin\'s crystal (members)', 'Scorpion catcher (members)', 'Family crest (members)', 'Tribal totem (members)', 'Fishing contest (members)', 'Monk\'s friend (members)', 'Temple of Ikov (members)', 'Clock tower (members)', 'The Holy Grail (members)',
            'Fight Arena (members)', 'Tree Gnome Village (members)', 'The Hazeel Cult (members)', 'Sheep Herder (members)', 'Plague City (members)', 'Sea Slug (members)', 'Waterfall quest (members)', 'Biohazard (members)', 'Jungle potion (members)', 'Grand tree (members)',
            'Shilo village (members)', 'Underground pass (members)', 'Observatory quest (members)', 'Tourist trap (members)', 'Watchtower (members)', 'Dwarf Cannon (members)', 'Murder Mystery (members)', 'Digsite (members)', 'Gertrude\'s Cat (members)', 'Legend\'s Quest (members)'
        ];
        this.healthBarCount = 0;
        this.spriteMedia = 0;
        this.spriteUtil = 0;
        this.spriteItem = 0;
        this.spriteProjectile = 0;
        this.spriteTexture = 0;
        this.spriteTextureWorld = 0;
        this.spriteLogo = 0;
        this.controlLoginStatus = 0;
        this.controlLoginUser = 0;
        this.controlLoginPass = 0;
        this.controlLoginOk = 0;
        this.controlLoginCancel = 0;
        this.teleportBubbleCount = 0;
        this.mouseClickCount = 0;
        this.shopSellPriceMod = 0;
        this.shopBuyPriceMod = 0;
        this.duelOptionRetreat = 0;
        this.duelOptionMagic = 0;
        this.duelOptionPrayer = 0;
        this.duelOptionWeapons = 0;
        this.groundItemCount = 0;
        this.receivedMessagesCount = 0;
        this.messageTabFlashAll = 0;
        this.messageTabFlashHistory = 0;
        this.messageTabFlashQuest = 0;
        this.messageTabFlashPrivate = 0;
        this.bankItemCount = 0;
        this.objectAnimationNumberFireLightningSpell = 0;
        this.objectAnimationNumberTorch = 0;
        this.objectAnimationNumberClaw = 0;
        this.loggedIn = 0;
        this.npcCount = 0;
        this.npcCacheCount = 0;
        this.objectAnimationCount = 0;
        this.tradeConfirmItemsCount = 0;
        this.mouseClickXStep = 0;
        this.newBankItemCount = 0;
        this.npcAnimationArray = [
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3, 4]), 
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3, 4]), 
            new Int32Array([11, 3, 2, 9, 7, 1, 6, 10, 0, 5, 8, 4]), 
            new Int32Array([3, 4, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]), 
            new Int32Array([3, 4, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]), 
            new Int32Array([4, 3, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]), 
            new Int32Array([11, 4, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3]), 
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 4, 3])];
        this.controlWelcomeNewuser = 0;
        this.controlWelcomeExistinguser = 0;
        this.npcWalkModel = new Int32Array([0, 1, 2, 1]);
        this.referid = 0;
        this.anInt827 = 0;
        this.controlLoginNewOk = 0;
        this.combatTimeout = 0;
        this.optionMenuCount = 0;
        this.errorLoadingCodebase = false;
        this.reportAbuseOffence = 0;
        this.cameraRotationTime = 0;
        this.duelOpponentItemsCount = 0;
        this.duelItemsCount = 0;
        this.characterSkinColours = new Int32Array([0xecded0, 0xccb366, 0xb38c40, 0x997326, 0x906020]);
        this.duelOfferOpponentItemCount = 0;
        this.characterTopBottomColours = new Int32Array([
            0xff0000, 0xff8000, 0xffe000, 0xa0e000, 57344, 32768, 41088, 45311, 33023, 12528,
            0xe000e0, 0x303030, 0x604000, 0x805000, 0xffffff
        ]);
        this.itemsAboveHeadCount = 0;
        this.showUiWildWarn = 0;
        this.selectedItemInventoryIndex = 0;
        this.soundData = null;
        this.statFatigue = 0;
        this.fatigueSleeping = 0;
        this.tradeRecipientConfirmItemsCount = 0;
        this.tradeRecipientItemsCount = 0;
        this.showDialogServermessage = false;
        this.menuX = 0;
        this.menuY = 0;
        this.menuWidth = 0;
        this.menuHeight = 0;
        this.menuItemsCount = 0;
        this.showUiTab = 0;
        this.tradeItemsCount = 0;
        this.planeWidth = 0;
        this.planeHeight = 0;
        this.planeMultiplier = 0;
        this.playerQuestPoints = 0;
        this.characterHairColours = new Int32Array([
            0xffc030, 0xffa040, 0x805030, 0x604020, 0x303030, 0xff6020, 0xff4000, 0xffffff, 65280, 65535
        ]);
        this.bankActivePage = 0;
        this.welcomeLastLoggedInDays = 0;
        this.equipmentStatNames = ['Armour', 'WeaponAim', 'WeaponPower', 'Magic', 'Prayer'];
        this.inventoryItemsCount = 0;
        this.skillNameShort = [ 
            'Attack', 'Defense', 'Strength', 'Hits', 'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcut', 'Fletching',
            'Fishing', 'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblaw', 'Agility', 'Thieving'
        ];
        this.duelOpponentNameHash = new Long(0);
        this.minimapRandom_1 = 0;
        this.minimapRandom_2 = 0;
        this.objectCount = 0;
        this.duelOfferItemCount = 0; 
        this.objectCount = 0;
        this.duelOfferItemCount = 0;
        this.cameraAutoRotatePlayerX = 0;
        this.cameraAutoRotatePlayerY = 0;
        this.npcCombatModelArray1 = new Int32Array([0, 1, 2, 1, 0, 0, 0, 0]);
        this.skillNamesLong = [
            'Attack', 'Defense', 'Strength', 'Hits', 'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching',
            'Fishing', 'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblaw', 'Agility', 'Thieving'
        ];
        this.playerCount = 0;
        this.knownPlayerCount = 0;
        this.spriteCount = 0;
        this.wallObjectCount = 0;
        this.welcomeRecoverySetDays = 0;
        this.localLowerX = 0;
        this.localLowerY = 0;
        this.localUpperX = 0;
        this.localUpperY = 0;
        this.world = null;
        this.welcomeLastLoggedInIP = 0;
        this.sleepWordDelayTimer = 0;

        this.menuIndices = new Int32Array(this.menuMaxSize);
        this.cameraAutoAngleDebug = false;
        this.wallObjectDirection = new Int32Array(this.wallObjectsMax);
        this.wallObjectId = new Int32Array(this.wallObjectsMax);
        this.cameraRotationXIncrement = 2;
        this.inventoryMaxItemCount = 30;
        this.bankItemsMax = 48;
        this.optionMenuEntry = [];
        this.optionMenuEntry.length = 5;
        this.optionMenuEntry.fill(null);
        this.newBankItems = new Int32Array(256);
        this.newBankItemsCount = new Int32Array(256);
        this.teleportBubbleTime = new Int32Array(50);
        this.showDialogTradeConfirm = false;
        this.tradeConfirmAccepted = false;
        this.receivedMessageX = new Int32Array(50);
        this.receivedMessageY = new Int32Array(50);
        this.receivedMessageMidPoint = new Int32Array(50);
        this.receivedMessageHeight = new Int32Array(50);
        this.localPlayer = new GameCharacter();
        this.localPlayerServerIndex = -1;
        this.menuItemX = new Int32Array(this.menuMaxSize);
        this.menuItemY = new Int32Array(this.menuMaxSize);
        this.showDialogTrade = false;
        this.bankItems = new Int32Array(256);
        this.bankItemsCount = new Int32Array(256);
        this.appearanceBodyGender = 1;
        this.appearance2Colour = 2;
        this.appearanceHairColour = 2;
        this.appearanceTopColour = 8;
        this.appearanceBottomColour = 14;
        this.appearanceHeadGender = 1;
        this.loginUser = '';
        this.loginPass = '';
        this.cameraAngle = 1;
        this.members = false;
        this.optionSoundDisabled = false;
        this.showRightClickMenu = false;
        this.cameraRotationYIncrement = 2;
        this.objectAlreadyInMenu = new Int8Array(this.objectsMax);
        this.menuItemText1 = [];
        this.menuItemText1.length = this.menuMaxSize;
        this.menuItemText1.fill(null);
        this.duelOpponentName = '';
        this.lastObjectAnimationNumberFireLightningSpell = -1;
        this.lastObjectAnimationNumberTorch = -1;
        this.lastObjectAnimationNumberClaw = -1;
        this.planeIndex = -1;
        this.welcomScreenAlreadyShown = false;
        this.isSleeping = false;
        this.cameraRotation = 128;
        this.teleportBubbleX = new Int32Array(50);
        this.errorLoadingData = false;
        this.playerExperience = new Int32Array(this.playerStatCount);
        this.tradeRecipientAccepted = false;
        this.tradeAccepted = false;
        this.mouseClickXHistory = new Int32Array(8192);
        this.mouseClickYHistory = new Int32Array(8192);
        this.showDialogWelcome = false;
        this.playerServerIndexes = new Int32Array(this.playersMax);
        this.teleportBubbleY = new Int32Array(50);
        this.receivedMessages = [];
        this.receivedMessages.length = 50;
        this.receivedMessages.fill(null);
        this.showDialogDuelConfirm = false;
        this.duelAccepted = false;
        this.players = [];
        this.players.length = this.playersMax;
        this.players.fill(null);
        this.prayerOn = new Int8Array(50);
        this.menuSourceType = new Int32Array(this.menuMaxSize);
        this.menuSourceIndex = new Int32Array(this.menuMaxSize);
        this.menuTargetIndex = new Int32Array(this.menuMaxSize);
        this.wallObjectAlreadyInMenu = new Int8Array(this.wallObjectsMax);
        this.magicLoc = 128;
        this.errorLoadingMemory = false;
        this.gameWidth = 512;
        this.gameHeight = 334; 
        this.const_9 = 9;
        this.tradeConfirmItems = new Int32Array(14);
        this.tradeConfirmItemCount = new Int32Array(14);
        this.tradeRecipientName = '';
        this.selectedSpell = -1;
        this.showOptionMenu = false;
        this.playerStatCurrent = new Int32Array(this.playerStatCount);
        this.teleportBubbleType = new Int32Array(50);
        this.errorLoadingCodebase = false;
        this.showDialogShop = false;
        this.shopItem = new Int32Array(256);
        this.shopItemCount = new Int32Array(256);
        this.shopItemPrice = new Int32Array(256);
        this.duelOfferOpponentAccepted = false;
        this.duelOfferAccepted = false;
        this.gameModels = [];
        this.gameModels.length = 1000;
        this.gameModels.fill(null);
        this.showDialogDuel = false;
        this.serverMessage = '';
        this.serverMessageBoxTop = false;
        this.duelOpponentItems = new Int32Array(8);
        this.duelOpponentItemCount = new Int32Array(8);
        this.duelItems = new Int32Array(8);
        this.duelItemCount = new Int32Array(8);
        this.playerStatBase = new Int32Array(this.playerStatCount);
        this.npcsCache = [];
        this.npcsCache.length = this.npcsMax;
        this.npcsCache.fill(null);
        this.groundItemX = new Int32Array(this.groundItemsMax);
        this.groundItemY = new Int32Array(this.groundItemsMax);
        this.groundItemId = new Int32Array(this.groundItemsMax);
        this.groundItemZ = new Int32Array(this.groundItemsMax);
        this.bankSelectedItemSlot = -1;
        this.bankSelectedItem = -2;
        this.duelOfferOpponentItemId = new Int32Array(8);
        this.duelOfferOpponentItemStack = new Int32Array(8);
        this.messageHistoryTimeout = new Int32Array(5);
        this.optionCameraModeAuto = true;
        this.objectX = new Int32Array(this.objectsMax);
        this.objectY = new Int32Array(this.objectsMax);
        this.objectId = new Int32Array(this.objectsMax);
        this.objectDirection = new Int32Array(this.objectsMax);
        this.selectedItemInventoryIndex = -1;
        this.selectedItemName = '';
        this.loadingArea = false;
        this.tradeRecipientConfirmItems = new Int32Array(14);
        this.tradeRecipientConfirmItemCount = new Int32Array(14);
        this.tradeRecipientItems = new Int32Array(14);
        this.tradeRecipientItemCount = new Int32Array(14);
        this.showDialogServermessage = false;
        this.menuItemID = new Int32Array(this.menuMaxSize);
        this.questComplete = new Int8Array(this.questCount);
        this.wallObjectModel = [];
        this.wallObjectModel.length = this.wallObjectsMax;
        this.wallObjectModel.fill(null);
        this.actionBubbleX = new Int32Array(50);
        this.actionBubbleY = new Int32Array(50);
        this.cameraZoom = 550;
        this.tradeItems = new Int32Array(14);
        this.tradeItemCount = new Int32Array(14);
        this.lastHeightOffset = -1;
        this.duelSettingsRetreat = false;
        this.duelSettingsMagic = false;
        this.duelSettingsPrayer = false;
        this.duelSettingsWeapons = false;
        this.showDialogBank = false;
        this.loginUserDesc = '';
        this.loginUserDisp = '';
        this.optionMouseButtonOne = false;
        this.inventoryItemId = new Int32Array(35);
        this.inventoryItemStackCount = new Int32Array(35);
        this.inventoryEquipped = new Int32Array(35);
        this.knownPlayers = [];
        this.knownPlayers.length = this.playersMax;
        this.knownPlayers.fill(null);
        this.messageHistory = [];
        this.messageHistory.length = 5;
        this.messageHistory.fill(null);
        this.reportAbuseMute = false;
        this.duelOfferItemId = new Int32Array(8);
        this.duelOfferItemStack = new Int32Array(8);
        this.actionBubbleScale = new Int32Array(50);
        this.actionBubbleItem = new Int32Array(50);
        this.sleepWordDelay = true;
        this.showAppearanceChange = false;
        this.shopSelectedItemIndex = -1;
        this.shopSelectedItemType = -2;
        this.projectileMaxRange = 40;
        this.npcs = [];
        this.npcs.length = this.npcsMax;
        this.npcs.fill(null);
        this.experienceArray = new Int32Array(99);
        this.healthBarX = new Int32Array(50);
        this.healthBarY = new Int32Array(50);
        this.healthBarMissing = new Int32Array(50);
        this.playerServer = [];
        this.playerServer.length = this.playersServerMax;
        this.playerServer.fill(null);
        this.walkPathX = new Int32Array(this.pathStepsMax);
        this.walkPathY = new Int32Array(this.pathStepsMax);
        this.wallObjectX = new Int32Array(this.wallObjectsMax);
        this.wallObjectY = new Int32Array(this.wallObjectsMax);
        this.menuItemText2 = [];
        this.menuItemText2.length = this.menuMaxSize;
        this.menuItemText2.fill(null);
        this.npcsServer = [];
        this.npcsServer.length = this.npcsServerMax;
        this.npcsServer.fill(null);
        this.playerStatEquipment = new Int32Array(this.playerStatEquipmentCount);
        this.objectModel = [];
        this.objectModel.length = this.objectsMax;
        this.objectModel.fill(null);
    }

    static formatNumber(i) {
        let s = i.toString();

        for (let j = s.length - 3; j > 0; j -= 3) {
            s = s.substring(0, j) + ',' + s.substring(j);
        }

        if (s.length > 8) {
            s = '@gre@' + s.substring(0, s.length - 8) + ' million @whi@(' + s + ')';
        } else if (s.length > 4) {
            s = '@cya@' + s.substring(0, s.length - 4) + 'K @whi@(' + s + ')';
        }

        return s;
    }

    playSoundFile(s) {
        if (this.audioPlayer === null) {
            return;
        }

        if (!this.optionSoundDisabled) {
            this.audioPlayer.writeStream(this.soundData, Utility.getDataFileOffset(s + '.pcm', this.soundData), Utility.getDataFileLength(s + '.pcm', this.soundData));
        }
    }

    drawDialogReportAbuse() {
        this.reportAbuseOffence = 0;
        let y = 135;

        for (let i = 0; i < 12; i++) {
            if (this.mouseX > 66 && this.mouseX < 446 && this.mouseY >= y - 12 && this.mouseY < y + 3) {
                this.reportAbuseOffence = i + 1;
            }

            y += 14;
        }

        if (this.mouseButtonClick !== 0 && this.reportAbuseOffence !== 0) {
            this.mouseButtonClick = 0;
            this.showDialogReportAbuseStep = 2;
            this.inputTextCurrent = '';
            this.inputTextFinal = '';
            return;
        }

        y += 15;

        if (this.mouseButtonClick !== 0) {
            this.mouseButtonClick = 0;

            if (this.mouseX < 56 || this.mouseY < 35 || this.mouseX > 456 || this.mouseY > 325) {
                this.showDialogReportAbuseStep = 0;
                return;
            }

            if (this.mouseX > 66 && this.mouseX < 446 && this.mouseY >= y - 15 && this.mouseY < y + 5) {
                this.showDialogReportAbuseStep = 0;
                return;
            }
        }

        this.surface.drawBox(56, 35, 400, 290, 0);
        this.surface.drawBoxEdge(56, 35, 400, 290, 0xffffff);
        y = 50;
        this.surface.drawStringCenter('This form is for reporting players who are breaking our rules', 256, y, 1, 0xffffff);
        y += 15;
        this.surface.drawStringCenter('Using it sends a snapshot of the last 60 secs of activity to us', 256, y, 1, 0xffffff);
        y += 15;
        this.surface.drawStringCenter('If you misuse this form, you will be banned.', 256, y, 1, 0xff8000);
        y += 15;
        y += 10;
        this.surface.drawStringCenter('First indicate which of our 12 rules is being broken. For a detailed', 256, y, 1, 0xffff00);
        y += 15;
        this.surface.drawStringCenter('explanation of each rule please read the manual on our website.', 256, y, 1, 0xffff00);
        y += 15;

        let textColour = 0;

        if (this.reportAbuseOffence === 1) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('1: Offensive language', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 2) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('2: Item scamming', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 3) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('3: Password scamming', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 4) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('4: Bug abuse', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 5) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('5: Jagex Staff impersonation', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 6) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('6: Account sharing/trading', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 7) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('7: Macroing', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 8) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('8: Mutiple logging in', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 9) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('9: Encouraging others to break rules', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 10) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('10: Misuse of customer support', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 11) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('11: Advertising / website', 256, y, 1, textColour);
        y += 14;

        if (this.reportAbuseOffence === 12) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, 0xffffff);
            textColour = 0xff8000;
        } else {
            textColour = 0xffffff;
        }

        this.surface.drawStringCenter('12: Real world item trading', 256, y, 1, textColour);
        y += 14;
        y += 15;
        textColour = 0xffffff;

        if (this.mouseX > 196 && this.mouseX < 316 && this.mouseY > y - 15 && this.mouseY < y + 5) {
            textColour = 0xffff00;
        }

        this.surface.drawStringCenter('Click here to cancel', 256, y, 1, textColour);
    }

    _walkToActionSource_from8(startX, startY, x1, y1, x2, y2, checkObjects, walkToAction) {
        let steps = this.world.route(startX, startY, x1, y1, x2, y2, this.walkPathX, this.walkPathY, checkObjects);

        if (steps === -1) {
            if (walkToAction) {
                steps = 1;
                this.walkPathX[0] = x1;
                this.walkPathY[0] = y1;
            } else {
                return false;
            }
        }

        steps--;
        startX = this.walkPathX[steps];
        startY = this.walkPathY[steps];
        steps--;

        if (walkToAction) {
            this.clientStream.newPacket(C_OPCODES.WALK_ACTION);
        } else {
            this.clientStream.newPacket(C_OPCODES.WALK);
        }

        this.clientStream.putShort(startX + this.regionX);
        this.clientStream.putShort(startY + this.regionY);

        if (walkToAction && steps === -1 && (startX + this.regionX) % 5 === 0) {
            steps = 0;
        }

        for (let l1 = steps; l1 >= 0 && l1 > steps - 25; l1--) {
            this.clientStream.putByte(this.walkPathX[l1] - startX);
            this.clientStream.putByte(this.walkPathY[l1] - startY);
        }

        this.clientStream.sendPacket();

        this.mouseClickXStep = -24;
        this.mouseClickXX = this.mouseX;
        this.mouseClickXY = this.mouseY;

        return true;
    }

    walkTo(startX, startY, x1, y1, x2, y2, checkObjects, walkToAction) {
        let steps = this.world.route(startX, startY, x1, y1, x2, y2, this.walkPathX, this.walkPathY, checkObjects);

        if (steps === -1) {
            return false;
        }

        steps--;
        startX = this.walkPathX[steps];
        startY = this.walkPathY[steps];
        steps--;

        if (walkToAction) {
            this.clientStream.newPacket(C_OPCODES.WALK_ACTION);
        } else {
            this.clientStream.newPacket(C_OPCODES.WALK);
        }

        this.clientStream.putShort(startX + this.regionX);
        this.clientStream.putShort(startY + this.regionY);

        if (walkToAction && steps === -1 && (startX + this.regionX) % 5 === 0) {
            steps = 0;
        }

        for (let l1 = steps; l1 >= 0 && l1 > steps - 25; l1--) {
            this.clientStream.putByte(this.walkPathX[l1] - startX);
            this.clientStream.putByte(this.walkPathY[l1] - startY);
        }

        this.clientStream.sendPacket();

        this.mouseClickXStep = -24;
        this.mouseClickXX = this.mouseX;
        this.mouseClickXY = this.mouseY;

        return true;
    }

    drawMinimapEntity(x, y, c) {
        this.surface.setPixel(x, y, c);
        this.surface.setPixel(x - 1, y, c);
        this.surface.setPixel(x + 1, y, c);
        this.surface.setPixel(x, y - 1, c);
        this.surface.setPixel(x, y + 1, c);
    }

    updateBankItems() {
        this.bankItemCount = this.newBankItemCount;

        for (let i = 0; i < this.newBankItemCount; i++) {
            this.bankItems[i] = this.newBankItems[i];
            this.bankItemsCount[i] = this.newBankItemsCount[i];
        }

        for (let invIdx = 0; invIdx < this.inventoryItemsCount; invIdx++) {
            if (this.bankItemCount >= this.bankItemsMax) {
                break;
            }

            let invId = this.inventoryItemId[invIdx];
            let hasItemInInv = false;

            for (let bankidx = 0; bankidx < this.bankItemCount; bankidx++) {
                if (this.bankItems[bankidx] !== invId) {
                    continue;
                }

                hasItemInInv = true;
                break;
            }

            if (!hasItemInInv) {
                this.bankItems[this.bankItemCount] = invId;
                this.bankItemsCount[this.bankItemCount] = 0;
                this.bankItemCount++;
            }
        }
    }

    drawDialogWildWarn() {
        let y = 97;

        this.surface.drawBox(86, 77, 340, 180, 0);
        this.surface.drawBoxEdge(86, 77, 340, 180, 0xffffff);
        this.surface.drawStringCenter('Warning! Proceed with caution', 256, y, 4, 0xff0000);
        y += 26;
        this.surface.drawStringCenter('If you go much further north you will enter the', 256, y, 1, 0xffffff);
        y += 13;
        this.surface.drawStringCenter('wilderness. This a very dangerous area where', 256, y, 1, 0xffffff);
        y += 13;
        this.surface.drawStringCenter('other players can attack you!', 256, y, 1, 0xffffff);
        y += 22;
        this.surface.drawStringCenter('The further north you go the more dangerous it', 256, y, 1, 0xffffff);
        y += 13;
        this.surface.drawStringCenter('becomes, but the more treasure you will find.', 256, y, 1, 0xffffff);
        y += 22;
        this.surface.drawStringCenter('In the wilderness an indicator at the bottom-right', 256, y, 1, 0xffffff);
        y += 13;
        this.surface.drawStringCenter('of the screen will show the current level of danger', 256, y, 1, 0xffffff);
        y += 22;

        let j = 0xffffff;

        if (this.mouseY > y - 12 && this.mouseY <= y && this.mouseX > 181 && this.mouseX < 331) {
            j = 0xff0000;
        }

        this.surface.drawStringCenter('Click here to close window', 256, y, 1, j);

        if (this.mouseButtonClick !== 0) {
            if (this.mouseY > y - 12 && this.mouseY <= y && this.mouseX > 181 && this.mouseX < 331) {
                this.showUiWildWarn = 2;
            }

            if (this.mouseX < 86 || this.mouseX > 426 || this.mouseY < 77 || this.mouseY > 257) {
                this.showUiWildWarn = 2;
            }

            this.mouseButtonClick = 0;
        }
    }

    drawAboveHeadStuff() {
        for (let msgIdx = 0; msgIdx < this.receivedMessagesCount; msgIdx++) {
            let txtHeight = this.surface.textHeight(1);
            let x = this.receivedMessageX[msgIdx];
            let y = this.receivedMessageY[msgIdx];
            let mId = this.receivedMessageMidPoint[msgIdx];
            let msgHeight = this.receivedMessageHeight[msgIdx];
            let flag = true;

            while (flag) {
                flag = false;

                for (let i4 = 0; i4 < msgIdx; i4++) {
                    if (y + msgHeight > this.receivedMessageY[i4] - txtHeight && y - txtHeight < this.receivedMessageY[i4] + this.receivedMessageHeight[i4] && x - mId < this.receivedMessageX[i4] + this.receivedMessageMidPoint[i4] && x + mId > this.receivedMessageX[i4] - this.receivedMessageMidPoint[i4] && this.receivedMessageY[i4] - txtHeight - msgHeight < y) {
                        y = this.receivedMessageY[i4] - txtHeight - msgHeight;
                        flag = true;
                    }
                }
            }

            this.receivedMessageY[msgIdx] = y;
            this.surface.centrepara(this.receivedMessages[msgIdx], x, y, 1, 0xffff00, 300);
        }

        for (let itemIdx = 0; itemIdx < this.itemsAboveHeadCount; itemIdx++) {
            let x = this.actionBubbleX[itemIdx];
            let y = this.actionBubbleY[itemIdx];
            let scale = this.actionBubbleScale[itemIdx];
            let id = this.actionBubbleItem[itemIdx];
            let scaleX = ((39 * scale) / 100) | 0;
            let scaleY = ((27 * scale) / 100) | 0;

            this.surface.drawActionBubble(x - ((scaleX / 2) | 0), y - scaleY, scaleX, scaleY, this.spriteMedia + 9, 85);

            let scaleXClip = ((36 * scale) / 100) | 0;
            let scaleYClip = ((24 * scale) / 100) | 0;

            this.surface._spriteClipping_from9(x - ((scaleXClip / 2) | 0), (y - scaleY + ((scaleY / 2) | 0)) - ((scaleYClip / 2) | 0), scaleXClip, scaleYClip, GameData.itemPicture[id] + this.spriteItem, GameData.itemMask[id], 0, 0, false);
        }

        for (let j1 = 0; j1 < this.healthBarCount; j1++) {
            let i2 = this.healthBarX[j1];
            let l2 = this.healthBarY[j1];
            let k3 = this.healthBarMissing[j1];

            this.surface.drawBoxAlpha(i2 - 15, l2 - 3, k3, 5, 65280, 192);
            this.surface.drawBoxAlpha((i2 - 15) + k3, l2 - 3, 30 - k3, 5, 0xff0000, 192);
        }
    }

    _walkToActionSource_from5(sx, sy, dx, dy, action) {
        this._walkToActionSource_from8(sx, sy, dx, dy, dx, dy, false, action);
    }

    createMessageTabPanel() {
        this.panelMessageTabs = new Panel(this.surface, 10);
        this.controlTextListChat = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.controlTextListAll = this.panelMessageTabs.addTextListInput(7, 324, 498, 14, 1, 80, false, true);
        this.controlTextListQuest = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.controlTextListPrivate = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.panelMessageTabs.setFocus(this.controlTextListAll);
    }

    disposeAndCollect() {
        if (this.surface !== null) {
            this.surface.clear();
            this.surface.pixels = null;
            this.surface = null;
        }

        if (this.scene !== null) {
            this.scene.dispose();
            this.scene = null;
        }

        this.gameModels = null;
        this.objectModel = null;
        this.wallObjectModel = null;
        this.playerServer = null;
        this.players = null;
        this.npcsServer = null;
        this.npcs = null;
        this.localPlayer = null;

        if (this.world !== null) {
            this.world.terrainModels = null;
            this.world.wallModels = null;
            this.world.roofModels = null;
            this.world.parentModel = null;
            this.world = null;
        }
    }

    drawUi() {
        if (this.logoutTimeout !== 0) {
            this.drawDialogLogout();
        } else if (this.showDialogWelcome) {
            this.drawDialogWelcome();
        } else if (this.showDialogServermessage) {
            this.drawDialogServermessage();
        } else if (this.showUiWildWarn === 1) {
            this.drawDialogWildWarn();
        } else if (this.showDialogBank && this.combatTimeout === 0) {
            this.drawDialogBank();
        } else if (this.showDialogShop && this.combatTimeout === 0) {
            this.drawDialogShop();
        } else if (this.showDialogTradeConfirm) {
            this.drawDialogTradeConfirm();
        } else if (this.showDialogTrade) {
            this.drawDialogTrade();
        } else if (this.showDialogDuelConfirm) {
            this.drawDialogDuelConfirm();
        } else if (this.showDialogDuel) {
            this.drawDialogDuel();
        } else if (this.showDialogReportAbuseStep === 1) {
            this.drawDialogReportAbuse();
        } else if (this.showDialogReportAbuseStep === 2) {
            this.drawDialogReportAbuseInput();
        } else if (this.showDialogSocialInput !== 0) {
            this.drawDialogSocialInput();
        } else {
            if (this.showOptionMenu) {
                this.drawOptionMenu();
            }

            if (this.localPlayer.animationCurrent === 8 || this.localPlayer.animationCurrent === 9) {
                this.drawDialogCombatStyle();
            }

            this.setActiveUiTab();

            let nomenus = !this.showOptionMenu && !this.showRightClickMenu;

            if (nomenus) {
                this.menuItemsCount = 0;
            }

            if (this.showUiTab === 0 && nomenus) {
                this.createRightClickMenu();
            }

            if (this.showUiTab === 1) {
                this.drawUiTabInventory(nomenus);
            }

            if (this.showUiTab === 2) {
                this.drawUiTabMinimap(nomenus);
            }

            if (this.showUiTab === 3) {
                this.drawUiTabPlayerInfo(nomenus);
            }

            if (this.showUiTab === 4) {
                this.drawUiTabMagic(nomenus);
            }

            if (this.showUiTab === 5) {
                this.drawUiTabSocial(nomenus);
            }

            if (this.showUiTab === 6) {
                this.drawUiTabOptions(nomenus);
            }

            if (!this.showRightClickMenu && !this.showOptionMenu) {
                this.createTopMouseMenu();
            }

            if (this.showRightClickMenu && !this.showOptionMenu) {
                this.drawRightClickMenu();
            }
        }

        this.mouseButtonClick = 0;
    }

    drawDialogTrade() {
        if (this.mouseButtonClick !== 0 && this.mouseButtonItemCountIncrement === 0) {
            this.mouseButtonItemCountIncrement = 1;
        }

        if (this.mouseButtonItemCountIncrement > 0) {
            let mouseX = this.mouseX - 22;
            let mouseY = this.mouseY - 36;

            if (mouseX >= 0 && mouseY >= 0 && mouseX < 468 && mouseY < 262) {
                if (mouseX > 216 && mouseY > 30 && mouseX < 462 && mouseY < 235) {
                    let slot = (((mouseX - 217) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 5;

                    if (slot >= 0 && slot < this.inventoryItemsCount) {
                        let sendUpdate = false;
                        let itemCountAdd = 0;
                        let itemType = this.inventoryItemId[slot];

                        for (let itemIndex = 0; itemIndex < this.tradeItemsCount; itemIndex++) {
                            if (this.tradeItems[itemIndex] === itemType) {
                                if (GameData.itemStackable[itemType] === 0) {
                                    for (let i4 = 0; i4 < this.mouseButtonItemCountIncrement; i4++) {
                                        if (this.tradeItemCount[itemIndex] < this.inventoryItemStackCount[slot]) {
                                            this.tradeItemCount[itemIndex]++;
                                        }

                                        sendUpdate = true;
                                    }

                                } else {
                                    itemCountAdd++;
                                }
                            }
                        }

                        if (this.getInventoryCount(itemType) <= itemCountAdd) {
                            sendUpdate = true;
                        }

                        // quest items? or just tagged as 'special'
                        if (GameData.itemSpecial[itemType] === 1) { 
                            this.showMessage('This object cannot be traded with other players', 3);
                            sendUpdate = true;
                        }

                        if (!sendUpdate && this.tradeItemsCount < 12) {
                            this.tradeItems[this.tradeItemsCount] = itemType;
                            this.tradeItemCount[this.tradeItemsCount] = 1;
                            this.tradeItemsCount++;
                            sendUpdate = true;
                        }

                        if (sendUpdate) {
                            this.clientStream.newPacket(C_OPCODES.TRADE_ITEM_UPDATE);
                            this.clientStream.putByte(this.tradeItemsCount);

                            for (let j4 = 0; j4 < this.tradeItemsCount; j4++) {
                                this.clientStream.putShort(this.tradeItems[j4]);
                                this.clientStream.putInt(this.tradeItemCount[j4]);
                            }

                            this.clientStream.sendPacket();
                            this.tradeRecipientAccepted = false;
                            this.tradeAccepted = false;
                        }
                    }
                }

                if (mouseX > 8 && mouseY > 30 && mouseX < 205 && mouseY < 133) {
                    let itemIndex = (((mouseX - 9) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 4;

                    if (itemIndex >= 0 && itemIndex < this.tradeItemsCount) {
                        let itemType = this.tradeItems[itemIndex];

                        for (let i2 = 0; i2 < this.mouseButtonItemCountIncrement; i2++) {
                            if (GameData.itemStackable[itemType] === 0 && this.tradeItemCount[itemIndex] > 1) {
                                this.tradeItemCount[itemIndex]--;
                                continue;
                            }
                            this.tradeItemsCount--;
                            this.mouseButtonDownTime = 0;

                            for (let l2 = itemIndex; l2 < this.tradeItemsCount; l2++) {
                                this.tradeItems[l2] = this.tradeItems[l2 + 1];
                                this.tradeItemCount[l2] = this.tradeItemCount[l2 + 1];
                            }

                            break;
                        }

                        this.clientStream.newPacket(C_OPCODES.TRADE_ITEM_UPDATE);
                        this.clientStream.putByte(this.tradeItemsCount);

                        for (let i3 = 0; i3 < this.tradeItemsCount; i3++) {
                            this.clientStream.putShort(this.tradeItems[i3]);
                            this.clientStream.putInt(this.tradeItemCount[i3]);
                        }

                        this.clientStream.sendPacket();
                        this.tradeRecipientAccepted = false;
                        this.tradeAccepted = false;
                    }
                }

                if (mouseX >= 217 && mouseY >= 238 && mouseX <= 286 && mouseY <= 259) {
                    this.tradeAccepted = true;
                    this.clientStream.newPacket(C_OPCODES.TRADE_ACCEPT);
                    this.clientStream.sendPacket();
                }

                if (mouseX >= 394 && mouseY >= 238 && mouseX < 463 && mouseY < 259) {
                    this.showDialogTrade = false;
                    this.clientStream.newPacket(C_OPCODES.TRADE_DECLINE);
                    this.clientStream.sendPacket();
                }
            } else if (this.mouseButtonClick !== 0) {
                this.showDialogTrade = false;
                this.clientStream.newPacket(C_OPCODES.TRADE_DECLINE);
                this.clientStream.sendPacket();
            }

            this.mouseButtonClick = 0;
            this.mouseButtonItemCountIncrement = 0;
        }

        if (!this.showDialogTrade) {
            return;
        }

        let dialogX = 22;
        let dialogY = 36;

        this.surface.drawBox(dialogX, dialogY, 468, 12, 192);
        this.surface.drawBoxAlpha(dialogX, dialogY + 12, 468, 18, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX, dialogY + 30, 8, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 205, dialogY + 30, 11, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 462, dialogY + 30, 6, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 133, 197, 22, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 258, 197, 20, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 235, 246, 43, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 30, 197, 103, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 155, 197, 103, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 30, 246, 205, 0xd0d0d0, 160);

        for (let j2 = 0; j2 < 4; j2++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 30 + j2 * 34, 197, 0);
        }

        for (let j3 = 0; j3 < 4; j3++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 155 + j3 * 34, 197, 0);
        }

        for (let l3 = 0; l3 < 7; l3++) {
            this.surface.drawLineHoriz(dialogX + 216, dialogY + 30 + l3 * 34, 246, 0);
        }

        for (let k4 = 0; k4 < 6; k4++) {
            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 30, 103, 0);
            }

            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 155, 103, 0);
            }

            this.surface.drawLineVert(dialogX + 216 + k4 * 49, dialogY + 30, 205, 0);
        }

        this.surface.drawString('Trading with: ' + this.tradeRecipientName, dialogX + 1, dialogY + 10, 1, 0xffffff);
        this.surface.drawString('Your Offer', dialogX + 9, dialogY + 27, 4, 0xffffff);
        this.surface.drawString('Opponent\'s Offer', dialogX + 9, dialogY + 152, 4, 0xffffff);
        this.surface.drawString('Your Inventory', dialogX + 216, dialogY + 27, 4, 0xffffff);

        if (!this.tradeAccepted) {
            this.surface._drawSprite_from3(dialogX + 217, dialogY + 238, this.spriteMedia + 25);
        }

        this.surface._drawSprite_from3(dialogX + 394, dialogY + 238, this.spriteMedia + 26);

        if (this.tradeRecipientAccepted) {
            this.surface.drawStringCenter('Other player', dialogX + 341, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('has accepted', dialogX + 341, dialogY + 256, 1, 0xffffff);
        }

        if (this.tradeAccepted) {
            this.surface.drawStringCenter('Waiting for', dialogX + 217 + 35, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('other player', dialogX + 217 + 35, dialogY + 256, 1, 0xffffff);
        }

        for (let itemIndex = 0; itemIndex < this.inventoryItemsCount; itemIndex++) {
            let slotX = 217 + dialogX + (itemIndex % 5) * 49;
            let slotY = 31 + dialogY + ((itemIndex / 5) | 0) * 34;

            this.surface._spriteClipping_from9(slotX, slotY, 48, 32, this.spriteItem + GameData.itemPicture[this.inventoryItemId[itemIndex]], GameData.itemMask[this.inventoryItemId[itemIndex]], 0, 0, false);

            if (GameData.itemStackable[this.inventoryItemId[itemIndex]] === 0) {
                this.surface.drawString(this.inventoryItemStackCount[itemIndex].toString(), slotX + 1, slotY + 10, 1, 0xffff00);
            }
        }

        for (let itemIndex = 0; itemIndex < this.tradeItemsCount; itemIndex++) {
            let slotX = 9 + dialogX + (itemIndex % 4) * 49;
            let slotY = 31 + dialogY + ((itemIndex / 4) | 0) * 34;

            this.surface._spriteClipping_from9(slotX, slotY, 48, 32, this.spriteItem + GameData.itemPicture[this.tradeItems[itemIndex]], GameData.itemMask[this.tradeItems[itemIndex]], 0, 0, false);

            if (GameData.itemStackable[this.tradeItems[itemIndex]] === 0) {
                this.surface.drawString(this.tradeItemCount[itemIndex].toString(), slotX + 1, slotY + 10, 1, 0xffff00);
            }

            if (this.mouseX > slotX && this.mouseX < slotX + 48 && this.mouseY > slotY && this.mouseY < slotY + 32) {
                this.surface.drawString(GameData.itemName[this.tradeItems[itemIndex]] + ': @whi@' + GameData.itemDescription[this.tradeItems[itemIndex]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }

        for (let itemIndex = 0; itemIndex < this.tradeRecipientItemsCount; itemIndex++) {
            let slotX = 9 + dialogX + (itemIndex % 4) * 49;
            let slotY = 156 + dialogY + ((itemIndex / 4) | 0) * 34;

            this.surface._spriteClipping_from9(slotX, slotY, 48, 32, this.spriteItem + GameData.itemPicture[this.tradeRecipientItems[itemIndex]], GameData.itemMask[this.tradeRecipientItems[itemIndex]], 0, 0, false);

            if (GameData.itemStackable[this.tradeRecipientItems[itemIndex]] === 0) {
                this.surface.drawString(this.tradeRecipientItemCount[itemIndex].toString(), slotX + 1, slotY + 10, 1, 0xffff00);
            }

            if (this.mouseX > slotX && this.mouseX < slotX + 48 && this.mouseY > slotY && this.mouseY < slotY + 32) {
                this.surface.drawString(GameData.itemName[this.tradeRecipientItems[itemIndex]] + ': @whi@' + GameData.itemDescription[this.tradeRecipientItems[itemIndex]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }
    }

    resetGame() {
        this.systemUpdate = 0;
        this.combatStyle = 0;
        this.logoutTimeout = 0;
        this.loginScreen = 0;
        this.loggedIn = 1;

        this.resetPMText();
        this.surface.blackScreen();
        this.surface.draw(this.graphics, 0, 0);

        for (let i = 0; i < this.objectCount; i++) {
            this.scene.removeModel(this.objectModel[i]);
            this.world.removeObject(this.objectX[i], this.objectY[i], this.objectId[i]);
        }

        for (let j = 0; j < this.wallObjectCount; j++) {
            this.scene.removeModel(this.wallObjectModel[j]);
            this.world.removeWallObject(this.wallObjectX[j], this.wallObjectY[j], this.wallObjectDirection[j], this.wallObjectId[j]);
        }

        this.objectCount = 0;
        this.wallObjectCount = 0;
        this.groundItemCount = 0;
        this.playerCount = 0;

        for (let k = 0; k < this.playersServerMax; k++) {
            this.playerServer[k] = null;
        }

        for (let l = 0; l < this.playersMax; l++) {
            this.players[l] = null;
        }

        this.npcCount = 0;

        for (let i1 = 0; i1 < this.npcsServerMax; i1++) {
            this.npcsServer[i1] = null;
        }

        for (let j1 = 0; j1 < this.npcsMax; j1++) {
            this.npcs[j1] = null;
        }

        for (let k1 = 0; k1 < 50; k1++) {
            this.prayerOn[k1] = false;
        }

        this.mouseButtonClick = 0;
        this.lastMouseButtonDown = 0;
        this.mouseButtonDown = 0;
        this.showDialogShop = false;
        this.showDialogBank = false;
        this.isSleeping = false;
        this.friendListCount = 0;
    }

    drawUiTabSocial(nomenus) {
        let uiX = this.surface.width2 - 199;
        let uiY = 36;

        this.surface._drawSprite_from3(uiX - 49, 3, this.spriteMedia + 5);

        let uiWidth = 196;
        let uiHeight = 182;
        let l = 0;
        let k = l = Surface.rgbToLong(160, 160, 160);

        if (this.uiTabSocialSubTab === 0) {
            k = Surface.rgbToLong(220, 220, 220);
        } else {
            l = Surface.rgbToLong(220, 220, 220);
        }

        this.surface.drawBoxAlpha(uiX, uiY, (uiWidth / 2) | 0, 24, k, 128);
        this.surface.drawBoxAlpha(uiX + ((uiWidth / 2) | 0), uiY, (uiWidth / 2) | 0, 24, l, 128);
        this.surface.drawBoxAlpha(uiX, uiY + 24, uiWidth, uiHeight - 24, Surface.rgbToLong(220, 220, 220), 128);
        this.surface.drawLineHoriz(uiX, uiY + 24, uiWidth, 0);
        this.surface.drawLineVert(uiX + ((uiWidth / 2) | 0), uiY, 24, 0);
        this.surface.drawLineHoriz(uiX, (uiY + uiHeight) - 16, uiWidth, 0);
        this.surface.drawStringCenter('Friends', uiX + ((uiWidth / 4) | 0), uiY + 16, 4, 0);
        this.surface.drawStringCenter('Ignore', uiX + ((uiWidth / 4) | 0) + ((uiWidth / 2) | 0), uiY + 16, 4, 0);

        this.panelSocialList.clearList(this.controlListSocialPlayers);

        if (this.uiTabSocialSubTab === 0) {
            for (let i1 = 0; i1 < this.friendListCount; i1++) {
                let s = null;

                if (this.friendListOnline[i1] === 255) {
                    s = '@gre@';
                } else if (this.friendListOnline[i1] > 0) {
                    s = '@yel@';
                } else {
                    s = '@red@';
                }

                this.panelSocialList.addListEntry(this.controlListSocialPlayers, i1, s + Utility.hashToUsername(this.friendListHashes[i1]) + '~439~@whi@Remove         WWWWWWWWWW');
            }

        }

        if (this.uiTabSocialSubTab === 1) {
            for (let j1 = 0; j1 < this.ignoreListCount; j1++) {
                this.panelSocialList.addListEntry(this.controlListSocialPlayers, j1, '@yel@' + Utility.hashToUsername(this.ignoreList[j1]) + '~439~@whi@Remove         WWWWWWWWWW');
            }
        }

        this.panelSocialList.drawPanel();

        if (this.uiTabSocialSubTab === 0) {
            let k1 = this.panelSocialList.getListEntryIndex(this.controlListSocialPlayers);

            if (k1 >= 0 && this.mouseX < 489) {
                if (this.mouseX > 429) {
                    this.surface.drawStringCenter('Click to remove ' + Utility.hashToUsername(this.friendListHashes[k1]), uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                } else if (this.friendListOnline[k1] === 255) {
                    this.surface.drawStringCenter('Click to message ' + Utility.hashToUsername(this.friendListHashes[k1]), uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                } else if (this.friendListOnline[k1] > 0) {
                    if (this.friendListOnline[k1] < 200) {
                        this.surface.drawStringCenter(Utility.hashToUsername(this.friendListHashes[k1]) + ' is on world ' + (this.friendListOnline[k1] - 9), uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                    } else {
                        this.surface.drawStringCenter(Utility.hashToUsername(this.friendListHashes[k1]) + ' is on classic ' + (this.friendListOnline[k1] - 219), uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                    }
                } else {
                    this.surface.drawStringCenter(Utility.hashToUsername(this.friendListHashes[k1]) + ' is offline', uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                }
            } else {
                this.surface.drawStringCenter('Click a name to send a message', uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
            }

            let colour = 0;

            if (this.mouseX > uiX && this.mouseX < uiX + uiWidth && this.mouseY > (uiY + uiHeight) - 16 && this.mouseY < uiY + uiHeight) {
                colour = 0xffff00;
            } else {
                colour = 0xffffff;
            }

            this.surface.drawStringCenter('Click here to add a friend', uiX + ((uiWidth / 2) | 0), (uiY + uiHeight) - 3, 1, colour);
        }

        if (this.uiTabSocialSubTab === 1) {
            let l1 = this.panelSocialList.getListEntryIndex(this.controlListSocialPlayers);

            if (l1 >= 0 && this.mouseX < 489 && this.mouseX > 429) {
                if (this.mouseX > 429) {
                    this.surface.drawStringCenter('Click to remove ' + Utility.hashToUsername(this.ignoreList[l1]), uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
                }
            } else {
                this.surface.drawStringCenter('Blocking messages from:', uiX + ((uiWidth / 2) | 0), uiY + 35, 1, 0xffffff);
            }

            let l2 = 0;

            if (this.mouseX > uiX && this.mouseX < uiX + uiWidth && this.mouseY > (uiY + uiHeight) - 16 && this.mouseY < uiY + uiHeight) {
                l2 = 0xffff00;
            } else {
                l2 = 0xffffff;
            }

            this.surface.drawStringCenter('Click here to add a name', uiX + ((uiWidth / 2) | 0), (uiY + uiHeight) - 3, 1, l2);
        }

        if (!nomenus) {
            return;
        }

        uiX = this.mouseX - (this.surface.width2 - 199);
        uiY = this.mouseY - 36;

        if (uiX >= 0 && uiY >= 0 && uiX < 196 && uiY < 182) {
            this.panelSocialList.handleMouse(uiX + (this.surface.width2 - 199), uiY + 36, this.lastMouseButtonDown, this.mouseButtonDown, this.mouseScrollDelta);

            if (uiY <= 24 && this.mouseButtonClick === 1) {
                if (uiX < 98 && this.uiTabSocialSubTab === 1) {
                    this.uiTabSocialSubTab = 0;
                    this.panelSocialList.resetListProps(this.controlListSocialPlayers);
                } else if (uiX > 98 && this.uiTabSocialSubTab === 0) {
                    this.uiTabSocialSubTab = 1;
                    this.panelSocialList.resetListProps(this.controlListSocialPlayers);
                }
            }

            if (this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 0) {
                let i2 = this.panelSocialList.getListEntryIndex(this.controlListSocialPlayers);

                if (i2 >= 0 && this.mouseX < 489) {
                    if (this.mouseX > 429) {
                        this.friendRemove(this.friendListHashes[i2]);
                    } else if (this.friendListOnline[i2] !== 0) {
                        this.showDialogSocialInput = 2;
                        this.privateMessageTarget = this.friendListHashes[i2];
                        this.inputPmCurrent = '';
                        this.inputPmFinal = '';
                    }
                }
            }

            if (this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 1) {
                let j2 = this.panelSocialList.getListEntryIndex(this.controlListSocialPlayers);

                if (j2 >= 0 && this.mouseX < 489 && this.mouseX > 429) {
                    this.ignoreRemove(this.ignoreList[j2]);
                }
            }

            if (uiY > 166 && this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 0) {
                this.showDialogSocialInput = 1;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
            }

            if (uiY > 166 && this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 1) {
                this.showDialogSocialInput = 3;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
            }

            this.mouseButtonClick = 0;
        }
    }

    handleKeyPress(i) {
        if (this.loggedIn === 0) {
            if (this.loginScreen === 0 && this.panelLoginWelcome !== null) {
                this.panelLoginWelcome.keyPress(i);
            }

            if (this.loginScreen === 1 && this.panelLoginNewuser !== null) {
                this.panelLoginNewuser.keyPress(i);
            }

            if (this.loginScreen === 2 && this.panelLoginExistinguser !== null) {
                this.panelLoginExistinguser.keyPress(i);
            }
        }

        if (this.loggedIn === 1) {
            if (this.showAppearanceChange && this.panelAppearance !== null) {
                this.panelAppearance.keyPress(i);
                return;
            }

            if (this.showDialogSocialInput === 0 && this.showDialogReportAbuseStep === 0 && !this.isSleeping && this.panelMessageTabs !== null) {
                this.panelMessageTabs.keyPress(i);
            }
        }
    }

    sendLogout() {
        if (this.loggedIn === 0) {
            return;
        }

        if (this.combatTimeout > 450) {
            this.showMessage('@cya@You can\'t logout during combat!', 3);
            return;
        }

        if (this.combatTimeout > 0) {
            this.showMessage('@cya@You can\'t logout for 10 seconds after combat', 3);
            return;
        } else {
            this.clientStream.newPacket(C_OPCODES.LOGOUT);
            this.clientStream.sendPacket();
            this.logoutTimeout = 1000;
            return;
        }
    }

    createPlayer(serverIndex, x, y, anim) {
        if (this.playerServer[serverIndex] === null) {
            this.playerServer[serverIndex] = new GameCharacter();
            this.playerServer[serverIndex].serverIndex = serverIndex;
            this.playerServer[serverIndex].serverId = 0;
        }

        let character = this.playerServer[serverIndex];
        let flag = false;

        for (let i1 = 0; i1 < this.knownPlayerCount; i1++) {
            if (this.knownPlayers[i1].serverIndex !== serverIndex) {
                continue;
            }

            flag = true;
            break;
        }

        if (flag) {
            character.animationNext = anim;
            let j1 = character.waypointCurrent;

            if (x !== character.waypointsX[j1] || y !== character.waypointsY[j1]) {
                character.waypointCurrent = j1 = (j1 + 1) % 10;
                character.waypointsX[j1] = x;
                character.waypointsY[j1] = y;
            }
        } else {
            character.serverIndex = serverIndex;
            character.movingStep = 0;
            character.waypointCurrent = 0;
            character.waypointsX[0] = character.currentX = x;
            character.waypointsY[0] = character.currentY = y;
            character.animationNext = character.animationCurrent = anim;
            character.stepCount = 0;
        }

        this.players[this.playerCount++] = character;

        return character;
    }

    drawDialogSocialInput() {
        if (this.mouseButtonClick !== 0) {
            this.mouseButtonClick = 0;

            if (this.showDialogSocialInput === 1 && (this.mouseX < 106 || this.mouseY < 145 || this.mouseX > 406 || this.mouseY > 215)) {
                this.showDialogSocialInput = 0;
                return;
            }

            if (this.showDialogSocialInput === 2 && (this.mouseX < 6 || this.mouseY < 145 || this.mouseX > 506 || this.mouseY > 215)) {
                this.showDialogSocialInput = 0;
                return;
            }

            if (this.showDialogSocialInput === 3 && (this.mouseX < 106 || this.mouseY < 145 || this.mouseX > 406 || this.mouseY > 215)) {
                this.showDialogSocialInput = 0;
                return;
            }

            if (this.mouseX > 236 && this.mouseX < 276 && this.mouseY > 193 && this.mouseY < 213) {
                this.showDialogSocialInput = 0;
                return;
            }
        }

        let i = 145;

        if (this.showDialogSocialInput === 1) {
            this.surface.drawBox(106, i, 300, 70, 0);
            this.surface.drawBoxEdge(106, i, 300, 70, 0xffffff);
            i += 20;
            this.surface.drawStringCenter('Enter name to add to friends list', 256, i, 4, 0xffffff);
            i += 20;
            this.surface.drawStringCenter(this.inputTextCurrent + '*', 256, i, 4, 0xffffff);

            if (this.inputTextFinal.length > 0) {
                let s = this.inputTextFinal.trim();
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.showDialogSocialInput = 0;

                if (s.length > 0 && !Utility.usernameToHash(s).equals(this.localPlayer.hash)) {
                    this.friendAdd(s);
                }
            }
        }

        if (this.showDialogSocialInput === 2) {
            this.surface.drawBox(6, i, 500, 70, 0);
            this.surface.drawBoxEdge(6, i, 500, 70, 0xffffff);
            i += 20;
            this.surface.drawStringCenter('Enter message to send to ' + Utility.hashToUsername(this.privateMessageTarget), 256, i, 4, 0xffffff);
            i += 20;
            this.surface.drawStringCenter(this.inputPmCurrent + '*', 256, i, 4, 0xffffff);

            if (this.inputPmFinal.length > 0) {
                let s1 = this.inputPmFinal;
                this.inputPmCurrent = '';
                this.inputPmFinal = '';
                this.showDialogSocialInput = 0;

                let k = ChatMessage.scramble(s1);
                this.sendPrivateMessage(this.privateMessageTarget, ChatMessage.scrambledBytes, k);
                s1 = ChatMessage.descramble(ChatMessage.scrambledBytes, 0, k);
                s1 = WordFilter.filter(s1);

                this.showServerMessage('@pri@You tell ' + Utility.hashToUsername(this.privateMessageTarget) + ': ' + s1);
            }
        }

        if (this.showDialogSocialInput === 3) {
            this.surface.drawBox(106, i, 300, 70, 0);
            this.surface.drawBoxEdge(106, i, 300, 70, 0xffffff);
            i += 20;
            this.surface.drawStringCenter('Enter name to add to ignore list', 256, i, 4, 0xffffff);
            i += 20;
            this.surface.drawStringCenter(this.inputTextCurrent + '*', 256, i, 4, 0xffffff);

            if (this.inputTextFinal.length > 0) {
                let s2 = this.inputTextFinal.trim();

                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.showDialogSocialInput = 0;

                if (s2.length > 0 && !Utility.usernameToHash(s2).equals(this.localPlayer.hash)) {
                    this.ignoreAdd(s2);
                }
            }
        }

        let j = 0xffffff;

        if (this.mouseX > 236 && this.mouseX < 276 && this.mouseY > 193 && this.mouseY < 213) {
            j = 0xffff00;
        }

        this.surface.drawStringCenter('Cancel', 256, 208, 1, j);
    }

    createAppearancePanel() {
        this.panelAppearance = new Panel(this.surface, 100);
        this.panelAppearance.addText(256, 10, 'Please design Your Character', 4, true);

        let x = 140;
        let y = 34;

        x += 116;
        y -= 10;

        this.panelAppearance.addText(x - 55, y + 110, 'Front', 3, true);
        this.panelAppearance.addText(x, y + 110, 'Side', 3, true);
        this.panelAppearance.addText(x + 55, y + 110, 'Back', 3, true);

        let xOff = 54;

        y += 145;

        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y - 8, 'Head', 1, true);
        this.panelAppearance.addText(x - xOff, y + 8, 'Type', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceHead1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceHead2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Hair', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceHair1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceHair2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 50;
        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y, 'Gender', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceGender1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceGender2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Top', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceTop1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceTop2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 50;
        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y - 8, 'Skin', 1, true);
        this.panelAppearance.addText(x - xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceSkin1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceSkin2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Bottom', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceBottom1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceBottom2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 82;
        y -= 35;
        this.panelAppearance.addButtonBackground(x, y, 200, 30);
        this.panelAppearance.addText(x, y, 'Accept', 4, false);
        this.controlButtonAppearanceAccept = this.panelAppearance.addButton(x, y, 200, 30);
    }

    resetPMText() {
        this.inputPmCurrent = '';
        this.inputPmFinal = '';
    }

    drawDialogWelcome() {
        let i = 65;

        if (this.welcomeRecoverySetDays !== 201) {
            i += 60;
        }

        if (this.welcomeUnreadMessages > 0) {
            i += 60;
        }

        if (this.welcomeLastLoggedInIP !== 0) {
            i += 45;
        }

        let y = 167 - ((i / 2) | 0);

        this.surface.drawBox(56, 167 - ((i / 2) | 0), 400, i, 0);
        this.surface.drawBoxEdge(56, 167 - ((i / 2) | 0), 400, i, 0xffffff);
        y += 20;
        this.surface.drawStringCenter('Welcome to RuneScape ' + this.loginUser, 256, y, 4, 0xffff00);
        y += 30;

        let s = null;

        if (this.welcomeLastLoggedInDays === 0) {
            s = 'earlier today';
        } else if (this.welcomeLastLoggedInDays === 1) {
            s = 'yesterday';
        } else {
            s = this.welcomeLastLoggedInDays + ' days ago';
        }

        if (this.welcomeLastLoggedInIP !== 0) {
            this.surface.drawStringCenter('You last logged in ' + s, 256, y, 1, 0xffffff);
            y += 15;

            if (this.welcomeLastLoggedInHost === null) {
                this.welcomeLastLoggedInHost = this.getHostnameIP(this.welcomeLastLoggedInIP);
            }

            this.surface.drawStringCenter('from: ' + this.welcomeLastLoggedInHost, 256, y, 1, 0xffffff);
            y += 15;
            y += 15;
        }

        if (this.welcomeUnreadMessages > 0) {
            let k = 0xffffff;

            this.surface.drawStringCenter('Jagex staff will NEVER email you. We use the', 256, y, 1, k);
            y += 15;
            this.surface.drawStringCenter('message-centre on this website instead.', 256, y, 1, k);
            y += 15;

            if (this.welcomeUnreadMessages === 1) {
                this.surface.drawStringCenter('You have @yel@0@whi@ unread messages in your message-centre', 256, y, 1, 0xffffff);
            } else {
                this.surface.drawStringCenter('You have @gre@' + (this.welcomeUnreadMessages - 1) + ' unread messages @whi@in your message-centre', 256, y, 1, 0xffffff);
            }

            y += 15;
            y += 15;
        }

        // this is an odd way of storing recovery day settings
        if (this.welcomeRecoverySetDays !== 201) {
            // and this
            if (this.welcomeRecoverySetDays === 200) {
                this.surface.drawStringCenter('You have not yet set any password recovery questions.', 256, y, 1, 0xff8000);
                y += 15;
                this.surface.drawStringCenter('We strongly recommend you do so now to secure your account.', 256, y, 1, 0xff8000);
                y += 15;
                this.surface.drawStringCenter('Do this from the \'account management\' area on our front webpage', 256, y, 1, 0xff8000);
                y += 15;
            } else {
                let s1 = null;

                if (this.welcomeRecoverySetDays === 0) {
                    s1 = 'Earlier today';
                } else if (this.welcomeRecoverySetDays === 1) {
                    s1 = 'Yesterday';
                } else {
                    s1 = this.welcomeRecoverySetDays + ' days ago';
                }

                this.surface.drawStringCenter(s1 + ' you changed your recovery questions', 256, y, 1, 0xff8000);
                y += 15;
                this.surface.drawStringCenter('If you do not remember making this change then cancel it immediately', 256, y, 1, 0xff8000);
                y += 15;
                this.surface.drawStringCenter('Do this from the \'account management\' area on our front webpage', 256, y, 1, 0xff8000);
                y += 15;
            }

            y += 15;
        }

        let l = 0xffffff;

        if (this.mouseY > y - 12 && this.mouseY <= y && this.mouseX > 106 && this.mouseX < 406) {
            l = 0xff0000;
        }

        this.surface.drawStringCenter('Click here to close window', 256, y, 1, l);

        if (this.mouseButtonClick === 1) {
            if (l === 0xff0000) {
                this.showDialogWelcome = false;
            }

            if ((this.mouseX < 86 || this.mouseX > 426) && (this.mouseY < 167 - ((i / 2) | 0) || this.mouseY > 167 + ((i / 2) | 0))) {
                this.showDialogWelcome = false;
            }
        }

        this.mouseButtonClick = 0;
    }

    drawAppearancePanelCharacterSprites() {
        this.surface.interlace = false;
        this.surface.blackScreen();
        this.panelAppearance.drawPanel();
        let i = 140;
        let j = 50;
        i += 116;
        j -= 25;
        this.surface._spriteClipping_from6(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearance2Colour], this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender], this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearanceHeadType], this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6(i - 32, j, 64, 102, GameData.animationNumber[this.appearance2Colour] + 6, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(i - 32, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 6, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(i - 32, j, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 6, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearance2Colour] + 12, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 12, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 12, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._drawSprite_from3(0, this.gameHeight, this.spriteMedia + 22);
        this.surface.draw(this.graphics, 0, 0);
    }

    drawItem(x, y, w, h, id, tx, ty) {
        let picture = GameData.itemPicture[id] + this.spriteItem;
        let mask = GameData.itemMask[id];
        this.surface._spriteClipping_from9(x, y, w, h, picture, mask, 0, 0, false);
    }

    async handleGameInput() {
        if (this.systemUpdate > 1) {
            this.systemUpdate--;
        }

        await this.checkConnection(); 

        if (this.logoutTimeout > 0) {
            this.logoutTimeout--;
        }

        if (this.mouseActionTimeout > 4500 && this.combatTimeout === 0 && this.logoutTimeout === 0) {
            this.mouseActionTimeout -= 500;
            this.sendLogout();
            return;
        }

        if (this.localPlayer.animationCurrent === 8 || this.localPlayer.animationCurrent === 9) {
            this.combatTimeout = 500;
        }

        if (this.combatTimeout > 0) {
            this.combatTimeout--;
        }

        if (this.showAppearanceChange) {
            this.handleAppearancePanelControls();
            return;
        }

        for (let i = 0; i < this.playerCount; i++) {
            let character = this.players[i];

            // TODO figure out why this is happening
            if (!character) {
                console.log('null character at ', i, this.playerCount);
                return;
            }

            let k = (character.waypointCurrent + 1) % 10;

            if (character.movingStep !== k) {
                let i1 = -1;
                let l2 = character.movingStep;
                let j4;

                if (l2 < k) {
                    j4 = k - l2;
                } else {
                    j4 = (10 + k) - l2;
                }

                let j5 = 4;

                if (j4 > 2) {
                    j5 = (j4 - 1) * 4;
                }

                if (character.waypointsX[l2] - character.currentX > this.magicLoc * 3 || character.waypointsY[l2] - character.currentY > this.magicLoc * 3 || character.waypointsX[l2] - character.currentX < -this.magicLoc * 3 || character.waypointsY[l2] - character.currentY < -this.magicLoc * 3 || j4 > 8) {
                    character.currentX = character.waypointsX[l2];
                    character.currentY = character.waypointsY[l2];
                } else {
                    if (character.currentX < character.waypointsX[l2]) {
                        character.currentX += j5;
                        character.stepCount++;
                        i1 = 2;
                    } else if (character.currentX > character.waypointsX[l2]) {
                        character.currentX -= j5;
                        character.stepCount++;
                        i1 = 6;
                    }

                    if (character.currentX - character.waypointsX[l2] < j5 && character.currentX - character.waypointsX[l2] > -j5) {
                        character.currentX = character.waypointsX[l2];
                    }

                    if (character.currentY < character.waypointsY[l2]) {
                        character.currentY += j5;
                        character.stepCount++;

                        if (i1 === -1) {
                            i1 = 4;
                        } else if (i1 === 2) {
                            i1 = 3;
                        } else {
                            i1 = 5;
                        }
                    } else if (character.currentY > character.waypointsY[l2]) {
                        character.currentY -= j5;
                        character.stepCount++;

                        if (i1 === -1) {
                            i1 = 0;
                        } else if (i1 === 2) {
                            i1 = 1;
                        } else {
                            i1 = 7;
                        }
                    }

                    if (character.currentY - character.waypointsY[l2] < j5 && character.currentY - character.waypointsY[l2] > -j5) {
                        character.currentY = character.waypointsY[l2];
                    }
                }

                if (i1 !== -1) {
                    character.animationCurrent = i1;
                }

                if (character.currentX === character.waypointsX[l2] && character.currentY === character.waypointsY[l2]) {
                    character.movingStep = (l2 + 1) % 10;
                }
            } else {
                character.animationCurrent = character.animationNext;
            }

            if (character.messageTimeout > 0) {
                character.messageTimeout--;
            }

            if (character.bubbleTimeout > 0) {
                character.bubbleTimeout--;
            }

            if (character.combatTimer > 0) {
                character.combatTimer--;
            }

            if (this.deathScreenTimeout > 0) {
                this.deathScreenTimeout--;

                if (this.deathScreenTimeout === 0) {
                    this.showMessage('You have been granted another life. Be more careful this time!', 3);
                }

                if (this.deathScreenTimeout === 0) {
                    this.showMessage('You retain your skills. Your objects land where you died', 3);
                }
            }
        }

        for (let j = 0; j < this.npcCount; j++) {
            let character_1 = this.npcs[j];
            let j1 = (character_1.waypointCurrent + 1) % 10;

            if (character_1.movingStep !== j1) {
                let i3 = -1;
                let k4 = character_1.movingStep;
                let k5;

                if (k4 < j1) {
                    k5 = j1 - k4;
                } else {
                    k5 = (10 + j1) - k4;
                }

                let l5 = 4;

                if (k5 > 2) {
                    l5 = (k5 - 1) * 4;
                }

                if (character_1.waypointsX[k4] - character_1.currentX > this.magicLoc * 3 || character_1.waypointsY[k4] - character_1.currentY > this.magicLoc * 3 || character_1.waypointsX[k4] - character_1.currentX < -this.magicLoc * 3 || character_1.waypointsY[k4] - character_1.currentY < -this.magicLoc * 3 || k5 > 8) {
                    character_1.currentX = character_1.waypointsX[k4];
                    character_1.currentY = character_1.waypointsY[k4];
                } else {
                    if (character_1.currentX < character_1.waypointsX[k4]) {
                        character_1.currentX += l5;
                        character_1.stepCount++;
                        i3 = 2;
                    } else if (character_1.currentX > character_1.waypointsX[k4]) {
                        character_1.currentX -= l5;
                        character_1.stepCount++;
                        i3 = 6;
                    }

                    if (character_1.currentX - character_1.waypointsX[k4] < l5 && character_1.currentX - character_1.waypointsX[k4] > -l5) {
                        character_1.currentX = character_1.waypointsX[k4];
                    }

                    if (character_1.currentY < character_1.waypointsY[k4]) {
                        character_1.currentY += l5;
                        character_1.stepCount++;

                        if (i3 === -1) {
                            i3 = 4;
                        } else if (i3 === 2) {
                            i3 = 3;
                        } else {
                            i3 = 5;
                        }
                    } else if (character_1.currentY > character_1.waypointsY[k4]) {
                        character_1.currentY -= l5;
                        character_1.stepCount++;

                        if (i3 === -1) {
                            i3 = 0;
                        } else if (i3 === 2) {
                            i3 = 1;
                        } else {
                            i3 = 7;
                        }
                    }

                    if (character_1.currentY - character_1.waypointsY[k4] < l5 && character_1.currentY - character_1.waypointsY[k4] > -l5) {
                        character_1.currentY = character_1.waypointsY[k4];
                    }
                }

                if (i3 !== -1) {
                    character_1.animationCurrent = i3;
                }

                if (character_1.currentX === character_1.waypointsX[k4] && character_1.currentY === character_1.waypointsY[k4]) {
                    character_1.movingStep = (k4 + 1) % 10;
                }
            } else {
                character_1.animationCurrent = character_1.animationNext;

                if (character_1.npcId === 43) {
                    character_1.stepCount++;
                }
            }

            if (character_1.messageTimeout > 0) {
                character_1.messageTimeout--;
            }

            if (character_1.bubbleTimeout > 0) {
                character_1.bubbleTimeout--;
            }

            if (character_1.combatTimer > 0) {
                character_1.combatTimer--;
            }
        }

        if (this.showUiTab !== 2) {
            if (Surface.anInt346 > 0) {
                this.sleepWordDelayTimer++;
            }

            if (Surface.anInt347 > 0) {
                this.sleepWordDelayTimer = 0;
            }

            Surface.anInt346 = 0;
            Surface.anInt347 = 0;
        }

        for (let l = 0; l < this.playerCount; l++) {
            let character = this.players[l];

            if (character.projectileRange > 0) {
                character.projectileRange--;
            }
        }

        if (this.cameraAutoAngleDebug) {
            if (this.cameraAutoRotatePlayerX - this.localPlayer.currentX < -500 || this.cameraAutoRotatePlayerX - this.localPlayer.currentX > 500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY < -500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY > 500) {
                this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
            }
        } else {
            if (this.cameraAutoRotatePlayerX - this.localPlayer.currentX < -500 || this.cameraAutoRotatePlayerX - this.localPlayer.currentX > 500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY < -500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY > 500) {
                this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
            }

            if (this.cameraAutoRotatePlayerX !== this.localPlayer.currentX) {
                this.cameraAutoRotatePlayerX += ((this.localPlayer.currentX - this.cameraAutoRotatePlayerX) / (16 + (((this.cameraZoom - 500) / 15) | 0))) | 0;
            }

            if (this.cameraAutoRotatePlayerY !== this.localPlayer.currentY) {
                this.cameraAutoRotatePlayerY += ((this.localPlayer.currentY - this.cameraAutoRotatePlayerY) / (16 + (((this.cameraZoom - 500) / 15) | 0))) | 0;
            }

            if (this.optionCameraModeAuto) {
                let k1 = this.cameraAngle * 32;
                let j3 = k1 - this.cameraRotation;
                let byte0 = 1;

                if (j3 !== 0) {
                    this.anInt707++;

                    if (j3 > 128) {
                        byte0 = -1;
                        j3 = 256 - j3;
                    } else if (j3 > 0)
                        byte0 = 1;
                    else if (j3 < -128) {
                        byte0 = 1;
                        j3 = 256 + j3;
                    } else if (j3 < 0) {
                        byte0 = -1;
                        j3 = -j3;
                    }

                    this.cameraRotation += (((this.anInt707 * j3 + 255) / 256) | 0) * byte0;
                    this.cameraRotation &= 0xff;
                } else {
                    this.anInt707 = 0;
                }
            }
        }

        if (this.sleepWordDelayTimer > 20) {
            this.sleepWordDelay = false;
            this.sleepWordDelayTimer = 0;
        }

        if (this.isSleeping) {
            if (this.inputTextFinal.length > 0) {
                if (/^::lostcon$/i.test(this.inputTextFinal)) {
                    this.clientStream.closeStream();
                } else if (/^::closecon$/.test(this.inputTextFinal)) { 
                    this.closeConnection();
                } else {
                    this.clientStream.newPacket(C_OPCODES.SLEEP_WORD);
                    this.clientStream.putString(this.inputTextFinal);

                    if (!this.sleepWordDelay) {
                        this.clientStream.putByte(0);
                        this.sleepWordDelay = true;
                    }

                    this.clientStream.sendPacket();
                    this.inputTextCurrent = '';
                    this.inputTextFinal = '';
                    this.sleepingStatusText = 'Please wait...';
                }
            }

            if (this.lastMouseButtonDown === 1 && this.mouseY > 275 && this.mouseY < 310 && this.mouseX > 56 && this.mouseX < 456) {
                this.clientStream.newPacket(C_OPCODES.SLEEP_WORD);
                this.clientStream.putString('-null-');

                if (!this.sleepWordDelay) {
                    this.clientStream.putByte(0);
                    this.sleepWordDelay = true;
                }

                this.clientStream.sendPacket();
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.sleepingStatusText = 'Please wait...';
            }

            this.lastMouseButtonDown = 0;
            return;
        }

        if (this.mouseY > this.gameHeight - 4) {
            if (this.mouseX > 15 && this.mouseX < 96 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 0;
            }

            if (this.mouseX > 110 && this.mouseX < 194 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 1;
                this.panelMessageTabs.controlFlashText[this.controlTextListChat] = 999999;
            }

            if (this.mouseX > 215 && this.mouseX < 295 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 2;
                this.panelMessageTabs.controlFlashText[this.controlTextListQuest] = 999999;
            }

            if (this.mouseX > 315 && this.mouseX < 395 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 3;
                this.panelMessageTabs.controlFlashText[this.controlTextListPrivate] = 999999;
            }

            if (this.mouseX > 417 && this.mouseX < 497 && this.lastMouseButtonDown === 1) {
                this.showDialogReportAbuseStep = 1;
                this.reportAbuseOffence = 0;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
            }

            this.lastMouseButtonDown = 0;
            this.mouseButtonDown = 0;
        }

        this.panelMessageTabs.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown, this.mouseScrollDelta);

        if (this.messageTabSelected > 0 && this.mouseX >= 494 && this.mouseY >= this.gameHeight - 66) {
            this.lastMouseButtonDown = 0;
        }

        if (this.panelMessageTabs.isClicked(this.controlTextListAll)) {
            let s = this.panelMessageTabs.getText(this.controlTextListAll);
            this.panelMessageTabs.updateText(this.controlTextListAll, '');

            if (/^::/.test(s)) {
                if (/^::closecon$/i.test(s)) {
                    this.clientStream.closeStream();
                } else if (/^::logout/i.test(s)) {
                    this.closeConnection();
                } else if (/^::lostcon$/i.test(s)) {
                    await this.lostConnection();
                } else {
                    this.sendCommandString(s.substring(2));
                }
            } else {
                let k3 = ChatMessage.scramble(s);
                this.sendChatMessage(ChatMessage.scrambledBytes, k3);
                s = ChatMessage.descramble(ChatMessage.scrambledBytes, 0, k3);
                s = WordFilter.filter(s);
                this.localPlayer.messageTimeout = 150;
                this.localPlayer.message = s;
                this.showMessage(this.localPlayer.name + ': ' + s, 2);
            }
        }

        if (this.messageTabSelected === 0) {
            for (let l1 = 0; l1 < 5; l1++) {
                if (this.messageHistoryTimeout[l1] > 0) {
                    this.messageHistoryTimeout[l1]--;
                }
            }
        }

        if (this.deathScreenTimeout !== 0) {
            this.lastMouseButtonDown = 0;
        }

        if (this.showDialogTrade || this.showDialogDuel) {
            if (this.mouseButtonDown !== 0) {
                this.mouseButtonDownTime++;
            } else {
                this.mouseButtonDownTime = 0;
            }

            if (this.mouseButtonDownTime > 600) {
                this.mouseButtonItemCountIncrement += 5000;
            } else if (this.mouseButtonDownTime > 450) {
                this.mouseButtonItemCountIncrement += 500;
            } else if (this.mouseButtonDownTime > 300) {
                this.mouseButtonItemCountIncrement += 50;
            } else if (this.mouseButtonDownTime > 150) {
                this.mouseButtonItemCountIncrement += 5;
            } else if (this.mouseButtonDownTime > 50) {
                this.mouseButtonItemCountIncrement++;
            } else if (this.mouseButtonDownTime > 20 && (this.mouseButtonDownTime & 5) === 0) {
                this.mouseButtonItemCountIncrement++;
            }
        } else {
            this.mouseButtonDownTime = 0;
            this.mouseButtonItemCountIncrement = 0;
        }

        if (this.lastMouseButtonDown === 1) {
            this.mouseButtonClick = 1;
        } else if (this.lastMouseButtonDown === 2) {
            this.mouseButtonClick = 2;
        }

        this.scene.setMouseLoc(this.mouseX, this.mouseY);
        this.lastMouseButtonDown = 0;

        if (this.optionCameraModeAuto) {
            if (this.anInt707 === 0 || this.cameraAutoAngleDebug) {
                if (this.keyLeft) {
                    this.cameraAngle = this.cameraAngle + 1 & 7;
                    this.keyLeft = false;

                    if (!this.fogOfWar) {
                        if ((this.cameraAngle & 1) === 0) {
                            this.cameraAngle = this.cameraAngle + 1 & 7;
                        }

                        for (let i2 = 0; i2 < 8; i2++) {
                            if (this.isValidCameraAngle(this.cameraAngle)) {
                                break;
                            }

                            this.cameraAngle = this.cameraAngle + 1 & 7;
                        }
                    }
                }

                if (this.keyRight) {
                    this.cameraAngle = this.cameraAngle + 7 & 7;
                    this.keyRight = false;

                    if (!this.fogOfWar) {
                        if ((this.cameraAngle & 1) === 0) {
                            this.cameraAngle = this.cameraAngle + 7 & 7;
                        }

                        for (let j2 = 0; j2 < 8; j2++) {
                            if (this.isValidCameraAngle(this.cameraAngle)) {
                                break;
                            }

                            this.cameraAngle = this.cameraAngle + 7 & 7;
                        }
                    }
                }
            }
        } else if (this.keyLeft) {
            this.cameraRotation = this.cameraRotation + 2 & 0xff;
        } else if (this.keyRight) {
            this.cameraRotation = this.cameraRotation - 2 & 0xff;
        }

        if (!this.optionCameraModeAuto && this.options.middleClickCamera && this.middleButtonDown) {
            this.cameraRotation = (this.originRotation + ((this.mouseX - this.originMouseX) / 2)) & 0xff;
        }

        if (this.fogOfWar && this.cameraZoom > 550) {
            this.cameraZoom -= 4;
        } else if (!this.fogOfWar && this.cameraZoom < 750) {
            this.cameraZoom += 4;
        }

        if (this.mouseClickXStep > 0) {
            this.mouseClickXStep--;
        } else if (this.mouseClickXStep < 0) {
            this.mouseClickXStep++;
        }

        // 17 is fountain
        this.scene.doSOemthingWithTheFuckinFountainFuck(17);
        this.objectAnimationCount++;

        if (this.objectAnimationCount > 5) {
            this.objectAnimationCount = 0;
            this.objectAnimationNumberFireLightningSpell = (this.objectAnimationNumberFireLightningSpell + 1) % 3;
            this.objectAnimationNumberTorch = (this.objectAnimationNumberTorch + 1) % 4;
            this.objectAnimationNumberClaw = (this.objectAnimationNumberClaw + 1) % 5;
        }

        for (let k2 = 0; k2 < this.objectCount; k2++) {
            let l3 = this.objectX[k2];
            let l4 = this.objectY[k2];

            if (l3 >= 0 && l4 >= 0 && l3 < 96 && l4 < 96 && this.objectId[k2] === 74) {
                this.objectModel[k2].rotate(1, 0, 0);
            }
        }

        for (let i4 = 0; i4 < this.teleportBubbleCount; i4++) {
            this.teleportBubbleTime[i4]++;

            if (this.teleportBubbleTime[i4] > 50) {
                this.teleportBubbleCount--;

                for (let i5 = i4; i5 < this.teleportBubbleCount; i5++) {
                    this.teleportBubbleX[i5] = this.teleportBubbleX[i5 + 1];
                    this.teleportBubbleY[i5] = this.teleportBubbleY[i5 + 1];
                    this.teleportBubbleTime[i5] = this.teleportBubbleTime[i5 + 1];
                    this.teleportBubbleType[i5] = this.teleportBubbleType[i5 + 1];
                }
            }
        }
    }

    renderLoginScreenViewports() {
        let rh = 0;
        let rx = 50; //49;
        let ry = 50; //47;

        this.world._loadSection_from3(rx * 48 + 23, ry * 48 + 23, rh);
        this.world.addModels(this.gameModels);

        let x = 9728;
        let y = 6400;
        let zoom = 1100;
        let rotation = 888;

        this.scene.clipFar3d = 4100;
        this.scene.clipFar2d = 4100;
        this.scene.fogZFalloff = 1;
        this.scene.fogZDistance = 4000;
        this.surface.blackScreen();
        this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, rotation, 0, zoom * 2);
        this.scene.render();
        this.surface.fadeToBlack();
        this.surface.fadeToBlack();
        this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

        for (let j = 6; j >= 1; j--) {
            this.surface.drawLineAlpha(0, j, 0, j, this.gameWidth, 8);
        }

        this.surface.drawBox(0, 194, 512, 20, 0);

        for (let k = 6; k >= 1; k--) {
            this.surface.drawLineAlpha(0, k, 0, 194 - k, this.gameWidth, 8); 
        }

        // runescape logo
        this.surface._drawSprite_from3(((this.gameWidth / 2) | 0) - ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0), 15, this.spriteMedia + 10); 
        this.surface._drawSprite_from5(this.spriteLogo, 0, 0, this.gameWidth, 200);
        this.surface.drawWorld(this.spriteLogo);

        x = 9216;
        y = 9216;
        zoom = 1100;
        rotation = 888;

        this.scene.clipFar3d = 4100;
        this.scene.clipFar2d = 4100;
        this.scene.fogZFalloff = 1;
        this.scene.fogZDistance = 4000;

        this.surface.blackScreen();
        this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, rotation, 0, zoom * 2);
        this.scene.render();
        this.surface.fadeToBlack();
        this.surface.fadeToBlack();
        this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

        for (let l = 6; l >= 1; l--) {
            this.surface.drawLineAlpha(0, l, 0, l, this.gameWidth, 8);
        }

        this.surface.drawBox(0, 194, this.gameWidth, 20, 0);

        for (let i1 = 6; i1 >= 1; i1--) {
            this.surface.drawLineAlpha(0, i1, 0, 194 - i1, this.gameWidth, 8);
        }

        this.surface._drawSprite_from3(((this.gameWidth / 2) | 0) - ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0), 15, this.spriteMedia + 10);
        this.surface._drawSprite_from5(this.spriteLogo + 1, 0, 0, this.gameWidth, 200); 
        this.surface.drawWorld(this.spriteLogo + 1);

        for (let j1 = 0; j1 < 64; j1++) {
            this.scene.removeModel(this.world.roofModels[0][j1]);
            this.scene.removeModel(this.world.wallModels[1][j1]);
            this.scene.removeModel(this.world.roofModels[1][j1]);
            this.scene.removeModel(this.world.wallModels[2][j1]);
            this.scene.removeModel(this.world.roofModels[2][j1]);
        }

        x = 11136;
        y = 10368;
        zoom = 500;
        rotation = 376;

        this.scene.clipFar3d = 4100;
        this.scene.clipFar2d = 4100;
        this.scene.fogZFalloff = 1;
        this.scene.fogZDistance = 4000;
        this.surface.blackScreen();
        this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, rotation, 0, zoom * 2);
        this.scene.render();
        this.surface.fadeToBlack();
        this.surface.fadeToBlack();
        this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

        for (let k1 = 6; k1 >= 1; k1--) {
            this.surface.drawLineAlpha(0, k1, 0, k1, this.gameWidth, 8);
        }

        this.surface.drawBox(0, 194, this.gameWidth, 20, 0);

        for (let l1 = 6; l1 >= 1; l1--) {
            this.surface.drawLineAlpha(0, l1, 0, 194, this.gameWidth, 8); 
        }

        this.surface._drawSprite_from3(((this.gameWidth / 2) | 0) - ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0), 15, this.spriteMedia + 10);
        this.surface._drawSprite_from5(this.spriteMedia + 10, 0, 0, this.gameWidth, 200);
        this.surface.drawWorld(this.spriteMedia + 10);
    }

    createLoginPanels() {
        this.panelLoginWelcome = new Panel(this.surface, 50);

        let y = 40;
        let x = (this.gameWidth / 2) | 0;

        if (!this.members) {
            this.panelLoginWelcome.addText(x, 200 + y, 'Click on an option', 5, true);
            this.panelLoginWelcome.addButtonBackground(x - 100, 240 + y, 120, 35);
            this.panelLoginWelcome.addButtonBackground(x + 100, 240 + y, 120, 35);
            this.panelLoginWelcome.addText(x - 100, 240 + y, 'New User', 5, false);
            this.panelLoginWelcome.addText(x + 100, 240 + y, 'Existing User', 5, false);
            this.controlWelcomeNewuser = this.panelLoginWelcome.addButton(x - 100, 240 + y, 120, 35);
            this.controlWelcomeExistinguser = this.panelLoginWelcome.addButton(x + 100, 240 + y, 120, 35);
        } else {
            this.panelLoginWelcome.addText(x, 200 + y, 'Welcome to RuneScape', 4, true);
            this.panelLoginWelcome.addText(x, 215 + y, 'You need a member account to use this server', 4, true);
            this.panelLoginWelcome.addButtonBackground(x, 250 + y, 200, 35);
            this.panelLoginWelcome.addText(x, 250 + y, 'Click here to login', 5, false);
            this.controlWelcomeExistinguser = this.panelLoginWelcome.addButton(x, 250 + y, 200, 35);
        }

        this.panelLoginNewuser = new Panel(this.surface, 50);
        y = 230;

        if (this.referid === 0) {
            this.panelLoginNewuser.addText(x, y + 8, 'To create an account please go back to the', 4, true);
            y += 20;
            this.panelLoginNewuser.addText(x, y + 8, 'www.runescape.com front page, and choose \'create account\'', 4, true);
        } else if (this.referid === 1) {
            this.panelLoginNewuser.addText(x, y + 8, 'To create an account please click on the', 4, true);
            y += 20;
            this.panelLoginNewuser.addText(x, y + 8, '\'create account\' link below the game window', 4, true);
        } else {
            this.panelLoginNewuser.addText(x, y + 8, 'To create an account please go back to the', 4, true);
            y += 20;
            this.panelLoginNewuser.addText(x, y + 8, 'runescape front webpage and choose \'create account\'', 4, true);
        }

        y += 30;
        this.panelLoginNewuser.addButtonBackground(x, y + 17, 150, 34);
        this.panelLoginNewuser.addText(x, y + 17, 'Ok', 5, false);
        this.controlLoginNewOk = this.panelLoginNewuser.addButton(x, y + 17, 150, 34);
        this.panelLoginExistinguser = new Panel(this.surface, 50);
        y = 230;
        this.controlLoginStatus = this.panelLoginExistinguser.addText(x, y - 10, 'Please enter your username and password', 4, true);
        y += 28;
        this.panelLoginExistinguser.addButtonBackground(x - 116, y, 200, 40);
        this.panelLoginExistinguser.addText(x - 116, y - 10, 'Username:', 4, false);
        this.controlLoginUser = this.panelLoginExistinguser.addTextInput(x - 116, y + 10, 200, 40, 4, 12, false, false);
        y += 47;
        this.panelLoginExistinguser.addButtonBackground(x - 66, y, 200, 40);
        this.panelLoginExistinguser.addText(x - 66, y - 10, 'Password:', 4, false);
        this.controlLoginPass = this.panelLoginExistinguser.addTextInput(x - 66, y + 10, 200, 40, 4, 20, true, false);
        y -= 55;
        this.panelLoginExistinguser.addButtonBackground(x + 154, y, 120, 25);
        this.panelLoginExistinguser.addText(x + 154, y, 'Ok', 4, false);
        this.controlLoginOk = this.panelLoginExistinguser.addButton(x + 154, y, 120, 25);
        y += 30;
        this.panelLoginExistinguser.addButtonBackground(x + 154, y, 120, 25);
        this.panelLoginExistinguser.addText(x + 154, y, 'Cancel', 4, false);
        this.controlLoginCancel = this.panelLoginExistinguser.addButton(x + 154, y, 120, 25);
        y += 30;
        this.panelLoginExistinguser.setFocus(this.controlLoginUser);
    }

    drawUiTabInventory(nomenus) {
        let uiX = this.surface.width2 - 248;

        this.surface._drawSprite_from3(uiX, 3, this.spriteMedia + 1);

        for (let itemIndex = 0; itemIndex < this.inventoryMaxItemCount; itemIndex++) {
            let slotX = uiX + (itemIndex % 5) * 49;
            let slotY = 36 + ((itemIndex / 5) | 0) * 34;

            if (itemIndex < this.inventoryItemsCount && this.inventoryEquipped[itemIndex] === 1) {
                this.surface.drawBoxAlpha(slotX, slotY, 49, 34, 0xff0000, 128);
            } else {
                this.surface.drawBoxAlpha(slotX, slotY, 49, 34, Surface.rgbToLong(181, 181, 181), 128);
            }

            if (itemIndex < this.inventoryItemsCount) {
                this.surface._spriteClipping_from9(slotX, slotY, 48, 32, this.spriteItem + GameData.itemPicture[this.inventoryItemId[itemIndex]], GameData.itemMask[this.inventoryItemId[itemIndex]], 0, 0, false);

                if (GameData.itemStackable[this.inventoryItemId[itemIndex]] === 0) {
                    this.surface.drawString(this.inventoryItemStackCount[itemIndex].toString(), slotX + 1, slotY + 10, 1, 0xffff00);
                }
            }
        }

        for (let rows = 1; rows <= 4; rows++) {
            this.surface.drawLineVert(uiX + rows * 49, 36, ((this.inventoryMaxItemCount / 5) | 0) * 34, 0);
        }

        for (let cols = 1; cols <= ((this.inventoryMaxItemCount / 5) | 0) - 1; cols++) {
            this.surface.drawLineHoriz(uiX, 36 + cols * 34, 245, 0);
        }

        if (!nomenus) {
            return;
        }

        let mouseX = this.mouseX - (this.surface.width2 - 248);
        let mouseY = this.mouseY - 36;

        if (mouseX >= 0 && mouseY >= 0 && mouseX < 248 && mouseY < ((this.inventoryMaxItemCount / 5) | 0) * 34) {
            let itemIndex = ((mouseX / 49) | 0) + ((mouseY / 34) | 0) * 5;

            if (itemIndex < this.inventoryItemsCount) {
                let i2 = this.inventoryItemId[itemIndex];

                if (this.selectedSpell >= 0) {
                    if (GameData.spellType[this.selectedSpell] === 3) {
                        this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                        this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                        this.menuItemID[this.menuItemsCount] = 600;
                        this.menuSourceType[this.menuItemsCount] = itemIndex;
                        this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                        this.menuItemsCount++;
                        return;
                    }
                } else {
                    if (this.selectedItemInventoryIndex >= 0) {
                        this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                        this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                        this.menuItemID[this.menuItemsCount] = 610;
                        this.menuSourceType[this.menuItemsCount] = itemIndex;
                        this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                        this.menuItemsCount++;
                        return;
                    }

                    if (this.inventoryEquipped[itemIndex] === 1) {
                        this.menuItemText1[this.menuItemsCount] = 'Remove';
                        this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                        this.menuItemID[this.menuItemsCount] = 620;
                        this.menuSourceType[this.menuItemsCount] = itemIndex;
                        this.menuItemsCount++;
                    } else if (GameData.itemWearable[i2] !== 0) {
                        if ((GameData.itemWearable[i2] & 24) !== 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Wield';
                        } else {
                            this.menuItemText1[this.menuItemsCount] = 'Wear';
                        }

                        this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                        this.menuItemID[this.menuItemsCount] = 630;
                        this.menuSourceType[this.menuItemsCount] = itemIndex;
                        this.menuItemsCount++;
                    }

                    if (GameData.itemCommand[i2] !== '') {
                        this.menuItemText1[this.menuItemsCount] = GameData.itemCommand[i2];
                        this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                        this.menuItemID[this.menuItemsCount] = 640;
                        this.menuSourceType[this.menuItemsCount] = itemIndex;
                        this.menuItemsCount++;
                    }

                    this.menuItemText1[this.menuItemsCount] = 'Use';
                    this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                    this.menuItemID[this.menuItemsCount] = 650;
                    this.menuSourceType[this.menuItemsCount] = itemIndex;
                    this.menuItemsCount++;
                    this.menuItemText1[this.menuItemsCount] = 'Drop';
                    this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                    this.menuItemID[this.menuItemsCount] = 660;
                    this.menuSourceType[this.menuItemsCount] = itemIndex;
                    this.menuItemsCount++;
                    this.menuItemText1[this.menuItemsCount] = 'Examine';
                    this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[i2];
                    this.menuItemID[this.menuItemsCount] = 3600;
                    this.menuSourceType[this.menuItemsCount] = i2;
                    this.menuItemsCount++;
                }
            }
        }
    }

    autorotateCamera() {
        if ((this.cameraAngle & 1) === 1 && this.isValidCameraAngle(this.cameraAngle)) {
            return;
        }

        if ((this.cameraAngle & 1) === 0 && this.isValidCameraAngle(this.cameraAngle)) {
            if (this.isValidCameraAngle(this.cameraAngle + 1 & 7)) {
                this.cameraAngle = this.cameraAngle + 1 & 7;
                return;
            }

            if (this.isValidCameraAngle(this.cameraAngle + 7 & 7)) {
                this.cameraAngle = this.cameraAngle + 7 & 7;
            }

            return;
        }

        let ai = new Int32Array([1, -1, 2, -2, 3, -3, 4]);

        for (let i = 0; i < 7; i++) {
            if (!this.isValidCameraAngle(this.cameraAngle + ai[i] + 8 & 7)) {
                continue;
            }

            this.cameraAngle = this.cameraAngle + ai[i] + 8 & 7;
            break;
        }

        if ((this.cameraAngle & 1) === 0 && this.isValidCameraAngle(this.cameraAngle)) {
            if (this.isValidCameraAngle(this.cameraAngle + 1 & 7)) {
                this.cameraAngle = this.cameraAngle + 1 & 7;
                return;
            }

            if (this.isValidCameraAngle(this.cameraAngle + 7 & 7)) {
                this.cameraAngle = this.cameraAngle + 7 & 7;
            }
        }
    }

    drawRightClickMenu() {
        if (this.mouseButtonClick !== 0) {
            for (let i = 0; i < this.menuItemsCount; i++) {
                let k = this.menuX + 2;
                let i1 = this.menuY + 27 + i * 15;

                if (this.mouseX <= k - 2 || this.mouseY <= i1 - 12 || this.mouseY >= i1 + 4 || this.mouseX >= (k - 3) + this.menuWidth) {
                    continue;
                }

                this.menuItemClick(this.menuIndices[i]);
                break;
            }

            this.mouseButtonClick = 0;
            this.showRightClickMenu = false;
            return;
        }

        if (this.mouseX < this.menuX - 10 || this.mouseY < this.menuY - 10 || this.mouseX > this.menuX + this.menuWidth + 10 || this.mouseY > this.menuY + this.menuHeight + 10) {
            this.showRightClickMenu = false;
            return;
        }

        this.surface.drawBoxAlpha(this.menuX, this.menuY, this.menuWidth, this.menuHeight, 0xd0d0d0, 160);
        this.surface.drawString('Choose option', this.menuX + 2, this.menuY + 12, 1, 65535);

        for (let j = 0; j < this.menuItemsCount; j++) {
            let l = this.menuX + 2;
            let j1 = this.menuY + 27 + j * 15;
            let k1 = 0xffffff;

            if (this.mouseX > l - 2 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseX < (l - 3) + this.menuWidth) {
                k1 = 0xffff00;
            }

            this.surface.drawString(this.menuItemText1[this.menuIndices[j]] + ' ' + this.menuItemText2[this.menuIndices[j]], l, j1, 1, k1);
        }
    }

    drawUiTabMinimap(nomenus) {
        let uiX = this.surface.width2 - 199;
        let uiWidth = 156;
        let uiHeight = 152;

        this.surface._drawSprite_from3(uiX - 49, 3, this.spriteMedia + 2);
        uiX += 40;
        this.surface.drawBox(uiX, 36, uiWidth, uiHeight, 0);
        this.surface.setBounds(uiX, 36, uiX + uiWidth, 36 + uiHeight);

        let k = 192 + this.minimapRandom_2;
        let i1 = this.cameraRotation + this.minimapRandom_1 & 0xff;
        let k1 = (((this.localPlayer.currentX - 6040) * 3 * k) / 2048) | 0;
        let i3 = (((this.localPlayer.currentY - 6040) * 3 * k) / 2048) | 0;
        let k4 = Scene.sin2048Cache[1024 - i1 * 4 & 0x3ff];
        let i5 = Scene.sin2048Cache[(1024 - i1 * 4 & 0x3ff) + 1024];
        let k5 = i3 * k4 + k1 * i5 >> 18;

        i3 = i3 * i5 - k1 * k4 >> 18;
        k1 = k5;
        
        // landscape
        this.surface.drawMinimapSprite((uiX + ((uiWidth / 2) | 0)) - k1, 36 + ((uiHeight / 2) | 0) + i3, this.spriteMedia - 1, i1 + 64 & 255, k);

        for (let i = 0; i < this.objectCount; i++) {
            let l1 = ((((this.objectX[i] * this.magicLoc + 64) - this.localPlayer.currentX) * 3 * k) / 2048) | 0;
            let j3 = ((((this.objectY[i] * this.magicLoc + 64) - this.localPlayer.currentY) * 3 * k) / 2048) | 0;
            let l5 = j3 * k4 + l1 * i5 >> 18;

            j3 = j3 * i5 - l1 * k4 >> 18;
            l1 = l5;

            this.drawMinimapEntity(uiX + ((uiWidth / 2) | 0) + l1, (36 + ((uiHeight / 2) | 0)) - j3, 65535);
        }

        for (let j7 = 0; j7 < this.groundItemCount; j7++) {
            let i2 = ((((this.groundItemX[j7] * this.magicLoc + 64) - this.localPlayer.currentX) * 3 * k) / 2048) | 0;
            let k3 = ((((this.groundItemY[j7] * this.magicLoc + 64) - this.localPlayer.currentY) * 3 * k) / 2048) | 0;
            let i6 = k3 * k4 + i2 * i5 >> 18;

            k3 = k3 * i5 - i2 * k4 >> 18;
            i2 = i6;

            this.drawMinimapEntity(uiX + ((uiWidth / 2) | 0) + i2, (36 + ((uiHeight / 2) | 0)) - k3, 0xff0000);
        }

        for (let k7 = 0; k7 < this.npcCount; k7++) {
            let character = this.npcs[k7];

            let j2 = (((character.currentX - this.localPlayer.currentX) * 3 * k) / 2048) | 0;
            let l3 = (((character.currentY - this.localPlayer.currentY) * 3 * k) / 2048) | 0;
            let j6 = l3 * k4 + j2 * i5 >> 18;

            l3 = l3 * i5 - j2 * k4 >> 18;
            j2 = j6;

            this.drawMinimapEntity(uiX + ((uiWidth / 2) | 0) + j2, (36 + ((uiHeight / 2) | 0)) - l3, 0xffff00);
        }

        for (let l7 = 0; l7 < this.playerCount; l7++) {
            let character_1 = this.players[l7];
            let k2 = (((character_1.currentX - this.localPlayer.currentX) * 3 * k) / 2048) | 0;
            let i4 = (((character_1.currentY - this.localPlayer.currentY) * 3 * k) / 2048) | 0;
            let k6 = i4 * k4 + k2 * i5 >> 18;

            i4 = i4 * i5 - k2 * k4 >> 18;
            k2 = k6;

            let j8 = 0xffffff;

            for (let k8 = 0; k8 < this.friendListCount; k8++) {
                if (!character_1.hash.equals(this.friendListHashes[k8]) || this.friendListOnline[k8] !== 255) {
                    continue;
                }

                j8 = 65280;
                break;
            }

            this.drawMinimapEntity(uiX + ((uiWidth / 2) | 0) + k2, (36 + ((uiHeight / 2) | 0)) - i4, j8);
        }

        this.surface.drawCircle(uiX + ((uiWidth / 2) | 0), 36 + ((uiHeight / 2) | 0), 2, 0xffffff, 255);

        // compass
        this.surface.drawMinimapSprite(uiX + 19, 55, this.spriteMedia + 24, this.cameraRotation + 128 & 255, 128);
        this.surface.setBounds(0, 0, this.gameWidth, this.gameHeight + 12);

        if (!nomenus) {
            return;
        }

        let mouseX = this.mouseX - (this.surface.width2 - 199);
        let mouseY = this.mouseY - 36;

        if (mouseX >= 40 && mouseY >= 0 && mouseX < 196 && mouseY < 152) {
            let c1 = 156;
            let c3 = 152;
            let l = 192 + this.minimapRandom_2;
            let j1 = this.cameraRotation + this.minimapRandom_1 & 0xff;
            let j = this.surface.width2 - 199;

            j += 40;

            let dx = (((this.mouseX - (j + ((c1 / 2) | 0))) * 16384) / (3 * l)) | 0;
            let dy = (((this.mouseY - (36 + ((c3 / 2) | 0))) * 16384) / (3 * l)) | 0;
            let l4 = Scene.sin2048Cache[1024 - j1 * 4 & 1023];
            let j5 = Scene.sin2048Cache[(1024 - j1 * 4 & 1023) + 1024];
            let l6 = dy * l4 + dx * j5 >> 15;

            dy = dy * j5 - dx * l4 >> 15;
            dx = l6;
            dx += this.localPlayer.currentX;
            dy = this.localPlayer.currentY - dy;

            if (this.mouseButtonClick === 1) {
                this._walkToActionSource_from5(this.localRegionX, this.localRegionY, (dx / 128) | 0, (dy / 128) | 0, false);
            }

            this.mouseButtonClick = 0;
        }
    }

    drawDialogTradeConfirm() {
        let dialogX = 22;
        let dialogY = 36;

        this.surface.drawBox(dialogX, dialogY, 468, 16, 192);
        this.surface.drawBoxAlpha(dialogX, dialogY + 16, 468, 246, 0x989898, 160);
        this.surface.drawStringCenter('Please confirm your trade with @yel@' + Utility.hashToUsername(this.tradeRecipientConfirmHash), dialogX + 234, dialogY + 12, 1, 0xffffff);
        this.surface.drawStringCenter('You are about to give:', dialogX + 117, dialogY + 30, 1, 0xffff00);

        for (let j = 0; j < this.tradeConfirmItemsCount; j++) {
            let s = GameData.itemName[this.tradeConfirmItems[j]];

            if (GameData.itemStackable[this.tradeConfirmItems[j]] === 0) {
                s = s + ' x ' + mudclient.formatNumber(this.tradeConfirmItemCount[j]);
            }

            this.surface.drawStringCenter(s, dialogX + 117, dialogY + 42 + j * 12, 1, 0xffffff);
        }

        if (this.tradeConfirmItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 117, dialogY + 42, 1, 0xffffff);
        }

        this.surface.drawStringCenter('In return you will receive:', dialogX + 351, dialogY + 30, 1, 0xffff00);

        for (let k = 0; k < this.tradeRecipientConfirmItemsCount; k++) {
            let s1 = GameData.itemName[this.tradeRecipientConfirmItems[k]];

            if (GameData.itemStackable[this.tradeRecipientConfirmItems[k]] === 0) {
                s1 = s1 + ' x ' + mudclient.formatNumber(this.tradeRecipientConfirmItemCount[k]);
            }

            this.surface.drawStringCenter(s1, dialogX + 351, dialogY + 42 + k * 12, 1, 0xffffff);
        }

        if (this.tradeRecipientConfirmItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 351, dialogY + 42, 1, 0xffffff);
        }

        this.surface.drawStringCenter('Are you sure you want to do this?', dialogX + 234, dialogY + 200, 4, 65535);
        this.surface.drawStringCenter('There is NO WAY to reverse a trade if you change your mind.', dialogX + 234, dialogY + 215, 1, 0xffffff);
        this.surface.drawStringCenter('Remember that not all players are trustworthy', dialogX + 234, dialogY + 230, 1, 0xffffff);

        if (!this.tradeConfirmAccepted) {
            this.surface._drawSprite_from3((dialogX + 118) - 35, dialogY + 238, this.spriteMedia + 25);
            this.surface._drawSprite_from3((dialogX + 352) - 35, dialogY + 238, this.spriteMedia + 26);
        } else {
            this.surface.drawStringCenter('Waiting for other player...', dialogX + 234, dialogY + 250, 1, 0xffff00);
        }

        if (this.mouseButtonClick === 1) {
            if (this.mouseX < dialogX || this.mouseY < dialogY || this.mouseX > dialogX + 468 || this.mouseY > dialogY + 262) {
                this.showDialogTradeConfirm = false;
                this.clientStream.newPacket(C_OPCODES.TRADE_DECLINE);
                this.clientStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 118) - 35 && this.mouseX <= dialogX + 118 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.tradeConfirmAccepted = true;
                this.clientStream.newPacket(C_OPCODES.TRADE_CONFIRM_ACCEPT);
                this.clientStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 352) - 35 && this.mouseX <= dialogX + 353 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.showDialogTradeConfirm = false;
                this.clientStream.newPacket(C_OPCODES.TRADE_DECLINE);
                this.clientStream.sendPacket();
            }

            this.mouseButtonClick = 0;
        }
    }

    setActiveUiTab() {
        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 && this.mouseY < 35) {
            this.showUiTab = 1;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 33 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 33 && this.mouseY < 35) {
            this.showUiTab = 2;
            this.minimapRandom_1 = ((Math.random() * 13) | 0) - 6;
            this.minimapRandom_2 = ((Math.random() * 23) | 0) - 11;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 66 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 66 && this.mouseY < 35) {
            this.showUiTab = 3;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 99 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 99 && this.mouseY < 35) {
            this.showUiTab = 4;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 132 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 132 && this.mouseY < 35) {
            this.showUiTab = 5;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 165 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 165 && this.mouseY < 35) {
            this.showUiTab = 6;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 && this.mouseY < 26) {
            this.showUiTab = 1;
        }

        if (this.showUiTab !== 0 && this.showUiTab !== 2 && this.mouseX >= this.surface.width2 - 35 - 33 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 33 && this.mouseY < 26) {
            this.showUiTab = 2;
            this.minimapRandom_1 = ((Math.random() * 13) | 0) - 6;
            this.minimapRandom_2 = ((Math.random() * 23) | 0) - 11;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 66 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 66 && this.mouseY < 26) {
            this.showUiTab = 3;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 99 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 99 && this.mouseY < 26) {
            this.showUiTab = 4;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 132 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 132 && this.mouseY < 26) {
            this.showUiTab = 5;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 165 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 165 && this.mouseY < 26) {
            this.showUiTab = 6;
        }

        if (this.showUiTab === 1 && (this.mouseX < this.surface.width2 - 248 || this.mouseY > 36 + ((this.inventoryMaxItemCount / 5) | 0) * 34)) {
            this.showUiTab = 0;
        }

        if (this.showUiTab === 3 && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 316)) {
            this.showUiTab = 0;
        }

        if ((this.showUiTab === 2 || this.showUiTab === 4 || this.showUiTab === 5) && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 240)) {
            this.showUiTab = 0;
        }

        if (this.showUiTab === 6 && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 311)) {
            this.showUiTab = 0;
        }
    }

    drawOptionMenu() {
        if (this.mouseButtonClick !== 0) {
            for (let i = 0; i < this.optionMenuCount; i++) {
                if (this.mouseX >= this.surface.textWidth(this.optionMenuEntry[i], 1) || this.mouseY <= i * 12 || this.mouseY >= 12 + i * 12) {
                    continue;
                }

                this.clientStream.newPacket(C_OPCODES.CHOOSE_OPTION);
                this.clientStream.putByte(i);
                this.clientStream.sendPacket();
                break;
            }

            this.mouseButtonClick = 0;
            this.showOptionMenu = false;
            return;
        }

        for (let j = 0; j < this.optionMenuCount; j++) {
            let k = 65535;

            if (this.mouseX < this.surface.textWidth(this.optionMenuEntry[j], 1) && this.mouseY > j * 12 && this.mouseY < 12 + j * 12) {
                k = 0xff0000;
            }

            this.surface.drawString(this.optionMenuEntry[j], 6, 12 + j * 12, 1, k);
        }
    }

    drawNpc(x, y, w, h, id, tx, ty) {
        let character = this.npcs[id];
        let l1 = character.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
        let flag = false;
        let i2 = l1;

        if (i2 === 5) {
            i2 = 3;
            flag = true;
        } else if (i2 === 6) {
            i2 = 2;
            flag = true;
        } else if (i2 === 7) {
            i2 = 1;
            flag = true;
        }

        let j2 = i2 * 3 + this.npcWalkModel[((character.stepCount / GameData.npcWalkModel[character.npcId]) | 0) % 4];

        if (character.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((GameData.npcCombatAnimation[character.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[(((this.loginTimer / (GameData.npcCombatModel[character.npcId]) | 0) - 1)) % 8];
        } else if (character.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((GameData.npcCombatAnimation[character.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / GameData.npcCombatModel[character.npcId]) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let k3 = GameData.npcSprite.get(character.npcId, l2);

            if (k3 >= 0) {
                let i4 = 0;
                let j4 = 0;
                let k4 = j2;

                if (flag && i2 >= 1 && i2 <= 3 && GameData.animationHasF[k3] === 1) {
                    k4 += 15;
                }

                if (i2 !== 5 || GameData.animationHasA[k3] === 1) {
                    let l4 = k4 + GameData.animationNumber[k3];

                    i4 = ((i4 * w) / this.surface.spriteWidthFull[l4]) | 0;
                    j4 = ((j4 * h) / this.surface.spriteHeightFull[l4]) | 0;

                    let i5 = ((w * this.surface.spriteWidthFull[l4]) / this.surface.spriteWidthFull[GameData.animationNumber[k3]]) | 0;

                    i4 -= ((i5 - w) / 2) | 0;

                    let col = GameData.animationCharacterColour[k3];
                    let skincol = 0;

                    if (col === 1) {
                        col = GameData.npcColourHair[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    } else if (col === 2) {
                        col = GameData.npcColourTop[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    } else if (col === 3) {
                        col = GameData.npcColorBottom[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    }

                    this.surface._spriteClipping_from9(x + i4, y + j4, i5, h, l4, col, skincol, tx, flag);
                }
            }
        }

        if (character.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(character.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(character.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = character.message;
        }

        if (character.animationCurrent === 8 || character.animationCurrent === 9 || character.combatTimer !== 0) {
            if (character.combatTimer > 0) {
                let i3 = x;

                if (character.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let l3 = ((character.healthCurrent * 30) / character.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = l3;
            }

            if (character.combatTimer > 150) {
                let j3 = x;

                if (character.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 12);
                this.surface.drawStringCenter(character.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
            }
        }
    }

    walkToWallObject(i, j, k) {
        if (k === 0) {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i, j - 1, i, j, false, true);
            return;
        }

        if (k === 1) {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i - 1, j, i, j, false, true);
            return;
        } else {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i, j, i, j, true, true);
            return;
        }
    }

    async loadGameConfig() {
        let buff = await this.readDataFile('config' + VERSION.CONFIG + '.jag', 'Configuration', 10);

        if (buff === null) {
            this.errorLoadingData = true;
            return;
        }

        GameData.loadData(buff, this.members);

        let abyte1 = await this.readDataFile('filter' + VERSION.FILTER + '.jag', 'Chat system', 15);

        if (abyte1 === null) {
            this.errorLoadingData = true;
            return;
        } else {
            let buffragments = Utility.loadData('fragmentsenc.txt', 0, abyte1);
            let buffbandenc = Utility.loadData('badenc.txt', 0, abyte1);
            let buffhostenc = Utility.loadData('hostenc.txt', 0, abyte1);
            let bufftldlist = Utility.loadData('tldlist.txt', 0, abyte1);

            WordFilter.loadFilters(new GameBuffer(buffragments), new GameBuffer(buffbandenc), new GameBuffer(buffhostenc), new GameBuffer(bufftldlist));
            return;
        }
    }

    addNpc(serverIndex, x, y, sprite, type) {
        if (this.npcsServer[serverIndex] === null) {
            this.npcsServer[serverIndex] = new GameCharacter();
            this.npcsServer[serverIndex].serverIndex = serverIndex;
        }

        let character = this.npcsServer[serverIndex];
        let foundNpc = false;

        for (let i = 0; i < this.npcCacheCount; i++) {
            if (this.npcsCache[i].serverIndex !== serverIndex) {
                continue;
            }

            foundNpc = true;
            break;
        }

        if (foundNpc) {
            character.npcId = type;
            character.animationNext = sprite;
            let waypointIdx = character.waypointCurrent;

            if (x !== character.waypointsX[waypointIdx] || y !== character.waypointsY[waypointIdx]) {
                character.waypointCurrent = waypointIdx = (waypointIdx + 1) % 10;
                character.waypointsX[waypointIdx] = x;
                character.waypointsY[waypointIdx] = y;
            }
        } else {
            character.serverIndex = serverIndex;
            character.movingStep = 0;
            character.waypointCurrent = 0;
            character.waypointsX[0] = character.currentX = x;
            character.waypointsY[0] = character.currentY = y;
            character.npcId = type;
            character.animationNext = character.animationCurrent = sprite;
            character.stepCount = 0;
        }

        this.npcs[this.npcCount++] = character;
        return character;
    }

    resetLoginVars() {
        this.systemUpdate = 0;
        this.loginScreen = 0;
        this.loggedIn = 0;
        this.logoutTimeout = 0;
    }

    drawDialogBank() {
        let dialogWidth = 408;
        let dialogHeight = 334;

        if (this.bankActivePage > 0 && this.bankItemCount <= 48) {
            this.bankActivePage = 0;
        }

        if (this.bankActivePage > 1 && this.bankItemCount <= 96) {
            this.bankActivePage = 1;
        }

        if (this.bankActivePage > 2 && this.bankItemCount <= 144) {
            this.bankActivePage = 2;
        }

        if (this.bankSelectedItemSlot >= this.bankItemCount || this.bankSelectedItemSlot < 0) {
            this.bankSelectedItemSlot = -1;
        }

        if (this.bankSelectedItemSlot !== -1 && this.bankItems[this.bankSelectedItemSlot] !== this.bankSelectedItem) {
            this.bankSelectedItemSlot = -1;
            this.bankSelectedItem = -2;
        }

        if (this.mouseButtonClick !== 0) {
            this.mouseButtonClick = 0;

            let mouseX = this.mouseX - (((this.gameWidth / 2) | 0) - ((dialogWidth / 2) | 0));
            let mouseY = this.mouseY - (((this.gameHeight / 2) | 0) - ((dialogHeight / 2) | 0));
            //let mouseX = this.mouseX - (256 - dialogWidth / 2);
            //let mouseY = this.mouseY - (170 - dialogHeight / 2);

            if (mouseX >= 0 && mouseY >= 12 && mouseX < 408 && mouseY < 280) {
                let i1 = this.bankActivePage * 48;

                for (let l1 = 0; l1 < 6; l1++) {
                    for (let j2 = 0; j2 < 8; j2++) {
                        let l6 = 7 + j2 * 49;
                        let j7 = 28 + l1 * 34;

                        if (mouseX > l6 && mouseX < l6 + 49 && mouseY > j7 && mouseY < j7 + 34 && i1 < this.bankItemCount && this.bankItems[i1] !== -1) {
                            this.bankSelectedItem = this.bankItems[i1];
                            this.bankSelectedItemSlot = i1;
                        }

                        i1++;
                    }
                }

                mouseX = 256 - ((dialogWidth / 2) | 0);
                mouseY = 170 - ((dialogHeight / 2) | 0);

                let slot = 0;

                if (this.bankSelectedItemSlot < 0) {
                    slot = -1;
                } else {
                    slot = this.bankItems[this.bankSelectedItemSlot];
                }

                if (slot !== -1) {
                    let j1 = this.bankItemsCount[this.bankSelectedItemSlot];

                    if (GameData.itemStackable[slot] === 1 && j1 > 1) {
                        j1 = 1;
                    }

                    if (j1 >= 1 && this.mouseX >= mouseX + 220 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 250 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(1);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (j1 >= 5 && this.mouseX >= mouseX + 250 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 280 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(5);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (j1 >= 25 && this.mouseX >= mouseX + 280 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 305 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(25);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (j1 >= 100 && this.mouseX >= mouseX + 305 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 335 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(100);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (j1 >= 500 && this.mouseX >= mouseX + 335 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 368 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(500);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (j1 >= 2500 && this.mouseX >= mouseX + 370 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 400 && this.mouseY <= mouseY + 249) {
                        this.clientStream.newPacket(C_OPCODES.BANK_WITHDRAW);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(2500);
                        this.clientStream.putInt(0x12345678);
                        this.clientStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 1 && this.mouseX >= mouseX + 220 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 250 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(1);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 5 && this.mouseX >= mouseX + 250 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 280 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(5);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }
                    if (this.getInventoryCount(slot) >= 25 && this.mouseX >= mouseX + 280 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 305 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(25);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 100 && this.mouseX >= mouseX + 305 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 335 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(100);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }
                    if (this.getInventoryCount(slot) >= 500 && this.mouseX >= mouseX + 335 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 368 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(500);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 2500 && this.mouseX >= mouseX + 370 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 400 && this.mouseY <= mouseY + 274) {
                        this.clientStream.newPacket(C_OPCODES.BANK_DEPOSIT);
                        this.clientStream.putShort(slot);
                        this.clientStream.putShort(2500);
                        this.clientStream.putInt(0x87654321);
                        this.clientStream.sendPacket();
                    }
                }
            } else if (this.bankItemCount > 48 && mouseX >= 50 && mouseX <= 115 && mouseY <= 12) {
                this.bankActivePage = 0;
            } else if (this.bankItemCount > 48 && mouseX >= 115 && mouseX <= 180 && mouseY <= 12) {
                this.bankActivePage = 1;
            } else if (this.bankItemCount > 96 && mouseX >= 180 && mouseX <= 245 && mouseY <= 12) {
                this.bankActivePage = 2;
            } else if (this.bankItemCount > 144 && mouseX >= 245 && mouseX <= 310 && mouseY <= 12) {
                this.bankActivePage = 3;
            } else {
                this.clientStream.newPacket(C_OPCODES.BANK_CLOSE);
                this.clientStream.sendPacket();
                this.showDialogBank = false;
                return;
            }
        }

        let x = ((this.gameWidth / 2) | 0) - ((dialogWidth / 2) | 0);
        let y = ((this.gameHeight / 2) | 0) - ((dialogHeight / 2) | 0);
        //let x = 256 - dialogWidth / 2;
        //let y = 170 - dialogHeight / 2;

        this.surface.drawBox(x, y, 408, 12, 192);
        this.surface.drawBoxAlpha(x, y + 12, 408, 17, 0x989898, 160);
        this.surface.drawBoxAlpha(x, y + 29, 8, 204, 0x989898, 160);
        this.surface.drawBoxAlpha(x + 399, y + 29, 9, 204, 0x989898, 160);
        this.surface.drawBoxAlpha(x, y + 233, 408, 47, 0x989898, 160);
        this.surface.drawString('Bank', x + 1, y + 10, 1, 0xffffff);

        let xOff = 50;

        if (this.bankItemCount > 48) {
            let l2 = 0xffffff;

            if (this.bankActivePage === 0) {
                l2 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                l2 = 0xffff00;
            }

            this.surface.drawString('<page 1>', x + xOff, y + 10, 1, l2);
            xOff += 65;
            l2 = 0xffffff;

            if (this.bankActivePage === 1) {
                l2 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                l2 = 0xffff00;
            }

            this.surface.drawString('<page 2>', x + xOff, y + 10, 1, l2);
            xOff += 65;
        }

        if (this.bankItemCount > 96) {
            let i3 = 0xffffff;
            if (this.bankActivePage === 2) {
                i3 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                i3 = 0xffff00;
            }

            this.surface.drawString('<page 3>', x + xOff, y + 10, 1, i3);
            xOff += 65;
        }

        if (this.bankItemCount > 144) {
            let j3 = 0xffffff;

            if (this.bankActivePage === 3) {
                j3 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                j3 = 0xffff00;
            }

            this.surface.drawString('<page 4>', x + xOff, y + 10, 1, j3);
            xOff += 65;
        }

        let colour = 0xffffff;

        if (this.mouseX > x + 320 && this.mouseY >= y && this.mouseX < x + 408 && this.mouseY < y + 12) {
            colour = 0xff0000;
        }

        this.surface.drawStringRight('Close window', x + 406, y + 10, 1, colour);
        this.surface.drawString('Number in bank in green', x + 7, y + 24, 1, 65280);
        this.surface.drawString('Number held in blue', x + 289, y + 24, 1, 65535);

        let k7 = this.bankActivePage * 48;

        for (let i8 = 0; i8 < 6; i8++) {
            for (let j8 = 0; j8 < 8; j8++) {
                let l8 = x + 7 + j8 * 49;
                let i9 = y + 28 + i8 * 34;

                if (this.bankSelectedItemSlot === k7) {
                    this.surface.drawBoxAlpha(l8, i9, 49, 34, 0xff0000, 160);
                } else {
                    this.surface.drawBoxAlpha(l8, i9, 49, 34, 0xd0d0d0, 160);
                }

                this.surface.drawBoxEdge(l8, i9, 50, 35, 0);

                if (k7 < this.bankItemCount && this.bankItems[k7] !== -1) {
                    this.surface._spriteClipping_from9(l8, i9, 48, 32, this.spriteItem + GameData.itemPicture[this.bankItems[k7]], GameData.itemMask[this.bankItems[k7]], 0, 0, false);
                    this.surface.drawString(this.bankItemsCount[k7].toString(), l8 + 1, i9 + 10, 1, 65280);
                    this.surface.drawStringRight(this.getInventoryCount(this.bankItems[k7]).toString(), l8 + 47, i9 + 29, 1, 65535);
                }

                k7++;
            }
        }

        this.surface.drawLineHoriz(x + 5, y + 256, 398, 0);

        if (this.bankSelectedItemSlot === -1) {
            this.surface.drawStringCenter('Select an object to withdraw or deposit', x + 204, y + 248, 3, 0xffff00);
            return;
        }

        let itemType = 0;

        if (this.bankSelectedItemSlot < 0) {
            itemType = -1;
        } else {
            itemType = this.bankItems[this.bankSelectedItemSlot];
        }

        if (itemType !== -1) {
            let itemCount = this.bankItemsCount[this.bankSelectedItemSlot];

            if (GameData.itemStackable[itemType] === 1 && itemCount > 1) {
                itemCount = 1;
            }

            if (itemCount > 0) {
                this.surface.drawString('Withdraw ' + GameData.itemName[itemType], x + 2, y + 248, 1, 0xffffff);
                colour = 0xffffff;

                if (this.mouseX >= x + 220 && this.mouseY >= y + 238 && this.mouseX < x + 250 && this.mouseY <= y + 249) {
                    colour = 0xff0000;
                }

                this.surface.drawString('One', x + 222, y + 248, 1, colour);

                if (itemCount >= 5) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 250 && this.mouseY >= y + 238 && this.mouseX < x + 280 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('Five', x + 252, y + 248, 1, colour);
                }

                if (itemCount >= 25) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 280 && this.mouseY >= y + 238 && this.mouseX < x + 305 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('25', x + 282, y + 248, 1, colour);
                }

                if (itemCount >= 100) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 305 && this.mouseY >= y + 238 && this.mouseX < x + 335 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('100', x + 307, y + 248, 1, colour);
                }

                if (itemCount >= 500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 335 && this.mouseY >= y + 238 && this.mouseX < x + 368 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('500', x + 337, y + 248, 1, colour);
                }

                if (itemCount >= 2500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 370 && this.mouseY >= y + 238 && this.mouseX < x + 400 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('2500', x + 370, y + 248, 1, colour);
                }
            }

            if (this.getInventoryCount(itemType) > 0) {
                this.surface.drawString('Deposit ' + GameData.itemName[itemType], x + 2, y + 273, 1, 0xffffff);
                colour = 0xffffff;

                if (this.mouseX >= x + 220 && this.mouseY >= y + 263 && this.mouseX < x + 250 && this.mouseY <= y + 274) {
                    colour = 0xff0000;
                }

                this.surface.drawString('One', x + 222, y + 273, 1, colour);

                if (this.getInventoryCount(itemType) >= 5) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 250 && this.mouseY >= y + 263 && this.mouseX < x + 280 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('Five', x + 252, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 25) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 280 && this.mouseY >= y + 263 && this.mouseX < x + 305 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('25', x + 282, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 100) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 305 && this.mouseY >= y + 263 && this.mouseX < x + 335 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('100', x + 307, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 335 && this.mouseY >= y + 263 && this.mouseX < x + 368 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('500', x + 337, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 2500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 370 && this.mouseY >= y + 263 && this.mouseX < x + 400 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('2500', x + 370, y + 273, 1, colour);
                }
            }
        }
    }

    drawDialogDuel() {
        if (this.mouseButtonClick !== 0 && this.mouseButtonItemCountIncrement === 0) {
            this.mouseButtonItemCountIncrement = 1;
        }

        if (this.mouseButtonItemCountIncrement > 0) {
            let mouseX = this.mouseX - 22;
            let mouseY = this.mouseY - 36;

            if (mouseX >= 0 && mouseY >= 0 && mouseX < 468 && mouseY < 262) {
                if (mouseX > 216 && mouseY > 30 && mouseX < 462 && mouseY < 235) {
                    let slot = ((((mouseX - 217) | 0) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 5;
                    if (slot >= 0 && slot < this.inventoryItemsCount) {
                        let sendUpdate = false;
                        let l1 = 0;
                        let item = this.inventoryItemId[slot];

                        for (let k3 = 0; k3 < this.duelOfferItemCount; k3++) {
                            if (this.duelOfferItemId[k3] === item) {
                                if (GameData.itemStackable[item] === 0) {
                                    for (let i4 = 0; i4 < this.mouseButtonItemCountIncrement; i4++) {
                                        if (this.duelOfferItemStack[k3] < this.inventoryItemStackCount[slot]) {
                                            this.duelOfferItemStack[k3]++;
                                        }

                                        sendUpdate = true;
                                    }
                                } else {
                                    l1++;
                                }
                            }
                        }

                        if (this.getInventoryCount(item) <= l1) {
                            sendUpdate = true;
                        }

                        if (GameData.itemSpecial[item] === 1) {
                            this.showMessage('This object cannot be added to a duel offer', 3);
                            sendUpdate = true;
                        }

                        if (!sendUpdate && this.duelOfferItemCount < 8) {
                            this.duelOfferItemId[this.duelOfferItemCount] = item;
                            this.duelOfferItemStack[this.duelOfferItemCount] = 1;
                            this.duelOfferItemCount++;
                            sendUpdate = true;
                        }

                        if (sendUpdate) {
                            this.clientStream.newPacket(C_OPCODES.DUEL_ITEM_UPDATE);
                            this.clientStream.putByte(this.duelOfferItemCount);

                            for (let j4 = 0; j4 < this.duelOfferItemCount; j4++) {
                                this.clientStream.putShort(this.duelOfferItemId[j4]);
                                this.clientStream.putInt(this.duelOfferItemStack[j4]);
                            }

                            this.clientStream.sendPacket();
                            this.duelOfferOpponentAccepted = false;
                            this.duelOfferAccepted = false;
                        }
                    }
                }

                if (mouseX > 8 && mouseY > 30 && mouseX < 205 && mouseY < 129) {
                    let slot = (((mouseX - 9) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 4;

                    if (slot >= 0 && slot < this.duelOfferItemCount) {
                        let j1 = this.duelOfferItemId[slot];
                        for (let i2 = 0; i2 < this.mouseButtonItemCountIncrement; i2++) {
                            if (GameData.itemStackable[j1] === 0 && this.duelOfferItemStack[slot] > 1) {
                                this.duelOfferItemStack[slot]--;
                                continue;
                            }

                            this.duelOfferItemCount--;
                            this.mouseButtonDownTime = 0;

                            for (let l2 = slot; l2 < this.duelOfferItemCount; l2++) {
                                this.duelOfferItemId[l2] = this.duelOfferItemId[l2 + 1];
                                this.duelOfferItemStack[l2] = this.duelOfferItemStack[l2 + 1];
                            }

                            break;
                        }

                        this.clientStream.newPacket(C_OPCODES.DUEL_ITEM_UPDATE);
                        this.clientStream.putByte(this.duelOfferItemCount);

                        for (let i3 = 0; i3 < this.duelOfferItemCount; i3++) {
                            this.clientStream.putShort(this.duelOfferItemId[i3]);
                            this.clientStream.putInt(this.duelOfferItemStack[i3]);
                        }

                        this.clientStream.sendPacket();
                        this.duelOfferOpponentAccepted = false;
                        this.duelOfferAccepted = false;
                    }
                }

                let flag = false;

                if (mouseX >= 93 && mouseY >= 221 && mouseX <= 104 && mouseY <= 232) {
                    this.duelSettingsRetreat = !this.duelSettingsRetreat;
                    flag = true;
                }

                if (mouseX >= 93 && mouseY >= 240 && mouseX <= 104 && mouseY <= 251) {
                    this.duelSettingsMagic = !this.duelSettingsMagic;
                    flag = true;
                }

                if (mouseX >= 191 && mouseY >= 221 && mouseX <= 202 && mouseY <= 232) {
                    this.duelSettingsPrayer = !this.duelSettingsPrayer;
                    flag = true;
                }

                if (mouseX >= 191 && mouseY >= 240 && mouseX <= 202 && mouseY <= 251) {
                    this.duelSettingsWeapons = !this.duelSettingsWeapons;
                    flag = true;
                }

                if (flag) {
                    this.clientStream.newPacket(C_OPCODES.DUEL_SETTINGS);
                    this.clientStream.putByte(this.duelSettingsRetreat ? 1 : 0);
                    this.clientStream.putByte(this.duelSettingsMagic ? 1 : 0);
                    this.clientStream.putByte(this.duelSettingsPrayer ? 1 : 0);
                    this.clientStream.putByte(this.duelSettingsWeapons ? 1 : 0);
                    this.clientStream.sendPacket();
                    this.duelOfferOpponentAccepted = false;
                    this.duelOfferAccepted = false;
                }

                if (mouseX >= 217 && mouseY >= 238 && mouseX <= 286 && mouseY <= 259) {
                    this.duelOfferAccepted = true;
                    this.clientStream.newPacket(C_OPCODES.DUEL_ACCEPT);
                    this.clientStream.sendPacket();
                }

                if (mouseX >= 394 && mouseY >= 238 && mouseX < 463 && mouseY < 259) {
                    this.showDialogDuel = false;
                    this.clientStream.newPacket(C_OPCODES.DUEL_DECLINE);
                    this.clientStream.sendPacket();
                }
            } else if (this.mouseButtonClick !== 0) {
                this.showDialogDuel = false;
                this.clientStream.newPacket(C_OPCODES.DUEL_DECLINE);
                this.clientStream.sendPacket();
            }

            this.mouseButtonClick = 0;
            this.mouseButtonItemCountIncrement = 0;
        }

        if (!this.showDialogDuel) {
            return;
        }

        //let dialogX = this.gameWidth / 2 - 468 / 2 + 22;
        //let dialogY = this.gameHeight / 2 - 262 / 2 + 22;
        let dialogX = 22;
        let dialogY = 36;

        this.surface.drawBox(dialogX, dialogY, 468, 12, 0xc90b1d);
        this.surface.drawBoxAlpha(dialogX, dialogY + 12, 468, 18, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX, dialogY + 30, 8, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 205, dialogY + 30, 11, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 462, dialogY + 30, 6, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 99, 197, 24, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 192, 197, 23, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 258, 197, 20, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 235, 246, 43, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 30, 197, 69, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 123, 197, 69, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 215, 197, 43, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 30, 246, 205, 0xd0d0d0, 160);

        for (let j2 = 0; j2 < 3; j2++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 30 + j2 * 34, 197, 0);
        }

        for (let j3 = 0; j3 < 3; j3++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 123 + j3 * 34, 197, 0);
        }

        for (let l3 = 0; l3 < 7; l3++) {
            this.surface.drawLineHoriz(dialogX + 216, dialogY + 30 + l3 * 34, 246, 0);
        }

        for (let k4 = 0; k4 < 6; k4++) {
            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 30, 69, 0);
            }

            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 123, 69, 0);
            }

            this.surface.drawLineVert(dialogX + 216 + k4 * 49, dialogY + 30, 205, 0);
        }

        this.surface.drawLineHoriz(dialogX + 8, dialogY + 215, 197, 0);
        this.surface.drawLineHoriz(dialogX + 8, dialogY + 257, 197, 0);
        this.surface.drawLineVert(dialogX + 8, dialogY + 215, 43, 0);
        this.surface.drawLineVert(dialogX + 204, dialogY + 215, 43, 0);
        this.surface.drawString('Preparing to duel with: ' + this.duelOpponentName, dialogX + 1, dialogY + 10, 1, 0xffffff);
        this.surface.drawString('Your Stake', dialogX + 9, dialogY + 27, 4, 0xffffff);
        this.surface.drawString('Opponent\'s Stake', dialogX + 9, dialogY + 120, 4, 0xffffff);
        this.surface.drawString('Duel Options', dialogX + 9, dialogY + 212, 4, 0xffffff);
        this.surface.drawString('Your Inventory', dialogX + 216, dialogY + 27, 4, 0xffffff);
        this.surface.drawString('No retreating', dialogX + 8 + 1, dialogY + 215 + 16, 3, 0xffff00);
        this.surface.drawString('No magic', dialogX + 8 + 1, dialogY + 215 + 35, 3, 0xffff00);
        this.surface.drawString('No prayer', dialogX + 8 + 102, dialogY + 215 + 16, 3, 0xffff00);
        this.surface.drawString('No weapons', dialogX + 8 + 102, dialogY + 215 + 35, 3, 0xffff00);
        this.surface.drawBoxEdge(dialogX + 93, dialogY + 215 + 6, 11, 11, 0xffff00);

        if (this.duelSettingsRetreat) {
            this.surface.drawBox(dialogX + 95, dialogY + 215 + 8, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 93, dialogY + 215 + 25, 11, 11, 0xffff00);

        if (this.duelSettingsMagic) {
            this.surface.drawBox(dialogX + 95, dialogY + 215 + 27, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 191, dialogY + 215 + 6, 11, 11, 0xffff00);

        if (this.duelSettingsPrayer) {
            this.surface.drawBox(dialogX + 193, dialogY + 215 + 8, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 191, dialogY + 215 + 25, 11, 11, 0xffff00);

        if (this.duelSettingsWeapons) {
            this.surface.drawBox(dialogX + 193, dialogY + 215 + 27, 7, 7, 0xffff00);
        }

        if (!this.duelOfferAccepted) {
            this.surface._drawSprite_from3(dialogX + 217, dialogY + 238, this.spriteMedia + 25);
        }

        this.surface._drawSprite_from3(dialogX + 394, dialogY + 238, this.spriteMedia + 26);

        if (this.duelOfferOpponentAccepted) {
            this.surface.drawStringCenter('Other player', dialogX + 341, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('has accepted', dialogX + 341, dialogY + 256, 1, 0xffffff);
        }

        if (this.duelOfferAccepted) {
            this.surface.drawStringCenter('Waiting for', dialogX + 217 + 35, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('other player', dialogX + 217 + 35, dialogY + 256, 1, 0xffffff);
        }

        for (let i = 0; i < this.inventoryItemsCount; i++) {
            let x = 217 + dialogX + (i % 5) * 49;
            let y = 31 + dialogY + ((i / 5) | 0) * 34;
            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.inventoryItemId[i]], GameData.itemMask[this.inventoryItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.inventoryItemId[i]] === 0) {
                this.surface.drawString(this.inventoryItemStackCount[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }
        }

        for (let i = 0; i < this.duelOfferItemCount; i++) {
            let x = 9 + dialogX + (i % 4) * 49;
            let y = 31 + dialogY + ((i / 4) | 0) * 34;

            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.duelOfferItemId[i]], GameData.itemMask[this.duelOfferItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.duelOfferItemId[i]] === 0) {
                this.surface.drawString(this.duelOfferItemStack[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }

            if (this.mouseX > x && this.mouseX < x + 48 && this.mouseY > y && this.mouseY < y + 32) {
                this.surface.drawString(GameData.itemName[this.duelOfferItemId[i]] + ': @whi@' + GameData.itemDescription[this.duelOfferItemId[i]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }

        for (let i = 0; i < this.duelOfferOpponentItemCount; i++) {
            let x = 9 + dialogX + (i % 4) * 49;
            let y = 124 + dialogY + ((i / 4) | 0) * 34;

            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.duelOfferOpponentItemId[i]], GameData.itemMask[this.duelOfferOpponentItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.duelOfferOpponentItemId[i]] === 0) {
                this.surface.drawString(this.duelOfferOpponentItemStack[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }

            if (this.mouseX > x && this.mouseX < x + 48 && this.mouseY > y && this.mouseY < y + 32) {
                this.surface.drawString(GameData.itemName[this.duelOfferOpponentItemId[i]] + ': @whi@' + GameData.itemDescription[this.duelOfferOpponentItemId[i]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }
    }

    loadNextRegion(lx, ly) {
        if (this.deathScreenTimeout !== 0) {
            this.world.playerAlive = false;
            return false;
        }

        this.loadingArea = false;
        lx += this.planeWidth;
        ly += this.planeHeight;

        if (this.lastHeightOffset === this.planeIndex && lx > this.localLowerX && lx < this.localUpperX && ly > this.localLowerY && ly < this.localUpperY) {
            this.world.playerAlive = true;
            return false;
        }

        this.surface.drawStringCenter('Loading... Please wait', 256, 192, 1, 0xffffff);
        this.drawChatMessageTabs();
        this.surface.draw(this.graphics, 0, 0);

        let ax = this.regionX;
        let ay = this.regionY;
        let sectionX = ((lx + 24) / 48) | 0;
        let sectionY = ((ly + 24) / 48) | 0;

        this.lastHeightOffset = this.planeIndex;
        this.regionX = sectionX * 48 - 48;
        this.regionY = sectionY * 48 - 48;
        this.localLowerX = sectionX * 48 - 32;
        this.localLowerY = sectionY * 48 - 32;
        this.localUpperX = sectionX * 48 + 32;
        this.localUpperY = sectionY * 48 + 32;

        this.world._loadSection_from3(lx, ly, this.lastHeightOffset);

        this.regionX -= this.planeWidth;
        this.regionY -= this.planeHeight;

        let offsetX = this.regionX - ax;
        let offsetY = this.regionY - ay;

        for (let objIdx = 0; objIdx < this.objectCount; objIdx++) {
            this.objectX[objIdx] -= offsetX;
            this.objectY[objIdx] -= offsetY;

            let objx = this.objectX[objIdx];
            let objy = this.objectY[objIdx];
            let objid = this.objectId[objIdx];

            let gameModel = this.objectModel[objIdx];

            try {
                let objType = this.objectDirection[objIdx];
                let objW = 0;
                let objH = 0;

                if (objType === 0 || objType === 4) {
                    objW = GameData.objectWidth[objid];
                    objH = GameData.objectHeight[objid];
                } else {
                    objH = GameData.objectWidth[objid];
                    objW = GameData.objectHeight[objid];
                }

                let j6 = (((objx + objx + objW) * this.magicLoc) / 2) | 0;
                let k6 = (((objy + objy + objH) * this.magicLoc) / 2) | 0;

                if (objx >= 0 && objy >= 0 && objx < 96 && objy < 96) {
                    this.scene.addModel(gameModel);
                    gameModel.place(j6, -this.world.getElevation(j6, k6), k6);
                    this.world.removeObject2(objx, objy, objid);

                    if (objid === 74) {
                        gameModel.translate(0, -480, 0);
                    }
                }
            } catch (e) {
                console.log('Loc Error: ' + e.message);
                console.error(e);
            }
        }

        for (let k2 = 0; k2 < this.wallObjectCount; k2++) {
            this.wallObjectX[k2] -= offsetX;
            this.wallObjectY[k2] -= offsetY;

            let i3 = this.wallObjectX[k2];
            let l3 = this.wallObjectY[k2];
            let j4 = this.wallObjectId[k2];
            let i5 = this.wallObjectDirection[k2];

            try {
                this.world._setObjectAdjacency_from4(i3, l3, i5, j4);
                let gameModel_1 = this.createModel(i3, l3, i5, j4, k2);
                this.wallObjectModel[k2] = gameModel_1;
            } catch (e) {
                console.log('Bound Error: ' + e.message);
                console.error(e);
            }
        }

        for (let j3 = 0; j3 < this.groundItemCount; j3++) {
            this.groundItemX[j3] -= offsetX;
            this.groundItemY[j3] -= offsetY;
        }

        for (let i4 = 0; i4 < this.playerCount; i4++) {
            let character = this.players[i4];

            character.currentX -= offsetX * this.magicLoc;
            character.currentY -= offsetY * this.magicLoc;

            for (let j5 = 0; j5 <= character.waypointCurrent; j5++) {
                character.waypointsX[j5] -= offsetX * this.magicLoc;
                character.waypointsY[j5] -= offsetY * this.magicLoc;
            }

        }

        for (let k4 = 0; k4 < this.npcCount; k4++) {
            let character_1 = this.npcs[k4];

            character_1.currentX -= offsetX * this.magicLoc;
            character_1.currentY -= offsetY * this.magicLoc;

            for (let l5 = 0; l5 <= character_1.waypointCurrent; l5++) {
                character_1.waypointsX[l5] -= offsetX * this.magicLoc;
                character_1.waypointsY[l5] -= offsetY * this.magicLoc;
            }
        }

        this.world.playerAlive = true;

        return true;
    }

    drawPlayer(x, y, w, h, id, tx, ty) {
        let character = this.players[id];

        // this means the character is invisible! MOD!!!
        if (character.colourBottom === 255)  {
            return;
        }

        let l1 = character.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
        let flag = false;
        let i2 = l1;

        if (i2 === 5) {
            i2 = 3;
            flag = true;
        } else if (i2 === 6) {
            i2 = 2;
            flag = true;
        } else if (i2 === 7) {
            i2 = 1;
            flag = true;
        }

        let j2 = i2 * 3 + this.npcWalkModel[((character.stepCount / 6) | 0) % 4];

        if (character.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[((this.loginTimer / 5) | 0) % 8];
        } else if (character.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / 6) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let l3 = character.equippedItem[l2] - 1;

            if (l3 >= 0) {
                let k4 = 0;
                let i5 = 0;
                let j5 = j2;

                if (flag && i2 >= 1 && i2 <= 3) {
                    if (GameData.animationHasF[l3] === 1) {
                        j5 += 15;
                    } else if (l2 === 4 && i2 === 1) {
                        k4 = -22;
                        i5 = -3;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 2) {
                        k4 = 0;
                        i5 = -8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 3) {
                        k4 = 26;
                        i5 = -5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 1) {
                        k4 = 22;
                        i5 = 3;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 2) {
                        k4 = 0;
                        i5 = 8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 3) {
                        k4 = -26;
                        i5 = 5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    }
                }

                if (i2 !== 5 || GameData.animationHasA[l3] === 1) {
                    let k5 = j5 + GameData.animationNumber[l3];

                    k4 = ((k4 * w) / this.surface.spriteWidthFull[k5]) | 0;
                    i5 = ((i5 * h) / this.surface.spriteHeightFull[k5]) | 0;

                    let l5 = ((w * this.surface.spriteWidthFull[k5]) / this.surface.spriteWidthFull[GameData.animationNumber[l3]]) | 0;

                    k4 -= ((l5 - w) / 2) | 0;

                    let i6 = GameData.animationCharacterColour[l3];
                    let j6 = this.characterSkinColours[character.colourSkin];

                    if (i6 === 1) {
                        i6 = this.characterHairColours[character.colourHair];
                    } else if (i6 === 2) {
                        i6 = this.characterTopBottomColours[character.colourTop];
                    } else if (i6 === 3) {
                        i6 = this.characterTopBottomColours[character.colourBottom];
                    }

                    this.surface._spriteClipping_from9(x + k4, y + i5, l5, h, k5, i6, j6, tx, flag);
                }
            }
        }

        if (character.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(character.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(character.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = character.message;
        }

        if (character.bubbleTimeout > 0) {
            this.actionBubbleX[this.itemsAboveHeadCount] = x + ((w / 2) | 0);
            this.actionBubbleY[this.itemsAboveHeadCount] = y;
            this.actionBubbleScale[this.itemsAboveHeadCount] = ty;
            this.actionBubbleItem[this.itemsAboveHeadCount++] = character.bubbleItem;
        }

        if (character.animationCurrent === 8 || character.animationCurrent === 9 || character.combatTimer !== 0) {
            if (character.combatTimer > 0) {
                let i3 = x;

                if (character.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let i4 = ((character.healthCurrent * 30) / character.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = i4;
            }

            if (character.combatTimer > 150) {
                let j3 = x;

                if (character.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 11);
                this.surface.drawStringCenter(character.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
            }
        }

        if (character.skullVisible === 1 && character.bubbleTimeout === 0) {
            let k3 = tx + x + ((w / 2) | 0);

            if (character.animationCurrent === 8) {
                k3 -= ((20 * ty) / 100) | 0;
            } else if (character.animationCurrent === 9) {
                k3 += ((20 * ty) / 100) | 0;
            }

            let j4 = ((16 * ty) / 100) | 0;
            let l4 = ((16 * ty) / 100) | 0;

            this.surface._spriteClipping_from5(k3 - ((j4 / 2) | 0), y - ((l4 / 2) | 0) - (((10 * ty) / 100) | 0), j4, l4, this.spriteMedia + 13);
        }
    }

    async loadMedia() {
        let media = await this.readDataFile('media' + VERSION.MEDIA + '.jag', '2d graphics', 20);

        if (media === null) {
            this.errorLoadingData = true;
            return;
        }

        let buff = Utility.loadData('index.dat', 0, media);

        this.surface.parseSprite(this.spriteMedia, Utility.loadData('inv1.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 1, Utility.loadData('inv2.dat', 0, media), buff, 6);
        this.surface.parseSprite(this.spriteMedia + 9, Utility.loadData('bubble.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 10, Utility.loadData('runescape.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 11, Utility.loadData('splat.dat', 0, media), buff, 3);
        this.surface.parseSprite(this.spriteMedia + 14, Utility.loadData('icon.dat', 0, media), buff, 8);
        this.surface.parseSprite(this.spriteMedia + 22, Utility.loadData('hbar.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 23, Utility.loadData('hbar2.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 24, Utility.loadData('compass.dat', 0, media), buff, 1);
        this.surface.parseSprite(this.spriteMedia + 25, Utility.loadData('buttons.dat', 0, media), buff, 2);
        this.surface.parseSprite(this.spriteUtil, Utility.loadData('scrollbar.dat', 0, media), buff, 2);
        this.surface.parseSprite(this.spriteUtil + 2, Utility.loadData('corners.dat', 0, media), buff, 4);
        this.surface.parseSprite(this.spriteUtil + 6, Utility.loadData('arrows.dat', 0, media), buff, 2);
        this.surface.parseSprite(this.spriteProjectile, Utility.loadData('projectile.dat', 0, media), buff, GameData.projectileSprite);

        let i = GameData.itemSpriteCount;

        for (let j = 1; i > 0; j++) {
            let k = i;
            i -= 30;

            if (k > 30) {
                k = 30;
            }

            this.surface.parseSprite(this.spriteItem + (j - 1) * 30, Utility.loadData('objects' + j + '.dat', 0, media), buff, k);
        }

        this.surface.loadSprite(this.spriteMedia);
        this.surface.loadSprite(this.spriteMedia + 9);

        for (let l = 11; l <= 26; l++) {
            this.surface.loadSprite(this.spriteMedia + l);
        }

        for (let i1 = 0; i1 < GameData.projectileSprite; i1++) {
            this.surface.loadSprite(this.spriteProjectile + i1);
        }

        for (let j1 = 0; j1 < GameData.itemSpriteCount; j1++) {
            this.surface.loadSprite(this.spriteItem + j1);
        }
    }

    drawChatMessageTabs() {
        this.surface._drawSprite_from3(0, this.gameHeight - 4, this.spriteMedia + 23);

        let col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 0) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashAll % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('All messages', 54, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 1) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashHistory % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Chat history', 155, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 2) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashQuest % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Quest history', 255, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 3) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashPrivate % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Private history', 355, this.gameHeight + 6, 0, col);
        this.surface.drawStringCenter('Report abuse', 457, this.gameHeight + 6, 0, 0xffffff);
    }

    async startGame() {
        let totalExp = 0;

        for (let level = 0; level < 99; level++) {
            let level_1 = level + 1;
            let exp = (level_1 + 300 * Math.pow(2, level_1 / 7)) | 0;
            totalExp += exp;
            this.experienceArray[level] = totalExp & 0xffffffc;
        }

        this.port = this.port || 43595;
        this.maxReadTries = 1000;
        GameConnection.clientVersion = VERSION.CLIENT;

        await this.loadGameConfig();

        if (this.errorLoadingData) {
            return;
        }

        this.spriteMedia = 2000;
        this.spriteUtil = this.spriteMedia + 100;
        this.spriteItem = this.spriteUtil + 50;
        this.spriteLogo = this.spriteItem + 1000;
        this.spriteProjectile = this.spriteLogo + 10;
        this.spriteTexture = this.spriteProjectile + 50;
        this.spriteTextureWorld = this.spriteTexture + 10;

        this.graphics = this.getGraphics();

        this.setTargetFps(50);

        this.surface = new SurfaceSprite(this.gameWidth, this.gameHeight + 12, 4000, this);
        this.surface.mudclientref = this;
        this.surface.setBounds(0, 0, this.gameWidth, this.gameHeight + 12);

        Panel.drawBackgroundArrow = false;
        Panel.baseSpriteStart = this.spriteUtil;

        this.panelMagic = new Panel(this.surface, 5);

        let x = this.surface.width2 - 199;
        let y = 36;

        this.controlListMagic = this.panelMagic.addTextListInteractive(x, y + 24, 196, 90, 1, 500, true);
        this.panelSocialList = new Panel(this.surface, 5);
        this.controlListSocialPlayers = this.panelSocialList.addTextListInteractive(x, y + 40, 196, 126, 1, 500, true);
        this.panelQuestList = new Panel(this.surface, 5);
        this.controlListQuest = this.panelQuestList.addTextListInteractive(x, y + 24, 196, 251, 1, 500, true);

        await this.loadMedia();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadEntities();

        if (this.errorLoadingData) {
            return;
        }

        this.scene = new Scene(this.surface, 15000, 15000, 1000);
        // this used to be in scene's constructor
        this.scene.view = GameModel._from2(1000 * 1000, 1000); 
        this.scene.setBounds((this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, (this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, this.gameWidth, this.const_9);
        this.scene.clipFar3d = 2400;
        this.scene.clipFar2d = 2400;
        this.scene.fogZFalloff = 1;
        this.scene.fogZDistance = 2300;
        this.scene._setLight_from3(-50, -10, -50);
        this.world = new World(this.scene, this.surface);
        this.world.baseMediaSprite = this.spriteMedia;

        await this.loadTextures();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadModels();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadMaps();

        if (this.errorLoadingData) {
            return;
        }

        if (this.members) {
            await this.loadSounds();
        }

        if (!this.errorLoadingData) {
            this.showLoadingProgress(100, 'Starting game...');
            this.createMessageTabPanel();
            this.createLoginPanels();
            this.createAppearancePanel();
            this.resetLoginScreenVariables();
            this.renderLoginScreenViewports();
        }
    }

    drawUiTabMagic(nomenus) {
        let uiX = this.surface.width2 - 199;
        let uiY = 36;
        this.surface._drawSprite_from3(uiX - 49, 3, this.spriteMedia + 4);
        let uiWidth = 196;
        let uiHeight = 182;
        let l = 0;
        let k = l = Surface.rgbToLong(160, 160, 160);

        if (this.tabMagicPrayer === 0) {
            k = Surface.rgbToLong(220, 220, 220);
        } else {
            l = Surface.rgbToLong(220, 220, 220);
        }

        this.surface.drawBoxAlpha(uiX, uiY, (uiWidth / 2) | 0, 24, k, 128);
        this.surface.drawBoxAlpha(uiX + ((uiWidth / 2) | 0), uiY, (uiWidth / 2) | 0, 24, l, 128);
        this.surface.drawBoxAlpha(uiX, uiY + 24, uiWidth, 90, Surface.rgbToLong(220, 220, 220), 128);
        this.surface.drawBoxAlpha(uiX, uiY + 24 + 90, uiWidth, uiHeight - 90 - 24, Surface.rgbToLong(160, 160, 160), 128);
        this.surface.drawLineHoriz(uiX, uiY + 24, uiWidth, 0);
        this.surface.drawLineVert(uiX + ((uiWidth / 2) | 0), uiY, 24, 0);
        this.surface.drawLineHoriz(uiX, uiY + 113, uiWidth, 0);
        this.surface.drawStringCenter('Magic', uiX + ((uiWidth / 4) | 0), uiY + 16, 4, 0);
        this.surface.drawStringCenter('Prayers', uiX + ((uiWidth / 4) | 0) + ((uiWidth / 2) | 0), uiY + 16, 4, 0);

        if (this.tabMagicPrayer === 0) {
            this.panelMagic.clearList(this.controlListMagic);

            let i1 = 0;

            for (let spell = 0; spell < GameData.spellCount; spell++) {
                let s = '@yel@';

                for (let rune = 0; rune < GameData.spellRunesRequired[spell]; rune++) {
                    let k4 = GameData.spellRunesId[spell][rune];

                    if (this.hasInventoryItems(k4, GameData.spellRunesCount[spell][rune])) {
                        continue;
                    }

                    s = '@whi@';
                    break;
                }

                let l4 = this.playerStatCurrent[6];

                if (GameData.spellLevel[spell] > l4) {
                    s = '@bla@';
                }

                this.panelMagic.addListEntry(this.controlListMagic, i1++, s + 'Level ' + GameData.spellLevel[spell] + ': ' + GameData.spellName[spell]);
            }

            this.panelMagic.drawPanel();

            let i3 = this.panelMagic.getListEntryIndex(this.controlListMagic);

            if (i3 !== -1) {
                this.surface.drawString('Level ' + GameData.spellLevel[i3] + ': ' + GameData.spellName[i3], uiX + 2, uiY + 124, 1, 0xffff00);
                this.surface.drawString(GameData.spellDescription[i3], uiX + 2, uiY + 136, 0, 0xffffff);

                for (let i4 = 0; i4 < GameData.spellRunesRequired[i3]; i4++) {
                    let i5 = GameData.spellRunesId[i3][i4];
                    this.surface._drawSprite_from3(uiX + 2 + i4 * 44, uiY + 150, this.spriteItem + GameData.itemPicture[i5]);
                    let j5 = this.getInventoryCount(i5);
                    let k5 = GameData.spellRunesCount[i3][i4];
                    let s2 = '@red@';

                    if (this.hasInventoryItems(i5, k5)) {
                        s2 = '@gre@';
                    }

                    this.surface.drawString(s2 + j5 + '/' + k5, uiX + 2 + i4 * 44, uiY + 150, 1, 0xffffff);
                }

            } else {
                this.surface.drawString('Point at a spell for a description', uiX + 2, uiY + 124, 1, 0);
            }
        }

        if (this.tabMagicPrayer === 1) {
            this.panelMagic.clearList(this.controlListMagic);
            let j1 = 0;

            for (let j2 = 0; j2 < GameData.prayerCount; j2++) {
                let s1 = '@whi@';

                if (GameData.prayerLevel[j2] > this.playerStatBase[5]) {
                    s1 = '@bla@';
                }

                if (this.prayerOn[j2]) {
                    s1 = '@gre@';
                }

                this.panelMagic.addListEntry(this.controlListMagic, j1++, s1 + 'Level ' + GameData.prayerLevel[j2] + ': ' + GameData.prayerName[j2]);
            }

            this.panelMagic.drawPanel();

            let j3 = this.panelMagic.getListEntryIndex(this.controlListMagic);

            if (j3 !== -1) {
                this.surface.drawStringCenter('Level ' + GameData.prayerLevel[j3] + ': ' + GameData.prayerName[j3], uiX + ((uiWidth / 2) | 0), uiY + 130, 1, 0xffff00);
                this.surface.drawStringCenter(GameData.prayerDescription[j3], uiX + ((uiWidth / 2) | 0), uiY + 145, 0, 0xffffff);
                this.surface.drawStringCenter('Drain rate: ' + GameData.prayerDrain[j3], uiX + ((uiWidth / 2) | 0), uiY + 160, 1, 0);
            } else {
                this.surface.drawString('Point at a prayer for a description', uiX + 2, uiY + 124, 1, 0);
            }
        }

        if (!nomenus) {
            return;
        }

        let mouseX = this.mouseX - (this.surface.width2 - 199);
        let mouseY = this.mouseY - 36;

        if (mouseX >= 0 && mouseY >= 0 && mouseX < 196 && mouseY < 182) {
            this.panelMagic.handleMouse(mouseX + (this.surface.width2 - 199), mouseY + 36, this.lastMouseButtonDown, this.mouseButtonDown, this.mouseScrollDelta);

            if (mouseY <= 24 && this.mouseButtonClick === 1) {
                if (mouseX < 98 && this.tabMagicPrayer === 1) {
                    this.tabMagicPrayer = 0;
                    this.panelMagic.resetListProps(this.controlListMagic);
                } else if (mouseX > 98 && this.tabMagicPrayer === 0) {
                    this.tabMagicPrayer = 1;
                    this.panelMagic.resetListProps(this.controlListMagic);
                }
            }

            if (this.mouseButtonClick === 1 && this.tabMagicPrayer === 0) {
                let idx = this.panelMagic.getListEntryIndex(this.controlListMagic);

                if (idx !== -1) {
                    let k2 = this.playerStatCurrent[6];

                    if (GameData.spellLevel[idx] > k2) {
                        this.showMessage('Your magic ability is not high enough for this spell', 3);
                    } else {
                        let k3 = 0;

                        for (k3 = 0; k3 < GameData.spellRunesRequired[idx]; k3++) {
                            let j4 = GameData.spellRunesId[idx][k3];

                            if (this.hasInventoryItems(j4, GameData.spellRunesCount[idx][k3])) {
                                continue;
                            }

                            this.showMessage('You don\'t have all the reagents you need for this spell', 3);
                            k3 = -1;
                            break;
                        }

                        if (k3 === GameData.spellRunesRequired[idx]) {
                            this.selectedSpell = idx;
                            this.selectedItemInventoryIndex = -1;
                        }
                    }
                }
            }

            if (this.mouseButtonClick === 1 && this.tabMagicPrayer === 1) {
                let l1 = this.panelMagic.getListEntryIndex(this.controlListMagic);

                if (l1 !== -1) {
                    let l2 = this.playerStatBase[5];

                    if (GameData.prayerLevel[l1] > l2) {
                        this.showMessage('Your prayer ability is not high enough for this prayer', 3);
                    } else if (this.playerStatCurrent[5] === 0) {
                        this.showMessage('You have run out of prayer points. Return to a church to recharge', 3);
                    } else if (this.prayerOn[l1]) {
                        this.clientStream.newPacket(C_OPCODES.PRAYER_OFF);
                        this.clientStream.putByte(l1);
                        this.clientStream.sendPacket();
                        this.prayerOn[l1] = false;
                        this.playSoundFile('prayeroff');
                    } else {
                        this.clientStream.newPacket(C_OPCODES.PRAYER_ON);
                        this.clientStream.putByte(l1);
                        this.clientStream.sendPacket();
                        this.prayerOn[l1] = true;
                        this.playSoundFile('prayeron');
                    }
                }
            }

            this.mouseButtonClick = 0;
        }
    }

    drawDialogShop() {
        if (this.mouseButtonClick !== 0) {
            this.mouseButtonClick = 0;

            let mouseX = this.mouseX - 52;
            let mouseY = this.mouseY - 44;

            if (mouseX >= 0 && mouseY >= 12 && mouseX < 408 && mouseY < 246) {
                let itemIndex = 0;

                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 8; col++) {
                        let slotX = 7 + col * 49;
                        let slotY = 28 + row * 34;

                        if (mouseX > slotX && mouseX < slotX + 49 && mouseY > slotY && mouseY < slotY + 34 && this.shopItem[itemIndex] !== -1) {
                            this.shopSelectedItemIndex = itemIndex;
                            this.shopSelectedItemType = this.shopItem[itemIndex];
                        }

                        itemIndex++;
                    }

                }

                if (this.shopSelectedItemIndex >= 0) {
                    let itemType = this.shopItem[this.shopSelectedItemIndex];

                    if (itemType !== -1) {
                        if (this.shopItemCount[this.shopSelectedItemIndex] > 0 && mouseX > 298 && mouseY >= 204 && mouseX < 408 && mouseY <= 215) {
                            let priceMod = this.shopBuyPriceMod + this.shopItemPrice[this.shopSelectedItemIndex];

                            if (priceMod < 10) {
                                priceMod = 10;
                            }

                            let itemPrice = ((priceMod * GameData.itemBasePrice[itemType]) / 100) | 0;

                            this.clientStream.newPacket(C_OPCODES.SHOP_BUY);
                            this.clientStream.putShort(this.shopItem[this.shopSelectedItemIndex]);
                            this.clientStream.putInt(itemPrice);
                            this.clientStream.sendPacket();
                        }

                        if (this.getInventoryCount(itemType) > 0 && mouseX > 2 && mouseY >= 229 && mouseX < 112 && mouseY <= 240) {
                            let priceMod = this.shopSellPriceMod + this.shopItemPrice[this.shopSelectedItemIndex];

                            if (priceMod < 10) {
                                priceMod = 10;
                            }

                            let itemPrice = ((priceMod * GameData.itemBasePrice[itemType]) / 100) | 0;

                            this.clientStream.newPacket(C_OPCODES.SHOP_SELL);
                            this.clientStream.putShort(this.shopItem[this.shopSelectedItemIndex]);
                            this.clientStream.putInt(itemPrice);
                            this.clientStream.sendPacket();
                        }
                    }
                }
            } else {
                this.clientStream.newPacket(C_OPCODES.SHOP_CLOSE);
                this.clientStream.sendPacket();
                this.showDialogShop = false;
                return;
            }
        }

        let dialogX = 52;
        let dialogY = 44;

        this.surface.drawBox(dialogX, dialogY, 408, 12, 192);
        this.surface.drawBoxAlpha(dialogX, dialogY + 12, 408, 17, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX, dialogY + 29, 8, 170, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 399, dialogY + 29, 9, 170, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX, dialogY + 199, 408, 47, 0x989898, 160);
        this.surface.drawString('Buying and selling items', dialogX + 1, dialogY + 10, 1, 0xffffff);
        let colour = 0xffffff;

        if (this.mouseX > dialogX + 320 && this.mouseY >= dialogY && this.mouseX < dialogX + 408 && this.mouseY < dialogY + 12) {
            colour = 0xff0000;
        }

        this.surface.drawStringRight('Close window', dialogX + 406, dialogY + 10, 1, colour);
        this.surface.drawString('Shops stock in green', dialogX + 2, dialogY + 24, 1, 65280);
        this.surface.drawString('Number you own in blue', dialogX + 135, dialogY + 24, 1, 65535);
        this.surface.drawString('Your money: ' + this.getInventoryCount(10) + 'gp', dialogX + 280, dialogY + 24, 1, 0xffff00);
        let itemIndex = 0;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                let slotX = dialogX + 7 + col * 49;
                let slotY = dialogY + 28 + row * 34;

                if (this.shopSelectedItemIndex === itemIndex) {
                    this.surface.drawBoxAlpha(slotX, slotY, 49, 34, 0xff0000, 160);
                } else {
                    this.surface.drawBoxAlpha(slotX, slotY, 49, 34, 0xd0d0d0, 160);
                }

                this.surface.drawBoxEdge(slotX, slotY, 50, 35, 0);

                if (this.shopItem[itemIndex] !== -1) {
                    this.surface._spriteClipping_from9(slotX, slotY, 48, 32, this.spriteItem + GameData.itemPicture[this.shopItem[itemIndex]], GameData.itemMask[this.shopItem[itemIndex]], 0, 0, false);
                    this.surface.drawString(this.shopItemCount[itemIndex].toString(), slotX + 1, slotY + 10, 1, 65280);
                    this.surface.drawStringRight(this.getInventoryCount(this.shopItem[itemIndex]).toString(), slotX + 47, slotY + 10, 1, 65535);
                }

                itemIndex++;
            }

        }

        this.surface.drawLineHoriz(dialogX + 5, dialogY + 222, 398, 0);

        if (this.shopSelectedItemIndex === -1) {
            this.surface.drawStringCenter('Select an object to buy or sell', dialogX + 204, dialogY + 214, 3, 0xffff00);
            return;
        }

        let selectedItemType = this.shopItem[this.shopSelectedItemIndex];

        if (selectedItemType !== -1) {
            if (this.shopItemCount[this.shopSelectedItemIndex] > 0) {
                let priceMod = this.shopBuyPriceMod + this.shopItemPrice[this.shopSelectedItemIndex];

                if (priceMod < 10) {
                    priceMod = 10;
                }

                let itemPrice = ((priceMod * GameData.itemBasePrice[selectedItemType]) / 100) | 0;
                this.surface.drawString('Buy a new ' + GameData.itemName[selectedItemType] + ' for ' + itemPrice + 'gp', dialogX + 2, dialogY + 214, 1, 0xffff00);

                colour = 0xffffff;
                if (this.mouseX > dialogX + 298 && this.mouseY >= dialogY + 204 && this.mouseX < dialogX + 408 && this.mouseY <= dialogY + 215) {
                    colour = 0xff0000;
                }

                this.surface.drawStringRight('Click here to buy', dialogX + 405, dialogY + 214, 3, colour);
            } else {
                this.surface.drawStringCenter('This item is not currently available to buy', dialogX + 204, dialogY + 214, 3, 0xffff00);
            }

            if (this.getInventoryCount(selectedItemType) > 0) {
                let priceMod = this.shopSellPriceMod + this.shopItemPrice[this.shopSelectedItemIndex];

                if (priceMod < 10) {
                    priceMod = 10;
                }

                let itemPrice = ((priceMod * GameData.itemBasePrice[selectedItemType]) / 100) | 0;

                this.surface.drawStringRight('Sell your ' + GameData.itemName[selectedItemType] + ' for ' + itemPrice + 'gp', dialogX + 405, dialogY + 239, 1, 0xffff00);

                colour = 0xffffff;

                if (this.mouseX > dialogX + 2 && this.mouseY >= dialogY + 229 && this.mouseX < dialogX + 112 && this.mouseY <= dialogY + 240) {
                    colour = 0xff0000;
                }

                this.surface.drawString('Click here to sell', dialogX + 2, dialogY + 239, 3, colour);
                return;
            }

            this.surface.drawStringCenter('You do not have any of this item to sell', dialogX + 204, dialogY + 239, 3, 0xffff00);
        }
    }

    hasInventoryItems(id, mincount) {
        if (id === 31 && (this.isItemEquipped(197) || this.isItemEquipped(615) || this.isItemEquipped(682))) {
            return true;
        }

        if (id === 32 && (this.isItemEquipped(102) || this.isItemEquipped(616) || this.isItemEquipped(683))) {
            return true;
        }

        if (id === 33 && (this.isItemEquipped(101) || this.isItemEquipped(617) || this.isItemEquipped(684))) {
            return true;
        }

        if (id === 34 && (this.isItemEquipped(103) || this.isItemEquipped(618) || this.isItemEquipped(685))) {
            return true;
        }

        return this.getInventoryCount(id) >= mincount;
    }

    getHostnameIP(i) {
        return Utility.ipToString(i);
    }

    cantLogout() {
        this.logoutTimeout = 0;
        this.showMessage('@cya@Sorry, you can\'t logout at the moment', 3);
    }

    drawGame() {
        if (this.deathScreenTimeout !== 0) {
            this.surface.fadeToBlack();
            this.surface.drawStringCenter('Oh dear! You are dead...', (this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, 7, 0xff0000);
            this.drawChatMessageTabs();
            this.surface.draw(this.graphics, 0, 0);

            return;
        }

        if (this.showAppearanceChange) {
            this.drawAppearancePanelCharacterSprites();
            return;
        }

        if (this.isSleeping) {
            this.surface.fadeToBlack();

            if (Math.random() < 0.14999999999999999) {
                this.surface.drawStringCenter('ZZZ', (Math.random() * 80) | 0, (Math.random() * 334) | 0, 5, (Math.random() * 16777215) | 0);
            }

            if (Math.random() < 0.14999999999999999) {
                this.surface.drawStringCenter('ZZZ', 512 - ((Math.random() * 80) | 0), (Math.random() * 334) | 0, 5, (Math.random() * 16777215) | 0);
            }

            this.surface.drawBox(((this.gameWidth / 2) | 0) - 100, 160, 200, 40, 0);
            this.surface.drawStringCenter('You are sleeping', (this.gameWidth / 2) | 0, 50, 7, 0xffff00);
            this.surface.drawStringCenter('Fatigue: ' + (((this.fatigueSleeping * 100) / 750) | 0) + '%', (this.gameWidth / 2) | 0, 90, 7, 0xffff00);
            this.surface.drawStringCenter('When you want to wake up just use your', (this.gameWidth / 2) | 0, 140, 5, 0xffffff);
            this.surface.drawStringCenter('keyboard to type the word in the box below', (this.gameWidth / 2) | 0, 160, 5, 0xffffff);
            this.surface.drawStringCenter(this.inputTextCurrent + '*', (this.gameWidth / 2) | 0, 180, 5, 65535);

            if (this.sleepingStatusText === null) {
                this.surface._drawSprite_from3(((this.gameWidth / 2) | 0) - 127, 230, this.spriteTexture + 1);
            } else {
                this.surface.drawStringCenter(this.sleepingStatusText, (this.gameWidth / 2) | 0, 260, 5, 0xff0000);
            }

            this.surface.drawBoxEdge(((this.gameWidth / 2) | 0) - 128, 229, 257, 42, 0xffffff);
            this.drawChatMessageTabs();
            this.surface.drawStringCenter('If you can\'t read the word', (this.gameWidth / 2) | 0, 290, 1, 0xffffff);
            this.surface.drawStringCenter('@yel@click here@whi@ to get a different one', (this.gameWidth / 2) | 0, 305, 1, 0xffffff);
            this.surface.draw(this.graphics, 0, 0);

            return;
        }

        if (!this.world.playerAlive) {
            return;
        }

        for (let i = 0; i < 64; i++) {
            this.scene.removeModel(this.world.roofModels[this.lastHeightOffset][i]);

            if (this.lastHeightOffset === 0) {
                this.scene.removeModel(this.world.wallModels[1][i]);
                this.scene.removeModel(this.world.roofModels[1][i]);
                this.scene.removeModel(this.world.wallModels[2][i]);
                this.scene.removeModel(this.world.roofModels[2][i]);
            }

            this.fogOfWar = true;

            if (this.lastHeightOffset === 0 && (this.world.objectAdjacency.get((this.localPlayer.currentX / 128) | 0, (this.localPlayer.currentY / 128) | 0) & 128) === 0) {
                this.scene.addModel(this.world.roofModels[this.lastHeightOffset][i]);

                if (this.lastHeightOffset === 0) {
                    this.scene.addModel(this.world.wallModels[1][i]);
                    this.scene.addModel(this.world.roofModels[1][i]);
                    this.scene.addModel(this.world.wallModels[2][i]);
                    this.scene.addModel(this.world.roofModels[2][i]);
                }

                this.fogOfWar = false;
            }
        }

        if (this.objectAnimationNumberFireLightningSpell !== this.lastObjectAnimationNumberFireLightningSpell) {
            this.lastObjectAnimationNumberFireLightningSpell = this.objectAnimationNumberFireLightningSpell;

            for (let j = 0; j < this.objectCount; j++) {
                if (this.objectId[j] === 97) {
                    this.updateObjectAnimation(j, 'firea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 274) {
                    this.updateObjectAnimation(j, 'fireplacea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1031) {
                    this.updateObjectAnimation(j, 'lightning' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1036) {
                    this.updateObjectAnimation(j, 'firespell' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1147) {
                    this.updateObjectAnimation(j, 'spellcharge' + (this.objectAnimationNumberFireLightningSpell + 1));
                }
            }
        }

        if (this.objectAnimationNumberTorch !== this.lastObjectAnimationNumberTorch) {
            this.lastObjectAnimationNumberTorch = this.objectAnimationNumberTorch;

            for (let k = 0; k < this.objectCount; k++) {
                if (this.objectId[k] === 51) {
                    this.updateObjectAnimation(k, 'torcha' + (this.objectAnimationNumberTorch + 1));
                }

                if (this.objectId[k] === 143) {
                    this.updateObjectAnimation(k, 'skulltorcha' + (this.objectAnimationNumberTorch + 1));
                }
            }
        }

        if (this.objectAnimationNumberClaw !== this.lastObjectAnimationNumberClaw) {
            this.lastObjectAnimationNumberClaw = this.objectAnimationNumberClaw;

            for (let l = 0; l < this.objectCount; l++) {
                if (this.objectId[l] === 1142) {
                    this.updateObjectAnimation(l, 'clawspell' + (this.objectAnimationNumberClaw + 1));
                }
            }

        }

        this.scene.reduceSprites(this.spriteCount);
        this.spriteCount = 0;

        for (let i = 0; i < this.playerCount; i++) {
            let character = this.players[i];

            if (character.colourBottom !== 255) {
                let x = character.currentX;
                let y = character.currentY;
                let elev = -this.world.getElevation(x, y);
                let id = this.scene.addSprite(5000 + i, x, elev, y, 145, 220, i + 10000);

                this.spriteCount++;

                if (character === this.localPlayer) {
                    this.scene.setLocalPlayer(id);
                }

                if (character.animationCurrent === 8) {
                    this.scene.setSpriteTranslateX(id, -30);
                }

                if (character.animationCurrent === 9) {
                    this.scene.setSpriteTranslateX(id, 30);
                }
            }
        }

        for (let i = 0; i < this.playerCount; i++) {
            let player = this.players[i];

            if (player.projectileRange > 0) {
                let character = null;

                if (player.attackingNpcServerIndex !== -1) {
                    character = this.npcsServer[player.attackingNpcServerIndex];
                } else if (player.attackingPlayerServerIndex !== -1) {
                    character = this.playerServer[player.attackingPlayerServerIndex];
                }

                if (character !== null) {
                    let sx = player.currentX;
                    let sy = player.currentY;
                    let selev = -this.world.getElevation(sx, sy) - 110;
                    let dx = character.currentX;
                    let dy = character.currentY;
                    let delev = -((this.world.getElevation(dx, dy) - GameData.npcHeight[character.npcId] / 2) | 0);
                    let rx = ((sx * player.projectileRange + dx * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    let rz = ((selev * player.projectileRange + delev * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    let ry = ((sy * player.projectileRange + dy * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;

                    this.scene.addSprite(this.spriteProjectile + player.incomingProjectileSprite, rx, rz, ry, 32, 32, 0);
                    this.spriteCount++;
                }
            }
        }

        for (let i = 0; i < this.npcCount; i++) {
            let character_3 = this.npcs[i];
            let i3 = character_3.currentX;
            let j4 = character_3.currentY;
            let i7 = -this.world.getElevation(i3, j4);
            let i9 = this.scene.addSprite(20000 + i, i3, i7, j4, GameData.npcWidth[character_3.npcId], GameData.npcHeight[character_3.npcId], i + 30000);

            this.spriteCount++;

            if (character_3.animationCurrent === 8) {
                this.scene.setSpriteTranslateX(i9, -30);
            }

            if (character_3.animationCurrent === 9) {
                this.scene.setSpriteTranslateX(i9, 30);
            }
        }

        for (let i = 0; i < this.groundItemCount; i++) {
            let x = this.groundItemX[i] * this.magicLoc + 64;
            let y = this.groundItemY[i] * this.magicLoc + 64;

            this.scene.addSprite(40000 + this.groundItemId[i], x, -this.world.getElevation(x, y) - this.groundItemZ[i], y, 96, 64, i + 20000);
            this.spriteCount++;
        }

        for (let i = 0; i < this.teleportBubbleCount; i++) {
            let l4 = this.teleportBubbleX[i] * this.magicLoc + 64;
            let j7 = this.teleportBubbleY[i] * this.magicLoc + 64;
            let j9 = this.teleportBubbleType[i];

            if (j9 === 0) {
                this.scene.addSprite(50000 + i, l4, -this.world.getElevation(l4, j7), j7, 128, 256, i + 50000);
                this.spriteCount++;
            }

            if (j9 === 1) {
                this.scene.addSprite(50000 + i, l4, -this.world.getElevation(l4, j7), j7, 128, 64, i + 50000);
                this.spriteCount++;
            }
        }

        this.surface.interlace = false;
        this.surface.blackScreen();
        this.surface.interlace = this.interlace;

        if (this.lastHeightOffset === 3) {
            let i5 = 40 + ((Math.random() * 3) | 0);
            let k7 = 40 + ((Math.random() * 7) | 0);

            this.scene._setLight_from5(i5, k7, -50, -10, -50);
        }

        this.itemsAboveHeadCount = 0;
        this.receivedMessagesCount = 0;
        this.healthBarCount = 0;

        if (this.cameraAutoAngleDebug) {
            if (this.optionCameraModeAuto && !this.fogOfWar) {
                let j5 = this.cameraAngle;

                this.autorotateCamera();

                if (this.cameraAngle !== j5) {
                    this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                    this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
                }
            }

            this.scene.clipFar3d = 3000;
            this.scene.clipFar2d = 3000;
            this.scene.fogZFalloff = 1;
            this.scene.fogZDistance = 2800;
            this.cameraRotation = this.cameraAngle * 32;

            let x = this.cameraAutoRotatePlayerX + this.cameraRotationX;
            let y = this.cameraAutoRotatePlayerY + this.cameraRotationY;

            this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, this.cameraRotation * 4, 0, 2000);
        } else {
            if (this.optionCameraModeAuto && !this.fogOfWar) {
                this.autorotateCamera();
            }

            if (!this.interlace) {
                this.scene.clipFar3d = 2400;
                this.scene.clipFar2d = 2400;
                this.scene.fogZFalloff = 1;
                this.scene.fogZDistance = 2300;
            } else {
                this.scene.clipFar3d = 2200;
                this.scene.clipFar2d = 2200;
                this.scene.fogZFalloff = 1;
                this.scene.fogZDistance = 2100;
            }

            let x = this.cameraAutoRotatePlayerX + this.cameraRotationX;
            let y = this.cameraAutoRotatePlayerY + this.cameraRotationY;

            this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, this.cameraRotation * 4, 0, this.cameraZoom * 2);
        }

        this.scene.render();
        this.drawAboveHeadStuff();

        if (this.mouseClickXStep > 0) {
            this.surface._drawSprite_from3(this.mouseClickXX - 8, this.mouseClickXY - 8, this.spriteMedia + 14 + (((24 - this.mouseClickXStep) / 6) | 0));
        }

        if (this.mouseClickXStep < 0) {
            this.surface._drawSprite_from3(this.mouseClickXX - 8, this.mouseClickXY - 8, this.spriteMedia + 18 + (((24 + this.mouseClickXStep) / 6) | 0));
        }

        if (this.systemUpdate !== 0) {
            let i6 = ((this.systemUpdate / 50) | 0);
            let j8 = (i6 / 60) | 0;

            i6 %= 60;

            if (i6 < 10) {
                this.surface.drawStringCenter('System update in: ' + j8 + ':0' + i6, 256, this.gameHeight - 7, 1, 0xffff00);
            } else {
                this.surface.drawStringCenter('System update in: ' + j8 + ':' + i6, 256, this.gameHeight - 7, 1, 0xffff00);
            }
        }

        if (!this.loadingArea) {
            let j6 = 2203 - (this.localRegionY + this.planeHeight + this.regionY);

            if (this.localRegionX + this.planeWidth + this.regionX >= 2640) {
                j6 = -50;
            }

            if (j6 > 0) {
                let wildlvl = 1 + ((j6 / 6) | 0);

                this.surface._drawSprite_from3(453, this.gameHeight - 56, this.spriteMedia + 13);
                this.surface.drawStringCenter('Wilderness', 465, this.gameHeight - 20, 1, 0xffff00);
                this.surface.drawStringCenter('Level: ' + wildlvl, 465, this.gameHeight - 7, 1, 0xffff00);

                if (this.showUiWildWarn === 0) {
                    this.showUiWildWarn = 2;
                }
            }

            if (this.showUiWildWarn === 0 && j6 > -10 && j6 <= 0) {
                this.showUiWildWarn = 1;
            }
        }

        if (this.messageTabSelected === 0) {
            for (let k6 = 0; k6 < 5; k6++) {
                if (this.messageHistoryTimeout[k6] > 0) {
                    let s = this.messageHistory[k6];
                    this.surface.drawString(s, 7, this.gameHeight - 18 - k6 * 12, 1, 0xffff00);
                }
            }
        }

        this.panelMessageTabs.hide(this.controlTextListChat);
        this.panelMessageTabs.hide(this.controlTextListQuest);
        this.panelMessageTabs.hide(this.controlTextListPrivate);

        if (this.messageTabSelected === 1) {
            this.panelMessageTabs.show(this.controlTextListChat);
        } else if (this.messageTabSelected === 2) {
            this.panelMessageTabs.show(this.controlTextListQuest);
        } else if (this.messageTabSelected === 3) {
            this.panelMessageTabs.show(this.controlTextListPrivate);
        }

        Panel.textListEntryHeightMod = 2;
        this.panelMessageTabs.drawPanel();
        Panel.textListEntryHeightMod = 0;
        this.surface._drawSpriteAlpha_from4(this.surface.width2 - 3 - 197, 3, this.spriteMedia, 128);
        this.drawUi();
        this.surface.loggedIn = false;
        this.drawChatMessageTabs();
        this.surface.draw(this.graphics, 0, 0);
    }

    async loadSounds() {
        try {
            this.soundData = await this.readDataFile('sounds' + VERSION.SOUNDS + '.mem', 'Sound effects', 90);
            this.audioPlayer = new StreamAudioPlayer();
        } catch (e) {
            console.log('Unable to init sounds:' + e.message);
            console.error(e);
        }
    }

    isItemEquipped(i) {
        for (let j = 0; j < this.inventoryItemsCount; j++) {
            if (this.inventoryItemId[j] === i && this.inventoryEquipped[j] === 1) {
                return true;
            }
        }

        return false;
    }

    async loadEntities() {
        let entityBuff = null;
        let indexDat = null;

        entityBuff = await this.readDataFile('entity' + VERSION.ENTITY + '.jag', 'people and monsters', 30);

        if (entityBuff === null) {
            this.errorLoadingData = true;
            return;
        }

        indexDat = Utility.loadData('index.dat', 0, entityBuff);

        let entityBuffMem = null;
        let indexDatMem = null;

        if (this.members) {
            entityBuffMem = await this.readDataFile('entity' + VERSION.ENTITY + '.mem', 'member graphics', 45);

            if (entityBuffMem === null) {
                this.errorLoadingData = true;
                return;
            }

            indexDatMem = Utility.loadData('index.dat', 0, entityBuffMem);
        }

        let frameCount = 0;

        this.anInt659 = 0;
        this.anInt660 = this.anInt659;

        label0:
        for (let j = 0; j < GameData.animationCount; j++) {
            let s = GameData.animationName[j];

            for (let k = 0; k < j; k++) {
                if (GameData.animationName[k].toLowerCase() !== s.toLowerCase()) {
                    continue;
                }

                GameData.animationNumber[j] = GameData.animationNumber[k];
                continue label0;
            }

            let abyte7 = Utility.loadData(s + '.dat', 0, entityBuff);
            let abyte4 = indexDat;

            if (abyte7 === null && this.members) {
                abyte7 = Utility.loadData(s + '.dat', 0, entityBuffMem);
                abyte4 = indexDatMem;
            }

            if (abyte7 !== null) {
                this.surface.parseSprite(this.anInt660, abyte7, abyte4, 15);

                frameCount += 15;

                if (GameData.animationHasA[j] === 1) {
                    let aDat = Utility.loadData(s + 'a.dat', 0, entityBuff);
                    let aIndexDat = indexDat;

                    if (aDat === null && this.members) {
                        aDat = Utility.loadData(s + 'a.dat', 0, entityBuffMem);
                        aIndexDat = indexDatMem;
                    }

                    this.surface.parseSprite(this.anInt660 + 15, aDat, aIndexDat, 3);
                    frameCount += 3;
                }

                if (GameData.animationHasF[j] === 1) {
                    let fDat = Utility.loadData(s + 'f.dat', 0, entityBuff);
                    let fDatIndex = indexDat;

                    if (fDat === null && this.members) {
                        fDat = Utility.loadData(s + 'f.dat', 0, entityBuffMem);
                        fDatIndex = indexDatMem;
                    }

                    this.surface.parseSprite(this.anInt660 + 18, fDat, fDatIndex, 9);
                    frameCount += 9;
                }

                if (GameData.animationSomething[j] !== 0) {
                    for (let l = this.anInt660; l < this.anInt660 + 27; l++) {
                        this.surface.loadSprite(l);
                    }
                }
            }

            GameData.animationNumber[j] = this.anInt660;
            this.anInt660 += 27;
        }

        console.log('Loaded: ' + frameCount + ' frames of animation');
    }

    handleAppearancePanelControls() {
        this.panelAppearance.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown);

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHead1)) {
            do {
                this.appearanceHeadType = ((this.appearanceHeadType - 1) + GameData.animationCount) % GameData.animationCount;
            } while ((GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHead2)) {
            do {
                this.appearanceHeadType = (this.appearanceHeadType + 1) % GameData.animationCount;
            } while ((GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHair1)) {
            this.appearanceHairColour = ((this.appearanceHairColour - 1) + this.characterHairColours.length) % this.characterHairColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHair2)) {
            this.appearanceHairColour = (this.appearanceHairColour + 1) % this.characterHairColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceGender1) || this.panelAppearance.isClicked(this.controlButtonAppearanceGender2)) {
            for (this.appearanceHeadGender = 3 - this.appearanceHeadGender; (GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0; this.appearanceHeadType = (this.appearanceHeadType + 1) % GameData.animationCount);
            for (; (GameData.animationSomething[this.appearanceBodyGender] & 3) !== 2 || (GameData.animationSomething[this.appearanceBodyGender] & 4 * this.appearanceHeadGender) === 0; this.appearanceBodyGender = (this.appearanceBodyGender + 1) % GameData.animationCount);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceTop1)) {
            this.appearanceTopColour = ((this.appearanceTopColour - 1) + this.characterTopBottomColours.length) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceTop2)) {
            this.appearanceTopColour = (this.appearanceTopColour + 1) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkin1)) {
            this.appearanceSkinColour = ((this.appearanceSkinColour - 1) + this.characterSkinColours.length) % this.characterSkinColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkin2)) {
            this.appearanceSkinColour = (this.appearanceSkinColour + 1) % this.characterSkinColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceBottom1)) {
            this.appearanceBottomColour = ((this.appearanceBottomColour - 1) + this.characterTopBottomColours.length) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceBottom2)) {
            this.appearanceBottomColour = (this.appearanceBottomColour + 1) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceAccept)) {
            this.clientStream.newPacket(C_OPCODES.APPEARANCE);
            this.clientStream.putByte(this.appearanceHeadGender);
            this.clientStream.putByte(this.appearanceHeadType);
            this.clientStream.putByte(this.appearanceBodyGender);
            this.clientStream.putByte(this.appearance2Colour);
            this.clientStream.putByte(this.appearanceHairColour);
            this.clientStream.putByte(this.appearanceTopColour);
            this.clientStream.putByte(this.appearanceBottomColour);
            this.clientStream.putByte(this.appearanceSkinColour);
            this.clientStream.sendPacket();
            this.surface.blackScreen();
            this.showAppearanceChange = false;
        }
    }

    draw() {
        if (this.errorLoadingData) {
            let g = this.getGraphics();

            g.setColor(Color.black);
            g.fillRect(0, 0, 512, 356);
            g.setFont(new Font('Helvetica', 1, 16));
            g.setColor(Color.yellow);

            let i = 35;

            g.drawString('Sorry, an error has occured whilst loading RuneScape', 30, i);
            i += 50;
            g.setColor(Color.white);
            g.drawString('To fix this try the following (in order):', 30, i);
            i += 50;
            g.setColor(Color.white);
            g.setFont(new Font('Helvetica', 1, 12));
            g.drawString('1: Try closing ALL open web-browser windows, and reloading', 30, i);
            i += 30;
            g.drawString('2: Try clearing your web-browsers cache from tools->internet options', 30, i);
            i += 30;
            g.drawString('3: Try using a different game-world', 30, i);
            i += 30;
            g.drawString('4: Try rebooting your computer', 30, i);
            i += 30;
            g.drawString('5: Try selecting a different version of Java from the play-game menu', 30, i);

            this.setTargetFps(1);

            return;
        }

        if (this.errorLoadingCodebase) {
            let g1 = this.getGraphics();

            g1.setColor(Color.black);
            g1.fillRect(0, 0, 512, 356);
            g1.setFont(new Font('Helvetica', 1, 20));
            g1.setColor(Color.white);
            g1.drawString('Error - unable to load game!', 50, 50);
            g1.drawString('To play RuneScape make sure you play from', 50, 100);
            g1.drawString('http://www.runescape.com', 50, 150);

            this.setTargetFps(1);

            return;
        }

        if (this.errorLoadingMemory) {
            let g2 = this.getGraphics();

            g2.setColor(Color.black);
            g2.fillRect(0, 0, 512, 356);
            g2.setFont(new Font('Helvetica', 1, 20));
            g2.setColor(Color.white);
            g2.drawString('Error - out of memory!', 50, 50);
            g2.drawString('Close ALL unnecessary programs', 50, 100);
            g2.drawString('and windows before loading the game', 50, 150);
            g2.drawString('RuneScape needs about 48meg of spare RAM', 50, 200);

            this.setTargetFps(1);

            return;
        }

        try {
            if (this.loggedIn === 0) {
                this.surface.loggedIn = false;
                this.drawLoginScreens();
            }

            if (this.loggedIn === 1) {
                this.surface.loggedIn = true;
                this.drawGame();

                return;
            }
        } catch (e) {
            // OutOfMemory 
            console.error(e);
            this.disposeAndCollect();
            this.errorLoadingMemory = true;
        }
    }

    onClosing() {
        this.closeConnection();
        this.disposeAndCollect();

        if (this.audioPlayer !== null) {
            this.audioPlayer.stopPlayer();
        }
    }

    drawDialogDuelConfirm() {
        let dialogX = 22;
        let dialogY = 36;
 
        this.surface.drawBox(dialogX, dialogY, 468, 16, 192);
        this.surface.drawBoxAlpha(dialogX, dialogY + 16, 468, 246, 0x989898, 160);
        this.surface.drawStringCenter('Please confirm your duel with @yel@' + Utility.hashToUsername(this.duelOpponentNameHash), dialogX + 234, dialogY + 12, 1, 0xffffff);
        this.surface.drawStringCenter('Your stake:', dialogX + 117, dialogY + 30, 1, 0xffff00);

        for (let itemIndex = 0; itemIndex < this.duelItemsCount; itemIndex++) {
            let s = GameData.itemName[this.duelItems[itemIndex]];

            if (GameData.itemStackable[this.duelItems[itemIndex]] === 0) {
                s = s + ' x ' + mudclient.formatNumber(this.duelItemCount[itemIndex]);
            }

            this.surface.drawStringCenter(s, dialogX + 117, dialogY + 42 + itemIndex * 12, 1, 0xffffff);
        }

        if (this.duelItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 117, dialogY + 42, 1, 0xffffff);
        }

        this.surface.drawStringCenter('Your opponent\'s stake:', dialogX + 351, dialogY + 30, 1, 0xffff00);

        for (let itemIndex = 0; itemIndex < this.duelOpponentItemsCount; itemIndex++) {
            let s1 = GameData.itemName[this.duelOpponentItems[itemIndex]];

            if (GameData.itemStackable[this.duelOpponentItems[itemIndex]] === 0) {
                s1 = s1 + ' x ' + mudclient.formatNumber(this.duelOpponentItemCount[itemIndex]);
            }

            this.surface.drawStringCenter(s1, dialogX + 351, dialogY + 42 + itemIndex * 12, 1, 0xffffff);
        }

        if (this.duelOpponentItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 351, dialogY + 42, 1, 0xffffff);
        }

        if (this.duelOptionRetreat === 0) {
            this.surface.drawStringCenter('You can retreat from this duel', dialogX + 234, dialogY + 180, 1, 65280);
        } else {
            this.surface.drawStringCenter('No retreat is possible!', dialogX + 234, dialogY + 180, 1, 0xff0000);
        }

        if (this.duelOptionMagic === 0) {
            this.surface.drawStringCenter('Magic may be used', dialogX + 234, dialogY + 192, 1, 65280);
        } else {
            this.surface.drawStringCenter('Magic cannot be used', dialogX + 234, dialogY + 192, 1, 0xff0000);
        }

        if (this.duelOptionPrayer === 0) {
            this.surface.drawStringCenter('Prayer may be used', dialogX + 234, dialogY + 204, 1, 65280);
        } else {
            this.surface.drawStringCenter('Prayer cannot be used', dialogX + 234, dialogY + 204, 1, 0xff0000);
        }

        if (this.duelOptionWeapons === 0) {
            this.surface.drawStringCenter('Weapons may be used', dialogX + 234, dialogY + 216, 1, 65280);
        } else {
            this.surface.drawStringCenter('Weapons cannot be used', dialogX + 234, dialogY + 216, 1, 0xff0000);
        }

        this.surface.drawStringCenter('If you are sure click \'Accept\' to begin the duel', dialogX + 234, dialogY + 230, 1, 0xffffff);

        if (!this.duelAccepted) {
            this.surface._drawSprite_from3((dialogX + 118) - 35, dialogY + 238, this.spriteMedia + 25);
            this.surface._drawSprite_from3((dialogX + 352) - 35, dialogY + 238, this.spriteMedia + 26);
        } else {
            this.surface.drawStringCenter('Waiting for other player...', dialogX + 234, dialogY + 250, 1, 0xffff00);
        }

        if (this.mouseButtonClick === 1) {
            if (this.mouseX < dialogX || this.mouseY < dialogY || this.mouseX > dialogX + 468 || this.mouseY > dialogY + 262) {
                this.showDialogDuelConfirm = false;
                this.clientStream.newPacket(C_OPCODES.TRADE_DECLINE);
                this.clientStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 118) - 35 && this.mouseX <= dialogX + 118 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.duelAccepted = true;
                this.clientStream.newPacket(C_OPCODES.DUEL_CONFIRM_ACCEPT);
                this.clientStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 352) - 35 && this.mouseX <= dialogX + 353 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.showDialogDuelConfirm = false;
                this.clientStream.newPacket(C_OPCODES.DUEL_DECLINE);
                this.clientStream.sendPacket();
            }

            this.mouseButtonClick = 0;
        }
    }

    walkToGroundItem(i, j, k, l, walkToAction) {
        if (this.walkTo(i, j, k, l, k, l, false, walkToAction)) {
            return;
        } else {
            this._walkToActionSource_from8(i, j, k, l, k, l, true, walkToAction);
            return;
        }
    }

    async loadModels() {
        GameData.getModelIndex('torcha2');
        GameData.getModelIndex('torcha3');
        GameData.getModelIndex('torcha4');
        GameData.getModelIndex('skulltorcha2');
        GameData.getModelIndex('skulltorcha3');
        GameData.getModelIndex('skulltorcha4');
        GameData.getModelIndex('firea2');
        GameData.getModelIndex('firea3');
        GameData.getModelIndex('fireplacea2');
        GameData.getModelIndex('fireplacea3');
        GameData.getModelIndex('firespell2');
        GameData.getModelIndex('firespell3');
        GameData.getModelIndex('lightning2');
        GameData.getModelIndex('lightning3');
        GameData.getModelIndex('clawspell2');
        GameData.getModelIndex('clawspell3');
        GameData.getModelIndex('clawspell4');
        GameData.getModelIndex('clawspell5');
        GameData.getModelIndex('spellcharge2');
        GameData.getModelIndex('spellcharge3');

        let abyte0 = await this.readDataFile('models' + VERSION.MODELS + '.jag', '3d models', 60);

        if (abyte0 === null) {
            this.errorLoadingData = true;
            return;
        }

        for (let j = 0; j < GameData.modelCount; j++) {
            let k = Utility.getDataFileOffset(GameData.modelName[j] + '.ob3', abyte0);

            if (k !== 0) {
                this.gameModels[j] = GameModel._from3(abyte0, k, true);
            } else {
                this.gameModels[j] = GameModel._from2(1, 1);
            }

            if (GameData.modelName[j].toLowerCase() === 'giantcrystal') {
                this.gameModels[j].transparent = true;
            }
        }
    }

    drawDialogServermessage() {
        let width = 400;
        let height = 100;

        if (this.serverMessageBoxTop) {
            height = 450;
            height = 300;
        }

        this.surface.drawBox(256 - ((width / 2) | 0), 167 - ((height / 2) | 0), width, height, 0);
        this.surface.drawBoxEdge(256 - ((width / 2) | 0), 167 - ((height / 2) | 0), width, height, 0xffffff);
        this.surface.centrepara(this.serverMessage, 256, (167 - ((height / 2) | 0)) + 20, 1, 0xffffff, width - 40);

        let i = 157 + ((height / 2) | 0);
        let j = 0xffffff;

        if (this.mouseY > i - 12 && this.mouseY <= i && this.mouseX > 106 && this.mouseX < 406) {
            j = 0xff0000;
        }

        this.surface.drawStringCenter('Click here to close window', 256, i, 1, j);

        if (this.mouseButtonClick === 1) {
            if (j === 0xff0000) {
                this.showDialogServermessage = false;
            }

            if ((this.mouseX < 256 - ((width / 2) | 0) || this.mouseX > 256 + ((width / 2) | 0)) && (this.mouseY < 167 - ((height / 2) | 0) || this.mouseY > 167 + ((height / 2) | 0))) {
                this.showDialogServermessage = false;
            }
        }

        this.mouseButtonClick = 0;
    }

    drawDialogReportAbuseInput() {
        if (this.inputTextFinal.length > 0) {
            let s = this.inputTextFinal.trim();

            this.inputTextCurrent = '';
            this.inputTextFinal = '';

            if (s.length > 0) {
                let l = Utility.usernameToHash(s);

                this.clientStream.newPacket(C_OPCODES.REPORT_ABUSE);
                this.clientStream.putLong(l);
                this.clientStream.putByte(this.reportAbuseOffence);
                this.clientStream.putByte(this.reportAbuseMute ? 1 : 0);
                this.clientStream.sendPacket();
            }

            this.showDialogReportAbuseStep = 0;
            return;
        }

        this.surface.drawBox(56, 130, 400, 100, 0);
        this.surface.drawBoxEdge(56, 130, 400, 100, 0xffffff);

        let i = 160;

        this.surface.drawStringCenter('Now type the name of the offending player, and press enter', 256, i, 1, 0xffff00);
        i += 18;
        this.surface.drawStringCenter('Name: ' + this.inputTextCurrent + '*', 256, i, 4, 0xffffff);

        if (this.moderatorLevel > 0) {
            i = 207;

            if (this.reportAbuseMute) {
                this.surface.drawStringCenter('Moderator option: Mute player for 48 hours: <ON>', 256, i, 1, 0xff8000);
            } else {
                this.surface.drawStringCenter('Moderator option: Mute player for 48 hours: <OFF>', 256, i, 1, 0xffffff);
            }

            if (this.mouseX > 106 && this.mouseX < 406 && this.mouseY > i - 13 && this.mouseY < i + 2 && this.mouseButtonClick === 1) {
                this.mouseButtonClick = 0;
                this.reportAbuseMute = !this.reportAbuseMute;
            }
        }

        i = 222;

        let j = 0xffffff;

        if (this.mouseX > 196 && this.mouseX < 316 && this.mouseY > i - 13 && this.mouseY < i + 2) {
            j = 0xffff00;

            if (this.mouseButtonClick === 1) {
                this.mouseButtonClick = 0;
                this.showDialogReportAbuseStep = 0;
            }
        }

        this.surface.drawStringCenter('Click here to cancel', 256, i, 1, j);

        if (this.mouseButtonClick === 1 && (this.mouseX < 56 || this.mouseX > 456 || this.mouseY < 130 || this.mouseY > 230)) {
            this.mouseButtonClick = 0;
            this.showDialogReportAbuseStep = 0;
        }
    }

    showMessage(message, type) {
        if (type === 2 || type === 4 || type === 6) {
            for (; message.length > 5 && message[0] === '@' && message[4] === '@'; message = message.substring(5)) ;

            let j = message.indexOf(':');

            if (j !== -1) {
                let s1 = message.substring(0, j);
                let l = Utility.usernameToHash(s1);

                for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                    if (this.ignoreList[i1].equals(l)) {
                        return;
                    }
                }
            }
        }

        if (type === 2) {
            message = '@yel@' + message;
        }

        if (type === 3 || type === 4) {
            message = '@whi@' + message;
        }

        if (type === 6) {
            message = '@cya@' + message;
        }

        if (this.messageTabSelected !== 0) {
            if (type === 4 || type === 3) {
                this.messageTabFlashAll = 200;
            }

            if (type === 2 && this.messageTabSelected !== 1) {
                this.messageTabFlashHistory = 200;
            }

            if (type === 5 && this.messageTabSelected !== 2) {
                this.messageTabFlashQuest = 200;
            }

            if (type === 6 && this.messageTabSelected !== 3) {
                this.messageTabFlashPrivate = 200;
            }

            if (type === 3 && this.messageTabSelected !== 0) {
                this.messageTabSelected = 0;
            }

            if (type === 6 && this.messageTabSelected !== 3 && this.messageTabSelected !== 0) {
                this.messageTabSelected = 0;
            }
        }

        for (let k = 4; k > 0; k--) {
            this.messageHistory[k] = this.messageHistory[k - 1];
            this.messageHistoryTimeout[k] = this.messageHistoryTimeout[k - 1];
        }

        this.messageHistory[0] = message;
        this.messageHistoryTimeout[0] = 300;

        if (type === 2) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListChat] === this.panelMessageTabs.controlListEntryCount[this.controlTextListChat] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListChat, message, true);
            } else {
                this.panelMessageTabs.removeListEntry(this.controlTextListChat, message, false);
            }
        }

        if (type === 5) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListQuest] === this.panelMessageTabs.controlListEntryCount[this.controlTextListQuest] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListQuest, message, true);
            } else {
                this.panelMessageTabs.removeListEntry(this.controlTextListQuest, message, false);
            }
        }

        if (type === 6) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListPrivate] === this.panelMessageTabs.controlListEntryCount[this.controlTextListPrivate] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListPrivate, message, true);
                return;
            }

            this.panelMessageTabs.removeListEntry(this.controlTextListPrivate, message, false);
        }
    }

    walkToObject(x, y, id, index) {
        let w = 0;
        let h = 0;

        if (id === 0 || id === 4) {
            w = GameData.objectWidth[index];
            h = GameData.objectHeight[index];
        } else {
            h = GameData.objectWidth[index];
            w = GameData.objectHeight[index];
        }

        if (GameData.objectType[index] === 2 || GameData.objectType[index] === 3) {
            if (id === 0) {
                x--;
                w++;
            }

            if (id === 2) {
                h++;
            }

            if (id === 4) {
                w++;
            }

            if (id === 6) {
                y--;
                h++;
            }

            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + w) - 1, (y + h) - 1, false, true);
            return;
        } else {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + w) - 1, (y + h) - 1, true, true);
            return;
        }
    }

    getInventoryCount(id) {
        let count = 0;

        for (let k = 0; k < this.inventoryItemsCount; k++) {
            if (this.inventoryItemId[k] === id) {
                if (GameData.itemStackable[id] === 1) {
                    count++;
                } else {
                    count += this.inventoryItemStackCount[k];
                }
            }
        }

        return count;
    }

    drawLoginScreens() {
        this.welcomScreenAlreadyShown = false;
        this.surface.interlace = false;

        this.surface.blackScreen();

        if (this.loginScreen === 0 || this.loginScreen === 1 || this.loginScreen === 2 || this.loginScreen === 3) {
            let i = (this.loginTimer * 2) % 3072;

            if (i < 1024) {
                this.surface._drawSprite_from3(0, 10, this.spriteLogo);

                if (i > 768) {
                    this.surface._drawSpriteAlpha_from4(0, 10, this.spriteLogo + 1, i - 768);
                }
            } else if (i < 2048) {
                this.surface._drawSprite_from3(0, 10, this.spriteLogo + 1);

                if (i > 1792) {
                    this.surface._drawSpriteAlpha_from4(0, 10, this.spriteMedia + 10, i - 1792);
                }
            } else {
                this.surface._drawSprite_from3(0, 10, this.spriteMedia + 10);

                if (i > 2816) {
                    this.surface._drawSpriteAlpha_from4(0, 10, this.spriteLogo, i - 2816);
                }
            }
        }

        if (this.loginScreen === 0) {
            this.panelLoginWelcome.drawPanel();
        }

        if (this.loginScreen === 1) {
            this.panelLoginNewuser.drawPanel();
        }

        if (this.loginScreen === 2) {
            this.panelLoginExistinguser.drawPanel();
        }

        // blue bar
        this.surface._drawSprite_from3(0, this.gameHeight - 4, this.spriteMedia + 22); 
        this.surface.draw(this.graphics, 0, 0);
    }

    drawUiTabOptions(flag) {
        let uiX = this.surface.width2 - 199;
        let uiY = 36;

        this.surface._drawSprite_from3(uiX - 49, 3, this.spriteMedia + 6);

        let uiWidth = 196;

        this.surface.drawBoxAlpha(uiX, 36, uiWidth, 65, Surface.rgbToLong(181, 181, 181), 160);
        this.surface.drawBoxAlpha(uiX, 101, uiWidth, 65, Surface.rgbToLong(201, 201, 201), 160);
        this.surface.drawBoxAlpha(uiX, 166, uiWidth, 95, Surface.rgbToLong(181, 181, 181), 160);
        this.surface.drawBoxAlpha(uiX, 261, uiWidth, 40, Surface.rgbToLong(201, 201, 201), 160);

        let x = uiX + 3;
        let y = uiY + 15;

        this.surface.drawString('Game options - click to toggle', x, y, 1, 0);
        y += 15;

        if (this.optionCameraModeAuto) {
            this.surface.drawString('Camera angle mode - @gre@Auto', x, y, 1, 0xffffff);
        } else {
            this.surface.drawString('Camera angle mode - @red@Manual', x, y, 1, 0xffffff);
        }

        y += 15;

        if (this.optionMouseButtonOne) {
            this.surface.drawString('Mouse buttons - @red@One', x, y, 1, 0xffffff);
        } else {
            this.surface.drawString('Mouse buttons - @gre@Two', x, y, 1, 0xffffff);
        }

        y += 15;

        if (this.members) {
            if (this.optionSoundDisabled) {
                this.surface.drawString('Sound effects - @red@off', x, y, 1, 0xffffff);
            } else {
                this.surface.drawString('Sound effects - @gre@on', x, y, 1, 0xffffff);
            }
        }

        y += 15;
        this.surface.drawString('To change your contact details,', x, y, 0, 0xffffff);
        y += 15;
        this.surface.drawString('password, recovery questions, etc..', x, y, 0, 0xffffff);
        y += 15;
        this.surface.drawString('please select \'account management\'', x, y, 0, 0xffffff);
        y += 15;

        if (this.referid === 0) {
            this.surface.drawString('from the runescape.com front page', x, y, 0, 0xffffff);
        } else if (this.referid === 1) {
            this.surface.drawString('from the link below the gamewindow', x, y, 0, 0xffffff);
        } else {
            this.surface.drawString('from the runescape front webpage', x, y, 0, 0xffffff);
        }

        y += 15;
        y += 5;
        this.surface.drawString('Privacy settings. Will be applied to', uiX + 3, y, 1, 0);
        y += 15;
        this.surface.drawString('all people not on your friends list', uiX + 3, y, 1, 0);
        y += 15;

        if (this.settingsBlockChat === 0) {
            this.surface.drawString('Block chat messages: @red@<off>', uiX + 3, y, 1, 0xffffff);
        } else {
            this.surface.drawString('Block chat messages: @gre@<on>', uiX + 3, y, 1, 0xffffff);
        }

        y += 15;

        if (this.settingsBlockPrivate === 0) {
            this.surface.drawString('Block private messages: @red@<off>', uiX + 3, y, 1, 0xffffff);
        } else {
            this.surface.drawString('Block private messages: @gre@<on>', uiX + 3, y, 1, 0xffffff);
        }

        y += 15;

        if (this.settingsBlockTrade === 0) {
            this.surface.drawString('Block trade requests: @red@<off>', uiX + 3, y, 1, 0xffffff);
        } else {
            this.surface.drawString('Block trade requests: @gre@<on>', uiX + 3, y, 1, 0xffffff);
        }

        y += 15;

        if (this.members) {
            if (this.settingsBlockDuel === 0) {
                this.surface.drawString('Block duel requests: @red@<off>', uiX + 3, y, 1, 0xffffff);
            } else {
                this.surface.drawString('Block duel requests: @gre@<on>', uiX + 3, y, 1, 0xffffff);
            }
        }

        y += 15;
        y += 5;
        this.surface.drawString('Always logout when you finish', x, y, 1, 0);
        y += 15;
        let k1 = 0xffffff;

        if (this.mouseX > x && this.mouseX < x + uiWidth && this.mouseY > y - 12 && this.mouseY < y + 4) {
            k1 = 0xffff00;
        }

        this.surface.drawString('Click here to logout', uiX + 3, y, 1, k1);

        if (!flag) {
            return;
        }

        let mouseX = this.mouseX - (this.surface.width2 - 199);
        let mouseY = this.mouseY - 36;

        if (mouseX >= 0 && mouseY >= 0 && mouseX < 196 && mouseY < 265) {
            let l1 = this.surface.width2 - 199;
            let byte0 = 36;
            let c1 = 196;// '\304';
            let l = l1 + 3;
            let j1 = byte0 + 30;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.optionCameraModeAuto = !this.optionCameraModeAuto;
                this.clientStream.newPacket(C_OPCODES.SETTINGS_GAME);
                this.clientStream.putByte(0);
                this.clientStream.putByte(this.optionCameraModeAuto ? 1 : 0);
                this.clientStream.sendPacket();
            }

            j1 += 15;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.optionMouseButtonOne = !this.optionMouseButtonOne;
                this.clientStream.newPacket(C_OPCODES.SETTINGS_GAME);
                this.clientStream.putByte(2);
                this.clientStream.putByte(this.optionMouseButtonOne ? 1 : 0);
                this.clientStream.sendPacket();
            }

            j1 += 15;

            if (this.members && this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.optionSoundDisabled = !this.optionSoundDisabled;
                this.clientStream.newPacket(C_OPCODES.SETTINGS_GAME);
                this.clientStream.putByte(3);
                this.clientStream.putByte(this.optionSoundDisabled ? 1 : 0);
                this.clientStream.sendPacket();
            }

            j1 += 15;
            j1 += 15;
            j1 += 15;
            j1 += 15;
            j1 += 15;

            let flag1 = false;

            j1 += 35;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.settingsBlockChat = 1 - this.settingsBlockChat;
                flag1 = true;
            }

            j1 += 15;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.settingsBlockPrivate = 1 - this.settingsBlockPrivate;
                flag1 = true;
            }

            j1 += 15;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.settingsBlockTrade = 1 - this.settingsBlockTrade;
                flag1 = true;
            }

            j1 += 15;

            if (this.members && this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.settingsBlockDuel = 1 - this.settingsBlockDuel;
                flag1 = true;
            }

            j1 += 15;

            if (flag1) {
                this.sendPrivacySettings(this.settingsBlockChat, this.settingsBlockPrivate, this.settingsBlockTrade, this.settingsBlockDuel);
            }

            j1 += 20;

            if (this.mouseX > l && this.mouseX < l + c1 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseButtonClick === 1) {
                this.sendLogout();
            }

            this.mouseButtonClick = 0;
        }
    }

    async loadTextures() {
        let buffTextures = await this.readDataFile('textures' + VERSION.TEXTURES + '.jag', 'Textures', 50);

        if (buffTextures === null) {
            this.errorLoadingData = true;
            return;
        }

        let buffIndex = Utility.loadData('index.dat', 0, buffTextures);
        this.scene.allocateTextures(GameData.textureCount, 7, 11);

        for (let i = 0; i < GameData.textureCount; i++) {
            let name = GameData.textureName[i];

            let buff1 = Utility.loadData(name + '.dat', 0, buffTextures);

            this.surface.parseSprite(this.spriteTexture, buff1, buffIndex, 1);
            this.surface.drawBox(0, 0, 128, 128, 0xff00ff);
            this.surface._drawSprite_from3(0, 0, this.spriteTexture);

            let wh = this.surface.spriteWidthFull[this.spriteTexture];
            let nameSub = GameData.textureSubtypeName[i];

            if (nameSub !== null && nameSub.length > 0) {
                let buff2 = Utility.loadData(nameSub + '.dat', 0, buffTextures);

                this.surface.parseSprite(this.spriteTexture, buff2, buffIndex, 1);
                this.surface._drawSprite_from3(0, 0, this.spriteTexture);
            }

            this.surface._drawSprite_from5(this.spriteTextureWorld + i, 0, 0, wh, wh);

            let area = wh * wh;

            for (let j = 0; j < area; j++) {
                if (this.surface.surfacePixels[this.spriteTextureWorld + i][j] === 65280) {
                    this.surface.surfacePixels[this.spriteTextureWorld + i][j] = 0xff00ff;
                }
            }

            this.surface.drawWorld(this.spriteTextureWorld + i);
            this.scene.defineTexture(i, this.surface.spriteColoursUsed[this.spriteTextureWorld + i], this.surface.spriteColourList[this.spriteTextureWorld + i], ((wh / 64) | 0) - 1);
        }
    }

    handleMouseDown(i, j, k) {
        this.mouseClickXHistory[this.mouseClickCount] = j;
        this.mouseClickYHistory[this.mouseClickCount] = k;
        this.mouseClickCount = this.mouseClickCount + 1 & 8191;

        for (let l = 10; l < 4000; l++) {
            let i1 = this.mouseClickCount - l & 8191;

            if (this.mouseClickXHistory[i1] === j && this.mouseClickYHistory[i1] === k) {
                let flag = false;

                for (let j1 = 1; j1 < l; j1++) {
                    let k1 = this.mouseClickCount - j1 & 8191;
                    let l1 = i1 - j1 & 8191;

                    if (this.mouseClickXHistory[l1] !== j || this.mouseClickYHistory[l1] !== k) {
                        flag = true;
                    }

                    if (this.mouseClickXHistory[k1] !== this.mouseClickXHistory[l1] || this.mouseClickYHistory[k1] !== this.mouseClickYHistory[l1]) {
                        break;
                    }

                    if (j1 === l - 1 && flag && this.combatTimeout === 0 && this.logoutTimeout === 0) {
                        this.sendLogout();
                        return;
                    }
                }
            }
        }
    }

    drawTeleportBubble(x, y, w, h, id, tx, ty) {
        let type = this.teleportBubbleType[id];
        let time = this.teleportBubbleTime[id];

        if (type === 0) {
            let j2 = 255 + time * 5 * 256;
            this.surface.drawCircle(x + ((w / 2) | 0), y + ((h / 2) | 0), 20 + time * 2, j2, 255 - time * 5);
        }

        if (type === 1) {
            let k2 = 0xff0000 + time * 5 * 256;
            this.surface.drawCircle(x + ((w / 2) | 0), y + ((h / 2) | 0), 10 + time, k2, 255 - time * 5);
        }
    }

    showServerMessage(s) {
        if (/^@bor@/.test(s)) {
            this.showMessage(s, 4);
            return;
        }

        if (/^@que@/.test(s)) {
            this.showMessage('@whi@' + s, 5);
            return;
        }

        if (/^@pri@/.test(s)) {
            this.showMessage(s, 6);
            return;
        } else {
            this.showMessage(s, 3);
            return;
        }
    }

    // looks like it just updates objects like torches etc to flip between the different models and appear "animated"
    updateObjectAnimation(i, s) { 
        let j = this.objectX[i];
        let k = this.objectY[i];
        let l = j - ((this.localPlayer.currentX / 128) | 0);
        let i1 = k - ((this.localPlayer.currentY / 128) | 0);
        let byte0 = 7;

        if (j >= 0 && k >= 0 && j < 96 && k < 96 && l > -byte0 && l < byte0 && i1 > -byte0 && i1 < byte0) {
            this.scene.removeModel(this.objectModel[i]);

            let j1 = GameData.getModelIndex(s);
            let gameModel = this.gameModels[j1].copy();

            this.scene.addModel(gameModel);
            gameModel._setLight_from6(true, 48, 48, -50, -10, -50);
            gameModel.copyPosition(this.objectModel[i]);
            gameModel.key = i;
            this.objectModel[i] = gameModel;
        }
    }

    createTopMouseMenu() {
        if (this.selectedSpell >= 0 || this.secledtItemInventoryIndex >= 0) {
            this.menuItemText1[this.menuItemsCount] = 'Cancel';
            this.menuItemText2[this.menuItemsCount] = '';
            this.menuItemID[this.menuItemsCount] = 4000;
            this.menuItemsCount++;
        }

        for (let i = 0; i < this.menuItemsCount; i++) {
            this.menuIndices[i] = i;
        }

        for (let flag = false; !flag; ) {
            flag = true;

            for (let j = 0; j < this.menuItemsCount - 1; j++) {
                let l = this.menuIndices[j];
                let j1 = this.menuIndices[j + 1];

                if (this.menuItemID[l] > this.menuItemID[j1]) {
                    this.menuIndices[j] = j1;
                    this.menuIndices[j + 1] = l;
                    flag = false;
                }
            }

        }

        if (this.menuItemsCount > 20) {
            this.menuItemsCount = 20;
        }

        if (this.menuItemsCount > 0) {
            let k = -1;

            for (let i1 = 0; i1 < this.menuItemsCount; i1++) {
                if (this.menuItemText2[this.menuIndices[i1]] === null || this.menuItemText2[this.menuIndices[i1]].length <= 0) {
                    continue;
                }

                k = i1;
                break;
            }

            let s = null;

            if ((this.secledtItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount === 1) {
                s = 'Choose a target';
            } else if ((this.secledtItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount > 1) {
                s = '@whi@' + this.menuItemText1[this.menuIndices[0]] + ' ' + this.menuItemText2[this.menuIndices[0]];
            } else if (k !== -1) {
                s = this.menuItemText2[this.menuIndices[k]] + ': @whi@' + this.menuItemText1[this.menuIndices[0]];
            }

            if (this.menuItemsCount === 2 && s !== null) {
                s = s + '@whi@ / 1 more option';
            }

            if (this.menuItemsCount > 2 && s !== null) {
                s = s + '@whi@ / ' + (this.menuItemsCount - 1) + ' more options';
            }

            if (s !== null) {
                this.surface.drawString(s, 6, 14, 1, 0xffff00);
            }

            if (!this.optionMouseButtonOne && this.mouseButtonClick === 1 || this.optionMouseButtonOne && this.mouseButtonClick === 1 && this.menuItemsCount === 1) {
                this.menuItemClick(this.menuIndices[0]);
                this.mouseButtonClick = 0;
                return;
            }

            if (!this.optionMouseButtonOne && this.mouseButtonClick === 2 || this.optionMouseButtonOne && this.mouseButtonClick === 1) {
                this.menuHeight = (this.menuItemsCount + 1) * 15;
                this.menuWidth = this.surface.textWidth('Choose option', 1) + 5;

                for (let k1 = 0; k1 < this.menuItemsCount; k1++) {
                    let l1 = this.surface.textWidth(this.menuItemText1[k1] + ' ' + this.menuItemText2[k1], 1) + 5;

                    if (l1 > this.menuWidth) {
                        this.menuWidth = l1; 
                    }
                }

                this.menuX = this.mouseX - ((this.menuWidth / 2) | 0);
                this.menuY = this.mouseY - 7;
                this.showRightClickMenu = true;

                if (this.menuX < 0) {
                    this.menuX = 0;
                }

                if (this.menuY < 0) {
                    this.menuY = 0;
                }

                if (this.menuX + this.menuWidth > 510) {
                    this.menuX = 510 - this.menuWidth;
                }

                if (this.menuY + this.menuHeight > 315) {
                    this.menuY = 315 - this.menuHeight;
                }

                this.mouseButtonClick = 0;
            }
        }
    }

    drawDialogLogout() {
        this.surface.drawBox(126, 137, 260, 60, 0);
        this.surface.drawBoxEdge(126, 137, 260, 60, 0xffffff);
        this.surface.drawStringCenter('Logging out...', 256, 173, 5, 0xffffff);
    }

    drawDialogCombatStyle() {
        let byte0 = 7;
        let byte1 = 15;
        let width = 175;

        if (this.mouseButtonClick !== 0) {
            for (let i = 0; i < 5; i++) {

                if (i <= 0 || this.mouseX <= byte0 || this.mouseX >= byte0 + width || this.mouseY <= byte1 + i * 20 || this.mouseY >= byte1 + i * 20 + 20) {
                    continue;
                }

                this.combatStyle = i - 1;
                this.mouseButtonClick = 0;
                this.clientStream.newPacket(C_OPCODES.COMBAT_STYLE);
                this.clientStream.putByte(this.combatStyle);
                this.clientStream.sendPacket();
                break;
            }
        }

        for (let j = 0; j < 5; j++) {
            if (j === this.combatStyle + 1) {
                this.surface.drawBoxAlpha(byte0, byte1 + j * 20, width, 20, Surface.rgbToLong(255, 0, 0), 128);
            } else {
                this.surface.drawBoxAlpha(byte0, byte1 + j * 20, width, 20, Surface.rgbToLong(190, 190, 190), 128);
            }

            this.surface.drawLineHoriz(byte0, byte1 + j * 20, width, 0);
            this.surface.drawLineHoriz(byte0, byte1 + j * 20 + 20, width, 0);
        }

        this.surface.drawStringCenter('Select combat style', byte0 + ((width / 2) | 0), byte1 + 16, 3, 0xffffff);
        this.surface.drawStringCenter('Controlled (+1 of each)', byte0 + ((width / 2) | 0), byte1 + 36, 3, 0);
        this.surface.drawStringCenter('Aggressive (+3 strength)', byte0 + ((width / 2) | 0), byte1 + 56, 3, 0);
        this.surface.drawStringCenter('Accurate   (+3 attack)', byte0 + ((width / 2) | 0), byte1 + 76, 3, 0);
        this.surface.drawStringCenter('Defensive  (+3 defense)', byte0 + ((width / 2) | 0), byte1 + 96, 3, 0);
    }

    menuItemClick(i) {
        let mx = this.menuItemX[i];
        let my = this.menuItemY[i];
        let mIdx = this.menuSourceType[i];
        let mSrcIdx = this.menuSourceIndex[i];
        let mTargetIndex = this.menuTargetIndex[i];
        let mItemId = this.menuItemID[i];

        if (mItemId === 200) {
            this.walkToGroundItem(this.localRegionX, this.localRegionY, mx, my, true);
            this.clientStream.newPacket(C_OPCODES.CAST_GROUNDITEM);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 210) {
            this.walkToGroundItem(this.localRegionX, this.localRegionY, mx, my, true);
            this.clientStream.newPacket(C_OPCODES.USEWITH_GROUNDITEM);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 220) {
            this.walkToGroundItem(this.localRegionX, this.localRegionY, mx, my, true);
            this.clientStream.newPacket(C_OPCODES.GROUNDITEM_TAKE);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 3200) {
            this.showMessage(GameData.itemDescription[mIdx], 3);
        }

        if (mItemId === 300) {
            this.walkToWallObject(mx, my, mIdx);
            this.clientStream.newPacket(C_OPCODES.CAST_WALLOBJECT);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putByte(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 310) {
            this.walkToWallObject(mx, my, mIdx);
            this.clientStream.newPacket(C_OPCODES.USEWITH_WALLOBJECT);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putByte(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 320) {
            this.walkToWallObject(mx, my, mIdx);
            this.clientStream.newPacket(C_OPCODES.WALL_OBJECT_COMMAND1);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putByte(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 2300) {
            this.walkToWallObject(mx, my, mIdx);
            this.clientStream.newPacket(C_OPCODES.WALL_OBJECT_COMMAND2);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putByte(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 3300) {
            this.showMessage(GameData.wallObjectDescription[mIdx], 3);
        }

        if (mItemId === 400) {
            this.walkToObject(mx, my, mIdx, mSrcIdx);
            this.clientStream.newPacket(C_OPCODES.CAST_OBJECT);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mTargetIndex);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 410) {
            this.walkToObject(mx, my, mIdx, mSrcIdx);
            this.clientStream.newPacket(C_OPCODES.USEWITH_OBJECT);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mTargetIndex);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 420) {
            this.walkToObject(mx, my, mIdx, mSrcIdx);
            this.clientStream.newPacket(C_OPCODES.OBJECT_CMD1);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.sendPacket();
        }

        if (mItemId === 2400) {
            this.walkToObject(mx, my, mIdx, mSrcIdx);
            this.clientStream.newPacket(C_OPCODES.OBJECT_CMD2);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.sendPacket();
        }

        if (mItemId === 3400) {
            this.showMessage(GameData.objectDescription[mIdx], 3);
        }

        if (mItemId === 600) {
            this.clientStream.newPacket(C_OPCODES.CAST_INVITEM);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 610) {
            this.clientStream.newPacket(C_OPCODES.USEWITH_INVITEM);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 620) {
            this.clientStream.newPacket(C_OPCODES.INV_UNEQUIP);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 630) {
            this.clientStream.newPacket(C_OPCODES.INV_WEAR);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 640) {
            this.clientStream.newPacket(C_OPCODES.INV_CMD);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 650) {
            this.selectedItemInventoryIndex = mIdx;
            this.showUiTab = 0;
            this.selectedItemName = GameData.itemName[this.inventoryItemId[this.selectedItemInventoryIndex]];
        }

        if (mItemId === 660) {
            this.clientStream.newPacket(C_OPCODES.INV_DROP);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
            this.showUiTab = 0;
            this.showMessage('Dropping ' + GameData.itemName[this.inventoryItemId[mIdx]], 4);
        }

        if (mItemId === 3600) {
            this.showMessage(GameData.itemDescription[mIdx], 3);
        }

        if (mItemId === 700) {
            let l1 = ((mx - 64) / this.magicLoc) | 0;
            let l3 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, l1, l3, true);
            this.clientStream.newPacket(C_OPCODES.CAST_NPC);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 710) {
            let i2 = ((mx - 64) / this.magicLoc) | 0;
            let i4 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, i2, i4, true);
            this.clientStream.newPacket(C_OPCODES.USEWITH_NPC);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 720) {
            let j2 = ((mx - 64) / this.magicLoc) | 0;
            let j4 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, j2, j4, true);
            this.clientStream.newPacket(C_OPCODES.NPC_TALK);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 725) {
            let k2 = ((mx - 64) / this.magicLoc) | 0;
            let k4 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, k2, k4, true);
            this.clientStream.newPacket(C_OPCODES.NPC_CMD);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 715 || mItemId === 2715) {
            let l2 = ((mx - 64) / this.magicLoc) | 0;
            let l4 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, l2, l4, true);
            this.clientStream.newPacket(C_OPCODES.NPC_ATTACK);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 3700) {
            this.showMessage(GameData.npcDescription[mIdx], 3);
        }

        if (mItemId === 800) {
            let i3 = ((mx - 64) / this.magicLoc) | 0;
            let i5 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, i3, i5, true);
            this.clientStream.newPacket(C_OPCODES.CAST_PLAYER);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 810) {
            let j3 = ((mx - 64) / this.magicLoc) | 0;
            let j5 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, j3, j5, true);
            this.clientStream.newPacket(C_OPCODES.USEWITH_PLAYER);
            this.clientStream.putShort(mIdx);
            this.clientStream.putShort(mSrcIdx);
            this.clientStream.sendPacket();
            this.selectedItemInventoryIndex = -1;
        }

        if (mItemId === 805 || mItemId === 2805) {
            let k3 = ((mx - 64) / this.magicLoc) | 0;
            let k5 = ((my - 64) / this.magicLoc) | 0;

            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, k3, k5, true);
            this.clientStream.newPacket(C_OPCODES.PLAYER_ATTACK);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 2806) {
            this.clientStream.newPacket(C_OPCODES.PLAYER_DUEL);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 2810) {
            this.clientStream.newPacket(C_OPCODES.PLAYER_TRADE);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 2820) {
            this.clientStream.newPacket(C_OPCODES.PLAYER_FOLLOW);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
        }

        if (mItemId === 900) {
            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, mx, my, true);
            this.clientStream.newPacket(C_OPCODES.CAST_GROUND);
            this.clientStream.putShort(mx + this.regionX);
            this.clientStream.putShort(my + this.regionY);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 920) {
            this._walkToActionSource_from5(this.localRegionX, this.localRegionY, mx, my, false);

            if (this.mouseClickXStep === -24) {
                this.mouseClickXStep = 24;
            }
        }

        if (mItemId === 1000) {
            this.clientStream.newPacket(C_OPCODES.CAST_SELF);
            this.clientStream.putShort(mIdx);
            this.clientStream.sendPacket();
            this.selectedSpell = -1;
        }

        if (mItemId === 4000) {
            this.selectedItemInventoryIndex = -1;
            this.selectedSpell = -1;
        }
    }

    showLoginScreenStatus(s, s1) {
        if (this.loginScreen === 1) {
            this.panelLoginNewuser.updateText(this.anInt827, s + ' ' + s1);
        }

        if (this.loginScreen === 2) {
            this.panelLoginExistinguser.updateText(this.controlLoginStatus, s + ' ' + s1);
        }

        this.loginUserDisp = s1;
        this.drawLoginScreens();
        this.resetTimings();
    }

    async lostConnection() {
        this.systemUpdate = 0;

        if (this.logoutTimeout !== 0) {
            this.resetLoginVars();
            return;
        } else {
            await super.lostConnection();
            return;
        }
    }

    isValidCameraAngle(i) {
        let j = (this.localPlayer.currentX / 128) | 0;
        let k = (this.localPlayer.currentY / 128) | 0;

        for (let l = 2; l >= 1; l--) {
            if (i === 1 && ((this.world.objectAdjacency.get(j, k - l) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k - l) & 128) === 128)) {
                return false;
            }

            if (i === 3 && ((this.world.objectAdjacency.get(j, k + l) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k + l) & 128) === 128)) {
                return false;
            }

            if (i === 5 && ((this.world.objectAdjacency.get(j, k + l) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k + l) & 128) === 128)) {
                return false;
            }

            if (i === 7 && ((this.world.objectAdjacency.get(j, k - l) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k - l) & 128) === 128)) {
                return false;
            }

            if (i === 0 && (this.world.objectAdjacency.get(j, k - l) & 128) === 128) {
                return false;
            }

            if (i === 2 && (this.world.objectAdjacency.get(j - l, k) & 128) === 128) {
                return false;
            }

            if (i === 4 && (this.world.objectAdjacency.get(j, k + l) & 128) === 128) {
                return false;
            }

            if (i === 6 && (this.world.objectAdjacency.get(j + l, k) & 128) === 128) {
                return false;
            }
        }

        return true;
    }

    resetLoginScreenVariables() {
        this.loggedIn = 0;
        this.loginScreen = 0;
        this.loginUser = '';
        this.loginPass = '';
        this.loginUserDesc = 'Please enter a username:';
        this.loginUserDisp = '*' + this.loginUser + '*';
        this.playerCount = 0;
        this.npcCount = 0;
    }

    // TODO: let's move each of these to its own file
    handleIncomingPacket(opcode, ptype, psize, pdata) {
        try {
            if (opcode === S_OPCODES.REGION_PLAYERS) {
                this.knownPlayerCount = this.playerCount;

                for (let k = 0; k < this.knownPlayerCount; k++) {
                    this.knownPlayers[k] = this.players[k];
                }

                let k7 = 8;

                this.localRegionX = Utility.getBitMask(pdata, k7, 11);
                k7 += 11;
                this.localRegionY = Utility.getBitMask(pdata, k7, 13);
                k7 += 13;

                let anim = Utility.getBitMask(pdata, k7, 4);

                k7 += 4;

                let flag1 = this.loadNextRegion(this.localRegionX, this.localRegionY);

                this.localRegionX -= this.regionX;
                this.localRegionY -= this.regionY;

                let l22 = this.localRegionX * this.magicLoc + 64;
                let l25 = this.localRegionY * this.magicLoc + 64;

                if (flag1) {
                    this.localPlayer.waypointCurrent = 0;
                    this.localPlayer.movingStep = 0;
                    this.localPlayer.currentX = this.localPlayer.waypointsX[0] = l22;
                    this.localPlayer.currentY = this.localPlayer.waypointsY[0] = l25;
                }

                this.playerCount = 0;

                this.localPlayer = this.createPlayer(this.localPlayerServerIndex, l22, l25, anim);

                let i29 = Utility.getBitMask(pdata, k7, 8);

                k7 += 8;

                for (let l33 = 0; l33 < i29; l33++) {
                    let character_3 = this.knownPlayers[l33 + 1];
                    let reqUpdate = Utility.getBitMask(pdata, k7, 1);

                    k7++;

                    if (reqUpdate !== 0) {
                        let updateType = Utility.getBitMask(pdata, k7, 1);

                        k7++;

                        if (updateType === 0) {
                            let nextAnim = Utility.getBitMask(pdata, k7, 3);

                            k7 += 3;

                            let l43 = character_3.waypointCurrent;
                            let j44 = character_3.waypointsX[l43];
                            let k44 = character_3.waypointsY[l43];

                            if (nextAnim === 2 || nextAnim === 1 || nextAnim === 3) {
                                j44 += this.magicLoc;
                            }

                            if (nextAnim === 6 || nextAnim === 5 || nextAnim === 7) {
                                j44 -= this.magicLoc;
                            }

                            if (nextAnim === 4 || nextAnim === 3 || nextAnim === 5) {
                                k44 += this.magicLoc;
                            }

                            if (nextAnim === 0 || nextAnim === 1 || nextAnim === 7) {
                                k44 -= this.magicLoc;
                            }

                            character_3.animationNext = nextAnim;
                            character_3.waypointCurrent = l43 = (l43 + 1) % 10;
                            character_3.waypointsX[l43] = j44;
                            character_3.waypointsY[l43] = k44;
                        } else {
                            let i43 = Utility.getBitMask(pdata, k7, 4);

                            if ((i43 & 12) === 12) {
                                k7 += 2;
                                continue;
                            }

                            character_3.animationNext = Utility.getBitMask(pdata, k7, 4);
                            k7 += 4;
                        }
                    }

                    this.players[this.playerCount++] = character_3;
                }

                let count = 0;

                while (k7 + 24 < psize * 8) {
                    let serverIndex = Utility.getBitMask(pdata, k7, 11);

                    k7 += 11;

                    let areaX = Utility.getBitMask(pdata, k7, 5);

                    k7 += 5;

                    if (areaX > 15) {
                        areaX -= 32;
                    }

                    let areaY = Utility.getBitMask(pdata, k7, 5);

                    k7 += 5;

                    if (areaY > 15) {
                        areaY -= 32;
                    }

                    let animation = Utility.getBitMask(pdata, k7, 4);

                    k7 += 4;
                    let i44 = Utility.getBitMask(pdata, k7, 1);

                    k7++;

                    let x = (this.localRegionX + areaX) * this.magicLoc + 64;
                    let y = (this.localRegionY + areaY) * this.magicLoc + 64;

                    this.createPlayer(serverIndex, x, y, animation);

                    if (i44 === 0) {
                        this.playerServerIndexes[count++] = serverIndex;
                    }
                }

                if (count > 0) {
                    this.clientStream.newPacket(C_OPCODES.KNOWN_PLAYERS);
                    this.clientStream.putShort(count);

                    for (let i = 0; i < count; i++) {
                        let c = this.playerServer[this.playerServerIndexes[i]];

                        this.clientStream.putShort(c.serverIndex);
                        this.clientStream.putShort(c.serverId);
                    }

                    this.clientStream.sendPacket();
                    count = 0;
                }

                return;
            }

            if (opcode === S_OPCODES.REGION_GROUND_ITEMS) {
                for (let l = 1; l < psize; )
                    if (Utility.getUnsignedByte(pdata[l]) === 255) {
                        let l7 = 0;
                        let j14 = this.localRegionX + pdata[l + 1] >> 3;
                        let i19 = this.localRegionY + pdata[l + 2] >> 3;

                        l += 3;

                        for (let j23 = 0; j23 < this.groundItemCount; j23++) {
                            let j26 = (this.groundItemX[j23] >> 3) - j14;
                            let j29 = (this.groundItemY[j23] >> 3) - i19;

                            if (j26 !== 0 || j29 !== 0) {
                                if (j23 !== l7) {
                                    this.groundItemX[l7] = this.groundItemX[j23];
                                    this.groundItemY[l7] = this.groundItemY[j23];
                                    this.groundItemId[l7] = this.groundItemId[j23];
                                    this.groundItemZ[l7] = this.groundItemZ[j23];
                                }

                                l7++;
                            }
                        }

                        this.groundItemCount = l7;
                    } else {
                        let i8 = Utility.getUnsignedShort(pdata, l);

                        l += 2;

                        let k14 = this.localRegionX + pdata[l++];
                        let j19 = this.localRegionY + pdata[l++];

                        if ((i8 & 32768) === 0) {
                            this.groundItemX[this.groundItemCount] = k14;
                            this.groundItemY[this.groundItemCount] = j19;
                            this.groundItemId[this.groundItemCount] = i8;
                            this.groundItemZ[this.groundItemCount] = 0;

                            for (let k23 = 0; k23 < this.objectCount; k23++) {
                                if (this.objectX[k23] !== k14 || this.objectY[k23] !== j19) {
                                    continue;
                                }

                                this.groundItemZ[this.groundItemCount] = GameData.objectElevation[this.objectId[k23]];
                                break;
                            }

                            this.groundItemCount++;
                        } else {
                            i8 &= 32767;

                            let l23 = 0;

                            for (let k26 = 0; k26 < this.groundItemCount; k26++) {
                                if (this.groundItemX[k26] !== k14 || this.groundItemY[k26] !== j19 || this.groundItemId[k26] !== i8) {
                                    if (k26 !== l23) {
                                        this.groundItemX[l23] = this.groundItemX[k26];
                                        this.groundItemY[l23] = this.groundItemY[k26];
                                        this.groundItemId[l23] = this.groundItemId[k26];
                                        this.groundItemZ[l23] = this.groundItemZ[k26];
                                    }

                                    l23++;
                                } else {
                                    i8 = -123;
                                }
                            }

                            this.groundItemCount = l23;
                        }
                    }

                return;
            }

            if (opcode === S_OPCODES.REGION_OBJECTS) {
                for (let i1 = 1; i1 < psize; ) {
                    if (Utility.getUnsignedByte(pdata[i1]) === 255) {
                        let j8 = 0;
                        let l14 = this.localRegionX + pdata[i1 + 1] >> 3;
                        let k19 = this.localRegionY + pdata[i1 + 2] >> 3;

                        i1 += 3;

                        for (let i24 = 0; i24 < this.objectCount; i24++) {
                            let l26 = (this.objectX[i24] >> 3) - l14;
                            let k29 = (this.objectY[i24] >> 3) - k19;

                            if (l26 !== 0 || k29 !== 0) {
                                if (i24 !== j8) {
                                    this.objectModel[j8] = this.objectModel[i24];
                                    this.objectModel[j8].key = j8;
                                    this.objectX[j8] = this.objectX[i24];
                                    this.objectY[j8] = this.objectY[i24];
                                    this.objectId[j8] = this.objectId[i24];
                                    this.objectDirection[j8] = this.objectDirection[i24];
                                }

                                j8++;
                            } else {
                                this.scene.removeModel(this.objectModel[i24]);
                                this.world.removeObject(this.objectX[i24], this.objectY[i24], this.objectId[i24]);
                            }
                        }

                        this.objectCount = j8;
                    } else {
                        let id = Utility.getUnsignedShort(pdata, i1);

                        i1 += 2;

                        let lX = this.localRegionX + pdata[i1++];
                        let lY = this.localRegionY + pdata[i1++];
                        let j24 = 0;

                        for (let i27 = 0; i27 < this.objectCount; i27++) {
                            if (this.objectX[i27] !== lX || this.objectY[i27] !== lY) {
                                if (i27 !== j24) {
                                    this.objectModel[j24] = this.objectModel[i27];
                                    this.objectModel[j24].key = j24;
                                    this.objectX[j24] = this.objectX[i27];
                                    this.objectY[j24] = this.objectY[i27];
                                    this.objectId[j24] = this.objectId[i27];
                                    this.objectDirection[j24] = this.objectDirection[i27];
                                }

                                j24++;
                            } else {
                                this.scene.removeModel(this.objectModel[i27]);
                                this.world.removeObject(this.objectX[i27], this.objectY[i27], this.objectId[i27]);
                            }
                        }

                        this.objectCount = j24;

                        if (id !== 60000) {
                            let direction = this.world.getTileDirection(lX, lY);
                            let width = 0;
                            let height = 0;

                            if (direction === 0 || direction === 4) {
                                width = GameData.objectWidth[id];
                                height = GameData.objectHeight[id];
                            } else {
                                height = GameData.objectWidth[id];
                                width = GameData.objectHeight[id];
                            }

                            let mX = (((lX + lX + width) * this.magicLoc) / 2) | 0;
                            let mY = (((lY + lY + height) * this.magicLoc) / 2) | 0;
                            let modelIdx = GameData.objectModelIndex[id];
                            let model = this.gameModels[modelIdx].copy();

                            this.scene.addModel(model);

                            model.key = this.objectCount;
                            model.rotate(0, direction * 32, 0);
                            model.translate(mX, -this.world.getElevation(mX, mY), mY);
                            model._setLight_from6(true, 48, 48, -50, -10, -50);

                            this.world.removeObject2(lX, lY, id);

                            if (id === 74) {
                                model.translate(0, -480, 0);
                            }

                            this.objectX[this.objectCount] = lX;
                            this.objectY[this.objectCount] = lY;
                            this.objectId[this.objectCount] = id;
                            this.objectDirection[this.objectCount] = direction;
                            this.objectModel[this.objectCount++] = model;
                        }
                    }
                }

                return;
            }

            if (opcode === S_OPCODES.INVENTORY_ITEMS) {
                let offset = 1;

                this.inventoryItemsCount = pdata[offset++] & 0xff;

                for (let i = 0; i < this.inventoryItemsCount; i++) {
                    let idEquip = Utility.getUnsignedShort(pdata, offset);

                    offset += 2;
                    this.inventoryItemId[i] = idEquip & 32767;
                    this.inventoryEquipped[i] = (idEquip / 32768) | 0;

                    if (GameData.itemStackable[idEquip & 32767] === 0) {
                        this.inventoryItemStackCount[i] = Utility.getUnsignedInt2(pdata, offset);

                        if (this.inventoryItemStackCount[i] >= 128) {
                            offset += 4;
                        } else {
                            offset++;
                        }
                    } else {
                        this.inventoryItemStackCount[i] = 1;
                    }
                }

                return;
            }

            if (opcode === S_OPCODES.REGION_PLAYER_UPDATE) {
                let k1 = Utility.getUnsignedShort(pdata, 1);
                let offset = 3;

                for (let k15 = 0; k15 < k1; k15++) {
                    let playerId = Utility.getUnsignedShort(pdata, offset);

                    offset += 2;

                    let character = this.playerServer[playerId];
                    let updateType = pdata[offset];

                    offset++;

                    // speech bubble with an item in it
                    if (updateType === 0) { 
                        let id = Utility.getUnsignedShort(pdata, offset);
                        offset += 2;

                        if (character !== null) {
                            character.bubbleTimeout = 150;
                            character.bubbleItem = id;
                        }
                    } else if (updateType === 1) { // chat
                        let messageLength = pdata[offset];
                        offset++;

                        if (character !== null) {
                            let filtered = WordFilter.filter(ChatMessage.descramble(pdata, offset, messageLength));

                            let ignored = false;

                            for (let i = 0; i < this.ignoreListCount; i++) {
                                if (this.ignoreList[i] === character.hash) {
                                    ignored = true;
                                    break;
                                }
                            }

                            if (!ignored) {
                                character.messageTimeout = 150;
                                character.message = filtered;
                                this.showMessage(character.name + ': ' + character.message, 2);
                            }
                        }

                        offset += messageLength;
                    } else if (updateType === 2) { // combat damage and hp
                        let damage = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        let current = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        let max = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        if (character !== null) {
                            character.damageTaken = damage;
                            character.healthCurrent = current;
                            character.healthMax = max;
                            character.combatTimer = 200;

                            if (character === this.localPlayer) {
                                this.playerStatCurrent[3] = current;
                                this.playerStatBase[3] = max;
                                this.showDialogWelcome = false;
                                this.showDialogServermessage = false;
                            }
                        }
                    } else if (updateType === 3) { // new incoming projectile from npc?
                        let projectileSprite = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let npcIdx = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        if (character !== null) {
                            character.incomingProjectileSprite = projectileSprite;
                            character.attackingNpcServerIndex = npcIdx;
                            character.attackingPlayerServerIndex = -1;
                            character.projectileRange = this.projectileMaxRange;
                        }
                    } else if (updateType === 4) { // new incoming projectile from player
                        let projectileSprite = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let playerIdx = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        if (character !== null) {
                            character.incomingProjectileSprite = projectileSprite;
                            character.attackingPlayerServerIndex = playerIdx;
                            character.attackingNpcServerIndex = -1;
                            character.projectileRange = this.projectileMaxRange;
                        }
                    } else if (updateType === 5) {
                        if (character !== null) {
                            character.serverId = Utility.getUnsignedShort(pdata, offset);
                            offset += 2;
                            character.hash = Utility.getUnsignedLong(pdata, offset);
                            offset += 8;
                            character.name = Utility.hashToUsername(character.hash);

                            let equippedCount = Utility.getUnsignedByte(pdata[offset]);

                            offset++;

                            for (let i = 0; i < equippedCount; i++) {
                                character.equippedItem[i] = Utility.getUnsignedByte(pdata[offset]);
                                offset++;
                            }

                            for (let i = equippedCount; i < 12; i++) {
                                character.equippedItem[i] = 0;
                            }

                            character.colourHair = pdata[offset++] & 0xff;
                            character.colourTop = pdata[offset++] & 0xff;
                            character.colourBottom = pdata[offset++] & 0xff;
                            character.colourSkin = pdata[offset++] & 0xff;
                            character.level = pdata[offset++] & 0xff;
                            character.skullVisible = pdata[offset++] & 0xff;
                        } else {
                            offset += 14;

                            let unused = Utility.getUnsignedByte(pdata[offset]);

                            offset += unused + 1;
                        }
                    } else if (updateType === 6) {
                        let mLen = pdata[offset];

                        offset++;

                        if (character !== null) {
                            let msg = ChatMessage.descramble(pdata, offset, mLen);

                            character.messageTimeout = 150;
                            character.message = msg;

                            if (character === this.localPlayer) {
                                this.showMessage(character.name + ': ' + character.message, 5);
                            }
                        }

                        offset += mLen;
                    }
                }

                return;
            }

            if (opcode === S_OPCODES.REGION_WALL_OBJECTS) {
                for (let offset = 1; offset < psize; )
                    if (Utility.getUnsignedByte(pdata[offset]) === 255) {
                        let count = 0;
                        let lX = this.localRegionX + pdata[offset + 1] >> 3;
                        let lY = this.localRegionY + pdata[offset + 2] >> 3;

                        offset += 3;

                        for (let i = 0; i < this.wallObjectCount; i++) {
                            let sX = (this.wallObjectX[i] >> 3) - lX;
                            let sY = (this.wallObjectY[i] >> 3) - lY;

                            if (sX !== 0 || sY !== 0) {
                                if (i !== count) {
                                    this.wallObjectModel[count] = this.wallObjectModel[i];
                                    this.wallObjectModel[count].key = count + 10000;
                                    this.wallObjectX[count] = this.wallObjectX[i];
                                    this.wallObjectY[count] = this.wallObjectY[i];
                                    this.wallObjectDirection[count] = this.wallObjectDirection[i];
                                    this.wallObjectId[count] = this.wallObjectId[i];
                                }

                                count++;
                            } else {
                                this.scene.removeModel(this.wallObjectModel[i]);
                                this.world.removeWallObject(this.wallObjectX[i], this.wallObjectY[i], this.wallObjectDirection[i], this.wallObjectId[i]);
                            }
                        }

                        this.wallObjectCount = count;
                    } else {
                        let id = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let lX = this.localRegionX + pdata[offset++];
                        let lY = this.localRegionY + pdata[offset++];
                        let direction = pdata[offset++];
                        let count = 0;

                        for (let i = 0; i < this.wallObjectCount; i++) {
                            if (this.wallObjectX[i] !== lX || this.wallObjectY[i] !== lY || this.wallObjectDirection[i] !== direction) {
                                if (i !== count) {
                                    this.wallObjectModel[count] = this.wallObjectModel[i];
                                    this.wallObjectModel[count].key = count + 10000;
                                    this.wallObjectX[count] = this.wallObjectX[i];
                                    this.wallObjectY[count] = this.wallObjectY[i];
                                    this.wallObjectDirection[count] = this.wallObjectDirection[i];
                                    this.wallObjectId[count] = this.wallObjectId[i];
                                }

                                count++;
                            } else {
                                this.scene.removeModel(this.wallObjectModel[i]);
                                this.world.removeWallObject(this.wallObjectX[i], this.wallObjectY[i], this.wallObjectDirection[i], this.wallObjectId[i]);
                            }
                        }

                        this.wallObjectCount = count;

                        if (id !== 65535) {
                            this.world._setObjectAdjacency_from4(lX, lY, direction, id);
                            let model = this.createModel(lX, lY, direction, id, this.wallObjectCount);
                            this.wallObjectModel[this.wallObjectCount] = model;
                            this.wallObjectX[this.wallObjectCount] = lX;
                            this.wallObjectY[this.wallObjectCount] = lY;
                            this.wallObjectId[this.wallObjectCount] = id;
                            this.wallObjectDirection[this.wallObjectCount++] = direction;
                        }
                    }

                return;
            }

            if (opcode === S_OPCODES.REGION_NPCS) {
                this.npcCacheCount = this.npcCount;
                this.npcCount = 0;

                for (let i2 = 0; i2 < this.npcCacheCount; i2++) {
                    this.npcsCache[i2] = this.npcs[i2];
                }

                let offset = 8;
                let j16 = Utility.getBitMask(pdata, offset, 8);

                offset += 8;

                for (let l20 = 0; l20 < j16; l20++) {
                    let character_1 = this.npcsCache[l20];
                    let l27 = Utility.getBitMask(pdata, offset, 1);

                    offset++;

                    if (l27 !== 0) {
                        let i32 = Utility.getBitMask(pdata, offset, 1);

                        offset++;

                        if (i32 === 0) {
                            let j35 = Utility.getBitMask(pdata, offset, 3);

                            offset += 3;

                            let i38 = character_1.waypointCurrent;
                            let l40 = character_1.waypointsX[i38];
                            let j42 = character_1.waypointsY[i38];

                            if (j35 === 2 || j35 === 1 || j35 === 3) {
                                l40 += this.magicLoc;
                            }

                            if (j35 === 6 || j35 === 5 || j35 === 7) {
                                l40 -= this.magicLoc;
                            }

                            if (j35 === 4 || j35 === 3 || j35 === 5) {
                                j42 += this.magicLoc;
                            }

                            if (j35 === 0 || j35 === 1 || j35 === 7) {
                                j42 -= this.magicLoc;
                            }

                            character_1.animationNext = j35;
                            character_1.waypointCurrent = i38 = (i38 + 1) % 10;
                            character_1.waypointsX[i38] = l40;
                            character_1.waypointsY[i38] = j42;
                        } else {
                            let k35 = Utility.getBitMask(pdata, offset, 4);

                            if ((k35 & 12) === 12) {
                                offset += 2;
                                continue;
                            }

                            character_1.animationNext = Utility.getBitMask(pdata, offset, 4);
                            offset += 4;
                        }
                    }

                    this.npcs[this.npcCount++] = character_1;
                }

                while (offset + 34 < psize * 8) {
                    let serverIndex = Utility.getBitMask(pdata, offset, 12);

                    offset += 12;

                    let areaX = Utility.getBitMask(pdata, offset, 5);

                    offset += 5;

                    if (areaX > 15) {
                        areaX -= 32;
                    }

                    let areaY = Utility.getBitMask(pdata, offset, 5);

                    offset += 5;

                    if (areaY > 15) {
                        areaY -= 32;
                    }

                    let sprite = Utility.getBitMask(pdata, offset, 4);

                    offset += 4;

                    let x = (this.localRegionX + areaX) * this.magicLoc + 64;
                    let y = (this.localRegionY + areaY) * this.magicLoc + 64;
                    let type = Utility.getBitMask(pdata, offset, 10);

                    offset += 10;

                    if (type >= GameData.npcCount) {
                        type = 24;
                    }

                    this.addNpc(serverIndex, x, y, sprite, type);
                }

                return;
            }

            if (opcode === S_OPCODES.REGION_NPC_UPDATE) {
                let j2 = Utility.getUnsignedShort(pdata, 1);
                let i10 = 3;

                for (let k16 = 0; k16 < j2; k16++) {
                    let i21 = Utility.getUnsignedShort(pdata, i10);

                    i10 += 2;

                    let character = this.npcsServer[i21];
                    let j28 = Utility.getUnsignedByte(pdata[i10]);

                    i10++;

                    if (j28 === 1) {
                        let target = Utility.getUnsignedShort(pdata, i10);

                        i10 += 2;

                        let byte9 = pdata[i10];

                        i10++;

                        if (character !== null) {
                            let s4 = ChatMessage.descramble(pdata, i10, byte9);

                            character.messageTimeout = 150;
                            character.message = s4;

                            if (target === this.localPlayer.serverIndex) {
                                this.showMessage('@yel@' + GameData.npcName[character.npcId] + ': ' + character.message, 5);
                            }
                        }

                        i10 += byte9;
                    } else if (j28 === 2) {
                        let l32 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        let i36 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        let k38 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        if (character !== null) {
                            character.damageTaken = l32;
                            character.healthCurrent = i36;
                            character.healthMax = k38;
                            character.combatTimer = 200;
                        }
                    }
                }

                return;
            }

            if (opcode === S_OPCODES.OPTION_LIST) {
                this.showOptionMenu = true;

                let count = Utility.getUnsignedByte(pdata[1]);

                this.optionMenuCount = count;

                let offset = 2;

                for (let i = 0; i < count; i++) {
                    let length = Utility.getUnsignedByte(pdata[offset]);

                    offset++;
                    this.optionMenuEntry[i] = fromCharArray(pdata.slice(offset, offset + length));
                    offset += length;
                }

                return;
            }

            if (opcode === S_OPCODES.OPTION_LIST_CLOSE) {
                this.showOptionMenu = false;
                return;
            }

            if (opcode === S_OPCODES.WORLD_INFO) {
                this.loadingArea = true;
                this.localPlayerServerIndex = Utility.getUnsignedShort(pdata, 1);
                this.planeWidth = Utility.getUnsignedShort(pdata, 3);
                this.planeHeight = Utility.getUnsignedShort(pdata, 5);
                this.planeIndex = Utility.getUnsignedShort(pdata, 7);
                this.planeMultiplier = Utility.getUnsignedShort(pdata, 9);
                this.planeHeight -= this.planeIndex * this.planeMultiplier;

                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_LIST) {
                let offset = 1;

                for (let i = 0; i < this.playerStatCount; i++) {
                    this.playerStatCurrent[i] = Utility.getUnsignedByte(pdata[offset++]);
                }

                for (let i = 0; i < this.playerStatCount; i++) {
                    this.playerStatBase[i] = Utility.getUnsignedByte(pdata[offset++]);
                }

                for (let i = 0; i < this.playerStatCount; i++) {
                    this.playerExperience[i] = Utility.getUnsignedInt(pdata, offset);
                    offset += 4;
                }

                this.playerQuestPoints = Utility.getUnsignedByte(pdata[offset++]);
                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_EQUIPMENT_BONUS) {
                for (let i3 = 0; i3 < this.playerStatEquipmentCount; i3++) {
                    this.playerStatEquipment[i3] = Utility.getUnsignedByte(pdata[1 + i3]);
                }

                return;
            }

            if (opcode === S_OPCODES.PLAYER_DIED) {
                this.deathScreenTimeout = 250;
                return;
            }

            if (opcode === S_OPCODES.REGION_ENTITY_UPDATE) {
                let j3 = ((psize - 1) / 4) | 0;

                for (let l10 = 0; l10 < j3; l10++) {
                    let j17 = this.localRegionX + Utility.getSignedShort(pdata, 1 + l10 * 4) >> 3;
                    let l21 = this.localRegionY + Utility.getSignedShort(pdata, 3 + l10 * 4) >> 3;
                    let i25 = 0;

                    for (let k28 = 0; k28 < this.groundItemCount; k28++) {
                        let i33 = (this.groundItemX[k28] >> 3) - j17;
                        let j36 = (this.groundItemY[k28] >> 3) - l21;

                        if (i33 !== 0 || j36 !== 0) {
                            if (k28 !== i25) {
                                this.groundItemX[i25] = this.groundItemX[k28];
                                this.groundItemY[i25] = this.groundItemY[k28];
                                this.groundItemId[i25] = this.groundItemId[k28];
                                this.groundItemZ[i25] = this.groundItemZ[k28];
                            }

                            i25++;
                        }
                    }

                    this.groundItemCount = i25;
                    i25 = 0;

                    for (let j33 = 0; j33 < this.objectCount; j33++) {
                        let k36 = (this.objectX[j33] >> 3) - j17;
                        let l38 = (this.objectY[j33] >> 3) - l21;

                        if (k36 !== 0 || l38 !== 0) {
                            if (j33 !== i25) {
                                this.objectModel[i25] = this.objectModel[j33];
                                this.objectModel[i25].key = i25;
                                this.objectX[i25] = this.objectX[j33];
                                this.objectY[i25] = this.objectY[j33];
                                this.objectId[i25] = this.objectId[j33];
                                this.objectDirection[i25] = this.objectDirection[j33];
                            }

                            i25++;
                        } else {
                            this.scene.removeModel(this.objectModel[j33]);
                            this.world.removeObject(this.objectX[j33], this.objectY[j33], this.objectId[j33]);
                        }
                    }

                    this.objectCount = i25;
                    i25 = 0;

                    for (let l36 = 0; l36 < this.wallObjectCount; l36++) {
                        let i39 = (this.wallObjectX[l36] >> 3) - j17;
                        let j41 = (this.wallObjectY[l36] >> 3) - l21;

                        if (i39 !== 0 || j41 !== 0) {
                            if (l36 !== i25) {
                                this.wallObjectModel[i25] = this.wallObjectModel[l36];
                                this.wallObjectModel[i25].key = i25 + 10000;
                                this.wallObjectX[i25] = this.wallObjectX[l36];
                                this.wallObjectY[i25] = this.wallObjectY[l36];
                                this.wallObjectDirection[i25] = this.wallObjectDirection[l36];
                                this.wallObjectId[i25] = this.wallObjectId[l36];
                            }

                            i25++;
                        } else {
                            this.scene.removeModel(this.wallObjectModel[l36]);
                            this.world.removeWallObject(this.wallObjectX[l36], this.wallObjectY[l36], this.wallObjectDirection[l36], this.wallObjectId[l36]);
                        }
                    }

                    this.wallObjectCount = i25;
                }

                return;
            }

            if (opcode === S_OPCODES.APPEARANCE) {
                this.showAppearanceChange = true;
                return;
            }

            if (opcode === S_OPCODES.TRADE_OPEN) {
                let k3 = Utility.getUnsignedShort(pdata, 1);

                if (this.playerServer[k3] !== null) {
                    this.tradeRecipientName = this.playerServer[k3].name;
                }

                this.showDialogTrade = true;
                this.tradeRecipientAccepted = false;
                this.tradeAccepted = false;
                this.tradeItemsCount = 0;
                this.tradeRecipientItemsCount = 0;
                return;
            }

            if (opcode === S_OPCODES.TRADE_CLOSE) {
                this.showDialogTrade = false;
                this.showDialogTradeConfirm = false;

                return;
            }

            if (opcode === S_OPCODES.TRADE_ITEMS) {
                this.tradeRecipientItemsCount = pdata[1] & 0xff;

                let l3 = 2;

                for (let i11 = 0; i11 < this.tradeRecipientItemsCount; i11++) {
                    this.tradeRecipientItems[i11] = Utility.getUnsignedShort(pdata, l3);
                    l3 += 2;
                    this.tradeRecipientItemCount[i11] = Utility.getUnsignedInt(pdata, l3);
                    l3 += 4;
                }

                this.tradeRecipientAccepted = false;
                this.tradeAccepted = false;

                return;
            }

            if (opcode === S_OPCODES.TRADE_RECIPIENT_STATUS) {
                let byte0 = pdata[1];

                if (byte0 === 1) {
                    this.tradeRecipientAccepted = true;
                    return;
                } else {
                    this.tradeRecipientAccepted = false;
                    return;
                }
            }

            if (opcode === S_OPCODES.SHOP_OPEN) {
                this.showDialogShop = true;

                let off = 1;
                let newItemCount = pdata[off++] & 0xff;
                let shopType = pdata[off++];

                this.shopSellPriceMod = pdata[off++] & 0xff;
                this.shopBuyPriceMod = pdata[off++] & 0xff;

                for (let itemIndex = 0; itemIndex < 40; itemIndex++) {
                    this.shopItem[itemIndex] = -1;
                }

                for (let itemIndex = 0; itemIndex < newItemCount; itemIndex++) {
                    this.shopItem[itemIndex] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.shopItemCount[itemIndex] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.shopItemPrice[itemIndex] = pdata[off++];
                }

                // shopType === 1 -> is a general shop
                if (shopType === 1) {
                    let l28 = 39;

                    for (let k33 = 0; k33 < this.inventoryItemsCount; k33++) {
                        if (l28 < newItemCount) {
                            break;
                        }

                        let flag2 = false;

                        for (let j39 = 0; j39 < 40; j39++) {
                            if (this.shopItem[j39] !== this.inventoryItemId[k33]) {
                                continue;
                            }

                            flag2 = true;
                            break;
                        }

                        if (this.inventoryItemId[k33] === 10) {
                            flag2 = true;
                        }

                        if (!flag2) {
                            this.shopItem[l28] = this.inventoryItemId[k33] & 32767;
                            this.shopItemCount[l28] = 0;
                            this.shopItemPrice[l28] = 0;
                            l28--;
                        }
                    }

                }

                if (this.shopSelectedItemIndex >= 0 && this.shopSelectedItemIndex < 40 && this.shopItem[this.shopSelectedItemIndex] !== this.shopSelectedItemType) {
                    this.shopSelectedItemIndex = -1;
                    this.shopSelectedItemType = -2;
                }

                return;
            }

            if (opcode === S_OPCODES.SHOP_CLOSE) {
                this.showDialogShop = false;
                return;
            }

            if (opcode === S_OPCODES.TRADE_STATUS) {
                let byte1 = pdata[1];

                if (byte1 === 1) {
                    this.tradeAccepted = true;
                    return;
                } else {
                    this.tradeAccepted = false;
                    return;
                }
            }

            if (opcode === S_OPCODES.GAME_SETTINGS) {
                this.optionCameraModeAuto = Utility.getUnsignedByte(pdata[1]) === 1;
                this.optionMouseButtonOne = Utility.getUnsignedByte(pdata[2]) === 1;
                this.optionSoundDisabled = Utility.getUnsignedByte(pdata[3]) === 1;

                return;
            }

            if (opcode === S_OPCODES.PRAYER_STATUS) {
                for (let j4 = 0; j4 < psize - 1; j4++) {
                    let on = pdata[j4 + 1] === 1;

                    if (!this.prayerOn[j4] && on) {
                        this.playSoundFile('prayeron');
                    }

                    if (this.prayerOn[j4] && !on) {
                        this.playSoundFile('prayeroff');
                    }

                    this.prayerOn[j4] = on;
                }

                return;
            }

            if (opcode === S_OPCODES.PLAYER_QUEST_LIST) {
                for (let k4 = 0; k4 < this.questCount; k4++) {
                    this.questComplete[k4] = pdata[k4 + 1] === 1;
                }

                return;
            }

            if (opcode === S_OPCODES.BANK_OPEN) {
                this.showDialogBank = true;

                let l4 = 1;

                this.newBankItemCount = pdata[l4++] & 0xff;
                this.bankItemsMax = pdata[l4++] & 0xff;

                for (let k11 = 0; k11 < this.newBankItemCount; k11++) {
                    this.newBankItems[k11] = Utility.getUnsignedShort(pdata, l4);
                    l4 += 2;
                    this.newBankItemsCount[k11] = Utility.getUnsignedInt2(pdata, l4);

                    if (this.newBankItemsCount[k11] >= 128) {
                        l4 += 4;
                    } else {
                        l4++;
                    }
                }

                this.updateBankItems();
                return;
            }

            if (opcode === S_OPCODES.BANK_CLOSE) {
                this.showDialogBank = false;
                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_EXPERIENCE_UPDATE) {
                let i5 = pdata[1] & 0xff;
                this.playerExperience[i5] = Utility.getUnsignedInt(pdata, 2);
                return;
            }

            if (opcode === S_OPCODES.DUEL_OPEN) {
                let j5 = Utility.getUnsignedShort(pdata, 1);

                if (this.playerServer[j5] !== null) {
                    this.duelOpponentName = this.playerServer[j5].name;
                }

                this.showDialogDuel = true;
                this.duelOfferItemCount = 0;
                this.duelOfferOpponentItemCount = 0;
                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;
                this.duelSettingsRetreat = false;
                this.duelSettingsMagic = false;
                this.duelSettingsPrayer = false;
                this.duelSettingsWeapons = false;

                return;
            }

            if (opcode === S_OPCODES.DUEL_CLOSE) {
                this.showDialogDuel = false;
                this.showDialogDuelConfirm = false;
                return;
            }

            if (opcode === S_OPCODES.TRADE_CONFIRM_OPEN) {
                this.showDialogTradeConfirm = true;
                this.tradeConfirmAccepted = false;
                this.showDialogTrade = false;

                let k5 = 1;

                this.tradeRecipientConfirmHash = Utility.getUnsignedLong(pdata, k5);
                k5 += 8;
                this.tradeRecipientConfirmItemsCount = pdata[k5++] & 0xff;

                for (let l11 = 0; l11 < this.tradeRecipientConfirmItemsCount; l11++) {
                    this.tradeRecipientConfirmItems[l11] = Utility.getUnsignedShort(pdata, k5);
                    k5 += 2;
                    this.tradeRecipientConfirmItemCount[l11] = Utility.getUnsignedInt(pdata, k5);
                    k5 += 4;
                }

                this.tradeConfirmItemsCount = pdata[k5++] & 0xff;

                for (let k17 = 0; k17 < this.tradeConfirmItemsCount; k17++) {
                    this.tradeConfirmItems[k17] = Utility.getUnsignedShort(pdata, k5);
                    k5 += 2;
                    this.tradeConfirmItemCount[k17] = Utility.getUnsignedInt(pdata, k5);
                    k5 += 4;
                }

                return;
            }

            if (opcode === S_OPCODES.DUEL_UPDATE) {
                this.duelOfferOpponentItemCount = pdata[1] & 0xff;

                let l5 = 2;

                for (let i12 = 0; i12 < this.duelOfferOpponentItemCount; i12++) {
                    this.duelOfferOpponentItemId[i12] = Utility.getUnsignedShort(pdata, l5);
                    l5 += 2;
                    this.duelOfferOpponentItemStack[i12] = Utility.getUnsignedInt(pdata, l5);
                    l5 += 4;
                }

                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;

                return;
            }

            if (opcode === S_OPCODES.DUEL_SETTINGS) {
                if (pdata[1] === 1) {
                    this.duelSettingsRetreat = true;
                } else {
                    this.duelSettingsRetreat = false;
                }

                if (pdata[2] === 1) {
                    this.duelSettingsMagic = true;
                } else {
                    this.duelSettingsMagic = false;
                }

                if (pdata[3] === 1) {
                    this.duelSettingsPrayer = true;
                } else {
                    this.duelSettingsPrayer = false;
                }

                if (pdata[4] === 1) {
                    this.duelSettingsWeapons = true;
                } else {
                    this.duelSettingsWeapons = false;
                }

                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;

                return;
            }

            if (opcode === S_OPCODES.BANK_UPDATE) {
                let i6 = 1;
                let itemsCountOld = pdata[i6++] & 0xff;
                let item = Utility.getUnsignedShort(pdata, i6);

                i6 += 2;

                let itemCount = Utility.getUnsignedInt2(pdata, i6);

                if (itemCount >= 128) {
                    i6 += 4;
                } else {
                    i6++;
                }

                if (itemCount === 0) {
                    this.newBankItemCount--;

                    for (let k25 = itemsCountOld; k25 < this.newBankItemCount; k25++) {
                        this.newBankItems[k25] = this.newBankItems[k25 + 1];
                        this.newBankItemsCount[k25] = this.newBankItemsCount[k25 + 1];
                    }
                } else {
                    this.newBankItems[itemsCountOld] = item;
                    this.newBankItemsCount[itemsCountOld] = itemCount;

                    if (itemsCountOld >= this.newBankItemCount) {
                        this.newBankItemCount = itemsCountOld + 1;
                    }
                }

                this.updateBankItems();
                return;
            }

            if (opcode === S_OPCODES.INVENTORY_ITEM_UPDATE) {
                let offset = 1;
                let stack = 1;
                let index = pdata[offset++] & 0xff;
                let id = Utility.getUnsignedShort(pdata, offset);

                offset += 2;

                if (GameData.itemStackable[id & 32767] === 0) {
                    stack = Utility.getUnsignedInt2(pdata, offset);

                    if (stack >= 128) {
                        offset += 4;
                    } else {
                        offset++;
                    }
                }

                this.inventoryItemId[index] = id & 32767;
                this.inventoryEquipped[index] = (id / 32768) | 0;
                this.inventoryItemStackCount[index] = stack;

                if (index >= this.inventoryItemsCount) {
                    this.inventoryItemsCount = index + 1;
                }

                return;
            }

            if (opcode === S_OPCODES.INVENTORY_ITEM_REMOVE) {
                let index = pdata[1] & 0xff;

                this.inventoryItemsCount--;

                for (let l12 = index; l12 < this.inventoryItemsCount; l12++) {
                    this.inventoryItemId[l12] = this.inventoryItemId[l12 + 1];
                    this.inventoryItemStackCount[l12] = this.inventoryItemStackCount[l12 + 1];
                    this.inventoryEquipped[l12] = this.inventoryEquipped[l12 + 1];
                }

                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_UPDATE) {
                let l6 = 1;
                let i13 = pdata[l6++] & 0xff;

                this.playerStatCurrent[i13] = Utility.getUnsignedByte(pdata[l6++]);
                this.playerStatBase[i13] = Utility.getUnsignedByte(pdata[l6++]);
                this.playerExperience[i13] = Utility.getUnsignedInt(pdata, l6);
                l6 += 4;

                return;
            }

            if (opcode === S_OPCODES.DUEL_OPPONENT_ACCEPTED) {
                let byte2 = pdata[1];

                if (byte2 === 1) {
                    this.duelOfferOpponentAccepted = true;
                    return;
                } else {
                    this.duelOfferOpponentAccepted = false;
                    return;
                }
            }

            if (opcode === S_OPCODES.DUEL_ACCEPTED) {
                let byte3 = pdata[1];

                if (byte3 === 1) {
                    this.duelOfferAccepted = true;
                    return;
                } else {
                    this.duelOfferAccepted = false;
                    return;
                }
            }

            if (opcode === S_OPCODES.DUEL_CONFIRM_OPEN) {
                this.showDialogDuelConfirm = true;
                this.duelAccepted = false;
                this.showDialogDuel = false;

                let off = 1;

                this.duelOpponentNameHash = Utility.getUnsignedLong(pdata, off);
                off += 8;
                this.duelOpponentItemsCount = pdata[off++] & 0xff;

                for (let j13 = 0; j13 < this.duelOpponentItemsCount; j13++) {
                    this.duelOpponentItems[j13] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.duelOpponentItemCount[j13] = Utility.getUnsignedInt(pdata, off);
                    off += 4;
                }

                this.duelItemsCount = pdata[off++] & 0xff;

                for (let j18 = 0; j18 < this.duelItemsCount; j18++) {
                    this.duelItems[j18] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.duelItemCount[j18] = Utility.getUnsignedInt(pdata, off);
                    off += 4;
                }

                this.duelOptionRetreat = pdata[off++] & 0xff;
                this.duelOptionMagic = pdata[off++] & 0xff;
                this.duelOptionPrayer = pdata[off++] & 0xff;
                this.duelOptionWeapons = pdata[off++] & 0xff;

                return;
            }

            if (opcode === S_OPCODES.SOUND) {
                let s = fromCharArray(pdata.slice(1, psize));
                this.playSoundFile(s);
                return;
            }

            if (opcode === S_OPCODES.TELEPORT_BUBBLE) {
                if (this.teleportBubbleCount < 50) {
                    let type = pdata[1] & 0xff;
                    let x = pdata[2] + this.localRegionX;
                    let y = pdata[3] + this.localRegionY;
                    this.teleportBubbleType[this.teleportBubbleCount] = type;
                    this.teleportBubbleTime[this.teleportBubbleCount] = 0;
                    this.teleportBubbleX[this.teleportBubbleCount] = x;
                    this.teleportBubbleY[this.teleportBubbleCount] = y;
                    this.teleportBubbleCount++;
                }

                return;
            }

            if (opcode === S_OPCODES.WELCOME) {
                if (!this.welcomScreenAlreadyShown) {
                    this.welcomeLastLoggedInIP = Utility.getUnsignedInt(pdata, 1);
                    this.welcomeLastLoggedInDays = Utility.getUnsignedShort(pdata, 5);
                    this.welcomeRecoverySetDays = pdata[7] & 0xff;
                    this.welcomeUnreadMessages = Utility.getUnsignedShort(pdata, 8);
                    this.showDialogWelcome = true;
                    this.welcomScreenAlreadyShown = true;
                    this.welcomeLastLoggedInHost = null;
                }

                return;
            }

            if (opcode === S_OPCODES.SERVER_MESSAGE) {
                this.serverMessage = fromCharArray(pdata.slice(1, psize));
                this.showDialogServermessage = true;
                this.serverMessageBoxTop = false;

                return;
            }

            if (opcode === S_OPCODES.SERVER_MESSAGE_ONTOP) {
                this.serverMessage = fromCharArray(pdata.slice(1, psize));
                this.showDialogServermessage = true;
                this.serverMessageBoxTop = true;

                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_FATIGUE) {
                this.statFatigue = Utility.getUnsignedShort(pdata, 1);
                return;
            }

            if (opcode === S_OPCODES.SLEEP_OPEN) {
                if (!this.isSleeping) {
                    this.fatigueSleeping = this.statFatigue;
                }

                this.isSleeping = true;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.surface.readSleepWord(this.spriteTexture + 1, pdata);
                this.sleepingStatusText = null;

                return;
            }

            if (opcode === S_OPCODES.PLAYER_STAT_FATIGUE_ASLEEP) {
                this.fatigueSleeping = Utility.getUnsignedShort(pdata, 1);
                return;
            }

            if (opcode === S_OPCODES.SLEEP_CLOSE) {
                this.isSleeping = false;
                return;
            }

            if (opcode === S_OPCODES.SLEEP_INCORRECT) {
                this.sleepingStatusText = 'Incorrect - Please wait...';
                return;
            }

            if (opcode === S_OPCODES.SYSTEM_UPDATE) {
                this.systemUpdate = Utility.getUnsignedShort(pdata, 1) * 32;
                return;
            }
        } catch (e) {
            console.error(e);

            if (this.packetErrorCount < 3) {
                let s1 = e.stack;
                let slen = s1.length;

                this.clientStream.newPacket(C_OPCODES.PACKET_EXCEPTION);
                this.clientStream.putShort(slen);
                this.clientStream.putString(s1);
                this.clientStream.putShort(slen = (s1 = 'p-type: ' + opcode + '(' + ptype + ') p-size:' + psize).length);
                this.clientStream.putString(s1);
                this.clientStream.putShort(slen = (s1 = 'rx:' + this.localRegionX + ' ry:' + this.localRegionY + ' num3l:' + this.objectCount).length);
                this.clientStream.putString(s1);

                s1 = '';

                for (let l18 = 0; l18 < 80 && l18 < psize; l18++) {
                    s1 = s1 + pdata[l18] + ' ';
                }

                this.clientStream.putShort(s1.length);
                this.clientStream.putString(s1);
                this.clientStream.sendPacket();
                this.packetErrorCount++;
            }

            this.clientStream.closeStream();
            this.resetLoginVars();
        }
    }

    drawUiTabPlayerInfo(nomenus) {
        let uiX = this.surface.width2 - 199;
        let uiY = 36;

        this.surface._drawSprite_from3(uiX - 49, 3, this.spriteMedia + 3);

        let uiWidth = 196;
        let uiHeight = 275;
        let l = 0;
        let k = l = Surface.rgbToLong(160, 160, 160);

        if (this.uiTabPlayerInfoSubTab === 0) {
            k = Surface.rgbToLong(220, 220, 220);
        } else {
            l = Surface.rgbToLong(220, 220, 220);
        }

        this.surface.drawBoxAlpha(uiX, uiY, (uiWidth / 2) | 0, 24, k, 128);
        this.surface.drawBoxAlpha(uiX + ((uiWidth / 2) | 0), uiY, (uiWidth / 2) | 0, 24, l, 128);
        this.surface.drawBoxAlpha(uiX, uiY + 24, uiWidth, uiHeight - 24, Surface.rgbToLong(220, 220, 220), 128);
        this.surface.drawLineHoriz(uiX, uiY + 24, uiWidth, 0);
        this.surface.drawLineVert(uiX + ((uiWidth / 2) | 0), uiY, 24, 0);
        this.surface.drawStringCenter('Stats', uiX + ((uiWidth / 4) | 0), uiY + 16, 4, 0);
        this.surface.drawStringCenter('Quests', uiX + ((uiWidth / 4) | 0) + ((uiWidth / 2) | 0), uiY + 16, 4, 0);

        if (this.uiTabPlayerInfoSubTab === 0) {
            let i1 = 72;
            let k1 = -1;

            this.surface.drawString('Skills', uiX + 5, i1, 3, 0xffff00);

            i1 += 13;

            for (let l1 = 0; l1 < 9; l1++) {
                let i2 = 0xffffff;

                if (this.mouseX > uiX + 3 && this.mouseY >= i1 - 11 && this.mouseY < i1 + 2 && this.mouseX < uiX + 90) {
                    i2 = 0xff0000;
                    k1 = l1;
                }

                this.surface.drawString(this.skillNameShort[l1] + ':@yel@' + this.playerStatCurrent[l1] + '/' + this.playerStatBase[l1], uiX + 5, i1, 1, i2);
                i2 = 0xffffff;

                if (this.mouseX >= uiX + 90 && this.mouseY >= i1 - 13 - 11 && this.mouseY < (i1 - 13) + 2 && this.mouseX < uiX + 196) {
                    i2 = 0xff0000;
                    k1 = l1 + 9;
                }

                this.surface.drawString(this.skillNameShort[l1 + 9] + ':@yel@' + this.playerStatCurrent[l1 + 9] + '/' + this.playerStatBase[l1 + 9], (uiX + ((uiWidth / 2) | 0)) - 5, i1 - 13, 1, i2);
                i1 += 13;
            }

            this.surface.drawString('Quest Points:@yel@' + this.playerQuestPoints, (uiX + ((uiWidth / 2) | 0)) - 5, i1 - 13, 1, 0xffffff);
            i1 += 12;
            this.surface.drawString('Fatigue: @yel@' + (((this.statFatigue * 100) / 750) | 0) + '%', uiX + 5, i1 - 13, 1, 0xffffff);
            i1 += 8;
            this.surface.drawString('Equipment Status', uiX + 5, i1, 3, 0xffff00);
            i1 += 12;

            for (let j2 = 0; j2 < 3; j2++) {
                this.surface.drawString(this.equipmentStatNames[j2] + ':@yel@' + this.playerStatEquipment[j2], uiX + 5, i1, 1, 0xffffff);

                if (j2 < 2) {
                    this.surface.drawString(this.equipmentStatNames[j2 + 3] + ':@yel@' + this.playerStatEquipment[j2 + 3], uiX + ((uiWidth / 2) | 0) + 25, i1, 1, 0xffffff);
                }

                i1 += 13;
            }

            i1 += 6;
            this.surface.drawLineHoriz(uiX, i1 - 15, uiWidth, 0);

            if (k1 !== -1) {
                this.surface.drawString(this.skillNamesLong[k1] + ' skill', uiX + 5, i1, 1, 0xffff00);
                i1 += 12;

                let k2 = this.experienceArray[0];

                for (let i3 = 0; i3 < 98; i3++) {
                    if (this.playerExperience[k1] >= this.experienceArray[i3]) {
                        k2 = this.experienceArray[i3 + 1];
                    }
                }

                this.surface.drawString('Total xp: ' + ((this.playerExperience[k1] / 4) | 0), uiX + 5, i1, 1, 0xffffff);
                i1 += 12;
                this.surface.drawString('Next level at: ' + ((k2 / 4) | 0), uiX + 5, i1, 1, 0xffffff);
            } else {
                this.surface.drawString('Overall levels', uiX + 5, i1, 1, 0xffff00);
                i1 += 12;
                let l2 = 0;

                for (let j3 = 0; j3 < this.playerStatCount; j3++) {
                    l2 += this.playerStatBase[j3];
                }

                this.surface.drawString('Skill total: ' + l2, uiX + 5, i1, 1, 0xffffff);
                i1 += 12;
                this.surface.drawString('Combat level: ' + this.localPlayer.level, uiX + 5, i1, 1, 0xffffff);
                i1 += 12;
            }
        }

        if (this.uiTabPlayerInfoSubTab === 1) {
            this.panelQuestList.clearList(this.controlListQuest);
            this.panelQuestList.addListEntry(this.controlListQuest, 0, '@whi@Quest-list (green=completed)');

            for (let j1 = 0; j1 < this.questCount; j1++) {
                this.panelQuestList.addListEntry(this.controlListQuest, j1 + 1, (this.questComplete[j1] ? '@gre@' : '@red@') + this.questName[j1]);
            }

            this.panelQuestList.drawPanel();
        }

        if (!nomenus) {
            return;
        }

        let mouseX = this.mouseX - (this.surface.width2 - 199);
        let mouseY = this.mouseY - 36;

        if (mouseX >= 0 && mouseY >= 0 && mouseX < uiWidth && mouseY < uiHeight) {
            if (this.uiTabPlayerInfoSubTab === 1) {
                this.panelQuestList.handleMouse(mouseX + (this.surface.width2 - 199), mouseY + 36, this.lastMouseButtonDown, this.mouseButtonDown, this.mouseScrollDelta);
            }

            if (mouseY <= 24 && this.mouseButtonClick === 1) {
                if (mouseX < 98) {
                    this.uiTabPlayerInfoSubTab = 0;
                    return;
                }

                if (mouseX > 98) {
                    this.uiTabPlayerInfoSubTab = 1;
                }
            }
        }
    }

    createRightClickMenu() {
        let i = 2203 - (this.localRegionY + this.planeHeight + this.regionY);

        if (this.localRegionX + this.planeWidth + this.regionX >= 2640) {
            i = -50;
        }

        let j = -1;

        for (let k = 0; k < this.objectCount; k++) {
            this.objectAlreadyInMenu[k] = false;
        }

        for (let l = 0; l < this.wallObjectCount; l++) {
            this.wallObjectAlreadyInMenu[l] = false;
        }

        let i1 = this.scene.getMousePickedCount();
        let objs = this.scene.getMousePickedModels();
        let plyrs = this.scene.getMousePickedFaces();

        for (let menuIdx = 0; menuIdx < i1; menuIdx++) {
            if (this.menuItemsCount > 200) {
                break;
            }

            let pid = plyrs[menuIdx];
            let gameModel = objs[menuIdx];

            if (gameModel.faceTag[pid] <= 65535 || gameModel.faceTag[pid] >= 200000 && gameModel.faceTag[pid] <= 300000)  {
                if (gameModel === this.scene.view) {
                    let idx = gameModel.faceTag[pid] % 10000;
                    let type = (gameModel.faceTag[pid] / 10000) | 0;

                    if (type === 1) {
                        let s = '';
                        let k3 = 0;

                        if (this.localPlayer.level > 0 && this.players[idx].level > 0) {
                            k3 = this.localPlayer.level - this.players[idx].level;
                        }

                        if (k3 < 0) {
                            s = '@or1@';
                        }

                        if (k3 < -3) {
                            s = '@or2@';
                        }

                        if (k3 < -6) {
                            s = '@or3@';
                        }

                        if (k3 < -9) {
                            s = '@red@';
                        }

                        if (k3 > 0) {
                            s = '@gr1@';
                        }

                        if (k3 > 3) {
                            s = '@gr2@';
                        }

                        if (k3 > 6) {
                            s = '@gr3@';
                        }

                        if (k3 > 9) {
                            s = '@gre@';
                        }

                        s = ' ' + s + '(level-' + this.players[idx].level + ')';

                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 1 || GameData.spellType[this.selectedSpell] === 2) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;
                                this.menuItemID[this.menuItemsCount] = 800;
                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;
                            this.menuItemID[this.menuItemsCount] = 810;
                            this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                            this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (i > 0 && (((this.players[idx].currentY - 64) / this.magicLoc + this.planeHeight + this.regionY) | 0) < 2203) {
                                this.menuItemText1[this.menuItemsCount] = 'Attack';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;

                                if (k3 >= 0 && k3 < 5) {
                                    this.menuItemID[this.menuItemsCount] = 805;
                                } else {
                                    this.menuItemID[this.menuItemsCount] = 2805;
                                }

                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuItemsCount++;
                            } else if (this.members) {
                                this.menuItemText1[this.menuItemsCount] = 'Duel with';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;
                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuItemID[this.menuItemsCount] = 2806;
                                this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Trade with';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;
                            this.menuItemID[this.menuItemsCount] = 2810;
                            this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuItemsCount++;
                            this.menuItemText1[this.menuItemsCount] = 'Follow';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + s;
                            this.menuItemID[this.menuItemsCount] = 2820;
                            this.menuSourceType[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuItemsCount++;
                        }
                    } else if (type === 2) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 3) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                                this.menuItemID[this.menuItemsCount] = 200;
                                this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                                this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.groundItemId[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuItemID[this.menuItemsCount] = 210;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuSourceType[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            this.menuItemText1[this.menuItemsCount] = 'Take';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuItemID[this.menuItemsCount] = 220;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuSourceType[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuItemsCount++;
                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuItemID[this.menuItemsCount] = 3200;
                            this.menuSourceType[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuItemsCount++;
                        }
                    } else if (type === 3) {
                        let s1 = '';
                        let levelDiff = -1;
                        let id = this.npcs[idx].npcId;

                        if (GameData.npcAttackable[id] > 0) {
                            let npcLevel = ((GameData.npcAttack[id] + GameData.npcDefense[id] + GameData.npcStrength[id] + GameData.npcHits[id]) / 4) | 0;
                            let playerLevel = ((this.playerStatBase[0] + this.playerStatBase[1] + this.playerStatBase[2] + this.playerStatBase[3] + 27) / 4) | 0;

                            levelDiff = playerLevel - npcLevel;
                            s1 = '@yel@';

                            if (levelDiff < 0) {
                                s1 = '@or1@';
                            }

                            if (levelDiff < -3) {
                                s1 = '@or2@';
                            }

                            if (levelDiff < -6) {
                                s1 = '@or3@';
                            }

                            if (levelDiff < -9) {
                                s1 = '@red@';
                            }

                            if (levelDiff > 0) {
                                s1 = '@gr1@';
                            }

                            if (levelDiff > 3) {
                                s1 = '@gr2@';
                            }

                            if (levelDiff > 6) {
                                s1 = '@gr3@';
                            }

                            if (levelDiff > 9) {
                                s1 = '@gre@';
                            }

                            s1 = ' ' + s1 + '(level-' + npcLevel + ')';
                        }

                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 2) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                                this.menuItemID[this.menuItemsCount] = 700;
                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuSourceType[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuItemID[this.menuItemsCount] = 710;
                            this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                            this.menuSourceType[this.menuItemsCount] = this.npcs[idx].serverIndex;
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (GameData.npcAttackable[id] > 0) {
                                this.menuItemText1[this.menuItemsCount] = 'Attack';
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId] + s1;

                                if (levelDiff >= 0) {
                                    this.menuItemID[this.menuItemsCount] = 715;
                                } else {
                                    this.menuItemID[this.menuItemsCount] = 2715;
                                }

                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuSourceType[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Talk-to';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuItemID[this.menuItemsCount] = 720;
                            this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                            this.menuSourceType[this.menuItemsCount] = this.npcs[idx].serverIndex;
                            this.menuItemsCount++;

                            if (GameData.npcCommand[id] !== '') {
                                this.menuItemText1[this.menuItemsCount] = GameData.npcCommand[id];
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                                this.menuItemID[this.menuItemsCount] = 725;
                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuSourceType[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuItemID[this.menuItemsCount] = 3700;
                            this.menuSourceType[this.menuItemsCount] = this.npcs[idx].npcId;
                            this.menuItemsCount++;
                        }
                    }
                } else if (gameModel !== null && gameModel.key >= 10000) {
                    let idx = gameModel.key - 10000;
                    let id = this.wallObjectId[idx];

                    if (!this.wallObjectAlreadyInMenu[idx]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 4) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuItemID[this.menuItemsCount] = 300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuItemID[this.menuItemsCount] = 310;
                            this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                            this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                            this.menuSourceType[this.menuItemsCount] = this.wallObjectDirection[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.wallObjectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuItemID[this.menuItemsCount] = 320;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.wallObjectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuItemID[this.menuItemsCount] = 2300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuItemID[this.menuItemsCount] = 3300;
                            this.menuSourceType[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.wallObjectAlreadyInMenu[idx] = true;
                    }
                } else if (gameModel !== null && gameModel.key >= 0) {
                    let idx = gameModel.key;
                    let id = this.objectId[idx];

                    if (!this.objectAlreadyInMenu[idx]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 5) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuItemID[this.menuItemsCount] = 400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuTargetIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuItemID[this.menuItemsCount] = 410;
                            this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                            this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                            this.menuSourceType[this.menuItemsCount] = this.objectDirection[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                            this.menuTargetIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.objectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuItemID[this.menuItemsCount] = 420;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.objectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuItemID[this.menuItemsCount] = 2400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuSourceType[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuItemID[this.menuItemsCount] = 3400;
                            this.menuSourceType[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.objectAlreadyInMenu[idx] = true;
                    }
                } else {
                    if (pid >= 0) {
                        pid = gameModel.faceTag[pid] - 200000;
                    }

                    if (pid >= 0) {
                        j = pid;
                    }
                }
            }
        }

        if (this.selectedSpell >= 0 && GameData.spellType[this.selectedSpell] <= 1) {
            this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on self';
            this.menuItemText2[this.menuItemsCount] = '';
            this.menuItemID[this.menuItemsCount] = 1000;
            this.menuSourceType[this.menuItemsCount] = this.selectedSpell;
            this.menuItemsCount++;
        }

        if (j !== -1) {
            if (this.selectedSpell >= 0) {
                if (GameData.spellType[this.selectedSpell] === 6) {
                    this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on ground';
                    this.menuItemText2[this.menuItemsCount] = '';
                    this.menuItemID[this.menuItemsCount] = 900;
                    this.menuItemX[this.menuItemsCount] = this.world.localX[j];
                    this.menuItemY[this.menuItemsCount] = this.world.localY[j];
                    this.menuSourceType[this.menuItemsCount] = this.selectedSpell;
                    this.menuItemsCount++;

                    return;
                }
            } else if (this.selectedItemInventoryIndex < 0) {
                this.menuItemText1[this.menuItemsCount] = 'Walk here';
                this.menuItemText2[this.menuItemsCount] = '';
                this.menuItemID[this.menuItemsCount] = 920;
                this.menuItemX[this.menuItemsCount] = this.world.localX[j];
                this.menuItemY[this.menuItemsCount] = this.world.localY[j];
                this.menuItemsCount++;
            }
        }
    }

    async handleInputs() {
        if (this.errorLoadingCodebase) {
            return;
        }

        if (this.errorLoadingMemory) {
            return;
        }

        if (this.errorLoadingData) {
            return;
        }

        try {
            this.loginTimer++;

            if (this.loggedIn === 0) {
                this.mouseActionTimeout = 0;
                await this.handleLoginScreenInput();
            }

            if (this.loggedIn === 1) {
                this.mouseActionTimeout++;
                await this.handleGameInput();
            }

            this.lastMouseButtonDown = 0;
            this.cameraRotationTime++;

            if (this.cameraRotationTime > 500) {
                this.cameraRotationTime = 0;

                let i = (Math.random() * 4) | 0;

                if ((i & 1) === 1) {
                    this.cameraRotationX += this.cameraRotationXIncrement;
                }

                if ((i & 2) === 2) {
                    this.cameraRotationY += this.cameraRotationYIncrement;
                }
            }

            if (this.cameraRotationX < -50) {
                this.cameraRotationXIncrement = 2;
            }

            if (this.cameraRotationX > 50) {
                this.cameraRotationXIncrement = -2;
            }

            if (this.cameraRotationY < -50) {
                this.cameraRotationYIncrement = 2;
            }

            if (this.cameraRotationY > 50) {
                this.cameraRotationYIncrement = -2;
            }

            if (this.messageTabFlashAll > 0) {
                this.messageTabFlashAll--;
            }

            if (this.messageTabFlashHistory > 0) {
                this.messageTabFlashHistory--;
            }

            if (this.messageTabFlashQuest > 0) {
                this.messageTabFlashQuest--;
            }

            if (this.messageTabFlashPrivate > 0) {
                this.messageTabFlashPrivate--;
                return;
            }
        } catch (e) {
            // OutOfMemory
            console.error(e);
            this.disposeAndCollect();
            this.errorLoadingMemory = true;
        }
    }

    async handleLoginScreenInput() {
        if (this.worldFullTimeout > 0) {
            this.worldFullTimeout--;
        }

        if (this.loginScreen === 0) {
            this.panelLoginWelcome.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown);

            if (this.panelLoginWelcome.isClicked(this.controlWelcomeNewuser)) {
                this.loginScreen = 1;
            }

            if (this.panelLoginWelcome.isClicked(this.controlWelcomeExistinguser)) {
                this.loginScreen = 2;
                this.panelLoginExistinguser.updateText(this.controlLoginStatus, 'Please enter your username and password');
                this.panelLoginExistinguser.updateText(this.controlLoginUser, '');
                this.panelLoginExistinguser.updateText(this.controlLoginPass, '');
                this.panelLoginExistinguser.setFocus(this.controlLoginUser);
                return;
            }
        } else if (this.loginScreen === 1) {
            this.panelLoginNewuser.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown);

            if (this.panelLoginNewuser.isClicked(this.controlLoginNewOk)) {
                this.loginScreen = 0;
                return;
            }
        } else if (this.loginScreen === 2) {
            this.panelLoginExistinguser.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown);

            if (this.panelLoginExistinguser.isClicked(this.controlLoginCancel)) {
                this.loginScreen = 0;
            }

            if (this.panelLoginExistinguser.isClicked(this.controlLoginUser)) {
                this.panelLoginExistinguser.setFocus(this.controlLoginPass);
            }

            if (this.panelLoginExistinguser.isClicked(this.controlLoginPass) || this.panelLoginExistinguser.isClicked(this.controlLoginOk)) {
                this.loginUser = this.panelLoginExistinguser.getText(this.controlLoginUser);
                this.loginPass = this.panelLoginExistinguser.getText(this.controlLoginPass);
                await this.login(this.loginUser, this.loginPass, false);
            }
        }
    }

    async loadMaps() {
        this.world.mapPack = await this.readDataFile('maps' + VERSION.MAPS + '.jag', 'map', 70);

        if (this.members) {
            this.world.memberMapPack = await this.readDataFile('maps' + VERSION.MAPS + '.mem', 'members map', 75);
        }

        this.world.landscapePack = await this.readDataFile('land' + VERSION.MAPS + '.jag', 'landscape', 80);

        if (this.members) {
            this.world.memberLandscapePack = await this.readDataFile('land' + VERSION.MAPS + '.mem', 'members landscape', 85);
        }
    }

    createModel(x, y, direction, id, count) {
        let x1 = x;
        let y1 = y;
        let x2 = x;
        let y2 = y;
        let j2 = GameData.wallObjectTextureFront[id];
        let k2 = GameData.wallObjectTextureBack[id];
        let l2 = GameData.wallObjectHeight[id];
        let gameModel = GameModel._from2(4, 1);

        if (direction === 0) {
            x2 = x + 1;
        }

        if (direction === 1) {
            y2 = y + 1;
        }

        if (direction === 2) {
            x1 = x + 1;
            y2 = y + 1;
        }

        if (direction === 3) {
            x2 = x + 1;
            y2 = y + 1;
        }

        x1 *= this.magicLoc;
        y1 *= this.magicLoc;
        x2 *= this.magicLoc;
        y2 *= this.magicLoc;

        let i3 = gameModel.vertexAt(x1, -this.world.getElevation(x1, y1), y1);
        let j3 = gameModel.vertexAt(x1, -this.world.getElevation(x1, y1) - l2, y1);
        let k3 = gameModel.vertexAt(x2, -this.world.getElevation(x2, y2) - l2, y2);
        let l3 = gameModel.vertexAt(x2, -this.world.getElevation(x2, y2), y2);
        let ai = new Int32Array([i3, j3, k3, l3]);

        gameModel.createFace(4, ai, j2, k2);
        gameModel._setLight_from6(false, 60, 24, -50, -10, -50);

        if (x >= 0 && y >= 0 && x < 96 && y < 96) {
            this.scene.addModel(gameModel);
        }

        gameModel.key = count + 10000;

        return gameModel;
    }
}

module.exports = mudclient;
},{"./chat-message":9,"./game-buffer":11,"./game-character":12,"./game-connection":13,"./game-data":14,"./game-model":15,"./lib/graphics/color":17,"./lib/graphics/font":18,"./opcodes/client":26,"./opcodes/server":27,"./panel":29,"./scene":32,"./stream-audio-player":33,"./surface":35,"./surface-sprite":34,"./utility":36,"./version":37,"./word-filter":38,"./world":39,"long":5}],26:[function(require,module,exports){
module.exports={
    "APPEARANCE": 235,
    "BANK_CLOSE": 212,
    "BANK_DEPOSIT": 23,
    "BANK_WITHDRAW": 22,
    "CAST_GROUND": 158,
    "CAST_GROUNDITEM": 249,
    "CAST_INVITEM": 4,
    "CAST_NPC": 50,
    "CAST_OBJECT": 99,
    "CAST_PLAYER": 229,
    "CAST_SELF": 137,
    "CAST_WALLOBJECT": 180,
    "CHAT": 216,
    "CHOOSE_OPTION": 116,
    "CLOSE_CONNECTION": 31,
    "COMBAT_STYLE": 29,
    "COMMAND": 38,
    "DUEL_ACCEPT": 176,
    "DUEL_CONFIRM_ACCEPT": 77,
    "DUEL_DECLINE": 197,
    "DUEL_ITEM_UPDATE": 33,
    "DUEL_SETTINGS": 8,
    "FRIEND_ADD": 195,
    "FRIEND_REMOVE": 167,
    "GROUNDITEM_TAKE": 247,
    "IGNORE_ADD": 132,
    "IGNORE_REMOVE": 241,
    "INV_CMD": 90,
    "INV_DROP": 246,
    "INV_UNEQUIP": 170,
    "INV_WEAR": 169,
    "KNOWN_PLAYERS": 163,
    "LOGIN": 0,
    "LOGOUT": 102,
    "NPC_ATTACK": 190,
    "NPC_CMD": 202,
    "NPC_TALK": 153,
    "OBJECT_CMD1": 136,
    "OBJECT_CMD2": 79,
    "PACKET_EXCEPTION": 3,
    "PING": 67,
    "PLAYER_ATTACK": 171,
    "PLAYER_DUEL": 103,
    "PLAYER_FOLLOW": 165,
    "PLAYER_TRADE": 142,
    "PM": 218,
    "PRAYER_OFF": 254,
    "PRAYER_ON": 60,
    "REPORT_ABUSE": 206,
    "SESSION": 32,
    "SETTINGS_GAME": 111,
    "SETTINGS_PRIVACY": 64,
    "SHOP_BUY": 236,
    "SHOP_CLOSE": 166,
    "SHOP_SELL": 221,
    "SLEEP_WORD": 45,
    "TRADE_ACCEPT": 55,
    "TRADE_CONFIRM_ACCEPT": 104,
    "TRADE_DECLINE": 230,
    "TRADE_ITEM_UPDATE": 46,
    "USEWITH_GROUNDITEM": 53,
    "USEWITH_INVITEM": 91,
    "USEWITH_NPC": 135,
    "USEWITH_OBJECT": 115,
    "USEWITH_PLAYER": 113,
    "USEWITH_WALLOBJECT": 161,
    "WALK": 187,
    "WALK_ACTION": 16,
    "WALL_OBJECT_COMMAND1": 14,
    "WALL_OBJECT_COMMAND2": 127
}
},{}],27:[function(require,module,exports){
module.exports={
    "APPEARANCE": 59,
    "BANK_CLOSE": 203,
    "BANK_OPEN": 42,
    "BANK_UPDATE": 249,
    "CLOSE_CONNECTION": 4,
    "DUEL_ACCEPTED": 210,
    "DUEL_CLOSE": 225,
    "DUEL_CONFIRM_OPEN": 172,
    "DUEL_OPEN": 176,
    "DUEL_OPPONENT_ACCEPTED": 253,
    "DUEL_SETTINGS": 30,
    "DUEL_UPDATE": 6,
    "FRIEND_LIST": 71,
    "FRIEND_MESSAGE": 120,
    "FRIEND_STATUS_CHANGE": 149,
    "GAME_SETTINGS": 240,
    "IGNORE_LIST": 109,
    "INVENTORY_ITEMS": 53,
    "INVENTORY_ITEM_REMOVE": 123,
    "INVENTORY_ITEM_UPDATE": 90,
    "LOGOUT_DENY": 183,
    "MESSAGE": 131,
    "OPTION_LIST": 245,
    "OPTION_LIST_CLOSE": 252,
    "PLAYER_DIED": 83,
    "PLAYER_QUEST_LIST": 5,
    "PLAYER_STAT_EQUIPMENT_BONUS": 153,
    "PLAYER_STAT_EXPERIENCE_UPDATE": 33,
    "PLAYER_STAT_FATIGUE": 114,
    "PLAYER_STAT_FATIGUE_ASLEEP": 244,
    "PLAYER_STAT_LIST": 156,
    "PLAYER_STAT_UPDATE": 159,
    "PRAYER_STATUS": 206,
    "PRIVACY_SETTINGS": 51,
    "REGION_ENTITY_UPDATE": 211,
    "REGION_GROUND_ITEMS": 99,
    "REGION_NPCS": 79,
    "REGION_NPC_UPDATE": 104,
    "REGION_OBJECTS": 48,
    "REGION_PLAYERS": 191,
    "REGION_PLAYER_UPDATE": 234,
    "REGION_WALL_OBJECTS": 91,
    "SERVER_MESSAGE": 89,
    "SERVER_MESSAGE_ONTOP": 222,
    "SHOP_CLOSE": 137,
    "SHOP_OPEN": 101,
    "SLEEP_CLOSE": 84,
    "SLEEP_INCORRECT": 194,
    "SLEEP_OPEN": 117,
    "SOUND": 204,
    "SYSTEM_UPDATE": 52,
    "TELEPORT_BUBBLE": 36,
    "TRADE_CLOSE": 128,
    "TRADE_CONFIRM_OPEN": 20,
    "TRADE_ITEMS": 97,
    "TRADE_OPEN": 92,
    "TRADE_RECIPIENT_STATUS": 162,
    "TRADE_STATUS": 15,
    "WELCOME": 182,
    "WORLD_INFO": 25
}
},{}],28:[function(require,module,exports){
const Long = require('long');

function toCharArray(s) {
    let a = new Uint16Array(s.length);

    for (let i = 0; i < s.length; i += 1) {
        a[i] = s.charCodeAt(i);
    }

    return a;
}

class Packet {
    constructor() {
        this.readTries = 0;
        this.maxReadTries = 0;
        this.packetStart = 0;
        this.packetData = null;
        this.isaacIncoming = null;
        this.isaacOutgoing = null;
        this.length = 0;
        this.socketException = false;
        this.delay = 0;

        this.packetEnd = 3;
        this.packet8Check = 8;
        this.packetMaxLength = 5000;
        this.socketExceptionMessage = '';
    }

    seedIsaac(seed) {
        // TODO toggle ISAAC
        //this.isaacIncoming = new ISAAC(seed);
        //this.isaacOutgoing = new ISAAC(seed);
    }

    async readBytes(len, buff) {
        await this.readStreamBytes(len, 0, buff);
    }

    async readPacket(buff) {
        try {
            this.readTries++;

            if (this.maxReadTries > 0 && this.readTries > this.maxReadTries) {
                this.socketException = true;
                this.socketExceptionMessage = 'time-out';
                this.maxReadTries += this.maxReadTries;

                return 0;
            }

            if (this.length === 0 && this.availableStream() >= 2) {
                this.length = await this.readStream();

                if (this.length >= 160) {
                    this.length = (this.length - 160) * 256 + await this.readStream();
                }
            }

            if (this.length > 0 && this.availableStream() >= this.length) {
                if (this.length >= 160) { 
                    await this.readBytes(this.length, buff);
                } else {
                    buff[this.length - 1] = await this.readStream() & 0xff;

                    if (this.length > 1) {
                        await this.readBytes(this.length - 1, buff);
                    }
                }

                let i = this.length;

                this.length = 0;
                this.readTries = 0;

                return i;
            }
        } catch (e) {
            this.socketException = true;
            this.socketExceptionMessage = e.message;
        }

        return 0;
    }

    hasPacket() {
        return this.packetStart > 0;
    }

    writePacket(i) {
        if (this.socketException) {
            this.packetetStart = 0;
            this.packetetEnd = 3;
            this.socketException = false;

            throw Error(this.socketExceptionMessage);
        }

        this.delay++;

        if (this.delay < i) {
            return;
        }

        if (this.packetStart > 0) {
            this.delay = 0;
            this.writeStreamBytes(this.packetData, 0, this.packetStart);
        }

        this.packetStart = 0;
        this.packetEnd = 3;
    }

    sendPacket() {
        if (this.isaacOutgoing !== null) {
            let i = this.packetData[this.packetStart + 2] & 0xff;
            this.packetData[this.packetStart + 2] = (i + this.isaacOutgoing.getNextValue()) & 0xff;
        }

        // what the fuck is this even for? legacy?
        if (this.packet8Check !== 8)  {
            this.packetEnd++;
        }

        let j = this.packetEnd - this.packetStart - 2;

        if (j >= 160) {
            this.packetData[this.packetStart] = (160 + ((j / 256) | 0)) & 0xff;
            this.packetData[this.packetStart + 1] = (j & 0xff);
        } else {
            this.packetData[this.packetStart] = j & 0xff;
            this.packetEnd--;
            this.packetData[this.packetStart + 1] = this.packetData[this.packetEnd];
        }

        // this seems largely useless and doesn't appear to do anything
        if (this.packetMaxLength <= 10000) {
            let k = this.packetData[this.packetStart + 2] & 0xff;

            Packet.anIntArray537[k]++;
            Packet.anIntArray541[k] += this.packetEnd - this.packetStart;
        }

        this.packetStart = this.packetEnd;
    }

    putBytes(src, srcPos, len) {
        for (let k = 0; k < len; k++) {
            this.packetData[this.packetEnd++] = src[srcPos + k] & 0xff;
        }
    }

    putLong(l) {
        this.putInt(l.shiftRight(32).toInt());
        this.putInt(l.toInt());
    }

    newPacket(i) {
        if (this.packetStart > (((this.packetMaxLength * 4) / 5) | 0)) {
            try {
                this.writePacket(0);
            } catch (e) {
                this.socketException = true;
                this.socketExceptionMessage = e.message;
            }
        }

        if (this.packetData === null) {
            this.packetData = new Int8Array(this.packetMaxLength);
        }

        this.packetData[this.packetStart + 2] = i & 0xff;
        this.packetData[this.packetStart + 3] = 0;
        this.packetEnd = this.packetStart + 3;
        this.packet8Check = 8;
    }

    async getLong() {
        let l = await this.getShort();
        let l1 = await this.getShort();
        let l2 = await this.getShort();
        let l3 = await this.getShort();

        return Long.fromInt(l).shiftLeft(48).add(Long.fromInt(l1).shiftLeft(32)).add(l2 << 16).add(l3);
    }

    putShort(i) {
        this.packetData[this.packetEnd++] = (i >> 8) & 0xff;
        this.packetData[this.packetEnd++] = i & 0xff;
    }

    putInt(i) {
        this.packetData[this.packetEnd++] = (i >> 24) & 0xff;
        this.packetData[this.packetEnd++] = (i >> 16) & 0xff;
        this.packetData[this.packetEnd++] = (i >> 8) & 0xff;
        this.packetData[this.packetEnd++] = i & 0xff;
    }

    async getShort() {
        let i = await this.getByte();
        let j = await this.getByte();

        return i * 256 + j;
    }

    putString(s) {
        this.putBytes(toCharArray(s), 0, s.length);
    }

    putByte(i) {
        this.packetData[this.packetEnd++] = i & 0xff;
    }

    isaacCommand(i) {
        // TODO toggle ISAA
        //return i - isaacIncoming.getNextValue() & 0xff;
        return i;
    }

    async getByte() {
        return await this.readStream() & 0xff;
    }

    flushPacket() {
        this.sendPacket();
        this.writePacket(0);
    }
}

Packet.anIntArray537 = new Int32Array(256);
Packet.anIntArray541 = new Int32Array(256);

module.exports = Packet;
},{"long":5}],29:[function(require,module,exports){
const Surface = require('./surface');

const CONTROL_TYPES = {
    TEXT: 0,
    CENTRE_TEXT: 1,
    GRADIENT_BG: 2,
    HORIZ_LINE: 3,
    TEXT_LIST: 4,
    LIST_INPUT: 5,
    TEXT_INPUT: 6,
    HORIZ_OPTION: 7,
    VERT_OPTION: 8,
    I_TEXT_LIST: 9,
    BUTTON: 10,
    ROUND_BOX: 11,
    IMAGE: 12,
    CHECKBOX: 14
};

class Panel {
    constructor(surface, max) {
        this.controlCount = 0;

        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLastButtonDown = 0;
        this.mouseButtonDown = 0;
        this.mouseMetaButtonHeld = 0;
        this.mouseScrollDelta = 0;

        this.focusControlIndex = -1;
        this.aBoolean219 = true;
        this.surface = surface;
        this.maxControls = max;
        this.controlShown = new Int8Array(max);
        this.controlListScrollbarHandleDragged = new Int8Array(max);
        this.controlMaskText = new Int8Array(max);
        this.controlClicked = new Int8Array(max);
        this.controlUseAlternativeColour = new Int8Array(max);
        this.controlFlashText = new Int32Array(max);// not so sure
        this.controlListEntryCount = new Int32Array(max);
        this.controlListEntryMouseButtonDown = new Int32Array(max);
        this.controlListEntryMouseOver = new Int32Array(max);
        this.controlX = new Int32Array(max);
        this.controlY = new Int32Array(max);
        this.controlType = new Int32Array(max);
        this.controlWidth = new Int32Array(max);
        this.controlHeight = new Int32Array(max);
        this.controlInputMaxLen = new Int32Array(max);
        this.controlTextSize = new Int32Array(max);

        this.controlText = [];
        this.controlText.length = max;

        this.controlListEntries = [];

        for (let i = 0; i < max; i += 1) {
            this.controlListEntries.push([]);
        }

        this.colourScrollbarTop = this.rgbToLongMod(114, 114, 176);
        this.colourScrollbarBottom = this.rgbToLongMod(14, 14, 62);
        this.colourScrollbarHandleLeft = this.rgbToLongMod(200, 208, 232);
        this.colourScrollbarHandleMid = this.rgbToLongMod(96, 129, 184);
        this.colourScrollbarHandleRight = this.rgbToLongMod(53, 95, 115);
        this.colourRoundedBoxOut = this.rgbToLongMod(117, 142, 171);
        this.colourRoundedBoxMid = this.rgbToLongMod(98, 122, 158);
        this.colourRoundedBoxIn = this.rgbToLongMod(86, 100, 136);
        this.colourBoxTopNBottom = this.rgbToLongMod(135, 146, 179);
        this.colourBoxTopNBottom2 = this.rgbToLongMod(97, 112, 151);
        this.colourBoxLeftNRight2 = this.rgbToLongMod(88, 102, 136);
        this.colourBoxLeftNRight = this.rgbToLongMod(84, 93, 120);
    }

    rgbToLongMod(i, j, k) {
        return Surface.rgbToLong(((Panel.redMod * i) / 114) | 0, ((Panel.greenMod * j) / 114) | 0, ((Panel.blueMod * k) / 176) | 0);
    }

    handleMouse(mx, my, lastMb, mbDown, mScrollDelta = 0) {
        this.mouseX = mx;
        this.mouseY = my;
        this.mouseButtonDown = mbDown;
        this.mouseScrollDelta = mScrollDelta;

        if (lastMb !== 0) {
            this.mouseLastButtonDown = lastMb;
        }

        if (lastMb === 1) {
            for (let i1 = 0; i1 < this.controlCount; i1++) {
                if (this.controlShown[i1] && this.controlType[i1] === CONTROL_TYPES.BUTTON && this.mouseX >= this.controlX[i1] && this.mouseY >= this.controlY[i1] && this.mouseX <= this.controlX[i1] + this.controlWidth[i1] && this.mouseY <= this.controlY[i1] + this.controlHeight[i1]) {
                    this.controlClicked[i1] = true;
                }

                if (this.controlShown[i1] && this.controlType[i1] === CONTROL_TYPES.CHECKBOX && this.mouseX >= this.controlX[i1] && this.mouseY >= this.controlY[i1] && this.mouseX <= this.controlX[i1] + this.controlWidth[i1] && this.mouseY <= this.controlY[i1] + this.controlHeight[i1]) {
                    this.controlListEntryMouseButtonDown[i1] = 1 - this.controlListEntryMouseButtonDown[i1];
                }
            }
        }

        if (mbDown === 1) {
            this.mouseMetaButtonHeld++;
        } else {
            this.mouseMetaButtonHeld = 0;
        }

        if (lastMb === 1 || this.mouseMetaButtonHeld > 20) {
            for (let j1 = 0; j1 < this.controlCount; j1++) {
                if (this.controlShown[j1] && this.controlType[j1] === 15 && this.mouseX >= this.controlX[j1] && this.mouseY >= this.controlY[j1] && this.mouseX <= this.controlX[j1] + this.controlWidth[j1] && this.mouseY <= this.controlY[j1] + this.controlHeight[j1]) {
                    this.controlClicked[j1] = true;
                }
            }

            this.mouseMetaButtonHeld -= 5;
        }
    }

    isClicked(i) {
        if (this.controlShown[i] && this.controlClicked[i]) {
            this.controlClicked[i] = false;
            return true;
        } else {
            return false;
        }
    }

    keyPress(key) {
        if (key === 0) {
            return;
        }

        if (this.focusControlIndex !== -1 && this.controlText[this.focusControlIndex] !== null && this.controlShown[this.focusControlIndex]) {
            let inputLen = this.controlText[this.focusControlIndex].length;

            if (key === 8 && inputLen > 0) {
                this.controlText[this.focusControlIndex] = this.controlText[this.focusControlIndex].slice(0, inputLen - 1);
            }

            if ((key === 10 || key === 13) && inputLen > 0) {
                this.controlClicked[this.focusControlIndex] = true;
            }

            let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

            if (inputLen < this.controlInputMaxLen[this.focusControlIndex]) {
                for (let k = 0; k < s.length; k++) {
                    if (key === s.charCodeAt(k)) {
                        this.controlText[this.focusControlIndex] += String.fromCharCode(key);
                    }
                }
            }

            if (key === 9) {
                do {
                    this.focusControlIndex = (this.focusControlIndex + 1) % this.controlCount;
                } while (this.controlType[this.focusControlIndex] !== 5 && this.controlType[this.focusControlIndex] !== 6);
            }
        }
    }

    drawPanel() {
        for (let i = 0; i < this.controlCount; i++) {
            if (this.controlShown[i]) {
                if (this.controlType[i] === CONTROL_TYPES.TEXT) {
                    this.drawText(i, this.controlX[i], this.controlY[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.CENTRE_TEXT) {
                    this.drawText(i, this.controlX[i] - ((this.surface.textWidth(this.controlText[i], this.controlTextSize[i]) / 2) | 0), this.controlY[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.GRADIENT_BG) {
                    this.drawBox(this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.HORIZ_LINE) {
                    this.drawLineHoriz(this.controlX[i], this.controlY[i], this.controlWidth[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.TEXT_LIST) {
                    this.drawTextList(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlTextSize[i], this.controlListEntries[i], this.controlListEntryCount[i], this.controlFlashText[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.LIST_INPUT || this.controlType[i] === CONTROL_TYPES.TEXT_INPUT) {
                    this.drawTextInput(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.HORIZ_OPTION) {
                    this.drawOptionListHoriz(i, this.controlX[i], this.controlY[i], this.controlTextSize[i], this.controlListEntries[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.VERT_OPTION) {
                    this.drawOptionListVert(i, this.controlX[i], this.controlY[i], this.controlTextSize[i], this.controlListEntries[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.I_TEXT_LIST) {
                    this.drawTextListInteractive(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlTextSize[i], this.controlListEntries[i], this.controlListEntryCount[i], this.controlFlashText[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.ROUND_BOX) {
                    this.drawRoundedBox(this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.IMAGE) {
                    this.drawPicture(this.controlX[i], this.controlY[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.CHECKBOX) {
                    this.drawCheckbox(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                }
            }
        }

        this.mouseLastButtonDown = 0;
    }

    drawCheckbox(control, x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0xffffff);
        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x, (y + height) - 1, width, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 1, y, height, this.colourBoxLeftNRight);

        if (this.controlListEntryMouseButtonDown[control] === 1) {
            for (let j1 = 0; j1 < height; j1++) {
                this.surface.drawLineHoriz(x + j1, y + j1, 1, 0);
                this.surface.drawLineHoriz((x + width) - 1 - j1, y + j1, 1, 0);
            }
        }
    }

    drawText(control, x, y, text, textSize) {
        let y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
        this.drawString(control, x, y2, text, textSize);
    }

    drawString(control, x, y, text, textSize) {
        let i1;

        if (this.controlUseAlternativeColour[control]) {
            i1 = 0xffffff;
        } else {
            i1 = 0;
        }

        this.surface.drawString(text, x, y, textSize, i1);
    }

    drawTextInput(control, x, y, width, height, text, textSize) {
        // password
        if (this.controlMaskText[control]) {
            let len = text.length;
            text = '';

            for (let i2 = 0; i2 < len; i2++) {
                text = text + 'X';
            }
        }

        if (this.controlType[control] === CONTROL_TYPES.LIST_INPUT) {
            if (this.mouseLastButtonDown === 1 && this.mouseX >= x && this.mouseY >= y - ((height / 2) | 0) && this.mouseX <= x + width && this.mouseY <= y + ((height / 2) | 0)) {
                this.focusControlIndex = control;
            }
        } else if (this.controlType[control] === CONTROL_TYPES.TEXT_INPUT) {
            if (this.mouseLastButtonDown === 1 && this.mouseX >= x - ((width / 2) | 0) && this.mouseY >= y - ((height / 2) | 0) && this.mouseX <= x + width / 2 && this.mouseY <= y + ((height / 2) |0)) {
                this.focusControlIndex = control;
            }

            x -= (this.surface.textWidth(text, textSize) / 2) | 0;
        }

        if (this.focusControlIndex === control) {
            text = text + '*';
        }

        let y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
        this.drawString(control, x, y2, text, textSize);
    }


    drawBox(x, y, width, height) {
        this.surface.setBounds(x, y, x + width, y + height);
        this.surface.drawGradient(x, y, width, height, this.colourBoxLeftNRight, this.colourBoxTopNBottom);

        if (Panel.drawBackgroundArrow) {
            for (let i1 = x - (y & 0x3f); i1 < x + width; i1 += 128) {
                for (let j1 = y - (y & 0x1f); j1 < y + height; j1 += 128) {
                    this.surface.drawSpriteAlpha(i1, j1, 6 + Panel.baseSpriteStart, 128);
                }
            }
        }

        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x + 1, y + 1, width - 2, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x + 2, y + 2, width - 4, this.colourBoxTopNBottom2);
        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x + 1, y + 1, height - 2, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x + 2, y + 2, height - 4, this.colourBoxTopNBottom2);
        this.surface.drawLineHoriz(x, (y + height) - 1, width, this.colourBoxLeftNRight);
        this.surface.drawLineHoriz(x + 1, (y + height) - 2, width - 2, this.colourBoxLeftNRight);
        this.surface.drawLineHoriz(x + 2, (y + height) - 3, width - 4, this.colourBoxLeftNRight2);
        this.surface.drawLineVert((x + width) - 1, y, height, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 2, y + 1, height - 2, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 3, y + 2, height - 4, this.colourBoxLeftNRight2);
        this.surface.resetBounds();
    }

    drawRoundedBox(x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0);
        this.surface.drawBoxEdge(x, y, width, height, this.colourRoundedBoxOut);
        this.surface.drawBoxEdge(x + 1, y + 1, width - 2, height - 2, this.colourRoundedBoxMid);
        this.surface.drawBoxEdge(x + 2, y + 2, width - 4, height - 4, this.colourRoundedBoxIn);
        this.surface._drawSprite_from3(x, y, 2 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3((x + width) - 7, y, 3 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3(x, (y + height) - 7, 4 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3((x + width) - 7, (y + height) - 7, 5 + Panel.baseSpriteStart);
    }

    drawPicture(x, y, size) {
        this.surface._drawSprite_from3(x, y, size);
    }

    drawLineHoriz(x, y, width) {
        this.surface.drawLineHoriz(x, y, width, 0xffffff);
    }

    drawTextList(control, x, y, width, height, textSize, listEntries, listEntryCount, listEntryPosition) {
        let displayedEntryCount = (height / this.surface.textHeight(textSize)) | 0;
        let maxEntries = listEntryCount - displayedEntryCount;

        if (listEntryPosition > maxEntries) {
            listEntryPosition = maxEntries;
        }

        if (listEntryPosition < 0) {
            listEntryPosition = 0;
        }

        this.controlFlashText[control] = listEntryPosition;

        if (displayedEntryCount < listEntryCount) {
            let cornerTopRight = (x + width) - 12;
            let cornerBottomLeft = (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (cornerBottomLeft < 6) {
                cornerBottomLeft = 6;
            }

            let j3 = (((height - 27 - cornerBottomLeft) * listEntryPosition) / maxEntries) | 0;

            if (this.mouseScrollDelta !== 0 && this.mouseX > x && this.mouseX < (x + width) && this.mouseY > y && this.mouseY < (y + height)) {
                listEntryPosition += this.mouseScrollDelta;

                if (listEntryPosition < 0) {
                    listEntryPosition = 0;
                } else if (listEntryPosition > maxEntries) {
                    listEntryPosition = maxEntries;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            if (this.mouseButtonDown === 1 && this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12) {
                if (this.mouseY > y && this.mouseY < y + 12 && listEntryPosition > 0) {
                    listEntryPosition--;
                }

                if (this.mouseY > (y + height) - 12 && this.mouseY < y + height && listEntryPosition < listEntryCount - displayedEntryCount) {
                    listEntryPosition++;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            if (this.mouseButtonDown === 1 && (this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12 || this.mouseX >= cornerTopRight - 12 && this.mouseX <= cornerTopRight + 24 && this.controlListScrollbarHandleDragged[control])) {
                if (this.mouseY > y + 12 && this.mouseY < (y + height) - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;

                    let l3 = this.mouseY - y - 12 - ((cornerBottomLeft / 2) | 0);
                    listEntryPosition = ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (listEntryPosition > maxEntries) {
                        listEntryPosition = maxEntries;
                    }

                    if (listEntryPosition < 0) {
                        listEntryPosition = 0;
                    }

                    this.controlFlashText[control] = listEntryPosition;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 = (((height - 27 - cornerBottomLeft) * listEntryPosition) / (listEntryCount - displayedEntryCount)) | 0;
            this.drawListContainer(x, y, width, height, j3, cornerBottomLeft);
        }
        
        let entryListStartY = height - displayedEntryCount * this.surface.textHeight(textSize);
        let y2 = y + ((this.surface.textHeight(textSize) * 5) / 6 + entryListStartY / 2) | 0;

        for (let entry = listEntryPosition; entry < listEntryCount; entry++) {
            this.drawString(control, x + 2, y2, listEntries[entry], textSize);
            y2 += this.surface.textHeight(textSize) - Panel.textListEntryHeightMod;

            if (y2 >= y + height) {
                return;
            }
        }
    }

    drawListContainer(x, y, width, height, corner1, corner2) {
        let x2 = (x + width) - 12;
        this.surface.drawBoxEdge(x2, y, 12, height, 0);
        this.surface._drawSprite_from3(x2 + 1, y + 1, Panel.baseSpriteStart); // up arrow?
        this.surface._drawSprite_from3(x2 + 1, (y + height) - 12, 1 + Panel.baseSpriteStart); // down arrow?
        this.surface.drawLineHoriz(x2, y + 13, 12, 0);
        this.surface.drawLineHoriz(x2, (y + height) - 13, 12, 0);
        this.surface.drawGradient(x2 + 1, y + 14, 11, height - 27, this.colourScrollbarTop, this.colourScrollbarBottom);
        this.surface.drawBox(x2 + 3, corner1 + y + 14, 7, corner2, this.colourScrollbarHandleMid);
        this.surface.drawLineVert(x2 + 2, corner1 + y + 14, corner2, this.colourScrollbarHandleLeft);
        this.surface.drawLineVert(x2 + 2 + 8, corner1 + y + 14, corner2, this.colourScrollbarHandleRight);
    }

    drawOptionListHoriz(control, x, y, textSize, listEntries) {
        let listTotalTextWidth = 0;
        let listEntryCount = listEntries.length;

        for (let idx = 0; idx < listEntryCount; idx++) {
            listTotalTextWidth += this.surface.textWidth(listEntries[idx], textSize);

            if (idx < listEntryCount - 1) {
                listTotalTextWidth += this.surface.textWidth('  ', textSize);
            }
        }

        let left = x - ((listTotalTextWidth / 2) | 0);
        let bottom = y + ((this.surface.textHeight(textSize) / 3) | 0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let colour;

            if (this.controlUseAlternativeColour[control]) {
                colour = 0xffffff;
            } else {
                colour = 0;
            }

            if (this.mouseX >= left && this.mouseX <= left + this.surface.textWidth(listEntries[idx], textSize) && this.mouseY <= bottom && this.mouseY > bottom - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0x808080;
                } else {
                    colour = 0xffffff;
                }

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = idx;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === idx) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0xff0000;
                } else {
                    colour = 0xc00000;
                }
            }

            this.surface.drawString(listEntries[idx], left, bottom, textSize, colour);
            left += this.surface.textWidth(listEntries[idx] + '  ', textSize);
        }
    }

    drawOptionListVert(control, x, y, textSize, listEntries) {
        let listEntryCount = listEntries.length;
        let listTotalTextHeightMid = y - (((this.surface.textHeight(textSize) * (listEntryCount - 1)) / 2) | 0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let colour;

            if (this.controlUseAlternativeColour[control]) {
                colour = 0xffffff;
            } else {
                colour = 0;
            }

            let entryTextWidth = this.surface.textWidth(listEntries[idx], textSize);

            if (this.mouseX >= x - ((entryTextWidth / 2) | 0) && this.mouseX <= x + ((entryTextWidth / 2) | 0) && this.mouseY - 2 <= listTotalTextHeightMid && this.mouseY - 2 > listTotalTextHeightMid - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0x808080;
                } else {
                    colour = 0xffffff;
                }

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = idx;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === idx) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0xff0000;
                } else {
                    colour = 0xc00000;
                }
            }

            this.surface.drawString(listEntries[idx], x - ((entryTextWidth / 2) | 0), listTotalTextHeightMid, textSize, colour);
            listTotalTextHeightMid += this.surface.textHeight(textSize);
        }
    }

    drawTextListInteractive(control, x, y, width, height, textSize, listEntries, listEntryCount, listEntryPosition) {
        let displayedEntryCount = (height / this.surface.textHeight(textSize)) | 0;
        let maxEntries = listEntryCount - displayedEntryCount;

        if (displayedEntryCount < listEntryCount) {
            let cornerTopRight = (x + width) - 12;
            let cornerBottomLeft = (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (cornerBottomLeft < 6) {
                cornerBottomLeft = 6;
            }

            let j3 = (((height - 27 - cornerBottomLeft) * listEntryPosition) / maxEntries) | 0;

            if (this.mouseScrollDelta !== 0 && this.mouseX > x && this.mouseX < (x + width) && this.mouseY > y && this.mouseY < (y + height)) {
                listEntryPosition += this.mouseScrollDelta;

                if (listEntryPosition < 0) {
                    listEntryPosition = 0;
                } else if (listEntryPosition > maxEntries) {
                    listEntryPosition = maxEntries;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            // the up and down arrow buttons on the scrollbar
            if (this.mouseButtonDown === 1 && this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12) { 
                if (this.mouseY > y && this.mouseY < y + 12 && listEntryPosition > 0) {
                    listEntryPosition--;
                }

                if (this.mouseY > (y + height) - 12 && this.mouseY < y + height && listEntryPosition < maxEntries) {
                    listEntryPosition++;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            // handle the thumb/middle section dragging of the scrollbar
            if (this.mouseButtonDown === 1 && (this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12 || this.mouseX >= cornerTopRight - 12 && this.mouseX <= cornerTopRight + 24 && this.controlListScrollbarHandleDragged[control])) {
                if (this.mouseY > y + 12 && this.mouseY < (y + height) - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;

                    let l3 = this.mouseY - y - 12 - ((cornerBottomLeft / 2) | 0);
                    listEntryPosition = ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (listEntryPosition < 0) {
                        listEntryPosition = 0;
                    }

                    if (listEntryPosition > maxEntries) {
                        listEntryPosition = maxEntries;
                    }

                    this.controlFlashText[control] = listEntryPosition;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 = (((height - 27 - cornerBottomLeft) * listEntryPosition) / maxEntries) | 0;
            this.drawListContainer(x, y, width, height, j3, cornerBottomLeft);
        } else {
            listEntryPosition = 0;
            this.controlFlashText[control] = 0;
        }

        this.controlListEntryMouseOver[control] = -1;
        let k2 = height - displayedEntryCount * this.surface.textHeight(textSize);
        let i3 = y + (((((this.surface.textHeight(textSize) * 5) / 6) | 0) + k2 / 2) | 0);

        for (let k3 = listEntryPosition; k3 < listEntryCount; k3++) {
            let i4;

            if (this.controlUseAlternativeColour[control]) {
                i4 = 0xffffff;
            } else {
                i4 = 0;
            }

            if (this.mouseX >= x + 2 && this.mouseX <= x + 2 + this.surface.textWidth(listEntries[k3], textSize) && this.mouseY - 2 <= i3 && this.mouseY - 2 > i3 - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    i4 = 0x808080;
                } else {
                    i4 = 0xffffff;
                }

                this.controlListEntryMouseOver[control] = k3;

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = k3;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === k3 && this.aBoolean219) {
                i4 = 0xff0000;
            }

            this.surface.drawString(listEntries[k3], x + 2, i3, textSize, i4);
            i3 += this.surface.textHeight(textSize);

            if (i3 >= y + height) {
                return;
            }
        }
    }

    addText(x, y, text, size, flag) {
        this.controlType[this.controlCount] = 1;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlText[this.controlCount] = text;

        return this.controlCount++;
    }

    addButtonBackground(x, y, width, height) {
        this.controlType[this.controlCount] = 2;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addBoxRounded(x, y, width, height) {
        this.controlType[this.controlCount] = 11;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addSprite(x, y, spriteId) {
        let imgWidth = this.surface.spriteWidth[spriteId];
        let imgHeight = this.surface.spriteHeight[spriteId];

        this.controlType[this.controlCount] = CONTROL_TYPES.IMAGE;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((imgWidth / 2) | 0);
        this.controlY[this.controlCount] = y - ((imgHeight / 2) | 0);
        this.controlWidth[this.controlCount] = imgWidth;
        this.controlHeight[this.controlCount] = imgHeight;
        this.controlTextSize[this.controlCount] = spriteId;

        return this.controlCount++;
    }

    addTextList(x, y, width, height, size, maxLength, flag) {
        this.controlType[this.controlCount] = CONTROL_TYPES.TEXT_LIST;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlTextSize[this.controlCount] = size;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlFlashText[this.controlCount] = 0;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxLength;
        this.controlListEntries[this.controlCount].fill(null);
        
        return this.controlCount++;
    }

    addTextListInput(x, y, width, height, size, maxLength, flag, flag1) {
        this.controlType[this.controlCount] = CONTROL_TYPES.LIST_INPUT;
        this.controlShown[this.controlCount] = true;
        this.controlMaskText[this.controlCount] = flag;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag1;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlText[this.controlCount] = '';
        
        return this.controlCount++;
    }

    addTextInput(x, y, width, height, size, maxLength, flag, flag1) {
        this.controlType[this.controlCount] = CONTROL_TYPES.TEXT_INPUT;
        this.controlShown[this.controlCount] = true;
        this.controlMaskText[this.controlCount] = flag;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag1;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlText[this.controlCount] = '';

        return this.controlCount++;
    }

    addTextListInteractive(x, y, width, height, textSize, maxLength, flag) {
        this.controlType[this.controlCount] = CONTROL_TYPES.I_TEXT_LIST;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxLength;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlFlashText[this.controlCount] = 0;
        this.controlListEntryMouseButtonDown[this.controlCount] = -1;
        this.controlListEntryMouseOver[this.controlCount] = -1;

        return this.controlCount++;
    }

    addButton(x, y, width, height) {
        this.controlType[this.controlCount] = CONTROL_TYPES.BUTTON;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addLineHoriz(x, y, width) {
        this.controlType[this.controlCount] = CONTROL_TYPES.HORIZ_LINE;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;

        return this.controlCount++;
    }

    addOptionListHoriz(x, y, textSize, maxListCount, useAltColour) {
        this.controlType[this.controlCount] = CONTROL_TYPES.HORIZ_OPTION;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxListCount;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlUseAlternativeColour[this.controlCount] = useAltColour;
        this.controlClicked[this.controlCount] = false;

        return this.controlCount++;
    }

    addOptionListVert(x, y, textSize, maxListCount, useAltColour) {
        this.controlType[this.controlCount] = CONTROL_TYPES.VERT_OPTION;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxListCount;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlUseAlternativeColour[this.controlCount] = useAltColour;
        this.controlClicked[this.controlCount] = false;

        return this.controlCount++;
    }

    addCheckbox(x, y, width, height) {
        this.controlType[this.controlCount] = CONTROL_TYPES.CHECKBOX;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlListEntryMouseButtonDown[this.controlCount] = 0;

        return this.controlCount++;
    }

    clearList(control) {
        this.controlListEntryCount[control] = 0;
    }

    resetListProps(control) {
        this.controlFlashText[control] = 0;
        this.controlListEntryMouseOver[control] = -1;
    }

    addListEntry(control, index, text) {
        this.controlListEntries[control][index] = text;

        if (index + 1 > this.controlListEntryCount[control]) {
            this.controlListEntryCount[control] = index + 1;
        }
    }

    removeListEntry(control, text, flag) {
        let j = this.controlListEntryCount[control]++;

        if (j >= this.controlInputMaxLen[control]) {
            j--;

            this.controlListEntryCount[control]--;

            for (let k = 0; k < j; k++) {
                this.controlListEntries[control][k] = this.controlListEntries[control][k + 1];
            }
        }

        this.controlListEntries[control][j] = text;

        if (flag) {
            this.controlFlashText[control] = 999999; // 0xf423f;
        }
    }

    updateText(control, s) {
        this.controlText[control] = s;
    }

    getText(control) {
        if (this.controlText[control] === null) {
            return 'null';
        } else {
            return this.controlText[control];
        }
    }

    show(control) {
        this.controlShown[control] = true;
    }

    hide(control) {
        this.controlShown[control] = false;
    }

    setFocus(control) {
        this.focusControlIndex = control;
    }

    getListEntryIndex(control) {
        return this.controlListEntryMouseOver[control];
    }
}

Panel.drawBackgroundArrow = true;
Panel.baseSpriteStart = 0;
Panel.redMod = 114;
Panel.greenMod = 114;
Panel.blueMod = 176;
Panel.textListEntryHeightMod = 0;

module.exports = Panel;
},{"./surface":35}],30:[function(require,module,exports){
class Polygon {
    constructor() {
        this.minPlaneX = 0;
        this.minPlaneY = 0;
        this.maxPlaneX = 0;
        this.maxPlaneY = 0;
        this.minZ = 0;
        this.maxZ = 0;
        this.model = null;
        this.face = 0;
        this.depth = 0;
        this.normalX = 0;
        this.normalY = 0;
        this.normalZ = 0;
        this.visibility = 0;
        this.facefill = 0;
        this.skipSomething = false;
        this.index = 0;
        this.index2 = 0;
    }
}

module.exports = Polygon;
},{}],31:[function(require,module,exports){
class Scanline {
    constructor() {
        this.startX = 0;
        this.endX = 0;
        this.startS = 0;
        this.endS = 0;  
    }
}

module.exports = Scanline;
},{}],32:[function(require,module,exports){
const Long = require('long');
const Polygon = require('./polygon');
const Scanline = require('./scanline');

const COLOUR_TRANSPARENT = 12345678;

class Scene {
    constructor(surface, i, polygons, k) {
        this.lastVisiblePolygonsCount = 0;
        this.anIntArray377 = null;
        this.textureCount = 0;
        this.textureColoursUsed = null;
        this.textureColourList = null;
        this.textureDimension = null;
        this.textureLoadedNumber = null;
        this.texturePixels = null;
        this.textureBackTransparent = null;
        this.textureColours64 = null;
        this.textureColours128 = null;
        this.scanlines = null;
        this.minY = 0;
        this.maxY = 0;
        this.interlace = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePickedCount = 0;
        this.newStart = 0;
        this.newEnd = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraZ = 0;
        this.cameraYaw = 0;
        this.cameraPitch = 0;
        this.cameraRoll = 0;

        this.rampCount = 50;
        this.gradientBase = new Int32Array(this.rampCount);

        this.gradientRamps = [];

        for (let _i = 0; _i < this.rampCount; _i += 1) {
            this.gradientRamps.push(new Int32Array(256));
        }

        this.clipNear = 5;
        this.clipFar3d = 1000;
        this.clipFar2d = 1000;
        this.fogZFalloff = 20;
        this.fogZDistance = 10;
        this.wideBand = false;
        this.aDouble387 = 1.1000000000000001;
        this.anInt388 = 1;
        this.mousePickingActive = false;
        this.mousePickedMax = 100;
        this.mousePickedModels = [];
        this.mousePickedModels.length = this.mousePickedMax;
        this.mousePickedModels.fill(null);
        this.mousePickedFaces = new Int32Array(this.mousePickedMax);
        this.width = 512;
        this.clipX = 256;
        this.clipY = 192;
        this.baseX = 256;
        this.baseY = 256;
        this.viewDistance = 8;
        this.normalMagnitude = 4;
        this.planeX = new Int32Array(40);
        this.planeY = new Int32Array(40);
        this.vertexShade = new Int32Array(40);
        this.vertexX = new Int32Array(40);
        this.vertexY = new Int32Array(40);
        this.vertexZ = new Int32Array(40);
        this.interlace = false;
        this.surface = surface;
        this.clipX = (surface.width2 / 2) | 0;
        this.clipY = (surface.height2 / 2) | 0;
        this.raster = surface.pixels;
        this.modelCount = 0;
        this.maxModelCount = i;
        this.models = [];
        this.models.length = this.maxModelCount;
        this.models.fill(null);

        this.visiblePolygonsCount = 0;
        this.visiblePolygons = [];

        for (let l = 0; l < polygons; l++) {
            this.visiblePolygons.push(new Polygon());
        }

        this.spriteCount = 0;
        //this.view = new GameModel(k * 2, k);
        this.spriteId = new Int32Array(k);
        this.spriteWidth = new Int32Array(k);
        this.spriteHeight = new Int32Array(k);
        this.spriteX = new Int32Array(k);
        this.spriteZ = new Int32Array(k);
        this.spriteY = new Int32Array(k);
        this.spriteTranslateX = new Int32Array(k);

        if (this.aByteArray434 === null) {
            this.aByteArray434 = new Int8Array(17691);
        }

        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraZ = 0;
        this.cameraYaw = 0;
        this.cameraPitch = 0;
        this.cameraRoll = 0;

        for (let i1 = 0; i1 < 256; i1++) {
            Scene.sin512Cache[i1] = (Math.sin(i1 * 0.02454369) * 32768) | 0;
            Scene.sin512Cache[i1 + 256] = (Math.cos(i1 * 0.02454369) * 32768) | 0;
        }

        for (let j1 = 0; j1 < 1024; j1++) {
            Scene.sin2048Cache[j1] = (Math.sin(j1 * 0.00613592315) * 32768) | 0;
            Scene.sin2048Cache[j1 + 1024] = (Math.cos(j1 * 0.00613592315) * 32768) | 0;
        }
    }

    static textureScanline(ai, ai1, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        let i4 = 0;

        if (i1 !== 0) {
            i = k / i1 << 7;
            j = l / i1 << 7;
        }

        if (i < 0) {
            i = 0;
        } else if (i > 16256) {
            i = 16256;
        }

        k += j1;
        l += k1;
        i1 += l1;

        if (i1 !== 0) {
            i3 = k / i1 << 7;
            j3 = l / i1 << 7;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 16256) {
            i3 = 16256;
        }

        let k3 = i3 - i >> 4;
        let l3 = j3 - j >> 4;

        for (let j4 = i2 >> 4; j4 > 0; j4--) {
            i += k2 & 0x600000;
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i = i3;
            j = j3;
            k += j1;
            l += k1;
            i1 += l1;

            if (i1 !== 0) {
                i3 = k / i1 << 7;
                j3 = l / i1 << 7;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 16256) {
                i3 = 16256;
            }

            k3 = i3 - i >> 4;
            l3 = j3 - j >> 4;
        }

        for (let k4 = 0; k4 < (i2 & 0xf); k4++) {
            if ((k4 & 3) === 0) {
                i = (i & 0x3fff) + (k2 & 0x600000);
                i4 = k2 >> 23;
                k2 += l2;
            }

            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
        }
    }

    static textureTranslucentScanline(ai, ai1, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        let i4 = 0;

        if (i1 !== 0) {
            i = k / i1 << 7;
            j = l / i1 << 7;
        }

        if (i < 0) {
            i = 0;
        } else if (i > 16256) {
            i = 16256;
        }

        k += j1;
        l += k1;
        i1 += l1;

        if (i1 !== 0) {
            i3 = k / i1 << 7;
            j3 = l / i1 << 7;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 16256) {
            i3 = 16256;
        }

        let k3 = i3 - i >> 4;
        let l3 = j3 - j >> 4;

        for (let j4 = i2 >> 4; j4 > 0; j4--) {
            i += k2 & 0x600000;
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i = i3;
            j = j3;
            k += j1;
            l += k1;
            i1 += l1;

            if (i1 !== 0) {
                i3 = k / i1 << 7;
                j3 = l / i1 << 7;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 16256) {
                i3 = 16256;
            }

            k3 = i3 - i >> 4;
            l3 = j3 - j >> 4;
        }

        for (let k4 = 0; k4 < (i2 & 0xf); k4++) {
            if ((k4 & 3) === 0) {
                i = (i & 0x3fff) + (k2 & 0x600000);
                i4 = k2 >> 23;
                k2 += l2;
            }

            ai[j2++] = (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) + (ai[j2] >> 1 & 0x7f7f7f);
            i += k3;
            j += l3;
        }
    }

    static textureBackTranslucentScanline(ai, i, j, k, ai1, l, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        if (j2 <= 0) {
            return;
        }

        let j3 = 0;
        let k3 = 0;
        i3 <<= 2;

        if (j1 !== 0) {
            j3 = l / j1 << 7;
            k3 = i1 / j1 << 7;
        }

        if (j3 < 0) {
            j3 = 0;
        } else if (j3 > 16256) {
            j3 = 16256;
        }

        for (let j4 = j2; j4 > 0; j4 -= 16) {
            l += k1;
            i1 += l1;
            j1 += i2;
            j = j3;
            k = k3;

            if (j1 !== 0) {
                j3 = l / j1 << 7;
                k3 = i1 / j1 << 7;
            }

            if (j3 < 0) {
                j3 = 0;
            } else if (j3 > 16256) {
                j3 = 16256;
            }

            let l3 = j3 - j >> 4;
            let i4 = k3 - k >> 4;
            let k4 = l2 >> 23;

            j += l2 & 0x600000;
            l2 += i3;

            if (j4 < 16) {
                for (let l4 = 0; l4 < j4; l4++) {
                    if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                        ai[k2] = i;
                    }

                    k2++;
                    j += l3;
                    k += i4;

                    if ((l4 & 3) === 3) {
                        j = (j & 0x3fff) + (l2 & 0x600000);
                        k4 = l2 >> 23;
                        l2 += i3;
                    }
                }
            } else {
                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
            }
        }

    }

    static textureScanline2(ai, ai1, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        l2 <<= 2;

        if (i1 !== 0) {
            i3 = k / i1 << 6;
            j3 = l / i1 << 6;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 4032) {
            i3 = 4032;
        }

        for (let i4 = i2; i4 > 0; i4 -= 16) {
            k += j1;
            l += k1;
            i1 += l1;
            i = i3;
            j = j3;

            if (i1 !== 0) {
                i3 = k / i1 << 6;
                j3 = l / i1 << 6;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 4032) {
                i3 = 4032;
            }

            let k3 = i3 - i >> 4;
            let l3 = j3 - j >> 4;
            let j4 = k2 >> 20;
            i += k2 & 0xc0000;
            k2 += l2;

            if (i4 < 16) {
                for (let k4 = 0; k4 < i4; k4++) {
                    ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                    i += k3;
                    j += l3;

                    if ((k4 & 3) === 3) {
                        i = (i & 0xfff) + (k2 & 0xc0000);
                        j4 = k2 >> 20;
                        k2 += l2;
                    }
                }
            } else {
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
            }
        }
    }

    static textureTranslucentScanline2(ai, ai1, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        l2 <<= 2;

        if (i1 !== 0) {
            i3 = k / i1 << 6;
            j3 = l / i1 << 6;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 4032) {
            i3 = 4032;
        }

        for (let i4 = i2; i4 > 0; i4 -= 16) {
            k += j1;
            l += k1;
            i1 += l1;
            i = i3;
            j = j3;

            if (i1 !== 0) {
                i3 = k / i1 << 6;
                j3 = l / i1 << 6;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 4032) {
                i3 = 4032;
            }

            let k3 = i3 - i >> 4;
            let l3 = j3 - j >> 4;
            let j4 = k2 >> 20;
            i += k2 & 0xc0000;
            k2 += l2;

            if (i4 < 16) {
                for (let k4 = 0; k4 < i4; k4++) {
                    ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                    i += k3;
                    j += l3;

                    if ((k4 & 3) === 3) {
                        i = (i & 0xfff) + (k2 & 0xc0000);
                        j4 = k2 >> 20;
                        k2 += l2;
                    }
                }
            } else {
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] = (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) + (ai[j2] >> 1 & 0x7f7f7f);
            }
        }
    }

    static textureBackTranslucentScanline2(ai, i, j, k, ai1, l, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        if (j2 <= 0) {
            return;
        }

        let j3 = 0;
        let k3 = 0;
        i3 <<= 2;

        if (j1 !== 0) {
            j3 = l / j1 << 6;
            k3 = i1 / j1 << 6;
        }

        if (j3 < 0) {
            j3 = 0;
        } else if (j3 > 4032) {
            j3 = 4032;
        }

        for (let j4 = j2; j4 > 0; j4 -= 16) {
            l += k1;
            i1 += l1;
            j1 += i2;
            j = j3;
            k = k3;

            if (j1 !== 0) {
                j3 = l / j1 << 6;
                k3 = i1 / j1 << 6;
            }

            if (j3 < 0) {
                j3 = 0;
            } else if (j3 > 4032) {
                j3 = 4032;
            }

            let l3 = j3 - j >> 4;
            let i4 = k3 - k >> 4;
            let k4 = l2 >> 20;
            j += l2 & 0xc0000;
            l2 += i3;

            if (j4 < 16) {
                for (let l4 = 0; l4 < j4; l4++) {
                    if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                        ai[k2] = i;
                    }

                    k2++;
                    j += l3;
                    k += i4;

                    if ((l4 & 3) === 3) {
                        j = (j & 0xfff) + (l2 & 0xc0000);
                        k4 = l2 >> 20;
                        l2 += i3;
                    }
                }
            } else {
                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
            }
        }
    }

    static gradientScanline(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 1;
        k = ai1[l >> 8 & 0xff];
        l += i1;
        let j1 = (i / 8) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
        }

        j1 = -(i % 8);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k;

            if ((l1 & 1) === 1) {
                k = ai1[l >> 8 & 0xff];
                l += i1;
            }
        }
    }

    static textureGradientScanline(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 2;
        k = ai1[l >> 8 & 0xff];
        l += i1;
        let j1 = (i / 16) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);
            k = ai1[l >> 8 & 0xff];
            l += i1;
        }

        j1 = -(i % 16);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k + (ai[j] >> 1 & 0x7f7f7f);

            if ((l1 & 3) === 3) {
                k = ai1[l >> 8 & 0xff];
                l += i1;
                l += i1;
            }
        }

    }

    static gradientScanline2(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 2;
        k = ai1[l >> 8 & 0xff];
        l += i1;
        let j1 = (i / 16) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[l >> 8 & 0xff];
            l += i1;
        }

        j1 = -(i % 16);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k;

            if ((l1 & 3) === 3) {
                k = ai1[l >> 8 & 0xff];
                l += i1;
            }
        }
    }

    static rgb(i, j, k) {
        return -1 - ((i / 8) | 0) * 1024 - ((j / 8) | 0) * 32 - ((k / 8) | 0);
    }

    addModel(model) {
        if (model === null) {
            console.log('Warning tried to add null object!');
        }

        if (this.modelCount < this.maxModelCount) {
            this.models[this.modelCount++] = model;
        }
    }

    removeModel(gameModel) {
        for (let i = 0; i < this.modelCount; i++) {
            if (this.models[i] === gameModel) {
                this.modelCount--;

                for (let j = i; j < this.modelCount; j++) {
                    this.models[j] = this.models[j + 1];
                }
            }
        }
    }

    dispose() {
        this.clear();

        for (let i = 0; i < this.modelCount; i++) {
            this.models[i] = null;
        }

        this.modelCount = 0;
    }

    clear() {
        this.spriteCount = 0;
        this.view.clear();
    }

    reduceSprites(i) {
        this.spriteCount -= i;
        this.view.reduce(i, i * 2);

        if (this.spriteCount < 0) {
            this.spriteCount = 0;
        }
    }

    addSprite(n, x, z, y, w, h, tag) {
        this.spriteId[this.spriteCount] = n;
        this.spriteX[this.spriteCount] = x;
        this.spriteZ[this.spriteCount] = z;
        this.spriteY[this.spriteCount] = y;
        this.spriteWidth[this.spriteCount] = w;
        this.spriteHeight[this.spriteCount] = h;
        this.spriteTranslateX[this.spriteCount] = 0;

        let l1 = this.view.createVertex(x, z, y);
        let i2 = this.view.createVertex(x, z - h, y);
        let vs = new Int32Array([l1, i2]);

        this.view.createFace(2, vs, 0, 0);
        this.view.faceTag[this.spriteCount] = tag;
        this.view.isLocalPlayer[this.spriteCount++] = 0;

        return this.spriteCount - 1;
    }

    setLocalPlayer(i) {
        this.view.isLocalPlayer[i] = 1;
    }

    setSpriteTranslateX(i, n) {
        this.spriteTranslateX[i] = n;
    }

    setMouseLoc(x, y) {
        this.mouseX = x - this.baseX;
        this.mouseY = y;
        this.mousePickedCount = 0;
        this.mousePickingActive = true;
    }

    getMousePickedCount() {
        return this.mousePickedCount;
    }

    getMousePickedFaces() {
        return this.mousePickedFaces;
    }

    getMousePickedModels() {
        return this.mousePickedModels;
    }

    setBounds(baseX, baseY, clipX, clipY, width, viewDistance) {
        this.clipX = clipX;
        this.clipY = clipY;
        this.baseX = baseX;
        this.baseY = baseY;
        this.width = width;
        this.viewDistance = viewDistance;
        this.scanlines = [];

        for (let k1 = 0; k1 < clipY + baseY; k1++) {
            this.scanlines.push(new Scanline());
        }
    }

    polygonsQSort(polygons, low, high) {
        if (low < high) {
            let min = low - 1;
            let max = high + 1;
            let mid = ((low + high) / 2) | 0;
            let polygon = polygons[mid];
            polygons[mid] = polygons[low];
            polygons[low] = polygon;
            let j1 = polygon.depth;

            while (min < max) {
                do {
                    max--;
                } while (polygons[max].depth < j1);

                do {
                    min++;
                } while (polygons[min].depth > j1);

                if (min < max) {
                    let polygon_1 = polygons[min];
                    polygons[min] = polygons[max];
                    polygons[max] = polygon_1;
                }
            }

            this.polygonsQSort(polygons, low, max);
            this.polygonsQSort(polygons, max + 1, high);
        }
    }

    polygonsIntersectSort(step, polygons, count) {
        for (let i = 0; i <= count; i++) {
            polygons[i].skipSomething = false;
            polygons[i].index = i;
            polygons[i].index2 = -1;
        }

        let l = 0;

        do {
            while (polygons[l].skipSomething) {
                l++;
            }

            if (l === count) {
                return;
            }

            let polygon = polygons[l];
            polygon.skipSomething = true;
            let i1 = l;
            let j1 = l + step;

            if (j1 >= count) {
                j1 = count - 1;
            }

            for (let k1 = j1; k1 >= i1 + 1; k1--) {
                let other = polygons[k1];

                if (polygon.minPlaneX < other.maxPlaneX && other.minPlaneX < polygon.maxPlaneX && polygon.minPlaneY < other.maxPlaneY && other.minPlaneY < polygon.maxPlaneY && polygon.index !== other.index2 && !this.separatePolygon(polygon, other) && this.heuristicPolygon(other, polygon)) {
                    this.polygonsOrder(polygons, i1, k1);

                    if (polygons[k1] !== other) {
                        k1++;
                    }

                    i1 = this.newStart;
                    other.index2 = polygon.index;
                }
            }
        } while (true);
    }

    polygonsOrder(polygons, start, end) {
        do {
            let polygon = polygons[start];

            for (let k = start + 1; k <= end; k++) {
                let polygon_1 = polygons[k];

                if (!this.separatePolygon(polygon_1, polygon)) {
                    break;
                }

                polygons[start] = polygon_1;
                polygons[k] = polygon;
                start = k;

                if (start === end) {
                    this.newStart = start;
                    this.newEnd = start - 1;

                    return true;
                }
            }

            let polygon_2 = polygons[end];

            for (let l = end - 1; l >= start; l--) {
                let polygon_3 = polygons[l];

                if (!this.separatePolygon(polygon_2, polygon_3)) {
                    break;
                }

                polygons[end] = polygon_3;
                polygons[l] = polygon_2;
                end = l;

                if (start === end) {
                    this.newStart = end + 1;
                    this.newEnd = end;

                    return true;
                }
            }

            if (start + 1 >= end) {
                this.newStart = start;
                this.newEnd = end;

                return false;
            }

            if (!this.polygonsOrder(polygons, start + 1, end)) {
                this.newStart = start;

                return false;
            }

            end = this.newEnd;
        } while (true);
    }

    setFrustum(i, j, k) {
        let l = -this.cameraYaw + 1024 & 0x3ff;
        let i1 = -this.cameraPitch + 1024 & 0x3ff;
        let j1 = -this.cameraRoll + 1024 & 0x3ff;

        if (j1 !== 0) {
            let k1 = Scene.sin2048Cache[j1];
            let j2 = Scene.sin2048Cache[j1 + 1024];
            let i3 = j * k1 + i * j2 >> 15;
            j = j * j2 - i * k1 >> 15;
            i = i3;
        }

        if (l !== 0) {
            let l1 = Scene.sin2048Cache[l];
            let k2 = Scene.sin2048Cache[l + 1024];
            let j3 = j * k2 - k * l1 >> 15;
            k = j * l1 + k * k2 >> 15;
            j = j3;
        }

        if (i1 !== 0) {
            let i2 = Scene.sin2048Cache[i1];
            let l2 = Scene.sin2048Cache[i1 + 1024];
            let k3 = k * i2 + i * l2 >> 15;
            k = k * l2 - i * i2 >> 15;
            i = k3;
        }

        if (i < Scene.frustumMaxX) {
            Scene.frustumMaxX = i;
        }

        if (i > Scene.frustumMinX) {
            Scene.frustumMinX = i;
        }

        if (j < Scene.frustumMaxY) {
            Scene.frustumMaxY = j;
        }

        if (j > Scene.frustumMinY) {
            Scene.frustumMinY = j;
        }

        if (k < Scene.frustumFarZ) {
            Scene.frustumFarZ = k;
        }

        if (k > Scene.frustumNearZ) {
            Scene.frustumNearZ = k;
        }
    }

    render() {
        this.interlace = this.surface.interlace;
        let i3 = this.clipX * this.clipFar3d >> this.viewDistance;
        let j3 = this.clipY * this.clipFar3d >> this.viewDistance;

        Scene.frustumMaxX = 0;
        Scene.frustumMinX = 0;
        Scene.frustumMaxY = 0;
        Scene.frustumMinY = 0;
        Scene.frustumFarZ = 0;
        Scene.frustumNearZ = 0;

        this.setFrustum(-i3, -j3, this.clipFar3d);
        this.setFrustum(-i3, j3, this.clipFar3d);
        this.setFrustum(i3, -j3, this.clipFar3d);
        this.setFrustum(i3, j3, this.clipFar3d);
        this.setFrustum(-this.clipX, -this.clipY, 0);
        this.setFrustum(-this.clipX, this.clipY, 0);
        this.setFrustum(this.clipX, -this.clipY, 0);
        this.setFrustum(this.clipX, this.clipY, 0);

        Scene.frustumMaxX += this.cameraX;
        Scene.frustumMinX += this.cameraX;
        Scene.frustumMaxY += this.cameraY;
        Scene.frustumMinY += this.cameraY;
        Scene.frustumFarZ += this.cameraZ;
        Scene.frustumNearZ += this.cameraZ;

        this.models[this.modelCount] = this.view;
        this.view.transformState = 2;

        for (let i = 0; i < this.modelCount; i++) {
            this.models[i].project(this.cameraX, this.cameraY, this.cameraZ, this.cameraYaw, this.cameraPitch, this.cameraRoll, this.viewDistance, this.clipNear);
        }

        this.models[this.modelCount].project(this.cameraX, this.cameraY, this.cameraZ, this.cameraYaw, this.cameraPitch, this.cameraRoll, this.viewDistance, this.clipNear);
        this.visiblePolygonsCount = 0;

        for (let count = 0; count < this.modelCount; count++) {
            let gameModel = this.models[count];

            if (gameModel.visible) {
                for (let face = 0; face < gameModel.numFaces; face++) {
                    let num_vertices = gameModel.faceNumVertices[face];
                    let vertices = gameModel.faceVertices[face];
                    let visible = false;

                    for (let vertex = 0; vertex < num_vertices; vertex++) {
                        let z = gameModel.projectVertexZ[vertices[vertex]];

                        if (z <= this.clipNear || z >= this.clipFar3d) {
                            continue;
                        }

                        visible = true;
                        break;
                    }

                    if (visible) {
                        let viewXCount = 0;

                        for (let vertex = 0; vertex < num_vertices; vertex++) {
                            let x = gameModel.vertexViewX[vertices[vertex]];

                            if (x > -this.clipX) {
                                viewXCount |= 1;
                            }

                            if (x < this.clipX) {
                                viewXCount |= 2;
                            }

                            if (viewXCount === 3) {
                                break;
                            }
                        }

                        if (viewXCount === 3) {
                            let viewYCount = 0;

                            for (let vertex = 0; vertex < num_vertices; vertex++) {
                                let k1 = gameModel.vertexViewY[vertices[vertex]];

                                if (k1 > -this.clipY) {
                                    viewYCount |= 1;
                                }

                                if (k1 < this.clipY) {
                                    viewYCount |= 2;
                                }

                                if (viewYCount === 3) {
                                    break;
                                }
                            }

                            if (viewYCount === 3) {
                                let polygon_1 = this.visiblePolygons[this.visiblePolygonsCount];
                                polygon_1.model = gameModel;
                                polygon_1.face = face;
                                this.initialisePolygon3D(this.visiblePolygonsCount);

                                let faceFill = 0;

                                if (polygon_1.visibility < 0) {
                                    faceFill = gameModel.faceFillFront[face];
                                } else {
                                    faceFill = gameModel.faceFillBack[face];
                                }

                                if (faceFill !== COLOUR_TRANSPARENT) {
                                    let h = 0;

                                    for (let vertex = 0; vertex < num_vertices; vertex++) {
                                        h += gameModel.projectVertexZ[vertices[vertex]];
                                    }

                                    polygon_1.depth = ((h / num_vertices) | 0) + gameModel.depth;
                                    polygon_1.facefill = faceFill;
                                    this.visiblePolygonsCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        let model_2d = this.view;

        if (model_2d.visible) {
            for (let face = 0; face < model_2d.numFaces; face++) {
                let faceVertices = model_2d.faceVertices[face];
                let vertex0 = faceVertices[0];
                let vx = model_2d.vertexViewX[vertex0];
                let vy = model_2d.vertexViewY[vertex0];
                let vz = model_2d.projectVertexZ[vertex0];

                if (vz > this.clipNear && vz < this.clipFar2d) {
                    let vw = ((this.spriteWidth[face] << this.viewDistance) / vz) | 0;
                    let vh = ((this.spriteHeight[face] << this.viewDistance) / vz) | 0;

                    if (vx - ((vw / 2) | 0) <= this.clipX && vx + ((vw / 2) | 0) >= -this.clipX && vy - vh <= this.clipY && vy >= -this.clipY) {
                        let polygon_2 = this.visiblePolygons[this.visiblePolygonsCount];
                        polygon_2.model = model_2d;
                        polygon_2.face = face;

                        this.initialisePolygon2D(this.visiblePolygonsCount);

                        polygon_2.depth = ((vz + model_2d.projectVertexZ[faceVertices[1]]) / 2) | 0;
                        this.visiblePolygonsCount++;
                    }
                }
            }
        }

        if (this.visiblePolygonsCount === 0) {
            return;
        }

        this.lastVisiblePolygonsCount = this.visiblePolygonsCount;
        this.polygonsQSort(this.visiblePolygons, 0, this.visiblePolygonsCount - 1);
        this.polygonsIntersectSort(100, this.visiblePolygons, this.visiblePolygonsCount);

        for (let model = 0; model < this.visiblePolygonsCount; model++) {
            let polygon = this.visiblePolygons[model];
            let gameModel_2 = polygon.model;
            let l = polygon.face;

            if (gameModel_2 === this.view) {
                let faceverts = gameModel_2.faceVertices[l];
                let face_0 = faceverts[0];
                let vx = gameModel_2.vertexViewX[face_0];
                let vy = gameModel_2.vertexViewY[face_0];
                let vz = gameModel_2.projectVertexZ[face_0];
                let w = ((this.spriteWidth[l] << this.viewDistance) / vz) | 0;
                let h = ((this.spriteHeight[l] << this.viewDistance) / vz) | 0;
                let tx = gameModel_2.vertexViewX[faceverts[1]] - vx;
                let x = vx - ((w / 2) | 0);
                let y = (this.baseY + vy) - h;

                this.surface._spriteClipping_from7(x + this.baseX, y, w, h, this.spriteId[l], tx, ((256 << this.viewDistance) / vz) | 0);

                if (this.mousePickingActive && this.mousePickedCount < this.mousePickedMax) {
                    x += ((this.spriteTranslateX[l] << this.viewDistance) / vz) | 0;

                    if (this.mouseY >= y && this.mouseY <= y + h && this.mouseX >= x && this.mouseX <= x + w && !gameModel_2.unpickable && gameModel_2.isLocalPlayer[l] === 0) {
                        this.mousePickedModels[this.mousePickedCount] = gameModel_2;
                        this.mousePickedFaces[this.mousePickedCount] = l;
                        this.mousePickedCount++;
                    }
                }
            } else {
                let k8 = 0;
                let j10 = 0;
                let l10 = gameModel_2.faceNumVertices[l];
                let ai3 = gameModel_2.faceVertices[l];

                if (gameModel_2.faceIntensity[l] !== COLOUR_TRANSPARENT) {
                    if (polygon.visibility < 0) {
                        j10 = gameModel_2.lightAmbience - gameModel_2.faceIntensity[l];
                    } else {
                        j10 = gameModel_2.lightAmbience + gameModel_2.faceIntensity[l];
                    }
                }

                for (let k11 = 0; k11 < l10; k11++) {
                    let k2 = ai3[k11];

                    this.vertexX[k11] = gameModel_2.projectVertexX[k2];
                    this.vertexY[k11] = gameModel_2.projectVertexY[k2];
                    this.vertexZ[k11] = gameModel_2.projectVertexZ[k2];

                    if (gameModel_2.faceIntensity[l] === COLOUR_TRANSPARENT) {
                        if (polygon.visibility < 0) {
                            j10 = (gameModel_2.lightAmbience - gameModel_2.vertexIntensity[k2]) + gameModel_2.vertexAmbience[k2];
                        } else {
                            j10 = gameModel_2.lightAmbience + gameModel_2.vertexIntensity[k2] + gameModel_2.vertexAmbience[k2];
                        }
                    }

                    if (gameModel_2.projectVertexZ[k2] >= this.clipNear) {
                        this.planeX[k8] = gameModel_2.vertexViewX[k2];
                        this.planeY[k8] = gameModel_2.vertexViewY[k2];
                        this.vertexShade[k8] = j10;

                        if (gameModel_2.projectVertexZ[k2] > this.fogZDistance) {
                            this.vertexShade[k8] += ((gameModel_2.projectVertexZ[k2] - this.fogZDistance) / this.fogZFalloff) | 0;
                        }

                        k8++;
                    } else {
                        let k9 = 0;

                        if (k11 === 0) {
                            k9 = ai3[l10 - 1];
                        } else {
                            k9 = ai3[k11 - 1];
                        }

                        if (gameModel_2.projectVertexZ[k9] >= this.clipNear) {
                            let k7 = gameModel_2.projectVertexZ[k2] - gameModel_2.projectVertexZ[k9];
                            let i5 = gameModel_2.projectVertexX[k2] - ((((gameModel_2.projectVertexX[k2] - gameModel_2.projectVertexX[k9]) * (gameModel_2.projectVertexZ[k2] - this.clipNear)) / k7) | 0);
                            let j6 = gameModel_2.projectVertexY[k2] - ((((gameModel_2.projectVertexY[k2] - gameModel_2.projectVertexY[k9]) * (gameModel_2.projectVertexZ[k2] - this.clipNear)) / k7) | 0);
                            this.planeX[k8] = ((i5 << this.viewDistance) / this.clipNear) | 0;
                            this.planeY[k8] = ((j6 << this.viewDistance) / this.clipNear) | 0;
                            this.vertexShade[k8] = j10;
                            k8++;
                        }

                        if (k11 === l10 - 1) {
                            k9 = ai3[0];
                        } else {
                            k9 = ai3[k11 + 1];
                        }

                        if (gameModel_2.projectVertexZ[k9] >= this.clipNear) {
                            let l7 = gameModel_2.projectVertexZ[k2] - gameModel_2.projectVertexZ[k9];
                            let j5 = gameModel_2.projectVertexX[k2] - ((((gameModel_2.projectVertexX[k2] - gameModel_2.projectVertexX[k9]) * (gameModel_2.projectVertexZ[k2] - this.clipNear)) / l7) | 0);
                            let k6 = gameModel_2.projectVertexY[k2] - ((((gameModel_2.projectVertexY[k2] - gameModel_2.projectVertexY[k9]) * (gameModel_2.projectVertexZ[k2] - this.clipNear)) / l7) | 0);
                            this.planeX[k8] = ((j5 << this.viewDistance) / this.clipNear) | 0;
                            this.planeY[k8] = ((k6 << this.viewDistance) / this.clipNear) | 0;
                            this.vertexShade[k8] = j10;
                            k8++;
                        }
                    }
                }

                for (let i12 = 0; i12 < l10; i12++) {
                    if (this.vertexShade[i12] < 0) {
                        this.vertexShade[i12] = 0;
                    } else if (this.vertexShade[i12] > 255) {
                        this.vertexShade[i12] = 255;
                    }

                    if (polygon.facefill >= 0) {
                        if (this.textureDimension[polygon.facefill] === 1) {
                            this.vertexShade[i12] <<= 9;
                        } else {
                            this.vertexShade[i12] <<= 6;
                        }
                    }
                }

                this.generateScanlines(0, 0, 0, 0, k8, this.planeX, this.planeY, this.vertexShade, gameModel_2, l);

                if (this.maxY > this.minY) {
                    this.rasterize(0, 0, l10, this.vertexX, this.vertexY, this.vertexZ, polygon.facefill, gameModel_2);
                }
            }
        }

        this.mousePickingActive = false;
    }

    generateScanlines(i, j, k, l, i1, ai, ai1, ai2, gameModel, pid) {
        if (i1 === 3) {
            let k1 = ai1[0] + this.baseY;
            let k2 = ai1[1] + this.baseY;
            let k3 = ai1[2] + this.baseY;
            let k4 = ai[0];
            let l5 = ai[1];
            let j7 = ai[2];
            let l8 = ai2[0];
            let j10 = ai2[1];
            let j11 = ai2[2];
            let j12 = (this.baseY + this.clipY) - 1;
            let l12 = 0;
            let j13 = 0;
            let l13 = 0;
            let j14 = 0;
            let l14 = COLOUR_TRANSPARENT;
            let j15 = -COLOUR_TRANSPARENT;

            if (k3 !== k1) {
                j13 = ((j7 - k4 << 8) / (k3 - k1)) | 0;
                j14 = ((j11 - l8 << 8) / (k3 - k1)) | 0;

                if (k1 < k3) {
                    l12 = k4 << 8;
                    l13 = l8 << 8;
                    l14 = k1;
                    j15 = k3;
                } else {
                    l12 = j7 << 8;
                    l13 = j11 << 8;
                    l14 = k3;
                    j15 = k1;
                }

                if (l14 < 0) {
                    l12 -= j13 * l14;
                    l13 -= j14 * l14;
                    l14 = 0;
                }

                if (j15 > j12) {
                    j15 = j12;
                }
            }

            let l15 = 0;
            let j16 = 0;
            let l16 = 0;
            let j17 = 0;
            let l17 = COLOUR_TRANSPARENT;
            let j18 = -COLOUR_TRANSPARENT;

            if (k2 !== k1) {
                j16 = ((l5 - k4 << 8) / (k2 - k1)) | 0;
                j17 = ((j10 - l8 << 8) / (k2 - k1)) | 0;

                if (k1 < k2) {
                    l15 = k4 << 8;
                    l16 = l8 << 8;
                    l17 = k1;
                    j18 = k2;
                } else {
                    l15 = l5 << 8;
                    l16 = j10 << 8;
                    l17 = k2;
                    j18 = k1;
                }

                if (l17 < 0) {
                    l15 -= (j16 * l17) | 0;
                    l16 -= (j17 * l17) | 0;
                    l17 = 0;
                }

                if (j18 > j12) {
                    j18 = j12;
                }
            }

            let l18 = 0;
            let j19 = 0;
            let l19 = 0;
            let j20 = 0;
            let l20 = COLOUR_TRANSPARENT;
            let j21 = -COLOUR_TRANSPARENT;

            if (k3 !== k2) {
                j19 = ((j7 - l5 << 8) / (k3 - k2)) | 0;
                j20 = ((j11 - j10 << 8) / (k3 - k2)) | 0;

                if (k2 < k3) {
                    l18 = l5 << 8;
                    l19 = j10 << 8;
                    l20 = k2;
                    j21 = k3;
                } else {
                    l18 = j7 << 8;
                    l19 = j11 << 8;
                    l20 = k3;
                    j21 = k2;
                }

                if (l20 < 0) {
                    l18 -= (j19 * l20) | 0;
                    l19 -= (j20 * l20) | 0;
                    l20 = 0;
                }

                if (j21 > j12) {
                    j21 = j12;
                }
            }

            this.minY = l14;

            if (l17 < this.minY) {
                this.minY = l17;
            }

            if (l20 < this.minY) {
                this.minY = l20;
            }

            this.maxY = j15;

            if (j18 > this.maxY) {
                this.maxY = j18;
            }

            if (j21 > this.maxY) {
                this.maxY = j21;
            }

            let l21 = 0;

            for (k = this.minY; k < this.maxY; k++) {
                if (k >= l14 && k < j15) {
                    i = j = l12;
                    l = l21 = l13;
                    l12 += j13;
                    l13 += j14;
                } else {
                    i = 655360;
                    j = -655360;
                }

                if (k >= l17 && k < j18) {
                    if (l15 < i) {
                        i = l15;
                        l = l16;
                    }

                    if (l15 > j) {
                        j = l15;
                        l21 = l16;
                    }

                    l15 += j16;
                    l16 += j17;
                }

                if (k >= l20 && k < j21) {
                    if (l18 < i) {
                        i = l18;
                        l = l19;
                    }

                    if (l18 > j) {
                        j = l18;
                        l21 = l19;
                    }

                    l18 += j19;
                    l19 += j20;
                }

                let scanline_6 = this.scanlines[k];
                scanline_6.startX = i;
                scanline_6.endX = j;
                scanline_6.startS = l;
                scanline_6.endS = l21;
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        } else if (i1 === 4) {
            let l1 = ai1[0] + this.baseY;
            let l2 = ai1[1] + this.baseY;
            let l3 = ai1[2] + this.baseY;
            let l4 = ai1[3] + this.baseY;
            let i6 = ai[0];
            let k7 = ai[1];
            let i9 = ai[2];
            let k10 = ai[3];
            let k11 = ai2[0];
            let k12 = ai2[1];
            let i13 = ai2[2];
            let k13 = ai2[3];
            let i14 = (this.baseY + this.clipY) - 1;
            let k14 = 0;
            let i15 = 0;
            let k15 = 0;
            let i16 = 0;
            let k16 = COLOUR_TRANSPARENT;
            let i17 = -COLOUR_TRANSPARENT;

            if (l4 !== l1) {
                i15 = ((k10 - i6 << 8) / (l4 - l1)) | 0;
                i16 = ((k13 - k11 << 8) / (l4 - l1)) | 0;

                if (l1 < l4) {
                    k14 = i6 << 8;
                    k15 = k11 << 8;
                    k16 = l1;
                    i17 = l4;
                } else {
                    k14 = k10 << 8;
                    k15 = k13 << 8;
                    k16 = l4;
                    i17 = l1;
                }

                if (k16 < 0) {
                    k14 -= i15 * k16;
                    k15 -= i16 * k16;
                    k16 = 0;
                }

                if (i17 > i14) {
                    i17 = i14;
                }
            }

            let k17 = 0;
            let i18 = 0;
            let k18 = 0;
            let i19 = 0;
            let k19 = COLOUR_TRANSPARENT;
            let i20 = -COLOUR_TRANSPARENT;

            if (l2 !== l1) {
                i18 = ((k7 - i6 << 8) / (l2 - l1)) | 0;
                i19 = ((k12 - k11 << 8) / (l2 - l1)) | 0;

                if (l1 < l2) {
                    k17 = i6 << 8;
                    k18 = k11 << 8;
                    k19 = l1;
                    i20 = l2;
                } else {
                    k17 = k7 << 8;
                    k18 = k12 << 8;
                    k19 = l2;
                    i20 = l1;
                }

                if (k19 < 0) {
                    k17 -= i18 * k19;
                    k18 -= i19 * k19;
                    k19 = 0;
                }

                if (i20 > i14) {
                    i20 = i14;
                }
            }

            let k20 = 0;
            let i21 = 0;
            let k21 = 0;
            let i22 = 0;
            let j22 = COLOUR_TRANSPARENT;
            let k22 = -COLOUR_TRANSPARENT;

            if (l3 !== l2) {
                i21 = ((i9 - k7 << 8) / (l3 - l2)) | 0;
                i22 = ((i13 - k12 << 8) / (l3 - l2)) | 0;

                if (l2 < l3) {
                    k20 = k7 << 8;
                    k21 = k12 << 8;
                    j22 = l2;
                    k22 = l3;
                } else {
                    k20 = i9 << 8;
                    k21 = i13 << 8;
                    j22 = l3;
                    k22 = l2;
                }

                if (j22 < 0) {
                    k20 -= i21 * j22;
                    k21 -= i22 * j22;
                    j22 = 0;
                }

                if (k22 > i14) {
                    k22 = i14;
                }
            }

            let l22 = 0;
            let i23 = 0;
            let j23 = 0;
            let k23 = 0;
            let l23 = COLOUR_TRANSPARENT;
            let i24 = -COLOUR_TRANSPARENT;

            if (l4 !== l3) {
                i23 = ((k10 - i9 << 8) / (l4 - l3)) | 0;
                k23 = ((k13 - i13 << 8) / (l4 - l3)) | 0;

                if (l3 < l4) {
                    l22 = i9 << 8;
                    j23 = i13 << 8;
                    l23 = l3;
                    i24 = l4;
                } else {
                    l22 = k10 << 8;
                    j23 = k13 << 8;
                    l23 = l4;
                    i24 = l3;
                }

                if (l23 < 0) {
                    l22 -= i23 * l23;
                    j23 -= k23 * l23;
                    l23 = 0;
                }

                if (i24 > i14) {
                    i24 = i14;
                }
            }

            this.minY = k16;

            if (k19 < this.minY) {
                this.minY = k19;
            }

            if (j22 < this.minY) {
                this.minY = j22;
            }

            if (l23 < this.minY) {
                this.minY = l23;
            }

            this.maxY = i17;

            if (i20 > this.maxY) {
                this.maxY = i20;
            }

            if (k22 > this.maxY) {
                this.maxY = k22;
            }

            if (i24 > this.maxY) {
                this.maxY = i24;
            }

            let j24 = 0;

            for (k = this.minY; k < this.maxY; k++) {
                if (k >= k16 && k < i17) {
                    i = j = k14;
                    l = j24 = k15;
                    k14 += i15;
                    k15 += i16;
                } else {
                    i = 655360;
                    j = -655360;
                }

                if (k >= k19 && k < i20) {
                    if (k17 < i) {
                        i = k17;
                        l = k18;
                    }

                    if (k17 > j) {
                        j = k17;
                        j24 = k18;
                    }

                    k17 += i18;
                    k18 += i19;
                }

                if (k >= j22 && k < k22) {
                    if (k20 < i) {
                        i = k20;
                        l = k21;
                    }

                    if (k20 > j) {
                        j = k20;
                        j24 = k21;
                    }

                    k20 += i21;
                    k21 += i22;
                }

                if (k >= l23 && k < i24) {
                    if (l22 < i) {
                        i = l22;
                        l = j23;
                    }

                    if (l22 > j) {
                        j = l22;
                        j24 = j23;
                    }

                    l22 += i23;
                    j23 += k23;
                }

                let scanline_7 = this.scanlines[k];
                scanline_7.startX = i;
                scanline_7.endX = j;
                scanline_7.startS = l;
                scanline_7.endS = j24;
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        } else {
            this.maxY = this.minY = ai1[0] += this.baseY;

            for (k = 1; k < i1; k++) {
                let i2 = 0;

                if ((i2 = ai1[k] += this.baseY) < this.minY) {
                    this.minY = i2;
                } else if (i2 > this.maxY) {
                    this.maxY = i2;
                }
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }

            if (this.maxY >= this.baseY + this.clipY) {
                this.maxY = (this.baseY + this.clipY) - 1;
            }

            if (this.minY >= this.maxY) {
                return;
            }

            for (k = this.minY; k < this.maxY; k++) {
                let scanline = this.scanlines[k];
                scanline.startX = 655360;
                scanline.endX = -655360;
            }

            let j2 = i1 - 1;
            let i3 = ai1[0];
            let i4 = ai1[j2];

            if (i3 < i4) {
                let i5 = ai[0] << 8;
                let j6 = ((ai[j2] - ai[0] << 8) / (i4 - i3)) | 0;
                let l7 = ai2[0] << 8;
                let j9 = ((ai2[j2] - ai2[0] << 8) / (i4 - i3)) | 0;

                if (i3 < 0) {
                    i5 -= j6 * i3;
                    l7 -= j9 * i3;
                    i3 = 0;
                }

                if (i4 > this.maxY) {
                    i4 = this.maxY;
                }

                for (k = i3; k <= i4; k++) {
                    let scanline_2 = this.scanlines[k];
                    scanline_2.startX = scanline_2.endX = i5;
                    scanline_2.startS = scanline_2.endS = l7;
                    i5 += j6;
                    l7 += j9;
                }
            } else if (i3 > i4) {
                let j5 = ai[j2] << 8;
                let k6 = ((ai[0] - ai[j2] << 8) / (i3 - i4)) | 0;
                let i8 = ai2[j2] << 8;
                let k9 = ((ai2[0] - ai2[j2] << 8) / (i3 - i4)) | 0;

                if (i4 < 0) {
                    j5 -= k6 * i4;
                    i8 -= k9 * i4;
                    i4 = 0;
                }

                if (i3 > this.maxY) {
                    i3 = this.maxY;
                }

                for (k = i4; k <= i3; k++) {
                    let scanline_3 = this.scanlines[k];
                    scanline_3.startX = scanline_3.endX = j5;
                    scanline_3.startS = scanline_3.endS = i8;
                    j5 += k6;
                    i8 += k9;
                }
            }

            for (k = 0; k < j2; k++) {
                let k5 = k + 1;
                let j3 = ai1[k];
                let j4 = ai1[k5];

                if (j3 < j4) {
                    let l6 = ai[k] << 8;
                    let j8 = ((ai[k5] - ai[k] << 8) / (j4 - j3)) | 0;
                    let l9 = ai2[k] << 8;
                    let l10 = ((ai2[k5] - ai2[k] << 8) / (j4 - j3)) | 0;

                    if (j3 < 0) {
                        l6 -= j8 * j3;
                        l9 -= l10 * j3;
                        j3 = 0;
                    }

                    if (j4 > this.maxY) {
                        j4 = this.maxY;
                    }

                    for (let l11 = j3; l11 <= j4; l11++) {
                        let scanline_4 = this.scanlines[l11];

                        if (l6 < scanline_4.startX) {
                            scanline_4.startX = l6;
                            scanline_4.startS = l9;
                        }

                        if (l6 > scanline_4.endX) {
                            scanline_4.endX = l6;
                            scanline_4.endS = l9;
                        }

                        l6 += j8;
                        l9 += l10;
                    }
                } else if (j3 > j4) {
                    let i7 = ai[k5] << 8;
                    let k8 = ((ai[k] - ai[k5] << 8) / (j3 - j4)) | 0;
                    let i10 = ai2[k5] << 8;
                    let i11 = ((ai2[k] - ai2[k5] << 8) / (j3 - j4)) | 0;

                    if (j4 < 0) {
                        i7 -= k8 * j4;
                        i10 -= i11 * j4;
                        j4 = 0;
                    }

                    if (j3 > this.maxY) {
                        j3 = this.maxY;
                    }

                    for (let i12 = j4; i12 <= j3; i12++) {
                        let scanline_5 = this.scanlines[i12];

                        if (i7 < scanline_5.startX) {
                            scanline_5.startX = i7;
                            scanline_5.startS = i10;
                        }

                        if (i7 > scanline_5.endX) {
                            scanline_5.endX = i7;
                            scanline_5.endS = i10;
                        }

                        i7 += k8;
                        i10 += i11;
                    }
                }
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        }

        if (this.mousePickingActive && this.mousePickedCount < this.mousePickedMax && this.mouseY >= this.minY && this.mouseY < this.maxY) {
            let scanline_1 = this.scanlines[this.mouseY];

            if (this.mouseX >= scanline_1.startX >> 8 && this.mouseX <= scanline_1.endX >> 8 && scanline_1.startX <= scanline_1.endX && !gameModel.unpickable && gameModel.isLocalPlayer[pid] === 0) {
                this.mousePickedModels[this.mousePickedCount] = gameModel;
                this.mousePickedFaces[this.mousePickedCount] = pid;
                this.mousePickedCount++;
            }
        }
    }

    rasterize(i, j, k, ai, ai1, ai2, l, gameModel) {
        if (l === -2) {
            return;
        }

        if (l >= 0) {
            if (l >= this.textureCount) {
                l = 0;
            }

            this.prepareTexture(l);

            let i1 = ai[0];
            let k1 = ai1[0];
            let j2 = ai2[0];
            let i3 = i1 - ai[1];
            let k3 = k1 - ai1[1];
            let i4 = j2 - ai2[1];
            k--;
            let i6 = ai[k] - i1;
            let j7 = ai1[k] - k1;
            let k8 = ai2[k] - j2;

            if (this.textureDimension[l] === 1) {
                let l9 = i6 * k1 - j7 * i1 << 12;
                let k10 = j7 * j2 - k8 * k1 << (5 - this.viewDistance) + 7 + 4;
                let i11 = k8 * i1 - i6 * j2 << (5 - this.viewDistance) + 7;
                let k11 = i3 * k1 - k3 * i1 << 12;
                let i12 = k3 * j2 - i4 * k1 << (5 - this.viewDistance) + 7 + 4;
                let k12 = i4 * i1 - i3 * j2 << (5 - this.viewDistance) + 7;
                let i13 = k3 * i6 - i3 * j7 << 5;
                let k13 = i4 * j7 - k3 * k8 << (5 - this.viewDistance) + 4;
                let i14 = i3 * k8 - i4 * i6 >> this.viewDistance - 5;
                let k14 = k10 >> 4;
                let i15 = i12 >> 4;
                let k15 = k13 >> 4;
                let i16 = this.minY - this.baseY;
                let k16 = this.width;
                let i17 = this.baseX + this.minY * k16;
                let byte1 = 1;
                l9 += i11 * i16;
                k11 += k12 * i16;
                i13 += i14 * i16;

                if (this.interlace) {
                    if ((this.minY & 1) === 1) {
                        this.minY++;
                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    }

                    i11 <<= 1;
                    k12 <<= 1;
                    i14 <<= 1;
                    k16 <<= 1;
                    byte1 = 2;
                }

                if (gameModel.textureTranslucent) {
                    for (i = this.minY; i < this.maxY; i += byte1) {
                        let scanline_3 = this.scanlines[i];
                        j = scanline_3.startX >> 8;
                        let k17 = scanline_3.endX >> 8;
                        let k20 = k17 - j;

                        if (k20 <= 0) {
                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        } else {
                            let i22 = scanline_3.startS;
                            let k23 = ((scanline_3.endS - i22) / k20) | 0;

                            if (j < -this.clipX) {
                                i22 += (-this.clipX - j) * k23;
                                j = -this.clipX;
                                k20 = k17 - j;
                            }

                            if (k17 > this.clipX) {
                                let l17 = this.clipX;
                                k20 = l17 - j;
                            }

                            Scene.textureTranslucentScanline(this.raster, this.texturePixels[l], 0, 0, l9 + k14 * j, k11 + i15 * j, i13 + k15 * j, k10, i12, k13, k20, i17 + j, i22, k23 << 2);

                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        }
                    }

                    return;
                }

                if (!this.textureBackTransparent[l]) {
                    for (i = this.minY; i < this.maxY; i += byte1) {
                        let scanline_4 = this.scanlines[i];
                        j = scanline_4.startX >> 8;
                        let i18 = scanline_4.endX >> 8;
                        let l20 = i18 - j;

                        if (l20 <= 0) {
                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        } else {
                            let j22 = scanline_4.startS;
                            let l23 = ((scanline_4.endS - j22) / l20) | 0;

                            if (j < -this.clipX) {
                                j22 += (-this.clipX - j) * l23;
                                j = -this.clipX;
                                l20 = i18 - j;
                            }

                            if (i18 > this.clipX) {
                                let j18 = this.clipX;
                                l20 = j18 - j;
                            }

                            Scene.textureScanline(this.raster, this.texturePixels[l], 0, 0, l9 + k14 * j, k11 + i15 * j, i13 + k15 * j, k10, i12, k13, l20, i17 + j, j22, l23 << 2);

                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        }
                    }

                    return;
                }

                for (i = this.minY; i < this.maxY; i += byte1) {
                    let scanline_5 = this.scanlines[i];
                    j = scanline_5.startX >> 8;
                    let k18 = scanline_5.endX >> 8;
                    let i21 = k18 - j;

                    if (i21 <= 0) {
                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    } else {
                        let k22 = scanline_5.startS;
                        let i24 = ((scanline_5.endS - k22) / i21) | 0;

                        if (j < -this.clipX) {
                            k22 += (-this.clipX - j) * i24;
                            j = -this.clipX;
                            i21 = k18 - j;
                        }

                        if (k18 > this.clipX) {
                            let l18 = this.clipX;
                            i21 = l18 - j;
                        }

                        Scene.textureBackTranslucentScanline(this.raster, 0, 0, 0, this.texturePixels[l], l9 + k14 * j, k11 + i15 * j, i13 + k15 * j, k10, i12, k13, i21, i17 + j, k22, i24);

                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    }
                }

                return;
            }

            let i10 = i6 * k1 - j7 * i1 << 11;
            let l10 = j7 * j2 - k8 * k1 << (5 - this.viewDistance) + 6 + 4;
            let j11 = k8 * i1 - i6 * j2 << (5 - this.viewDistance) + 6;
            let l11 = i3 * k1 - k3 * i1 << 11;
            let j12 = k3 * j2 - i4 * k1 << (5 - this.viewDistance) + 6 + 4;
            let l12 = i4 * i1 - i3 * j2 << (5 - this.viewDistance) + 6;
            let j13 = k3 * i6 - i3 * j7 << 5;
            let l13 = i4 * j7 - k3 * k8 << (5 - this.viewDistance) + 4;
            let j14 = i3 * k8 - i4 * i6 >> this.viewDistance - 5;
            let l14 = l10 >> 4;
            let j15 = j12 >> 4;
            let l15 = l13 >> 4;
            let j16 = this.minY - this.baseY;
            let l16 = this.width;
            let j17 = this.baseX + this.minY * l16;
            let byte2 = 1;
            i10 += j11 * j16;
            l11 += l12 * j16;
            j13 += j14 * j16;

            if (this.interlace) {
                if ((this.minY & 1) === 1) {
                    this.minY++;
                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                }

                j11 <<= 1;
                l12 <<= 1;
                j14 <<= 1;
                l16 <<= 1;
                byte2 = 2;
            }

            if (gameModel.textureTranslucent) {
                for (i = this.minY; i < this.maxY; i += byte2) {
                    let scanline_6 = this.scanlines[i];
                    j = scanline_6.startX >> 8;
                    let i19 = scanline_6.endX >> 8;
                    let j21 = i19 - j;

                    if (j21 <= 0) {
                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    } else {
                        let l22 = scanline_6.startS;
                        let j24 = ((scanline_6.endS - l22) / j21) | 0;

                        if (j < -this.clipX) {
                            l22 += (-this.clipX - j) * j24;
                            j = -this.clipX;
                            j21 = i19 - j;
                        }

                        if (i19 > this.clipX) {
                            let j19 = this.clipX;
                            j21 = j19 - j;
                        }

                        Scene.textureTranslucentScanline2(this.raster, this.texturePixels[l], 0, 0, i10 + l14 * j, l11 + j15 * j, j13 + l15 * j, l10, j12, l13, j21, j17 + j, l22, j24);

                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    }
                }

                return;
            }

            if (!this.textureBackTransparent[l]) {
                for (i = this.minY; i < this.maxY; i += byte2) {
                    let scanline_7 = this.scanlines[i];
                    j = scanline_7.startX >> 8;
                    let k19 = scanline_7.endX >> 8;
                    let k21 = k19 - j;

                    if (k21 <= 0) {
                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    } else {
                        let i23 = scanline_7.startS;
                        let k24 = ((scanline_7.endS - i23) / k21) | 0;

                        if (j < -this.clipX) {
                            i23 += (-this.clipX - j) * k24;
                            j = -this.clipX;
                            k21 = k19 - j;
                        }
                        if (k19 > this.clipX) {
                            let l19 = this.clipX;
                            k21 = l19 - j;
                        }

                        Scene.textureScanline2(this.raster, this.texturePixels[l], 0, 0, i10 + l14 * j, l11 + j15 * j, j13 + l15 * j, l10, j12, l13, k21, j17 + j, i23, k24);

                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    }
                }

                return;
            }

            for (i = this.minY; i < this.maxY; i += byte2) {
                let scanline = this.scanlines[i];
                j = scanline.startX >> 8;
                let i20 = scanline.endX >> 8;
                let l21 = i20 - j;

                if (l21 <= 0) {
                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                } else {
                    let j23 = scanline.startS;
                    let l24 = ((scanline.endS - j23) / l21) | 0;

                    if (j < -this.clipX) {
                        j23 += (-this.clipX - j) * l24;
                        j = -this.clipX;
                        l21 = i20 - j;
                    }

                    if (i20 > this.clipX) {
                        let j20 = this.clipX;
                        l21 = j20 - j;
                    }

                    Scene.textureBackTranslucentScanline2(this.raster, 0, 0, 0, this.texturePixels[l], i10 + l14 * j, l11 + j15 * j, j13 + l15 * j, l10, j12, l13, l21, j17 + j, j23, l24);

                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                }
            }

            return;
        }

        for (let j1 = 0; j1 < this.rampCount; j1++) {
            if (this.gradientBase[j1] === l) {
                this.anIntArray377 = this.gradientRamps[j1];
                break;
            }

            if (j1 === this.rampCount - 1) {
                let l1 = (Math.random() * this.rampCount) | 0;
                this.gradientBase[l1] = l;
                l = -1 - l;
                let k2 = (l >> 10 & 0x1f) * 8;
                let j3 = (l >> 5 & 0x1f) * 8;
                let l3 = (l & 0x1f) * 8;

                for (let j4 = 0; j4 < 256; j4++) {
                    let j6 = j4 * j4;
                    let k7 = ((k2 * j6) / 0x10000) | 0;
                    let l8 = ((j3 * j6) / 0x10000) | 0;
                    let j10 = ((l3 * j6) / 0x10000) | 0;
                    this.gradientRamps[l1][255 - j4] = (k7 << 16) + (l8 << 8) + j10;
                }

                this.anIntArray377 = this.gradientRamps[l1];
            }
        }

        let i2 = this.width;
        let l2 = this.baseX + this.minY * i2;
        let byte0 = 1;

        if (this.interlace) {
            if ((this.minY & 1) === 1) {
                this.minY++;
                l2 += i2;
            }

            i2 <<= 1;
            byte0 = 2;
        }

        if (gameModel.transparent) {
            for (i = this.minY; i < this.maxY; i += byte0) {
                let scanline = this.scanlines[i];
                j = scanline.startX >> 8;
                let k4 = scanline.endX >> 8;
                let k6 = k4 - j;

                if (k6 <= 0) {
                    l2 += i2;
                } else {
                    let l7 = scanline.startS;
                    let i9 = ((scanline.endS - l7) / k6) | 0;

                    if (j < -this.clipX) {
                        l7 += (-this.clipX - j) * i9;
                        j = -this.clipX;
                        k6 = k4 - j;
                    }

                    if (k4 > this.clipX) {
                        let l4 = this.clipX;
                        k6 = l4 - j;
                    }

                    Scene.textureGradientScanline(this.raster, -k6, l2 + j, 0, this.anIntArray377, l7, i9);
                    l2 += i2;
                }
            }

            return;
        }

        if (this.wideBand) {
            for (i = this.minY; i < this.maxY; i += byte0) {
                let scanline_1 = this.scanlines[i];
                j = scanline_1.startX >> 8;
                let i5 = scanline_1.endX >> 8;
                let l6 = i5 - j;

                if (l6 <= 0) {
                    l2 += i2;
                } else {
                    let i8 = scanline_1.startS;
                    let j9 = ((scanline_1.endS - i8) / l6) | 0;

                    if (j < -this.clipX) {
                        i8 += (-this.clipX - j) * j9;
                        j = -this.clipX;
                        l6 = i5 - j;
                    }

                    if (i5 > this.clipX) {
                        let j5 = this.clipX;
                        l6 = j5 - j;
                    }

                    Scene.gradientScanline(this.raster, -l6, l2 + j, 0, this.anIntArray377, i8, j9);
                    l2 += i2;
                }
            }

            return;
        }

        for (i = this.minY; i < this.maxY; i += byte0) {
            let scanline_2 = this.scanlines[i];
            j = scanline_2.startX >> 8;
            let k5 = scanline_2.endX >> 8;
            let i7 = k5 - j;

            if (i7 <= 0) {
                l2 += i2;
            } else {
                let j8 = scanline_2.startS;
                let k9 = ((scanline_2.endS - j8) / i7) | 0;

                if (j < -this.clipX) {
                    j8 += (-this.clipX - j) * k9;
                    j = -this.clipX;
                    i7 = k5 - j;
                }

                if (k5 > this.clipX) {
                    let l5 = this.clipX;
                    i7 = l5 - j;
                }

                Scene.gradientScanline2(this.raster, -i7, l2 + j, 0, this.anIntArray377, j8, k9);
                l2 += i2;
            }
        }
    }

    setCamera(x, z, y, pitch, yaw, roll, distance) {
        pitch &= 0x3ff;
        yaw &= 0x3ff;
        roll &= 0x3ff;
        this.cameraYaw = 1024 - pitch & 0x3ff;
        this.cameraPitch = 1024 - yaw & 0x3ff;
        this.cameraRoll = 1024 - roll & 0x3ff;

        let l1 = 0;
        let i2 = 0;
        let j2 = distance;

        if (pitch !== 0) {
            let k2 = Scene.sin2048Cache[pitch];
            let j3 = Scene.sin2048Cache[pitch + 1024];
            let i4 = i2 * j3 - j2 * k2 >> 15;
            j2 = i2 * k2 + j2 * j3 >> 15;
            i2 = i4;
        }

        if (yaw !== 0) {
            let l2 = Scene.sin2048Cache[yaw];
            let k3 = Scene.sin2048Cache[yaw + 1024];
            let j4 = j2 * l2 + l1 * k3 >> 15;
            j2 = j2 * k3 - l1 * l2 >> 15;
            l1 = j4;
        }

        if (roll !== 0) {
            let i3 = Scene.sin2048Cache[roll];
            let l3 = Scene.sin2048Cache[roll + 1024];
            let k4 = i2 * i3 + l1 * l3 >> 15;
            i2 = i2 * l3 - l1 * i3 >> 15;
            l1 = k4;
        }

        this.cameraX = x - l1;
        this.cameraY = z - i2;
        this.cameraZ = y - j2;
    }

    initialisePolygon3D(i) {
        let polygon = this.visiblePolygons[i];
        let gameModel = polygon.model;
        let face = polygon.face;
        let faceVertices = gameModel.faceVertices[face];
        let faceNumVertices = gameModel.faceNumVertices[face];
        let faceCameraNormalScale = gameModel.normalScale[face];
        let vcx = gameModel.projectVertexX[faceVertices[0]];
        let vcy = gameModel.projectVertexY[faceVertices[0]];
        let vcz = gameModel.projectVertexZ[faceVertices[0]];
        let vcx1 = gameModel.projectVertexX[faceVertices[1]] - vcx;
        let vcy1 = gameModel.projectVertexY[faceVertices[1]] - vcy;
        let vcz1 = gameModel.projectVertexZ[faceVertices[1]] - vcz;
        let vcx2 = gameModel.projectVertexX[faceVertices[2]] - vcx;
        let vcy2 = gameModel.projectVertexY[faceVertices[2]] - vcy;
        let vcz2 = gameModel.projectVertexZ[faceVertices[2]] - vcz;
        let t1 = vcy1 * vcz2 - vcy2 * vcz1;
        let t2 = vcz1 * vcx2 - vcz2 * vcx1;
        let t3 = vcx1 * vcy2 - vcx2 * vcy1;

        if (faceCameraNormalScale === -1) {
            faceCameraNormalScale = 0;

            for (; t1 > 25000 || t2 > 25000 || t3 > 25000 || t1 < -25000 || t2 < -25000 || t3 < -25000; t3 >>= 1) {
                faceCameraNormalScale++;
                t1 >>= 1;
                t2 >>= 1;
            }

            gameModel.normalScale[face] = faceCameraNormalScale;
            gameModel.normalMagnitude[face] = (this.normalMagnitude * Math.sqrt(t1 * t1 + t2 * t2 + t3 * t3)) | 0;
        } else {
            t1 >>= faceCameraNormalScale;
            t2 >>= faceCameraNormalScale;
            t3 >>= faceCameraNormalScale;
        }

        polygon.visibility = vcx * t1 + vcy * t2 + vcz * t3;
        polygon.normalX = t1;
        polygon.normalY = t2;
        polygon.normalZ = t3;

        let j4 = gameModel.projectVertexZ[faceVertices[0]];
        let k4 = j4;
        let l4 = gameModel.vertexViewX[faceVertices[0]];
        let i5 = l4;
        let j5 = gameModel.vertexViewY[faceVertices[0]];
        let k5 = j5;

        for (let l5 = 1; l5 < faceNumVertices; l5++) {
            let i1 = gameModel.projectVertexZ[faceVertices[l5]];

            if (i1 > k4) {
                k4 = i1;
            } else if (i1 < j4) {
                j4 = i1;
            }

            i1 = gameModel.vertexViewX[faceVertices[l5]];

            if (i1 > i5) {
                i5 = i1;
            } else if (i1 < l4) {
                l4 = i1;
            }

            i1 = gameModel.vertexViewY[faceVertices[l5]];

            if (i1 > k5) {
                k5 = i1;
            } else if (i1 < j5) {
                j5 = i1;
            }
        }

        polygon.minZ = j4;
        polygon.maxZ = k4;
        polygon.minPlaneX = l4;
        polygon.maxPlaneX = i5;
        polygon.minPlaneY = j5;
        polygon.maxPlaneY = k5;
    }

    initialisePolygon2D(i) {
        let polygon = this.visiblePolygons[i];
        let gameModel = polygon.model;
        let j = polygon.face;
        let ai = gameModel.faceVertices[j];
        let l = 0;
        let i1 = 0;
        let j1 = 1;
        let k1 = gameModel.projectVertexX[ai[0]];
        let l1 = gameModel.projectVertexY[ai[0]];
        let i2 = gameModel.projectVertexZ[ai[0]];

        gameModel.normalMagnitude[j] = 1;
        gameModel.normalScale[j] = 0;
        polygon.visibility = k1 * l + l1 * i1 + i2 * j1;
        polygon.normalX = l;
        polygon.normalY = i1;
        polygon.normalZ = j1;

        let j2 = gameModel.projectVertexZ[ai[0]];
        let k2 = j2;
        let l2 = gameModel.vertexViewX[ai[0]];
        let i3 = l2;

        if (gameModel.vertexViewX[ai[1]] < l2) {
            l2 = gameModel.vertexViewX[ai[1]];
        } else {
            i3 = gameModel.vertexViewX[ai[1]];
        }

        let j3 = gameModel.vertexViewY[ai[1]];
        let k3 = gameModel.vertexViewY[ai[0]];
        let k = gameModel.projectVertexZ[ai[1]];

        if (k > k2) {
            k2 = k;
        } else if (k < j2) {
            j2 = k;
        }

        k = gameModel.vertexViewX[ai[1]];

        if (k > i3) {
            i3 = k;
        } else if (k < l2) {
            l2 = k;
        }

        k = gameModel.vertexViewY[ai[1]];

        if (k > k3) {
            k3 = k;
        } else if (k < j3) {
            j3 = k;
        }

        polygon.minZ = j2;
        polygon.maxZ = k2;
        polygon.minPlaneX = l2 - 20;
        polygon.maxPlaneX = i3 + 20;
        polygon.minPlaneY = j3;
        polygon.maxPlaneY = k3;
    }

    separatePolygon(polygon, polygon_1) {
        if (polygon.minPlaneX >= polygon_1.maxPlaneX) {
            return true;
        }

        if (polygon_1.minPlaneX >= polygon.maxPlaneX) {
            return true;
        }

        if (polygon.minPlaneY >= polygon_1.maxPlaneY) {
            return true;
        }

        if (polygon_1.minPlaneY >= polygon.maxPlaneY) {
            return true;
        }

        if (polygon.minZ >= polygon_1.maxZ) {
            return true;
        }

        if (polygon_1.minZ > polygon.maxZ) {
            return false;
        }

        let gameModel = polygon.model;
        let gameModel_1 = polygon_1.model;
        let i = polygon.face;
        let j = polygon_1.face;
        let ai = gameModel.faceVertices[i];
        let ai1 = gameModel_1.faceVertices[j];
        let k = gameModel.faceNumVertices[i];
        let l = gameModel_1.faceNumVertices[j];
        let k2 = gameModel_1.projectVertexX[ai1[0]];
        let l2 = gameModel_1.projectVertexY[ai1[0]];
        let i3 = gameModel_1.projectVertexZ[ai1[0]];
        let j3 = polygon_1.normalX;
        let k3 = polygon_1.normalY;
        let l3 = polygon_1.normalZ;
        let i4 = gameModel_1.normalMagnitude[j];
        let j4 = polygon_1.visibility;
        let flag = false;

        for (let k4 = 0; k4 < k; k4++) {
            let i1 = ai[k4];
            let i2 = (k2 - gameModel.projectVertexX[i1]) * j3 + (l2 - gameModel.projectVertexY[i1]) * k3 + (i3 - gameModel.projectVertexZ[i1]) * l3;

            if ((i2 >= -i4 || j4 >= 0) && (i2 <= i4 || j4 <= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        k2 = gameModel.projectVertexX[ai[0]];
        l2 = gameModel.projectVertexY[ai[0]];
        i3 = gameModel.projectVertexZ[ai[0]];
        j3 = polygon.normalX;
        k3 = polygon.normalY;
        l3 = polygon.normalZ;
        i4 = gameModel.normalMagnitude[i];
        j4 = polygon.visibility;
        flag = false;

        for (let l4 = 0; l4 < l; l4++) {
            let j1 = ai1[l4];
            let j2 = (k2 - gameModel_1.projectVertexX[j1]) * j3 + (l2 - gameModel_1.projectVertexY[j1]) * k3 + (i3 - gameModel_1.projectVertexZ[j1]) * l3;

            if ((j2 >= -i4 || j4 <= 0) && (j2 <= i4 || j4 >= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        let ai2 = null;
        let ai3 = null;

        if (k === 2) {
            ai2 = new Int32Array(4);
            ai3 = new Int32Array(4);
            let i5 = ai[0];
            let k1 = ai[1];
            ai2[0] = gameModel.vertexViewX[i5] - 20;
            ai2[1] = gameModel.vertexViewX[k1] - 20;
            ai2[2] = gameModel.vertexViewX[k1] + 20;
            ai2[3] = gameModel.vertexViewX[i5] + 20;
            ai3[0] = ai3[3] = gameModel.vertexViewY[i5];
            ai3[1] = ai3[2] = gameModel.vertexViewY[k1];
        } else {
            ai2 = new Int32Array(k);
            ai3 = new Int32Array(k);

            for (let j5 = 0; j5 < k; j5++) {
                let i6 = ai[j5];
                ai2[j5] = gameModel.vertexViewX[i6];
                ai3[j5] = gameModel.vertexViewY[i6];
            }

        }

        let ai4 = null;
        let ai5 = null;

        if (l === 2) {
            ai4 = new Int32Array(4);
            ai5 = new Int32Array(4);
            let k5 = ai1[0];
            let l1 = ai1[1];
            ai4[0] = gameModel_1.vertexViewX[k5] - 20;
            ai4[1] = gameModel_1.vertexViewX[l1] - 20;
            ai4[2] = gameModel_1.vertexViewX[l1] + 20;
            ai4[3] = gameModel_1.vertexViewX[k5] + 20;
            ai5[0] = ai5[3] = gameModel_1.vertexViewY[k5];
            ai5[1] = ai5[2] = gameModel_1.vertexViewY[l1];
        } else {
            ai4 = new Int32Array(l);
            ai5 = new Int32Array(l);

            for (let l5 = 0; l5 < l; l5++) {
                let j6 = ai1[l5];
                ai4[l5] = gameModel_1.vertexViewX[j6];
                ai5[l5] = gameModel_1.vertexViewY[j6];
            }
        }

        return !this.intersect(ai2, ai3, ai4, ai5);
    }

    heuristicPolygon(polygon, polygon_1) {
        let gameModel = polygon.model;
        let gameModel_1 = polygon_1.model;
        let i = polygon.face;
        let j = polygon_1.face;
        let ai = gameModel.faceVertices[i];
        let ai1 = gameModel_1.faceVertices[j];
        let k = gameModel.faceNumVertices[i];
        let l = gameModel_1.faceNumVertices[j];
        let i2 = gameModel_1.projectVertexX[ai1[0]];
        let j2 = gameModel_1.projectVertexY[ai1[0]];
        let k2 = gameModel_1.projectVertexZ[ai1[0]];
        let l2 = polygon_1.normalX;
        let i3 = polygon_1.normalY;
        let j3 = polygon_1.normalZ;
        let k3 = gameModel_1.normalMagnitude[j];
        let l3 = polygon_1.visibility;
        let flag = false;

        for (let i4 = 0; i4 < k; i4++) {
            let i1 = ai[i4];
            let k1 = (i2 - gameModel.projectVertexX[i1]) * l2 + (j2 - gameModel.projectVertexY[i1]) * i3 + (k2 - gameModel.projectVertexZ[i1]) * j3;
            if ((k1 >= -k3 || l3 >= 0) && (k1 <= k3 || l3 <= 0)) {
                continue;
            }
            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        i2 = gameModel.projectVertexX[ai[0]];
        j2 = gameModel.projectVertexY[ai[0]];
        k2 = gameModel.projectVertexZ[ai[0]];
        l2 = polygon.normalX;
        i3 = polygon.normalY;
        j3 = polygon.normalZ;
        k3 = gameModel.normalMagnitude[i];
        l3 = polygon.visibility;
        flag = false;

        for (let j4 = 0; j4 < l; j4++) {
            let j1 = ai1[j4];
            let l1 = (i2 - gameModel_1.projectVertexX[j1]) * l2 + (j2 - gameModel_1.projectVertexY[j1]) * i3 + (k2 - gameModel_1.projectVertexZ[j1]) * j3;

            if ((l1 >= -k3 || l3 <= 0) && (l1 <= k3 || l3 >= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        return !flag;
    }

    allocateTextures(count, something7, something11) {
        this.textureCount = count;
        this.textureColoursUsed = []; // byte[][]
        this.textureColoursUsed.length = count; // byte[][]
        this.textureColoursUsed.fill(null);
        this.textureColourList = [];
        this.textureColourList.length = count;
        this.textureColourList.fill(null);
        this.textureDimension = new Int32Array(count);
        this.textureLoadedNumber = [];
        this.textureLoadedNumber.length = count;
        this.textureLoadedNumber.fill(null);
        this.textureBackTransparent = new Int8Array(count);
        this.texturePixels = [];
        this.texturePixels.length = count;
        this.texturePixels.fill(null);
        Scene.textureCountLoaded = new Long(0);

        for (let i = 0; i < count; i += 1) {
            this.textureLoadedNumber.push(new Long(0));
        }

        // 64x64 rgba
        this.textureColours64 = [];
        this.textureColours64.length = something7;
        this.textureColours64.fill(null);

        // 128x128 rgba
        this.textureColours128 = [];
        this.textureColours128.length = something11;
        this.textureColours128.fill(null);
    }

    defineTexture(id, usedColours, colours, wide128) {
        this.textureColoursUsed[id] = usedColours;
        this.textureColourList[id] = colours;
        this.textureDimension[id] = wide128; // is 1 if the this.texture is 128+ pixels wide, 0 if <128
        this.textureLoadedNumber[id] = new Long(0); // as in the current loaded this.texture count when its loaded
        this.textureBackTransparent[id] = false;
        this.texturePixels[id] = null;
        this.prepareTexture(id);
    }

    prepareTexture(id) {
        if (id < 0) {
            return;
        }

        Scene.textureCountLoaded = Scene.textureCountLoaded.add(1);
        this.textureLoadedNumber[id] = new Long(Scene.textureCountLoaded);

        if (this.texturePixels[id] !== null) {
            return;
        }

        if (this.textureDimension[id] === 0) { // is 64 pixels wide
            for (let j = 0; j < this.textureColours64.length; j++) {
                if (this.textureColours64[j] === null) {
                    this.textureColours64[j] = new Int32Array(16384);
                    this.texturePixels[id] = this.textureColours64[j];
                    this.setTexturePixels(id);
                    return;
                }
            }

            let GIGALONG = new Long(1).shiftLeft(30); // almost as large as exemplar's nas storage
            let wut = 0;

            for (let k1 = 0; k1 < this.textureCount; k1++) {
                if (k1 !== id && this.textureDimension[k1] === 0 && this.texturePixels[k1] !== null && this.textureLoadedNumber[k1].lessThan(GIGALONG)) {
                    GIGALONG = this.textureLoadedNumber[k1];
                    wut = k1;
                }
            }

            this.texturePixels[id] = this.texturePixels[wut];
            this.texturePixels[wut] = null;
            this.setTexturePixels(id);
            return;
        }

        // is 128 wide
        for (let k = 0; k < this.textureColours128.length; k++) {
            if (this.textureColours128[k] === null) {
                this.textureColours128[k] = new Int32Array(0x10000);
                this.texturePixels[id] = this.textureColours128[k];
                this.setTexturePixels(id);
                return;
            }
        }

        let GIGALONG = new Long(1).shiftLeft(30); // 1G 2G 3G... 4G?
        let wat = 0;

        for (let i2 = 0; i2 < this.textureCount; i2++) {
            if (i2 !== id && this.textureDimension[i2] === 1 && this.texturePixels[i2] !== null && this.textureLoadedNumber[i2].lessThan(GIGALONG)) {
                GIGALONG = this.textureLoadedNumber[i2];
                wat = i2;
            }
        }

        this.texturePixels[id] = this.texturePixels[wat];
        this.texturePixels[wat] = null;
        this.setTexturePixels(id);
    }

    setTexturePixels(id) {
        let textureWidth = 0;

        if (this.textureDimension[id] === 0) {
            textureWidth = 64;
        } else {
            textureWidth = 128;
        }

        let colours = this.texturePixels[id];
        let colourCount = 0;

        for (let x = 0; x < textureWidth; x++) {
            for (let y = 0; y < textureWidth; y++) {
                let colour = this.textureColourList[id][this.textureColoursUsed[id][y + x * textureWidth] & 0xff];
                colour &= 0xf8f8ff;

                if (colour === 0) {
                    colour = 1;
                } else if (colour === 0xf800ff) {
                    colour = 0;
                    this.textureBackTransparent[id] = true;
                }

                colours[colourCount++] = colour;
            }
        }

        for (let i1 = 0; i1 < colourCount; i1++) {
            let colour = colours[i1]; // ??
            colours[colourCount + i1] = colour - (colour >>> 3) & 0xf8f8ff;
            colours[colourCount * 2 + i1] = colour - (colour >>> 2) & 0xf8f8ff;
            colours[colourCount * 3 + i1] = colour - (colour >>> 2) - (colour >>> 3) & 0xf8f8ff;
        }
    }

    doSOemthingWithTheFuckinFountainFuck(id) {
        if (this.texturePixels[id] === null) {
            return;
        }

        let colours = this.texturePixels[id];

        for (let i = 0; i < 64; i++) {
            let k = i + 4032;
            let l = colours[k];

            for (let j1 = 0; j1 < 63; j1++) {
                colours[k] = colours[k - 64];
                k -= 64;
            }

            this.texturePixels[id][k] = l;
        }

        let c = 4096;

        for (let i1 = 0; i1 < c; i1++) {
            let k1 = colours[i1];
            colours[c + i1] = k1 - (k1 >>> 3) & 0xf8f8ff;
            colours[c * 2 + i1] = k1 - (k1 >>> 2) & 0xf8f8ff;
            colours[c * 3 + i1] = k1 - (k1 >>> 2) - (k1 >>> 3) & 0xf8f8ff;
        }
    }

    method302(i) {
        if (i === COLOUR_TRANSPARENT) {
            return 0;
        }

        this.prepareTexture(i);

        if (i >= 0) {
            return this.texturePixels[i][0];
        }

        if (i < 0) {
            i = -(i + 1);

            let j = i >> 10 & 0x1f;
            let k = i >> 5 & 0x1f;
            let l = i & 0x1f;

            return (j << 19) + (k << 11) + (l << 3);
        } else {
            return 0;
        }
    }

    _setLight_from3(i, j, k) {
        if (i === 0 && j === 0 && k === 0) {
            i = 32;
        }

        for (let l = 0; l < this.modelCount; l++) {
            this.models[l]._setLight_from3(i, j, k);
        }
    }

    _setLight_from5(i, j, k, l, i1) {
        if (k === 0 && l === 0 && i1 === 0) {
            k = 32;
        }

        for (let j1 = 0; j1 < this.modelCount; j1++) {
            this.models[j1]._setLight_from5(i, j, k, l, i1);
        }
    }

    setLight(...args) {
        switch (args.length) {
        case 3:
            return this._setLight_from3(...args);
        case 5:
            return this._setLight_from5(...args);
        }
    }

    method306(i, j, k, l, i1) {
        if (l === j) {
            return i;
        } else {
            return i + ((((k - i) * (i1 - j)) / (l - j)) | 0);
        }
    }

    method307(i, j, k, l, flag) {
        if (flag && i <= k || i < k) {
            if (i > l) {
                return true;
            }

            if (j > k) {
                return true;
            }

            if (j > l) {
                return true;
            }

            return !flag;
        }

        if (i < l) {
            return true;
        }

        if (j < k) {
            return true;
        }

        if (j < l) {
            return true;
        } else {
            return flag;
        }
    }

    method308(i, j, k, flag) {
        if (flag && i <= k || i < k) {
            if (j > k) {
                return true;
            }

            return !flag;
        }

        if (j < k) {
            return true;
        } else {
            return flag;
        }
    }

    intersect(ai, ai1, ai2, ai3) {
        let i = ai.length;
        let j = ai2.length;
        let byte0 = 0;
        let i20;
        let k20 = i20 = ai1[0];
        let k = 0;
        let j20;
        let l20 = j20 = ai3[0];
        let i1 = 0;

        for (let i21 = 1; i21 < i; i21++) {
            if (ai1[i21] < i20) {
                i20 = ai1[i21];
                k = i21;
            } else if (ai1[i21] > k20) {
                k20 = ai1[i21];
            }
        }

        for (let j21 = 1; j21 < j; j21++) {
            if (ai3[j21] < j20) {
                j20 = ai3[j21];
                i1 = j21;
            } else if (ai3[j21] > l20) {
                l20 = ai3[j21];
            }
        }

        if (j20 >= k20) {
            return false;
        }

        if (i20 >= l20) {
            return false;
        }

        let l = 0;
        let j1 = 0;
        let flag = false;

        if (ai1[k] < ai3[i1]) {
            for (l = k; ai1[l] < ai3[i1]; l = (l + 1) % i);
            for (; ai1[k] < ai3[i1]; k = ((k - 1) + i) % i);
            let k1 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
            let k6 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
            let l10 = ai2[i1];
            flag = (k1 < l10) | (k6 < l10);

            if (this.method308(k1, k6, l10, flag)) {
                return true;
            }

            j1 = (i1 + 1) % j;
            i1 = ((i1 - 1) + j) % j;

            if (k === l) {
                byte0 = 1;
            }
        } else {
            for (j1 = i1; ai3[j1] < ai1[k]; j1 = (j1 + 1) % j);
            for (; ai3[i1] < ai1[k]; i1 = ((i1 - 1) + j) % j);
            let l1 = ai[k];
            let i11 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[k]);
            let l15 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[k]);
            flag = (l1 < i11) | (l1 < l15);

            if (this.method308(i11, l15, l1, !flag)) {
                return true;
            }

            l = (k + 1) % i;
            k = ((k - 1) + i) % i;

            if (i1 === j1) {
                byte0 = 2;
            }
        }

        while (byte0 === 0) {
            if (ai1[k] < ai1[l]) {
                if (ai1[k] < ai3[i1]) {
                    if (ai1[k] < ai3[j1]) {
                        let i2 = ai[k];
                        let l6 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai1[k]);
                        let j11 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[k]);
                        let i16 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[k]);

                        if (this.method307(i2, l6, j11, i16, flag)) {
                            return true;
                        }

                        k = ((k - 1) + i) % i;

                        if (k === l) {
                            byte0 = 1;
                        }
                    } else {
                        let j2 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                        let i7 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                        let k11 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                        let j16 = ai2[j1];

                        if (this.method307(j2, i7, k11, j16, flag)) {
                            return true;
                        }

                        j1 = (j1 + 1) % j;

                        if (i1 === j1) {
                            byte0 = 2;
                        }
                    }
                } else if (ai3[i1] < ai3[j1]) {
                    let k2 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
                    let j7 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
                    let l11 = ai2[i1];
                    let k16 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai3[i1]);

                    if (this.method307(k2, j7, l11, k16, flag)) {
                        return true;
                    }

                    i1 = ((i1 - 1) + j) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                } else {
                    let l2 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                    let k7 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                    let i12 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                    let l16 = ai2[j1];

                    if (this.method307(l2, k7, i12, l16, flag)) {
                        return true;
                    }

                    j1 = (j1 + 1) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                }
            } else if (ai1[l] < ai3[i1]) {
                if (ai1[l] < ai3[j1]) {
                    let i3 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai1[l]);
                    let l7 = ai[l];
                    let j12 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[l]);
                    let i17 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[l]);

                    if (this.method307(i3, l7, j12, i17, flag)) {
                        return true;
                    }

                    l = (l + 1) % i;

                    if (k === l) {
                        byte0 = 1;
                    }
                } else {
                    let j3 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                    let i8 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                    let k12 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                    let j17 = ai2[j1];

                    if (this.method307(j3, i8, k12, j17, flag)) {
                        return true;
                    }

                    j1 = (j1 + 1) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                }
            } else if (ai3[i1] < ai3[j1]) {
                let k3 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
                let j8 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
                let l12 = ai2[i1];
                let k17 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai3[i1]);

                if (this.method307(k3, j8, l12, k17, flag)) {
                    return true;
                }

                i1 = ((i1 - 1) + j) % j;

                if (i1 === j1) {
                    byte0 = 2;
                }
            } else {
                let l3 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                let k8 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                let i13 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                let l17 = ai2[j1];

                if (this.method307(l3, k8, i13, l17, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 2;
                }
            }
        }

        while (byte0 === 1) {
            if (ai1[k] < ai3[i1]) {
                if (ai1[k] < ai3[j1]) {
                    let i4 = ai[k];
                    let j13 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[k]);
                    let i18 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[k]);
                    return this.method308(j13, i18, i4, !flag);
                }
                let j4 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                let l8 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                let k13 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                let j18 = ai2[j1];

                if (this.method307(j4, l8, k13, j18, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            } else if (ai3[i1] < ai3[j1]) {
                let k4 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
                let i9 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
                let l13 = ai2[i1];
                let k18 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai3[i1]);

                if (this.method307(k4, i9, l13, k18, flag)) {
                    return true;
                }

                i1 = ((i1 - 1) + j) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            } else {
                let l4 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[j1]);
                let j9 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[j1]);
                let i14 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai3[j1]);
                let l18 = ai2[j1];

                if (this.method307(l4, j9, i14, l18, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            }
        }

        while (byte0 === 2) {
            if (ai3[i1] < ai1[k]) {
                if (ai3[i1] < ai1[l]) {
                    let i5 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
                    let k9 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
                    let j14 = ai2[i1];

                    return this.method308(i5, k9, j14, flag);
                }

                let j5 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai1[l]);
                let l9 = ai[l];
                let k14 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[l]);
                let i19 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[l]);

                if (this.method307(j5, l9, k14, i19, flag)) {
                    return true;
                }

                l = (l + 1) % i;

                if (k === l) {
                    byte0 = 0;
                }
            } else if (ai1[k] < ai1[l]) {
                let k5 = ai[k];
                let i10 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai1[k]);
                let l14 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[k]);
                let j19 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[k]);

                if (this.method307(k5, i10, l14, j19, flag)) {
                    return true;
                }

                k = ((k - 1) + i) % i;

                if (k === l) {
                    byte0 = 0;
                }
            } else {
                let l5 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai1[l]);
                let j10 = ai[l];
                let i15 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[l]);
                let k19 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[l]);

                if (this.method307(l5, j10, i15, k19, flag)) {
                    return true;
                }

                l = (l + 1) % i;

                if (k === l) {
                    byte0 = 0;
                }
            }
        }

        if (ai1[k] < ai3[i1]) {
            let i6 = ai[k];
            let j15 = this.method306(ai2[(i1 + 1) % j], ai3[(i1 + 1) % j], ai2[i1], ai3[i1], ai1[k]);
            let l19 = this.method306(ai2[((j1 - 1) + j) % j], ai3[((j1 - 1) + j) % j], ai2[j1], ai3[j1], ai1[k]);

            return this.method308(j15, l19, i6, !flag);
        }

        let j6 = this.method306(ai[(k + 1) % i], ai1[(k + 1) % i], ai[k], ai1[k], ai3[i1]);
        let k10 = this.method306(ai[((l - 1) + i) % i], ai1[((l - 1) + i) % i], ai[l], ai1[l], ai3[i1]);
        let k15 = ai2[i1];

        return this.method308(j6, k10, k15, flag);
    }
}

Scene.sin2048Cache = new Int32Array(2048);
Scene.frustumMaxX = 0;
Scene.frustumMinX = 0;
Scene.frustumMaxY = 0;
Scene.frustumMinY = 0;
Scene.frustumFarZ = 0;
Scene.frustumNearZ = 0;
Scene.sin512Cache = new Int32Array(512);
Scene.textureCountLoaded = new Long(0);
Scene.aByteArray434 = null;

module.exports = Scene;

},{"./polygon":30,"./scanline":31,"long":5}],33:[function(require,module,exports){
const PCMPlayer = require('./lib/pcm-player');
const { mulaw } = require('alawmulaw');

class StreamAudioPlayer {
    constructor() {
        this.player = new PCMPlayer({
            encoding: '16bitInt',
            channels: 1,
            sampleRate: 8000
        });
    }

    stopPlayer() {
        this.player.destroy();
    }

    writeStream(buffer, offset, length) {
        const decoded = mulaw.decode(new Uint8Array(buffer.slice(offset, offset + length)));
        this.player.feed(decoded);
    }
}

module.exports = StreamAudioPlayer;
},{"./lib/pcm-player":23,"alawmulaw":2}],34:[function(require,module,exports){
const Surface = require('./surface');

class SurfaceSprite extends Surface {
    constructor(width, height, limit, component) {
        super(width, height, limit, component);
        this.mudclientref = null;
    }

    _spriteClipping_from7(x, y, w, h, id, tx, ty) {
        if (id >= 50000) {
            this.mudclientref.drawTeleportBubble(x, y, w, h, id - 50000, tx, ty);
            return;
        }

        if (id >= 40000) {
            this.mudclientref.drawItem(x, y, w, h, id - 40000, tx, ty);
            return;
        }

        if (id >= 20000) {
            this.mudclientref.drawNpc(x, y, w, h, id - 20000, tx, ty);
            return;
        }

        if (id >= 5000) {
            this.mudclientref.drawPlayer(x, y, w, h, id - 5000, tx, ty);
            return;
        } else {
            super._spriteClipping_from5(x, y, w, h, id);
            return;
        }
    }
}

module.exports = SurfaceSprite;
},{"./surface":35}],35:[function(require,module,exports){
const Utility = require('./utility');

const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);

// canvas imagedata needs an alpha channel, but the client only uses rgb
function fixPixel(pixel) {
    let r = (pixel >> 16) & 255;
    let g = (pixel >> 8) & 255;
    let b = pixel & 255;
    let a = 255; // alpha always 255

    return (a << 24) + (b << 16) + (g << 8) + r;
}

class Surface {
    constructor(width, height, limit, component) {
        this.image = null;
        this.landscapeColours = null;
        this.anIntArray340 = null;
        this.anIntArray341 = null;
        this.anIntArray342 = null;
        this.anIntArray343 = null;
        this.anIntArray344 = null;
        this.anIntArray345 = null;
        this.boundsTopY = 0;
        this.boundsTopX = 0;

        this.interlace = false;
        this.loggedIn = false;
        this.boundsBottomY = height;
        this.boundsBottomX = width;
        this.width1 = this.width2 = width;
        this.height1 = this.height2 = height;
        this.area = width * height;
        this.pixels = new Int32Array(width * height);

        this.surfacePixels = [];
        this.surfacePixels.length = limit;
        this.surfacePixels.fill(null);
        this.spriteColoursUsed = [];
        this.spriteColoursUsed.length = limit;
        this.spriteColoursUsed.fill(null);
        this.spriteColourList = [];
        this.spriteColourList.length = limit;
        this.spriteColourList.fill(null);
        this.spriteTranslate = new Int8Array(limit);
        this.spriteWidth = new Int32Array(limit);
        this.spriteHeight = new Int32Array(limit);
        this.spriteWidthFull = new Int32Array(limit);
        this.spriteHeightFull = new Int32Array(limit);
        this.spriteTranslateX = new Int32Array(limit);
        this.spriteTranslateY = new Int32Array(limit);

        this.imageData = component._graphics.ctx.getImageData(0, 0, width, height);
        this.bufferedPixels = new Int32Array(width * height);
        this.pixelBytes = new Uint8ClampedArray(this.bufferedPixels.buffer);

        this.setComplete();
    }

    static rgbToLong(red, green, blue) {
        return (red << 16) + (green << 8) + blue;
    }

    static createFont(bytes, id) {
        Surface.gameFonts[id] = bytes;
    }

    setComplete() {
        for (let i = 0; i < this.area; i += 1) {
            this.bufferedPixels[i] = fixPixel(this.pixels[i]);
        }

        this.imageData.data.set(this.pixelBytes, 0, 0);
    }

    setBounds(x1, y1, x2, y2) {
        if (x1 < 0) {
            x1 = 0;
        }

        if (y1 < 0) {
            y1 = 0;
        }

        if (x2 > this.width2) {
            x2 = this.width2;
        }

        if (y2 > this.height2) {
            y2 = this.height2;
        }
        
        this.boundsTopX = x1;
        this.boundsTopY = y1;
        this.boundsBottomX = x2;
        this.boundsBottomY = y2;
    }

    resetBounds() {
        this.boundsTopX = 0;
        this.boundsTopY = 0;
        this.boundsBottomX = this.width2;
        this.boundsBottomY = this.height2;
    }

    draw(g, x, y) {
        // blit our canvas to the page's canvas
        this.setComplete();
        g.drawImage(this.imageData, x, y);
    }

    blackScreen() {
        let area = this.width2 * this.height2;

        if (!this.interlace) {
            for (let j = 0; j < area; j++) {
                this.pixels[j] = 0;
            }

            return;
        }

        let k = 0;

        for (let l = -this.height2; l < 0; l += 2) {
            for (let i1 = -this.width2; i1 < 0; i1++) {
                this.pixels[k++] = 0;
            }

            k += this.width2;
        }
    }

    drawCircle(x, y, radius, colour, alpha) {
        let bgAlpha = 256 - alpha;
        let red = (colour >> 16 & 0xff) * alpha;
        let green = (colour >> 8 & 0xff) * alpha;
        let blue = (colour & 0xff) * alpha;
        let top = y - radius;

        if (top < 0) {
            top = 0;
        }

        let bottom = y + radius;

        if (bottom >= this.height2) {
            bottom = this.height2 - 1;
        }

        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;

            if ((top & 1) !== 0) {
                top++;
            }
        }

        for (let yy = top; yy <= bottom; yy += vertInc) {
            let l3 = yy - y;
            let i4 = Math.sqrt(radius * radius - l3 * l3) | 0;
            let j4 = x - i4;

            if (j4 < 0) {
                j4 = 0;
            }

            let k4 = x + i4;

            if (k4 >= this.width2) {
                k4 = this.width2 - 1;
            }

            let pixelIdx = j4 + yy * this.width2;

            for (let i5 = j4; i5 <= k4; i5++) {
                let bgRed = (this.pixels[pixelIdx] >> 16 & 0xff) * bgAlpha;
                let bgGreen = (this.pixels[pixelIdx] >> 8 & 0xff) * bgAlpha;
                let bgBlue = (this.pixels[pixelIdx] & 0xff) * bgAlpha;
                let newColour = ((red + bgRed >> 8) << 16) + ((green + bgGreen >> 8) << 8) + (blue + bgBlue >> 8);
                this.pixels[pixelIdx++] = newColour;
            }
        }
    }

    drawBoxAlpha(x, y, width, height, colour, alpha) {
        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (y < this.boundsTopY) {
            height -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        if (y + height > this.boundsBottomY) {
            height = this.boundsBottomY - y;
        }

        let bgAlpha = 256 - alpha;
        let red = (colour >> 16 & 0xff) * alpha;
        let green = (colour >> 8 & 0xff) * alpha;
        let blue = (colour & 0xff) * alpha;
        let j3 = this.width2 - width; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            j3 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                height--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let l3 = 0; l3 < height; l3 += vertInc) {
            for (let i4 = -width; i4 < 0; i4++) {
                let bgRed = (this.pixels[pixelIdx] >> 16 & 0xff) * bgAlpha;
                let bgGreen = (this.pixels[pixelIdx] >> 8 & 0xff) * bgAlpha;
                let bgBlue = (this.pixels[pixelIdx] & 0xff) * bgAlpha;
                let newColour = ((red + bgRed >> 8) << 16) + ((green + bgGreen >> 8) << 8) + (blue + bgBlue >> 8);
                this.pixels[pixelIdx++] = newColour;
            }

            pixelIdx += j3;
        }

    }

    drawGradient(x, y, width, height, colourTop, colourBottom) {
        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        let btmRed = colourBottom >> 16 & 0xff;
        let btmGreen = colourBottom >> 8 & 0xff;
        let btmBlue = colourBottom & 0xff;
        let topRed = colourTop >> 16 & 0xff;
        let topGreen = colourTop >> 8 & 0xff;
        let topBlue = colourTop & 0xff;
        let i3 = this.width2 - width; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            i3 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                height--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let k3 = 0; k3 < height; k3 += vertInc) {
            if (k3 + y >= this.boundsTopY && k3 + y < this.boundsBottomY) {
                let newColour = ((btmRed * k3 + topRed * (height - k3)) / height << 16) + ((btmGreen * k3 + topGreen * (height - k3)) / height << 8) + (((btmBlue * k3 + topBlue * (height - k3)) / height) | 0);

                for (let i4 = -width; i4 < 0; i4++) {
                    this.pixels[pixelIdx++] = newColour;
                }

                pixelIdx += i3;
            } else {
                pixelIdx += this.width2;
            }
        }
    }

    drawBox(x, y, w, h, colour) {
        if (x < this.boundsTopX) {
            w -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (y < this.boundsTopY) {
            h -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (x + w > this.boundsBottomX) {
            w = this.boundsBottomX - x;
        }

        if (y + h > this.boundsBottomY) {
            h = this.boundsBottomY - y;
        }

        let j1 = this.width2 - w; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            j1 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                h--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let l1 = -h; l1 < 0; l1 += vertInc) {
            for (let i2 = -w; i2 < 0; i2++) {
                this.pixels[pixelIdx++] = colour;
            }

            pixelIdx += j1;
        }
    }

    drawBoxEdge(x, y, width, height, colour) {
        this.drawLineHoriz(x, y, width, colour);
        this.drawLineHoriz(x, (y + height) - 1, width, colour);
        this.drawLineVert(x, y, height, colour);
        this.drawLineVert((x + width) - 1, y, height, colour);
    }

    drawLineHoriz(x, y, width, colour) {
        if (y < this.boundsTopY || y >= this.boundsBottomY) {
            return;
        }

        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        let i1 = x + y * this.width2;

        for (let j1 = 0; j1 < width; j1++) {
            this.pixels[i1 + j1] = colour;
        }
    }

    drawLineVert(x, y, height, colour) {
        if (x < this.boundsTopX || x >= this.boundsBottomX) {
            return;
        }

        if (y < this.boundsTopY) {
            height -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (y + height > this.boundsBottomX) {
            height = this.boundsBottomY - y;
        }

        let i1 = x + y * this.width2;

        for (let j1 = 0; j1 < height; j1++) {
            this.pixels[i1 + j1 * this.width2] = colour;
        }

    }

    setPixel(x, y, colour) {
        if (x < this.boundsTopX || y < this.boundsTopY || x >= this.boundsBottomX || y >= this.boundsBottomY) {
            return;
        } else {
            this.pixels[x + y * this.width2] = colour;

            return;
        }
    }

    fadeToBlack() {
        let k = this.width2 * this.height2;

        for (let j = 0; j < k; j++) {
            let i = this.pixels[j] & 0xffffff;
            this.pixels[j] = (i >>> 1 & 0x7f7f7f) + (i >>> 2 & 0x3f3f3f) + (i >>> 3 & 0x1f1f1f) + (i >>> 4 & 0xf0f0f);
        }
    }

    drawLineAlpha(i, j, x, y, width, height) {
        for (let xx = x; xx < x + width; xx++) {
            for (let yy = y; yy < y + height; yy++) {
                let i2 = 0;
                let j2 = 0;
                let k2 = 0;
                let l2 = 0;

                for (let i3 = xx - i; i3 <= xx + i; i3++)
                    if (i3 >= 0 && i3 < this.width2) {
                        for (let j3 = yy - j; j3 <= yy + j; j3++) {
                            if (j3 >= 0 && j3 < this.height2) {
                                let k3 = this.pixels[i3 + this.width2 * j3];
                                i2 += k3 >> 16 & 0xff;
                                j2 += k3 >> 8 & 0xff;
                                k2 += k3 & 0xff;
                                l2++;
                            }
                        }
                    }

                this.pixels[xx + this.width2 * yy] = (i2 / l2 << 16) + (j2 / l2 << 8) + ((k2 / l2) | 0);
            }
        }
    }

    clear() {
        for (let i = 0; i < this.surfacePixels.length; i++) {
            this.surfacePixels[i] = null;
            this.spriteWidth[i] = 0;
            this.spriteHeight[i] = 0;
            this.spriteColoursUsed[i] = null;
            this.spriteColourList[i] = null;
        }
    }

    parseSprite(spriteId, spriteData, indexData, frameCount) {
        let indexOff = Utility.getUnsignedShort(spriteData, 0);
        let fullWidth = Utility.getUnsignedShort(indexData, indexOff);
        indexOff += 2;

        let fullHeight = Utility.getUnsignedShort(indexData, indexOff);
        indexOff += 2;

        let colourCount = indexData[indexOff++] & 0xff;
        let colours = new Int32Array(colourCount);
        colours[0] = 0xff00ff;

        for (let i = 0; i < colourCount - 1; i++) {
            colours[i + 1] = ((indexData[indexOff] & 0xff) << 16) + ((indexData[indexOff + 1] & 0xff) << 8) + (indexData[indexOff + 2] & 0xff);
            indexOff += 3;
        }

        let spriteOff = 2;

        for (let id = spriteId; id < spriteId + frameCount; id++) {
            this.spriteTranslateX[id] = indexData[indexOff++] & 0xff;
            this.spriteTranslateY[id] = indexData[indexOff++] & 0xff;
            this.spriteWidth[id] = Utility.getUnsignedShort(indexData, indexOff);
            indexOff += 2;

            this.spriteHeight[id] = Utility.getUnsignedShort(indexData, indexOff);
            indexOff += 2;

            let unknown = indexData[indexOff++] & 0xff;
            let size = this.spriteWidth[id] * this.spriteHeight[id];

            this.spriteColoursUsed[id] = new Int8Array(size);
            this.spriteColourList[id] = colours;
            this.spriteWidthFull[id] = fullWidth;
            this.spriteHeightFull[id] = fullHeight;
            this.surfacePixels[id] = null;
            this.spriteTranslate[id] = false;

            if (this.spriteTranslateX[id] !== 0 || this.spriteTranslateY[id] !== 0) {
                this.spriteTranslate[id] = true;
            }

            if (unknown === 0) {
                for (let pixel = 0; pixel < size; pixel++) {
                    this.spriteColoursUsed[id][pixel] = spriteData[spriteOff++];

                    if (this.spriteColoursUsed[id][pixel] === 0) {
                        this.spriteTranslate[id] = true;
                    }
                }
            } else if (unknown === 1) {
                for (let x = 0; x < this.spriteWidth[id]; x++) {
                    for (let y = 0; y < this.spriteHeight[id]; y++) {
                        this.spriteColoursUsed[id][x + y * this.spriteWidth[id]] = spriteData[spriteOff++];

                        if (this.spriteColoursUsed[id][x + y * this.spriteWidth[id]] === 0) {
                            this.spriteTranslate[id] = true;
                        }
                    }
                }
            }
        }
    }

    readSleepWord(spriteId, spriteData) {
        let pixels = this.surfacePixels[spriteId] = new Int32Array(10200);

        this.spriteWidth[spriteId] = 255;
        this.spriteHeight[spriteId] = 40;
        this.spriteTranslateX[spriteId] = 0;
        this.spriteTranslateY[spriteId] = 0;
        this.spriteWidthFull[spriteId] = 255;
        this.spriteHeightFull[spriteId] = 40;
        this.spriteTranslate[spriteId] = false;

        let j = 0;
        let k = 1;
        let l = 0;

        for (l = 0; l < 255; ) {
            let i1 = spriteData[k++] & 0xff;

            for (let k1 = 0; k1 < i1; k1++) {
                pixels[l++] = j;
            }

            j = 0xffffff - j;
        }

        for (let y = 1; y < 40; y++) {
            for (let x = 0; x < 255; ) {
                let i2 = spriteData[k++] & 0xff;

                for (let j2 = 0; j2 < i2; j2++) {
                    pixels[l] = pixels[l - 255];
                    l++;
                    x++;
                }

                if (x < 255) {
                    pixels[l] = 0xffffff - pixels[l - 255];
                    l++;
                    x++;
                }
            }
        }
    }

    drawWorld(spriteId) {
        let spriteSize = this.spriteWidth[spriteId] * this.spriteHeight[spriteId];
        let spritePixels = this.surfacePixels[spriteId];
        let ai1 = new Int32Array(32768);

        for (let k = 0; k < spriteSize; k++) {
            let l = spritePixels[k];
            ai1[((l & 0xf80000) >> 9) + ((l & 0xf800) >> 6) + ((l & 0xf8) >> 3)]++;
        }

        let ai2 = new Int32Array(256);
        ai2[0] = 0xff00ff;

        let ai3 = new Int32Array(256);

        for (let i1 = 0; i1 < 32768; i1++) {
            let j1 = ai1[i1];

            if (j1 > ai3[255]) {
                for (let k1 = 1; k1 < 256; k1++) {
                    if (j1 <= ai3[k1]) {
                        continue;
                    }

                    for (let i2 = 255; i2 > k1; i2--) {
                        ai2[i2] = ai2[i2 - 1];
                        ai3[i2] = ai3[i2 - 1];
                    }

                    ai2[k1] = ((i1 & 0x7c00) << 9) + ((i1 & 0x3e0) << 6) + ((i1 & 0x1f) << 3) + 0x40404;
                    ai3[k1] = j1;
                    break;
                }
            }

            ai1[i1] = -1;
        }

        let abyte0 = new Int8Array(spriteSize);

        for (let l1 = 0; l1 < spriteSize; l1++) {
            let j2 = spritePixels[l1];
            let k2 = ((j2 & 0xf80000) >> 9) + ((j2 & 0xf800) >> 6) + ((j2 & 0xf8) >> 3);
            let l2 = ai1[k2];

            if (l2 === -1) {
                let i3 = 999999999;
                let j3 = j2 >> 16 & 0xff;
                let k3 = j2 >> 8 & 0xff;
                let l3 = j2 & 0xff;

                for (let i4 = 0; i4 < 256; i4++) {
                    let j4 = ai2[i4];
                    let k4 = j4 >> 16 & 0xff;
                    let l4 = j4 >> 8 & 0xff;
                    let i5 = j4 & 0xff;
                    let j5 = (j3 - k4) * (j3 - k4) + (k3 - l4) * (k3 - l4) + (l3 - i5) * (l3 - i5);

                    if (j5 < i3) {
                        i3 = j5;
                        l2 = i4;
                    }
                }

                ai1[k2] = l2;
            }

            abyte0[l1] = l2 & 0xff; // << 24 >> 24
        }

        this.spriteColoursUsed[spriteId] = abyte0;
        this.spriteColourList[spriteId] = ai2;
        this.surfacePixels[spriteId] = null;
    }

    loadSprite(spriteId) {
        if (this.spriteColoursUsed[spriteId] === null) {
            return;
        }

        let size = this.spriteWidth[spriteId] * this.spriteHeight[spriteId];
        let idx = this.spriteColoursUsed[spriteId];
        let cols = this.spriteColourList[spriteId];
        let pixels = new Int32Array(size);

        for (let pixel = 0; pixel < size; pixel++) {
            let colour = cols[idx[pixel] & 0xff];

            if (colour === 0) {
                colour = 1;
            } else if (colour === 0xff00ff) {
                colour = 0;
            }

            pixels[pixel] = colour;
        }

        this.surfacePixels[spriteId] = pixels;
        this.spriteColoursUsed[spriteId] = null;
        this.spriteColourList[spriteId] = null;
    }

    // used from World
    drawSpriteMinimap(sprite, x, y, width, height) {
        this.spriteWidth[sprite] = width;
        this.spriteHeight[sprite] = height;
        this.spriteTranslate[sprite] = false;
        this.spriteTranslateX[sprite] = 0;
        this.spriteTranslateY[sprite] = 0;
        this.spriteWidthFull[sprite] = width;
        this.spriteHeightFull[sprite] = height;

        let area = width * height;
        let pixel = 0;

        this.surfacePixels[sprite] = new Int32Array(area);

        for (let xx = x; xx < x + width; xx++) {
            for (let yy = y; yy < y + height; yy++) {
                this.surfacePixels[sprite][pixel++] = this.pixels[xx + yy * this.width2];
            }
        }
    }

    // used from mudclient
    _drawSprite_from5(sprite, x, y, width, height) {
        this.spriteWidth[sprite] = width;
        this.spriteHeight[sprite] = height;
        this.spriteTranslate[sprite] = false;
        this.spriteTranslateX[sprite] = 0;
        this.spriteTranslateY[sprite] = 0;
        this.spriteWidthFull[sprite] = width;
        this.spriteHeightFull[sprite] = height;

        let area = width * height;
        let pixel = 0;

        this.surfacePixels[sprite] = new Int32Array(area);

        for (let yy = y; yy < y + height; yy++) {
            for (let xx = x; xx < x + width; xx++) {
                this.surfacePixels[sprite][pixel++] = this.pixels[xx + yy * this.width2];
            }
        }
    }

    _drawSprite_from3(x, y, id) {
        if (this.spriteTranslate[id]) {
            x += this.spriteTranslateX[id];
            y += this.spriteTranslateY[id];
        }

        let rY = x + y * this.width2;
        let rX = 0;
        let height = this.spriteHeight[id];
        let width = this.spriteWidth[id];
        let w2 = this.width2 - width;
        let h2 = 0;

        if (y < this.boundsTopY) {
            let j2 = this.boundsTopY - y;
            height -= j2;
            y = this.boundsTopY;
            rX += j2 * width;
            rY += j2 * this.width2;
        }

        if (y + height >= this.boundsBottomY) {
            height -= ((y + height) - this.boundsBottomY) + 1;
        }

        if (x < this.boundsTopX) {
            let k2 = this.boundsTopX - x;
            width -= k2;
            x = this.boundsTopX;
            rX += k2;
            rY += k2;
            h2 += k2;
            w2 += k2;
        }

        if (x + width >= this.boundsBottomX) {
            let l2 = ((x + width) - this.boundsBottomX) + 1;
            width -= l2;
            h2 += l2;
            w2 += l2;
        }

        if (width <= 0 || height <= 0) {
            return;
        }

        let inc = 1;

        if (this.interlace) {
            inc = 2;
            w2 += this.width2;
            h2 += this.spriteWidth[id];

            if ((y & 1) !== 0) {
                rY += this.width2;
                height--;
            }
        }

        if (this.surfacePixels[id] === null) {
            this._drawSprite_from10A(this.pixels, this.spriteColoursUsed[id], this.spriteColourList[id], rX, rY, width, height, w2, h2, inc);
            return;
        } else {
            this._drawSprite_from10(this.pixels, this.surfacePixels[id], 0, rX, rY, width, height, w2, h2, inc);
            return;
        }
    }

    _spriteClipping_from5(x, y, width, height, spriteId) {
        try {
            let spriteWidth = this.spriteWidth[spriteId];
            let spriteHeight = this.spriteHeight[spriteId];
            let l1 = 0;
            let i2 = 0;
            let j2 = ((spriteWidth << 16) / width) | 0;
            let k2 = ((spriteHeight << 16) / height) | 0;

            if (this.spriteTranslate[spriteId]) {
                let l2 = this.spriteWidthFull[spriteId];
                let j3 = this.spriteHeightFull[spriteId];
                j2 = ((l2 << 16) / width) | 0;
                k2 = ((j3 << 16) / height) | 0;

                x += (((this.spriteTranslateX[spriteId] * width + l2) - 1) / l2) | 0;
                y += (((this.spriteTranslateY[spriteId] * height + j3) - 1) / j3) | 0;

                if ((this.spriteTranslateX[spriteId] * width) % l2 !== 0) {
                    l1 = ((l2 - (this.spriteTranslateX[spriteId] * width) % l2 << 16) / width) | 0;
                }

                if ((this.spriteTranslateY[spriteId] * height) % j3 !== 0) {
                    i2 = ((j3 - (this.spriteTranslateY[spriteId] * height) % j3 << 16) / height) | 0;
                }

                width = ((width * (this.spriteWidth[spriteId] - (l1 >> 16))) / l2) | 0;
                height = ((height * (this.spriteHeight[spriteId] - (i2 >> 16))) / j3) | 0;
            }

            let i3 = x + y * this.width2;
            let k3 = this.width2 - width;

            if (y < this.boundsTopY) {
                let l3 = this.boundsTopY - y;
                height -= l3;
                y = 0;
                i3 += l3 * this.width2;
                i2 += k2 * l3;
            }

            if (y + height >= this.boundsBottomY) {
                height -= ((y + height) - this.boundsBottomY) + 1;
            }

            if (x < this.boundsTopX) {
                let i4 = this.boundsTopX - x;
                width -= i4;
                x = 0;
                i3 += i4;
                l1 += j2 * i4;
                k3 += i4;
            }

            if (x + width >= this.boundsBottomX) {
                let j4 = ((x + width) - this.boundsBottomX) + 1;
                width -= j4;
                k3 += j4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                k3 += this.width2;
                k2 += k2;

                if ((y & 1) !== 0) {
                    i3 += this.width2;
                    height--;
                }
            }

            this._plotScale_from13(this.pixels, this.surfacePixels[spriteId], 0, l1, i2, i3, k3, width, height, j2, k2, spriteWidth, yInc);
        } catch (e) {
            console.log('error in sprite clipping routine');
        }
    }

    _drawSpriteAlpha_from4(x, y, spriteId, alpha) {
        if (this.spriteTranslate[spriteId]) {
            x += this.spriteTranslateX[spriteId];
            y += this.spriteTranslateY[spriteId];
        }

        let size = x + y * this.width2;
        let j1 = 0;
        let height = this.spriteHeight[spriteId];
        let width = this.spriteWidth[spriteId];
        let extraXSpace = this.width2 - width;
        let j2 = 0;

        if (y < this.boundsTopY) {
            let k2 = this.boundsTopY - y;
            height -= k2;
            y = this.boundsTopY;
            j1 += k2 * width;
            size += k2 * this.width2;
        }

        if (y + height >= this.boundsBottomY) {
            height -= ((y + height) - this.boundsBottomY) + 1;
        }

        if (x < this.boundsTopX) {
            let l2 = this.boundsTopX - x;
            width -= l2;
            x = this.boundsTopX;
            j1 += l2;
            size += l2;
            j2 += l2;
            extraXSpace += l2;
        }

        if (x + width >= this.boundsBottomX) {
            let i3 = ((x + width) - this.boundsBottomX) + 1;
            width -= i3;
            j2 += i3;
            extraXSpace += i3;
        }

        if (width <= 0 || height <= 0) {
            return; 
        }

        let yInc = 1;

        if (this.interlace) {
            yInc = 2;
            extraXSpace += this.width2;
            j2 += this.spriteWidth[spriteId];

            if ((y & 1) !== 0) {
                size += this.width2;
                height--;
            }
        }

        if (this.surfacePixels[spriteId] === null) {
            this._drawSpriteAlpha_from11A(this.pixels, this.spriteColoursUsed[spriteId], this.spriteColourList[spriteId], j1, size, width, height, extraXSpace, j2, yInc, alpha);
            return;
        } else {
            this._drawSpriteAlpha_from11(this.pixels, this.surfacePixels[spriteId], 0, j1, size, width, height, extraXSpace, j2, yInc, alpha);
            return;
        }
    }

    drawActionBubble(x, y, scaleX, scaleY, sprite, alpha) {
        try {
            let spriteWidth = this.spriteWidth[sprite];
            let spriteHeight = this.spriteHeight[sprite];
            let i2 = 0;
            let j2 = 0;
            let k2 = ((spriteWidth << 16) / scaleX) | 0;
            let l2 = ((spriteHeight << 16) / scaleY) | 0;

            if (this.spriteTranslate[sprite]) {
                let i3 = this.spriteWidthFull[sprite];
                let k3 = this.spriteHeightFull[sprite];
                k2 = ((i3 << 16) / scaleX) | 0;
                l2 = ((k3 << 16) / scaleY) | 0;

                x += (((this.spriteTranslateX[sprite] * scaleX + i3) - 1) / i3) | 0;
                y += (((this.spriteTranslateY[sprite] * scaleY + k3) - 1) / k3) | 0;

                if ((this.spriteTranslateX[sprite] * scaleX) % i3 !== 0) {
                    i2 = ((i3 - (this.spriteTranslateX[sprite] * scaleX) % i3 << 16) / scaleX) | 0;
                }

                if ((this.spriteTranslateY[sprite] * scaleY) % k3 !== 0) {
                    j2 = ((k3 - (this.spriteTranslateY[sprite] * scaleY) % k3 << 16) / scaleY) | 0;
                }

                scaleX = ((scaleX * (this.spriteWidth[sprite] - (i2 >> 16))) / i3) | 0;
                scaleY = ((scaleY * (this.spriteHeight[sprite] - (j2 >> 16))) / k3) | 0;
            }

            let j3 = x + y * this.width2;
            let l3 = this.width2 - scaleX;

            if (y < this.boundsTopY) {
                let i4 = this.boundsTopY - y;
                scaleY -= i4;
                y = 0;
                j3 += i4 * this.width2;
                j2 += l2 * i4;
            }

            if (y + scaleY >= this.boundsBottomY)
                scaleY -= ((y + scaleY) - this.boundsBottomY) + 1;

            if (x < this.boundsTopX) {
                let j4 = this.boundsTopX - x;
                scaleX -= j4;
                x = 0;
                j3 += j4;
                i2 += k2 * j4;
                l3 += j4;
            }

            if (x + scaleX >= this.boundsBottomX) {
                let k4 = ((x + scaleX) - this.boundsBottomX) + 1;
                scaleX -= k4;
                l3 += k4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                l3 += this.width2;
                l2 += l2;

                if ((y & 1) !== 0) {
                    j3 += this.width2;
                    scaleY--;
                }
            }

            this.transparentScale(this.pixels, this.surfacePixels[sprite], 0, i2, j2, j3, l3, scaleX, scaleY, k2, l2, spriteWidth, yInc, alpha);
            return;
        } catch (e) {
            console.log('error in sprite clipping routine');
        }
    }

    _spriteClipping_from6(x, y, width, height, spriteId, colour) {
        try {
            let k1 = this.spriteWidth[spriteId];
            let l1 = this.spriteHeight[spriteId];
            let i2 = 0;
            let j2 = 0;
            let k2 = ((k1 << 16) / width) | 0;
            let l2 = ((l1 << 16) / height) | 0;

            if (this.spriteTranslate[spriteId]) {
                let i3 = this.spriteWidthFull[spriteId];
                let k3 = this.spriteHeightFull[spriteId];
                k2 = ((i3 << 16) / width) | 0;
                l2 = ((k3 << 16) / height) | 0;
                x += (((this.spriteTranslateX[spriteId] * width + i3) - 1) / i3) | 0;
                y += (((this.spriteTranslateY[spriteId] * height + k3) - 1) / k3) | 0;

                if ((this.spriteTranslateX[spriteId] * width) % i3 !== 0) {
                    i2 = ((i3 - (this.spriteTranslateX[spriteId] * width) % i3 << 16) / width) | 0;
                }

                if ((this.spriteTranslateY[spriteId] * height) % k3 !== 0) {
                    j2 = ((k3 - (this.spriteTranslateY[spriteId] * height) % k3 << 16) / height) | 0;
                }

                width = ((width * (this.spriteWidth[spriteId] - (i2 >> 16))) / i3) | 0;
                height = ((height * (this.spriteHeight[spriteId] - (j2 >> 16))) / k3) | 0;
            }

            let j3 = x + y * this.width2;
            let l3 = this.width2 - width;

            if (y < this.boundsTopY) {
                let i4 = this.boundsTopY - y;
                height -= i4;
                y = 0;
                j3 += i4 * this.width2;
                j2 += l2 * i4;
            }

            if (y + height >= this.boundsBottomY) {
                height -= ((y + height) - this.boundsBottomY) + 1;
            }

            if (x < this.boundsTopX) {
                let j4 = this.boundsTopX - x;
                width -= j4;
                x = 0;
                j3 += j4;
                i2 += k2 * j4;
                l3 += j4;
            }

            if (x + width >= this.boundsBottomX) {
                let k4 = ((x + width) - this.boundsBottomX) + 1;
                width -= k4;
                l3 += k4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                l3 += this.width2;
                l2 += l2;

                if ((y & 1) !== 0) {
                    j3 += this.width2;
                    height--;
                }
            }

            this._plotScale_from14(this.pixels, this.surfacePixels[spriteId], 0, i2, j2, j3, l3, width, height, k2, l2, k1, yInc, colour);
            return;
        } catch (e) {
            console.log('error in sprite clipping routine');
            console.error(e);
        }
    }

    _drawSprite_from10(dest, src, i, srcPos, destPos, width, height, j1, k1, yInc) {
        let i2 = -(width >> 2);
        width = -(width & 3);

        for (let j2 = -height; j2 < 0; j2 += yInc) {
            for (let k2 = i2; k2 < 0; k2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }
            }

            for (let l2 = width; l2 < 0; l2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }
            }

            destPos += j1;
            srcPos += k1;
        }
    }

    _drawSprite_from10A(target, colourIdx, colours, srcPos, destPos, width, height, w2, h2, rowInc) {
        let l1 = -(width >> 2);
        width = -(width & 3);

        for (let i2 = -height; i2 < 0; i2 += rowInc) {
            for (let j2 = l1; j2 < 0; j2++) {
                let byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }
            }

            for (let k2 = width; k2 < 0; k2++) {
                let byte1 = colourIdx[srcPos++];

                if (byte1 !== 0) {
                    target[destPos++] = colours[byte1 & 0xff];
                } else {
                    destPos++;
                }
            }

            destPos += w2;
            srcPos += h2;
        }
    }

    _plotScale_from13(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2) {
        try {
            let l2 = j;

            for (let i3 = -k1; i3 < 0; i3 += k2) {
                let j3 = (k >> 16) * j2;

                for (let k3 = -j1; k3 < 0; k3++) {
                    i = src[(j >> 16) + j3];

                    if (i !== 0) {
                        dest[destPos++] = i;
                    } else {
                        destPos++;
                    }

                    j += l1;
                }

                k += i2;
                j = l2;
                destPos += i1;
            }

            return;
        } catch (e) {
            console.log('error in plotScale');
        }
    }

    _drawSpriteAlpha_from11(dest, src, i, srcPos, size, width, height, extraXSpace, k1, yInc, alpha) {
        let j2 = 256 - alpha;

        for (let k2 = -height; k2 < 0; k2 += yInc) {
            for (let l2 = -width; l2 < 0; l2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    let i3 = dest[size];
                    dest[size++] = ((i & 0xff00ff) * alpha + (i3 & 0xff00ff) * j2 & -16711936) + ((i & 0xff00) * alpha + (i3 & 0xff00) * j2 & 0xff0000) >> 8;
                } else {
                    size++;
                }
            }

            size += extraXSpace;
            srcPos += k1;
        }
    }

    _drawSpriteAlpha_from11A(dest, coloursUsed, colourList, listPos, size, width, height, extraXSpace, j1, yInc, alpha) {
        let i2 = 256 - alpha;

        for (let j2 = -height; j2 < 0; j2 += yInc) {
            for (let k2 = -width; k2 < 0; k2++) {
                let l2 = coloursUsed[listPos++];

                if (l2 !== 0) {
                    l2 = colourList[l2 & 0xff];
                    let i3 = dest[size];
                    dest[size++] = ((l2 & 0xff00ff) * alpha + (i3 & 0xff00ff) * i2 & -16711936) + ((l2 & 0xff00) * alpha + (i3 & 0xff00) * i2 & 0xff0000) >> 8;
                } else {
                    size++;
                }
            }

            size += extraXSpace;
            listPos += j1;
        }
    }

    transparentScale(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, yInc, alpha) {
        let i3 = 256 - alpha;

        try {
            let j3 = j;

            for (let k3 = -k1; k3 < 0; k3 += yInc) {
                let l3 = (k >> 16) * j2;

                for (let i4 = -j1; i4 < 0; i4++) {
                    i = src[(j >> 16) + l3];

                    if (i !== 0) {
                        let j4 = dest[destPos];
                        dest[destPos++] = ((i & 0xff00ff) * alpha + (j4 & 0xff00ff) * i3 & -16711936) + ((i & 0xff00) * alpha + (j4 & 0xff00) * i3 & 0xff0000) >> 8;
                    } else {
                        destPos++;
                    }

                    j += l1;
                }

                k += i2;
                j = j3;
                destPos += i1;
            }

            return;
        } catch (e) {
            console.log('error in tranScale');
        }
    }

    _plotScale_from14(target, pixels, i, j, k, l, i1, width, height, l1, i2, j2, yInc, colour) {
        let i3 = colour >> 16 & 0xff;
        let j3 = colour >> 8 & 0xff;
        let k3 = colour & 0xff;

        try {
            let l3 = j;

            for (let i4 = -height; i4 < 0; i4 += yInc) {
                let j4 = (k >> 16) * j2;
                for (let k4 = -width; k4 < 0; k4++) {
                    i = pixels[(j >> 16) + j4];

                    if (i !== 0) {
                        let l4 = i >> 16 & 0xff;
                        let i5 = i >> 8 & 0xff;
                        let j5 = i & 0xff;

                        if (l4 === i5 && i5 === j5) {
                            target[l++] = ((l4 * i3 >> 8) << 16) + ((i5 * j3 >> 8) << 8) + (j5 * k3 >> 8);
                        } else {
                            target[l++] = i;
                        }
                    } else {
                        l++;
                    }

                    j += l1;
                }

                k += i2;
                j = l3;
                l += i1;
            }

            return;
        } catch (e) {
            console.log('error in plotScale');
        }
    }

    // "scale" is not actually scaling when it comes to the landscape
    drawMinimapSprite(x, y, sprite, rotation, scale) {
        let j1 = this.width2;
        let k1 = this.height2;

        if (this.landscapeColours === null) {
            this.landscapeColours = new Int32Array(512);

            for (let l1 = 0; l1 < 256; l1++) {
                this.landscapeColours[l1] = (Math.sin(l1 * 0.02454369) * 32768) | 0;
                this.landscapeColours[l1 + 256] = (Math.cos(l1 * 0.02454369) * 32768) | 0;
            }
        }

        let i2 = -((this.spriteWidthFull[sprite] / 2) | 0);
        let j2 = -((this.spriteHeightFull[sprite] / 2) | 0);

        if (this.spriteTranslate[sprite]) {
            i2 += this.spriteTranslateX[sprite];
            j2 += this.spriteTranslateY[sprite];
        }

        let k2 = i2 + this.spriteWidth[sprite];
        let l2 = j2 + this.spriteHeight[sprite];
        let i3 = k2;
        let j3 = j2;
        let k3 = i2;
        let l3 = l2;
        rotation &= 0xff;
        let i4 = this.landscapeColours[rotation] * scale;
        let j4 = this.landscapeColours[rotation + 256] * scale;
        let k4 = x + (j2 * i4 + i2 * j4 >> 22);
        let l4 = y + (j2 * j4 - i2 * i4 >> 22);
        let i5 = x + (j3 * i4 + i3 * j4 >> 22);
        let j5 = y + (j3 * j4 - i3 * i4 >> 22);
        let k5 = x + (l2 * i4 + k2 * j4 >> 22);
        let l5 = y + (l2 * j4 - k2 * i4 >> 22);
        let i6 = x + (l3 * i4 + k3 * j4 >> 22);
        let j6 = y + (l3 * j4 - k3 * i4 >> 22);

        if (scale === 192 && (rotation & 0x3f) === (Surface.anInt348 & 0x3f)) {
            Surface.anInt346++;
        } else if (scale === 128) {
            Surface.anInt348 = rotation;
        } else {
            Surface.anInt347++;
        }

        let k6 = l4;
        let l6 = l4;

        if (j5 < k6) {
            k6 = j5;
        } else if (j5 > l6) {
            l6 = j5;
        }

        if (l5 < k6) {
            k6 = l5;
        } else if (l5 > l6) {
            l6 = l5;
        }

        if (j6 < k6) {
            k6 = j6;
        } else if (j6 > l6) {
            l6 = j6;
        }

        if (k6 < this.boundsTopY) {
            k6 = this.boundsTopY;
        }

        if (l6 > this.boundsBottomY) {
            l6 = this.boundsBottomY;
        }

        if (this.anIntArray340 === null || this.anIntArray340.length !== k1 + 1) {
            this.anIntArray340 = new Int32Array(k1 + 1);
            this.anIntArray341 = new Int32Array(k1 + 1);
            this.anIntArray342 = new Int32Array(k1 + 1);
            this.anIntArray343 = new Int32Array(k1 + 1);
            this.anIntArray344 = new Int32Array(k1 + 1);
            this.anIntArray345 = new Int32Array(k1 + 1);
        }

        for (let i7 = k6; i7 <= l6; i7++) {
            this.anIntArray340[i7] = 99999999;
            this.anIntArray341[i7] = -99999999;
        }

        let i8 = 0;
        let k8 = 0;
        let i9 = 0;
        let j9 = this.spriteWidth[sprite];
        let k9 = this.spriteHeight[sprite];

        i2 = 0;
        j2 = 0;
        i3 = j9 - 1;
        j3 = 0;
        k2 = j9 - 1;
        l2 = k9 - 1;
        k3 = 0;
        l3 = k9 - 1;

        if (j6 !== l4) {
            i8 = ((i6 - k4 << 8) / (j6 - l4)) | 0;
            i9 = ((l3 - j2 << 8) / (j6 - l4)) | 0;
        }

        let j7 = 0;
        let k7 = 0;
        let l7 = 0;
        let l8 = 0;

        if (l4 > j6) {
            l7 = i6 << 8;
            l8 = l3 << 8;
            j7 = j6;
            k7 = l4;
        } else {
            l7 = k4 << 8;
            l8 = j2 << 8;
            j7 = l4;
            k7 = j6;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            l8 -= i9 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let l9 = j7; l9 <= k7; l9++) {
            this.anIntArray340[l9] = this.anIntArray341[l9] = l7;
            l7 += i8;
            this.anIntArray342[l9] = this.anIntArray343[l9] = 0;
            this.anIntArray344[l9] = this.anIntArray345[l9] = l8;
            l8 += i9;
        }

        if (j5 !== l4) {
            i8 = ((i5 - k4 << 8) / (j5 - l4)) | 0;
            k8 = ((i3 - i2 << 8) / (j5 - l4)) | 0;
        }

        let j8 = 0;

        if (l4 > j5) {
            l7 = i5 << 8;
            j8 = i3 << 8;
            j7 = j5;
            k7 = l4;
        } else {
            l7 = k4 << 8;
            j8 = i2 << 8;
            j7 = l4;
            k7 = j5;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            j8 -= k8 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let i10 = j7; i10 <= k7; i10++) {
            if (l7 < this.anIntArray340[i10]) {
                this.anIntArray340[i10] = l7;
                this.anIntArray342[i10] = j8;
                this.anIntArray344[i10] = 0;
            }

            if (l7 > this.anIntArray341[i10]) {
                this.anIntArray341[i10] = l7;
                this.anIntArray343[i10] = j8;
                this.anIntArray345[i10] = 0;
            }

            l7 += i8;
            j8 += k8;
        }

        if (l5 !== j5) {
            i8 = ((k5 - i5 << 8) / (l5 - j5)) | 0;
            i9 = ((l2 - j3 << 8) / (l5 - j5)) | 0;
        }

        if (j5 > l5) {
            l7 = k5 << 8;
            j8 = k2 << 8;
            l8 = l2 << 8;
            j7 = l5;
            k7 = j5;
        } else {
            l7 = i5 << 8;
            j8 = i3 << 8;
            l8 = j3 << 8;
            j7 = j5;
            k7 = l5;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            l8 -= i9 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let j10 = j7; j10 <= k7; j10++) {
            if (l7 < this.anIntArray340[j10]) {
                this.anIntArray340[j10] = l7;
                this.anIntArray342[j10] = j8;
                this.anIntArray344[j10] = l8;
            }

            if (l7 > this.anIntArray341[j10]) {
                this.anIntArray341[j10] = l7;
                this.anIntArray343[j10] = j8;
                this.anIntArray345[j10] = l8;
            }

            l7 += i8;
            l8 += i9;
        }

        if (j6 !== l5) {
            i8 = ((i6 - k5 << 8) / (j6 - l5)) | 0;
            k8 = ((k3 - k2 << 8) / (j6 - l5)) | 0;
        }

        if (l5 > j6) {
            l7 = i6 << 8;
            j8 = k3 << 8;
            l8 = l3 << 8;
            j7 = j6;
            k7 = l5;
        } else {
            l7 = k5 << 8;
            j8 = k2 << 8;
            l8 = l2 << 8;
            j7 = l5;
            k7 = j6;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            j8 -= k8 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let k10 = j7; k10 <= k7; k10++) {
            if (l7 < this.anIntArray340[k10]) {
                this.anIntArray340[k10] = l7;
                this.anIntArray342[k10] = j8;
                this.anIntArray344[k10] = l8;
            }

            if (l7 > this.anIntArray341[k10]) {
                this.anIntArray341[k10] = l7;
                this.anIntArray343[k10] = j8;
                this.anIntArray345[k10] = l8;
            }

            l7 += i8;
            j8 += k8;
        }

        let l10 = k6 * j1;
        let ai = this.surfacePixels[sprite];

        for (let i11 = k6; i11 < l6; i11++) {
            let j11 = this.anIntArray340[i11] >> 8;
            let k11 = this.anIntArray341[i11] >> 8;

            if (k11 - j11 <= 0) {
                l10 += j1;
            } else {
                let l11 = this.anIntArray342[i11] << 9;
                let i12 = (((this.anIntArray343[i11] << 9) - l11) / (k11 - j11)) | 0;
                let j12 = this.anIntArray344[i11] << 9;
                let k12 = (((this.anIntArray345[i11] << 9) - j12) / (k11 - j11)) | 0;

                if (j11 < this.boundsTopX) {
                    l11 += (this.boundsTopX - j11) * i12;
                    j12 += (this.boundsTopX - j11) * k12;
                    j11 = this.boundsTopX;
                }

                if (k11 > this.boundsBottomX) {
                    k11 = this.boundsBottomX;
                }

                if (!this.interlace || (i11 & 1) === 0) {
                    if (!this.spriteTranslate[sprite]) {
                        this.drawMinimap(this.pixels, ai, 0, l10 + j11, l11, j12, i12, k12, j11 - k11, j9);
                    } else {
                        this.drawMinimapTranslate(this.pixels, ai, 0, l10 + j11, l11, j12, i12, k12, j11 - k11, j9);
                    }
                }

                l10 += j1;
            }
        }
    }

    drawMinimap(ai, ai1, i, j, k, l, i1, j1, k1, l1) {
        for (i = k1; i < 0; i++) {
            this.pixels[j++] = ai1[(k >> 17) + (l >> 17) * l1];
            k += i1;
            l += j1;
        }
    }

    drawMinimapTranslate(ai, ai1, i, j, k, l, i1, j1, k1, l1) {
        for (let i2 = k1; i2 < 0; i2++) {
            i = ai1[(k >> 17) + (l >> 17) * l1];

            if (i !== 0) {
                this.pixels[j++] = i;
            } else {
                j++;
            }

            k += i1;
            l += j1;
        }
    }

    _spriteClipping_from7(x, y, w, h, id, tx, ty) {
        this._spriteClipping_from5(x, y, w, h, id);
    }

    _spriteClipping_from9(x, y, w, h, sprite, colour1, colour2, l1, flag) {
        try {
            if (colour1 === 0) {
                colour1 = 0xffffff;
            }

            if (colour2 === 0) {
                colour2 = 0xffffff;
            }

            let width = this.spriteWidth[sprite];
            let height = this.spriteHeight[sprite];
            let k2 = 0;
            let l2 = 0;
            let i3 = l1 << 16;
            let j3 = ((width << 16) / w) | 0;
            let k3 = ((height << 16) / h) | 0;
            let l3 = -(((l1 << 16) / h) | 0);

            if (this.spriteTranslate[sprite]) {
                let fullWidth = this.spriteWidthFull[sprite];
                let fullHeight = this.spriteHeightFull[sprite];
                j3 = ((fullWidth << 16) / w) | 0;
                k3 = ((fullHeight << 16) / h) | 0;
                let j5 = this.spriteTranslateX[sprite];
                let k5 = this.spriteTranslateY[sprite];

                if (flag) {
                    j5 = fullWidth - this.spriteWidth[sprite] - j5;
                }

                x += (((j5 * w + fullWidth) - 1) / fullWidth) | 0;
                let l5 = (((k5 * h + fullHeight) - 1) / fullHeight) | 0;
                y += l5;
                i3 += l5 * l3;

                if ((j5 * w) % fullWidth !== 0) {
                    k2 = ((fullWidth - (j5 * w) % fullWidth << 16) / w) | 0;
                }

                if ((k5 * h) % fullHeight !== 0) {
                    l2 = ((fullHeight - (k5 * h) % fullHeight << 16) / h) | 0;
                }

                w = (((((this.spriteWidth[sprite] << 16) - k2) + j3) - 1) / j3) | 0;
                h = (((((this.spriteHeight[sprite] << 16) - l2) + k3) - 1) / k3) | 0;
            }

            let j4 = y * this.width2;
            i3 += x << 16;

            if (y < this.boundsTopY) {
                let l4 = this.boundsTopY - y;
                h -= l4;
                y = this.boundsTopY;
                j4 += l4 * this.width2;
                l2 += k3 * l4;
                i3 += l3 * l4;
            }

            if (y + h >= this.boundsBottomY) {
                h -= ((y + h) - this.boundsBottomY) + 1;
            }

            let i5 = j4 / this.width2 & 1;

            if (!this.interlace) {
                i5 = 2;
            }

            if (colour2 === 0xffffff) {
                if (this.surfacePixels[sprite] !== null) {
                    if (!flag) {
                        this._transparentSpritePlot_from15(this.pixels, this.surfacePixels[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, i3, l3, i5);
                        return;
                    } else {
                        this._transparentSpritePlot_from15(this.pixels, this.surfacePixels[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, i3, l3, i5);
                        return;
                    }
                }

                if (!flag) {
                    this._transparentSpritePlot_from16A(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, i3, l3, i5);
                    return;
                } else {
                    this._transparentSpritePlot_from16A(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, i3, l3, i5);
                    return;
                }
            }

            if (this.surfacePixels[sprite] !== null) {
                if (!flag) {
                    this._transparentSpritePlot_from16(this.pixels, this.surfacePixels[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, colour2, i3, l3, i5);
                    return;
                } else {
                    this._transparentSpritePlot_from16(this.pixels, this.surfacePixels[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, colour2, i3, l3, i5);
                    return;
                }
            }

            if (!flag) {
                this._transparentSpritePlot_from17(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, colour2, i3, l3, i5);
                return;
            } else {
                this._transparentSpritePlot_from17(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, colour2, i3, l3, i5);
                return;
            }
        } catch (e) {
            console.log('error in sprite clipping routine');
            console.error(e);
        }
    }

    _transparentSpritePlot_from15(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        let i4 = j2 >> 16 & 0xff;
        let j4 = j2 >> 8 & 0xff;
        let k4 = j2 & 0xff;

        try {
            let l4 = j;

            for (let i5 = -j1; i5 < 0; i5++) {
                let j5 = (k >> 16) * i2;
                let k5 = k2 >> 16;
                let l5 = i1;

                if (k5 < this.boundsTopX) {
                    let i6 = this.boundsTopX - k5;

                    l5 -= i6;
                    k5 = this.boundsTopX;
                    j += k1 * i6;
                }

                if (k5 + l5 >= this.boundsBottomX) {
                    let j6 = (k5 + l5) - this.boundsBottomX;

                    l5 -= j6;
                }

                i3 = 1 - i3;

                if (i3 !== 0) {
                    for (let k6 = k5; k6 < k5 + l5; k6++) {
                        i = src[(j >> 16) + j5];

                        if (i !== 0) {
                            let j3 = i >> 16 & 0xff;
                            let k3 = i >> 8 & 0xff;
                            let l3 = i & 0xff;

                            if (j3 === k3 && k3 === l3) {
                                dest[k6 + destPos] = ((j3 * i4 >> 8) << 16) + ((k3 * j4 >> 8) << 8) + (l3 * k4 >> 8);
                            } else {
                                dest[k6 + destPos] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l4;
                destPos += this.width2;
                k2 += l2;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from16(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2, l2, i3, j3) {
        let j4 = j2 >> 16 & 0xff;
        let k4 = j2 >> 8 & 0xff;
        let l4 = j2 & 0xff;
        let i5 = k2 >> 16 & 0xff;
        let j5 = k2 >> 8 & 0xff;
        let k5 = k2 & 0xff;

        try {
            let l5 = j;

            for (let i6 = -j1; i6 < 0; i6++) {
                let j6 = (k >> 16) * i2;
                let k6 = l2 >> 16;
                let l6 = i1;

                if (k6 < this.boundsTopX) {
                    let i7 = this.boundsTopX - k6;
                    l6 -= i7;
                    k6 = this.boundsTopX;
                    j += k1 * i7;
                }

                if (k6 + l6 >= this.boundsBottomX) {
                    let j7 = (k6 + l6) - this.boundsBottomX;
                    l6 -= j7;
                }

                j3 = 1 - j3;

                if (j3 !== 0) {
                    for (let k7 = k6; k7 < k6 + l6; k7++) {
                        i = src[(j >> 16) + j6];

                        if (i !== 0) {
                            let k3 = i >> 16 & 0xff;
                            let l3 = i >> 8 & 0xff;
                            let i4 = i & 0xff;

                            if (k3 === l3 && l3 === i4) {
                                dest[k7 + destPos] = ((k3 * j4 >> 8) << 16) + ((l3 * k4 >> 8) << 8) + (i4 * l4 >> 8);
                            } else if (k3 === 255 && l3 === i4) {
                                dest[k7 + destPos] = ((k3 * i5 >> 8) << 16) + ((l3 * j5 >> 8) << 8) + (i4 * k5 >> 8);
                            } else {
                                dest[k7 + destPos] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l5;
                destPos += this.width2;
                l2 += i3;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from16A(dest, colourIdx, colours, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        let i4 = j2 >> 16 & 0xff;
        let j4 = j2 >> 8 & 0xff;
        let k4 = j2 & 0xff;

        try {
            let l4 = j;

            for (let i5 = -j1; i5 < 0; i5++) {
                let j5 = (k >> 16) * i2;
                let k5 = k2 >> 16;
                let l5 = i1;

                if (k5 < this.boundsTopX) {
                    let i6 = this.boundsTopX - k5;
                    l5 -= i6;
                    k5 = this.boundsTopX;
                    j += k1 * i6;
                }

                if (k5 + l5 >= this.boundsBottomX) {
                    let j6 = (k5 + l5) - this.boundsBottomX;
                    l5 -= j6;
                }
                
                i3 = 1 - i3;

                if (i3 !== 0) {
                    for (let k6 = k5; k6 < k5 + l5; k6++) {
                        i = colourIdx[(j >> 16) + j5] & 0xff;

                        if (i !== 0) {
                            i = colours[i];

                            let j3 = i >> 16 & 0xff;
                            let k3 = i >> 8 & 0xff;
                            let l3 = i & 0xff;

                            if (j3 === k3 && k3 === l3) {
                                dest[k6 + l] = ((j3 * i4 >> 8) << 16) + ((k3 * j4 >> 8) << 8) + (l3 * k4 >> 8);
                            } else {
                                dest[k6 + l] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l4;
                l += this.width2;
                k2 += l2;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from17(dest, coloursUsed, colourList, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2, i3, j3) {
        let j4 = j2 >> 16 & 0xff;
        let k4 = j2 >> 8 & 0xff;
        let l4 = j2 & 0xff;
        let i5 = k2 >> 16 & 0xff;
        let j5 = k2 >> 8 & 0xff;
        let k5 = k2 & 0xff;

        try {
            let l5 = j;

            for (let i6 = -j1; i6 < 0; i6++) {
                let j6 = (k >> 16) * i2;
                let k6 = l2 >> 16;
                let l6 = i1;

                if (k6 < this.boundsTopX) {
                    let i7 = this.boundsTopX - k6;
                    l6 -= i7;
                    k6 = this.boundsTopX;
                    j += k1 * i7;
                }

                if (k6 + l6 >= this.boundsBottomX) {
                    let j7 = (k6 + l6) - this.boundsBottomX;
                    l6 -= j7;
                }

                j3 = 1 - j3;

                if (j3 !== 0) {
                    for (let k7 = k6; k7 < k6 + l6; k7++) {
                        i = coloursUsed[(j >> 16) + j6] & 0xff;

                        if (i !== 0) {
                            i = colourList[i];
                            let k3 = i >> 16 & 0xff;
                            let l3 = i >> 8 & 0xff;
                            let i4 = i & 0xff;

                            if (k3 === l3 && l3 === i4) {
                                dest[k7 + l] = ((k3 * j4 >> 8) << 16) + ((l3 * k4 >> 8) << 8) + (i4 * l4 >> 8);
                            } else if (k3 === 255 && l3 === i4) {
                                dest[k7 + l] = ((k3 * i5 >> 8) << 16) + ((l3 * j5 >> 8) << 8) + (i4 * k5 >> 8);
                            } else {
                                dest[k7 + l] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l5;
                l += this.width2;
                l2 += i3;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    drawStringRight(text, x, y, font, colour) {
        this.drawString(text, x - this.textWidth(text, font), y, font, colour);
    }

    drawStringCenter(text, x, y, font, colour) {
        this.drawString(text, x - ((this.textWidth(text, font) / 2) | 0), y, font, colour);
    }

    centrepara(text, x, y, font, colour, max) {
        try {
            let width = 0;
            let fontData = Surface.gameFonts[font];
            let start = 0;
            let end = 0;

            for (let index = 0; index < text.length; index++) {
                if (text[index] === '@' && index + 4 < text.length && text[index + 4] === '@') {
                    index += 4;
                } else if (text[index] === '~' && index + 4 < text.length && text[index + 4] === '~') {
                    index += 4;
                } else {
                    width += fontData[Surface.characterWidth[text.charCodeAt(index)] + 7];
                }

                if (text[index] === ' ') {
                    end = index;
                }

                if (text[index] === '%') {
                    end = index;
                    width = 1000;
                }

                if (width > max) {
                    if (end <= start) {
                        end = index;
                    }

                    this.drawStringCenter(text.slice(start, end), x, y, font, colour);
                    width = 0;
                    start = index = end + 1;
                    y += this.textHeight(font);
                }
            }

            if (width > 0) {
                this.drawStringCenter(text.slice(start), x, y, font, colour);
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    drawString(text, x, y, font, colour) {
        try {
            let fontData = Surface.gameFonts[font];

            for (let idx = 0; idx < text.length; idx++)
                if (text[idx] === '@' && idx + 4 < text.length && text[idx + 4] === '@') {
                    if (text.slice(idx + 1, idx + 4).toLowerCase() === 'red') {
                        colour = 0xff0000;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'lre') {
                        colour = 0xff9040;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'yel') {
                        colour = 0xffff00;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'gre') {
                        colour = 65280;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'blu') {
                        colour = 255;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'cya') {
                        colour = 65535;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'mag') {
                        colour = 0xff00ff;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'whi') {
                        colour = 0xffffff;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'bla') {
                        colour = 0;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'dre') {
                        colour = 0xc00000;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'ora') {
                        colour = 0xff9040;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'ran') {
                        colour = (Math.random() * 16777215) | 0;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'or1') {
                        colour = 0xffb000;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'or2') {
                        colour = 0xff7000;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'or3') {
                        colour = 0xff3000;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'gr1') {
                        colour = 0xc0ff00;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'gr2') {
                        colour = 0x80ff00;
                    } else if (text.slice(idx + 1, idx + 4).toLowerCase() === 'gr3') {
                        colour = 0x40ff00;
                    }

                    idx += 4;
                } else if (text[idx] === '~' && idx + 4 < text.length && text[idx + 4] === '~') {
                    let c = text.charCodeAt(idx + 1);
                    let c1 = text.charCodeAt(idx + 2);
                    let c2 = text.charCodeAt(idx + 3);

                    if (c >= C_0 && c <= C_9 && c1 >= C_0 && c1 <= C_9 && c2 >= C_0 && c2 <= C_9) {
                        x = Number(text.substring(idx + 1, idx + 4)) | 0;
                    }

                    idx += 4;
                } else {
                    let width = Surface.characterWidth[text.charCodeAt(idx)];

                    if (this.loggedIn && colour !== 0) {
                        this.drawCharacter(width, x + 1, y, 0, fontData);
                        this.drawCharacter(width, x, y + 1, 0, fontData);
                    }

                    this.drawCharacter(width, x, y, colour, fontData);
                    x += fontData[width + 7];
                }

            return;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    drawCharacter(width, x, y, colour, font) {
        let i1 = x + font[width + 5];
        let j1 = y - font[width + 6];
        let k1 = font[width + 3];
        let l1 = font[width + 4];
        let i2 = font[width] * 16384 + font[width + 1] * 128 + font[width + 2];
        let j2 = i1 + j1 * this.width2;
        let k2 = this.width2 - k1;
        let l2 = 0;

        if (j1 < this.boundsTopY) {
            let i3 = this.boundsTopY - j1;
            l1 -= i3;
            j1 = this.boundsTopY;
            i2 += i3 * k1;
            j2 += i3 * this.width2;
        }

        if (j1 + l1 >= this.boundsBottomY) {
            l1 -= ((j1 + l1) - this.boundsBottomY) + 1;
        }

        if (i1 < this.boundsTopX) {
            let j3 = this.boundsTopX - i1;
            k1 -= j3;
            i1 = this.boundsTopX;
            i2 += j3;
            j2 += j3;
            l2 += j3;
            k2 += j3;
        }

        if (i1 + k1 >= this.boundsBottomX) {
            let k3 = ((i1 + k1) - this.boundsBottomX) + 1;
            k1 -= k3;
            l2 += k3;
            k2 += k3;
        }

        if (k1 > 0 && l1 > 0) {
            this.plotLetter(this.pixels, font, colour, i2, j2, k1, l1, k2, l2);
        }
    }

    plotLetter(ai, abyte0, i, j, k, l, i1, j1, k1) {
        try {
            let l1 = -(l >> 2);

            l = -(l & 3);

            for (let i2 = -i1; i2 < 0; i2++) {
                for (let j2 = l1; j2 < 0; j2++) {
                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }
                }

                for (let k2 = l; k2 < 0; k2++) {
                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }
                }

                k += j1;
                j += k1;
            }

            return;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    // todo
    method259(ai, abyte0, i, j, k, l, i1, j1, k1) {
        for (let l1 = -i1; l1 < 0; l1++) {
            for (let i2 = -l; i2 < 0; i2++) {
                let j2 = abyte0[j++] & 0xff;

                if (j2 > 30) {
                    if (j2 >= 230) {
                        ai[k++] = i;
                    } else {
                        let k2 = ai[k];
                        ai[k++] = ((i & 0xff00ff) * j2 + (k2 & 0xff00ff) * (256 - j2) & 0xff00ff00) + ((i & 0xff00) * j2 + (k2 & 0xff00) * (256 - j2) & 0xff0000) >> 8;
                    }
                } else {
                    k++;
                }
            }

            k += j1;
            j += k1;
        }
    }

    textHeight(fontId) {
        if (fontId === 0) {
            return 12;
        }

        if (fontId === 1) {
            return 14;
        }

        if (fontId === 2) {
            return 14;
        }

        if (fontId === 3) {
            return 15;
        }

        if (fontId === 4) {
            return 15;
        }

        if (fontId === 5) {
            return 19;
        }

        if (fontId === 6) {
            return 24;
        }

        if (fontId === 7) {
            return 29;
        } else {
            return this.textHeightFont(fontId);
        }
    }

    textHeightFont(fontId) {
        if (fontId === 0) {
            return Surface.gameFonts[fontId][8] - 2;
        } else {
            return Surface.gameFonts[fontId][8] - 1;
        }
    }

    textWidth(text, fontId) {
        let total = 0;
        let font = Surface.gameFonts[fontId];

        for (let idx = 0; idx < text.length; idx++) {
            if (text[idx] === '@' && idx + 4 < text.length && text[idx + 4] === '@') {
                idx += 4;
            } else if (text[idx] === '~' && idx + 4 < text.length && text[idx + 4] === '~') {
                idx += 4;
            } else {
                total += font[Surface.characterWidth[text.charCodeAt(idx)] + 7];
            }
        }

        return total;
    }
}

Surface.anInt346 = 0;
Surface.anInt347 = 0;
Surface.anInt348 = 0;

Surface.gameFonts = [];
Surface.gameFonts.length = 50;
Surface.gameFonts.fill(null);

Surface.characterWidth = new Int32Array(256);

let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"\243$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

for (let i = 0; i < 256; i++) {
    let j = s.indexOf(String.fromCharCode(i));

    if (j === -1) {
        j = 74;
    }
        
    Surface.characterWidth[i] = j * 9;
}

module.exports = Surface;
},{"./utility":36}],36:[function(require,module,exports){
const BZLib = require('./bzlib');
const FileDownloadStream = require('./lib/net/file-download-stream');
const Long = require('long');

const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);
const C_A = 'a'.charCodeAt(0);
const C_BIG_A = 'A'.charCodeAt(0);
const C_BIG_Z = 'Z'.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);

class Utility {
    static openFile(s) {
        return new FileDownloadStream(s);
    }

    static getUnsignedByte(byte0) {
        return byte0 & 0xff;
    }

    static getUnsignedShort(abyte0, i) {
        return ((abyte0[i] & 0xff) << 8) + (abyte0[i + 1] & 0xff);
    }

    static getUnsignedInt(abyte0, i) {
        return ((abyte0[i] & 0xff) << 24) + ((abyte0[i + 1] & 0xff) << 16) + ((abyte0[i + 2] & 0xff) << 8) + (abyte0[i + 3] & 0xff);
    }

    static getUnsignedLong(buff, off) {
        return Long.fromInt(Utility.getUnsignedInt(buff, off) & 0xffffffff).shiftLeft(32).add(new Long(Utility.getUnsignedInt(buff, off + 4) & 0xffffffff));
    }

    static getSignedShort(abyte0, i) {
        let j = (Utility.getUnsignedByte(abyte0[i]) * 256 + Utility.getUnsignedByte(abyte0[i + 1])) | 0;

        if (j > 32767) {
            j -= 0x10000;
        }

        return j;
    }

    static getUnsignedInt2(abyte0, i) {
        if ((abyte0[i] & 0xff) < 128) {
            return abyte0[i];
        } else {
            return ((abyte0[i] & 0xff) - 128 << 24) + ((abyte0[i + 1] & 0xff) << 16) + ((abyte0[i + 2] & 0xff) << 8) + (abyte0[i + 3] & 0xff);
        }
    }

    static getBitMask(buff, off, len) {
        let k = off >> 3;
        let l = 8 - (off & 7);
        let i1 = 0;

        for (; len > l; l = 8) {
            i1 += (buff[k++] & Utility.bitmask[l]) << len - l;
            len -= l;
        }

        if (len === l) {
            i1 += buff[k] & Utility.bitmask[l];
        } else {
            i1 += buff[k] >> l - len & Utility.bitmask[len];
        }

        return i1;
    }

    static formatAuthString(s, maxLen) {
        let s1 = '';

        for (let j = 0; j < maxLen; j++) {
            if (j >= s.length) {
                s1 = s1 + ' ';
            } else {
                let c = s.charCodeAt(j);

                if (c >= C_A && c <= C_Z) {
                    s1 = s1 + String.fromCharCode(c);
                } else if (c >= C_BIG_A && c <= C_BIG_Z) {
                    s1 = s1 + String.fromCharCode(c);
                } else if (c >= C_0 && c <= C_9) {
                    s1 = s1 + String.fromCharCode(c);
                } else {
                    s1 = s1 + '_';
                }
            }
        }

        return s1;
    }

    static ipToString(i) {
        return (i >> 24 & 0xff) + '.' + (i >> 16 & 0xff) + '.' + (i >> 8 & 0xff) + '.' + (i & 0xff);
    }

    static usernameToHash(s) {
        let s1 = '';

        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);

            if (c >= C_A && c <= C_Z) {
                s1 = s1 + String.fromCharCode(c);
            } else if (c >= C_BIG_A && c <= C_BIG_Z) {
                s1 = s1 + String.fromCharCode((c + 97) - 65);
            } else if (c >= C_0 && c <= C_9) {
                s1 = s1 + String.fromCharCode(c);
            } else {
                s1 = s1 + ' ';
            }
        }

        s1 = s1.trim();

        if (s1.length > 12) {
            s1 = s1.slice(0, 12);
        }

        let hash = new Long(0);

        for (let j = 0; j < s1.length; j++) {
            let c1 = s1.charCodeAt(j);

            hash = hash.multiply(37);

            if (c1 >= C_A && c1 <= C_Z) {
                hash = hash.add((1 + c1) - 97);
            } else if (c1 >= C_0 && c1 <= C_9) {
                hash = hash.add((27 + c1) - 48);
            }
        }

        return hash;
    }

    static hashToUsername(hash) {
        if (hash.lessThan(0)) {
            return 'invalidName';
        }

        let s = '';

        while (!hash.equals(0)) {
            let i = hash.modulo(37).toInt();
            hash = hash.divide(37);

            if (i === 0) {
                s = ' ' + s;
            } else if (i < 27) {
                if (hash.modulo(37).equals(0)) {
                    s = String.fromCharCode((i + 65) - 1) + s;
                } else {
                    s = String.fromCharCode((i + 97) - 1) + s;
                }
            } else {
                s = String.fromCharCode((i + 48) - 27) + s;
            }
        }

        return s;
    }

    static getDataFileOffset(filename, data) {
        let numEntries = Utility.getUnsignedShort(data, 0);
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let k = 0; k < filename.length; k++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(k)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            let fileHash = ((data[entry * 10 + 2] & 0xff) * 0x1000000 + (data[entry * 10 + 3] & 0xff) * 0x10000 + (data[entry * 10 + 4] & 0xff) * 256 + (data[entry * 10 + 5] & 0xff)) | 0;
            let fileSize = ((data[entry * 10 + 9] & 0xff) * 0x10000 + (data[entry * 10 + 10] & 0xff) * 256 + (data[entry * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                return offset;
            }

            offset += fileSize;
        }

        return 0;
    }

    static getDataFileLength(filename, data) {
        let numEntries = Utility.getUnsignedShort(data, 0);
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let k = 0; k < filename.length; k++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(k)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let i1 = 0; i1 < numEntries; i1++) {
            let fileHash = ((data[i1 * 10 + 2] & 0xff) * 0x1000000 + (data[i1 * 10 + 3] & 0xff) * 0x10000 + (data[i1 * 10 + 4] & 0xff) * 256 + (data[i1 * 10 + 5] & 0xff)) | 0;
            let fileSize = ((data[i1 * 10 + 6] & 0xff) * 0x10000 + (data[i1 * 10 + 7] & 0xff) * 256 + (data[i1 * 10 + 8] & 0xff)) | 0;
            let fileSizeCompressed = ((data[i1 * 10 + 9] & 0xff) * 0x10000 + (data[i1 * 10 + 10] & 0xff) * 256 + (data[i1 * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                return fileSize;
            }

            offset += fileSizeCompressed;
        }

        return 0;
    }

    static loadData(s, i, abyte0) {
        let b = Utility.unpackData(s, i, abyte0, null);
        return b;
    }

    static unpackData(filename, i, archiveData, fileData) {
        let numEntries = ((archiveData[0] & 0xff) * 256 + (archiveData[1] & 0xff)) | 0;
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let l = 0; l < filename.length; l++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(l)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            let fileHash = ((archiveData[entry * 10 + 2] & 0xff) * 0x1000000 + (archiveData[entry * 10 + 3] & 0xff) * 0x10000 + (archiveData[entry * 10 + 4] & 0xff) * 256 + (archiveData[entry * 10 + 5] & 0xff)) | 0;
            let fileSize = ((archiveData[entry * 10 + 6] & 0xff) * 0x10000 + (archiveData[entry * 10 + 7] & 0xff) * 256 + (archiveData[entry * 10 + 8] & 0xff)) | 0;
            let fileSizeCompressed = ((archiveData[entry * 10 + 9] & 0xff) * 0x10000 + (archiveData[entry * 10 + 10] & 0xff) * 256 + (archiveData[entry * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                if (fileData === null) {
                    fileData = new Int8Array(fileSize + i);
                }

                if (fileSize !== fileSizeCompressed) {
                    BZLib.decompress(fileData, fileSize, archiveData, fileSizeCompressed, offset);
                } else {
                    for (let j = 0; j < fileSize; j++) {
                        fileData[j] = archiveData[offset + j];
                    }
                }

                return fileData;
            }

            offset += fileSizeCompressed;
        }

        return null;
    }
}

Utility.aBoolean546 = false;
Utility.bitmask = new Int32Array([
    0, 1, 3, 7, 15, 31, 63, 127, 255, 511,
    1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff, 0x3ffff, 0x7ffff,
    0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff,
    0x3fffffff, 0x7fffffff, -1
]);

module.exports = Utility;

},{"./bzlib":8,"./lib/net/file-download-stream":21,"long":5}],37:[function(require,module,exports){
module.exports={
    "CLIENT": 204,
    "CONFIG": 85,
    "ENTITY": 24,
    "FILTER": 2,
    "FONTS": 1,
    "MAPS": 63,
    "MEDIA": 58,
    "MODELS": 36,
    "SOUNDS": 1,
    "TEXTURES": 17
}
},{}],38:[function(require,module,exports){
const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);
const C_A = 'a'.charCodeAt(0);
const C_ASTERISK = '*'.charCodeAt(0);
const C_BACKSLASH = '\\'.charCodeAt(0);
const C_BIG_A = 'A'.charCodeAt(0);
const C_BIG_Z = 'Z'.charCodeAt(0);
const C_COMMA = ','.charCodeAt(0);
const C_DOT = '.'.charCodeAt(0);
const C_J = 'j'.charCodeAt(0);
const C_Q = 'q'.charCodeAt(0);
const C_SINGLE_QUOTE = '\''.charCodeAt(0);
const C_SLASH = '/'.charCodeAt(0);
const C_SPACE = ' '.charCodeAt(0);
const C_V = 'v'.charCodeAt(0);
const C_X = 'x'.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);

function toCharArray(s) {
    let a = new Uint16Array(s.length);

    for (let i = 0; i < s.length; i += 1) {
        a[i] = s.charCodeAt(i);
    }

    return a;
}

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

class WordFilter {
    static loadFilters(fragments, bad, host, tld) {
        WordFilter.loadBad(bad);
        WordFilter.loadHost(host);
        WordFilter.loadFragments(fragments);
        WordFilter.loadTld(tld);
    }

    static loadTld(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.tldList = [];
        WordFilter.tldType = new Int32Array(wordCount);

        for (let i = 0; i < wordCount; i++) {
            WordFilter.tldType[i] = buffer.getUnsignedByte();

            let ac = new Uint16Array(buffer.getUnsignedByte());

            for (let j = 0; j < ac.length; j++) {
                ac[j] = buffer.getUnsignedByte();
            }

            WordFilter.tldList.push(ac);
        }
    }

    static loadBad(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.badList = [];
        WordFilter.badList.length = wordCount;
        WordFilter.badList.fill(null);
        WordFilter.badCharIds = [];
        WordFilter.badCharIds.length = wordCount;
        WordFilter.badCharIds.fill(null);

        WordFilter.readBuffer(buffer, WordFilter.badList, WordFilter.badCharIds);
    }

    static loadHost(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.hostList = [];
        WordFilter.hostList.length = wordCount;
        WordFilter.hostList.fill(null);
        WordFilter.hostCharIds = [];
        WordFilter.hostCharIds.length = wordCount;
        WordFilter.hostCharIds.fill(null);

        WordFilter.readBuffer(buffer, WordFilter.hostList, WordFilter.hostCharIds);
    }

    static loadFragments(buffer) {
        WordFilter.hashFragments = new Int32Array(buffer.getUnsignedInt());

        for (let i = 0; i < WordFilter.hashFragments.length; i++) {
            WordFilter.hashFragments[i] = buffer.getUnsignedShort();
        }
    }

    static readBuffer(buffer, wordList, charIds) {
        for (let i = 0; i < wordList.length; i++) {
            let currentWord = new Uint16Array(buffer.getUnsignedByte());

            for (let j = 0; j < currentWord.length; j++) {
                currentWord[j] = buffer.getUnsignedByte();
            }

            wordList[i] = currentWord;

            let ids = [];
            ids.length = buffer.getUnsignedInt();

            for (let j = 0; j < ids.length; j++) {
                ids[j] = [ (buffer.getUnsignedByte() & 0xff), 
                    (buffer.getUnsignedByte() & 0xff) ];
            }

            if (ids.length > 0) {
                charIds[i] = ids;
            }
        }
    }

    static filter(input) {
        let inputChars = toCharArray(input.toLowerCase());

        WordFilter.applyDotSlashFilter(inputChars);
        WordFilter.applyBadwordFilter(inputChars);
        WordFilter.applyHostFilter(inputChars);
        WordFilter.heywhathteufck(inputChars);

        for (let ignoreIdx = 0; ignoreIdx < WordFilter.ignoreList.length; ignoreIdx++) {
            for (let inputIgnoreIdx = -1; (inputIgnoreIdx = input.indexOf(WordFilter.ignoreList[ignoreIdx], inputIgnoreIdx + 1)) !== -1;) {
                let ignoreWordChars = toCharArray(WordFilter.ignoreList[ignoreIdx]);

                for (let ignorewordIdx = 0; ignorewordIdx < ignoreWordChars.length; ignorewordIdx++) {
                    inputChars[ignorewordIdx + inputIgnoreIdx] = ignoreWordChars[ignorewordIdx];
                }
            }
        }

        if (WordFilter.forceLowerCase) {
            WordFilter.stripLowerCase(toCharArray(input), inputChars);
            WordFilter.toLowerCase(inputChars);
        }

        return fromCharArray(inputChars);
    }

    static stripLowerCase(input, output) {
        for (let i = 0; i < input.length; i++) {
            if (output[i] !== C_ASTERISK && WordFilter.isUpperCase(input[i])) {
                output[i] = input[i];
            }
        }
    }

    static toLowerCase(input) {
        let isUpperCase = true;

        for (let i = 0; i < input.length; i++) {
            let current = input[i];

            if (WordFilter.isLetter(current)) {
                if (isUpperCase) {
                    if (WordFilter.isLowerCase(current)) {
                        isUpperCase = false;
                    }
                } else if (WordFilter.isUpperCase(current)) {
                    input[i] = ((current + 97) - 65);
                }
            } else {
                isUpperCase = true;
            }
        }
    }

    static applyBadwordFilter(input) {
        for (let i = 0; i < 2; i++) {
            for (let j = WordFilter.badList.length - 1; j >= 0; j--) {
                WordFilter.applyWordFilter(input, WordFilter.badList[j], WordFilter.badCharIds[j]);
            }
        }
    }

    static applyHostFilter(input) {
        for (let i = WordFilter.hostList.length - 1; i >= 0; i--) {
            WordFilter.applyWordFilter(input, WordFilter.hostList[i], WordFilter.hostCharIds[i]);
        }
    }

    static applyDotSlashFilter(input) {
        let input1 = input.slice();
        let dot = toCharArray('dot');
        WordFilter.applyWordFilter(input1, dot, null);

        let input2 = input.slice();
        let slash = toCharArray('slash');
        WordFilter.applyWordFilter(input2, slash, null);

        for (let i = 0; i < WordFilter.tldList.length; i++) {
            WordFilter.applyTldFilter(input, input1, input2, WordFilter.tldList[i], WordFilter.tldType[i]);
        }
    }

    static applyTldFilter(input, input1, input2, tld, type) {
        if (tld.length > input.length) {
            return;
        }

        for (let charIndex = 0; charIndex <= input.length - tld.length; charIndex++) {
            let inputCharCount = charIndex;
            let l = 0;

            while (inputCharCount < input.length) {
                let i1 = 0;
                let current = input[inputCharCount];
                let next = 0;

                if (inputCharCount + 1 < input.length) {
                    next = input[inputCharCount + 1];
                }

                if (l < tld.length && (i1 = WordFilter.compareLettersNumbers(tld[l], current, next)) > 0) {
                    inputCharCount += i1;
                    l++;
                    continue;
                }

                if (l === 0) {
                    break;
                }

                if ((i1 = WordFilter.compareLettersNumbers(tld[l - 1], current, next)) > 0) {
                    inputCharCount += i1;
                    continue;
                }

                if (l >= tld.length || !WordFilter.isSpecial(current)) {
                    break;
                }

                inputCharCount++;
            }

            if (l >= tld.length) {
                let flag = false;
                let startMatch = WordFilter.getAsteriskCount(input, input1, charIndex);
                let endMatch = WordFilter.getAsteriskCount2(input, input2, inputCharCount - 1);

                if (WordFilter.DEBUGTLD) {
                    console.log(`Potential tld: ${tld} at char ${charIndex} (type="${type}, startmatch="${startMatch}, endmatch=${endMatch})`);
                }

                if (type === 1 && startMatch > 0 && endMatch > 0) {
                    flag = true;
                }

                if (type === 2 && (startMatch > 2 && endMatch > 0 || startMatch > 0 && endMatch > 2)) {
                    flag = true;
                }

                if (type === 3 && startMatch > 0 && endMatch > 2) {
                    flag = true;
                }

                if (flag) {
                    if (WordFilter.DEBUGTLD) {
                        console.log(`Filtered tld: ${tld} at char ${charIndex}`);
                    }

                    let l1 = charIndex;
                    let i2 = inputCharCount - 1;

                    if (startMatch > 2) {
                        if (startMatch === 4) {
                            let flag1 = false;

                            for (let k2 = l1 - 1; k2 >= 0; k2--) {
                                if (flag1) {
                                    if (input1[k2] !== C_ASTERISK) {
                                        break;
                                    }

                                    l1 = k2;
                                } else if (input1[k2] === C_ASTERISK) {
                                    l1 = k2;
                                    flag1 = true;
                                }
                            }
                        }

                        let flag2 = false;

                        for (let l2 = l1 - 1; l2 >= 0; l2--) {
                            if (flag2) {
                                if (WordFilter.isSpecial(input[l2])) {
                                    break;
                                }

                                l1 = l2;
                            } else if (!WordFilter.isSpecial(input[l2])) {
                                flag2 = true;
                                l1 = l2;
                            }
                        }
                    }

                    if (endMatch > 2) {
                        if (endMatch === 4) {
                            let flag3 = false;

                            for (let i3 = i2 + 1; i3 < input.length; i3++) {
                                if (flag3) {
                                    if (input2[i3] !== C_ASTERISK) {
                                        break;
                                    }

                                    i2 = i3;
                                } else if (input2[i3] === C_ASTERISK) {
                                    i2 = i3;
                                    flag3 = true;
                                }
                            }
                        }

                        let flag4 = false;

                        for (let j3 = i2 + 1; j3 < input.length; j3++) {
                            if (flag4) {
                                if (WordFilter.isSpecial(input[j3])) {
                                    break;
                                }

                                i2 = j3;
                            } else if (!WordFilter.isSpecial(input[j3])) {
                                flag4 = true;
                                i2 = j3;
                            }
                        }
                    }

                    for (let j2 = l1; j2 <= i2; j2++) {
                        input[j2] = C_ASTERISK;
                    }
                }
            }
        }
    }

    static getAsteriskCount(input, input1, len) {
        if (len === 0) {
            return 2;
        }

        for (let j = len - 1; j >= 0; j--) {
            if (!WordFilter.isSpecial(input[j])) {
                break;
            }

            if (input[j] === C_COMMA || input[j] === C_DOT) {
                return 3;
            }
        }

        let filtered = 0;

        for (let l = len - 1; l >= 0; l--) {
            if (!WordFilter.isSpecial(input1[l])) {
                break;
            }

            if (input1[l] === C_ASTERISK) {
                filtered++;
            }
        }

        if (filtered >= 3) {
            return 4;
        }

        return WordFilter.isSpecial(input[len - 1]) ? 1 : 0;
    }

    static getAsteriskCount2(input, input1, len) {
        if ((len + 1) === input.length) {
            return 2;
        }

        for (let j = len + 1; j < input.length; j++) {
            if (!WordFilter.isSpecial(input[j])) {
                break;
            }

            if (input[j] === C_BACKSLASH || input[j] === C_SLASH) {
                return 3;
            }
        }

        let filtered = 0;

        for (let l = len + 1; l < input.length; l++) {
            if (!WordFilter.isSpecial(input1[l])) {
                break;
            }

            if (input1[l] === C_ASTERISK) {
                filtered++;
            }
        }

        if (filtered >= 5) {
            return 4;
        }

        return WordFilter.isSpecial(input[len + 1]) ? 1 : 0;
    }

    static applyWordFilter(input, wordList, charIds) {
        if (wordList.length > input.length) {
            return;
        }

        for (let charIndex = 0; charIndex <= input.length - wordList.length; charIndex++) {
            let inputCharCount = charIndex;
            let k = 0;
            let specialChar = false;

            while (inputCharCount < input.length) {
                let l = 0;
                let inputChar = input[inputCharCount];
                let nextChar = 0;

                if ((inputCharCount + 1) < input.length) {
                    nextChar = input[inputCharCount + 1];
                }

                if (k < wordList.length && (l = WordFilter.compareLettersSymbols(wordList[k], inputChar, nextChar)) > 0) {
                    inputCharCount += l;
                    k++;
                    continue;
                }

                if (k === 0) {
                    break;
                }

                if ((l = WordFilter.compareLettersSymbols(wordList[k - 1], inputChar, nextChar)) > 0) {
                    inputCharCount += l;
                    continue;
                }

                if (k >= wordList.length || !WordFilter.isNotLowerCase(inputChar)) {
                    break;
                }

                if (WordFilter.isSpecial(inputChar) && inputChar !== C_SINGLE_QUOTE) {
                    specialChar = true;
                }

                inputCharCount++;
            }

            if (k >= wordList.length) {
                let filter = true;

                if (WordFilter.DEBUGTLD) {
                    console.log(`Potential word: ${wordList} at char ${charIndex}`);
                }

                if (!specialChar) {
                    let prevChar = C_SPACE;

                    if ((charIndex - 1) >= 0) {
                        prevChar = input[charIndex - 1];
                    }

                    let curChar = C_SPACE;

                    if (inputCharCount < input.length) {
                        curChar = input[inputCharCount];
                    }

                    let prevId = WordFilter.getCharId(prevChar);
                    let curId = WordFilter.getCharId(curChar);

                    if (charIds && WordFilter.compareCharIds(charIds, prevId, curId)) { 
                        filter = false;
                    }
                } else {
                    let flag2 = false;
                    let flag3 = false;

                    if ((charIndex - 1) < 0 || WordFilter.isSpecial(input[charIndex - 1]) && input[charIndex - 1] !== C_SINGLE_QUOTE) {
                        flag2 = true;
                    }

                    if (inputCharCount >= input.length || WordFilter.isSpecial(input[inputCharCount]) && input[inputCharCount] !== C_SINGLE_QUOTE) {
                        flag3 = true;
                    }

                    if (!flag2 || !flag3) {
                        let flag4 = false;
                        let j1 = charIndex - 2;

                        if (flag2) {
                            j1 = charIndex;
                        }

                        for (; !flag4 && j1 < inputCharCount; j1++) {
                            if (j1 >= 0 && (!WordFilter.isSpecial(input[j1]) || input[j1] === C_SINGLE_QUOTE)) {
                                let ac2 = new Uint16Array(3);
                                let k1;

                                for (k1 = 0; k1 < 3; k1++) {
                                    if ((j1 + k1) >= input.length || WordFilter.isSpecial(input[j1 + k1]) && input[j1 + k1] !== C_SINGLE_QUOTE) {
                                        break;
                                    }

                                    ac2[k1] = input[j1 + k1];
                                }

                                let flag5 = true;

                                if (k1 === 0) {
                                    flag5 = false;
                                }

                                if (k1 < 3 && j1 - 1 >= 0 && (!WordFilter.isSpecial(input[j1 - 1]) || input[j1 - 1] === C_SINGLE_QUOTE)) {
                                    flag5 = false;
                                }

                                if (flag5 && !WordFilter.containsFragmentHashes(ac2)) {
                                    flag4 = true;
                                }
                            }
                        }

                        if (!flag4) {
                            filter = false;
                        }
                    }
                }

                if (filter) {
                    if (WordFilter.DEBUGWORD) {
                        console.log(`Filtered word: ${wordList} at char ${charIndex}`);
                    }

                    for (let i1 = charIndex; i1 < inputCharCount; i1++) {
                        input[i1] = C_ASTERISK;
                    }
                }
            }
        }
    }

    static compareCharIds(charIdData, prevCharId, curCharId) {
        let first = 0;

        if (charIdData[first][0] === prevCharId && charIdData[first][1] === curCharId) {
            return true;
        }

        let last = charIdData.length - 1;

        if (charIdData[last][0] === prevCharId && charIdData[last][1] === curCharId) {
            return true;
        }

        while (first !== last && (first + 1) !== last) {
            let middle = ((first + last) / 2) | 0;

            if (charIdData[middle][0] === prevCharId && charIdData[middle][1] === curCharId) {
                return true;
            }

            if (prevCharId < charIdData[middle][0] || prevCharId === charIdData[middle][0] && curCharId < charIdData[middle][1]) {
                last = middle;
            } else {
                first = middle;
            }
        }

        return false;
    }

    static compareLettersNumbers(filterChar, currentChar, nextChar) {
        filterChar = String.fromCharCode(filterChar);
        currentChar = String.fromCharCode(currentChar);
        nextChar = String.fromCharCode(nextChar);

        if (filterChar === currentChar) {
            return 1;
        }

        if (filterChar === 'e' && currentChar === '3') {
            return 1;
        }

        if (filterChar === 't' && (currentChar === '7' || currentChar === '+')) {
            return 1;
        }

        if (filterChar === 'a' && (currentChar === '4' || currentChar === '@')) {
            return 1;
        }

        if (filterChar === 'o' && currentChar === '0') {
            return 1;
        }

        if (filterChar === 'i' && currentChar === '1') {
            return 1;
        }

        if (filterChar === 's' && currentChar === '5') {
            return 1;
        }

        if (filterChar === 'f' && currentChar === 'p' && nextChar === 'h') {
            return 2;
        }

        return filterChar === 'g' && currentChar === '9' ? 1 : 0;
    }

    static compareLettersSymbols(filterChar, currentChar, nextChar) {
        filterChar = String.fromCharCode(filterChar);
        currentChar = String.fromCharCode(currentChar);
        nextChar = String.fromCharCode(nextChar);

        if (filterChar === '*') {
            return 0;
        }

        if (filterChar === currentChar) {
            return 1;
        }

        if (filterChar >= 'a' && filterChar <= 'z') {
            if (filterChar === 'e') {
                return currentChar === '3' ? 1 : 0;
            }

            if (filterChar === 't') {
                return currentChar === '7' ? 1 : 0;
            }

            if (filterChar === 'a') {
                return currentChar === '4' || currentChar === '@' ? 1 : 0;
            }

            if (filterChar === 'o') {
                if (currentChar === '0' || currentChar === '*') {
                    return 1;
                }

                return currentChar === '(' && nextChar === ')' ? 2 : 0;
            }

            if (filterChar === 'i') {
                return currentChar === 'y' || currentChar === 'l' || currentChar === 'j' || currentChar === 'l' || currentChar === '!' || currentChar === ':' || currentChar === ';' ? 1 : 0;
            }

            if (filterChar === 'n') {
                return 0;
            }

            if (filterChar === 's') {
                return currentChar === '5' || currentChar === 'z' || currentChar === '$' ? 1 : 0;
            }

            if (filterChar === 'r') {
                return 0;
            }

            if (filterChar === 'h') {
                return 0;
            }

            if (filterChar === 'l') {
                return currentChar === '1' ? 1 : 0;
            }

            if (filterChar === 'd') {
                return 0;
            }

            if (filterChar === 'c') {
                return currentChar === '(' ? 1 : 0;
            }

            if (filterChar === 'u') {
                return currentChar === 'v' ? 1 : 0;
            }

            if (filterChar === 'm') {
                return 0;
            }

            if (filterChar === 'f') {
                return currentChar === 'p' && nextChar === 'h' ? 2 : 0;
            }

            if (filterChar === 'p') {
                return 0;
            }

            if (filterChar === 'g') {
                return currentChar === '9' || currentChar === '6' ? 1 : 0;
            }

            if (filterChar === 'w') {
                return currentChar === 'v' && nextChar === 'v' ? 2 : 0;
            }

            if (filterChar === 'y') {
                return 0;
            }

            if (filterChar === 'b') {
                return currentChar === '1' && nextChar === '3' ? 2 : 0;
            }

            if (filterChar === 'v') {
                return 0;
            }

            if (filterChar === 'k') {
                return 0;
            }

            if (filterChar === 'x') {
                return currentChar === ')' && nextChar === '(' ? 2 : 0;
            }

            if (filterChar === 'j') {
                return 0;
            }

            if (filterChar === 'q') {
                return 0;
            }

            if (filterChar === 'z') {
                return 0;
            }
        }

        if (filterChar >= '0' && filterChar <= '9') {
            if (filterChar === '0') {
                if (currentChar === 'o' || currentChar === 'O') {
                    return 1;
                }

                return currentChar === '(' && nextChar === ')' ? 2 : 0;
            }
            if (filterChar === '1') {
                return currentChar !== 'l' ? 0 : 1;
            }

            if (filterChar === '2') {
                return 0;
            }

            if (filterChar === '3') {
                return 0;
            }

            if (filterChar === '4') {
                return 0;
            }

            if (filterChar === '5') {
                return 0;
            }

            if (filterChar === '6') {
                return 0;
            }

            if (filterChar === '7') {
                return 0;
            }

            if (filterChar === '8') {
                return 0;
            }

            if (filterChar === '9') {
                return 0;
            }
        }

        if (filterChar === '-') {
            return 0;
        }

        if (filterChar === ',') {
            return currentChar === '.' ? 1 : 0;
        }

        if (filterChar === '.') {
            return currentChar === ',' ? 1 : 0;
        }

        if (filterChar === '(') {
            return 0;
        }

        if (filterChar === ')') {
            return 0;
        }

        if (filterChar === '!') {
            return currentChar === 'i' ? 1 : 0;
        }

        if (filterChar === '\'') {
            return 0;
        }

        if (WordFilter.DEBUGWORD) {
            console.log(`Letter=${filterChar} not matched`);
        }

        return 0;
    }

    static getCharId(c) {
        if (c >= C_A && c <= C_Z) {
            return c - 97 + 1;
        }

        if (c === C_SINGLE_QUOTE) {
            return 28;
        }

        if (c >= C_0 && c <= C_9) {
            return c - 48 + 29;
        }

        return 27;
    }

    static heywhathteufck(input) {
        let digitIndex = 0;
        let fromIndex = 0;
        let k = 0;
        let l = 0;

        while ((digitIndex = WordFilter.indexOfDigit(input, fromIndex)) != -1) {
            let flag = false;

            for (let i = fromIndex; i >= 0 && i < digitIndex && !flag; i++) {
                if (!WordFilter.isSpecial(input[i]) && !WordFilter.isNotLowerCase(input[i])) {
                    flag = true;
                }
            }

            if (flag) {
                k = 0;
            }

            if (k === 0) {
                l = digitIndex;
            }

            fromIndex = WordFilter.indexOfNonDigit(input, digitIndex);

            let j1 = 0;

            for (let k1 = digitIndex; k1 < fromIndex; k1++) {
                j1 = (j1 * 10 + input[k1]) - 48;
            }

            if (j1 > 255 || fromIndex - digitIndex > 8) {
                k = 0;
            } else {
                k++;
            }

            if (k === 4) {
                for (let i = l; i < fromIndex; i++) {
                    input[i] = C_ASTERISK;
                }

                k = 0;
            }
        }
    }

    static indexOfDigit(input, fromIndex) {
        for (let i = fromIndex; i < input.length && i >= 0; i++) {
            if (input[i] >= C_0 && input[i] <= C_9) {
                return i;
            }
        }

        return -1;
    }

    static indexOfNonDigit(input, fromIndex) {
        for (let i = fromIndex; i < input.length && i >= 0; i++) {
            if (input[i] < C_0 || input[i] > C_9) {
                return i;
            }
        }

        return input.length;
    }

    static isSpecial(c) {
        return !WordFilter.isLetter(c) && !WordFilter.isDigit(c);
    }

    static isNotLowerCase(c) {
        if (c < C_A || c > C_Z) {
            return true;
        }

        return c === C_V || c === C_X || c === C_J || c === C_Q || c === C_Z;
    }

    static isLetter(c) {
        return c >= C_A && c <= C_Z || c >= C_BIG_A && c <= C_BIG_Z;
    }

    static isDigit(c) {
        return c >= C_0 && c <= C_9;
    }

    static isLowerCase(c) {
        return c >= C_A && c <= C_Z;
    }

    static isUpperCase(c) {
        return c >= C_BIG_A && c <= C_BIG_Z;
    }

    static containsFragmentHashes(input) {
        let notNum = true;

        for (let i = 0; i < input.length; i++) {
            if (!WordFilter.isDigit(input[i]) && input[i] !== 0) {
                notNum = false;
            }
        }

        if (notNum) {
            return true;
        }

        let inputHash = WordFilter.wordToHash(input);
        let first = 0;
        let last = WordFilter.hashFragments.length - 1;

        if (inputHash === WordFilter.hashFragments[first] || inputHash === WordFilter.hashFragments[last]) {
            return true;
        }

        while (first != last && first + 1 != last) {
            let middle = ((first + last) / 2) | 0;

            if (inputHash === WordFilter.hashFragments[middle]) {
                return true;
            }

            if (inputHash < WordFilter.hashFragments[middle]) {
                last = middle;
            } else {
                first = middle;
            }
        }

        return false;
    }

    static wordToHash(word) {
        if (word.length > 6) {
            return 0;
        }

        let hash = 0;

        for (let i = 0; i < word.length; i++) { 
            let c = word[word.length - i - 1];

            if (c >= C_A && c <= C_Z) {
                hash = (hash * 38 + c - 97 + 1) | 0;
            } else if (c === C_SINGLE_QUOTE) {
                hash = (hash * 38 + 27) | 0;
            } else if (c >= C_0 && c <= C_9) {
                hash = (hash * 38 + c - 48 + 28) | 0;
            } else if (c !== 0) {
                if (WordFilter.DEBUGWORD) {
                    console.log(`wordToHash failed on ${fromCharArray(word)}`);
                }

                return 0;
            }
        }

        return hash;
    }
}

WordFilter.DEBUGTLD = false;
WordFilter.DEBUGWORD = false;
WordFilter.forceLowerCase = true;
WordFilter.ignoreList = [ 'cook', 'cook\'s', 'cooks', 'seeks', 'sheet' ];

module.exports = WordFilter;
},{}],39:[function(require,module,exports){
const GameData = require('./game-data');
const Scene = require('./scene');
const GameModel = require('./game-model');
const Utility = require('./utility');
const ndarray = require('ndarray');

class World {
    constructor(scene, surface) {
        this.regionWidth = 96;
        this.regionHeight = 96;
        this.anInt585 = 128; 
        this.parentModel = null;

        // Int8Arrays 
        this.landscapePack = null; 
        this.mapPack = null; 
        this.memberLandscapePack = null;
        this.memberMapPack = null;

        this.worldInitialised = true;
        this.objectAdjacency = ndarray(new Int32Array(this.regionWidth * this.regionHeight), [this.regionWidth, this.regionHeight]);
        this.tileDirection = ndarray(new Int8Array(4 * 2304), [4, 2304]);

        this.wallModels = [];
        this.roofModels = [];

        for (let i = 0; i < 4; i += 1) {
            this.wallModels.push([]);
            this.roofModels.push([]);

            for (let j = 0; j < 64; j += 1) {
                this.wallModels[i].push(null);
                this.roofModels[i].push(null);
            }
        }

        this.terrainColours = new Int32Array(256);
        this.wallsNorthSouth = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.wallsRoof = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.terrainHeight = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.terrainColour = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.localY = new Int32Array(18432);
        this.tileDecoration = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.routeVia = ndarray(new Int32Array(this.regionWidth * this.regionHeight), [this.regionWidth, this.regionHeight]);
        this.wallsDiagonal = ndarray(new Int32Array(4 * 2304), [4, 2304]);
        this.wallsEastWest = ndarray(new Int8Array(4 * 2304), [4, 2304]);
        this.aBoolean592 = false;
        this.playerAlive = false;
        this.terrainHeightLocal = ndarray(new Int32Array(this.regionWidth * this.regionHeight), [this.regionWidth, this.regionHeight]);

        this.terrainModels = [];
        this.terrainModels.length = 64;
        this.terrainModels.fill(null);

        this.localX = new Int32Array(18432);
        this.baseMediaSprite = 750;

        this.scene = scene;
        this.surface = surface;

        for (let i = 0; i < 64; i++) {
            this.terrainColours[i] = Scene.rgb(255 - i * 4, 255 - ((i * 1.75) | 0), 255 - i * 4);
        }

        for (let j = 0; j < 64; j++) {
            this.terrainColours[j + 64] = Scene.rgb(j * 3, 144, 0);
        }

        for (let k = 0; k < 64; k++) {
            this.terrainColours[k + 128] = Scene.rgb(192 - ((k * 1.5) | 0), 144 - ((k * 1.5) | 0), 0);
        }

        for (let l = 0; l < 64; l++) {
            this.terrainColours[l + 192] = Scene.rgb(96 - ((l * 1.5) | 0), 48 + ((l * 1.5) | 0), 0);
        }
    }

    getWallEastWest(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.wallsEastWest.get(h, x * 48 + y) & 0xff;
    }

    setTerrainAmbience(x, y, x2, y2, ambience) {
        let gameModel = this.terrainModels[x + y * 8];

        for (let j1 = 0; j1 < gameModel.numVertices; j1++) {
            if (gameModel.vertexX[j1] === x2 * this.anInt585 && gameModel.vertexZ[j1] === y2 * this.anInt585) {
                gameModel.setVertexAmbience(j1, ambience);
                return;
            }
        }
    }

    getWallRoof(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.wallsRoof.get(h, x * 48 + y);
    }

    getElevation(x, y) {
        let sX = x >> 7;
        let sY = y >> 7;
        let aX = x & 0x7f;
        let aY = y & 0x7f;

        if (sX < 0 || sY < 0 || sX >= 95 || sY >= 95) {
            return 0;
        }

        let h = 0;
        let hx = 0;
        let hy = 0;

        if (aX <= this.anInt585 - aY) {
            h = this.getTerrainHeight(sX, sY);
            hx = this.getTerrainHeight(sX + 1, sY) - h;
            hy = this.getTerrainHeight(sX, sY + 1) - h;
        } else {
            h = this.getTerrainHeight(sX + 1, sY + 1);
            hx = this.getTerrainHeight(sX, sY + 1) - h;
            hy = this.getTerrainHeight(sX + 1, sY) - h;
            aX = this.anInt585 - aX;
            aY = this.anInt585 - aY;
        }

        let elevation = h + (((hx * aX) / this.anInt585) | 0) + (((hy * aY) / this.anInt585) | 0);

        return elevation;
    }

    getWallDiagonal(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.wallsDiagonal.get(h, x * 48 + y);
    }

    removeObject2(x, y, id) {
        if (x < 0 || y < 0 || x >= 95 || y >= 95) {
            return;
        }

        if (GameData.objectType[id] === 1 || GameData.objectType[id] === 2) {
            let tileDir = this.getTileDirection(x, y);
            let modelWidth = 0;
            let modelHeight = 0;

            if (tileDir === 0 || tileDir === 4) {
                modelWidth = GameData.objectWidth[id];
                modelHeight = GameData.objectHeight[id];
            } else {
                modelHeight = GameData.objectWidth[id];
                modelWidth = GameData.objectHeight[id];
            }

            for (let mx = x; mx < x + modelWidth; mx++) {
                for (let my = y; my < y + modelHeight; my++) {
                    const adjacency = this.objectAdjacency.get(mx, my);

                    if (GameData.objectType[id] === 1) {
                        this.objectAdjacency.set(mx, my, adjacency | 0x40);
                    } else if (tileDir === 0) {
                        this.objectAdjacency.set(mx, my, adjacency | 2);

                        if (mx > 0) {
                            this._setObjectAdjacency_from3(mx - 1, my, 8);
                        }
                    } else if (tileDir === 2) {
                        this.objectAdjacency.set(mx, my, adjacency | 4);

                        if (my < 95) {
                            this._setObjectAdjacency_from3(mx, my + 1, 1);
                        }
                    } else if (tileDir === 4) {
                        this.objectAdjacency.set(mx, my, adjacency | 8);

                        if (mx < 95) {
                            this._setObjectAdjacency_from3(mx + 1, my, 2);
                        }
                    } else if (tileDir === 6) {
                        this.objectAdjacency.set(mx, my, adjacency | 1);

                        if (my > 0) {
                            this._setObjectAdjacency_from3(mx, my - 1, 4);
                        }
                    }
                }
            }

            this.method404(x, y, modelWidth, modelHeight);
        }
    }

    removeWallObject(x, y, k, id) {
        if (x < 0 || y < 0 || x >= 95 || y >= 95) {
            return;
        }

        if (GameData.wallObjectAdjacent[id] === 1) {
            const adjacency = this.objectAdjacency.get(x, y);

            if (k === 0) {
                this.objectAdjacency.set(x, y, adjacency & 0xfffe);

                if (y > 0) {
                    this.method407(x, y - 1, 4);
                }
            } else if (k === 1) {
                this.objectAdjacency.set(x, y, adjacency & 0xfffd);

                if (x > 0) {
                    this.method407(x - 1, y, 8);
                }
            } else if (k === 2) {
                this.objectAdjacency.set(x, y, adjacency & 0xffef);
            } else if (k === 3) {
                this.objectAdjacency.set(x, y, adjacency & 0xffdf);
            }

            this.method404(x, y, 1, 1);
        }
    }

    method402(i, j, k, l, i1) {
        let j1 = i * 3;
        let k1 = j * 3;
        let l1 = this.scene.method302(l);
        let i2 = this.scene.method302(i1);
        l1 = l1 >> 1 & 0x7f7f7f;
        i2 = i2 >> 1 & 0x7f7f7f;

        if (k === 0) {
            this.surface.drawLineHoriz(j1, k1, 3, l1);
            this.surface.drawLineHoriz(j1, k1 + 1, 2, l1);
            this.surface.drawLineHoriz(j1, k1 + 2, 1, l1);
            this.surface.drawLineHoriz(j1 + 2, k1 + 1, 1, i2);
            this.surface.drawLineHoriz(j1 + 1, k1 + 2, 2, i2);

            return;
        }

        if (k === 1) {
            this.surface.drawLineHoriz(j1, k1, 3, i2);
            this.surface.drawLineHoriz(j1 + 1, k1 + 1, 2, i2);
            this.surface.drawLineHoriz(j1 + 2, k1 + 2, 1, i2);
            this.surface.drawLineHoriz(j1, k1 + 1, 1, l1);
            this.surface.drawLineHoriz(j1, k1 + 2, 2, l1);
        }
    }

    _loadSection_from4I(x, y, plane, chunk) {
        let mapName = 'm' + plane + ((x / 10) | 0) + x % 10 + ((y / 10) | 0) + y % 10;

        try {
            if (this.landscapePack !== null) {
                let mapData = Utility.loadData(mapName + '.hei', 0, this.landscapePack);

                if (mapData === null && this.memberLandscapePack !== null) {
                    mapData = Utility.loadData(mapName + '.hei', 0, this.memberLandscapePack);
                }

                if (mapData !== null && mapData.length > 0) {
                    let off = 0;
                    let lastVal = 0;

                    for (let tile = 0; tile < 2304; ) {
                        let val = mapData[off++] & 0xff;

                        if (val < 128) {
                            this.terrainHeight.set(chunk, tile++, val & 0xff);
                            lastVal = val;
                        }

                        if (val >= 128) {
                            for (let i = 0; i < val - 128; i++) {
                                this.terrainHeight.set(chunk, tile++, lastVal & 0xff);
                            }
                        }
                    }

                    lastVal = 64;

                    for (let tileY = 0; tileY < 48; tileY++) {
                        for (let tileX = 0; tileX < 48; tileX++) {
                            lastVal = this.terrainHeight.get(chunk, tileX * 48 + tileY) + lastVal & 0x7f;
                            this.terrainHeight.set(chunk, tileX * 48 + tileY, (lastVal * 2) & 0xff);
                        }
                    }

                    lastVal = 0;

                    for (let tile = 0; tile < 2304; ) {
                        let val = mapData[off++] & 0xff;

                        if (val < 128) {
                            this.terrainColour.set(chunk, tile++, val & 0xff);
                            lastVal = val;
                        }

                        if (val >= 128) {
                            for (let i = 0; i < val - 128; i++) {
                                this.terrainColour.set(chunk, tile++, lastVal & 0xff);
                            }
                        }
                    }

                    lastVal = 35;

                    for (let tileY = 0; tileY < 48; tileY++) {
                        for (let tileX = 0; tileX < 48; tileX++) {
                            lastVal = this.terrainColour.get(chunk, tileX * 48 + tileY) + lastVal & 0x7f; // ??? wat
                            this.terrainColour.set(chunk, tileX * 48 + tileY, (lastVal * 2) & 0xff);
                        }
                    }
                } else {
                    for (let tile = 0; tile < 2304; tile++) {
                        this.terrainHeight.set(chunk, tile, 0);
                        this.terrainColour.set(chunk, tile, 0);
                    }
                }

                mapData = Utility.loadData(mapName + '.dat', 0, this.mapPack);

                if (mapData === null && this.memberMapPack !== null) {
                    mapData = Utility.loadData(mapName + '.dat', 0, this.memberMapPack);
                }

                if (mapData === null || mapData.length === 0) {
                    throw new Error();
                }

                let off = 0;

                for (let tile = 0; tile < 2304; tile++) {
                    this.wallsNorthSouth.set(chunk, tile, mapData[off++]);
                }

                for (let tile = 0; tile < 2304; tile++) {
                    this.wallsEastWest.set(chunk, tile, mapData[off++]);
                }

                for (let tile = 0; tile < 2304; tile++) {
                    this.wallsDiagonal.set(chunk, tile, mapData[off++] & 0xff);
                }

                for (let tile = 0; tile < 2304; tile++) {
                    let val = mapData[off++] & 0xff;

                    if (val > 0) {
                        this.wallsDiagonal.set(chunk, tile, val + 12000); // why??
                    }
                }

                for (let tile = 0; tile < 2304; ) {
                    let val = mapData[off++] & 0xff;

                    if (val < 128) {
                        this.wallsRoof.set(chunk, tile++, val & 0xff);
                    } else {
                        for (let i = 0; i < val - 128; i++) {
                            this.wallsRoof.set(chunk, tile++, 0);
                        }
                    }
                }

                let lastVal = 0;

                for (let tile = 0; tile < 2304; ) {
                    let val = mapData[off++] & 0xff;

                    if (val < 128) {
                        this.tileDecoration.set(chunk, tile++, val & 0xff);
                        lastVal = val;
                    } else {
                        for (let i = 0; i < val - 128; i++) {
                            this.tileDecoration.set(chunk, tile++, lastVal);
                        }
                    }
                }

                for (let tile = 0; tile < 2304; ) {
                    let val = mapData[off++] & 0xff;

                    if (val < 128) {
                        this.tileDirection.set(chunk, tile++, val & 0xff);
                    } else {
                        for (let i = 0; i < val - 128; i++) {
                            this.tileDirection.set(chunk, tile++, 0);
                        }
                    }
                }

                mapData = Utility.loadData(mapName + '.loc', 0, this.mapPack);

                if (mapData !== null && mapData.length > 0) {
                    off = 0;

                    for (let tile = 0; tile < 2304; ) {
                        let val = mapData[off++] & 0xff;

                        if (val < 128) {
                            this.wallsDiagonal.set(chunk, tile++, val + 48000);
                        } else {
                            tile += val - 128;
                        }
                    }

                    return;
                }
            } else {
                console.log('stub. removed reading from ../gamedata/');
            }

            return;
        } catch (e) {
            console.error(e);
        }

        for (let tile = 0; tile < 2304; tile++) {
            this.terrainHeight.set(chunk, tile, 0);
            this.terrainColour.set(chunk, tile, 0);
            this.wallsNorthSouth.set(chunk, tile, 0);
            this.wallsEastWest.set(chunk, tile, 0);
            this.wallsDiagonal.set(chunk, tile, 0);
            this.wallsRoof.set(chunk, tile, 0);
            this.tileDecoration.set(chunk, tile, 0);

            if (plane === 0) {
                this.tileDecoration.set(chunk, tile, -6);
            }

            if (plane === 3) {
                this.tileDecoration.set(chunk, tile, 8); 
            }

            this.tileDirection.set(chunk, tile, 0);
        }
    }

    loadSection(...args) {
        switch (args.length) {
        case 3:
            return this._loadSection_from3(...args);
        case 4:
            if (typeof args[3] === 'number') {
                return this._loadSection_from4I(...args);
            }

            return this._loadSection_from4(...args);
        }
    }

    method404(x, y, k, l) {
        if (x < 1 || y < 1 || x + k >= this.regionWidth || y + l >= this.regionHeight) {
            return;
        }

        for (let xx = x; xx <= x + k; xx++) {
            for (let yy = y; yy <= y + l; yy++) {
                if ((this.getObjectAdjacency(xx, yy) & 0x63) !== 0 || (this.getObjectAdjacency(xx - 1, yy) & 0x59) !== 0 || (this.getObjectAdjacency(xx, yy - 1) & 0x56) !== 0 || (this.getObjectAdjacency(xx - 1, yy - 1) & 0x6c) !== 0) {
                    this.method425(xx, yy, 35);
                } else {
                    this.method425(xx, yy, 0);
                }
            }
        }
    }

    getObjectAdjacency(x, y) {
        if (x < 0 || y < 0 || x >= this.regionWidth || y >= this.regionHeight) {
            return 0;
        } else {
            return this.objectAdjacency.get(x, y);
        }
    }

    hasRoof(x, y) {
        return this.getWallRoof(x, y) > 0 && this.getWallRoof(x - 1, y) > 0 && this.getWallRoof(x - 1, y - 1) > 0 && this.getWallRoof(x, y - 1) > 0;
    }

    method407(i, j, k) {
        const adjacency = this.objectAdjacency.get(i, j);
        this.objectAdjacency.set(i, j, adjacency & 0xffff - k);
    }

    getTerrainColour(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let byte0 = 0;

        if (x >= 48 && y < 48) {
            byte0 = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            byte0 = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            byte0 = 3;
            x -= 48;
            y -= 48;
        }

        return this.terrainColour.get(byte0, x * 48 + y) & 0xff;
    }

    reset() {
        if (this.worldInitialised) {
            this.scene.dispose();
        }

        for (let i = 0; i < 64; i++) {
            this.terrainModels[i] = null;

            for (let j = 0; j < 4; j++) {
                this.wallModels[j][i] = null;
            }

            for (let k = 0; k < 4; k++) {
                this.roofModels[k][i] = null;
            }

        }

        //System.gc();
    }

    setTiles() {
        for (let x = 0; x < this.regionWidth; x++) {
            for (let y = 0; y < this.regionHeight; y++) {
                if (this.getTileDecoration(x, y, 0) === 250) {
                    if (x === 47 && this.getTileDecoration(x + 1, y, 0) !== 250 && this.getTileDecoration(x + 1, y, 0) !== 2) {
                        this.setTileDecoration(x, y, 9);
                    } else if (y === 47 && this.getTileDecoration(x, y + 1, 0) !== 250 && this.getTileDecoration(x, y + 1, 0) !== 2) {
                        this.setTileDecoration(x, y, 9); 
                    } else {
                        this.setTileDecoration(x, y, 2);
                    }
                }
            }
        }
    }

    getWallNorthSouth(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.wallsNorthSouth.get(h, x * 48 + y) & 0xff;
    }

    getTileDirection(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.tileDirection.get(h, x * 48 + y);
    }

    _getTileDecoration_from4(x, y, unused, def) {
        let deco = this._getTileDecoration_from3(x, y, unused);

        if (deco === 0) {
            return def;
        } else {
            return GameData.tileDecoration[deco - 1];
        }
    }

    _getTileDecoration_from3(x, y, unused) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        return this.tileDecoration.get(h, x * 48 + y) & 0xff;
    }

    getTileDecoration(...args) {
        switch (args.length) {
        case 3:
            return this._getTileDecoration_from3(...args);
        case 4:
            return this._getTileDecoration_from4(...args);
        }
    }

    setTileDecoration(x, y, v) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return;
        }

        let h = 0;

        if (x >= 48 && y < 48) {
            h = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            h = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            h = 3;
            x -= 48;
            y -= 48;
        }

        this.tileDecoration.set(h, x * 48 + y, v & 0xff);
    }

    route(startX, startY, endX1, endY1, endX2, endY2, routeX, routeY, objects) {
        for (let x = 0; x < this.regionWidth; x++) {
            for (let y = 0; y < this.regionHeight; y++) {
                this.routeVia.set(x, y, 0);
            }
        }

        let writePtr = 0;
        let readPtr = 0;
        let x = startX;
        let y = startY;

        this.routeVia.set(startX, startY, 99);
        routeX[writePtr] = startX;
        routeY[writePtr++] = startY;

        let size = routeX.length;
        let reached = false;

        while (readPtr !== writePtr) {
            x = routeX[readPtr];
            y = routeY[readPtr];
            readPtr = (readPtr + 1) % size;

            if (x >= endX1 && x <= endX2 && y >= endY1 && y <= endY2) {
                reached = true;
                break;
            }

            if (objects) {
                if (x > 0 && x - 1 >= endX1 && x - 1 <= endX2 && y >= endY1 && y <= endY2 && (this.objectAdjacency.get(x - 1, y) & 8) === 0) {
                    reached = true;
                    break;
                }

                if (x < 95 && x + 1 >= endX1 && x + 1 <= endX2 && y >= endY1 && y <= endY2 && (this.objectAdjacency.get(x + 1, y) & 2) === 0) {
                    reached = true;
                    break;
                }

                if (y > 0 && x >= endX1 && x <= endX2 && y - 1 >= endY1 && y - 1 <= endY2 && (this.objectAdjacency.get(x, y - 1) & 4) === 0) {
                    reached = true;
                    break;
                }

                if (y < 95 && x >= endX1 && x <= endX2 && y + 1 >= endY1 && y + 1 <= endY2 && (this.objectAdjacency.get(x, y + 1) & 1) === 0) {
                    reached = true;
                    break;
                }
            }

            if (x > 0 && this.routeVia.get(x - 1, y) === 0 && (this.objectAdjacency.get(x - 1, y) & 0x78) === 0) {
                routeX[writePtr] = x - 1;
                routeY[writePtr] = y;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x - 1, y, 2);
            }

            if (x < 95 && this.routeVia.get(x + 1, y) === 0 && (this.objectAdjacency.get(x + 1, y) & 0x72) === 0) {
                routeX[writePtr] = x + 1;
                routeY[writePtr] = y;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x + 1, y, 8);
            }

            if (y > 0 && this.routeVia.get(x, y - 1) === 0 && (this.objectAdjacency.get(x, y - 1) & 0x74) === 0) {
                routeX[writePtr] = x;
                routeY[writePtr] = y - 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x, y - 1, 1);
            }

            if (y < 95 && this.routeVia.get(x, y + 1) === 0 && (this.objectAdjacency.get(x, y + 1) & 0x71) === 0) {
                routeX[writePtr] = x;
                routeY[writePtr] = y + 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x, y + 1, 4);
            }

            if (x > 0 && y > 0 && (this.objectAdjacency.get(x, y - 1) & 0x74) === 0 && (this.objectAdjacency.get(x - 1, y) & 0x78) === 0 && (this.objectAdjacency.get(x - 1, y - 1) & 0x7c) === 0 && this.routeVia.get(x - 1, y - 1) === 0) {
                routeX[writePtr] = x - 1;
                routeY[writePtr] = y - 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x - 1, y - 1, 3);
            }

            if (x < 95 && y > 0 && (this.objectAdjacency.get(x, y - 1) & 0x74) === 0 && (this.objectAdjacency.get(x + 1, y) & 0x72) === 0 && (this.objectAdjacency.get(x + 1, y - 1) & 0x76) === 0 && this.routeVia.get(x + 1, y - 1) === 0) {
                routeX[writePtr] = x + 1;
                routeY[writePtr] = y - 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x + 1, y - 1, 9);
            }

            if (x > 0 && y < 95 && (this.objectAdjacency.get(x, y + 1) & 0x71) === 0 && (this.objectAdjacency.get(x - 1, y) & 0x78) === 0 && (this.objectAdjacency.get(x - 1, y + 1) & 0x79) === 0 && this.routeVia.get(x - 1, y + 1) === 0) {
                routeX[writePtr] = x - 1;
                routeY[writePtr] = y + 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x - 1, y + 1, 6);
            }

            if (x < 95 && y < 95 && (this.objectAdjacency.get(x, y + 1) & 0x71) === 0 && (this.objectAdjacency.get(x + 1, y) & 0x72) === 0 && (this.objectAdjacency.get(x + 1,y + 1) & 0x73) === 0 && this.routeVia.get(x + 1, y + 1) === 0) {
                routeX[writePtr] = x + 1;
                routeY[writePtr] = y + 1;
                writePtr = (writePtr + 1) % size;
                this.routeVia.set(x + 1, y + 1, 12);
            }
        }

        if (!reached) {
            return -1;
        }

        readPtr = 0;
        routeX[readPtr] = x;
        routeY[readPtr++] = y;

        let stride;

        for (let step = stride = this.routeVia.get(x, y); x !== startX || y !== startY; step = this.routeVia.get(x, y)) {
            if (step !== stride) {
                stride = step;
                routeX[readPtr] = x;
                routeY[readPtr++] = y;
            }

            if ((step & 2) !== 0) {
                x++;
            } else if ((step & 8) !== 0) {
                x--;
            }

            if ((step & 1) !== 0) {
                y++;
            } else if ((step & 4) !== 0) {
                y--;
            }
        }

        return readPtr;
    }

    _setObjectAdjacency_from4(x, y, dir, id) {
        if (x < 0 || y < 0 || x >= 95 || y >= 95) {
            return;
        }

        if (GameData.wallObjectAdjacent[id] === 1) {
            const adjacency = this.objectAdjacency.get(x, y);

            if (dir === 0) {
                this.objectAdjacency.set(x, y, adjacency | 1);

                if (y > 0) {
                    this._setObjectAdjacency_from3(x, y - 1, 4);
                }
            } else if (dir === 1) {
                this.objectAdjacency.set(x, y, adjacency | 2);

                if (x > 0) {
                    this._setObjectAdjacency_from3(x - 1, y, 8);
                }
            } else if (dir === 2) {
                this.objectAdjacency.set(x, y, adjacency | 0x10);
            } else if (dir === 3) {
                this.objectAdjacency.set(x, y, adjacency | 0x20);
            }

            this.method404(x, y, 1, 1);
        }
    }

    setObjectAdjacency(...args) {
        switch (args.length) {
        case 4:
            return this._setObjectAdjacency_from4(...args);
        case 3:
            return this._setObjectAdjacency_from3(...args);
        }
    }

    _loadSection_from4(x, y, plane, flag) {
        let l = ((x + 24) / 48) | 0;
        let i1 = ((y + 24) / 48) | 0;

        this._loadSection_from4I(l - 1, i1 - 1, plane, 0);
        this._loadSection_from4I(l, i1 - 1, plane, 1);
        this._loadSection_from4I(l - 1, i1, plane, 2);
        this._loadSection_from4I(l, i1, plane, 3);
        this.setTiles();

        if (this.parentModel === null) {
            this.parentModel = GameModel._from7(18688, 18688, true, true, false, false, true);
        }

        if (flag) {
            this.surface.blackScreen();

            for (let j1 = 0; j1 < this.regionWidth; j1++) {
                for (let l1 = 0; l1 < this.regionHeight; l1++) {
                    this.objectAdjacency.set(j1, l1, 0);
                }
            }

            let gameModel = this.parentModel;
            gameModel.clear();

            for (let j2 = 0; j2 < this.regionWidth; j2++) {
                for (let i3 = 0; i3 < this.regionHeight; i3++) {
                    let i4 = -this.getTerrainHeight(j2, i3);

                    if (this.getTileDecoration(j2, i3, plane) > 0 && GameData.tileType[this.getTileDecoration(j2, i3, plane) - 1] === 4) {
                        i4 = 0;
                    }

                    if (this.getTileDecoration(j2 - 1, i3, plane) > 0 && GameData.tileType[this.getTileDecoration(j2 - 1, i3, plane) - 1] === 4) {
                        i4 = 0;
                    }

                    if (this.getTileDecoration(j2, i3 - 1, plane) > 0 && GameData.tileType[this.getTileDecoration(j2, i3 - 1, plane) - 1] === 4) {
                        i4 = 0;
                    }

                    if (this.getTileDecoration(j2 - 1, i3 - 1, plane) > 0 && GameData.tileType[this.getTileDecoration(j2 - 1, i3 - 1, plane) - 1] === 4) {
                        i4 = 0;
                    }

                    let j5 = gameModel.vertexAt(j2 * this.anInt585, i4, i3 * this.anInt585);
                    let j7 = ((Math.random() * 10) | 0) - 5;

                    gameModel.setVertexAmbience(j5, j7);
                }
            }

            for (let lx = 0; lx < 95; lx++) {
                for (let ly = 0; ly < 95; ly++) {
                    let colourIndex = this.getTerrainColour(lx, ly);
                    let colour = this.terrainColours[colourIndex];
                    let colour_1 = colour;
                    let colour_2 = colour;
                    let l14 = 0;

                    if (plane === 1 || plane === 2) {
                        colour = World.colourTransparent;
                        colour_1 = World.colourTransparent;
                        colour_2 = World.colourTransparent;
                    }

                    if (this.getTileDecoration(lx, ly, plane) > 0) {
                        let decorationType = this.getTileDecoration(lx, ly, plane);
                        let decorationTileType = GameData.tileType[decorationType - 1];
                        let tileType = this.getTileType(lx, ly, plane);

                        colour = colour_1 = GameData.tileDecoration[decorationType - 1];

                        if (decorationTileType === 4) {
                            colour = 1;
                            colour_1 = 1;

                            if (decorationType === 12) {
                                colour = 31;
                                colour_1 = 31;
                            }
                        }

                        if (decorationTileType === 5) {
                            if (this.getWallDiagonal(lx, ly) > 0 && this.getWallDiagonal(lx, ly) < 24000) {
                                if (this.getTileDecoration(lx - 1, ly, plane, colour_2) !== World.colourTransparent && this.getTileDecoration(lx, ly - 1, plane, colour_2) !== World.colourTransparent) {
                                    colour = this.getTileDecoration(lx - 1, ly, plane, colour_2);
                                    l14 = 0;
                                } else if (this.getTileDecoration(lx + 1, ly, plane, colour_2) !== World.colourTransparent && this.getTileDecoration(lx, ly + 1, plane, colour_2) !== World.colourTransparent) {
                                    colour_1 = this.getTileDecoration(lx + 1, ly, plane, colour_2);
                                    l14 = 0;
                                } else if (this.getTileDecoration(lx + 1, ly, plane, colour_2) !== World.colourTransparent && this.getTileDecoration(lx, ly - 1, plane, colour_2) !== World.colourTransparent) {
                                    colour_1 = this.getTileDecoration(lx + 1, ly, plane, colour_2);
                                    l14 = 1;
                                } else if (this.getTileDecoration(lx - 1, ly, plane, colour_2) !== World.colourTransparent && this.getTileDecoration(lx, ly + 1, plane, colour_2) !== World.colourTransparent) {
                                    colour = this.getTileDecoration(lx - 1, ly, plane, colour_2);
                                    l14 = 1;
                                }
                            }
                        } else if (decorationTileType !== 2 || this.getWallDiagonal(lx, ly) > 0 && this.getWallDiagonal(lx, ly) < 24000) {
                            if (this.getTileType(lx - 1, ly, plane) !== tileType && this.getTileType(lx, ly - 1, plane) !== tileType) {
                                colour = colour_2;
                                l14 = 0;
                            } else if (this.getTileType(lx + 1, ly, plane) !== tileType && this.getTileType(lx, ly + 1, plane) !== tileType) {
                                colour_1 = colour_2;
                                l14 = 0;
                            } else if (this.getTileType(lx + 1, ly, plane) !== tileType && this.getTileType(lx, ly - 1, plane) !== tileType) {
                                colour_1 = colour_2;
                                l14 = 1;
                            } else if (this.getTileType(lx - 1, ly, plane) !== tileType && this.getTileType(lx, ly + 1, plane) !== tileType) {
                                colour = colour_2;
                                l14 = 1;
                            }
                        }
                        
                        if (GameData.tileAdjacent[decorationType - 1] !== 0) {
                            const adjacency = this.objectAdjacency.get(lx, ly);
                            this.objectAdjacency.set(lx, ly, adjacency | 0x40);
                        }

                        if (GameData.tileType[decorationType - 1] === 2) {
                            const adjacency = this.objectAdjacency.get(lx, ly);
                            this.objectAdjacency.set(lx, ly, adjacency | 0x80);
                        }
                    }

                    this.method402(lx, ly, l14, colour, colour_1);

                    let i17 = ((this.getTerrainHeight(lx + 1, ly + 1) - this.getTerrainHeight(lx + 1, ly)) + this.getTerrainHeight(lx, ly + 1)) - this.getTerrainHeight(lx, ly);

                    if (colour !== colour_1 || i17 !== 0) {
                        let ai = new Int32Array(3);
                        let ai7 = new Int32Array(3);

                        if (l14 === 0) {
                            if (colour !== World.colourTransparent) {
                                ai[0] = ly + lx * 96 + 96;
                                ai[1] = ly + lx * 96;
                                ai[2] = ly + lx * 96 + 1;

                                let l21 = gameModel.createFace(3, ai, World.colourTransparent, colour);

                                this.localX[l21] = lx;
                                this.localY[l21] = ly;

                                gameModel.faceTag[l21] = 0x30d40 + l21;
                            }

                            if (colour_1 !== World.colourTransparent) {
                                ai7[0] = ly + lx * 96 + 1;
                                ai7[1] = ly + lx * 96 + 96 + 1;
                                ai7[2] = ly + lx * 96 + 96;

                                let i22 = gameModel.createFace(3, ai7, World.colourTransparent, colour_1);

                                this.localX[i22] = lx;
                                this.localY[i22] = ly;

                                gameModel.faceTag[i22] = 0x30d40 + i22;
                            }
                        } else {
                            if (colour !== World.colourTransparent) {
                                ai[0] = ly + lx * 96 + 1;
                                ai[1] = ly + lx * 96 + 96 + 1;
                                ai[2] = ly + lx * 96;

                                let j22 = gameModel.createFace(3, ai, World.colourTransparent, colour);

                                this.localX[j22] = lx;
                                this.localY[j22] = ly;

                                gameModel.faceTag[j22] = 0x30d40 + j22;
                            }

                            if (colour_1 !== World.colourTransparent) {
                                ai7[0] = ly + lx * 96 + 96;
                                ai7[1] = ly + lx * 96;
                                ai7[2] = ly + lx * 96 + 96 + 1;

                                let k22 = gameModel.createFace(3, ai7, World.colourTransparent, colour_1);

                                this.localX[k22] = lx;
                                this.localY[k22] = ly;

                                gameModel.faceTag[k22] = 0x30d40 + k22;
                            }
                        }
                    } else if (colour !== World.colourTransparent) {
                        let ai1 = new Int32Array(4);
                        ai1[0] = ly + lx * 96 + 96;
                        ai1[1] = ly + lx * 96;
                        ai1[2] = ly + lx * 96 + 1;
                        ai1[3] = ly + lx * 96 + 96 + 1;

                        let l19 = gameModel.createFace(4, ai1, World.colourTransparent, colour);

                        this.localX[l19] = lx;
                        this.localY[l19] = ly;

                        gameModel.faceTag[l19] = 0x30d40 + l19;
                    }
                }
            }

            for (let k4 = 1; k4 < 95; k4++) {
                for (let i6 = 1; i6 < 95; i6++) {
                    if (this.getTileDecoration(k4, i6, plane) > 0 && GameData.tileType[this.getTileDecoration(k4, i6, plane) - 1] === 4) {
                        let l7 = GameData.tileDecoration[this.getTileDecoration(k4, i6, plane) - 1];
                        let j10 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6), i6 * this.anInt585);
                        let l12 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6), i6 * this.anInt585);
                        let i15 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6 + 1), (i6 + 1) * this.anInt585);
                        let j17 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6 + 1), (i6 + 1) * this.anInt585);
                        let ai2 = new Int32Array([j10, l12, i15, j17]);
                        let i20 = gameModel.createFace(4, ai2, l7, World.colourTransparent);
                        this.localX[i20] = k4;
                        this.localY[i20] = i6;
                        gameModel.faceTag[i20] = 0x30d40 + i20;
                        this.method402(k4, i6, 0, l7, l7);
                    } else if (this.getTileDecoration(k4, i6, plane) === 0 || GameData.tileType[this.getTileDecoration(k4, i6, plane) - 1] !== 3) {
                        if (this.getTileDecoration(k4, i6 + 1, plane) > 0 && GameData.tileType[this.getTileDecoration(k4, i6 + 1, plane) - 1] === 4) {
                            let i8 = GameData.tileDecoration[this.getTileDecoration(k4, i6 + 1, plane) - 1];
                            let k10 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6), i6 * this.anInt585);
                            let i13 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6), i6 * this.anInt585);
                            let j15 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6 + 1), (i6 + 1) * this.anInt585);
                            let k17 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6 + 1), (i6 + 1) * this.anInt585);
                            let ai3 = new Int32Array([k10, i13, j15, k17]);
                            let j20 = gameModel.createFace(4, ai3, i8, World.colourTransparent);
                            this.localX[j20] = k4;
                            this.localY[j20] = i6;
                            gameModel.faceTag[j20] = 0x30d40 + j20;
                            this.method402(k4, i6, 0, i8, i8);
                        }

                        if (this.getTileDecoration(k4, i6 - 1, plane) > 0 && GameData.tileType[this.getTileDecoration(k4, i6 - 1, plane) - 1] === 4) {
                            let j8 = GameData.tileDecoration[this.getTileDecoration(k4, i6 - 1, plane) - 1];
                            let l10 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6), i6 * this.anInt585);
                            let j13 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6), i6 * this.anInt585);
                            let k15 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6 + 1), (i6 + 1) * this.anInt585);
                            let l17 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6 + 1), (i6 + 1) * this.anInt585);
                            let ai4 = new Int32Array([l10, j13, k15, l17]);
                            let k20 = gameModel.createFace(4, ai4, j8, World.colourTransparent);
                            this.localX[k20] = k4;
                            this.localY[k20] = i6;
                            gameModel.faceTag[k20] = 0x30d40 + k20;
                            this.method402(k4, i6, 0, j8, j8);
                        }

                        if (this.getTileDecoration(k4 + 1, i6, plane) > 0 && GameData.tileType[this.getTileDecoration(k4 + 1, i6, plane) - 1] === 4) {
                            let k8 = GameData.tileDecoration[this.getTileDecoration(k4 + 1, i6, plane) - 1];
                            let i11 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6), i6 * this.anInt585);
                            let k13 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6), i6 * this.anInt585);
                            let l15 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6 + 1), (i6 + 1) * this.anInt585);
                            let i18 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6 + 1), (i6 + 1) * this.anInt585);
                            let ai5 = new Int32Array([i11, k13, l15, i18]);
                            let l20 = gameModel.createFace(4, ai5, k8, World.colourTransparent);
                            this.localX[l20] = k4;
                            this.localY[l20] = i6;
                            gameModel.faceTag[l20] = 0x30d40 + l20;
                            this.method402(k4, i6, 0, k8, k8);
                        }

                        if (this.getTileDecoration(k4 - 1, i6, plane) > 0 && GameData.tileType[this.getTileDecoration(k4 - 1, i6, plane) - 1] === 4) {
                            let l8 = GameData.tileDecoration[this.getTileDecoration(k4 - 1, i6, plane) - 1];
                            let j11 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6), i6 * this.anInt585);
                            let l13 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6), i6 * this.anInt585);
                            let i16 = gameModel.vertexAt((k4 + 1) * this.anInt585, -this.getTerrainHeight(k4 + 1, i6 + 1), (i6 + 1) * this.anInt585);
                            let j18 = gameModel.vertexAt(k4 * this.anInt585, -this.getTerrainHeight(k4, i6 + 1), (i6 + 1) * this.anInt585);
                            let ai6 = new Int32Array([j11, l13, i16, j18]);
                            let i21 = gameModel.createFace(4, ai6, l8, World.colourTransparent);
                            this.localX[i21] = k4;
                            this.localY[i21] = i6;
                            gameModel.faceTag[i21] = 0x30d40 + i21;
                            this.method402(k4, i6, 0, l8, l8);
                        }
                    }
                }
            }

            gameModel._setLight_from6(true, 40, 48, -50, -10, -50);
            this.terrainModels = this.parentModel.split(0, 0, 1536, 1536, 8, 64, 233, false);

            for (let j6 = 0; j6 < 64; j6++) {
                this.scene.addModel(this.terrainModels[j6]);
            }

            for (let X = 0; X < this.regionWidth; X++) {
                for (let Y = 0; Y < this.regionHeight; Y++) {
                    this.terrainHeightLocal.set(X, Y, this.getTerrainHeight(X, Y));
                }
            }
        }

        this.parentModel.clear();
        let k1 = 0x606060;

        for (let i2 = 0; i2 < 95; i2++) {
            for (let k2 = 0; k2 < 95; k2++) {
                let k3 = this.getWallEastWest(i2, k2);

                if (k3 > 0 && (GameData.wallObjectInvisible[k3 - 1] === 0 || this.aBoolean592)) {
                    this.method422(this.parentModel, k3 - 1, i2, k2, i2 + 1, k2);

                    if (flag && GameData.wallObjectAdjacent[k3 - 1] !== 0) {
                        const adjacency = this.objectAdjacency.get(i2, k2);
                        this.objectAdjacency.set(i2, k2, adjacency | 1);

                        if (k2 > 0) {
                            this._setObjectAdjacency_from3(i2, k2 - 1, 4);
                        }
                    }

                    if (flag) {
                        this.surface.drawLineHoriz(i2 * 3, k2 * 3, 3, k1);
                    }
                }

                k3 = this.getWallNorthSouth(i2, k2);

                if (k3 > 0 && (GameData.wallObjectInvisible[k3 - 1] === 0 || this.aBoolean592)) {
                    this.method422(this.parentModel, k3 - 1, i2, k2, i2, k2 + 1);

                    if (flag && GameData.wallObjectAdjacent[k3 - 1] !== 0) {
                        const adjacency = this.objectAdjacency.get(i2, k2);
                        this.objectAdjacency.set(i2, k2, adjacency | 2);

                        if (i2 > 0) {
                            this._setObjectAdjacency_from3(i2 - 1, k2, 8); 
                        }
                    }

                    if (flag) {
                        this.surface.drawLineVert(i2 * 3, k2 * 3, 3, k1);
                    }
                }

                k3 = this.getWallDiagonal(i2, k2);

                if (k3 > 0 && k3 < 12000 && (GameData.wallObjectInvisible[k3 - 1] === 0 || this.aBoolean592)) {
                    this.method422(this.parentModel, k3 - 1, i2, k2, i2 + 1, k2 + 1);

                    if (flag && GameData.wallObjectAdjacent[k3 - 1] !== 0) { 
                        const adjacency = this.objectAdjacency.get(i2, k2);
                        this.objectAdjacency.set(i2, k2, adjacency | 0x20);
                    }

                    if (flag) {
                        this.surface.setPixel(i2 * 3, k2 * 3, k1);
                        this.surface.setPixel(i2 * 3 + 1, k2 * 3 + 1, k1);
                        this.surface.setPixel(i2 * 3 + 2, k2 * 3 + 2, k1);
                    }
                }

                if (k3 > 12000 && k3 < 24000 && (GameData.wallObjectInvisible[k3 - 12001] === 0 || this.aBoolean592)) {
                    this.method422(this.parentModel, k3 - 12001, i2 + 1, k2, i2, k2 + 1);

                    if (flag && GameData.wallObjectAdjacent[k3 - 12001] !== 0) {
                        const adjacency = this.objectAdjacency.get(i2, k2);
                        this.objectAdjacency.set(i2, k2, adjacency | 0x10);
                    }

                    if (flag) {
                        this.surface.setPixel(i2 * 3 + 2, k2 * 3, k1);
                        this.surface.setPixel(i2 * 3 + 1, k2 * 3 + 1, k1);
                        this.surface.setPixel(i2 * 3, k2 * 3 + 2, k1);
                    }
                }
            }
        }

        if (flag) {
            this.surface.drawSpriteMinimap(this.baseMediaSprite - 1, 0, 0, 285, 285);
        }

        this.parentModel._setLight_from6(false, 60, 24, -50, -10, -50);

        this.wallModels[plane] = this.parentModel.split(0, 0, 1536, 1536, 8, 64, 338, true);

        for (let l2 = 0; l2 < 64; l2++) {
            this.scene.addModel(this.wallModels[plane][l2]);
        }

        for (let l3 = 0; l3 < 95; l3++) {
            for (let l4 = 0; l4 < 95; l4++) {
                let k6 = this.getWallEastWest(l3, l4);

                if (k6 > 0) {
                    this.method428(k6 - 1, l3, l4, l3 + 1, l4);
                }

                k6 = this.getWallNorthSouth(l3, l4);

                if (k6 > 0) {
                    this.method428(k6 - 1, l3, l4, l3, l4 + 1);
                }

                k6 = this.getWallDiagonal(l3, l4);

                if (k6 > 0 && k6 < 12000) {
                    this.method428(k6 - 1, l3, l4, l3 + 1, l4 + 1);
                }

                if (k6 > 12000 && k6 < 24000) {
                    this.method428(k6 - 12001, l3 + 1, l4, l3, l4 + 1);
                }
            }
        }

        for (let i5 = 1; i5 < 95; i5++) {
            for (let l6 = 1; l6 < 95; l6++) {
                let j9 = this.getWallRoof(i5, l6);

                if (j9 > 0) {
                    let l11 = i5;
                    let i14 = l6;
                    let j16 = i5 + 1;
                    let k18 = l6;
                    let j19 = i5 + 1;
                    let j21 = l6 + 1;
                    let l22 = i5;
                    let j23 = l6 + 1;
                    let l23 = 0;
                    let j24 = this.terrainHeightLocal.get(l11, i14);
                    let l24 = this.terrainHeightLocal.get(j16, k18);
                    let j25 = this.terrainHeightLocal.get(j19, j21);
                    let l25 = this.terrainHeightLocal.get(l22, j23);

                    if (j24 > 0x13880) {
                        j24 -= 0x13880;
                    }

                    if (l24 > 0x13880) {
                        l24 -= 0x13880;
                    }

                    if (j25 > 0x13880) {
                        j25 -= 0x13880;
                    }

                    if (l25 > 0x13880) {
                        l25 -= 0x13880;
                    }

                    if (j24 > l23) {
                        l23 = j24;
                    }

                    if (l24 > l23) {
                        l23 = l24;
                    }

                    if (j25 > l23) {
                        l23 = j25;
                    }

                    if (l25 > l23) {
                        l23 = l25;
                    }

                    if (l23 >= 0x13880) {
                        l23 -= 0x13880;
                    }

                    if (j24 < 0x13880) {
                        this.terrainHeightLocal.set(l11, i14, l23);
                    } else {
                        const height = this.terrainHeightLocal.get(l11, i14);
                        this.terrainHeightLocal.set(l11, i14, height - 0x13880);
                    }

                    if (l24 < 0x13880) {
                        this.terrainHeightLocal.set(j16, k18, l23);
                    } else {
                        const height = this.terrainHeightLocal.get(j16, k18);
                        this.terrainHeightLocal.set(j16, k18, height - 0x13880);
                    }

                    if (j25 < 0x13880) {
                        this.terrainHeightLocal.set(j19, j21, l23);
                    } else {
                        const height = this.terrainHeightLocal.get(j19, j21);
                        this.terrainHeightLocal.set(j19, j21, height - 0x13880);
                    }

                    if (l25 < 0x13880) {
                        this.terrainHeightLocal.set(l22, j23, l23);
                    } else {
                        const height = this.terrainHeightLocal.get(l22, j23);
                        this.terrainHeightLocal.set(l22, j23, height - 0x13880);
                    }
                }
            }
        }

        this.parentModel.clear();

        for (let i7 = 1; i7 < 95; i7++) {
            for (let k9 = 1; k9 < 95; k9++) {
                let roofNvs = this.getWallRoof(i7, k9);

                if (roofNvs > 0) {
                    let j14 = i7;
                    let k16 = k9;
                    let l18 = i7 + 1;
                    let k19 = k9;
                    let k21 = i7 + 1;
                    let i23 = k9 + 1;
                    let k23 = i7;
                    let i24 = k9 + 1;
                    let k24 = i7 * this.anInt585;
                    let i25 = k9 * this.anInt585;
                    let k25 = k24 + this.anInt585;
                    let i26 = i25 + this.anInt585;
                    let j26 = k24;
                    let k26 = i25;
                    let l26 = k25;
                    let i27 = i26;
                    let j27 = this.terrainHeightLocal.get(j14, k16);
                    let k27 = this.terrainHeightLocal.get(l18, k19);
                    let l27 = this.terrainHeightLocal.get(k21, i23);
                    let i28 = this.terrainHeightLocal.get(k23, i24);
                    let unknown = GameData.roofHeight[roofNvs - 1];

                    if (this.hasRoof(j14, k16) && j27 < 0x13880) {
                        j27 += unknown + 0x13880;
                        this.terrainHeightLocal.set(j14, k16, j27);
                    }

                    if (this.hasRoof(l18, k19) && k27 < 0x13880) {
                        k27 += unknown + 0x13880;
                        this.terrainHeightLocal.set(l18, k19, k27);
                    }

                    if (this.hasRoof(k21, i23) && l27 < 0x13880) {
                        l27 += unknown + 0x13880;
                        this.terrainHeightLocal.set(k21, i23, l27);
                    }

                    if (this.hasRoof(k23, i24) && i28 < 0x13880) {
                        i28 += unknown + 0x13880;
                        this.terrainHeightLocal.set(k23, i24, i28);
                    }

                    if (j27 >= 0x13880) {
                        j27 -= 0x13880;
                    }

                    if (k27 >= 0x13880) {
                        k27 -= 0x13880;
                    }

                    if (l27 >= 0x13880) {
                        l27 -= 0x13880;
                    }

                    if (i28 >= 0x13880) {
                        i28 -= 0x13880;
                    }

                    let byte0 = 16;

                    if (!this.method427(j14 - 1, k16)) {
                        k24 -= byte0;
                    }

                    if (!this.method427(j14 + 1, k16)) {
                        k24 += byte0;
                    }

                    if (!this.method427(j14, k16 - 1)) {
                        i25 -= byte0;
                    }

                    if (!this.method427(j14, k16 + 1)) {
                        i25 += byte0;
                    }

                    if (!this.method427(l18 - 1, k19)) {
                        k25 -= byte0;
                    }

                    if (!this.method427(l18 + 1, k19)) {
                        k25 += byte0;
                    }

                    if (!this.method427(l18, k19 - 1)) {
                        k26 -= byte0;
                    }

                    if (!this.method427(l18, k19 + 1)) {
                        k26 += byte0;
                    }

                    if (!this.method427(k21 - 1, i23)) {
                        l26 -= byte0;
                    }

                    if (!this.method427(k21 + 1, i23)) {
                        l26 += byte0;
                    }

                    if (!this.method427(k21, i23 - 1)) {
                        i26 -= byte0;
                    }

                    if (!this.method427(k21, i23 + 1)) {
                        i26 += byte0;
                    }

                    if (!this.method427(k23 - 1, i24)) {
                        j26 -= byte0;
                    }

                    if (!this.method427(k23 + 1, i24)) {
                        j26 += byte0;
                    }

                    if (!this.method427(k23, i24 - 1)) {
                        i27 -= byte0;
                    }

                    if (!this.method427(k23, i24 + 1)) {
                        i27 += byte0;
                    }

                    roofNvs = GameData.roofNumVertices[roofNvs - 1];
                    j27 = -j27;
                    k27 = -k27;
                    l27 = -l27;
                    i28 = -i28;

                    if (this.getWallDiagonal(i7, k9) > 12000 && this.getWallDiagonal(i7, k9) < 24000 && this.getWallRoof(i7 - 1, k9 - 1) === 0) {
                        let ai8 = new Int32Array(3);
                        ai8[0] = this.parentModel.vertexAt(l26, l27, i26);
                        ai8[1] = this.parentModel.vertexAt(j26, i28, i27);
                        ai8[2] = this.parentModel.vertexAt(k25, k27, k26);

                        this.parentModel.createFace(3, ai8, roofNvs, World.colourTransparent);
                    } else if (this.getWallDiagonal(i7, k9) > 12000 && this.getWallDiagonal(i7, k9) < 24000 && this.getWallRoof(i7 + 1, k9 + 1) === 0) {
                        let ai9 = new Int32Array(3);
                        ai9[0] = this.parentModel.vertexAt(k24, j27, i25);
                        ai9[1] = this.parentModel.vertexAt(k25, k27, k26);
                        ai9[2] = this.parentModel.vertexAt(j26, i28, i27);

                        this.parentModel.createFace(3, ai9, roofNvs, World.colourTransparent);
                    } else if (this.getWallDiagonal(i7, k9) > 0 && this.getWallDiagonal(i7, k9) < 12000 && this.getWallRoof(i7 + 1, k9 - 1) === 0) {
                        let ai10 = new Int32Array(3);
                        ai10[0] = this.parentModel.vertexAt(j26, i28, i27);
                        ai10[1] = this.parentModel.vertexAt(k24, j27, i25);
                        ai10[2] = this.parentModel.vertexAt(l26, l27, i26);

                        this.parentModel.createFace(3, ai10, roofNvs, World.colourTransparent);
                    } else if (this.getWallDiagonal(i7, k9) > 0 && this.getWallDiagonal(i7, k9) < 12000 && this.getWallRoof(i7 - 1, k9 + 1) === 0) {
                        let ai11 = new Int32Array(3);
                        ai11[0] = this.parentModel.vertexAt(k25, k27, k26);
                        ai11[1] = this.parentModel.vertexAt(l26, l27, i26);
                        ai11[2] = this.parentModel.vertexAt(k24, j27, i25);

                        this.parentModel.createFace(3, ai11, roofNvs, World.colourTransparent);
                    } else if (j27 === k27 && l27 === i28) {
                        let ai12 = new Int32Array(4);
                        ai12[0] = this.parentModel.vertexAt(k24, j27, i25);
                        ai12[1] = this.parentModel.vertexAt(k25, k27, k26);
                        ai12[2] = this.parentModel.vertexAt(l26, l27, i26);
                        ai12[3] = this.parentModel.vertexAt(j26, i28, i27);

                        this.parentModel.createFace(4, ai12, roofNvs, World.colourTransparent);
                    } else if (j27 === i28 && k27 === l27) {
                        let ai13 = new Int32Array(4);
                        ai13[0] = this.parentModel.vertexAt(j26, i28, i27);
                        ai13[1] = this.parentModel.vertexAt(k24, j27, i25);
                        ai13[2] = this.parentModel.vertexAt(k25, k27, k26);
                        ai13[3] = this.parentModel.vertexAt(l26, l27, i26);

                        this.parentModel.createFace(4, ai13, roofNvs, World.colourTransparent);
                    } else {
                        let flag1 = true;

                        if (this.getWallRoof(i7 - 1, k9 - 1) > 0) {
                            flag1 = false;
                        }

                        if (this.getWallRoof(i7 + 1, k9 + 1) > 0) {
                            flag1 = false;
                        }

                        if (!flag1) {
                            let ai14 = new Int32Array(3);
                            ai14[0] = this.parentModel.vertexAt(k25, k27, k26);
                            ai14[1] = this.parentModel.vertexAt(l26, l27, i26);
                            ai14[2] = this.parentModel.vertexAt(k24, j27, i25);

                            this.parentModel.createFace(3, ai14, roofNvs, World.colourTransparent);

                            let ai16 = new Int32Array(3);
                            ai16[0] = this.parentModel.vertexAt(j26, i28, i27);
                            ai16[1] = this.parentModel.vertexAt(k24, j27, i25);
                            ai16[2] = this.parentModel.vertexAt(l26, l27, i26);

                            this.parentModel.createFace(3, ai16, roofNvs, World.colourTransparent);
                        } else {
                            let ai15 = new Int32Array(3);
                            ai15[0] = this.parentModel.vertexAt(k24, j27, i25);
                            ai15[1] = this.parentModel.vertexAt(k25, k27, k26);
                            ai15[2] = this.parentModel.vertexAt(j26, i28, i27);

                            this.parentModel.createFace(3, ai15, roofNvs, World.colourTransparent);

                            let ai17 = new Int32Array(3);
                            ai17[0] = this.parentModel.vertexAt(l26, l27, i26);
                            ai17[1] = this.parentModel.vertexAt(j26, i28, i27);
                            ai17[2] = this.parentModel.vertexAt(k25, k27, k26);

                            this.parentModel.createFace(3, ai17, roofNvs, World.colourTransparent);
                        }
                    }
                }
            }
        }

        this.parentModel._setLight_from6(true, 50, 50, -50, -10, -50);
        this.roofModels[plane] = this.parentModel.split(0, 0, 1536, 1536, 8, 64, 169, true);

        for (let l9 = 0; l9 < 64; l9++) {
            this.scene.addModel(this.roofModels[plane][l9]);
        }

        if (this.roofModels[plane][0] === null) {
            throw new EvalError('null roof!');
        }

        for (let j12 = 0; j12 < this.regionWidth; j12++) {
            for (let k14 = 0; k14 < this.regionHeight; k14++) {
                if (this.terrainHeightLocal.get(j12, k14) >= 0x13880) {
                    const height = this.terrainHeightLocal.get(j12, k14);
                    this.terrainHeightLocal.set(j12, k14, height - 0x13880);
                }
            }
        }
    }

    _setObjectAdjacency_from3(i, j, k) {
        const adjacency = this.objectAdjacency.get(i, j);
        this.objectAdjacency.set(i, j, adjacency | k);
    }

    getTileType(i, j, k) {
        let l = this.getTileDecoration(i, j, k);

        if (l === 0) {
            return -1;
        }

        let i1 = GameData.tileType[l - 1];

        return i1 !== 2 ? 0 : 1;
    }

    addModels(models) {
        for (let i = 0; i < 94; i++) {
            for (let j = 0; j < 94; j++) {
                if (this.getWallDiagonal(i, j) > 48000 && this.getWallDiagonal(i, j) < 60000) {
                    let k = this.getWallDiagonal(i, j) - 48001;
                    let l = this.getTileDirection(i, j);
                    let i1 = 0;
                    let j1 = 0;

                    if (l === 0 || l === 4) {
                        i1 = GameData.objectWidth[k];
                        j1 = GameData.objectHeight[k];
                    } else {
                        j1 = GameData.objectWidth[k];
                        i1 = GameData.objectHeight[k];
                    }

                    this.removeObject2(i, j, k);

                    let gameModel = models[GameData.objectModelIndex[k]].copy(false, true, false, false);
                    let k1 = (((i + i + i1) * this.anInt585) / 2) | 0;
                    let i2 = (((j + j + j1) * this.anInt585) / 2) | 0;
                    gameModel.translate(k1, -this.getElevation(k1, i2), i2);
                    gameModel.orient(0, this.getTileDirection(i, j) * 32, 0);
                    this.scene.addModel(gameModel);
                    gameModel._setLight_from5(48, 48, -50, -10, -50);

                    if (i1 > 1 || j1 > 1) {
                        for (let k2 = i; k2 < i + i1; k2++) {
                            for (let l2 = j; l2 < j + j1; l2++) {
                                if ((k2 > i || l2 > j) && this.getWallDiagonal(k2, l2) - 48001 === k) {
                                    let l1 = k2;
                                    let j2 = l2;
                                    let byte0 = 0;

                                    if (l1 >= 48 && j2 < 48) {
                                        byte0 = 1;
                                        l1 -= 48;
                                    } else if (l1 < 48 && j2 >= 48) {
                                        byte0 = 2;
                                        j2 -= 48;
                                    } else if (l1 >= 48 && j2 >= 48) {
                                        byte0 = 3;
                                        l1 -= 48;
                                        j2 -= 48;
                                    }

                                    this.wallsDiagonal.set(byte0, l1 * 48 + j2,  0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    method422(gameModel, i, j, k, l, i1) {
        this.method425(j, k, 40);
        this.method425(l, i1, 40);

        let h = GameData.wallObjectHeight[i];
        let front = GameData.wallObjectTextureFront[i];
        let back = GameData.wallObjectTextureBack[i];
        let i2 = j * this.anInt585;
        let j2 = k * this.anInt585;
        let k2 = l * this.anInt585;
        let l2 = i1 * this.anInt585;
        let i3 = gameModel.vertexAt(i2, -this.terrainHeightLocal.get(j, k), j2);
        let j3 = gameModel.vertexAt(i2, -this.terrainHeightLocal.get(j, k) - h, j2);
        let k3 = gameModel.vertexAt(k2, -this.terrainHeightLocal.get(l, i1) - h, l2);
        let l3 = gameModel.vertexAt(k2, -this.terrainHeightLocal.get(l, i1), l2);
        let ai = new Int32Array([i3, j3, k3, l3]);
        let i4 = gameModel.createFace(4, ai, front, back);

        if (GameData.wallObjectInvisible[i] === 5) {
            gameModel.faceTag[i4] = 30000 + i;
            return;
        } else {
            gameModel.faceTag[i4] = 0;
            return;
        }
    }

    getTerrainHeight(x, y) {
        if (x < 0 || x >= this.regionWidth || y < 0 || y >= this.regionHeight) {
            return 0;
        }

        let d = 0;

        if (x >= 48 && y < 48) {
            d = 1;
            x -= 48;
        } else if (x < 48 && y >= 48) {
            d = 2;
            y -= 48;
        } else if (x >= 48 && y >= 48) {
            d = 3;
            x -= 48;
            y -= 48;
        }

        return (this.terrainHeight.get(d, x * 48 + y) & 0xff) * 3;
    }

    _loadSection_from3(x, y, plane) {
        this.reset();

        let l = ((x + 24) / 48) | 0;
        let i1 = ((y + 24) / 48) | 0;

        this._loadSection_from4(x, y, plane, true);

        if (plane === 0) {
            this._loadSection_from4(x, y, 1, false);
            this._loadSection_from4(x, y, 2, false);
            this._loadSection_from4I(l - 1, i1 - 1, plane, 0);
            this._loadSection_from4I(l, i1 - 1, plane, 1);
            this._loadSection_from4I(l - 1, i1, plane, 2);
            this._loadSection_from4I(l, i1, plane, 3);
            this.setTiles();
        }
    }

    method425(i, j, k) {
        let l = (i / 12) | 0;
        let i1 = (j / 12) | 0;
        let j1 = ((i - 1) / 12) | 0;
        let k1 = ((j - 1) / 12) | 0;

        this.setTerrainAmbience(l, i1, i, j, k);

        if (l !== j1) {
            this.setTerrainAmbience(j1, i1, i, j, k);
        }

        if (i1 !== k1) {
            this.setTerrainAmbience(l, k1, i, j, k);
        }

        if (l !== j1 && i1 !== k1) {
            this.setTerrainAmbience(j1, k1, i, j, k);
        }
    }

    removeObject(x, y, id) {
        if (x < 0 || y < 0 || x >= 95 || y >= 95) {
            return;
        }

        if (GameData.objectType[id] === 1 || GameData.objectType[id] === 2) {
            let l = this.getTileDirection(x, y);
            let i1 = 0;
            let j1 = 0;

            if (l === 0 || l === 4) {
                i1 = GameData.objectWidth[id];
                j1 = GameData.objectHeight[id];
            } else {
                j1 = GameData.objectWidth[id];
                i1 = GameData.objectHeight[id];
            }

            for (let k1 = x; k1 < x + i1; k1++) {
                for (let l1 = y; l1 < y + j1; l1++) {
                    const adjacency = this.objectAdjacency.get(k1, l1);

                    if (GameData.objectType[id] === 1) {
                        this.objectAdjacency.set(k1, l1, adjacency & 0xffbf);
                    } else if (l === 0) {
                        this.objectAdjacency.set(k1, l1, adjacency & 0xfffd);

                        if (k1 > 0) {
                            this.method407(k1 - 1, l1, 8);
                        }
                    } else if (l === 2) {
                        this.objectAdjacency.set(k1, l1, adjacency & 0xfffb);

                        if (l1 < 95) {
                            this.method407(k1, l1 + 1, 1);
                        }
                    } else if (l === 4) {
                        this.objectAdjacency.set(k1, l1, adjacency & 0xfff7);

                        if (k1 < 95) {
                            this.method407(k1 + 1, l1, 2);
                        }
                    } else if (l === 6) {
                        this.objectAdjacency.set(k1, l1, adjacency & 0xfffe);

                        if (l1 > 0) {
                            this.method407(k1, l1 - 1, 4);
                        }
                    }
                }
            }

            this.method404(x, y, i1, j1);
        }
    }

    method427(i, j) {
        return this.getWallRoof(i, j) > 0 || this.getWallRoof(i - 1, j) > 0 || this.getWallRoof(i - 1, j - 1) > 0 || this.getWallRoof(i, j - 1) > 0;
    }

    method428(i, j, k, l, i1) {
        let j1 = GameData.wallObjectHeight[i];

        const height = this.terrainHeightLocal.get(j, k);

        if (height < 0x13880) {
            this.terrainHeightLocal.set(j, k, height + 0x13880 + j1);
        }

        const height2 = this.terrainHeightLocal.get(l, i1);

        if (height2 < 0x13880) {
            this.terrainHeightLocal.set(l, i1, height2 + 0x13880 + j1);
        }
    }
}

World.colourTransparent = 12345678;

module.exports = World;
},{"./game-data":14,"./game-model":15,"./scene":32,"./utility":36,"ndarray":6}]},{},[1]);
