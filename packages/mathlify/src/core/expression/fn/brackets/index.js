/** @typedef {import('../../index.js').Expression} Expression */
/** @typedef {import('../../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../../variable/index.js').Variable} Variable */
/** @typedef {import('../../sum/index.js').Sum} Sum */
/** @typedef {import('../../product/index.js').Product} Product */
/** @typedef {import('../../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../../index.js').ExpressionType} ExpressionType */

/**
 * Brackets Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Brackets {
	/**@type {Expression} */
	expression;
	/**
	 * Creates a Bracketed term
	 * @param {Expression} expression
	 */
	constructor(expression) {
		this.expression = expression;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\left( ${this.expression} \\right)`;
	}

	/**
	 * @returns {string}
	 */
	toLexicalString() {
		return `(${this.expression._to_lexical_string()})`;
	}

	/**
	 * @returns {Brackets}
	 */
	clone() {
		return new Brackets(this.expression.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Brackets}
	 */
	subIn(scope, options) {
		return new Brackets(this.expression.subIn(scope, options));
	}
}
