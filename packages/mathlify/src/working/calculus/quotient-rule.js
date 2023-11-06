import { RationalFn } from '../../calculus/index.js';
import { Polynomial, Fraction } from '../../core/index.js';

/**
 * @overload
 * @param {Polynomial} quotient
 * @param {{den: Polynomial|number|Fraction|[Polynomial, number|Fraction], aligned?: boolean}} options
 * @returns {{y: RationalFn, dydx: RationalFn, num: Polynomial, den: Polynomial, denPow: Fraction, working: string}}
 */
/**
 * @overload
 * @param {RationalFn} quotient
 * @param {{aligned?: boolean}} [options]
 * @returns {{y: RationalFn, dydx: RationalFn, num: Polynomial, den: Polynomial, denPow: Fraction, working: string}}
 */
/**
 * @param {RationalFn|Polynomial} quotient
 * @param {{den?: Polynomial|number|Fraction|[Polynomial, number|Fraction], aligned?: boolean}|undefined} options
 * @returns {{y: RationalFn, dydx: RationalFn, num: Polynomial, den: Polynomial, denPow: Fraction, working: string}}
 */
// TODO: handle if denPow not 1
export function quotientRuleWorking(quotient, options) {
	/** @type {Polynomial} */
	let u;
	/** @type {Polynomial} */
	let v;
	/** @type {Fraction} */
	let denPow;
	if (quotient instanceof RationalFn) {
		u = quotient.numFn;
		v = quotient.denFn;
		denPow = quotient.denPow;
	} else {
		u = quotient;
		quotient = new RationalFn(u, options?.den);
		v = quotient.denFn;
		denPow = quotient.denPow;
	}
	const du = u.differentiate();
	const dv = v.differentiate();
	const num = `\\left( ${du} \\right) \\left( ${v} \\right) - \\left( ${u} \\right) \\left( ${dv} \\right)`;
	const pow =
		`${denPow.times(2)}`.length > 1
			? `{${denPow.times(2)}}`
			: `${denPow.times(2)}`;
	const den = `\\left( ${v} \\right)^${pow}`;
	const eq = options?.aligned ? '&=' : '=';
	return {
		y: quotient,
		dydx: quotient.differentiate(),
		num: du.times(v).minus(u.times(dv)),
		den: v,
		denPow,
		working: `\\frac{${num}}{${den}} \\\\\n${eq} \\frac{${du.times(
			v
		)} - \\left( ${u.times(dv)} \\right)}{${den}}`,
	};
}
