import { Variable } from '../variable/index.js';
import { Numeral } from '../numeral/index.js';
import { Expression } from '../index.js';
import { Fraction } from '../numeral/fraction/index.js';
import { Product } from '../product/index.js';
import { Quotient } from '../quotient/index.js';
import { Brackets, Fn } from '../fn/index.js';

/**
 * Sum Class
 * @property {Expression[]} terms - the terms in the sum
 * */
export class Sum {
	/**@type {Expression[]} */
	terms;
	/**
	 * Creates a Sum
	 * @param {...(Expression|Sum|Product|Variable|string|Numeral|Fraction|number|Quotient|Fn|Brackets)} terms
	 */
	constructor(...terms) {
		const termsExp = terms.map((t) => {
			return t instanceof Expression ? t : new Expression(t);
		});
		this.terms = termsExp;
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options]
	 * @returns {string}
	 */
	toString(options) {
		if (this.terms.length === 0) return '0';
		if (this.terms.length === 1) return this.terms[0].toString();
		const firstTerm = this.terms[0];
		let str = `${firstTerm.toString(options)}`;
		for (let term of this.terms.slice(1)) {
			const exp = term.expression;
			if ((exp instanceof Numeral && exp.number.is.negative()) || (exp instanceof Product && exp.is.negative())) {
				// negative sign is already included
				str += ` ${exp.toString(options)}`;
			} else {
				str += ` + ${term.toString(options)}`;
			}
		}
		return str;
	}

	/**
	 * @returns {string}
	 */
	toLexicalString() {
		return this.terms
			.map((term) => term.toLexicalString())
			.toSorted()
			.join('+');
	}

	/**
	 * @returns {Sum}
	 */
	clone() {
		const terms = this.terms.map((term) => term.clone());
		return new Sum(...terms);
	}

	/**
	 * @param {{product?: boolean, numeral?: boolean, sum?: boolean}} [options]
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
		for (let term of this.terms) {
			term.simplify({ product, numeral, sum, quotient });
		}
		if (sum) {
			this._flatten();
			this._combine_like_terms();
			this._remove_zeroes();
		}
		return this;
	}

	/**
	 * removes zeroes from the sum
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_remove_zeroes() {
		this.terms = this.terms.filter((term) => {
			const exp = term.expression;
			if (exp instanceof Numeral) {
				return exp.number.is.nonzero();
			}
			return true;
		});
		return this;
	}

	/**
	 * flattens sum
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_flatten() {
		/** @type {Expression[]} */
		const terms = [];
		for (const term of this.terms) {
			const exp = term.expression;
			if (exp instanceof Sum) {
				exp._flatten();
				terms.push(...exp.terms);
			} else if (exp instanceof Product) {
				exp._flatten();
				terms.push(term);
			} else {
				terms.push(term);
			}
		}
		this.terms = terms;
		return this;
	}

	/**
	 * combine like terms
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_combine_like_terms() {
		// lexical string: [indices, coeff, expression]
		/** @type {Object.<string,[number[],Numeral,Expression]>} */
		const termMap = {};
		/** @type {string[]} */
		const orderedKeys = [];
		for (const [i, term] of this.terms.entries()) {
			const key = term.expression instanceof Numeral ? 'numeral' : term.toLexicalString({ coeff: false });
			const val = termMap[key];
			if (val) {
				val[0].push(i);
				const exp = term.expression;
				if (exp instanceof Product) {
					val[1] = val[1].plus(exp.coeff);
				} else if (exp instanceof Numeral) {
					val[1] = val[1].plus(exp.number);
				} else {
					val[1] = val[1].plus(1);
				}
			} else {
				orderedKeys.push(key);
				const exp = term.expression;
				if (exp instanceof Product) {
					termMap[key] = [[i], exp.coeff, exp.toUnit()];
				} else if (exp instanceof Numeral) {
					termMap[key] = [[i], exp.clone(), term.clone()];
				} else {
					termMap[key] = [[i], new Numeral(1), term.clone()];
				}
			}
		}
		/** @type {number[]} */
		const indicesToRemove = [];
		for (const key of orderedKeys) {
			const [indices, coeff, expression] = termMap[key];
			if (indices.length > 1) {
				const firstIndex = indices[0];
				if (key === 'numeral') {
					this.terms[firstIndex].expression = coeff;
				} else {
					this.terms[firstIndex].expression = new Product(coeff, expression).simplify();
				}
				indices.shift();
				indicesToRemove.push(...indices);
			}
		}
		this.terms = this.terms.filter((_, i) => !indicesToRemove.includes(i));
		return this;
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		for (const term of this.terms) {
			term.subIn(scope, options);
		}
		return this;
	}
}
