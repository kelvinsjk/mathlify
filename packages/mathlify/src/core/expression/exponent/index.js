import { Expression } from '../index.js';
import { Sum } from '../sum/index.js';
import { Product } from '../product/index.js';

/** @typedef {import('../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * Exponent Class
 * @property {Expression} base
 * @property {Expression} power
 * */
export class Exponent {
	/**@type {Expression} */
	baseExp;
	/**@type {Expression} */
	powerExp;
	/**
	 * Creates a Quotient
	 * @param {Expression|ExpressionType|string|Fraction|number} base
	 * @param {Expression|ExpressionType|string|Fraction|number} power
	 */
	constructor(base, power) {
		base = base instanceof Expression ? base : new Expression(base);
		power = power instanceof Expression ? power : new Expression(power);
		this.baseExp = base;
		this.powerExp = power;
	}

	/** @returns {ExpressionType} */
	get base() {
		return this.baseExp.expression;
	}
	/** @returns {ExpressionType} */
	get power() {
		return this.powerExp.expression;
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		let powerStr = this.power.toString(options);
		if (powerStr.length > 1) {
			powerStr = `{${powerStr}}`;
		}
		let baseStr = this.base.toString(options);
		if (this.base instanceof Sum || this.base instanceof Product) {
			baseStr = `\\left( ${baseStr} \\right)`;
		}
		return `${baseStr}^${powerStr}`;
	}

	/** @returns {string} */
	toLexicalString() {
		return `(${this.base.toLexicalString()})^(${this.power.toLexicalString()})`;
	}

	/**
	 * @returns {Exponent}
	 */
	clone() {
		return new Exponent(this.base.clone(), this.power.clone());
	}

	/**
	 * @param {import('../index.js').SimplifyOptions} [options]
	 * @returns {this}
	 */
	simplify(options) {
		this.baseExp.simplify(options);
		this.powerExp.simplify(options);
		return this;
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		this.baseExp.subIn(scope, options);
		this.powerExp.subIn(scope, options);
		return this;
	}
}
