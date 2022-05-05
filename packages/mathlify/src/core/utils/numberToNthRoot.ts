import { Fraction } from '../fractionClass';
import { NthRoot } from '../basic/rootClasses';

/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export function numberToNthRoot(n: number, x: number | Fraction | NthRoot): NthRoot {
	if (typeof x === 'number' || x instanceof Fraction) {
		return new NthRoot(n, 1, x);
	}
	return x.clone();
}
