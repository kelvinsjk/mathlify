import { GeneralPolynomial } from './general-polynomial.js';
import { Numeral, Expression, Product, Exponent } from '../expression/index.js';

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
		// remove trailing zeros
		while (coeffs.length > 1 && coeffs[coeffs.length - 1].is.zero()) {
			coeffs.pop();
		}
		this.coeffs = coeffs;
	}

	/** @returns {Numeral} */
	get leadingCoefficient() {
		return this.coeffs[this.coeffs.length - 1];
	}

	//! Arithmetic methods
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
	 * @param {number|Polynomial} p2
	 * @returns {Polynomial}
	 */
	plus(p2) {
		const poly2 = typeof p2 === 'number' ? new Polynomial([new Numeral(p2)], this.options) : p2;
		if (this.variable !== poly2.variable) throw new Error('variables do not match');
		let coeffs = pad_zeros(this.coeffs, poly2.degree + 1);
		coeffs = coeffs.map((x, i) => x.plus(poly2.coeffs[i] ?? new Numeral(0)));
		return new_poly_from_ascending_coeffs(coeffs, this.options);
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

	solve = {
		/**
		 * @param {number|Polynomial} [rhs=0]
		 * @returns {Expression}
		 */
		linear: (rhs = 0) => {
			const lhs = this.minus(rhs);
			if (lhs.degree !== 1) throw new Error(`Nonlinear polynomial ${this}=${rhs} received`);
			const [b, a] = lhs.coeffs;
			return new Expression(b.negative().divide(a));
		},
		/**
		 *
		 * @param {number|Polynomial} [rhs=0]
		 * @returns {[Expression, Expression, 'rational']} such that either root1 = 0 or root1 \leq root2
		 * TODO: allow options to modify output types
		 */
		quadratic: (rhs = 0) => {
			const lhs = this.minus(rhs);
			const discriminant = lhs.quadraticDiscriminant()._getNumeral();
			if (discriminant.is.negative()) throw new Error(`Complex solutions not yet supported`);
			const radical = Math.sqrt(discriminant.valueOf());
			if (!Number.isInteger(radical)) throw new Error(`Irrational solutions not yet supported`);
			const [, b, a] = this.coeffs;
			let root1 = b.negative().minus(radical).divide(a.times(2));
			let root2 = b.negative().plus(radical).divide(a.times(2));
			if (root1.valueOf() > root2.valueOf() || root2.is.zero()) {
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
		p.node = this.node.clone();
		return p;
	}

	factorize = {
		/**
		 * @param {{forcePositiveLeadingCoefficient?: boolean, verbatim?: boolean}} [options]
		 * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
		 */
		commonFactor: (options) => {
			let power = 0;
			for (const coeff of this.coeffs) {
				if (!coeff.is.zero()) break;
				power++;
			}
			const negative = this.coeffs.every((x) => !x.is.positive()) && this.coeffs.some((x) => x.is.negative());
			let gcd = Numeral.gcd(...this.coeffs);
			if (negative || (options?.forcePositiveLeadingCoefficient && this.leadingCoefficient.is.negative()))
				gcd = gcd.negative();
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
		/**
		 * returns factorized expression of the form k(ax-b)(cx-d) where a,b,c,d \in \mathbb{Z} and gcd(a,b)=gcd(c,d)=1 and d=0 or b/a < d/c. if equal roots, will return k(ax-b)^2
		 * special exception: expressions like 4-x^2 factorize to (2+x)(2-x) rather than -(x+2)(x-2)
		 * @returns {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}}
		 */
		quadratic: () => {
			const [root1, root2] = this.solve.quadratic();
			const [x1, x2] = [root1._getNumeral(), root2._getNumeral()];
			const x1Num = x1.number.num;
			const x1Den = x1.number.den;
			const x2Num = x2.number.num;
			const x2Den = x2.number.den;
			let factor1 = new Polynomial([new Numeral(x1Den), new Numeral(-x1Num)], { variable: this.variable });
			let factor2 = new Polynomial([new Numeral(x2Den), new Numeral(-x2Num)], { variable: this.variable });
			const leadingCoefficient = this.coeffs[this.coeffs.length - 1];
			let multiple = leadingCoefficient.divide(x1Den).divide(x2Den);
			// special exception for expressions like 4-x^2
			if (
				this._ascending &&
				this.coeffs[1].is.zero() &&
				leadingCoefficient.is.negative() &&
				this.coeffs[0].is.positive()
			) {
				multiple = multiple.negative();
				factor2 = factor2.negative();
				factor1.ascending = true;
				factor2.ascending = true;
			}
			// handling ascending expressions
			if (this._ascending && x1.is.equal(x2)) {
				factor1.ascending = true;
				if (factor1.coeffs[0].is.negative()) factor1 = factor1.negative();
			}
			/** @type {Expression & {factors?: [Polynomial, Polynomial], multiple?: Numeral}} */
			const expression = x1.is.equal(x2)
				? new Expression(new Product(multiple, new Expression(new Exponent(factor1, new Expression(2)))))
				: new Expression(new Product(multiple, factor1, factor2));
			expression.factors = [factor1, factor2];
			expression.multiple = multiple;
			return /** @type {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}} */ (expression);
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
