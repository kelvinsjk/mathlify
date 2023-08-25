// the expression class is a collection of terms under addition
// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { Fraction, Expression, Term, Polynomial } from '../core/index.js';
import { ExpansionTerm } from '../algebra/index.js';
import { numberToFraction } from '../utils/toFraction.js';

/** Expression class
 * @property {Expression[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {number} degree - the degree of the polynomial
 * @property {"extended-polynomial"} kind - mathlify expression class kind
 * @property {"extended-polynomial"|"extended-linear-polynomial"|"extended-quadratic-polynomial"} type - mathlify expression class type
 */
export class xPolynomial extends Expression {
	/** @type {Expression[]} */
	coeffs;
	/** @type {string} */
	variable;
	/** @type {boolean} */
	ascending;
	/** @type {number} */
	degree;
	/** @type {"extended-polynomial"} */
	kind;
	/** @type {"extended-polynomial"|"extended-linear-polynomial"|"extended-quadratic-polynomial"} */
	type;
	/**
	 * @constructor
	 * Creates a extended Polynomial instance, where the coefficients are Expressions
	 * @param {(number|Fraction|string|Term|Expression)[]|number|Fraction|Term|Expression} coeffs - the coefficients.
	 * @param {{ascending?: boolean, variable?: string}} [options] - options. default to {ascending: false, variable: "x"}
	 *
	 * Note that new Polynomial([2]) creates the constant polynomial "2" while new Polynomial(2) creates the linear polynomial "2x"
	 */
	constructor(coeffs, options) {
		const { ascending = false, variable = 'x' } = options ?? {};
		if (!Array.isArray(coeffs)) {
			coeffs = ascending ? [0, coeffs] : [coeffs, 0];
		}
		const coeffsExp = coeffs.map((x) => {
			return x instanceof Expression ? x : new Expression(x);
		});
		if (!ascending) {
			coeffsExp.reverse();
		}
		const coeffsCleaned = removeTrailingZeroes(coeffsExp);
		const terms = coeffsCleaned.map(
			(coeff, i) => new ExpansionTerm(coeff, [new Expression(variable), i])
		);
		if (!ascending) {
			terms.reverse();
		}
		super(...terms);
		this.coeffs = coeffsCleaned;
		this.variable = variable;
		this.ascending = ascending;
		this.degree = this.coeffs.length - 1;
		this.kind = 'extended-polynomial';
		this.type =
			this.degree === 1
				? 'extended-linear-polynomial'
				: this.degree === 2
				? 'extended-quadratic-polynomial'
				: 'extended-polynomial';
	}

	/**
	 * Polynomial addition
	 * @param {xPolynomial|Polynomial|number|Fraction} x - the polynomial to be added
	 * @returns {xPolynomial} - the sum of the two
	 */
	plus(x) {
		if (!(x instanceof xPolynomial)) {
			x = new xPolynomial([x]);
		}
		const newCoeffs = addArrays(this.coeffs, x.coeffs);
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new xPolynomial(newCoeffs, {
			ascending: this.ascending,
			variable: this.variable,
		});
	}

	/**
	 * negative
	 * @returns {xPolynomial} the negative of the polynomial
	 */
	negative() {
		const newCoeffs = this.coeffs.map((coeff) => coeff.negative());
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new xPolynomial(newCoeffs, {
			ascending: this.ascending,
			variable: this.variable,
		});
	}

	/**
	 * Polynomial subtraction
	 * @param {xPolynomial|Polynomial|number|Fraction} x - polynomial to be subtracted
	 * @returns {xPolynomial} - the difference this minus x
	 */
	minus(x) {
		if (typeof x === 'number' || typeof x === 'string') {
			x = new xPolynomial([x]);
		}
		return this.plus(x.negative());
	}

	/**
	 * @overload
	 * Polynomial multiplication
	 * @param {Term|Expression|string} x - polynomial to be multiplied
	 * @returns {Expression} - the product
	 */
	/**
  /**
   * @overload
   * Polynomial multiplication
   * @param {xPolynomial|Polynomial|number|Fraction} x - polynomial to be multiplied
   * @returns {xPolynomial} - the product
   */
	/**
	 * Polynomial multiplication
	 * @param {xPolynomial|Polynomial|number|Fraction|Term|Expression|string} x - polynomial to be multiplied
	 * @returns {xPolynomial|Expression} - the product
	 */
	times(x) {
		if (
			x instanceof Term ||
			typeof x === 'string' ||
			(x instanceof Expression && !(x instanceof Polynomial))
		) {
			return super.times(x);
		}
		const xPoly = x instanceof Polynomial ? x : new xPolynomial([x]);
		/** @type {Expression[]} */
		let newCoeffs = [];
		xPoly.coeffs.forEach((coeff, i) => {
			newCoeffs = addArrays(newCoeffs, [
				...new Array(i).fill(new Fraction(0)),
				...this.coeffs.map((thisCoeff) => thisCoeff.times(coeff)),
			]);
		});
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new xPolynomial(newCoeffs, {
			ascending: this.ascending,
			variable: this.variable,
		});
	}

