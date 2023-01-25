import { Rational } from '../algebra';
import { PowerFn } from './classes/classes';

export function rationalToPowerFn(rational: Rational): PowerFn {
	if (rational.num.degree > 0) {
		throw new Error(`only constant numerators supported ${rational}`);
	}
	if (rational.den.degree === 1) {
		// make monic to prepare for integration
		const leadingCoeff = rational.den.coeffs[1].abs();
		rational = new Rational(rational.num.divide(leadingCoeff), rational.den.divide(leadingCoeff));
	}
	return new PowerFn(-1, { fx: rational.den, coeff: rational.num.coeffs[0] });
}
