import { Polynomial, Fraction, SquareRoot, numberToFraction, Term, numberToSquareRoot, Expression } from '../../core';
import { completeSquareParams } from '../../polynomialMethods';
import { Angle, atan, asin } from '../../trigo';

/**
 * integrates 1/quadratic or 1/sqrt(quadratic)
 */
export function mf26(quadratic: Polynomial, squareRootMode = false): ArcFunction | LnFunction {
	const { a, completedSquare, c } = completeSquareParams(quadratic);
	if (squareRootMode) {
		return arcsin(completedSquare, c, { coeff: a });
	}
	if (a.isGreaterThan(0) && c.isGreaterThan(0)) {
		return arctan(completedSquare, c, { coeff: a });
	} else if (a.times(c).isLessThan(0)) {
		return ln(completedSquare, c, { coeff: a });
	} else {
		throw new Error(`1/(-x^2 - a^2) not supported at the moment. Consider trying again after factoring out -1.`);
	}
}

/**
 * integrates 1 / ( coeff (x+b)^2 + a2 )
 * @param x represents x+b
 */
function arctan(x: Polynomial, a2: number | Fraction, options?: { coeff?: number | Fraction }): ArcFunction {
	let { coeff } = {
		coeff: 1,
		...options,
	};
	coeff = numberToFraction(coeff);
	a2 = numberToFraction(a2).divide(coeff);
	const a = new SquareRoot(a2);
	let xTerm: string;
	if (a.isEqualTo(1)) {
		xTerm = `${x}`;
	} else {
		const aWithoutDen = a.times(a.coeff.den);
		xTerm = `\\frac{${x.times(a.coeff.den)}}{${aWithoutDen}}`;
	}
	const poly = x;
	return {
		toString(): string {
			const term = new Term(a.reciprocal().divide(coeff), `\\tan^{-1} \\left( ${xTerm} \\right)`);
			return `${term}`;
		},
		subIn(x: number | Fraction | SquareRoot): Angle {
			const b = poly.coeffs[1];
			if (!b.isEqualTo(0)) {
				throw new Error(`sub in only implemented for b \\neq 0 in (x+b)^2`);
			}
			if (!a.isRational) {
				throw new Error(`sub in only implemented for a rational in c(x+b)^2 + a2`);
			}
			return atan(numberToSquareRoot(x).divide(a.coeff)).divide(a.coeff).divide(coeff);
		},
	};
}

/**
 * integrates 1 / ( coeff (x+b)^2 - a2 )
 * @param x represents x+b
 */
function ln(x: Polynomial, a2: number | Fraction, options?: { coeff?: number | Fraction }): LnFunction {
	let { coeff } = {
		coeff: 1,
		...options,
	};
	coeff = numberToFraction(coeff);
	a2 = numberToFraction(a2).divide(coeff);
	const positiveCoeff = coeff.isGreaterThan(0);
	coeff = coeff.abs();
	const a = new SquareRoot(a2.abs());
	const poly = x;
	return {
		toString(): string {
			const xNum = positiveCoeff ? new Expression(...poly.terms, a.negative()) : new Expression(...poly.terms, a);
			const xDen = positiveCoeff ? new Expression(a, ...poly.terms) : new Expression(a, ...poly.negative().terms);
			const term = new Term(a.reciprocal().divide(2).divide(coeff), `\\ln \\left| \\frac{${xNum}}{${xDen}} \\right|`);
			return `${term}`;
		},
		subIn(x: number | Fraction): LnValue {
			if (!a.isRational()) {
				throw new Error(`sub in only implemented for rational a in 1/(x^2 + a^2)`);
			}
			const aFrac = a.coeff;
			const lnCoeff = aFrac.reciprocal().divide(2).divide(coeff);
			return positiveCoeff
				? new LnValue(poly.subIn(x).minus(aFrac).divide(poly.subIn(x).plus(aFrac)), { coeff: lnCoeff })
				: new LnValue(poly.subIn(x).plus(aFrac).divide(poly.subIn(x).negative().plus(aFrac)), { coeff: lnCoeff });
		},
	};
}

/**
 * integrates 1 / sqrt( a2 - coeff (x+b)^2 )
 * @param x represents x+b
 */
function arcsin(x: Polynomial, a2: number | Fraction, options?: { coeff?: number | Fraction }): ArcFunction {
	let { coeff } = {
		coeff: 1,
		...options,
	};
	coeff = numberToFraction(coeff);
	a2 = numberToFraction(a2).divide(coeff);
	const a = new SquareRoot(a2);
	let xTerm: string;
	if (a.isEqualTo(1)) {
		xTerm = `${x}`;
	} else {
		const aWithoutDen = a.times(a.coeff.den);
		xTerm = `\\frac{${x.times(a.coeff.den)}}{${aWithoutDen}}`;
	}
	const poly = x;
	const sinCoeff = new SquareRoot(coeff.reciprocal());
	return {
		toString(): string {
			const term = new Term(sinCoeff, `\\sin^{-1} \\left( ${xTerm} \\right)`);
			return `${term}`;
		},
		subIn(x: number | Fraction | SquareRoot): Angle {
			const b = poly.coeffs[1];
			if (!b.isEqualTo(0)) {
				throw new Error(`sub in only implemented for b \\neq 0 in (x+b)^2`);
			}
			if (!sinCoeff.isRational()) {
				throw new Error(`sub in only implemented for sqrt(c) rational in c(x+b)^2 + a2`);
			}
			return asin(numberToSquareRoot(x).divide(a)).divide(sinCoeff.coeff);
		},
	};
}

interface ArcFunction {
	toString(): string;
	subIn(x: number | Fraction | SquareRoot): Angle;
}
interface LnFunction {
	toString(): string;
	subIn(x: number | Fraction): LnValue;
}

/**
 * a ln x
 */
class LnValue {
	coeff: Fraction;
	x: Fraction;

	constructor(x: number | Fraction, options?: { coeff?: number | Fraction }) {
		const { coeff } = {
			coeff: 1,
			...options,
		};
		x = numberToFraction(x);
		if (x.isAtMost(0)) {
			throw new RangeError(`logarithm argument must be positive: ${x} received`);
		}
		this.coeff = numberToFraction(coeff);
		this.x = x;
	}

	toString(): string {
		if (this.x.isEqualTo(1)) {
			return `0`;
		}
		const term = new Term(this.coeff, `\\ln ${this.x}`);
		return `${term}`;
	}
	valueOf(): number {
		return this.coeff.valueOf() * Math.log(this.x.valueOf());
	}
}
