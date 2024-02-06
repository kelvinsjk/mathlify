import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Quotient } from './quotient/index.js';
import { Fn, Brackets } from './fn/index.js';
import { Product } from './product/index.js';
import { Exponent } from './exponent/index.js';
export { Variable, Numeral, Fraction, Sum, Product, Quotient, Exponent };
import { unpack_shorthand_single } from '../../macros/index.js';

/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').QuotientShorthand} FractionShorthand */
/** @typedef {Sum|Product|Quotient|Exponent|Variable|Numeral|Fn} ExpressionType */
/** @typedef {{brackets?: boolean, product?: boolean, sum?: boolean, quotient?: boolean, numeral?: boolean, exponent?: boolean}} SimplifyOptions */

/** Expression Class
 * @property {ExpressionType} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {ExpressionType} */
	expression;
	/** @type {string} */
	multiplicationSign = '';
	/** @type {boolean} */
	mixedFractions = false;

	/**
	 * Creates an Expression
	 * from Sums, Products, Quotients,
	 * Exponents, Variables and Numerals
	 * @param {ExpressionType|string|Fraction|number|Brackets} expression
	 */
	constructor(expression) {
		// convert primitive types
		if (typeof expression === 'string') {
			expression = new Variable(expression);
		} else if (typeof expression === 'number' || expression instanceof Fraction) {
			expression = new Numeral(expression, { verbatim: true });
		} else if (expression instanceof Brackets) {
			expression = new Fn(expression);
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
	 * @param {{coeff?: boolean}} [options] - whether to include coefficient for a product. default: true
	 * @returns {string}
	 * */
	toLexicalString(options) {
		return this.expression.toLexicalString(options);
	}

	/**
	 * simplifies the expression
	 * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
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
				exponent: true,
			};
		}
		const { brackets, product, sum, numeral, quotient, exponent } = {
			brackets: false,
			product: false,
			sum: false,
			numeral: false,
			quotient: false,
			exponent: false,
			...options,
		};
		if (brackets) {
			this._remove_brackets();
		}
		if (numeral && this.expression instanceof Numeral) {
			this.expression.simplify();
		}
		if (
			this.expression instanceof Sum ||
			this.expression instanceof Product ||
			this.expression instanceof Quotient ||
			this.expression instanceof Exponent
		) {
			this.expression.simplify({ product, sum, numeral, quotient, exponent, brackets });
		}
		if (exponent) {
			this._simplify_exponent();
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
				this.expression = this.expression.terms[0];
			}
		} else if (product && this.expression instanceof Product) {
			if (this.expression._factorsExp.length === 0) {
				this.expression = this.expression.coeff;
			} else if (this.expression.coeff.is.zero()) {
				this.expression = new Numeral(0);
			} else if (this.expression._factorsExp.length === 1 && this.expression.coeff.is.one()) {
				this.expression = this.expression.factors[0];
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
			for (const term of this.expression._termsExp) {
				term._remove_brackets();
			}
		} else if (this.expression instanceof Product) {
			for (const factor of this.expression._factorsExp) {
				factor._remove_brackets();
			}
		}
		if (this.expression instanceof Fn) {
			this.expression = this.expression.fn.expression.expression;
		}
		return this;
	}

	/**
	 * simplifies exponents:
	 * numeral^integer -> numeral
	 * base^0 -> 1
	 * base^1 -> base
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_simplify_exponent() {
		const exp = this.expression;
		if (!(exp instanceof Exponent)) {
			return this;
		}
		const { base, power } = exp;
		if (base instanceof Numeral && power instanceof Numeral && power.number.is.integer()) {
			this.expression = new Numeral(base.number.pow(power.number));
		} else if (power instanceof Numeral && power.number.is.zero()) {
			this.expression = new Numeral(1);
		} else if (power instanceof Numeral && power.number.is.one()) {
			this.expression = base;
		}
		return this;
	}

	/**
	 * expands either products, or products within a sum
	 * @param {{verbatim?: boolean, numerator?: boolean}} [options] - default to automatic simplification
	 * @returns {this}
	 */
	expand(options) {
		const exp = this.expression;
		if (exp instanceof Product) {
			for (const factor of exp._factorsExp) {
				factor.expand(options);
			}
			return this._expand_product(options);
		} else if (exp instanceof Sum) {
			for (const term of exp._termsExp) {
				term.expand(options);
			}
			exp._flatten();
		} else if (exp instanceof Quotient) {
			const { numerator } = { numerator: false, ...options };
			exp.num.expand(options);
			if (!numerator) exp.den.expand(options);
		}
		const { verbatim } = { verbatim: false, ...options };
		if (!verbatim) this.simplify();
		return this;
	}

	/**
	 * expands products
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {this}
	 */
	_expand_product(options) {
		const exp = this.expression;
		if (!(exp instanceof Product)) {
			return this;
		}
		/** @type {Sum[]} */
		const sums = [];
		/** @type {ExpressionType[]} */
		const others = [];
		for (const term of exp.factors) {
			if (term instanceof Sum) {
				sums.push(term);
			} else {
				others.push(term);
			}
		}
		if (sums.length === 0 || (sums.length === 1 && exp.coeff.is.one())) return this;
		/** @type {Product[]} */
		let terms = sums[0].terms.map((term) => {
			return new Product(exp.coeff, ...others, term).simplify();
		});
		sums.shift();
		for (const sum of sums) {
			/** @type {Product[]} */
			const new_terms = [];
			for (const term of terms) {
				for (const t of sum.terms) {
					new_terms.push(new Product(term, t).simplify());
				}
			}
			terms = new_terms;
		}
		const sum = new Sum(...terms);
		sum._flatten();
		this.expression = sum;
		const { verbatim } = { verbatim: false, ...options };
		if (!verbatim) sum.simplify();
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
	 * combines fraction, with full simplification
	 * @returns {this}
	 * Warning: mutates current instance
	 */
	combine_fraction() {
		this._common_denominator();
		this._combine_fraction();
		this.expand({ numerator: true });
		return this;
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
		const denExp = Expression.denominator_lcm(...sum._termsExp);
		const den = denExp.expression;
		if (den instanceof Numeral && den.is.one()) {
			return this;
		}
		/** @type {Expression[]} */
		const terms = [];
		for (const term of sum.terms) {
			if (term instanceof Numeral) {
				if (term.is.negative()) {
					terms.push(new Expression(new Product(-1, new Quotient(new Product(term.abs(), den).simplify(), den))));
				} else {
					terms.push(new Expression(new Quotient(new Product(term, den).simplify(), den)));
				}
			} else if (term instanceof Quotient) {
				const multiple = lcm_divide(denExp, term.den.expression);
				const num = new Expression(new Product(multiple.coeff, term.num, ...multiple.factors)).simplify();
				terms.push(new Expression(new Quotient(num, den)));
			} else if (term instanceof Product && term.coeff.is.negative()) {
				if (term.factors.length === 1 && term.factors[0] instanceof Quotient) {
					const multiple = lcm_divide(denExp, term.factors[0].den.expression);
					const num = new Expression(new Product(multiple.coeff, term.factors[0].num, ...multiple.factors)).simplify();
					terms.push(new Expression(new Product(-1, new Quotient(num, den))));
				} else {
					terms.push(
						new Expression(
							new Product(-1, new Quotient(new Product(term.coeff.abs(), ...term.factors, den).simplify(), den)),
						),
					);
				}
			} else {
				terms.push(new Expression(new Quotient(new Product(term, den).simplify(), den)));
			}
		}
		sum._termsExp = terms;
		return this;
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
		/** @type {Expression|undefined} */
		let den = undefined;
		for (const term of sum.terms) {
			if (term instanceof Quotient) {
				den = den ?? term.den;
				terms.push(term.num);
			} else if (
				term instanceof Product &&
				term.coeff.is.negative() &&
				term.factors.length === 1 &&
				term.factors[0] instanceof Quotient
			) {
				const q = term.factors[0];
				den = den ?? q.den;
				terms.push(new Product(-1, q.num));
			}
			//! assumption: no other cases should be possible
		}
		if (den === undefined) {
			return this;
		}
		this.expression = new Quotient(new Sum(...terms), den);
		if (!verbatim) this.simplify();
		return this;
	}

	/**
	 * creates a bracketed expression
	 * @param {Expression|ExpressionType|string|Fraction|number} expression
	 * @returns {Expression}
	 */
	static brackets(expression) {
		const fn = expression instanceof Fn ? expression : new Fn(new Brackets(expression));
		return new Expression(fn);
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
			let exp = expressions[0].expression;
			if (exp instanceof Numeral) {
				return new Expression(new Numeral(exp.number.den).abs());
			} else if (exp instanceof Quotient) {
				return new Expression(exp.den.expression.clone());
			} else if (exp instanceof Product && exp.coeff.is.negative() && exp.factors.length === 1) {
				return Expression.denominator_lcm(exp._factorsExp[0]);
			} else {
				return new Expression(1);
			}
		}
		if (expressions.length === 2) {
			const [a, b] = expressions;
			const aDen = Expression.denominator_lcm(a);
			const bDen = Expression.denominator_lcm(b);
			return Expression._lcmTwo(aDen, bDen);
		}
		// more than 2 expressions
		const dens = expressions.map((exp) => Expression.denominator_lcm(exp));
		let multiple = Expression._lcmTwo(dens[0], dens[1]);
		dens.shift();
		dens.shift();
		for (const exp of dens) {
			multiple = Expression._lcmTwo(multiple, exp);
		}
		return multiple;
	}

	/**
	 * get gcd of two expressions
	 * @param {Expression} exp1
	 * @param {Expression} exp2
	 * @returns {Expression}
	 */
	static _gcdTwo(exp1, exp2) {
		const a = exp1.expression;
		const b = exp2.expression;
		if (a instanceof Exponent && a.power instanceof Numeral) {
			if (b instanceof Exponent && b.power instanceof Numeral) {
				if (a.base.toLexicalString() === b.base.toLexicalString()) {
					return new Expression(new Exponent(a.base.clone(), Numeral.min(a.power, b.power)));
				}
				return new Expression(1);
			} else if (b instanceof Product) {
				for (const factor of b.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						if (factor.base.toLexicalString() === a.base.toLexicalString()) {
							return new Expression(new Exponent(a.base.clone(), Numeral.min(a.power, factor.power)));
						}
					}
				}
				return new Expression(1);
			} else {
				if (a.base.toLexicalString() == exp2.toLexicalString()) {
					return exp2.clone();
				}
				return new Expression(1);
			}
		} else if (a instanceof Product) {
			if (b instanceof Exponent && b.power instanceof Numeral) {
				return Expression._gcdTwo(exp2, exp1);
			} else if (b instanceof Product) {
				// lexical string: [power, expression, modified?]
				/** @type {Object.<string,[Numeral,Expression,true?]>} */
				const termMap = {};
				/** @type {string[]} */
				const orderedKeys = [];
				// loop through a
				for (const factor of a.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						const key = factor.base.toLexicalString();
						orderedKeys.push(key);
						termMap[key] = [factor.power, factor.baseExp.clone()];
					} else {
						const key = factor.toLexicalString();
						orderedKeys.push(key);
						termMap[key] = [new Numeral(1), new Expression(factor.clone())];
					}
				}
				// loop through b
				for (const factor of b.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						const key = factor.base.toLexicalString();
						const val = termMap[key];
						if (val) {
							val[0] = Numeral.min(factor.power, val[0]);
							val[2] = true;
						}
					} else {
						const key = factor.toLexicalString();
						const val = termMap[key];
						if (val) {
							val[0] = Numeral.min(1, val[0]);
							val[2] = true;
						}
					}
				}
				for (const [key, val] of Object.entries(termMap)) {
					if (val[2] === undefined) {
						delete termMap[key];
					}
				}
				/** @type {Expression[]} */
				const factors = [];
				for (const key of orderedKeys) {
					const val = termMap[key];
					if (val) {
						const [power, expression] = val;
						if (power.is.one()) {
							factors.push(expression);
						} else if (power.is.nonzero()) {
							factors.push(new Expression(new Exponent(expression, power)));
						}
					}
				}
				return new Expression(new Product(Numeral.gcd(a.coeff, b.coeff), ...factors)).simplify();
			} else if (b instanceof Numeral) {
				return new Expression(Numeral.gcd(a.coeff, b));
			} else {
				for (const factor of a.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						if (factor.base.toLexicalString() === b.toLexicalString()) {
							return exp2.clone();
						}
					} else if (factor.toLexicalString() === b.toLexicalString()) {
						return exp2.clone();
					}
				}
				return new Expression(1);
			}
		} else {
			if (exp1.toLexicalString() === exp2.toLexicalString()) {
				return exp1.clone();
			}
			return new Expression(1);
		}
	}

	/**
	 * get lcm of two expressions
	 * @param {Expression} exp1
	 * @param {Expression} exp2
	 * @returns {Expression}
	 */
	static _lcmTwo(exp1, exp2) {
		const a = exp1.expression;
		const b = exp2.expression;
		if (a instanceof Product) {
			if (b instanceof Product) {
				// lexical string: [power, expression]
				/** @type {Object.<string,[Numeral,Expression]>} */
				const termMap = {};
				/** @type {string[]} */
				const orderedKeys = [];
				// loop through a
				for (const factor of a.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						const key = factor.base.toLexicalString();
						orderedKeys.push(key);
						termMap[key] = [factor.power, factor.baseExp.clone()];
					} else {
						const key = factor.toLexicalString();
						orderedKeys.push(key);
						termMap[key] = [new Numeral(1), new Expression(factor.clone())];
					}
				}
				// loop through b
				for (const factor of b.factors) {
					if (factor instanceof Exponent && factor.power instanceof Numeral) {
						const key = factor.base.toLexicalString();
						const val = termMap[key];
						if (val) {
							val[0] = Numeral.max(factor.power, val[0]);
						} else {
							termMap[key] = [factor.power, factor.baseExp.clone()];
							orderedKeys.push(key);
						}
					} else {
						const key = factor.toLexicalString();
						const val = termMap[key];
						if (val) {
							val[0] = Numeral.max(1, val[0]);
						} else {
							termMap[key] = [new Numeral(1), new Expression(factor.clone())];
							orderedKeys.push(key);
						}
					}
				}
				/** @type {Expression[]} */
				const factors = [];
				for (const key of orderedKeys) {
					const val = termMap[key];
					if (val) {
						const [power, expression] = val;
						if (power.is.one()) {
							factors.push(expression);
						} else if (power.is.nonzero()) {
							factors.push(new Expression(new Exponent(expression, power)));
						}
					}
				}
				return new Expression(new Product(Numeral.lcm(a.coeff, b.coeff), ...factors)).simplify();
			} else if (b instanceof Numeral) {
				return new Expression(new Product(Numeral.lcm(a.coeff, b), ...a.factors)).simplify();
			} else {
				/** @type {ExpressionType[]} */
				const factors = [];
				/** @type {boolean} */
				let noCommonFactor = true;
				for (const f of a.factors) {
					if (
						f instanceof Exponent &&
						f.power instanceof Numeral &&
						b instanceof Exponent &&
						b.power instanceof Numeral &&
						f.base.toLexicalString() === b.base.toLexicalString()
					) {
						factors.push(new Exponent(f.base, Numeral.max(f.power, b.power)));
						noCommonFactor = false;
					} else if (
						f instanceof Exponent &&
						f.power instanceof Numeral &&
						f.base.toLexicalString() === b.toLexicalString()
					) {
						factors.push(new Exponent(f.base, Numeral.max(f.power, new Numeral(1))));
						noCommonFactor = false;
					} else if (f.toLexicalString() === b.toLexicalString()) {
						factors.push(f.clone());
						noCommonFactor = false;
					} else {
						factors.push(f);
					}
				}
				if (noCommonFactor) {
					factors.push(b);
				}
				return new Expression(new Product(a.coeff, ...factors)).simplify();
			}
		} else if (b instanceof Product) {
			return Expression._lcmTwo(exp2, exp1);
		} else if (a instanceof Exponent && a.power instanceof Numeral) {
			if (b instanceof Exponent && b.power instanceof Numeral) {
				if (a.base.toLexicalString() === b.base.toLexicalString()) {
					return new Expression(new Exponent(a.base.clone(), Numeral.max(a.power, b.power)));
				}
				return new Expression(new Product(exp1.clone(), exp2.clone())).simplify();
			} else {
				if (a.base.toLexicalString() === b.toLexicalString()) {
					return a.power.valueOf() >= 1 ? exp1.clone() : exp2.clone();
				}
				return new Expression(new Product(exp1.clone(), exp2.clone())).simplify();
			}
		} else if (b instanceof Exponent && b.power instanceof Numeral) {
			return Expression._lcmTwo(exp2, exp1);
		} else if (a instanceof Numeral) {
			if (b instanceof Numeral) {
				return new Expression(Numeral.lcm(a, b));
			}
			return new Expression(new Product(a, exp2.clone())).simplify();
		} else if (b instanceof Numeral) {
			return Expression._lcmTwo(exp2, exp1);
		} else {
			if (exp1.toLexicalString() === exp2.toLexicalString()) {
				return exp1.clone();
			}
			return new Expression(new Product(exp1.clone(), exp2.clone())).simplify();
		}
	}
}

