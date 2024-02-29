import { Numeral } from '../numeral/index.js';
//import { Sum } from '../sum/index.js';
//import { Fraction } from '../numeral/fraction/index.js';
//import { Exponent } from '../exponent/index.js';

/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/** @typedef {import('../index.js').SimplifyOptions} SimplifyOptions */

/**
 * Product Class
 * @property {Numeral} coeff - the coefficient of the product
 * @property {Expression[]} factors - the factors in the product
 * */
export class Product {
	/** @type {'product'} */
	type = 'product';
	/** @type {Numeral} */
	coeff;
	/**@type {Expression[]} */
	_factorsExp;
	/**
	 * Creates a Product
	 * @param {Expression[]|[number|Numeral, ...Expression[]]} factors
	 */
	constructor(...factors) {
		if (factors.length === 0) {
			this.coeff = new Numeral(1);
			this._factorsExp = [];
			return;
		}
		const first_term = factors[0];
		if (typeof first_term === 'number') {
			this.coeff = new Numeral(first_term);
			factors = /** @type {Expression[]}*/ (factors.slice(1));
		} else if (first_term instanceof Numeral) {
			this.coeff = first_term;
			factors = /** @type {Expression[]}*/ (factors.slice(1));
		} else if (first_term.expression instanceof Numeral) {
			this.coeff = first_term.expression;
			factors = /** @type {Expression[]}*/ (factors.slice(1));
		} else {
			this.coeff = new Numeral(1);
			factors = /** @type {Expression[]}*/ (factors);
		}
		this._factorsExp = factors;
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		const { multiplicationSign, mixedFractions } = {
			multiplicationSign: '',
			mixedFractions: false,
			...options,
		};
		if (this.factors.length === 0) return this.coeff.toString();
		let str = this.coeff.is.one() ? '' : this.coeff.is.negative_one() ? '- ' : `${this.coeff}`;
		if (multiplicationSign && this.coeff.is.negative_one()) {
			str = '- 1';
		}
		for (let factor of this.factors) {
			const times = str === '' ? '' : multiplicationSign;
			if (
				(factor instanceof Numeral && factor.number.is.negative()) ||
				(factor.type === 'sum' && factor.terms.length > 1) ||
				(factor instanceof Numeral &&
					(!this.coeff.abs().is.one() || this.factors.length > 1) &&
					(factor.is.negative() || multiplicationSign === '')) ||
				(factor instanceof Product && factor.coeff.is.negative())
			) {
				// these should have brackets
				str += `${times}\\left( ${factor.toString({ mixedFractions })} \\right)`;
			} else {
				str += `${times}${factor.toString({ mixedFractions })}`;
			}
		}
		return str;
	}

	/**
	 * @param {{coeff?: boolean}} [options] - whether to include coefficient. default: true
	 * @returns {string}
	 */
	toLexicalString(options) {
		const { coeff } = { coeff: true, ...options };
		const str = coeff ? this.coeff.toLexicalString() : '';
		return (
			str +
			this._factorsExp
				.map((factor) => factor._to_lexical_string())
				.toSorted()
				.join('*')
		);
	}

	/**
	 * @returns {Expression} new expression with coefficient set to 1. Simplified by default
	 */
	toUnit() {
		const factors = this._factorsExp.map((factor) => factor.clone());
		// to prevent usage of expression constructor
		const dummy = factors[0].clone();
		dummy.expression = new Product(...factors);
		dummy.expression.coeff = new Numeral(1);
		return dummy;
	}

	/**
	 * @param {number|Numeral} x
	 * @returns {Product}
	 */
	_multiply_into_coeff(x) {
		const result = this.clone();
		result.coeff = result.coeff.times(x);
		return result;
	}

	/**
	 * @param {Expression} x
	 * @returns {Product}
	 */
	_multiply_into_factors(x) {
		const result = this.clone();
		result._factorsExp.push(x.clone());
		return result;
	}

	/**
	 * @returns {Product}
	 */
	clone() {
		const factors = this._factorsExp.map((factor) => factor.clone());
		const unit = new Product(...factors);
		unit.coeff = this.coeff.clone();
		return unit;
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify(options) {
		const { product, numeral, sum, quotient, exponent, brackets } = {
			product: true,
			numeral: true,
			sum: true,
			quotient: true,
			exponent: true,
			brackets: true,
			...options,
		};
		/** @type {number[]} */
		const indices = [];
		for (const [i, factor] of this._factorsExp.entries()) {
			factor.simplify({ product, numeral, sum, quotient, exponent, brackets });
			if (factor.expression instanceof Numeral) {
				this.coeff = this.coeff.times(factor.expression);
				indices.push(i);
			}
		}
		this._factorsExp = this._factorsExp.filter((_, i) => !indices.includes(i));
		if (product) {
			this._flatten();
		}
		return this;
	}

	/**
	 * flattens product
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_flatten() {
		let coeff = this.coeff;
		/** @type {Expression[]} */
		let factors = [];
		for (const term of this._factorsExp) {
			if (term.expression.type === 'sum') {
				term.expression._flatten();
				factors.push(term);
			} else if (term.expression instanceof Product) {
				term.expression._flatten();
				coeff = coeff.times(term.expression.coeff);
				factors = factors.concat(term.expression._factorsExp);
			} else {
				factors.push(term);
			}
		}
		this._factorsExp = factors;
		this.coeff = coeff;
		return this;
	}

	//! boolean methods
	is = {
		/**
		 * checks if coefficient is negative
		 * @return {boolean}
		 * */
		negative: () => this.coeff.number.is.negative(),
	};

	////! arithmetic methods
	///**
	// * absolute value (to coefficient)
	// * @returns {Product}
	// */
	//abs() {
	//	const factors = this.factors.map((factor) => factor.clone());
	//	return new Product(this.coeff.abs(), ...factors);
	//}

	/** @returns {Product} */
	negative() {
		const result = this.clone();
		result.coeff = result.coeff.negative();
		return result;
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {Product}
	 */
	subIn(scope, options) {
		const factors = this._factorsExp.map((factor) => factor.subIn(scope, options));
		return new Product(this.coeff, ...factors);
	}

	////! getters
	/**
	 * exposes the factors underneath the expression wrapper
	 * @returns {ExpressionType[]}
	 */
	get factors() {
		return this._factorsExp.map((factor) => factor.expression);
	}
}
