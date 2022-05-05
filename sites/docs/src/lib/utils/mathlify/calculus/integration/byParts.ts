import { PowerFn, LnFn } from '../powerLnClasses';
import { CosFn, SinFn } from '../sinCosFnClasses';
import { ExpFn } from '../expFnClass';
import { Expression, Term } from 'mathlify';

/**
 * integration by parts
 *
 * @param limits is an array [lower, upper] or the number/Fraction/Angle type;
 *
 * currently only support (ax+b)^n e^(a'x+b') type with n a non-negative
 */
export function byParts(
	u: PowerFn | LnFn,
	vPrime: PowerFn | ExpFn | CosFn | SinFn,
	// limits?: [number | Fraction | Angle, number | Fraction | Angle],
): Expression {
	if (vPrime instanceof PowerFn) {
		if (u instanceof LnFn) {
			return xLnXByParts(u, vPrime); //limits as [number | Fraction, number | Fraction]);
		} else {
			throw new Error('invalid by parts: both u and vPrime are Power Fns');
		}
	} else {
		if (u instanceof LnFn) {
			throw new Error('ln x cos x not supported');
		} else {
			return expTrigByParts(u, vPrime); //limits);
		}
	}
}

function expTrigByParts(
	u: PowerFn,
	vPrime: ExpFn | CosFn | SinFn,
	//limits?: [number | Fraction | Angle, number | Fraction | Angle],
): Expression {
	if (!(u.n.isInteger() && u.n.valueOf() >= 0)) {
		throw new Error('by parts ERROR: n must be a non-negative integer');
	} else {
		const v = vPrime.integral();
		if (u.n.isEqualTo(0)) {
			// base case: k1 k2 e^(ax+b)
			///if (limits === undefined) {
			const integral = v.multiply(u.coefficient);
			const vStripped =
				v instanceof ExpFn
					? new ExpFn(v.fx)
					: v instanceof CosFn
					? new CosFn(v.fx)
					: new SinFn(v.fx);
			const term = new Term(integral.coefficient, `${vStripped}`);
			return new Expression(term);
			///} else {
			///	const v = vPrime.integral();
			///	let firstTerm: Expression, secondTerm: Expression;
			///	if (v instanceof ExpFn) {
			///		// TODO: incorporate the v.coeff step into the valueAt method
			///		firstTerm = new Expression(
			///			v.valueAt(limits[1] as Fraction | number).multiply(u.coeff),
			///		).multiply(v.coeff);
			///		secondTerm = new Expression(
			///			v.valueAt(limits[0] as Fraction | number).multiply(u.coeff),
			///		).multiply(v.coeff);
			///	} else {
			///		firstTerm = new Expression(v.valueAt(limits[1] as Angle | number).multiply(u.coeff));
			///		secondTerm = new Expression(v.valueAt(limits[0] as Angle | number).multiply(u.coeff));
			///	}
			///	return firstTerm.subtract(secondTerm);
			///}
		} else {
			// recursively integrate
			///if (limits === undefined) {
			const uStripped = new PowerFn(u.n, u.fx);
			const vStripped =
				v instanceof ExpFn
					? new ExpFn(v.fx)
					: v instanceof CosFn
					? new CosFn(v.fx)
					: new SinFn(v.fx);
			const uvTerm = new Term(u.coefficient.times(v.coefficient), `${uStripped} ${vStripped}`);
			const uv = new Expression(uvTerm);
			const uPrime = u.derivative() as PowerFn;
			return uv.minus(byParts(uPrime, v));
			///} else {
			///	let lower: number | Fraction | Angle | Term = limits[0],
			///		upper: number | Fraction | Angle | Term = limits[1];
			///	if (!(v instanceof ExpFn)) {
			///		// trigo: change numbers to fraction
			///		if (typeof lower === 'number') {
			///			lower = new Term(new Fraction(lower, 180), '\\pi');
			///		}
			///		if (typeof upper === 'number') {
			///			upper = new Term(new Fraction(upper, 180), '\\pi');
			///		}
			///	}
			///	const uTerm1 =
			///		upper instanceof Angle || upper instanceof Term
			///			? u.algebraicValueAt(upper)
			///			: u.valueAt(upper);
			///	const uTerm2 =
			///		lower instanceof Angle || lower instanceof Term
			///			? u.algebraicValueAt(lower)
			///			: u.valueAt(lower);
			///	const vTerm1 =
			///		v instanceof ExpFn
			///			? v.valueAt(limits[1] as number | Fraction)
			///			: v.valueAt(limits[1] as number | Angle);
			///	const vTerm2 =
			///		v instanceof ExpFn
			///			? v.valueAt(limits[0] as number | Fraction)
			///			: v.valueAt(limits[0] as number | Angle);
			///	const uv = new Expression(vTerm1.multiply(uTerm1)).subtract(vTerm2.multiply(uTerm2));
			///	return uv.subtract(integrateByParts(u.derivative(), v, limits));
			///}
		}
	}
}

