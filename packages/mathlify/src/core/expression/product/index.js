import { Numeral } from '../numeral/index.js';
//import { Sum } from '../sum/index.js';
//import { Fraction } from '../numeral/fraction/index.js';
import { Exponent } from '../exponent/index.js';

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
	 * @param {Expression[]|[number|Numeral|Expression, ...Expression[]]} factors
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
		} else if (first_term.node instanceof Numeral) {
			this.coeff = first_term.node;
			factors = /** @type {Expression[]}*/ (factors.slice(1));
		} else {
			this.coeff = new Numeral(1);
			// TODO: consider changing
			// workaround for typing
			// eslint-disable-next-line
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
		dummy.node = new Product(...factors);
		dummy.node.coeff = new Numeral(1);
		return dummy;
	}

	// /**
	//  * @param {Expression} x
	//  * @returns {Product}
	//  */
	// _multiply_into_factors(x) {
	// 	const result = this.clone();
	// 	result._factorsExp.push(x.clone());
	// 	return result;
	// }

	/**
	 * @returns {Product}
	 */
	clone() {
		const factors = this._factorsExp.map((factor) => factor.clone());
		return new Product(this.coeff.clone(), ...factors);
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
		for (const factor of this._factorsExp) {
			factor.simplify({ product, numeral, sum, quotient, exponent, brackets });
		}
		if (product) {
			this._combine_factors();
			this._flatten();
		}
		return this;
	}

	/**
	 * extracts numeric factors into coefficient
	 * combines singletons and exponents with numeric powers into an exponent
	 * eg. combines $4 \cdot x \cdot x^2 \cdot 3$ into $12x^3$
	 * @returns {this}
	 */
	_combine_factors() {
		// lexical string: [indices, power, base expression]
		/** @type {Object.<string,[number[],Numeral,Expression]>} */
		const termMap = {};
		/** @type {string[]} */
		const orderedKeys = [];
		/** @type {number[]} */
		const indicesToRemove = [];
		for (const [i, factor] of this.factors.entries()) {
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
				this.coeff = this.coeff.times(factor);
				indicesToRemove.push(i);
			} else {
				const key = factor.toLexicalString();
				const val = termMap[key];
				if (val) {
					val[0].push(i);
					val[1] = val[1].plus(1);
				} else {
					orderedKeys.push(key);
					termMap[key] = [[i], new Numeral(1), this._factorsExp[i]];
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
					const newExponent = power.is.one() ? base : base._new_exp(new Exponent(base, base._new_exp(power)));
					this._factorsExp[indices[0]] = newExponent;
					indicesToRemove.push(...indices.slice(1));
				}
			}
		}
		this._factorsExp = this._factorsExp.filter((_, i) => !indicesToRemove.includes(i));
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
			if (term.node.type === 'sum') {
				term.node._flatten();
				factors.push(term);
			} else if (term.node instanceof Product) {
				term.node._flatten();
				coeff = coeff.times(term.node.coeff);
				factors = factors.concat(term.node._factorsExp);
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

	/**
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this._factorsExp.some((factor) => factor.contains(variable));
	}

	////! getters
	/**
	 * exposes the factors underneath the expression wrapper
	 * @returns {ExpressionType[]}
	 */
	get factors() {
		return this._factorsExp.map((factor) => factor.node);
	}
}
