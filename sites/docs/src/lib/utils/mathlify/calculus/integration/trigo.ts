import { Expression, Fraction, Polynomial, Term, toFraction } from 'mathlify';
import type { Angle } from '../../complex';
import { CosFn, SinFn } from '../sinCosFnClasses';

// integrate sin^2 nx
function sin2(options?: {
	n?: number | Fraction;
	x?: string;
	lower?: Angle;
	upper?: Angle;
}): Expression {
	const {
		n: nNumber,
		x,
		lower,
		upper,
	} = {
		n: 1,
		x: 'x',
		...options,
	};
	const n = toFraction(nNumber);
	const term1 = new Term(new Fraction(1, 2), x);
	const sinTerm = new SinFn(new Polynomial([n.times(2), 0], { variableAtom: x }));
	const term2 = new Term(n.reciprocal().negative().divide(4), `${sinTerm}`);
	if (lower === undefined || upper === undefined) {
		return new Expression(term1, term2);
	}
	// definite integral
	const angleTerm = upper.divide(2).minus(lower.divide(2)).toTerm();
	const surdTerm1 = sinTerm.subXAs(upper).negative().divide(4);
	const surdTerm2 = sinTerm.subXAs(lower).divide(4);
	return new Expression(angleTerm, surdTerm1, surdTerm2);
}
// integrate cos^2 nx
function cos2(options?: {
	n?: number | Fraction;
	x?: string;
	lower?: Angle;
	upper?: Angle;
}): Expression {
	const {
		n: nNumber,
		x,
		lower,
		upper,
	} = {
		n: 1,
		x: 'x',
		...options,
	};
	const n = toFraction(nNumber);
	const term1 = new Term(new Fraction(1, 2), x);
	const sinTerm = new SinFn(new Polynomial([n.times(2), 0], { variableAtom: x }));
	const term2 = new Term(n.reciprocal().divide(4), `${sinTerm}`);
	if (lower === undefined || upper === undefined) {
		return new Expression(term2, term1);
	}
	// definite integral
	const angleTerm = upper.divide(2).minus(lower.divide(2)).toTerm();
	const surdTerm1 = sinTerm.subXAs(upper).divide(4);
	const surdTerm2 = sinTerm.subXAs(lower).negative().divide(4);
	return new Expression(surdTerm1, surdTerm2, angleTerm);
}

function sinSin(options?: {
	n1?: number | Fraction;
	n2?: number | Fraction;
	x?: string;
}): Expression {
	const {
		n1: nNumber1,
		n2: nNumber2,
		x,
	} = {
		n1: 1,
		n2: 1,
		x: 'x',
		...options,
	};
	const n1 = toFraction(nNumber1);
	const n2 = toFraction(nNumber2);
	const A = n1.plus(n2);
	const B = n1.minus(n2);
	const half = new Fraction(1, 2);
	const cosAX = new CosFn(new Polynomial([A, 0], { variableAtom: x }), half.negative());
	const cosBX = new CosFn(new Polynomial([B, 0], { variableAtom: x }), half);
	return new Expression(cosBX.integral().toTerm(), cosAX.integral().toTerm());
}

export const trigo = {
	sin2,
	cos2,
	sinSin,
};
