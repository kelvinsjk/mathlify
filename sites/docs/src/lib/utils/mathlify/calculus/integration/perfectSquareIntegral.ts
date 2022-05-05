import { SquareRoot, Term, toFraction, type Fraction, Polynomial } from 'mathlify';

export function perfectSquare(poly: Polynomial, coefficient: number | Fraction = 1): string {
	if (poly.degree !== 2 || !poly.coefficients[1].isEqualTo(0)) {
		throw new Error(`${poly} not supported`);
	}
	const coeff = toFraction(coefficient);
	const a2 = poly.coefficients[0];
	const k2 = poly.coefficients[2];
	// 1/(kx^2 + a^2)
	if (a2.isGreaterThan(0) && k2.isGreaterThan(0)) {
		const kSqrtForm = new SquareRoot(k2);
		if (!kSqrtForm.isRational()) {
			throw new Error(`${kSqrtForm} coefficient not supported yet`);
		}
		const k = kSqrtForm.toFraction();
		const a = new SquareRoot(a2);
		const kOverA = k.divide(a.coeff);
		const xNum = new Term(kOverA.num, poly.variableAtom);
		const xDen = new SquareRoot(a.radicand, kOverA.den);
		const xTerm = `${xDen}` === '1' ? xNum : `\\frac{${xNum}}{${xDen}}`;
		const kA = a.times(k);
		const finalCoeff = coeff.divide(kA.coeff);
		const num = finalCoeff.num;
		const den = new SquareRoot(a.radicand, finalCoeff.den);
		const numString = num === 1 ? '' : `${num}`;
		const coeffString = `${den}` === '1' ? `${numString}` : `\\frac{${num}}{${den}}`;
		return `${coeffString}\\tan^{-1} ${xTerm}`;
	}
	// 1 / (a^2 - k^2x^2)
	if (a2.isGreaterThan(0) && k2.isLessThan(0)) {
		const kSqrtForm = new SquareRoot(k2.negative());
		const aSqrtForm = new SquareRoot(a2);
		if (!kSqrtForm.isRational() || !aSqrtForm.isRational()) {
			throw new Error(`k=${kSqrtForm}, a=${aSqrtForm} coefficient not supported yet`);
		}
		const k = kSqrtForm.toFraction();
		const a = aSqrtForm.toFraction();
		//const xMinusA = new Polynomial([k, a.negative()], {variableAtom: poly.variableAtom});
		//const xPlusA = new Polynomial([k, a], {variableAtom: poly.variableAtom});
		const aMinusX = new Polynomial([a, k.negative()], {
			variableAtom: poly.variableAtom,
			ascending: true,
		});
		const aPlusX = new Polynomial([a, k], { variableAtom: poly.variableAtom, ascending: true });
		const finalCoeff = coeff.divide(2).divide(a).divide(k);
		const lnTerm = `\\ln \\left| \\frac{${aPlusX}}{${aMinusX}} \\right|`;
		return `${new Term(finalCoeff, lnTerm)}`;
	}
}

// export const perfectSquareRoot = {
//
// }
