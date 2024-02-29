import { Variable } from './variable/index.js';
import { Numeral, Fraction } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Quotient } from './quotient/index.js';
import { Fn, Brackets } from './fn/index.js';
import { Product } from './product/index.js';
import { Exponent } from './exponent/index.js';
export { Variable, Numeral, Fraction, Sum, Product, Quotient, Exponent, Fn, Brackets };
import {
	remove_nested_brackets,
	remove_singletons,
	resolveOptions,
	simplify_exponent,
	expand_expression,
	expand_product,
	sub_in,
	to_ExpressionType,
	common_denominator,
	combine_fraction,
	expression_lcm_two,
	expression_gcd,
	divide_by_factor,
} from './utils/index.js';

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
	 * Creates an Expression.
	 * We recommend using the provided macros (eg sum, product, etc)
	 * to create expressions rather than using the constructor directly
	 * @param {ExpressionType|number|string} expression
	 */
	constructor(expression) {
		this.expression = to_ExpressionType(expression);
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		return this.expression.toString({
			multiplicationSign: this.multiplicationSign,
			mixedFractions: this.mixedFractions,
			...options,
		});
	}

	/**
	 * @returns {Expression}
	 */
	clone() {
		let exp = new Expression(this.expression.clone());
		exp.mixedFractions = this.mixedFractions;
		exp.multiplicationSign = this.multiplicationSign;
		return exp;
	}

	/**
	 * simplifies the expression
	 * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify(options) {
		const { brackets, product, sum, numeral, quotient, exponent } = resolveOptions(options);
		if (brackets) this._remove_brackets();
		if (numeral && this.expression instanceof Numeral) this.expression.simplify();
		if (
			this.expression instanceof Sum ||
			this.expression instanceof Product ||
			this.expression instanceof Quotient ||
			this.expression instanceof Exponent
		) {
			this.expression.simplify({ product, sum, numeral, quotient, exponent, brackets });
		}
		if (exponent) this._simplify_exponent({ product, sum, numeral, quotient, exponent, brackets });
		if (product) this._combine_factors_in_product();
		this._remove_singletons({ product, sum, quotient });
		return this;
	}

	/**
	 * expands either products, or products within a sum
	 * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification
	 * numeratorOnly: only expands numerator and leaves denominator as is
	 * @returns {this}
	 */
	expand(options) {
		expand_expression(this, options);
		if (!options?.verbatim) this.simplify();
		return this;
	}

	/**
	 * combines fraction, with full simplification
	 * @returns {this}
	 * Warning: mutates current instance
	 */
	combine_fraction() {
		this._common_denominator();
		this._combine_fraction();
		this.expand({ numeratorOnly: true });
		this._remove_common_factors();
		return this;
	}

	/**
	 * rearranges the terms of a sum in place
	 * @param {number[]} order
	 * @returns {this}
	 */
	rearrange(order) {
		if (this.expression instanceof Sum) this.expression.rearrange(order);
		return this;
	}

	/**
	 * factorizes a sum into a product by extracting common factors
	 * @param {{verbatim?: boolean}} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
	 * @returns {this}
	 */
	factorize(options) {
		if (!(this.expression instanceof Sum)) return this;
		const commonFactor = Expression.gcd(...this.expression._termsExp);
		if (commonFactor.expression instanceof Numeral && commonFactor.expression.is.one()) return this;
		const factorizedTerms = this.expression._termsExp.map((term) => divide_by_factor(term, commonFactor.expression));
		/** @type {Expression|Sum} */
		let sum = new Sum(...factorizedTerms);
		if (!options?.verbatim) {
			sum = new Expression(sum).expand().factorize();
		}
		this.expression = new Product(
			new Expression(commonFactor.expression),
			sum instanceof Sum ? new Expression(sum) : sum,
		);
		this.expression.simplify();
		return this;
	}

	//! arithmetic methods - unlike the previous methods, these do not mutate the current instance
	/**
	 * negative of expression
	 * @returns {Expression}
	 */
	negative() {
		const exp = this.expression;
		if (exp instanceof Numeral || exp instanceof Product) return new Expression(exp.negative());
		throw new Error('negative not supported for this type at the moment');
	}

	/**
	 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {Expression}
	 */
	subIn(scope, options) {
		return sub_in(this, scope, options);
	}

	//! these methods provide quick access to the underlying expression-subtypes
	/** @returns {[Expression, Expression]} */
	getQuotientTerms() {
		const exp = this.expression;
		if (exp instanceof Quotient) {
			return [exp.num, exp.den];
		}
		throw new Error('Expression is not a quotient');
	}
	/** @returns {Numeral} */
	getNumeral() {
		const exp = this.expression;
		if (exp instanceof Numeral) {
			return exp;
		}
		throw new Error('Expression is not a numeral');
	}
	/** @return {[Numeral, Expression[]]} */
	getProductTerms() {
		const exp = this.expression;
		if (exp instanceof Product) {
			return [exp.coeff, exp._factorsExp];
		}
		throw new Error('Expression is not a product');
	}

	//! methods meant primarily for internal used are prefixed with _ and in snake_case
	/**
	 * @param {{coeff?: boolean}} [options] - whether to include coefficient for a product. default: true
	 * @returns {string}
	 * */
	_to_lexical_string(options) {
		return this.expression.toLexicalString(options);
	}
	/**
	 * expands products
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {this}
	 */
	_expand_product(options) {
		const sum = expand_product(this);
		if (sum !== undefined) this.expression = sum;
		if (!options?.verbatim) this.simplify();
		return this;
	}

	//! the following 3 methods are used in the simplify method
	/**
	 * removes singleton
	 * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_singletons(options) {
		const exp = remove_singletons(this, { product: true, sum: true, quotient: true, ...options });
		if (exp !== undefined) this.expression = exp;
		return this;
	}
	/**
	 * removes brackets
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_brackets() {
		remove_nested_brackets(this);
		if (this.expression instanceof Fn && this.expression.fn instanceof Brackets) {
			this.expression = this.expression.fn.expression.expression;
		}
		return this;
	}
	/**
	 * simplifies exponents:
	 * numeral^integer -> numeral
	 * base^0 -> 1
	 * base^1 -> base
	 * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_simplify_exponent(options) {
		const exp = simplify_exponent(this, options);
		if (exp !== undefined) this.expression = exp;
		return this;
	}

	//! the following 3 methods are used in the combine_fraction method
	/**
	 * common denominator:
	 * for a sum, convert all terms to quotients with the same denominator
	 * @returns {this} - a sum with quotients with same denominator as its terms
	 * Warning: mutates current instance
	 */
	_common_denominator() {
		common_denominator(this);
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
		const quotient = combine_fraction(this);
		if (quotient !== undefined) this.expression = quotient;
		if (!options?.verbatim) this.simplify();
		return this;
	}
	/**
	 * removes common factors
	 * @returns {this}
	 * Warning: mutates current instance
	 */
	_remove_common_factors() {
		try {
			const [num, den] = this.getQuotientTerms().map((x) => x.clone().factorize());
			const gcd = Expression.gcd(num, den);
			if (gcd.expression instanceof Numeral && gcd.expression.is.one()) return this;
			const newNum = new Expression(divide_by_factor(num, gcd.expression)).simplify();
			const newDen = new Expression(divide_by_factor(den, gcd.expression)).simplify();
			if (newDen instanceof Numeral && newDen.is.one()) {
				this.expression = newNum.expression;
			} else {
				this.expression = new Quotient(newNum.expression, newDen.expression);
			}
			return this;
		} catch {
			return this;
		}
	}

	/**
	 * extracts numeric factors into coefficient
	 * combines singletons and exponents with numeric powers into an exponent
	 * eg. combines $4 \cdot x \cdot x^2 \cdot 3$ into $12x^3$
	 * @returns {this}
	 */
	_combine_factors_in_product() {
		if (!(this.expression instanceof Product)) return this;
		const p = this.expression;
		// lexical string: [indices, power, base expression]
		/** @type {Object.<string,[number[],Numeral,Expression]>} */
		const termMap = {};
		/** @type {string[]} */
		const orderedKeys = [];
		/** @type {number[]} */
		const indicesToRemove = [];
		for (const [i, factor] of p.factors.entries()) {
			if (factor instanceof Exponent && factor.power instanceof Numeral) {
				const key = factor.base.toLexicalString();
				const val = termMap[key];
				if (val) {
					val[0].push(i);
					val[1] = val[1].plus(factor.power);
				} else {
					orderedKeys.push(key);
					termMap[key] = [[i], factor.power, factor.baseExp.clone()];
				}
			} else if (factor instanceof Numeral) {
				// extracts numeric factors into coefficient
				p.coeff = p.coeff.times(factor);
				indicesToRemove.push(i);
			} else {
				const key = factor.toLexicalString();
				const val = termMap[key];
				if (val) {
					val[0].push(i);
					val[1] = val[1].plus(1);
				} else {
					orderedKeys.push(key);
					termMap[key] = [[i], new Numeral(1), p._factorsExp[i]];
				}
			}
		}
		for (const key of orderedKeys) {
			const [indices, power, base] = termMap[key];
			if (indices.length > 1) {
				// combine
				if (power.is.zero()) {
					indicesToRemove.push(...indices);
				} else {
					const newExponent = power.is.one() ? base : new Expression(new Exponent(base, new Expression(power)));
					p._factorsExp[indices[0]] = newExponent;
					indicesToRemove.push(...indices.slice(1));
				}
			}
		}
		p._factorsExp = p._factorsExp.filter((_, i) => !indicesToRemove.includes(i));
		return this;
	}

	//! static methods
	/**
	 * get gcd of expressions
	 * @param {Expression[]} exps
	 * @returns {Expression}
	 * WARNING: returns negative gcd if all terms are negative
	 */
	static gcd(...exps) {
		return expression_gcd(...exps);
	}

	/**
	 * get lcm of two expressions
	 * @param {Expression} exp1
	 * @param {Expression} exp2
	 * @returns {Expression}
	 */
	static lcm(exp1, exp2) {
		return expression_lcm_two(exp1, exp2);
	}
}
