import { Expression } from '../core/expression/expression.js';

/**
 * for quotient with numerator sums, split up the quotient into a sum of fractions (with full simplification)
 * @param {Expression} exp
 * @returns {Expression}
 */
export function splitFraction(exp) {
	//TODO: support for verbatim mode: do not simplify
	const quotient = exp.node;
	if (quotient.type !== 'quotient') return exp.clone();
	const sum = quotient.num.clone().node;
	const den = quotient.den.clone();
	if (sum.type !== 'sum') return exp.clone();
	return new Expression([
		'+',
		...sum.terms.map((term) => new Expression([term, '/', den])),
	]).simplify();
}
