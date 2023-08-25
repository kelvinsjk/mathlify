import {
	RationalTerm,
	castExpression,
	solveLinear,
	solveLinearInequality,
	solveQuadratic,
	discriminant,
} from '../../algebra/index.js';

/** @typedef {import("../../core/index.js").Fraction} Fraction */

/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {RationalTerm} lhs - the left hand side of the inequality
 * @param {RationalTerm|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'} [sign='<'] - the sign of the inequality
 * @returns {string[]} - a collection of intervals representing the solution set
 */
export function solveRationalInequality(lhs, rhs = 0, sign = '<') {
	const rational = lhs.minus(rhs);
	const num = castExpression.toPolynomial(rational.num);
	const den = castExpression.toPolynomial(rational.den.expand());
	const numDegree = num.degree;
	const denDegree = den.degree;
	if (numDegree + denDegree === 1) {
		if (numDegree === 1) {
			if (den.leadingCoefficient().is.negative()) {
				sign = oppositeSign(sign);
			}
			return [solveLinearInequality(num, { sign })];
		}
	} else if (numDegree === 1 && denDegree === 1) {
		let x1 = solveLinear(num);
		let x2 = solveLinear(den);
		if (num.leadingCoefficient().is.negative()) {
			sign = oppositeSign(sign);
		}
		if (den.leadingCoefficient().is.negative()) {
			sign = oppositeSign(sign);
		}
		return twoRoots(x1, x2, sign);
	} else if (
		numDegree + denDegree === 2 &&
		(numDegree === 2 || denDegree === 2)
	) {
		const quadratic = numDegree === 2 ? num : den;
		const constant = numDegree === 2 ? den : num;
		const [x1, x2] = solveQuadratic(quadratic);
		if (constant.leadingCoefficient().is.negative()) {
			sign = oppositeSign(sign);
		}
		return twoRoots(x1, x2, sign);
	} else if (
		numDegree + denDegree === 3 &&
		(numDegree === 2 || denDegree === 2)
	) {
		const quadratic = numDegree === 2 ? num : den;
		const linear = numDegree === 2 ? den : num;
		const disc = discriminant(quadratic);
		if (linear.leadingCoefficient().is.negative()) {
			sign = oppositeSign(sign);
		}
		if (disc.is.negative()) {
			return [solveLinearInequality(linear, { sign })];
		}
		const [x1, x2] = solveQuadratic(quadratic);
		const x3 = solveLinear(linear);
		if (quadratic.leadingCoefficient().is.negative()) {
			sign = oppositeSign(sign);
		}
		return threeRoots(x1, x2, x3, sign);
	} else if (
		numDegree + denDegree === 4 &&
		(numDegree === 2 || denDegree === 2)
	) {
		const disc1 = discriminant(num);
		const disc2 = discriminant(den);
		if (disc1.is.negative() && disc2.is.negative()) {
			throw new Error('no supported solution: no real roots found');
		} else if (disc1.is.negative() || disc2.is.negative()) {
			const quadratic = disc1.is.negative() ? den : num;
			const q2 = disc1.is.negative() ? num : den;
			const [x1, x2] = solveQuadratic(quadratic);
			if (q2.leadingCoefficient().is.negative()) {
				sign = oppositeSign(sign);
			}
			return twoRoots(x1, x2, sign);
		} else {
			const [x1, x2] = solveQuadratic(num);
			const [x3, x4] = solveQuadratic(den);
			if (num.leadingCoefficient().is.negative()) {
				sign = oppositeSign(sign);
			}
			if (den.leadingCoefficient().is.negative()) {
				sign = oppositeSign(sign);
			}
			return fourRoots(x1, x2, x3, x4, sign);
		}
	}
	throw new Error('no supported solution');
}

/**
 * opposite sign
 * @param {'<'|'>'} sign
 * @returns {'>'|'<'}
 */
function oppositeSign(sign) {
	return sign === '<' ? '>' : '<';
}

/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
function twoRoots(x1, x2, sign) {
	if (x1.is.equalTo(x2)) {
		throw new Error('no supported solution: repeated roots found');
	}
	[x1, x2] = [x1, x2].sort((a, b) => a.minus(b).sign());
	if (sign === '<') {
		return [`${x1} < x < ${x2}`];
	} else {
		return [`x < ${x1}`, `x > ${x2}`];
	}
}

/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {Fraction} x3
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
function threeRoots(x1, x2, x3, sign) {
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
function fourRoots(x1, x2, x3, x4, sign) {
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
