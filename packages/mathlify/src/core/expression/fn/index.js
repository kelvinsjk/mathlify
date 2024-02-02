import { Brackets } from './brackets/index.js';
export { Brackets };

/** @typedef {import('../index.js').Expression} Expression */

/**
 * Fn class
 * @property {Brackets} fn
 */
export class Fn {
	/** @type {Brackets} */
	fn;
	/**
	 * @constructor
	 * Creates a Fn
	 * @param {Brackets} fn
	 */
	constructor(fn) {
		this.fn = fn;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.fn.toString();
	}

	/**
	 * @returns {string}
	 */
	toLexicalString() {
		return this.fn.toLexicalString();
	}

	/**
	 * @returns {Fn}
	 */
	clone() {
		return new Fn(this.fn.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		this.fn.subIn(scope, options);
		return this;
	}
}