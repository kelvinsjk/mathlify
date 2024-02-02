import { Expression } from '../index.js';
import { Numeral } from '../numeral/index.js';
import { Product } from '../product/index.js';

/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * Sum Class
 * @property {Expression[]} _termsExp - the terms in the sum
 * */
export class Sum {
	/**@type {Expression[]} */
	_termsExp;
	/**
	 * Creates a Sum
	 * @param {...(Expression|ExpressionType|string|Fraction|number)} terms
	 */
	constructor(...terms) {
		const termsExp = terms.map((t) => {
			return t instanceof Expression ? t : new Expression(t);
		});
		this._termsExp = termsExp;
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
		for (const term of this.terms.slice(1)) {
			if ((term instanceof Numeral && term.is.negative()) || (term instanceof Product && term.is.negative())) {
				// negative sign is already included
				str += ` ${term.toString(options)}`;
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
		return this._termsExp
			.map((term) => term.toLexicalString())
			.toSorted()
			.join('+');
	}

	/**
	 * @returns {Sum}
	 */
	clone() {
		const terms = this._termsExp.map((term) => term.clone());
		return new Sum(...terms);
	}

	/**
	 * @param {import('../index.js').SimplifyOptions} [options]
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
		for (let term of this._termsExp) {
			term.simplify({ product, numeral, sum, quotient, exponent, brackets });
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
		this._termsExp = this._termsExp.filter((term) => {
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
		/** @type {ExpressionType[]} */
		const terms = [];
		for (const term of this.terms) {
			if (term instanceof Sum) {
				term._flatten();
				terms.push(...term.terms);
			} else if (term instanceof Product) {
				term._flatten();
				terms.push(term);
			} else {
				terms.push(term);
			}
		}
		this._termsExp = terms.map((term) => new Expression(term));
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
			const key = term instanceof Numeral ? 'numeral' : term.toLexicalString({ coeff: false });
			const val = termMap[key];
			if (val) {
				val[0].push(i);
				if (term instanceof Product) {
					val[1] = val[1].plus(term.coeff);
				} else if (term instanceof Numeral) {
					val[1] = val[1].plus(term.number);
				} else {
					val[1] = val[1].plus(1);
				}
			} else {
				orderedKeys.push(key);
				if (term instanceof Product) {
					termMap[key] = [[i], term.coeff, term.toUnit()];
				} else if (term instanceof Numeral) {
					termMap[key] = [[i], term.clone(), new Expression(1)];
				} else {
					termMap[key] = [[i], new Numeral(1), new Expression(term).clone()];
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
					this._termsExp[firstIndex].expression = coeff;
				} else {
					this._termsExp[firstIndex].expression = new Product(coeff, expression).simplify();
				}
				indicesToRemove.push(...indices.slice(1));
			}
		}
		this._termsExp = this._termsExp.filter((_, i) => !indicesToRemove.includes(i));
		return this;
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {this}
	 * warning: mutates the class instance
	 */
	subIn(scope, options) {
		for (const term of this._termsExp) {
			term.subIn(scope, options);
		}
		return this;
	}

	/**
	 * exposes the factors underneath the expression wrapper
	 * @returns {ExpressionType[]}
	 */
	get terms() {
		return this._termsExp.map((term) => term.expression);
	}
}
