export { polynomial } from './polynomials.js';
import {
	Expression,
	Sum,
	Product,
	Quotient,
	Numeral,
	Exponent,
	Brackets,
	Fn,
	to_Expression,
} from '../core/expression/index.js';

/** @typedef {[number|string|Expression, '/', number|string|Expression]} QuotientShorthand */
/** @typedef {['-', number|string|Expression|PowerShorthand]} NegativeShorthand */
/** @typedef {['()', Expression|number|string|QuotientShorthand|NegativeShorthand]} BracketShorthand */
/** @typedef {[Expression|string, number]} PowerShorthand */

/**
 * creates a fraction as an expression.
 * by default, the fraction is simplified.
 * Note: to work arithmetically, we recommend using the `Fraction` constructor rather than this function (which produces an Expression)
 * @param {number} num - numerator
 * @param {number} [den=1] - denominator. defaults to 1
 * @param {{verbatim?: boolean, mixedFractions?: boolean}} [options] - options. verbatim: if true, do not simplify the fraction.
 * @returns {Expression}
 */
export function fraction(num, den = 1, options) {
	const frac = new Numeral([num, den], options);
	const exp = new Expression(frac);
	if (options?.mixedFractions) {
		exp._mixedFractions = true;
	}
	return exp;
}

/**
 * creates a sum as an expression
 * by default, the sum is simplified
 * product shorthand: [a,b] represents the product ab
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} terms
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
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} terms
 * @returns {Expression}
 */
