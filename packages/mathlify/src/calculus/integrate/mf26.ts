import {
	lcm,
	Polynomial,
	Fraction,
	SquareRoot,
	numberToFraction,
	Term,
	numberToSquareRoot,
	Expression,
} from '../../core';
import { completeSquareParams } from '../../polynomialMethods';
import { Angle, atan, asin } from '../../trigo';

/**
 * integrates 1/quadratic or 1/sqrt(quadratic)
 * @param options defaults to `{squareRootMode: false, modulus: true, initial: undefined}`.
 * initial only valid for finding particular solution in DE qns for ln qns
 */
export function mf26(
	quadratic: Polynomial,
	options?: { squareRootMode?: boolean; initial?: number | Fraction; modulus?: boolean; flip?: boolean },
): ArcFunction | LnFunction {
	const { a, completedSquare, c } = completeSquareParams(quadratic);
	const { squareRootMode, initial, modulus, flip } = {
		squareRootMode: false,
		modulus: true,
		flip: false,
		...options,
	};
	if (squareRootMode) {
		return arcsin(completedSquare, c, { coeff: a });
	}
	if (a.isGreaterThan(0) && c.isGreaterThan(0)) {
		return arctan(completedSquare, c, { coeff: a });
	} else if (a.times(c).isLessThan(0)) {
		return ln(completedSquare, c, { coeff: a, initial, modulus, flip });
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
		const x0Coeff = x.coeffs[0];
		const multiple = lcm(a.coeff.den, x0Coeff.den);
		const aWithoutDen = a.times(multiple);
		const xWithoutDen = x.times(multiple);
		xTerm = `\\frac{${xWithoutDen}}{${aWithoutDen}}`;
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
function ln(
	x: Polynomial,
	a2: number | Fraction,
	options?: { coeff?: number | Fraction; initial?: number | Fraction; modulus?: boolean; flip?: boolean },
): LnFunction {
	let { coeff, initial, modulus, flip } = {
		coeff: 1,
		modulus: true,
		flip: false,
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
			const x0Coeff = x.coeffs[0];
			const multiple = lcm(a.coeff.den, x0Coeff.den);
			const aWithoutDen = a.times(multiple);
			const xWithoutDen = x.times(multiple);
			let xNum: Expression, xDen: Expression;
			if (initial) {
				if (!a.isRational()) {
					throw new Error(`sub in only implemented for rational a in 1/(x^2 + a^2)`);
				}
				const aCoeff = a.coeff;
				const integrationConstant = positiveCoeff
					? x.subIn(initial).minus(aCoeff).divide(x.subIn(initial).plus(aCoeff))
					: aCoeff.plus(x.subIn(initial)).divide(aCoeff.minus(x.subIn(initial)));
				xNum = positiveCoeff
					? new Expression(...xWithoutDen.terms, aWithoutDen.negative()).times(integrationConstant.den)
					: new Expression(aWithoutDen, ...xWithoutDen.terms).times(integrationConstant.den);
				xDen = positiveCoeff
					? new Expression(...xWithoutDen.terms, aWithoutDen).times(integrationConstant.num)
					: new Expression(aWithoutDen, ...xWithoutDen.negative().terms).times(integrationConstant.num);
			} else {
				xNum = positiveCoeff
					? new Expression(...xWithoutDen.terms, aWithoutDen.negative())
					: new Expression(aWithoutDen, ...xWithoutDen.terms);
				xDen = positiveCoeff
					? new Expression(...xWithoutDen.terms, aWithoutDen)
					: new Expression(aWithoutDen, ...xWithoutDen.negative().terms);
			}
			const open = modulus ? `|` : `(`;
			const close = modulus ? `|` : `)`;
			if (flip) {
				[xNum, xDen] = [xDen, xNum];
			}
			const term = new Term(
				a.reciprocal().divide(2).divide(coeff),
				`\\ln \\left${open} \\frac{${xNum}}{${xDen}} \\right${close}`,
			);
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
		subInSurdCase(x: number | Fraction): string {
			const x0Coeff = poly.coeffs[0];
			const multiple = lcm(a.coeff.den, x0Coeff.den);
			const x1 = poly.times(multiple).subIn(x);
			const xWithoutDen = x1.times(x1.den);
			const aWithoutDen = a.times(multiple).times(x1.den);
			let xNum = positiveCoeff
				? new Expression(xWithoutDen, aWithoutDen.negative())
				: new Expression(aWithoutDen, xWithoutDen);
			let xDen = positiveCoeff
				? new Expression(xWithoutDen, aWithoutDen)
				: new Expression(aWithoutDen, xWithoutDen.negative());
			const open = modulus ? `|` : `(`;
			const close = modulus ? `|` : `)`;
			if (flip) {
				[xNum, xDen] = [xDen, xNum];
			}
			const term = new Term(
				a.reciprocal().divide(2).divide(coeff),
				`\\ln \\left${open} \\frac{${xNum}}{${xDen}} \\right${close}`,
			);
			return `${term}`;
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
		const x0Coeff = x.coeffs[0];
		const multiple = lcm(a.coeff.den, x0Coeff.den);
		const aWithoutDen = a.times(multiple);
		const xWithoutDen = x.times(multiple);
		xTerm = `\\frac{${xWithoutDen}}{${aWithoutDen}}`;
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
	subInSurdCase(x: number | Fraction): string;
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
