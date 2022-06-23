import { Fraction } from '../../core';
import { GP } from '../gpClass';

/**
 * solve for sN > k (or less than by configuring options)
 * @param options defaults to `{moreThan: true}`
 */
export function solveGpSN(gp: GP, k: number | Fraction, options?: { moreThan?: boolean }): number {
	if (gp.r.isEqualTo(1)) {
		throw new Error(`constant sequence not currently supported`);
	}
	// k(1-r)/a
	const k1 = Fraction.ONE.minus(gp.r).divide(gp.a).times(k);
	const logTerm = Math.log(Fraction.ONE.minus(k1).valueOf());
	const n = logTerm / Math.log(gp.r.valueOf());
	const { moreThan } = {
		moreThan: true,
		...options,
	};
	if ((moreThan && gp.a.isGreaterThan(0)) || (!moreThan && gp.a.isLessThan(0))) {
		return Math.ceil(n);
	} else {
		return Math.floor(n);
	}
}