function xLnXByParts(
	u: LnFn,
	vPrime: PowerFn,
	///limits?: [number | Fraction, number | Fraction],
): Expression {
	//if (!(u.a.isEqual(vPrime.a) && u.b.isEqual(vPrime.b))) {
	//	throw new Error('x ln x integral only valid if ax+b is the same for both');
	//}
	const v = vPrime.integral();
	///if (u.n === 1) {
	// base case: int k1 (ax+b)^n k2 ln (ax+b) = k1 * k2 / a / (n+1) * (ax+b)^(n+1) \\ln (ax+b) - k1 * k2 / a / (n+1)^2 * (ax+b)^(n+1)
	///if (limits === undefined) {
	// indefinite integral
	const uStripped = new LnFn(u.fx);
	const k2V = new Term(v.coefficient.times(u.coefficient), `${v}`);
	const term1 = new Term(k2V.coeff, `${k2V.variable} ${uStripped}`);
	const term2 = new Term(k2V.coeff.times(-1), `${v}`);
	return new Expression(term1, term2);
	///} else {
	///	const vUpper = v.valueAt(limits[1]),
	///		vLower = v.valueAt(limits[0]);
	///	const firstLnTerm = u.valueAt(limits[1]);
	///	const term1 = new Term(vUpper.times(firstLnTerm.coeff), firstLnTerm.variable);
	///	const secondLnTerm = u.valueAt(limits[0]);
	///	const term2 = new Term(vLower.times(secondLnTerm.coeff), secondLnTerm.variable);
	///	const term3 = new Term(vUpper.times(u.coeff).divide(v.n));
	///	const term4 = new Term(vLower.times(u.coeff).divide(v.n));
	///	return new Expression(term1, term2.multiply(-1), term3.multiply(-1), term4);
	///}
	//} else {
	//	// recursively integrate
	//	if (limits === undefined) {
	//		const newCoeff = v.coeff.times(u.coeff);
	//		const newVariable = `${v.variable} \\left( ${u.variable} \\right)^${u.n}`;
	//		const uv = new Expression(new Term(newCoeff, newVariable));
	//		const newLn = new LnFn({
	//			a: u.a,
	//			b: u.b,
	//			variableAtom: u.variableAtom,
	//			coeff: u.coeff.times(u.n).divide(v.n),
	//			n: u.n - 1,
	//		});
	//		return uv.subtract(integrateByParts(newLn, vPrime));
	//	} else {
	//		const vUpper = v.valueAt(limits[1]),
	//			vLower = v.valueAt(limits[0]);
	//		const uUpper = u.valueAt(limits[1]),
	//			uLower = u.valueAt(limits[0]);
	//		const upperAfterPow = new Term(
	//			uUpper.coeff.times(vUpper),
	//			`\\left( ${uUpper.variable} \\right)^${u.n}`,
	//		);
	//		const lowerAfterPow = new Term(
	//			uLower.coeff.times(vLower),
	//			`\\left( ${uLower.variable} \\right)^${u.n}`,
	//		);
	//		const uv = new Expression(upperAfterPow, lowerAfterPow.multiply(-1));
	//		const newLn = new LnFn({
	//			a: u.a,
	//			b: u.b,
	//			variableAtom: u.variableAtom,
	//			coeff: u.coeff.times(u.n).divide(v.n),
	//			n: u.n - 1,
	//		});
	//		return uv.subtract(integrateByParts(newLn, vPrime, limits));
	//	}
	//}
}
