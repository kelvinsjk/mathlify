import { Complex } from '../complexClass';
import { Polynomial } from '../../core';

export function subComplexIntoPoly(z: Complex, poly: Polynomial): Complex {
	return poly.coeffs.reduce((sum, coeff, i) => {
		return sum.plus(z.pow(i).times(coeff));
	}, new Complex(0, 0));
}
