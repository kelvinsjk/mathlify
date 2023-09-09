import { Expression, Polynomial, Term, Fraction } from '../../core/index.js';
import { ExpFn, LnFn } from '../exp-log/expLog.js';
import { PowerFn } from '../powerFn/powerFn.js';
import { RationalFn } from '../rationalFn/rationalFn.js';
import { CosFn, SinFn } from '../trig/sinCos.js';

/** GeneralFn class
 * @property {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} fnTerms - collection of Polynomials and RationalFns
 * @property {"general-fn"} kind - mathlify expression class kind
 * @property {"general-fn"} type - mathlify expression class type
 */
export class GeneralFn extends Expression {
	/** @type {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} */
	fnTerms;
	/** @type {"general-fn"} */
	kind;
	/** @type {"general-fn"} */
	type;
	/**
	 * @constructor
	 * Creates a GeneralFn instance
	 * @param {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} terms - terms of the general expression
	 */
	constructor(...terms) {
		if (terms.length === 0) {
			throw new Error('Expression must have at least one term');
		}
		super(...toTerms(terms));
		const filteredTerms = terms.filter((term) => {
			if (`${term}` === '0') {
				return false;
			}
			return true;
		});
		this.fnTerms = filteredTerms;
		this.kind = 'general-fn';
		this.type = 'general-fn';
	}

	/**
	 * differentiate
	 * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator (for RationalFn only)
	 * @returns {Expression} - the derivative of the general function
	 */
	differentiate(options) {
		const derivatives = this.fnTerms.map((term) => term.differentiate(options));
		return new Expression(...toTerms(derivatives));
	}

	/**
	 * differentiate to function
	 * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator (for RationalFn only)
	 * @returns {GeneralFn} - the derivative of the general function
	 */
	differentiateToFn(options) {
		const derivatives = this.fnTerms.map((term) => {
			if (term instanceof PowerFn) {
				const derivative = term.differentiate();
				if (!(derivative instanceof PowerFn)) {
					throw new Error(
						'derivative of PowerFn only works in GeneralFn if fx is linear'
					);
				} else {
					return derivative;
				}
			} else if (term instanceof RationalFn) {
				// RationalFn
				return term.differentiateToFn(options);
			} else {
				return term.differentiate();
			}
		});
		return new GeneralFn(...derivatives);
	}

	// /**
	//  * Expression addition
	//  * @param {number|Fraction|string|Term|Expression} x - term/expression to be added
	//  * @returns {Expression} - the sum of the two
	//  */
	// plus(x) {
	//   if (`${this}` === "0") {
	//     return x instanceof Expression ? x : new Expression(x);
	//   }
	//   if (x instanceof Expression) {
	//     return new Expression(...this.terms, ...x.terms);
	//   }
	//   return new Expression(...this.terms, x);
	// }

	// /**
	//  * negative
	//  * @returns {Expression} the negative of the expression
	//  */
	// negative() {
	//   return new Expression(...this.terms.map((term) => term.negative()));
	// }

	// /** subtract terms from this Expression
	//  * @param {number|Fraction|string|Term|Expression} x - term to be subtracted
	//  * @returns {Expression} - the difference this minus x
	//  */
	// minus(x) {
	//   if (typeof x === "number" || typeof x === "string") {
	//     x = new Term(x);
	//   }
	//   return this.plus(x.negative());
	// }

	// /**
	//  * expression multiplication
	//  * @param {number|Fraction|string|Term|Expression} x - term to be multiplied
	//  * @returns {Expression} - the product
	//  */
	// times(x) {
	//   if (x instanceof Expression) {
	//     /** @type {Term[]} */
	//     const newTerms = [];
	//     this.terms.forEach((term) => {
	//       x.terms.forEach((xTerm) => {
	//         newTerms.push(term.times(xTerm));
	//       });
	//     });
	//     return new Expression(...newTerms);
	//   }
	//   const newTerms = this.terms.map((term) => term.times(x));
	//   return new Expression(...newTerms);
	// }

	// /**
	//  * power
	//  * @param {number|Fraction} x - the exponent (must be non-negative integer)
	//  * @returns {Expression} - the expression raised to the power of x, fully expanded
	//  */
	// pow(x) {
	//   if (typeof x === "number") {
	//     x = new Fraction(x);
	//   }
	//   if (x.is.negative() || x.is.not.integer()) {
	//     throw new Error(`exponent must be non-negative integer, ${x} received`);
	//   }

	//   /** @type {Expression|undefined} */
	//   let result = undefined;
	//   for (let i = 0; i < x.valueOf(); i++) {
	//     if (result === undefined) {
	//       result = this;
	//     } else {
	//       result = result.times(this);
	//     }
	//   }
	//   if (result === undefined) {
	//     return new Expression(1);
	//   }
	//   return result;
	// }

	// /**
	//  * square
	//  * @returns {Expression} - the expression squared (expanded)
	//  */
	// square() {
	//   return this.pow(2);
	// }

