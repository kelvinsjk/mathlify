import { Fraction } from '../fractionClass';

/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export function numberToFraction(x: number | Fraction): Fraction {
	if (typeof x === 'number') {
		return new Fraction(x);
	} else {
		return new Fraction(x.num, x.den);
	}
}
