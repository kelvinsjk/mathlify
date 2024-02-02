import { Expression } from '../index.js';
import { Numeral } from '../numeral/index.js';
import { Fraction } from '../numeral/fraction/index.js';
import { Sum } from '../sum/index.js';
import { Exponent } from '../exponent/index.js';

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
	/** @type {Numeral} */
	coeff;
	/**@type {Expression[]} */
	_factorsExp;
	/**
	 * Creates a Product
	 * First argument, if of Numeral|Fraction|number type, is taken as the coefficient
	 * @param {...(Expression|ExpressionType|string|Fraction|number)} terms
	 */
	constructor(...terms) {
		if (terms.length === 0) {
			this.coeff = new Numeral(1);
			this._factorsExp = [];
			return;
		}
		/** @type {Numeral} */
		let coeff = new Numeral(1);
		let firstTerm = terms[0];
		if (firstTerm instanceof Fraction || typeof firstTerm === 'number') {
			firstTerm = new Numeral(firstTerm, { verbatim: true });
		}
		if (firstTerm instanceof Numeral) {
			firstTerm = new Expression(firstTerm);
		}
		if (firstTerm instanceof Expression && firstTerm.expression instanceof Numeral) {
			coeff = firstTerm.expression;
			terms.shift();
		}
		this._factorsExp = terms.map((t) => {
			return t instanceof Expression ? t : new Expression(t);
		});
		this.coeff = coeff;
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
		for (let term of this.factors) {
			const sign = str === '' ? '' : multiplicationSign;
			if ((term instanceof Numeral && term.number.is.negative()) || (term instanceof Sum && term.terms.length > 1)) {
				// these should have brackets
				str += `${sign}\\left( ${term.toString(options)} \\right)`;
			} else {
				str += `${sign}${term.toString(options)}`;
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
				.map((factor) => factor.toLexicalString())
				.toSorted()
				.join('*')
		);
	}

	/**
	 * @returns {Expression} new expression with coefficient set to 1. Simplified by default
	 */
	toUnit() {
		const factors = this._factorsExp.map((factor) => factor.clone());
		return new Expression(new Product(1, ...factors)).simplify();
	}

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
		for (let factor of this._factorsExp) {
			factor.simplify({ product, numeral, sum, quotient, exponent, brackets });
		}
		if (product) {
			this._flatten();
			this._combine_factors();
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
				const newExponent = power.is.zero()
					? new Expression(1)
					: power.is.one()
						? base
						: new Expression(new Exponent(base, power));
				this._factorsExp[indices[0]] = newExponent;
				indicesToRemove.push(...indices.slice(1));
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
		/** @type {ExpressionType[]} */
		let factors = [];
		for (const term of this.factors) {
			if (term instanceof Sum) {
				term._flatten();
				factors.push(term);
			} else if (term instanceof Product) {
				term._flatten();
				coeff = coeff.times(term.coeff);
				factors = factors.concat(term.factors);
			} else {
				factors.push(term);
			}
		}
		this._factorsExp = factors.map((factor) => new Expression(factor));
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

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		for (const factor of this._factorsExp) {
			factor.subIn(scope, options);
		}
		return this;
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
