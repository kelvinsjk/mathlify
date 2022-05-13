import { Unknown, Expression, Polynomial } from '../core/index';
import { createZeroArray } from '../core/algebra/polynomialClass';

/**
 * parses an expression, and attempts to convert it to a Polynomial
 * of degree n
 *
 * options default to {n: 2, ascending: false}
 */
export function expToPoly(exp: Expression, options?: { n?: number; ascending?: boolean }): Polynomial {
	const { n, ascending } = {
		n: 2,
		ascending: false,
		...options,
	};
	const coeffs = createZeroArray(n + 1);
	let unknown: string | undefined = undefined;
	exp.terms.forEach((term) => {
		// constant term
		if (term.basicUnits.length === 0) {
			coeffs[0] = coeffs[0].plus(term.coeff);
			return;
		}
		// checks for unknown term
		if (term.basicUnits.length > 1) {
			throw new Error(`cannot convert term with more than one basic unit ${term}`);
		}
		const unit = term.basicUnits[0];
		if (!(unit instanceof Unknown)) {
			throw new Error(`cannot convert term with non-unknown basic unit ${term}`);
		}
		// checks if more than one unknown
		if (unknown === undefined) {
			unknown = unit.unknown;
		} else {
			if (unknown !== unit.unknown) {
				throw new Error(`cannot convert term with multiple unknowns ${unit}, ${unknown}`);
			}
		}
		// checks validity of degree
		if (unit.n.isLessThan(0) || unit.n.isGreaterThan(n) || !unit.n.isInteger()) {
			throw new Error(`Invalid degree for ${unit} to be converted into polynomial`);
		}
		// adds into coeffs array
		coeffs[unit.n.valueOf()] = coeffs[unit.n.valueOf()].plus(term.coeff);
	});
	if (!ascending) {
		coeffs.reverse();
	}
	return new Polynomial(coeffs, { ascending, degree: n, unknown: unknown ?? 'x' });
}
