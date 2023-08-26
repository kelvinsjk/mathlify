// the general equation class has a left and right side,
// both of which are expressions
// each time we apply a method on the equation,
// we will slowly build up the steps as an array of lhs=rhs strings

import { Fraction, Term, Expression } from '../../core/index.js';
import {
	ExpansionTerm,
	RationalTerm,
	// TODO: handle PowerTerm and ExpansionTerm
	// PowerTerm, ExpansionTerm
} from '../../algebra/term/index.js';
import { factorizeQuadratic } from '../../algebra/index.js';
import { oppositeSign } from './utils/oppositeSign.js';
import { solveQuadraticInequality } from './solveInequality.js';

/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {Expression} lhs - the left hand side of the equation
 * @property {Expression} rhs - the right hand side of the equation
 * @property {"<"|">"|"\\geq"|"\\leq"} sign - the sign
 * @property {(Expression|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @property {(Expression|string)[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @property {boolean} aligned - whether or not the steps are to be aligned
 */
export class InequalityWorking {
	/** @type {Expression} */
	lhs;
	/** @type {Expression} */
	rhs;
	/** @type {"<"|">"|"\\geq"|"\\leq"} */
	sign;
	/** @type {(Expression|string)[]} */
	lhsArray;
	/** @type {(Expression|string)[]} */
	rhsArray;
	/** @type {boolean} */
	aligned;
	/**
	 * constructor
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} lhs - the left hand side of the equation
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [rhs=0] - the right hand side of the equation (defaults to 0)
	 * @param {{aligned?: boolean, sign?: '>'|'<'|'leq'|'geq'|'\\leq'|'\\geq'}} [options] - options object defaulting to `{aligned: false, sign: '<'}`
	 */
	constructor(lhs, rhs = 0, options) {
		if (!(lhs instanceof Expression)) {
			lhs = Array.isArray(lhs) ? new Expression(...lhs) : new Expression(lhs);
		}
		if (!(rhs instanceof Expression)) {
			rhs = Array.isArray(rhs) ? new Expression(...rhs) : new Expression(rhs);
		}
		const aligned = options?.aligned ?? false;
		const sign = options?.sign ?? '<';
		if (sign === 'geq' || sign === 'leq') {
			this.sign = sign === 'geq' ? '\\geq' : '\\leq';
		} else {
			this.sign = sign;
		}
		this.lhs = lhs;
		this.rhs = rhs;
		this.lhsArray = [lhs];
		this.rhsArray = [rhs];
		this.aligned = aligned;
	}

	/**
	 * addition
	 * @param {number|Fraction|string|Term|Expression} x - the term/expression to be added to both sides
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 */
	plus(x, options) {
		const newLHS = this.lhs.plus(x);
		const newRHS = this.rhs.plus(x);
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		return this;
	}
	/**
	 * subtraction
	 * @param {number|Fraction|string|Term|Expression} x - the term/expression to be subtracted from both sides
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 */
	minus(x, options) {
		const newLHS = this.lhs.minus(x);
		const newRHS = this.rhs.minus(x);
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		return this;
	}
	/**
	 * multiplication
	 * @param {number|Fraction|string|Term|Expression} x - the term/expression to be multiplied from both sides
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
	 */
	times(x, options) {
		const newLHS = this.lhs.times(x);
		const newRHS = this.rhs.times(x);
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		if (
			(typeof x === 'number' && x < 0) ||
			(x instanceof Fraction && x.is.negative())
		) {
			this.sign = oppositeSign(this.sign);
		}
		return this;
	}
	/**
	 * negative
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
	 */
	negative(options) {
		const newLHS = this.lhs.negative();
		const newRHS = this.rhs.negative();
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		this.sign = oppositeSign(this.sign);
		return this;
	}
	/**
	 * division
	 * @param {number|Fraction|string|Term} x - the term to be divided from both sides
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
	 */
	divide(x, options) {
		const newLHS = this.lhs.divide(x);
		const newRHS = this.rhs.divide(x);
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		if (
			(typeof x === 'number' && x < 0) ||
			(x instanceof Fraction && x.is.negative())
		) {
			this.sign = oppositeSign(this.sign);
		}
		return this;
	}
	/**
	 * swaps lhs and rhs
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 */
	swap(options) {
		const newLHS = this.rhs;
		const newRHS = this.lhs;
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		this.sign = oppositeSign(this.sign);
		return this;
	}

	/**
	 * make rhs 0
	 * @param {{intertext?: string, working?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 */
	rhsZero(options) {
		insertIntertext(this, options);
		// working
		if (options?.working) {
			this.lhsArray.push(`${this.lhs} - (${this.rhs})`);
			this.rhsArray.push(`0`);
		}
		// final
		const newLHS = this.lhs.minus(this.rhs);
		const newRHS = new Expression(0);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		return this;
	}

	/**
	 * factorize the lhs
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * @returns {string[]} - the roots of the equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 *
	 */
	factorizeQuadratic(options) {
		//TODO: return quadratic inequality solution
		insertIntertext(this, options);
		const intervals = solveQuadraticInequality(this.lhs, this.sign, this.rhs);
		this.lhs = new Expression(factorizeQuadratic(this.lhs));
		this.lhsArray.push(this.lhs);
		this.rhsArray.push(this.rhs);
		return intervals;
	}

	//! Methods for RationalTerm
	/**
	 * combines rational terms into a single rational term
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
	 */
	combineRationalTerms(options) {
		const simplifiedLHS = simplifyRationalTerm(this.lhs);
		const newLHS =
			simplifiedLHS instanceof RationalTerm
				? new Expression(simplifiedLHS)
				: simplifiedLHS;
		const simplifiedRHS = simplifyRationalTerm(this.rhs);
		const newRHS =
			simplifiedRHS instanceof RationalTerm
				? new Expression(simplifiedRHS)
				: simplifiedRHS;
		if (
			simplifiedLHS instanceof RationalTerm ||
			simplifiedRHS instanceof RationalTerm
		) {
			insertIntertext(this, options);
			this.lhsArray.push(newLHS);
			this.rhsArray.push(newRHS);
			this.lhs = newLHS;
			this.rhs = newRHS;
			return this;
		}
		console.warn(
			`no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during rational term combination. Is this intended?`
		);
		return this;
	}
	/**
	 * cross multiplication (only if there is a rational term on either/both sides)
	 * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: assumes cross multiplication involves positive terms.
	 * WARNING: mutates current instance
	 */
	crossMultiply(options) {
		const simplifiedLHS = simplifyRationalTerm(this.lhs);
		const simplifiedRHS = simplifyRationalTerm(this.rhs);
		if (simplifiedLHS instanceof RationalTerm) {
			if (simplifiedRHS instanceof RationalTerm) {
				const newLHS = simplifiedLHS.num
					.times(simplifiedLHS.coeff)
					.times(simplifiedRHS.den.expand());
				const newRHS = simplifiedRHS.num
					.times(simplifiedRHS.coeff)
					.times(simplifiedLHS.den.expand());
				insertIntertext(this, options);
				this.lhsArray.push(newLHS);
				this.rhsArray.push(newRHS);
				this.lhs = newLHS;
				this.rhs = newRHS;
				return this;
			} else if (simplifiedRHS.is.constant()) {
				const rhs = simplifiedRHS.cast.toFraction();
				const newLHS = simplifiedLHS.num
					.times(simplifiedLHS.coeff)
					.times(rhs.den);
				const newRHS = simplifiedLHS.den.expand().times(rhs.num);
				insertIntertext(this, options);
				this.lhsArray.push(newLHS);
				this.rhsArray.push(newRHS);
				this.lhs = newLHS;
				this.rhs = newRHS;
				return this;
			} else {
				const newLHS = simplifiedLHS.num.times(simplifiedLHS.coeff);
				const newRHS = simplifiedRHS.times(simplifiedLHS.den.expand());
				insertIntertext(this, options);
				this.lhsArray.push(newLHS);
				this.rhsArray.push(newRHS);
				this.lhs = newLHS;
				this.rhs = newRHS;
				return this;
			}
		} else {
			// simplifiedLHS is not a RationalTerm
			if (simplifiedRHS instanceof RationalTerm) {
				if (simplifiedLHS.is.constant()) {
					const lhs = simplifiedLHS.cast.toFraction();
					const newLHS = simplifiedRHS.den.expand().times(lhs.num);
					const newRHS = simplifiedRHS.num
						.times(lhs.den)
						.times(simplifiedRHS.coeff);
					insertIntertext(this, options);
					this.lhsArray.push(newLHS);
					this.rhsArray.push(newRHS);
					this.lhs = newLHS;
					this.rhs = newRHS;
					return this;
				} else {
					const newLHS = simplifiedLHS.times(simplifiedRHS.den.expand());
					const newRHS = simplifiedRHS.num.times(simplifiedRHS.coeff);
					insertIntertext(this, options);
					this.lhsArray.push(newLHS);
					this.rhsArray.push(newRHS);
					this.lhs = newLHS;
					this.rhs = newRHS;
					return this;
				}
			} else {
				console.warn(
					`no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during cross multiplication. Is this intended?`
				);
				return this;
			}
		}
	}

	/**
	 * expand (only if there is lhs/rhs has singleton expression that is an expansion term)
	 * @param {{intertext?: string, side?: 'lhs'|'rhs'|'both'}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
	 * defaults to try to expand both
	 * the equal sign will be push to the right by the length of the intertext
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates current instance
	 */
	expand(options) {
		insertIntertext(this, options);
		if (options?.side !== 'rhs') {
			const expansionTerm = this.lhs.terms[0];
			if (expansionTerm instanceof ExpansionTerm) {
				this.lhs = expansionTerm.expand();
				this.lhsArray.push(this.lhs);
			}
		} else {
			this.lhsArray.push(this.lhs);
		}
		if (options?.side !== 'lhs') {
			const expansionTerm = this.rhs.terms[0];
			if (expansionTerm instanceof ExpansionTerm) {
				this.rhs = expansionTerm.expand();
				this.rhsArray.push(this.rhs);
			}
		} else {
			this.rhsArray.push(this.rhs);
		}
		return this;
	}

	/**
	 * sets the aligned state
	 * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates current instance
	 */
	setAligned(aligned) {
		if (aligned === undefined) {
			this.aligned = !this.aligned;
		} else {
			this.aligned = aligned;
		}
		return this;
	}

	/**
	 * move term i from (lhs/rhs) to (rhs/lhs)
	 * @param {number} i - the index of the term to be moved (note: 0-indexed)
	 * @param {{from?: "lhs"|"rhs", intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
	 * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
	 * @returns {InequalityWorking} - a reference to this equation
	 * WARNING: mutates current instance
	 */
	moveTerm(i, options) {
		const from = options?.from ?? 'lhs';
		/** @type {Expression} */
		let newLHS;
		/** @type {Expression} */
		let newRHS;
		if (from === 'lhs') {
			newLHS = new Expression(...this.lhs.terms.filter((_, j) => j !== i));
			newRHS = this.rhs.minus(this.lhs.terms[i]);
		} else {
			newRHS = new Expression(...this.rhs.terms.filter((_, j) => j !== i));
			newLHS = this.lhs.minus(this.rhs.terms[i]);
		}
		insertIntertext(this, options);
		this.lhsArray.push(newLHS);
		this.rhsArray.push(newRHS);
		this.lhs = newLHS;
		this.rhs = newRHS;
		return this;
	}

	/**
	 * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
	 */
	toString() {
		const equal = this.aligned ? ` &${this.sign} ` : ` ${this.sign} `;
		return this.lhsArray.reduce((prev, lhs, i) => {
			const newLine = i === 0 ? '' : '\n\t\\\\ ';
			const equalSign =
				typeof lhs === 'string' && this.rhsArray[i] === ''
					? this.aligned
						? ' &'
						: ''
					: equal;
			return prev + `${newLine}${lhs}${equalSign}${this.rhsArray[i]}`;
		}, '');
	}
}

/**
 * searches expression for a RationalTerm, and return a boolean for whether it exists
 * @param {Expression} expression - the expression to be searched
 * @return {boolean} - whether a rational term exists
 */
function hasRationalTerm(expression) {
	return expression.terms.some((term) => term instanceof RationalTerm);
}

/**
 * searches expression for a RationalTerm, and returns the simplified RationalTerm if it exists
 * otherwise returns the original expression
 * @param {Expression} expression - the expression to be searched
 * @return {RationalTerm|Expression} - the simplified expression
 */
function simplifyRationalTerm(expression) {
	const isRational = hasRationalTerm(expression);
	if (isRational) {
		const finalRational = expression.terms.reduce(
			/** @type {(prev: RationalTerm, term: Term)=>RationalTerm} */
			(prev, term) => prev.plus(term),
			new RationalTerm(0)
		);
		return finalRational;
	}
	return expression;
}

/**
 * inserts intertext into arrays
 * @param {InequalityWorking} equation - the equation to be modified
 * @param {{intertext?: string}} [options] - the text to be inserted
 */
function insertIntertext(equation, options) {
	const intertext = options?.intertext;
	if (!intertext) return;
	equation.lhsArray.push(intertext);
	equation.rhsArray.push('');
}
