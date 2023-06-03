import { Expression, Polynomial } from '../core/index';
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
	let variable: string | undefined = undefined;
	exp.terms.forEach((term) => {
		const length = Object.keys(term.symbols).length;
		// constant term
		if (length === 0) {
			coeffs[0] = coeffs[0].plus(term.coeff);
			return;
		}
		// checks for unknown term
		if (length > 1) {
			throw new Error(`cannot convert term with more than one basic unit ${term}`);
		}
		const unit = term.symbols[Object.keys(term.symbols)[0]];
		// checks if more than one unknown
		if (variable === undefined) {
			variable = unit.symbol.symbol;
		} else {
			if (variable !== unit.symbol.symbol) {
				throw new Error(`cannot convert term with multiple unknowns ${unit}, ${variable}`);
			}
		}
		// checks validity of degree
		if (unit.power.isLessThan(0) || unit.power.isGreaterThan(n) || !unit.power.isInteger()) {
			throw new Error(`Invalid degree for ${unit} to be converted into polynomial`);
		}
		// adds into coeffs array
		coeffs[unit.power.valueOf()] = coeffs[unit.power.valueOf()].plus(term.coeff);
	});
	if (!ascending) {
		coeffs.reverse();
	}
	return new Polynomial(coeffs, { ascending, degree: n, variable: variable ?? 'x' });
}
