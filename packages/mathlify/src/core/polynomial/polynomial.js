import { GeneralPolynomial } from './general-polynomial.js';
import { Numeral, Expression, Product } from '../expression/index.js';

/** The Polynomial class represents single-variable polynomials over the rationals (support for floats to be added in the future using the numeral class) */
export class Polynomial extends GeneralPolynomial {
	/** @type {Numeral[]} */
	coeffs;

	/**
	 * @param {Numeral[]} coeffs
	 * @param { {ascending?: boolean, variable?: string} } [options] - defaults to ascending polynomial with variable 'x'
	 */
	constructor(coeffs, options) {
		super(coeffs, options);
		if (!options?.ascending) coeffs.reverse();
		this.coeffs = coeffs;
	}

	get options() {
		return {
			ascending: this._ascending,
			variable: this.variable,
		};
	}

	get degree() {
		return this.coeffs.length - 1;
	}

	/**
	 * @param {number|Polynomial} p2
	 * @returns {Polynomial}
	 */
	times(p2) {
		const poly2 = typeof p2 === 'number' ? new Polynomial([new Numeral(p2)], this.options) : p2;
		if (this.variable !== poly2.variable) throw new Error('variables do not match');
		const degree = this.degree + poly2.degree;
		const coeffs = create_zero_array(degree + 1);
		for (let i = 0; i <= this.degree; i++) {
			for (let j = 0; j <= poly2.degree; j++) {
				coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(poly2.coeffs[j]));
			}
		}
		return new_poly_from_ascending_coeffs(coeffs, this.options);
	}

	/**
	 * @param {number|Polynomial} p2
	 * @returns {Polynomial}
	 */
	plus(p2) {
		const poly2 = typeof p2 === 'number' ? new Polynomial([new Numeral(p2)], this.options) : p2;
		if (this.variable !== poly2.variable) throw new Error('variables do not match');
		let coeffs = pad_zeros(this.coeffs, poly2.degree + 1);
		coeffs = coeffs.map((x, i) => x.plus(poly2.coeffs[i]));
		return new_poly_from_ascending_coeffs(coeffs, this.options);
	}

	/**
	 * @returns {Polynomial}
	 */
	negative() {
		return new_poly_from_ascending_coeffs(
			this.coeffs.map((x) => x.negative()),
			this.options,
		);
	}

	/**
	 *
	 * @param {number|Polynomial} p2
	 * @returns
	 */
	minus(p2) {
		p2 = typeof p2 === 'number' ? new Polynomial([new Numeral(p2)], this.options) : p2;
		return this.plus(p2.negative());
	}

	/**
	 * @returns {Polynomial}
	 */
	clone() {
		return new_poly_from_ascending_coeffs(
			this.coeffs.map((x) => x.clone()),
			this.options,
		);
	}

	factorize = {
		/**
		 * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
		 */
		commonFactor: () => {
			let power = 0;
			for (const coeff of this.coeffs) {
				if (!coeff.is.zero()) break;
				power++;
			}
			const negative = this.coeffs.every((x) => !x.is.positive()) && this.coeffs.some((x) => x.is.negative());
			let gcd = Numeral.gcd(...this.coeffs);
			if (negative) gcd = gcd.negative();
			const commonFactorCoeffs = pad_zeros([gcd], power + 1);
			commonFactorCoeffs.reverse();
			const commonFactor = new_poly_from_ascending_coeffs(commonFactorCoeffs, this.options);
			const remainingCoeffs = this.coeffs.slice(power).map((x) => x.divide(gcd));
			const remainingFactor = new_poly_from_ascending_coeffs(remainingCoeffs, this.options);
			/** @type {Expression & {commonFactor?: Polynomial, remainingFactor?: Polynomial}} */
			const expression = new Expression(new Product(commonFactor, remainingFactor));
			expression.commonFactor = commonFactor;
			expression.remainingFactor = remainingFactor;
			return /** @type {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}} */ (expression);
		},
	};
}

/**
 *
 * @param {number} n
 * @returns {Numeral[]}
 */
function create_zero_array(n) {
	return new Array(n).fill(new Numeral(0));
}

/**
 * pad zeros to the end of the array (returning itself if n is less)
 * @param {Numeral[]} arr
 * @param {number} n - final length of the array
 */
function pad_zeros(arr, n) {
	if (arr.length >= n) return arr;
	return arr.map((x) => x.clone()).concat(create_zero_array(n - arr.length));
}

/**
 * @param {Numeral[]} coeffs
 * @param {{variable: string, ascending: boolean}} options
 */
function new_poly_from_ascending_coeffs(coeffs, options) {
	const p = new Polynomial(coeffs, { ...options, ascending: true });
	p.ascending = options.ascending;
	return p;
}
