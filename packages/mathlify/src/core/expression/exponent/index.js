// import { Sum } from '../sum/index.js';
import { Numeral } from '../numeral/index.js';
//import { Product } from '../product/index.js';

/** @typedef {import('../index.js').Expression} Expression */
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
	/** @type {'exponent'} */
	type = 'exponent';
	/**@type {Expression} */
	baseExp;
	/**@type {Expression} */
	powerExp;
	/**
	 * Creates a Quotient
	 * @param {Expression} base
	 * @param {Expression} power
	 */
	constructor(base, power) {
		this.baseExp = base;
		this.powerExp = power;
	}

	/** @returns {ExpressionType} */
	get base() {
		return this.baseExp.node;
	}
	/** @returns {ExpressionType} */
	get power() {
		return this.powerExp.node;
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
		if (
			this.base.type === 'sum' ||
			this.base.type === 'product' ||
			(this.base instanceof Numeral && this.base.is.negative())
		) {
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
		return new Exponent(this.baseExp.clone(), this.powerExp.clone());
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
	 * @returns {Exponent}
	 */
	subIn(scope, options) {
		return new Exponent(this.baseExp.subIn(scope, options), this.powerExp.subIn(scope, options));
	}

	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.baseExp.contains(variable) || this.powerExp.contains(variable);
	}
}
