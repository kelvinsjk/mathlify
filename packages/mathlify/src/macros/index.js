import { Expression, Sum, Product, Numeral } from '../core/index.js';

/** @typedef {[number, '/', number]} FractionShorthand */
/** @typedef {['()', Expression|number|string|FractionShorthand]} BracketShorthand */

/**
 * creates a fraction as an expression
 * by default, the fraction is simplified
 * @param {number} num - numerator
 * @param {number} [den=1] - denominator. defaults to 1
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the fraction.
 * @returns {Expression}
 */
export function fraction(num, den = 1, options) {
	const frac = new Numeral([num, den], options);
	return new Expression(frac);
}

/**
 * creates a sum as an expression
 * by default, the sum is simplified
 * product shorthand: [a,b] represents the product ab
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * TODO: exponent shorthand
 * @param {...(Expression|number|string|FractionShorthand|BracketShorthand|(Expression|number|string|FractionShorthand|BracketShorthand)[])} terms
 * @returns {Expression}
 */
export function sum(...terms) {
	const exp = sumVerbatim(...terms);
	exp.simplify();
	return exp;
}

/**
 * creates a sum as an expression that is not simplified
 * product shorthand: [a,b] represents the product ab
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * TODO: exponent shorthand
 * @param {...(Expression|number|string|FractionShorthand|BracketShorthand|(Expression|number|string|FractionShorthand|BracketShorthand)[])} terms
 * @returns {Expression}
 */
export function sumVerbatim(...terms) {
	/** @type {(Expression|number|string)[]} */
	const termsExp = [];
	for (const term of terms) {
		const unpacked_term = unpack_shorthand(term);
		if (Array.isArray(unpacked_term)) {
			termsExp.push(productVerbatim(...unpacked_term));
		} else {
			termsExp.push(unpacked_term);
		}
	}
	return new Expression(new Sum(...termsExp));
}

/**
 * creates a product as an expression
 * by default, the product is simplified
 * sum shorthand: [a,b] represents the sum a+b
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * TODO: exponent shorthand
 * @param {...(Expression|number|string|FractionShorthand|BracketShorthand|(Expression|number|string|FractionShorthand|BracketShorthand)[])} factors
 */
export function product(...factors) {
	const exp = productVerbatim(...factors);
	exp.simplify();
	return exp;
}

/**
 * creates a product as an expression that is not simplified
 * sum shorthand: [a,b] represents the sum a+b
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * TODO: exponent shorthand
 * @param {...(Expression|number|string|FractionShorthand|BracketShorthand|(Expression|number|string|FractionShorthand|BracketShorthand)[])} factors
 */
export function productVerbatim(...factors) {
	/** @type {(Expression|number|string)[]} */
	const factorsExp = [];
	for (const term of factors) {
		const unpacked_term = unpack_shorthand(term);
		if (Array.isArray(unpacked_term)) {
			factorsExp.push(sumVerbatim(...unpacked_term));
		} else {
			factorsExp.push(unpacked_term);
		}
	}
	return new Expression(new Product(...factorsExp));
}

/**
 * @param {...(Expression|number|string|FractionShorthand|BracketShorthand|(Expression|number|string|FractionShorthand|BracketShorthand)[])} exp
 * @returns {Expression|number|string|(Expression|number|string)[]}
 */
function unpack_shorthand(exp) {
	if (Array.isArray(exp)) {
		if (exp.length === 3 && exp[1] === '/' && typeof exp[0] === 'number' && typeof exp[2] === 'number') {
			// fraction
			return fraction(exp[0], exp[2]);
		} else if (exp.length === 2 && exp[0] === '()') {
			// brackets
			const term = exp[1];
			if (Array.isArray(term)) {
				if (term.length === 3) {
					return fraction(term[0], term[2]);
				} else {
					throw new Error('unexpected nested brackets');
				}
			} else {
				return Expression.brackets(term);
			}
		} else {
			// product/sum array
			/** @type {(Expression|number|string)[]} */
			const termsExp = [];
			for (const term of exp) {
				if (Array.isArray(term)) {
					// bracket/fraction shorthand
					if (term.length === 3 && term[1] === '/' && typeof term[0] === 'number' && typeof term[2] === 'number') {
						termsExp.push(fraction(term[0], term[2]));
					} else if (
						term.length === 2 &&
						term[0] === '()' &&
						(term[1] instanceof Expression || typeof term[1] === 'number' || typeof term[1] === 'string')
					) {
						termsExp.push(Expression.brackets(term[1]));
					} else {
						throw new Error('unexpected nested product/sum');
					}
				} else {
					// regular term
					termsExp.push(term);
				}
			}
			return termsExp;
		}
	} else {
		if (exp === undefined) throw new Error('invalid shorthand');
		return exp;
	}
}
