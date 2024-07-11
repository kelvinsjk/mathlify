import { Fraction, SquareRoot } from '../core';
import { Angle } from './angleClass';

export function asin(x: number | SquareRoot | Fraction): Angle {
	const half = new Fraction(1, 2);
	if (typeof x === 'number') {
		x = new Fraction(x);
	}
	if (x instanceof SquareRoot) {
		if (x.isRational()) {
			x = x.coeff;
		}
	}
	if (x.isEqualTo(0)) {
		return new Angle(0, { domain: 'all' });
	}
	if (x instanceof Fraction) {
		if (x.abs().isEqualTo(half)) {
			return x.isGreaterThan(0) ? new Angle(30, { domain: 'all' }) : new Angle(-30, { domain: 'all' });
		} else if (x.abs().isEqualTo(1)) {
			return x.isGreaterThan(0) ? new Angle(90, { domain: 'all' }) : new Angle(-90, { domain: 'all' });
		}
	} else {
		if (x.abs().isEqualTo(new SquareRoot(2, half))) {
			return x.coeff.isGreaterThan(0) ? new Angle(45, { domain: 'all' }) : new Angle(-45, { domain: 'all' });
		} else if (x.abs().isEqualTo(new SquareRoot(3, half))) {
			return x.coeff.isGreaterThan(0) ? new Angle(60, { domain: 'all' }) : new Angle(-60, { domain: 'all' });
		}
	}
	throw new Error(`${x} asin function only valid for special ratios`);
}
export function acos(x: number | SquareRoot | Fraction): Angle {
	const half = new Fraction(1, 2);
	if (typeof x === 'number') {
		x = new Fraction(x);
	}
	if (x instanceof SquareRoot) {
		if (x.isRational()) {
			x = x.coeff;
		}
	}
	if (x.isEqualTo(0)) {
		return new Angle(90, { domain: 'all' });
	}
	if (x instanceof Fraction) {
		if (x.abs().isEqualTo(half)) {
			return x.isGreaterThan(0) ? new Angle(60, { domain: 'all' }) : new Angle(120, { domain: 'all' });
		} else if (x.abs().isEqualTo(1)) {
			return x.isGreaterThan(0) ? new Angle(0, { domain: 'all' }) : new Angle(180, { domain: 'all' });
		}
	} else {
		if (x.abs().isEqualTo(new SquareRoot(2, half))) {
			return x.coeff.isGreaterThan(0) ? new Angle(45, { domain: 'all' }) : new Angle(135, { domain: 'all' });
		} else if (x.abs().isEqualTo(new SquareRoot(3, half))) {
			return x.coeff.isGreaterThan(0) ? new Angle(30, { domain: 'all' }) : new Angle(150, { domain: 'all' });
		}
	}
	throw new Error(`${x} acos function only valid for special ratios`);
}
export function atan(x: number | SquareRoot | Fraction): Angle {
	const third = new Fraction(1, 3);
	if (typeof x === 'number') {
		x = new Fraction(x);
	}
	if (x instanceof SquareRoot) {
		if (x.isRational()) {
			x = x.coeff;
		}
	}
	if (x.isEqualTo(0)) {
		return new Angle(0, { domain: 'all' });
	}
	if (x instanceof Fraction) {
		if (x.abs().isEqualTo(1)) {
			return x.isGreaterThan(0) ? new Angle(45, { domain: 'all' }) : new Angle(-45, { domain: 'all' });
		}
	} else {
		if (x.abs().isEqualTo(new SquareRoot(3))) {
			return x.coeff.isGreaterThan(0) ? new Angle(60, { domain: 'all' }) : new Angle(-60, { domain: 'all' });
		} else if (x.abs().isEqualTo(new SquareRoot(3, third))) {
			return x.coeff.isGreaterThan(0) ? new Angle(30, { domain: 'all' }) : new Angle(-30, { domain: 'all' });
		}
	}
	throw new Error(`${x} atan function only valid for special ratios`);
}
