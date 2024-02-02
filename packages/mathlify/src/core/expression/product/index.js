import { Variable } from '../variable/index.js';
import { Numeral } from '../numeral/index.js';
import { Expression } from '../index.js';
import { Fraction } from '../numeral/fraction/index.js';
import { Sum } from '../sum/index.js';
import { Quotient } from '../quotient/index.js';

/**
 * Product Class
 * @property {Numeral} coeff - the coefficient of the product
 * @property {Expression[]} factors - the factors in the product
 * */
export class Product {
	/** @type {Numeral} */
	coeff;
	/**@type {Expression[]} */
	factors;
	/**
	 * Creates a Product
	 * First argument, if of Numeral|Fraction|number type, is taken as the coefficient
	 * @param {...(Expression|Sum|Quotient|Product|Variable|string|Numeral|Fraction|number)} terms
	 */
	constructor(...terms) {
		if (terms.length === 0) {
			this.coeff = new Numeral(1);
			this.factors = [];
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
		this.factors = terms.map((t) => {
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
			const exp = term.expression;
			const sign = str === '' ? '' : multiplicationSign;
			if ((exp instanceof Numeral && exp.number.is.negative()) || (exp instanceof Sum && exp.terms.length > 1)) {
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
			this.factors
				.map((factor) => factor.toLexicalString())
				.toSorted()
				.join('*')
		);
	}

	/**
	 * @returns {Expression} new expression with coefficient set to 1. Simplified by default
	 */
	toUnit() {
		const factors = this.factors.map((factor) => factor.clone());
		return new Expression(new Product(1, ...factors)).simplify();
	}

	/**
	 * @returns {Product}
	 */
	clone() {
		const factors = this.factors.map((factor) => factor.clone());
		return new Product(this.coeff.clone(), ...factors);
	}

	/**
	 * @param {{product?: boolean, numeral?: boolean, sum?: boolean, quotient?: boolean}} [options]
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify(options) {
		const { product, numeral, sum, quotient } = {
			product: true,
			numeral: true,
			sum: true,
			quotient: true,
			...options,
		};
		for (let factor of this.factors) {
			factor.simplify({ product, numeral, sum, quotient });
		}
		if (product) {
			this._flatten();
			this._extract_numerals();
		}
		return this;
	}

	/**
	 * combines numerals in the product as the coefficient
	 * WARNING: mutates current instance
	 * @returns {this}
	 */
	_extract_numerals() {
		/** @type {number[]} */
		const indices_of_numerals = [];
		let coeff = this.coeff;
		for (let i = 0; i < this.factors.length; i++) {
			const exp = this.factors[i].expression;
			if (exp instanceof Numeral) {
				indices_of_numerals.push(i);
				coeff = coeff.times(exp.number);
			}
		}
		if (indices_of_numerals.length <= 0) return this;
		this.factors = this.factors.filter((_, i) => !indices_of_numerals.includes(i));
		this.coeff = coeff;
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
		for (const term of this.factors) {
			const exp = term.expression;
			if (exp instanceof Sum) {
				exp._flatten();
				factors.push(term);
			} else if (exp instanceof Product) {
				exp._flatten();
				coeff = coeff.times(exp.coeff);
				factors = factors.concat(exp.factors);
			} else {
				factors.push(term);
			}
		}
		this.factors = factors;
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
		for (const factor of this.factors) {
			factor.subIn(scope, options);
		}
		return this;
	}
}