// !  Sum|Product|Quotient|Exponent|Variable|string|Numeral|Fraction|number

import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Fn, Brackets } from './fn/index.js';
export { Variable, Numeral, Fraction, Sum };

/** Expression Class
 * @property {Sum|Product|Quotient|Exponent|Variable|Numeral|Brackets} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {Sum|Variable|Numeral|Fn} */
	expression;

	/**
	 * Creates an Expression
	 * from Sums, Products, Quotients,
	 * Exponents, Variables and Numerals
	 * @param {Sum|Variable|string|Numeral|Fraction|number|Fn} expression
	 */
	constructor(expression) {
		// convert primitive types
		if (typeof expression === 'string') {
			expression = new Variable(expression);
		} else if (typeof expression === 'number' || expression instanceof Fraction) {
			expression = new Numeral(expression, { verbatim: true });
		}
		this.expression = expression;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.expression.toString();
	}

	/**
	 * simplifies the expression
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify() {
		this._remove_brackets();
		if (this.expression instanceof Numeral || this.expression instanceof Sum) {
			this.expression.simplify();
		}
		this._remove_singletons();
		return this;
	}

	/**
	 * removes singleton sums
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_singletons() {
		if (this.expression instanceof Sum) {
			if (this.expression.terms.length === 0) {
				this.expression = new Numeral(0);
			} else if (this.expression.terms.length === 1) {
				this.expression = this.expression.terms[0].expression;
			}
		}
		return this;
	}

	/**
	 * removes brackets
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_brackets() {
		if (this.expression instanceof Sum) {
			for (let term of this.expression.terms) {
				term._remove_brackets();
			}
		}
		if (this.expression instanceof Fn) {
			this.expression = this.expression.fn.expression.expression;
		}
		return this;
	}

	/**
	 * @returns {Expression}
	 */
	clone() {
		return new Expression(this.expression.clone());
	}

	/**
	 *
	 * @param {Expression|Sum|Variable|string|Numeral|Fraction|number} expression
	 * @returns {Expression}
	 */
	static brackets(expression) {
		return new Expression(new Fn(new Brackets(expression)));
	}
}
