import { Polynomial, Expression, Fraction, Term } from '../../core';

/**
 * Solves DE of the form dxdt = a + b t
 * @param poly a + bt as a Polynomial, or [a, b] as an array or b if a=0.
 * @param options `{variable, initial}`. variable is used as 't' if no polynomial is provided (otherwise
 * variable within polynomial is used)
 * @returns solution of the DE in expression form A/b exp(bt) - a/b.
 * general solution in terms of 'A' if no initial provided,
 * particular solution otherwise
 */
export function type1a(
	poly: number | Fraction | [number | Fraction, number | Fraction] | Polynomial,
	options?: {
		variable?: string;
		initial?: number | Fraction;
	},
): Expression {
	let variable = options?.variable ?? 't';
	if (Array.isArray(poly)) {
		poly = new Polynomial(poly, { ascending: true, variable });
	}
	if (typeof poly === 'number' || poly instanceof Fraction) {
		poly = new Polynomial([0, poly], { ascending: true, variable });
	}
	variable = poly.variable;
	const [a, b] = poly.coeffs;
	const bt = new Polynomial(b, { variable });
	// a + b x = A exp( b t )
	// x = (A exp(bt) - a) / b
	if (options?.initial === undefined) {
		const bReciprocal = b.reciprocal();
		return new Expression(new Term(bReciprocal, `A \\mathrm{e}^{ ${bt} }`), a.negative().divide(b));
	} else {
		const A = poly.subIn(options.initial);
		return new Expression(new Term(A.divide(b), `\\mathrm{e}^{ ${bt} }`), a.negative().divide(b));
	}
}
