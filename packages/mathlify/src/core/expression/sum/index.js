//import { Expression } from '../index.js';
import { Numeral } from '../numeral/index.js';
import { Product } from '../product/index.js';

/** @typedef {import('../index.js').Expression} Expression */
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
	/** @type {'sum'} */
	type = 'sum';
	/**@type {Expression[]} */
	_termsExp;
	/**
	 * Creates a Sum
	 * @param {...Expression} terms
	 */
	constructor(...terms) {
		this._termsExp = terms;
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
			.map((term) => term._to_lexical_string())
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
			const exp = term.node;
			if (exp instanceof Numeral) {
				return exp.number.is.nonzero();
			} else if (exp instanceof Product) {
				return exp.coeff.is.nonzero();
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
		for (const term of this._termsExp) {
			if (term.node instanceof Sum) {
				term.node._flatten();
				terms.push(...term.node._termsExp);
			} else if (term.node instanceof Product) {
				term.node._flatten();
				terms.push(term);
			} else {
				terms.push(term);
			}
		}
		this._termsExp = terms;
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
		// workaround
		const dummy = this._termsExp[0];
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
					termMap[key] = [[i], term.coeff, term.factors.length === 0 ? dummy._new_exp(new Numeral(1)) : term.toUnit()];
				} else if (term instanceof Numeral) {
					// workaround to avoid Expression constructor
					termMap[key] = [[i], term.clone(), this._termsExp[0]._new_exp(new Numeral(1))];
				} else {
					termMap[key] = [[i], new Numeral(1), this._termsExp[0]._new_exp(term.clone())];
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
					this._termsExp[firstIndex].node = coeff;
				} else {
					const p = new Product(expression);
					p.coeff = coeff;
					this._termsExp[firstIndex].node = p.simplify();
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
	 * @returns {Sum}
	 */
	subIn(scope, options) {
		const terms = this._termsExp.map((term) => term.subIn(scope, options));
		return new Sum(...terms);
	}

	/**
	 * rearranges the terms in place
	 * @param {number[]} order - index of term to be placed in order. eg [1, 0, 2] means the we new terms be the original 2nd, 1st, 3rd terms
	 * @returns {this}
	 */
	rearrange(order) {
		if (this.terms.length !== order.length) throw new Error('Invalid indices length');
		this._termsExp = order.map((i) => this._termsExp[i]);
		return this;
	}

	/**
	 * exposes the factors underneath the expression wrapper
	 * @returns {ExpressionType[]}
	 */
	get terms() {
		return this._termsExp.map((term) => term.node);
	}
}
