import { ExpressionProduct } from '../../algebra/index.js';
import { numberToFraction } from '../../core/index.js';

/** @typedef {import ('../../core/index.js').Fraction} Fraction */
/** @typedef {import ('../../core/index.js').Polynomial} Polynomial */

/**
 * @overload
 * @param {[Polynomial, number|Fraction]|Polynomial} t1
 * @param {[Polynomial, number|Fraction]|Polynomial} t2
 * @param {{quotientMode?: boolean, polyReturn: true}} [options]
 * @returns {Polynomial}
 */
/**
 * @overload
 * @param {[Polynomial, number|Fraction]|Polynomial} t1
 * @param {[Polynomial, number|Fraction]|Polynomial} t2
 * @param {{quotientMode?: boolean}} [options]
 * @returns {ExpressionProduct}
 */
/**
 * @param {[Polynomial, number|Fraction]|Polynomial} t1
 * @param {[Polynomial, number|Fraction]|Polynomial} t2
 * @param {{quotientMode?: boolean, polyReturn?: true}} [options]
 * @returns {ExpressionProduct|Polynomial}
 */
export function productRulePoly(t1, t2, options) {
	// f(x) = (p1)^n1 (p2)^n2
	// f'(x) = (p1)^{n1-1} (p2)^{n2-1} ( n1 p1' p2 + n2 p2' p1 )
	/** @type {Polynomial} */
	let p1;
	/** @type {Polynomial} */
	let p2;
	/** @type {number|Fraction} */
	let n1 = 1;
	/** @type {number|Fraction} */
	let n2 = 1;
	if (Array.isArray(t1)) {
		[p1, n1] = t1;
	} else {
		p1 = t1;
	}
	if (Array.isArray(t2)) {
		[p2, n2] = t2;
	} else {
		p2 = t2;
	}
	const lastTerm1 = p1.differentiate().times(p2).times(n1);
	const lastTerm2 = p2.differentiate().times(p1).times(n2);
	if (options?.polyReturn) {
		const lastTerm = options?.quotientMode
			? lastTerm1.minus(lastTerm2)
			: lastTerm1.plus(lastTerm2);
		n1 = numberToFraction(n1);
		n2 = numberToFraction(n2);
		return p1
			.pow(n1.minus(1))
			.times(p2.pow(n2.minus(1)))
			.times(lastTerm);
	}
	return new ExpressionProduct(
		[p1, numberToFraction(n1).minus(1)],
		[p2, numberToFraction(n2).minus(1)],
		options?.quotientMode
			? lastTerm1.minus(lastTerm2)
			: lastTerm1.plus(lastTerm2)
	);
}
