/** @typedef {import('./sum/index.js').Sum} Sum */
// !  Sum|Product|Quotient|Exponent|Variable|string|Numeral|Fraction|number

import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';

/** Expression Class
 * @property {Sum|Product|Quotient|Exponent|Variable|Numeral} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {Sum|Variable|Numeral} */
	expression;

	/**
	 * Creates an Expression
	 * from Sums, Products, Quotients,
	 * Exponents, Variables and Numerals
	 * @param {Sum|Variable|string|Numeral|Fraction|number} expression
	 */
	constructor(expression) {
		// convert primitive types
		if (typeof expression === 'string') {
			expression = new Variable(expression);
		} else if (typeof expression === 'number' || expression instanceof Fraction) {
			expression = new Numeral(expression);
		}
		this.expression = expression;
	}
}
