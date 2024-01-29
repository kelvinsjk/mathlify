import { Brackets } from './brackets/index.js';
export { Brackets };

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
	 * @returns {Fn}
	 */
	clone() {
		return new Fn(this.fn.clone());
	}
}
