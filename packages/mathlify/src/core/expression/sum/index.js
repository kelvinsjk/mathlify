/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */

// ! Expression|ExpressionInput

import { Variable } from '../variable/index.js';
import { Numeral } from '../numeral/index.js';
import { Expression } from '../index.js';

/**
 * Sum Class
 * @property {Expression[]} terms - the terms in the sum
 * */
export class Sum {
	/**@type {Expression[]} */
	terms;
	/**
	 * Creates a Sum
	 * @param {...(Expression|Variable|string|Numeral|Fraction|number)} terms
	 */
	constructor(...terms) {
		const termsExp = terms.map((t) => {
			return t instanceof Expression ? t : new Expression(t);
		});
		this.terms = termsExp;
	}
}