	// /**
	//  * expression division
	//  * @param {number|Fraction|string|Term} x - term to be divided
	//  * @param {{fractionalDisplayMode: "always"|"auto"|"never"}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
	//  * @returns {Expression} - the quotient
	//  */
	// divide(x, options) {
	//   if (typeof x === "number") {
	//     x = new Fraction(x);
	//   }
	//   if (x instanceof Fraction) {
	//     return this.times(x.reciprocal());
	//   }
	//   if (!(x instanceof Term)) {
	//     x = new Term(x);
	//   }
	//   return this.times(x.reciprocal(options));
	// }

	/**
	 * @overload
	 * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
	 * @returns {Expression} - the new Expression
	 */
	/**
	 * @overload
	 * @param {number|Fraction} x - the value to sub in as "x"
	 * @return {Fraction} - the value of the expression cast to Fraction type (make sure to check that this is valid or an error will be thrown)
	 */
	/**
	 * sub in a value for a variable
	 * @param {{[key: string]: number|Fraction}|number|Fraction} x - the values to sub in with the key being the variable signature.
	 * @returns {Expression|Fraction} - the new Expression
	 * @example new Expression(2,'x').subIn({x: 3}) returns new Expression(6)
	 */
	subIn(x) {
		if (typeof x === 'number' || x instanceof Fraction) {
			return this.fnTerms.reduce((prev, term) => {
				if (
					term instanceof SinFn ||
					term instanceof CosFn ||
					term instanceof LnFn ||
					term instanceof ExpFn
				) {
					throw new Error(`cannot sub in ${x} for ${term} yet`);
				}
				return prev.plus(term.subIn({ x }).cast.toFraction());
			}, new Fraction(0));
		}
		const newTerms = this.terms.map((term) => term.subIn(x));
		return new Expression(...newTerms);
	}

	// /**
	//  * changes order of terms
	//  * @param {number[]} args - the index of the terms to be simplified (0-indexed)
	//  * @return {Expression}
	//  */
	// changeOrder(args) {
	//   const terms = this.terms;
	//   /** @type {Term[]} */
	//   const newTerms = [];
	//   args.forEach((arg) => {
	//     newTerms.push(terms[arg]);
	//   });
	//   newTerms.push(...terms.filter((_, i) => !args.includes(i)));
	//   return new Expression(...newTerms);
	// }

	// /**
	//  * boolean methods for this expression
	//  */
	// is = {
	//   /**
	//    * @returns {boolean} - whether this expression is a singleton (ie can be cast to Term class)
	//    * */
	//   term: () => this.terms.length <= 1,

	//   /**
	//    * @returns {boolean} - whether this expression is a constant (ie can be cast to Fraction class)
	//    * */
	//   constant: () =>
	//     this.terms.length === 0 ||
	//     (this.terms.length === 1 && this.terms[0].is.constant()),

	//   /**
	//    * checks if two expressions are equal
	//    * @param {Expression|number|Fraction|string|Term} exp2 - the expression to compare to
	//    * @returns {boolean} - whether the two expressions are equal
	//    */
	//   equalTo: (exp2) => {
	//     const exp2Exp = exp2 instanceof Expression ? exp2 : new Expression(exp2);
	//     return (
	//       this.terms.length === exp2Exp.terms.length &&
	//       this.terms.every((term) =>
	//         exp2Exp.terms.some((term2) => term.is.equalTo(term2))
	//       ) &&
	//       exp2Exp.terms.every((term) =>
	//         this.terms.some((term2) => term.is.equalTo(term2))
	//       )
	//     );
	//   },

	//   not: {
	//     term: () => !this.is.term(),
	//     constant: () => !this.is.constant(),
	//     /** @param {Expression|number|Fraction|string|Term} exp2 */
	//     equalTo: (exp2) => !this.is.equalTo(exp2),
	//   },
	// };

	// /** methods to cast this term to other types */
	// cast = {
	//   /**
	//    * cast to Term type
	//    * @returns {Term} the term representation of this term
	//    */
	//   toTerm: () => {
	//     if (this.terms.length === 1) {
	//       return this.terms[0];
	//     }
	//     throw new Error(`cannot cast ${this} to Term: more than 1 term detected`);
	//   },
	//   /**
	//    * cast to Fraction type
	//    * @returns {Fraction} the fraction representation of this term
	//    */
	//   toFraction: () => {
	//     if (this.terms.length === 1) {
	//       return this.terms[0].cast.toFraction();
	//     }
	//     throw new Error(
	//       `cannot cast ${this} to Fraction: more than 1 term detected`
	//     );
	//   },
	// };
}

/**
 * @param {(Polynomial|Term)[]} fnTerms
 * @returns {Term[]}
 */
function toTerms(fnTerms) {
	/** @type {Term[]} */
	const newTerms = [];
	fnTerms.forEach((term) => {
		if (term instanceof Polynomial) {
			newTerms.push(...term.terms);
		} else if (term instanceof Term) {
			newTerms.push(term);
		}
	});
	return newTerms;
}
