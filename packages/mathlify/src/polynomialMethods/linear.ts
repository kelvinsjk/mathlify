import { Fraction, numberToFraction, Polynomial } from '../core';

/**
 *
 * @param options pt: [x1,y1] point on the line. Use gradient m (priority) if provided, otherwise uses pt2 to form the line
 */
export function linear(options: {
	m?: number | Fraction;
	pt: [number | Fraction, number | Fraction];
	pt2?: [number | Fraction, number | Fraction];
}): Polynomial {
	const { m, pt, pt2 } = options;
	if (m !== undefined) {
		const mFrac = numberToFraction(m);
		const c = mFrac.times(pt[0]).negative().plus(pt[1]); // y = mx + c; c = y-mx
		return new Polynomial([mFrac, c]);
	}
	if (pt2 !== undefined) {
		const x2 = numberToFraction(pt2[0]);
		const y2 = numberToFraction(pt2[1]);
		const [x1, y1] = pt;
		if (x2.isEqualTo(x1)) {
			throw new Error(`x coordinates are the same ${x1}: vertical lines are not supported`);
		}
		const m = x2.minus(x1).reciprocal().times(y2.minus(y1)); // m = (y2-y1)/(x2-x1)
		const c = m.times(x1).negative().plus(y1);
		return new Polynomial([m, c]);
	}
	throw new Error(`either gradient m or second point pt2 must be provided.`);
}
