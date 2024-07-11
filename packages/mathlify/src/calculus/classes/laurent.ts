import { Expression, Polynomial, Fraction, Term, numberToFraction, SquareRoot } from '../../core';

/**
 * representation of a series including negative exponents
 *
 * a_{-m} x^{-m} + ... + a0 + a1 x + ... + a_n x^n
 *
 * we store them as `negCoeffs: [a_{-1}, a_{-2}, ..., a_{-m}]`
 * and `a0 + ... + a_n x^n` as poly
 */
export class Laurent extends Expression {
	poly: Polynomial;
	negCoeffs: Fraction[];

	/**
	 * @param negCoeffs [a_{-1}, ... a_{-m}]
	 */
	constructor(poly: Polynomial | (number | Fraction)[], negCoeffs: (number | Fraction)[]) {
		if (Array.isArray(poly)) {
			poly = new Polynomial(poly);
		}
		const x = poly.variable;
		const negCoeffsFrac = negCoeffs.map((x) => numberToFraction(x));
		while (negCoeffsFrac.at(-1)?.isEqualTo(0)) {
			negCoeffsFrac.pop();
		}
		const negativeTerms: Term[] = [];
		negCoeffsFrac.forEach((coeff, i) => {
			const sign = coeff.sign();
			const xPower = i === 0 ? x : `x^{${i + 1}}`;
			const xPowerTerm = new Term(coeff.den, xPower);
			negativeTerms.push(new Term(sign, `\\frac{${coeff.abs().num}}{${xPowerTerm}}`));
		});
		super(...poly.terms, ...negativeTerms);
		this.poly = poly;
		this.negCoeffs = negCoeffsFrac;
	}

	differentiate(): Laurent {
		const newNegCoeffs = this.negCoeffs.map((a, i) => a.times(-i - 1));
		return new Laurent(this.poly.differentiate(), [0, ...newNegCoeffs]);
	}

	multiplyDenom(): Polynomial {
		const powerDen = this.negCoeffs.length;
		const poly = this.poly.times(new Polynomial([1], { degree: powerDen }));
		const poly2 = new Polynomial(this.negCoeffs);
		return poly.plus(poly2);
	}

	subIn(x: number | Fraction): Fraction {
		let result = this.poly.subIn(x);
		const xFrac = numberToFraction(x);
		this.negCoeffs.forEach((a, i) => {
			result = result.plus(a.divide(xFrac.pow(i + 1)));
		});
		return result;
	}
	subInSurd(x: SquareRoot): Expression {
		const surds: SquareRoot[] = [];
		const polyTerms = this.poly.subInSurd(x).terms;
		//this.poly.coeffs.forEach((a, i) => {
		//	surds.push(x.pow(i).times(a));
		//});
		this.negCoeffs.forEach((a, i) => {
			surds.push(new SquareRoot(1, a).divide(x.pow(i + 1)));
		});
		return new Expression(...polyTerms, ...surds);
	}
	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: 'laurent'; args: [Polynomial, Fraction[]] } {
		return {
			type: 'laurent',
			args: [this.poly.clone(), this.negCoeffs.map((x) => x.clone())],
		};
	}
}
