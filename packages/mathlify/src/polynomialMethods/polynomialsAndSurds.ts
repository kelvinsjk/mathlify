import { Polynomial, SquareRoot, Expression, Fraction } from '../core';

export function subSurdInPoly(poly: Polynomial, x: SquareRoot): Expression {
	let surd = new SquareRoot(x.radicand, 0);
	let num = new Fraction(0);
	poly.coeffs.forEach((coeff, i) => {
		const term = x.pow(i).times(coeff);
		if (term.isRational()) {
			num = num.plus(term.coeff);
		} else {
			surd = surd.plus(term);
		}
	});
	return new Expression(surd, num);
}
