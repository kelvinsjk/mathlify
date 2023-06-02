import { gcd } from './utils/gcd';

/** Fraction class
 * @property {number} num - the numerator (an integer)
 * @property {number} den - the denominator (a positive integer)
 *
 */
export class Fraction {
	/**
	 * Creates a Fraction instance, automatically hoisting any negatives to the
	 * numerator, and simplifying the numerator and denominator such that
	 * gcd(num, den) == 1
	 * @param {number} num - the numerator (an integer)
	 * @param {number} [den=1] - the denominator (a non-zero integer)
	 */
	constructor(num, den = 1) {
		if (!Number.isInteger(num) || !Number.isInteger(den)) {
			throw new Error(
				`Non-integer {num: ${num}, den:${den}} received in Fraction class constructor`
			);
		}
		if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
			throw new Error(
				`Infinity {num: ${num}, den:${den}} received in Fraction class constructor`
			);
		}
		// hoist negative
		if (den < 0) {
			num *= -1;
			den *= -1;
		}
		// gcd
		const divisor = gcd(num, den);
		this.num = num / divisor;
		this.den = den / divisor;
	}
}
