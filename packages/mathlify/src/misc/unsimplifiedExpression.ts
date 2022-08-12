import { Term, Fraction, Unknown, SquareRoot, Imaginary } from '../core';

/**
 * returns an unsimplified expression string
 */
export function unsimplifiedExp(
	...args: (Term | Unknown | Fraction | number | string | SquareRoot | Imaginary)[]
): string {
	if (args.length === 0) {
		return '0';
	}
	let outputString = '';
	args.forEach((term, i) => {
		if (typeof term === 'string' || typeof term === 'number' || term instanceof Fraction) {
			term = new Term(term);
		}
		if (i !== 0) {
			outputString += term.coeff.isAtLeast(0) ? ' + ' : ' ';
		}
		outputString += term.toString();
	});
	return outputString;
}
