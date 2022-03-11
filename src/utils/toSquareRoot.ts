import { Fraction } from '../classes/fractionClass';
import { SquareRoot } from '../classes/radicals/rootClasses';

/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export default function toSquareRoot(x: number | Fraction | SquareRoot): SquareRoot {
	if (typeof x === 'number' || x instanceof Fraction) {
		return new SquareRoot(1, x);
	}
	return x.clone();
}