	/**
	 * Polynomial division (by a constant)
	 * @param {number|Fraction} x - the constant to divided by
	 * @returns {xPolynomial} - the quotient
	 */
	divide(x) {
		const newCoeffs = this.coeffs.map((coeff) => coeff.divide(x));
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new xPolynomial(newCoeffs, {
			ascending: this.ascending,
			variable: this.variable,
		});
	}

	/**
	 * power
	 * @param {number|Fraction} n - the power to raise the polynomial to
	 * @returns {xPolynomial} - the polynomial raised to the power n
	 */
	pow(n) {
		if (n instanceof Fraction) {
			n = n.valueOf();
		}
		if (!Number.isInteger(n) || n < 0) {
			throw new Error(`power must be a non-negative integer. ${n} received.`);
		}
		if (n === 0) {
			return new xPolynomial([1]);
		}
		let result = new xPolynomial([1], {
			variable: this.variable,
			ascending: this.ascending,
		});
		for (let i = 0; i < n; i++) {
			result = /**@type{xPolynomial}*/ (result.times(this));
		}
		return result;
	}

	/**
	 * square
	 * @returns {xPolynomial} - the square of the polynomial
	 */
	square() {
		return this.pow(2);
	}

	/**
	 * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
	 * @returns {Polynomial|xPolynomial} - the new Polynomial (if all coefficients can be cast as a fraction, a Polynomial. If not, an xPolynomial)
	 */
	subIntoCoeffs(x) {
		const newCoeffs = this.coeffs.map((coeff) => coeff.subIn(x));
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		try {
			const coeffsFrac = newCoeffs.map((coeff) => coeff.cast.toFraction());
			return new Polynomial(coeffsFrac, {
				variable: this.variable,
				ascending: this.ascending,
			});
		} catch {
			return new xPolynomial(newCoeffs, {
				variable: this.variable,
				ascending: this.ascending,
			});
		}
	}

	/**
	 * @param {number|Fraction} x - the values to sub in for the variable
	 * @returns {Expression} - the new Expression
	 */
	subIntoVariable(x) {
		const xFrac = numberToFraction(x);
		return this.coeffs.reduce((prev, coeff, i) => {
			return prev.plus(coeff.times(xFrac.pow(i)));
		}, new Expression(0));
	}

	/**
	 * quadratic discriminant
	 * @returns {Expression} - the discriminant as an expression
	 */
	quadraticDiscriminant() {
		if (this.degree !== 2) {
			throw new Error(`${this} is not a quadratic`);
		}
		const [c, b, a] = this.coeffs;
		return b.square().minus(a.times(c).times(4));
	}
}

/**
 *
 * @param {Expression[]} arr
 * @returns {Expression[]} array with trailing zeroes removed (leaving at least 1 element)
 */
function removeTrailingZeroes(arr) {
	let i = arr.length - 1;
	while (i >= 0 && `${arr[i]}` === '0') {
		i--;
	}
	return i === -1 ? [new Expression(0)] : arr.slice(0, i + 1);
}

/**
 * add two arrays of Fractions, padding with zeros if necessary
 * @param {Expression[]} arr1
 * @param {(Fraction|Expression)[]} arr2
 * @returns {Expression[]} the sum of the two arrays
 */
function addArrays(arr1, arr2) {
	const maxLength = Math.max(arr1.length, arr2.length);
	/** @type {Expression[]} */
	const arr1Padded = [
		...arr1,
		...Array(maxLength - arr1.length).fill(new Expression(0)),
	];
	/** @type {(Fraction|Expression)[]} */
	const arr2Padded = [
		...arr2,
		...Array(maxLength - arr2.length).fill(new Fraction(0)),
	];
	return arr1Padded.map((x, i) => x.plus(arr2Padded[i]));
}
