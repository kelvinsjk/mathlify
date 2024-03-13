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
	expand_expression_,
	expand_product,
	common_denominator_,
	combine_fraction,
	//expression_lcm_two,
	expression_gcd,
	divide_by_factor,
} from './utils/index.js';

/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').QuotientShorthand} FractionShorthand */
/** @typedef {Sum|Product|Quotient|Exponent|Variable|Numeral|Fn} ExpressionType */
/** @typedef {{verbatim?: boolean, brackets?: boolean, product?: boolean, sum?: boolean, quotient?: boolean, numeral?: boolean, exponent?: boolean}} SimplifyOptions */
/** @typedef {{verbatim?: boolean, numeratorOnly?: boolean}} ExpansionOptions */

/** Expression Class
 * @property {ExpressionType} expression the tree representation of the expression
 *
 */
export class Expression {
	/** @type {ExpressionType} */
	node;

	/**
	 * Experimental: may be changed in the future
	 * @type {string}
	 * */
	_multiplicationSign = '';
	/**
	 * Experimental: may be changed in the future
	 * @type {boolean}
	 * */
	_mixedFractions = false;

	/**
	 * Creates an Expression.
	 * We recommend using the provided macros (eg sum, product, etc)
	 * to create expressions rather than using the constructor directly
	 * @param {ExpressionType|number|string} expression
	 */
	constructor(expression) {
		const exp =
			typeof expression === 'number'
				? new Numeral(expression)
				: typeof expression === 'string'
					? new Variable(expression)
					: expression;
		this.node = exp;
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - to change the multiplication sign and whether to return mixed fractions
	 * @returns {string} the LaTeX string representation of the expression
	 */
	toString(options) {
		return this.node.toString({
			multiplicationSign: this._multiplicationSign,
			mixedFractions: this._mixedFractions,
			...options,
		});
	}

	/**
	 * @returns {Expression} a clone of the current instance
	 */
	clone() {
		let exp = new Expression(this.node.clone());
		exp._mixedFractions = this._mixedFractions;
		exp._multiplicationSign = this._multiplicationSign;
		return exp;
	}

	/**
	 * simplifies the expression
	 * @param {SimplifyOptions} [options] - options for which types to simplify
	 * @returns {this} the current instance after simplification. Note that this method mutates the current instance
	 */
	simplify(options) {
		const { verbatim, brackets, product, sum, numeral, quotient, exponent } = resolveOptions(options);
		if (verbatim) return this;
		if (brackets) this._remove_brackets_();
		if (numeral && this.node instanceof Numeral) this.node.simplify();
		if (
			this.node instanceof Sum ||
			this.node instanceof Product ||
			this.node instanceof Quotient ||
			this.node instanceof Exponent
		) {
			this.node.simplify({ product, sum, numeral, quotient, exponent, brackets });
		}
		if (exponent) this._simplify_exponent_({ product, sum, numeral, quotient, exponent, brackets });
		this._remove_singletons_({ product, sum, quotient });
		return this;
	}

	/**
	 * expands either products, products within a sum/quotient, or exponents with positive integral powers
	 * @param {ExpansionOptions} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
	 * @returns {Expression}
	 */
	expand(options) {
		return this.clone()._expand_(options);
	}

	/**
	 * combines fractions within a Sum, with full simplification
	 * @returns {Expression}
	 */
	combineFraction() {
		return this.clone()
			._common_denominator_()
			._combine_fraction_()
			._expand_({ numeratorOnly: true })
			._remove_common_factors_();
	}

	/**
	 * rearranges the terms of a sum in place
	 * TODO: add support for rearranging products
	 * WARNING: experimental API to be finalized in the future
	 * @param {number[]} order
	 * @returns {this}
	 */
	_rearrange_(order) {
		if (this.node instanceof Sum) this.node.rearrange(order);
		return this;
	}

	/** factorization methods */
	factorize = {
		/**
		 * factorizes a sum by extracting common factors
		 * @param {{verbatim?: boolean}} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
		 * @returns {Expression}
		 */
		commonFactor: (options) => {
			if (!(this.node instanceof Sum)) return this;
			const commonFactor = Expression.gcd(...this.node._termsExp);
			if (commonFactor.node instanceof Numeral && commonFactor.node.is.one()) return this;
			const factorizedTerms = this.node._termsExp
				.map((term) => divide_by_factor(term, commonFactor.node))
				.map((exp) => new Expression(exp));
			/** @type {Expression|Sum} */
			let sum = new Expression(new Sum(...factorizedTerms));
			if (!options?.verbatim) {
				sum = sum.expand();
			}
			const product = new Product(new Expression(commonFactor.node), sum).simplify();
			return new Expression(product);
		},
	};

	/**
	 * subs in variables for other expressions
	 * @param {Record<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {Expression}
	 */
	subIn(scope, options) {
		return sub_in(this, scope, options);
	}

	/**
	 * @param {string|Variable} variable
	 * @returns {boolean} whether the expression contains the variable
	 */
	contains(variable) {
		return this.node.contains(typeof variable === 'string' ? variable : variable.name);
	}

	//! Arithmetic methods
	/**
	 * negative of expression
	 * @returns {Expression}
	 */
	negative() {
		const exp = this.node;
		if (exp instanceof Numeral || exp instanceof Product) return new Expression(exp.negative());
		return new Expression(new Product(-1, this.clone())).expand();
	}
	/**
	 * sum of two expressions
	 * @param {number|string|Expression} exp2
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {Expression}
	 */
	plus(exp2, options) {
		const sum = new Expression(new Sum(this.clone(), to_Expression(exp2).clone()));
		return sum.simplify(options);
	}
	/**
	 * difference of two expressions
	 * @param {number|string|Expression} exp2
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 */
	minus(exp2, options) {
		const negativeTerm = new Expression(new Product(-1, to_Expression(exp2).clone()));
		if (!options?.verbatim) negativeTerm.expand();
		const diff = new Expression(new Sum(this.clone(), negativeTerm));
		return diff.simplify(options);
	}
	/**
	 * product of two expressions
	 * @param {number|string|Expression} exp2
	 * @param {{preMultiply?: boolean, verbatim?: boolean}} [options] - default to multiplying exp2 behind
	 * @returns {Expression}
	 */
	times(exp2, options) {
		exp2 = to_Expression(exp2).clone();
		const product = options?.preMultiply
			? new Expression(new Product(this.clone(), exp2))
			: new Expression(new Product(exp2, this.clone()));
		return product.simplify(options);
	}
	/**
	 * quotient of two expressions
	 * @param {number|string|Expression} exp2
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 */
	divideBy(exp2, options) {
		const quotient = new Expression(new Quotient(this.clone(), to_Expression(exp2).clone()));
		return quotient.simplify(options);
	}

	//! these methods provide quick access to the underlying expression-subtypes
	/** @returns {[Expression, Expression]} */
	_getQuotientTerms() {
		const exp = this.node;
		if (exp instanceof Quotient) {
			return [exp.num, exp.den];
		}
		throw new Error('Expression is not a quotient');
	}
	/** @returns {Numeral} */
	_getNumeral() {
		const exp = this.node;
		if (exp instanceof Numeral) {
			return exp;
		}
		throw new Error('Expression is not a numeral');
	}
	/** @return {[Numeral, Expression[]]} */
	_getProductTerms() {
		const exp = this.node;
		if (exp instanceof Product) {
			return [exp.coeff, exp._factorsExp];
		}
		throw new Error('Expression is not a product');
	}
	/** @return {Expression[]} */
	_getSumTerms() {
		const exp = this.node;
		if (exp instanceof Sum) {
			return exp._termsExp;
		}
		throw new Error('Expression is not a sum');
	}

	//! methods meant primarily for internal used are prefixed with _ and in snake_case
	/**
	 * @param {{coeff?: boolean}} [options] - whether to include coefficient for a product. default: true
	 * @returns {string}
	 * */
	_to_lexical_string(options) {
		return this.node.toLexicalString(options);
	}
	/**
	 * expand the expression, mutating the current instance
	 * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
	 * @returns {this}
	 */
	_expand_(options) {
		expand_expression_(this, options);
		return this.simplify(options);
	}
	/**
	 * expands products
	 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {this}
	 */
	_expand_product_(options) {
		const sum = expand_product(this);
		if (sum !== undefined) this.node = sum;
		return this.simplify(options);
	}

	//! the following 3 methods are used in the simplify method
	/**
	 * removes singleton
	 * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_singletons_(options) {
		const exp = remove_singletons(this, { product: true, sum: true, quotient: true, ...options });
		if (exp !== undefined) this.node = exp;
		return this;
	}
	/**
	 * removes brackets
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_brackets_() {
		remove_nested_brackets(this);
		if (this.node instanceof Fn && this.node.fn instanceof Brackets) {
			this.node = this.node.fn.expression.node;
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
	_simplify_exponent_(options) {
		const exp = simplify_exponent(this, options);
		if (exp !== undefined) this.node = exp;
		return this;
	}

	//! the following 3 methods are used in the combine_fraction method
	/**
	 * common denominator:
	 * for a sum, convert all terms to quotients with the same denominator
	 * @returns {this} - a sum with quotients with same denominator as its terms
	 * Warning: mutates current instance
	 */
	_common_denominator_() {
		common_denominator_(this);
		return this;
	}
	/**
	 * combines into one fraction
	 * (to be used strictly after 'this._common_denominator()` is called. will not work otherwise
	 * @param {{verbatim?: boolean}} [options] - simplifies result by default
	 * @returns {this}
	 * Warning: mutate current instance
	 */
	_combine_fraction_(options) {
		const quotient = combine_fraction(this);
		if (quotient !== undefined) this.node = quotient;
		return this.simplify(options);
	}
	/**
	 * removes common factors
	 * @returns {this}
	 * Warning: mutates current instance
	 */
	_remove_common_factors_() {
		try {
			const [num, den] = this._getQuotientTerms().map((x) => x.clone().factorize.commonFactor());
			const gcd = Expression.gcd(num, den);
			if (gcd.node instanceof Numeral && gcd.node.is.one()) return this;
			const newNum = new Expression(divide_by_factor(num, gcd.node)).simplify();
			const newDen = new Expression(divide_by_factor(den, gcd.node)).simplify();
			if (newDen.node instanceof Numeral && newDen.node.is.one()) {
				this.node = newNum.node;
			} else {
				this.node = new Quotient(newNum, newDen);
			}
			return this;
		} catch {
			return this;
		}
	}

	/**
	 * workaround for `new Expression(...)` to avoid circular dependency
	 * @param {ExpressionType} exp
	 * @returns {Expression}
	 */
	_new_exp(exp) {
		return new Expression(exp);
	}
	/**
	 * workaround for `Expression.gcd(...)` to avoid circular dependency
	 * @param {Expression} exp2
	 * @returns {Expression}
	 */
	_gcd(exp2) {
		return Expression.gcd(this, exp2);
	}
	/**
	 * workaround for `Expression.divide_by_factor(...)` to avoid circular dependency
	 * @param {Expression} factor
	 * @returns {Expression}
	 */
	_divide_by_factor(factor) {
		return new Expression(divide_by_factor(this, factor.node)).simplify();
	}

	//! static methods
	/**
	 * get gcd of expressions, returning a negative gcd if all terms are negative
	 * @param {Expression[]} exps
	 * @returns {Expression}
	 */
	static gcd(...exps) {
		return expression_gcd(...exps);
	}

	///**
	// * get lcm of two expressions
	// * @param {Expression} exp1
	// * @param {Expression} exp2
	// * @returns {Expression}
	// */
	//static lcm(exp1, exp2) {
	//	return expression_lcm_two(exp1, exp2);
	//}
}

// additional functions that rely heavily on calling new Expression class that must makes it hard to be located in the utils module

/**
 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
 * @returns {Object.<string,Expression>}
 */
function resolve_scope(scope) {
	/** @type {Object.<string,Expression>} */
	const scope_exp = {};
	for (const [key, value] of Object.entries(scope)) {
		scope_exp[key] = to_Expression(unpack_shorthand_single(value));
	}
	return scope_exp;
}

/**
 * @param {Expression} expression
 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
 * @returns {Expression}
 */
function sub_in(expression, scope, options) {
	const scope_exp = resolve_scope(scope);
	/** @type {Expression} */
	let exp;
	if (expression.node instanceof Variable) {
		const name = expression.node.name;
		if (name in scope_exp) {
			exp = new Expression(scope_exp[name].node.clone());
			exp._multiplicationSign = expression._multiplicationSign;
			exp._mixedFractions = expression._mixedFractions;
		} else {
			exp = expression.clone();
		}
	} else {
		exp = new Expression(expression.node.subIn(scope_exp, { verbatim: false, ...options }));
		exp._multiplicationSign = expression._multiplicationSign;
		exp._mixedFractions = expression._mixedFractions;
	}
	return exp.simplify(options);
}
/**
 * to Expression
 * @param {string|number|Fraction|Expression} exp
 * @return {Expression}
 */
export function to_Expression(exp) {
	if (typeof exp === 'string') {
		return new Expression(new Variable(exp));
	} else if (typeof exp === 'number' || exp instanceof Fraction) {
		return new Expression(new Numeral(exp, { verbatim: true }));
	}
	return exp;
}

/**
 * unpacks the fraction shorthand
 * @param {Expression|number|string|FractionShorthand} exp
 * @returns {Expression|number|string}
 */
export function unpack_shorthand_single(exp) {
	if (Array.isArray(exp)) {
		// quotient
		const [num, _, den] = exp;
		return new Expression(new Quotient(to_Expression(num), to_Expression(den))).simplify();
	} else {
		return exp;
	}
}