// lcm divide: divides a product by a factor.
// assumes that the divisor is a factor of the product
/**
 *
 * @param {Expression} lcm
 * @param {ExpressionType} divisor
 * @returns {Product} - quotient as simplified product
 */
function lcm_divide(lcm, divisor) {
	if (lcm.expression instanceof Numeral) {
		// assumes that divisor is a numeral
		return new Product(lcm.expression.divide(/** @type {Numeral} */ (divisor)));
	}
	const product = lcm.expression instanceof Product ? lcm.expression : new Product(lcm.expression);
	if (divisor instanceof Numeral) {
		return new Product(product.coeff.divide(divisor), ...product.factors);
	} else if (divisor instanceof Exponent) {
		/** @type {ExpressionType[]} */
		const factors = [];
		for (const factor of product.factors) {
			if (
				factor instanceof Exponent &&
				factor.base.toLexicalString() === divisor.base.toLexicalString() &&
				factor.power instanceof Numeral &&
				divisor.power instanceof Numeral
			) {
				factors.push(new Exponent(factor.base, factor.power.minus(divisor.power)));
			} else {
				factors.push(factor);
			}
		}
		return new Product(product.coeff, ...factors);
	} else if (divisor instanceof Product) {
		/** @type {ExpressionType[]} */
		const factors = [];
		for (const factor of product.factors) {
			let divided = false;
			if (factor instanceof Exponent && factor.power instanceof Numeral) {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor instanceof Exponent &&
						divisorFactor.base.toLexicalString() === factor.base.toLexicalString() &&
						divisorFactor.power instanceof Numeral
					) {
						factors.push(new Exponent(factor.base, factor.power.minus(divisorFactor.power)));
						divided = true;
						break;
					} else if (divisorFactor.toLexicalString() === factor.base.toLexicalString()) {
						factors.push(new Exponent(factor.base, factor.power.minus(1)));
						divided = true;
						break;
					}
				}
			} else {
				for (const divisorFactor of divisor.factors) {
					if (factor.toLexicalString() === divisorFactor.toLexicalString()) {
						divided = true;
						break;
					}
				}
			}
			if (!divided) {
				factors.push(factor);
			}
		}
		return new Product(product.coeff.divide(divisor.coeff), ...factors);
	} else {
		/** @type {ExpressionType[]} */
		const factors = [];
		for (const factor of product.factors) {
			if (
				factor instanceof Exponent &&
				factor.base.toLexicalString() === divisor.toLexicalString() &&
				factor.power instanceof Numeral
			) {
				factors.push(new Exponent(factor.base, factor.power.minus(1)));
			} else if (factor.toLexicalString() !== divisor.toLexicalString()) {
				factors.push(factor);
				// remaining case: if factor = divisor, will be divided out, so no need to include in factors
			}
		}
		return new Product(product.coeff, ...factors);
	}
}