export function sumVerbatim(...terms) {
	/** @type {(Expression)[]} */
	const termsExp = [];
	for (const term of terms) {
		const unpacked_term = unpack_shorthand(term);
		if (Array.isArray(unpacked_term)) {
			termsExp.push(productVerbatim(...unpacked_term));
		} else {
			termsExp.push(to_Expression(unpacked_term));
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
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} factors
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
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} factors
 */
export function productVerbatim(...factors) {
	/** @type {(Expression)[]} */
	const factorsExp = [];
	for (const term of factors) {
		const unpacked_term = unpack_shorthand(term);
		if (Array.isArray(unpacked_term)) {
			factorsExp.push(sumVerbatim(...unpacked_term));
		} else {
			if (unpacked_term instanceof Expression) {
				factorsExp.push(unpacked_term);
			} else {
				factorsExp.push(new Expression(unpacked_term));
			}
		}
	}
	return new Expression(new Product(...factorsExp));
}

/**
 * @param {Expression|string|number|NegativeShorthand|QuotientShorthand|PowerShorthand} exp
 * @returns {Expression} An un-simplified expression wrapped in parentheses
 */
export function brackets(exp) {
	return new Expression(new Fn(new Brackets(to_Expression(unpack_shorthand_single(exp)))));
}

/**
 * creates a quotient as an expression.
 * by default, the quotient is simplified.
 * negative shorthand: ['-', x] represents the negative value -x
 * quotient shorthand: [a, '/', b] represents the quotient a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * power shorthand: [a, n] where n must be a number represents the exponentiation a^n
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} num
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} den
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the quotient.
 * @returns {Expression}
 */
export function quotient(num, den, options) {
	const { verbatim } = {
		verbatim: false,
		...options,
	};
	const numerator = unpack_shorthand_single(num);
	const denominator = unpack_shorthand_single(den);
	const q = new Expression(new Quotient(to_Expression(numerator), to_Expression(denominator)));
	if (!verbatim) q.simplify();
	return q;
}

/**
 * creates a exponent as an expression.
 * by default, the exponent is simplified.
 * negative shorthand: ['-', x] represents the negative value -x
 * quotient shorthand: [a, '/', b] represents the quotient a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * power shorthand: [a, n] where n must be a number represents the exponentiation a^n
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} base
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} power
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the quotient.
 * @returns {Expression}
 */
export function exponent(base, power, options) {
	const { verbatim } = {
		verbatim: false,
		...options,
	};
	const numerator = to_Expression(unpack_shorthand_single(base));
	const denominator = to_Expression(unpack_shorthand_single(power));
	const q = new Expression(new Exponent(numerator, denominator));
	if (!verbatim) q.simplify();
	return q;
}

//! utility functions to unpack shorthand argument notation
/**
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand|(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} exp
 * @returns {Expression|number|string|(Expression|number|string)[]}
 */
function unpack_shorthand(...exp) {
	let e = exp[0];
	if (Array.isArray(e)) {
		if (e.length === 3 && e[1] === '/') {
			// fraction
			return quotient(e[0], e[2]).simplify();
		} else if (e.length === 2 && e[0] === '()') {
			// brackets
			const term = e[1];
			if (Array.isArray(term)) {
				if (term.length === 3) {
					const [num, _, den] = term;
					return brackets(quotient(num, den)).simplify();
				} else {
					throw new Error('unexpected nested brackets');
				}
			} else {
				return brackets(term);
			}
		} else if (e.length === 2 && typeof e[1] === 'number' && (typeof e[0] === 'string' || e[0] instanceof Expression)) {
			// exponent
			const [base, power] = e;
			const exp = new Exponent(to_Expression(base), new Expression(power));
			return new Expression(exp);
		} else if (e.length === 2 && e[0] === '-') {
			// negative
			const [_, term] = e;
			const int = unpack_shorthand_single(term);
			const exp = int instanceof Expression ? int : new Expression(int);
			return new Expression(new Product(-1, exp));
		} else {
			// product/sum array
			/** @type {(Expression|number|string)[]} */
			const termsExp = [];
			for (const term of e) {
				if (Array.isArray(term)) {
					// bracket/quotient/negative shorthand
					if (term.length === 3 && term[1] === '/') {
						// quotient
						const [num, _, den] = term;
						termsExp.push(quotient(num, den).simplify());
					} else if (
						term.length === 2 &&
						term[0] === '()' &&
						(term[1] instanceof Expression || typeof term[1] === 'number' || typeof term[1] === 'string')
					) {
						// brackets
						termsExp.push(brackets(term[1]));
					} else if (
						term.length === 2 &&
						typeof term[1] === 'number' &&
						(typeof term[0] === 'string' || term[0] instanceof Expression)
					) {
						// exponent
						const [base, power] = term;
						const exp = new Exponent(to_Expression(base), new Expression(power));
						termsExp.push(new Expression(exp));
					} else if (term.length === 2 && term[0] === '-') {
						// negative
						const [_, t] = term;
						const int = unpack_shorthand_single(t);
						const exp = int instanceof Expression ? int : new Expression(int);
						termsExp.push(new Expression(new Product(-1, exp)));
					} else {
						throw new Error('unexpected nested arrays');
					}
				} else {
					// regular term
					termsExp.push(term);
				}
			}
			return termsExp;
		}
	} else {
		return e;
	}
}

/**
 *
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} exp
 * @returns {Expression|number|string}
 */
export function unpack_shorthand_single(exp) {
	if (Array.isArray(exp)) {
		if (exp.length === 3 && exp[1] === '/') {
			// quotient
			const [num, _, den] = exp;
			return quotient(num, den).simplify();
		} else if (exp.length === 2 && exp[0] === '()') {
			// brackets
			const term = exp[1];
			if (Array.isArray(term)) {
				if (term.length === 3) {
					const [num, _, den] = term;
					return brackets(quotient(num, den));
				} else {
					throw new Error('unexpected nested brackets');
				}
			} else {
				return brackets(term);
			}
		} else if (
			exp.length === 2 &&
			typeof exp[1] === 'number' &&
			(typeof exp[0] === 'string' || exp[0] instanceof Expression)
		) {
			// exponent
			const [base, power] = exp;
			const exponent = new Exponent(to_Expression(base), new Expression(power));
			return new Expression(exponent);
		} else if (exp.length === 2 && exp[0] === '-') {
			// negative
			const [_, term] = exp;
			const int = unpack_shorthand_single(term);
			const e = int instanceof Expression ? int : new Expression(int);
			return new Expression(new Product(-1, e));
		} else {
			throw new Error('unexpected array');
		}
	} else {
		return exp;
	}
}
