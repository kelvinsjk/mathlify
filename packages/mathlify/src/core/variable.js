import { Fraction } from './fraction.js';

/** Variable class
 * @property {string} identifier - the identifier of this variable (eg 'X')
 * @property {string} string - the LaTeX string representation of this variable (eg '\\sin x')
 * @property {"variable"} kind - mathlify variable class
 */
export class Variable {
	/**
	 * Creates a Variable instance, which is made up of
	 * @param {string} identifier - the string representation of this variable (eg 'x')
	 * @param {VariableOptions} [options] - `options to allow a LaTeX string (defaults to identifier),
	 * and `subIn`, `subInNumber` methods
	 */
	constructor(identifier, options = undefined) {
		this.identifier = identifier;
		const { string, subIn, subInNumber } = {
			string: identifier,
			/**
			 * @param {Fraction} x
			 * @returns {Fraction} x itself
			 */
			subIn: (x) => x,
			/**
			 * @param {number} x
			 * @returns {number} x itself
			 */
			subInNumber: (x) => x,
			...options,
		};
		this.string = string;
		/**
		 * @type {(x: Fraction)=>unknown}
		 */
		this.subIn = subIn;
		/**
		 * @type {(x: number)=>number}
		 */
		this.subInNumber = subInNumber;
		this.kind = 'variable';
	}

	// PRIMITIVE RETURN TYPES
	/**
	 * casts this constant as a latex string
	 * @returns {string} the latex string representation of this constant
	 */
	toString() {
		return this.string;
	}

	/**
	 * @typedef {Object} VariableJSON
	 * @property {'variable'} kind - 'variable'
	 * @property {string} identifier - identifier
	 * @property {string} string - LaTeX string
	 * @property {[string, {string: string}]} args - array of arguments to reconstruct current constant
	 */

	/**
	 * serializes object. can be used with the static
	 * `Variable.FromJSON` method to recreate this
	 * class instance
	 *
	 * WARNING: the subIn and subInNumber methods are not
	 * serialized and have to be handled manually
	 * @returns {VariableJSON}
	 */
	toJSON() {
		return {
			kind: 'variable',
			identifier: this.identifier,
			string: this.string,
			args: [this.identifier, { string: this.string }],
		};
	}
}

/**
 * @typedef {Object} VariableOptions
 * @property {string} [string] - the LaTeX string representation of this variable (eg '\\sin x')
 * @property {(x:Fraction)=>unknown} [subIn] - function to handle substituting in a Fraction
 * @property {(x:number)=>number} [subInNumber] - function to handle substituting in a number
 */
