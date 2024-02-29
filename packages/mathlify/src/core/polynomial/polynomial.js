import { GeneralPolynomial } from './general-polynomial.js';
import { Numeral } from '../expression/index.js';

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
		this.coeffs = coeffs;
	}

  get options() {
    return {
      ascending: this.ascending,
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
    const coeffs = create_zero_array(degree);
    for (let i = 0; i <= this.degree; i++) {
      for (let j = 0; j <= poly2.degree; j++) {
        coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(poly2.coeffs[j]));
      }
    }
    if (!this.ascending) coeffs.reverse();
    return new Polynomial(coeffs, this.options);
  }
}

/**
 *
 * @param {number} n
 * @returns {Numeral[]}
 */
function create_zero_array(n) {
	return new Array(n).fill(new Numeral(0));
}
