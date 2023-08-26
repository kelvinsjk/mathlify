/** Expression class
 * @property {Fraction[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {number} degree - the degree of the polynomial
 * @property {"polynomial"} kind - mathlify expression class kind
 * @property {"polynomial"|"linear-polynomial"|"quadratic-polynomial"} type - mathlify expression class type
 */
export class Polynomial extends Expression {
    /** @type {"polynomial"|"linear-polynomial"|"quadratic-polynomial"} */
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
    /** @type {Fraction[]} */
    coeffs: Fraction[];
    /** @type {string} */
    variable: string;
    /** @type {boolean} */
    ascending: boolean;
    /** @type {number} */
    degree: number;
    /** @type {"polynomial"} */
    kind: "polynomial";
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
    times(x: Term | Expression | string): Expression;
    times(x: Polynomial | number | Fraction): Polynomial;
    /**
     * Polynomial division (by a constant)
     * @param {number|Fraction} x - the constant to divided by
     * @returns {Polynomial} - the quotient
     */
    divide(x: number | Fraction): Polynomial;
    /**
     * power
     * @param {number|Fraction} n - the power to raise the polynomial to
     * @returns {Polynomial} - the polynomial raised to the power n
     */
    pow(n: number | Fraction): Polynomial;
    /**
     * square
     * @returns {Polynomial} - the square of the polynomial
     */
    square(): Polynomial;
    subIn(x: Fraction | number): Fraction;
    subIn(x: {
        [key: string]: number | Fraction;
    }): Expression;
    /**
     * replace x with a polynomial
     * @param {Polynomial|string|(number|Fraction)[]} x - polynomial to replace x with
     * @param {{ascending?: boolean, variable?: string}} [options] - options for when a coefficient array is given default to {ascending: false, variable: "x"}
     * @returns {Polynomial}
     */
    replaceXWith(x: Polynomial | string | (number | Fraction)[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined): Polynomial;
    /**
     * leading coefficient
     * @returns {Fraction} - the leading coefficient
     */
    leadingCoefficient(): Fraction;
}
import { Expression } from "../expression/index.js";
import { Fraction } from "../../fraction.js";
import { Term } from "../term/index.js";
//# sourceMappingURL=polynomial.d.ts.map