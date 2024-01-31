// !  Sum|Product|Quotient|Exponent|Variable|string|Numeral|Fraction|number

import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Quotient } from './quotient/index.js';
import { Fn, Brackets } from './fn/index.js';
import { Product } from './product/index.js';
import { lcm } from './numeral/fraction/lcm.js';
export { Variable, Numeral, Fraction, Sum, Product, Quotient };
import { unpack_shorthand_single } from '../../macros/index.js';

/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').FractionShorthand} FractionShorthand */

/** Expression Class
 * @property {Sum|Product|Quotient|Exponent|Variable|Numeral|Brackets} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {Sum|Product|Quotient|Variable|Numeral|Fn} */
	expression;
	/** @type {string} */
	multiplicationSign = '';
	/** @type {boolean} */
	mixedFractions = false;

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
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		options = {
			multiplicationSign: this.multiplicationSign,
			mixedFractions: this.mixedFractions,
			...options,
		};
		return this.expression.toString(options);
	}

	/**
	 * simplifies the expression
	 * @param {{brackets?: boolean, product?: boolean, sum?: boolean, quotient?: boolean, numeral?: boolean}} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
	 * @returns {this}
	 * WARNING: mutates current instance
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
			} else if (this.expression.coeff.is.zero()) {
				this.expression = new Numeral(0);
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

	//! arithmetic methods
	/**
	 * negative of expression
	 * @returns {Expression}
	 */
	negative() {
		const exp = this.expression;
		if (exp instanceof Numeral) {
			return new Expression(exp.negative());
		} else if (exp instanceof Product) {
			return new Expression(new Product(-1, ...exp.factors));
		} else {
			throw new Error('negative not supported for this type at the moment');
		}
	}

	/**
	 * @param {Object.<string, Expression|string|number|BracketShorthand|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		const { verbatim } = { verbatim: false, ...options };
		/** @type {Object.<string,Expression>} */
		const scope_exp = {};
		for (const [key, value] of Object.entries(scope)) {
			const val = unpack_shorthand_single(value);
			const val_exp = val instanceof Expression ? val : new Expression(val);
			scope_exp[key] = val_exp;
		}
		if (this.expression instanceof Variable) {
			const name = this.expression.name;
			if (name in scope_exp) {
				this.expression = scope_exp[name].expression;
			}
		} else {
			this.expression.subIn(scope_exp, { verbatim });
		}
		if (!verbatim) this.simplify();
		return this;
	}

	/**
	 * @returns {Expression}
	 */
	clone() {
		let exp = new Expression(this.expression.clone());
		exp.multiplicationSign = this.multiplicationSign;
		return exp;
	}

	/**
	 * common denominator:
	 * for a sum, convert all terms to quotients with the same denominator
	 * @returns {this} - a sum with quotients with same denominator as its terms
	 * Warning: mutates current instance
	 */
	_common_denominator() {
		const sum = this.expression;
		if (!(sum instanceof Sum)) {
			throw new Error('common denominator only supported for sums');
		}
		const den = Expression.denominator_lcm(...sum.terms).expression;
		if (!(den instanceof Numeral)) {
			throw new Error('common denominator expected to be numeral at the moment');
		}
		if (den.is.one()) {
			return this;
		}
		/** @type {Expression[]} */
		const terms = [];
		for (const term of sum.terms) {
			const t = term.expression;
			if (t instanceof Numeral) {
				if (t.is.negative()) {
					terms.push(new Expression(new Product(-1, new Quotient(t.times(den).abs(), den))));
				} else {
					terms.push(new Expression(new Quotient(t.times(den), den)));
				}
			} else if (t instanceof Quotient) {
				const termDen = t.den;
				if (!(termDen instanceof Numeral)) {
					throw new Error('quotients expected to have numeral denominator at the moment');
				}
				const multiple = termDen.divide(den);
				const product = new Product(multiple, t.num).simplify();
				terms.push(new Expression(new Quotient(product, den)));
			} else if (t instanceof Product && t.coeff.is.negative()) {
				if (t.factors.length === 1 && t.factors[0] instanceof Quotient) {
					const q = t.factors[0];
					const termDen = q.den;
					if (!(termDen instanceof Numeral)) {
						throw new Error('quotients expected to have numeral denominator at the moment');
					}
					const multiple = termDen.divide(den).times(t.coeff.abs());
					const product = new Product(multiple, q.num).simplify();
					terms.push(new Expression(new Product(-1, new Quotient(product, den))));
				} else {
					const product = new Product(den.times(t.coeff.abs()), ...t.factors).simplify();
					terms.push(new Expression(new Product(-1, new Quotient(product, den))));
				}
			} else {
				const product = new Product(den, term).simplify();
				terms.push(new Expression(new Quotient(product, den)));
			}
		}
		sum.terms = terms;
		return this;
	}

	/**
	 * combines fraction, with full simplification
	 * @returns {this}
	 * Warning: mutates current instance
	 */
	combine_fraction() {
		this._common_denominator();
		return this._combine_fraction();
	}

	/**
	 * combines into one fraction
	 * (to be used strictly after 'this._common_denominator()` is called. will not work otherwise
	 * @param {{verbatim?: boolean}} [options] - simplifies result by default
	 * @returns {this}
	 * Warning: mutate current instance
	 */
	_combine_fraction(options) {
		const { verbatim } = { verbatim: false, ...options };
		/** @type {(Expression|Product)[]} */
		const terms = [];
		const sum = this.expression;
		if (!(sum instanceof Sum)) {
			throw new Error('common denominator only supported for sums');
		}
		/** @type {Numeral|undefined} */
		let den = undefined;
		for (const term of sum.terms) {
			const t = term.expression;
			if (t instanceof Quotient) {
				let tDen = t.den.expression;
				if (!(tDen instanceof Numeral)) {
					throw new Error('only numeral denominators supported at the moment');
				}
				den = den ?? tDen;
				terms.push(t.num);
			} else if (t instanceof Product && t.coeff.is.negative()) {
				if (t.factors.length !== 1) {
					throw new Error('unexpected number of factors received.');
				}
				const q = t.factors[0].expression;
				if (!(q instanceof Quotient)) {
					throw new Error('unexpected type received');
				}
				const qDen = q.den.expression;
				if (!(qDen instanceof Numeral)) {
					throw new Error('only numeral denominators supported at the moment');
				}
				den = den ?? qDen;
				terms.push(new Product(-1, q.num));
			} else {
				throw new Error('unexpected term received: did you run _common_denominator() right before this step?');
			}
		}
		if (den === undefined) {
			throw new Error('unexpected denominator: did you run _common_denominator() right before this step?');
		}
		this.expression = new Quotient(new Sum(...terms), den);
		if (!verbatim) this.simplify();
		return this;
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
			} else if (
				exp.expression instanceof Product &&
				exp.expression.coeff.is.negative() &&
				exp.expression.factors.length === 1 &&
				exp.expression.factors[0].expression instanceof Numeral
			) {
				const num = exp.expression.factors[0].expression;
				return new Expression(new Numeral(num.number.den).abs());
			} else {
				return new Expression(1);
			}
		}
		if (expressions.length === 2) {
			const [a, b] = expressions;
			if (a.expression instanceof Numeral) {
				if (b.expression instanceof Numeral) {
					return new Expression(new Numeral(lcm(a.expression.number.den, b.expression.number.den)));
				} else if (
					b.expression instanceof Product &&
					b.expression.coeff.is.negative() &&
					b.expression.factors.length === 1 &&
					b.expression.factors[0].expression instanceof Numeral
				) {
					const bNum = b.expression.factors[0].expression;
					return new Expression(new Numeral(lcm(a.expression.number.den, bNum.number.den)));
				}
				return Expression.denominator_lcm(a);
			} else if (
				a.expression instanceof Product &&
				a.expression.coeff.is.negative() &&
				a.expression.factors.length === 1 &&
				a.expression.factors[0].expression instanceof Numeral
			) {
				const aNum = a.expression.factors[0].expression;
				if (b.expression instanceof Numeral) {
					return new Expression(new Numeral(lcm(aNum.number.den, b.expression.number.den)));
				} else if (
					b.expression instanceof Product &&
					b.expression.coeff.is.negative() &&
					b.expression.factors.length === 1 &&
					b.expression.factors[0].expression instanceof Numeral
				) {
					const bNum = b.expression.factors[0].expression;
					return new Expression(new Numeral(lcm(aNum.number.den, bNum.number.den)));
				}
				return Expression.denominator_lcm(a);
			} else {
				if (
					b.expression instanceof Numeral ||
					(b.expression instanceof Product &&
						b.expression.coeff.is.negative() &&
						b.expression.factors.length === 1 &&
						b.expression.factors[0].expression instanceof Numeral)
				) {
					return Expression.denominator_lcm(b);
				}
				return new Expression(1);
			}
		}
		let multiple = Expression.denominator_lcm(expressions[0], expressions[1]);
		expressions.shift();
		expressions.shift();
		for (const exp of expressions) {
			const reciprocal = new Expression(new Quotient(1, multiple)).simplify();
			multiple = Expression.denominator_lcm(reciprocal, exp);
		}
		return multiple;
	}
}
