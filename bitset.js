"use strict";

var BitSet = function() {
	this.words = new Array(1);
	for (var i = 0; i < 2; i++) this.words[i] = 0;
};

/**
 * Sets the value of the bit with the specified index to the specified value.
 * @param bitIndex - the bit index
 * @param value - a value to set
 */
BitSet.prototype.set = function(bitIndex, value) {
	bitIndex |= 0;
	if (this.words.length << 5 <= bitIndex) {
		this.words[bitIndex >>> 5] = 0;
	}
	if (value === undefined || value) {
		this.words[bitIndex >>> 5] |= 1 << bitIndex;
	} else {
		this.words[bitIndex >>> 5] &= ~(1 << bitIndex);
	}
};

BitSet.prototype.clear = function() {
	for (var i = 0, length = this.words.length; i < length; i++) {
		this.words[i] = 0;
	}
};

/**
 * Returns the value of the bit with the specified index.
 * @param bitIndex - the bit index
 * @return the value of the bit with the specified index
 */
BitSet.prototype.get = function(bitIndex) {
	bitIndex |= 0;
	return (this.words[bitIndex >>> 5] & 1 << bitIndex) !== 0;
	// return (this.words[bitIndex >>> 5] >>> bitIndex) & 1;
};

// TODO add intersects method

BitSet.prototype.contains = function(set) {
	// Doesn't matter if set.count is less than this.count as word & undefined === 0
	for (var i = 0, length = this.words.length; i < length; i++) {
		var word = this.words[i];
		if ((word & set.words[i]) !== word) return false;
	}
	return true;
};

/* Returns the amount of set bits.
 * Uses the variable-precision SWAR algorithm.
 */
BitSet.prototype.cardinality = function() {
	var value = 0;
	for (var i = 0, length = this.words.length; i < length; i++) {
		var j = this.words[i];
		j = j - ((j >>> 1) & 0x55555555);
		j = (j & 0x33333333) + ((j >>> 2) & 0x33333333);
		value += (((j + (j >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
	}
	return value;
};
