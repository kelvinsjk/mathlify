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

	solve = {
		/**
		 * @param {number|Polynomial} [rhs=0]
		 * @returns {Expression}
		 */
		linear: (rhs = 0) => {
			const lhs = this.minus(rhs);
			if (this.degree !== 1) throw new Error(`Nonlinear polynomial ${this}=${rhs} received`);
			const [b, a] = this.coeffs;
			return new Expression(b.divide(a));
		},
		/**
		 *
		 * @param {number|Polynomial} [rhs=0]
		 * @param {*} [options]
		 * @returns {[Expression, Expression, 'rational']}
		 */
		quadratic: (rhs = 0, options) => {
			const discriminant = this.quadraticDiscriminant().getNumeral();
			if (discriminant.is.negative()) throw new Error(`Complex solutions not yet supported`);
			const radical = Math.sqrt(discriminant.valueOf());
			if (!Number.isInteger(radical)) throw new Error(`Irrational solutions not yet supported`);
			const [, b, a] = this.coeffs;
			let root1 = b.negative().minus(radical).divide(a.times(2));
			let root2 = b.negative().plus(radical).divide(a.times(2));
			if (root1.valueOf() > root2.valueOf()) {
				[root1, root2] = [root2, root1];
			}
			return [new Expression(root1), new Expression(root2), 'rational'];
		},
	};

	/**
	 * @returns {Polynomial}
	 */
	clone() {
		const p = new_poly_from_ascending_coeffs(
			this.coeffs.map((x) => x.clone()),
			this.options,
		);
		p.expression = this.expression;
		return p;
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
		///**
		// * @returns {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}}
		// */
		//quadratic: () => {
		//	const [root1, root2] = this.solve.quadratic();
		//},
		//// TODO: Match leading coefficient and avoid fractions if possible
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
