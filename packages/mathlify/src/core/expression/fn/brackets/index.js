import { Expression } from '../../index.js';

/** @typedef {import('../../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../../variable/index.js').Variable} Variable */
/** @typedef {import('../../sum/index.js').Sum} Sum */

/**
 * Brackets Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Brackets {
	/**@type {Expression} */
	expression;
	/**
	 * Creates a Bracketed term
	 * @param {Expression|Sum|Variable|string|Numeral|Fraction|number} expression
	 */
	constructor(expression) {
		this.expression = expression instanceof Expression ? expression : new Expression(expression);
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\left( ${this.expression} \\right)`;
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
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		this.expression.subIn(scope, options);
		return this;
	}
}
