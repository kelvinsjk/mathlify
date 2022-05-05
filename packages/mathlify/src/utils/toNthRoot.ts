import { Fraction } from '../classes/fractionClass';
import { NthRoot } from '../classes/radicals/rootClasses';

/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export default function toNthRoot(n: number, x: number | Fraction | NthRoot): NthRoot {
	if (typeof x === 'number' || x instanceof Fraction) {
		return new NthRoot(n, 1, x);
	}
	return x.clone();
}
