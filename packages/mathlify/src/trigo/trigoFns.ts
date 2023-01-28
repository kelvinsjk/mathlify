import { Fraction, SquareRoot } from '../core';
import { Angle } from './angleClass';

export function cos(theta: Angle | number | Fraction): SquareRoot {
	if (typeof theta === 'number' || theta instanceof Fraction) {
		theta = new Angle(theta);
	}
	theta = new Angle(theta.k); // change to -pi to pi domain
	if (theta.k.den === 1) {
		if (theta.k.num === 0) {
			return new SquareRoot(1);
		} else if (theta.k.num === 1) {
			return new SquareRoot(1, -1);
		}
	} else if (theta.k.den === 2) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(0);
		}
	} else if (theta.k.den === 3) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(1, new Fraction(1, 2));
		} else if (Math.abs(theta.k.num) === 2) {
			return new SquareRoot(1, new Fraction(-1, 2));
		}
	} else if (theta.k.den === 4) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(2, new Fraction(1, 2));
		} else if (Math.abs(theta.k.num) === 3) {
			return new SquareRoot(2, new Fraction(-1, 2));
		}
	} else if (theta.k.den === 6) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(3, new Fraction(1, 2));
		} else if (Math.abs(theta.k.num) === 5) {
			return new SquareRoot(3, new Fraction(-1, 2));
		}
	}
	throw new Error(`${theta} cos function only valid for special angles`);
}

export function sin(theta: Angle | number | Fraction): SquareRoot {
	if (typeof theta === 'number' || theta instanceof Fraction) {
		theta = new Angle(theta);
	}
	theta = new Angle(theta.k); // change to -pi to pi domain
	if (theta.k.den === 1) {
		if (theta.k.num === 0) {
			return new SquareRoot(0);
		} else if (theta.k.num === 1) {
			return new SquareRoot(0);
		}
	} else if (theta.k.den === 2) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(1).times(Math.sign(theta.k.num));
		}
	} else if (theta.k.den === 3) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(3, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		} else if (Math.abs(theta.k.num) === 2) {
			return new SquareRoot(3, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		}
	} else if (theta.k.den === 4) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(2, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		} else if (Math.abs(theta.k.num) === 3) {
			return new SquareRoot(2, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		}
	} else if (theta.k.den === 6) {
		if (Math.abs(theta.k.num) === 1) {
			return new SquareRoot(1, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		} else if (Math.abs(theta.k.num) === 5) {
			return new SquareRoot(1, new Fraction(1, 2)).times(Math.sign(theta.k.num));
		}
	}
	throw new Error(`${theta} sin function only valid for special angles`);
}

export function tan(theta: Angle | number | Fraction): SquareRoot {
	return sin(theta).divide(cos(theta));
}
