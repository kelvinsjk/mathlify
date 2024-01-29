import { Variable } from '../variable/index.js';
import { Numeral } from '../numeral/index.js';
import { Expression } from '../index.js';
import { Fraction } from '../numeral/fraction/index.js';

/**
 * Sum Class
 * @property {Expression[]} terms - the terms in the sum
 * */
export class Sum {
	/**@type {Expression[]} */
	terms;
	/**
	 * Creates a Sum
	 * @param {...(Expression|Sum|Variable|string|Numeral|Fraction|number)} terms
	 */
	constructor(...terms) {
		const termsExp = terms.map((t) => {
			return t instanceof Expression ? t : new Expression(t);
		});
		this.terms = termsExp;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		if (this.terms.length === 0) return '0';
		if (this.terms.length === 1) return this.terms[0].toString();
		const firstTerm = this.terms[0];
		let str = `${firstTerm}`;
		for (let term of this.terms.slice(1)) {
			const exp = term.expression;
			if (exp instanceof Numeral && exp.number.is.negative()) {
				// negative sign is already included in the numeral
				str += ` ${exp.number}`;
			} else {
				str += ` + ${term}`;
			}
		}
		return str;
	}

	/**
	 * @returns {Sum}
	 */
	clone() {
		const terms = this.terms.map((term) => term.clone());
		return new Sum(...terms);
	}

	/**
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify() {
		for (let term of this.terms) {
			term.simplify();
		}
		this._flatten();
		this._combine_numerals();
		this._remove_zeroes();
		return this;
	}

	/**
	 * combines numerals in the sum, such that there is at most one numeral
	 * WARNING: mutates current instance
	 * @returns {this}
	 */
	_combine_numerals() {
		/** @type {number[]} */
		const indices_of_numerals = [];
		let sum = new Fraction(0);
		for (let i = 0; i < this.terms.length; i++) {
			const exp = this.terms[i].expression;
			if (exp instanceof Numeral) {
				indices_of_numerals.push(i);
				sum = sum.plus(exp.number);
			}
		}
		if (indices_of_numerals.length <= 1) return this;
		const first_index = indices_of_numerals[0];
		this.terms[first_index].expression = new Numeral(sum);
		indices_of_numerals.shift();
		this.terms = this.terms.filter((_, i) => !indices_of_numerals.includes(i));
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
			} else {
				terms.push(term);
			}
		}
		this.terms = terms;
		return this;
	}
}
