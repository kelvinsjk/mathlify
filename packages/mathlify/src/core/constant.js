/** Constant class
 * @property {string} identifier - the identifier of this constant (eg 'pi')
 * @property {string} string - the LaTeX string representation of this constant (eg '\\pi')
 * @property {number|undefined} x - the value of this constant in JS number format (can be undefined)
 * @property {"constant"} kind - mathlify constant class
 */
export class Constant {
	/**
	 * Creates a Constant instance, which is made up of
	 * @param {string} identifier - the string representation of this constant (eg '\\pi')
	 * @param {ConstantOptions} [options] - `options to allow a LaTeX string (defaults to identifier),
	 * and a number value (defaults to undefined)
	 *
	 * // TODO: UnknownConstant that allows morphing to a Fraction or Variable?
	 */
	constructor(identifier, options = undefined) {
		this.identifier = identifier;
		const { string, value } = {
			string: identifier,
			...options,
		};
		this.string = string;
		this.value = value;
		this.kind = 'constant';
	}

	// PRIMITIVE RETURN TYPES
	/**
	 * casts this constant as a number (might be undefined)
	 * @returns {number|undefined} this constant in js number primitive type (might be undefined)
	 */
	valueOf() {
		return this.value;
	}

	/**
	 * casts this constant as a latex string
	 * @returns {string} the latex string representation of this constant
	 */
	toString() {
		return this.string;
	}

	/**
	 * @typedef {Object} ConstantJSON
	 * @property {string} kind - 'constant'
	 * @property {string} identifier - identifier
	 * @property {string} string - LaTeX string
	 * @property {number|undefined} value - value
	 * @property {[string, {string: string, value: number|undefined}]} args - array of arguments to reconstruct current constant
	 */

	/**
	 * serializes object. can be used with the static
	 * `Constant.FromJSON` method to recreate this
	 * class instance
	 * @returns {ConstantJSON}
	 */
	toJSON() {
		return {
			kind: 'constant',
			identifier: this.identifier,
			string: this.string,
			value: this.value,
			args: [this.identifier, { string: this.string, value: this.value }],
		};
	}
}

/**
 * @typedef {Object} ConstantOptions
 * @property {string} [string] - the LaTeX string representation of this constant (eg '\\pi')
 * @property {number|undefined} [value] - the value of this constant in JS number format (can be undefined)
 */
