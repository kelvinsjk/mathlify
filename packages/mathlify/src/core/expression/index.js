// !  Sum|Product|Quotient|Exponent|Variable|string|Numeral|Fraction|number

import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Quotient } from './quotient/index.js';
import { Fn, Brackets } from './fn/index.js';
import { Product } from './product/index.js';
import { lcm } from './numeral/fraction/lcm.js';
export { Variable, Numeral, Fraction, Sum, Product, Quotient };

/** Expression Class
 * @property {Sum|Product|Quotient|Exponent|Variable|Numeral|Brackets} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {Sum|Product|Quotient|Variable|Numeral|Fn} */
	expression;
	/** @type {string} */
	multiplicationSign = '';

	/**
	 * Creates an Expression
	 * from Sums, Products, Quotients,
	 * Exponents, Variables and Numerals
	 * @param {Sum|Product|Quotient|Variable|string|Numeral|Fraction|number|Fn} expression
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
	 * @param {{multiplicationSign?: string}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		options = {
			multiplicationSign: this.multiplicationSign,
			...options,
		};
		return this.expression.toString(options);
	}

	/**
	 * simplifies the expression
	 * @param {{brackets?: boolean, product?: boolean, sum?: boolean, quotient?: boolean, numeral?: boolean}} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
	 * @returns {this}
	 * WARNING: mutates current instance
	 * TODO: product/sum/numeral only works for top level. consider making it recursive
	 */
	simplify(options) {
		if (options === undefined) {
			options = {
				brackets: true,
				product: true,
				sum: true,
				numeral: true,
				quotient: true,
			};
		}
		const { brackets, product, sum, numeral, quotient } = {
			brackets: false,
			product: false,
			sum: false,
			numeral: false,
			quotient: false,
			...options,
		};
		if (brackets) {
			this._remove_brackets();
		}
		if (numeral && this.expression instanceof Numeral) {
			this.expression.simplify();
		}
		if (this.expression instanceof Sum || this.expression instanceof Product || this.expression instanceof Quotient) {
			this.expression.simplify({ product, sum, numeral, quotient });
		}
		this._remove_singletons({ product, sum, quotient });
		return this;
	}

	/**
	 * removes singleton
	 * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_singletons(options) {
		const { product, sum, quotient } = {
			product: true,
			sum: true,
			quotient: true,
			...options,
		};
		if (sum && this.expression instanceof Sum) {
			if (this.expression.terms.length === 0) {
				this.expression = new Numeral(0);
			} else if (this.expression.terms.length === 1) {
				this.expression = this.expression.terms[0].expression;
			}
		} else if (product && this.expression instanceof Product) {
			if (this.expression.factors.length === 0) {
				this.expression = this.expression.coeff;
			} else if (this.expression.factors.length === 1 && this.expression.coeff.is.one()) {
				this.expression = this.expression.factors[0].expression;
			}
		} else if (quotient && this.expression instanceof Quotient) {
			if (this.expression.num.expression instanceof Numeral && this.expression.num.expression.number.is.zero()) {
				// zero numerator
				this.expression = new Numeral(0);
			} else if (this.expression.den.expression instanceof Numeral && this.expression.den.expression.number.is.one()) {
				// one denominator
				this.expression = this.expression.num.expression;
			} else if (
				this.expression.num.expression instanceof Numeral &&
				this.expression.den.expression instanceof Numeral
			) {
				// both numerator and denominator are numerals: change to fraction
				this.expression = this.expression.num.expression.divide(this.expression.den.expression);
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
			for (const term of this.expression.terms) {
				term._remove_brackets();
			}
		} else if (this.expression instanceof Product) {
			for (const factor of this.expression.factors) {
				factor._remove_brackets();
			}
		}
		if (this.expression instanceof Fn) {
			this.expression = this.expression.fn.expression.expression;
		}
		return this;
	}

	/** boolean methods */
	is = {
		/** @returns {boolean} */
		sum: () => this.expression instanceof Sum,
		/** @returns {boolean} */
		product: () => this.expression instanceof Product,
		/** @returns {boolean} */
		//quotient: () => this.expression instanceof Quotient,
		///** @returns {boolean} */
		//exponent: () => this.expression instanceof Exponent,
		/** @returns {boolean} */
		variable: () => this.expression instanceof Variable,
		/** @returns {boolean} */
		numeral: () => this.expression instanceof Numeral,
		/** @returns {boolean} */
		brackets: () => this.expression instanceof Fn && this.expression.fn instanceof Brackets,
	};

	/** methods that may throw */
	try = {
		/** casting methods */
		into: {
			/** @returns {Sum} */
			sum: () => {
				// @ts-expect-error
				if (this.is.sum()) return this.expression;
				throw new Error('Cannot cast to Sum');
			},
			/** @returns {Product} */
			product: () => {
				// @ts-expect-error
				if (this.is.product()) return this.expression;
				throw new Error('Cannot cast to Product');
			},
			///** @returns {Quotient} */
			//quotient: () => {
			//	if (this.is.quotient()) return this.expression;
			//	throw new Error('Cannot cast to Quotient');
			//},
			///** @returns {Exponent} */
			//exponent: () => {
			//	if (this.is.exponent()) return this.expression;
			//	throw new Error('Cannot cast to Exponent');
			//},
			/** @returns {Variable} */
			variable: () => {
				// @ts-expect-error
				if (this.is.variable()) return this.expression;
				throw new Error('Cannot cast to Variable');
			},
			/** @returns {Numeral} */
			numeral: () => {
				// @ts-expect-error
				if (this.is.numeral()) return this.expression;
				throw new Error('Cannot cast to Numeral');
			},
			/** @returns {Brackets} */
			brackets: () => {
				// @ts-expect-error
				if (this.is.brackets()) return this.expression.fn;
				throw new Error('Cannot cast to Brackets');
			},
		},
	};

	/**
	 * @returns {Expression}
	 */
	clone() {
		let exp = new Expression(this.expression.clone());
		exp.multiplicationSign = this.multiplicationSign;
		return exp;
	}

	/**
	 * creates a bracketed expression
	 * @param {Expression|Sum|Variable|string|Numeral|Fraction|number} expression
	 * @returns {Expression}
	 */
	static brackets(expression) {
		return new Expression(new Fn(new Brackets(expression)));
	}

	/**
	 * get denominator lcm of expressions
	 * @param {...Expression} expressions
	 * @returns {Expression}
	 */
	static denominator_lcm(...expressions) {
		if (expressions.length === 0) {
			throw new Error('Cannot find denominator lcm of empty array');
		}
		if (expressions.length === 1) {
			let exp = expressions[0];
			if (exp.expression instanceof Numeral) {
				return new Expression(new Numeral(exp.expression.number.den).abs());
			} else {
				return new Expression(1);
			}
		}
		if (expressions.length === 2) {
			const [a, b] = expressions;
			if (a.expression instanceof Numeral) {
				if (b.expression instanceof Numeral) {
					return new Expression(new Numeral(lcm(a.expression.number.den, b.expression.number.den)));
				}
				return Expression.denominator_lcm(a);
			} else {
				return b.expression instanceof Numeral ? Expression.denominator_lcm(b) : new Expression(1);
			}
		}
		let multiple = expressions[0];
		expressions.shift();
		for (let exp of expressions) {
			multiple = Expression.denominator_lcm(multiple, exp);
		}
		return multiple;
	}
}
