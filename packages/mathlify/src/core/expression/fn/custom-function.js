/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../expression.js').Shorthand} Shorthand */
/** @typedef {import('../expression.js').Variable} Variable */

/**
 * The `Fn` class is the base class for building custom functions. By default this behaves
 * as an identity function, but can be extended to create custom functions.
 * Important methods that should be modified if we desire non-identity behavior:
 * - `toString`
 * - `_to_lexical_string`
 * - `contains`
 * - `simplify`
 * - `clone`
 * - `subIn`
 * @property {Expression} argument
 */
export class Fn {
	/** @type {'fn'} */
	type = 'fn';
	/** @type {string} */
	functionType;
	/** @type {Expression} */
	argument;
	/**
	 * @constructor
	 * Creates a Fn
	 * @param {Shorthand} argument
	 */
	constructor(argument) {
		if (
			typeof argument === 'string' ||
			typeof argument === 'number' ||
			Array.isArray(argument) ||
			argument.type !== 'expression'
		)
			throw new Error(
				'This dummy identity function only accepts expressions as arguments',
			);
		this.argument = argument;
		this.functionType = 'identity';
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.argument.toString();
	}

	/**
	 * Returns a custom string representation of the expression, using the provided function.
	 * If the function returns undefined, the default toString will be used
	 * @param {(exp:Expression)=>string|undefined} toStringFn
	 * @returns {string}
	 */
	toCustomString(toStringFn) {
		let argStr = toStringFn(this.argument);
		if (argStr === undefined) {
			return this.toString();
		}
		return argStr;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return this.argument._to_lexical_string();
	}

	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.argument.contains(variable);
	}

	/**
	 * @param {SimplifyOptions} [_options]
	 * @returns {ExpressionNode}
	 */
	simplify(_options) {
		return new Fn(this.argument.simplify());
	}

	/**
	 * @returns {Fn}
	 */
	clone() {
		return new Fn(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options - default to automatic simplification
	 * @returns {ExpressionNode}
	 */
	subIn(scope, options) {
		return this.argument.subIn(scope, options).node;
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return this.argument.fn(x, variable);
	};

	is = {
		/** @returns {boolean} */
		variable: () => {
			return this.argument.is.variable();
		},
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.argument.valueOf();
	}
}
