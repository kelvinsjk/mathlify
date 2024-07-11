// integration of f'(x) form
// integration of rationals and squares
// integration of trig (double angle, factor formula)
// integration by parts

import { Expression, Term, Fraction, numberToFraction } from '../../core';
import { Angle, sin, cos } from '../../trigo';

export const trigo = {
	/** integration of cos^2 (kx) */
	cos2: (options?: { k?: number | Fraction; coeff?: number | Fraction; variable?: string }) =>
		doubleAngle(true, options),
	/** integration of sin^2 (kx) */
	sin2: (options?: { k?: number | Fraction; coeff?: number | Fraction; variable?: string }) =>
		doubleAngle(false, options),
	sinSin: (A: number | Fraction, B: number | Fraction, options?: { variable?: string; coeff?: number | Fraction }) =>
		factor('sinSin', A, B, options),
	cosCos: (A: number | Fraction, B: number | Fraction, options?: { variable?: string; coeff?: number | Fraction }) =>
		factor('cosCos', A, B, options),
	sinCos: (A: number | Fraction, B: number | Fraction, options?: { variable?: string; coeff?: number | Fraction }) =>
		factor('sinCos', A, B, options),
	cosSin: (A: number | Fraction, B: number | Fraction, options?: { variable?: string; coeff?: number | Fraction }) =>
		factor('cosSin', A, B, options),
};

export const trigoD = {
	/** definite integral of cos^2 (kx) */
	cos2: (
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { k?: number | Fraction; coeff?: number | Fraction },
	) => doubleAngleD(true, lower, upper, options),
	/** definite integral of sin^2 (kx) */
	sin2: (
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { k?: number | Fraction; coeff?: number | Fraction },
	) => doubleAngleD(false, lower, upper, options),
	sinSin: (
		A: number | Fraction,
		B: number | Fraction,
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { coeff?: number | Fraction },
	) => factorD('sinSin', A, B, lower, upper, options),
	cosCos: (
		A: number | Fraction,
		B: number | Fraction,
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { coeff?: number | Fraction },
	) => factorD('cosCos', A, B, lower, upper, options),
	sinCos: (
		A: number | Fraction,
		B: number | Fraction,
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { coeff?: number | Fraction },
	) => factorD('sinCos', A, B, lower, upper, options),
	cosSin: (
		A: number | Fraction,
		B: number | Fraction,
		lower: number | Fraction | Angle,
		upper: number | Fraction | Angle,
		options?: { coeff?: number | Fraction },
	) => factorD('cosSin', A, B, lower, upper, options),
};

/**
 * integration of coeff cos^2 (kx)
 */
function doubleAngle(
	cos: boolean,
	options?: { k?: number | Fraction; coeff?: number | Fraction; variable?: string },
): Expression {
	let { k, coeff, variable } = {
		k: 1,
		coeff: 1,
		variable: 'x',
		...options,
	};
	k = numberToFraction(k);
	coeff = numberToFraction(coeff);
	const xOver2 = new Term(new Fraction(1, 2), variable).times(coeff);
	const twoKX = new Term(2, k, variable);
	const sineTwoKX = `\\sin ${twoKX}`;
	const sineTerm = new Term(k.reciprocal().divide(4).times(coeff), sineTwoKX);
	// x/2 - 1/4k sin (2kx)
	return new Expression(xOver2, cos ? sineTerm : sineTerm.times(-1));
}

/**
 * definite integration of coeff cos^2 (kx)
 */
function doubleAngleD(
	cos: boolean,
	lower: number | Fraction | Angle,
	upper: number | Fraction | Angle,
	options?: { k?: number | Fraction; coeff?: number | Fraction; variable?: string },
): Expression {
	let { k, coeff, variable } = {
		k: 1,
		coeff: 1,
		variable: 'x',
		...options,
	};
	k = numberToFraction(k);
	coeff = numberToFraction(coeff);
	lower = lower instanceof Angle ? lower : new Angle(lower, { domain: 'all' });
	upper = upper instanceof Angle ? upper : new Angle(upper, { domain: 'all' });
	const xOver2 = upper.minus(lower).divide(2);
	const sineTerm1 = sin(upper.times(2).times(k)).divide(4).divide(k).times(coeff);
	const sineTerm2 = sin(lower.times(2).times(k)).divide(4).divide(k).times(coeff);
	// x/2 - 1/4k sin (2kx)
	return new Expression(xOver2, cos ? sineTerm1 : sineTerm1.times(-1), cos ? sineTerm2.times(-1) : sineTerm2);
}

