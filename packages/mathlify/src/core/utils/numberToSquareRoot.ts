import { Fraction } from '../fractionClass';
import { SquareRoot } from '../basic/rootClasses';

/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export function numberToSquareRoot(x: number | Fraction | SquareRoot): SquareRoot {
	if (typeof x === 'number' || x instanceof Fraction) {
		return new SquareRoot(1, x);
	}
	return x.clone();
}
