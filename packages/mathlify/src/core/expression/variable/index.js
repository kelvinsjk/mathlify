/**
 * Variable Class
 * @property {string} name - the string representation of the variable
 * */
export class Variable {
	/** @type {'variable'} */
	type = 'variable';
	/**
	 * @constructor
	 * Creates a Variable
	 * @param {string} name - the string representation of the variable
	 */
	constructor(name) {
		this.name = name;
	}

	/**
	 * @returns {string} `this.name`
	 */
	toString() {
		return this.name;
	}

	/** @returns {string} */
	toLexicalString() {
		return this.name;
	}

	/**
	 * @returns {Variable}
	 */
	clone() {
		return new Variable(this.name);
	}
}