function factor(
	mode: 'sinSin' | 'cosCos' | 'sinCos' | 'cosSin',
	A: number | Fraction,
	B: number | Fraction,
	options?: {
		variable?: string;
		coeff?: number | Fraction;
	},
): Expression {
	A = numberToFraction(A);
	B = numberToFraction(B);
	const { variable, coeff: coeffNum } = {
		variable: 'x',
		coeff: 1,
		...options,
	};
	const coeff = numberToFraction(coeffNum);
	const P = A.plus(B);
	const Q = A.minus(B);
	const Px = new Term(P, variable);
	const Qx = new Term(Q, variable);
	let firstTerm: Term, secondTerm: Term;
	if (mode === 'sinSin') {
		// sin A sin B = 1/2 ( -cos(A+B) + cos(A-B) )
		// integration gives
		// -sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
		firstTerm = new Term(-1, `\\sin ${Px}`).times(P.reciprocal()).times(new Fraction(1, 2));
		secondTerm = new Term(`\\sin ${Qx}`).times(Q.reciprocal()).times(new Fraction(1, 2));
	} else if (mode === 'cosCos') {
		// cos A cos B = 1/2 ( cos(A+B) + cos(A-B) )
		// integration gives
		// sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
		firstTerm = new Term(`\\sin ${Px}`).times(P.reciprocal()).times(new Fraction(1, 2));
		secondTerm = new Term(`\\sin ${Qx}`).times(Q.reciprocal()).times(new Fraction(1, 2));
	} else if (mode === 'sinCos') {
		// sin A cos B = 1/2 ( sin(A+B) + sin(A-B) )
		// integration gives
		// -cos(A+B)/2(A+B) - cos(A-B)/2(A-B)
		firstTerm = new Term(-1, `\\cos ${Px}`).times(P.reciprocal()).times(new Fraction(1, 2));
		secondTerm = new Term(-1, `\\cos ${Qx}`).times(Q.reciprocal()).times(new Fraction(1, 2));
	} else if (mode === 'cosSin') {
		// cos A sin B = 1/2 ( sin(A+B) - sin(A-B) )
		// integration gives
		// -cos(A+B)/2(A+B) + cos(A-B)/2(A-B)
		firstTerm = new Term(-1, `\\cos ${Px}`).times(P.reciprocal()).times(new Fraction(1, 2));
		secondTerm = new Term(`\\cos ${Qx}`).times(Q.reciprocal()).times(new Fraction(1, 2));
	} else {
		throw new Error(`invalid mode`);
	}
	return new Expression(firstTerm, secondTerm).times(coeff);
}

function factorD(
	mode: 'sinSin' | 'cosCos' | 'sinCos' | 'cosSin',
	A: number | Fraction,
	B: number | Fraction,
	lower: number | Fraction | Angle,
	upper: number | Fraction | Angle,
	options?: {
		coeff?: number | Fraction;
	},
): Expression {
	A = numberToFraction(A);
	B = numberToFraction(B);
	const { coeff: coeffNum } = {
		coeff: 1,
		...options,
	};
	const coeff = numberToFraction(coeffNum);
	const P = A.plus(B);
	const Q = A.minus(B);
	let firstTerm: Term, secondTerm: Term;
	lower = lower instanceof Angle ? lower : new Angle(lower, { domain: 'all' });
	upper = upper instanceof Angle ? upper : new Angle(upper, { domain: 'all' });
	const angle1Upper = upper.times(P);
	const angle1Lower = lower.times(P);
	const angle2Upper = upper.times(Q);
	const angle2Lower = lower.times(Q);
	if (mode === 'sinSin') {
		// sin A sin B = 1/2 ( -cos(A+B) + cos(A-B) )
		// integration gives
		// -sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
		const ratio1Upper = sin(angle1Upper);
		const term1Upper = ratio1Upper.divide(-2).divide(P);
		const ratio1Lower = sin(angle1Lower);
		const term1Lower = ratio1Lower.divide(-2).divide(P);
		const ratio2Upper = sin(angle2Upper);
		const term2Upper = ratio2Upper.divide(2).divide(Q);
		const ratio2Lower = sin(angle2Lower);
		const term2Lower = ratio2Lower.divide(2).divide(Q);
		return new Expression(term1Upper, term2Upper, term1Lower.negative(), term2Lower.negative()).times(coeff);
	} else if (mode === 'cosCos') {
		// cos A cos B = 1/2 ( cos(A+B) + cos(A-B) )
		// integration gives
		// sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
		const ratio1Upper = sin(angle1Upper);
		const term1Upper = ratio1Upper.divide(2).divide(P);
		const ratio1Lower = sin(angle1Lower);
		const term1Lower = ratio1Lower.divide(2).divide(P);
		const ratio2Upper = sin(angle2Upper);
		const term2Upper = ratio2Upper.divide(2).divide(Q);
		const ratio2Lower = sin(angle2Lower);
		const term2Lower = ratio2Lower.divide(2).divide(Q);
		return new Expression(term1Upper, term2Upper, term1Lower.negative(), term2Lower.negative()).times(coeff);
	} else if (mode === 'sinCos') {
		// sin A cos B = 1/2 ( sin(A+B) + sin(A-B) )
		// integration gives
		// -cos(A+B)/2(A+B) - cos(A-B)/2(A-B)
		const ratio1Upper = cos(angle1Upper);
		const term1Upper = ratio1Upper.divide(-2).divide(P);
		const ratio1Lower = cos(angle1Lower);
		const term1Lower = ratio1Lower.divide(-2).divide(P);
		const ratio2Upper = cos(angle2Upper);
		const term2Upper = ratio2Upper.divide(-2).divide(Q);
		const ratio2Lower = cos(angle2Lower);
		const term2Lower = ratio2Lower.divide(-2).divide(Q);
		return new Expression(term1Upper, term2Upper, term1Lower.negative(), term2Lower.negative()).times(coeff);
	} else if (mode === 'cosSin') {
		// cos A sin B = 1/2 ( sin(A+B) - sin(A-B) )
		// integration gives
		// -cos(A+B)/2(A+B) + cos(A-B)/2(A-B)
		const ratio1Upper = cos(angle1Upper);
		const term1Upper = ratio1Upper.divide(-2).divide(P);
		const ratio1Lower = cos(angle1Lower);
		const term1Lower = ratio1Lower.divide(-2).divide(P);
		const ratio2Upper = cos(angle2Upper);
		const term2Upper = ratio2Upper.divide(2).divide(Q);
		const ratio2Lower = cos(angle2Lower);
		const term2Lower = ratio2Lower.divide(2).divide(Q);
		return new Expression(term1Upper, term2Upper, term1Lower.negative(), term2Lower.negative()).times(coeff);
	} else {
		throw new Error(`invalid mode`);
	}
}
