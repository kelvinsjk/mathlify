/** @typedef {import("../../../core/index.js").Fraction} Fraction */

/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {'<'|'>'|'\\geq'|'\\leq'} sign
 * @param {string} [x] variable
 * @return {string[]}
 */
export function twoRoots(x1, x2, sign, x = 'x') {
	if (x1.is.equalTo(x2)) {
		throw new Error('no supported solution: repeated roots found');
	}
	[x1, x2] = [x1, x2].sort((a, b) => a.minus(b).sign());
	switch (sign) {
		case '<':
			return [`${x1} < ${x} < ${x2}`];
		case '\\leq':
			return [`${x1} \\leq ${x} \\leq ${x2}`];
		case '>':
			return [`${x} < ${x1}`, `${x} > ${x2}`];
		case '\\geq':
			return [`${x} \\leq ${x1}`, `${x} \\geq ${x2}`];
	}
}

/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {Fraction} x3
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
export function threeRoots(x1, x2, x3, sign) {
	if (x1.is.equalTo(x2) || x1.is.equalTo(x3) || x2.is.equalTo(x3)) {
		throw new Error('no supported solution: repeated roots found');
	}
	[x1, x2, x3] = [x1, x2, x3].sort((a, b) => a.minus(b).sign());
	if (sign === '<') {
		return [`x < ${x1}`, `${x2} < x < ${x3}`];
	} else {
		return [`${x1} < x < ${x2}`, `x > ${x3}`];
	}
}

/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {Fraction} x3
 * @param {Fraction} x4
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
export function fourRoots(x1, x2, x3, x4, sign) {
	if (
		x1.is.equalTo(x2) ||
		x1.is.equalTo(x3) ||
		x1.is.equalTo(x4) ||
		x2.is.equalTo(x3) ||
		x2.is.equalTo(x4) ||
		x3.is.equalTo(x4)
	) {
		throw new Error('no supported solution: repeated roots found');
	}
	[x1, x2, x3, x4] = [x1, x2, x3, x4].sort((a, b) => a.minus(b).sign());
	if (sign === '<') {
		return [`${x1} < x < ${x2}`, `${x3} < x < ${x4}`];
	} else {
		return [`x < ${x1}`, `${x2} < x < ${x3}`, `x > ${x4}`];
	}
}
