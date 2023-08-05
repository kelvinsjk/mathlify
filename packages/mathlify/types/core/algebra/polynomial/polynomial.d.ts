/** Expression class
 * @property {Fraction[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {number} degree - the degree of the polynomial
 * @property {"polynomial"} kind - mathlify expression class kind
 * @property {"linear-polynomial"|"quadratic-polynomial"} type - mathlify expression class type
 */
export class Polynomial extends Expression {
    /**
     * @constructor
     * Creates a Polynomial instance
     * @param {(number|Fraction)[]|number|Fraction} coeffs - the coefficients.
     * @param {{ascending?: boolean, variable?: string}} [options] - options. default to {ascending: false, variable: "x"}
     *
     * Note that new Polynomial([2]) creates the constant polynomial "2" while new Polynomial(2) creates the linear polynomial "2x"
     */
    constructor(coeffs: (number | Fraction)[] | number | Fraction, options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    coeffs: Fraction[];
    variable: string;
    ascending: boolean;
    degree: number;
    /**
     * Polynomial addition
     * @param {Polynomial|number|Fraction} x - the polynomial to be added
     * @returns {Polynomial} - the sum of the two
     */
    plus(x: Polynomial | number | Fraction): Polynomial;
    /**
     * negative
     * @returns {Polynomial} the negative of the polynomial
     */
    negative(): Polynomial;
    /**
     * Polynomial subtraction
     * @param {Polynomial|number|Fraction} x - polynomial to be subtracted
     * @returns {Polynomial} - the difference this minus x
     */
    minus(x: Polynomial | number | Fraction): Polynomial;
    /**
     * Polynomial multiplication
     * @param {Polynomial|number|Fraction} x - polynomial to be multiplied
     * @returns {Polynomial} - the product
     */
    times(x: Polynomial | number | Fraction): Polynomial;
    /**
     * Polynomial division (by a constant)
     * @param {number|Fraction} x - the constant to divided by
     * @returns {Polynomial} - the quotient
     */
    divide(x: number | Fraction): Polynomial;
    /**
     * power
     * @param {number} n - the power to raise the polynomial to
     * @returns {Polynomial} - the polynomial raised to the power n
     */
    pow(n: number): Polynomial;
    /**
     * square
     * @returns {Polynomial} - the square of the polynomial
     */
    square(): Polynomial;
    /**
     * sub in a Fraction
     * @param {Fraction} x - the values to sub in
     * @returns {Fraction} - Fraction
     */
    subInX(x: Fraction): Fraction;
}
import { Expression } from '../expression/index.js';
import { Fraction } from '../../fraction.js';
//# sourceMappingURL=polynomial.d.ts.map