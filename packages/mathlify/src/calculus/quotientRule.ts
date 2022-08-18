import { Polynomial } from '../core';

/**
 * quotient rule for f(x)/g(x)
 * @returns {num, den, string} for numerator, denominator and string representation
 */
export function quotientRule(f: Polynomial, g: Polynomial): { num: Polynomial; den: Polynomial; string: string } {
	const num = f.differentiate().times(g).minus(f.times(g.differentiate()));
	const den = g.square();
	const string = `\\frac{${num}}{\\left(${g}\\right)^2}`;
	return { num, den, string };
}
