/** Expression class
 * @property {Expression[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {number} degree - the degree of the polynomial
 * @property {"extended-polynomial"} kind - mathlify expression class kind
 * @property {"extended-polynomial"|"extended-linear-polynomial"|"extended-quadratic-polynomial"} type - mathlify expression class type
 */
export class xPolynomial extends Expression {
    /**
     * @constructor
     * Creates a extended Polynomial instance, where the coefficients are Expressions
     * @param {(number|Fraction|string|Term|Expression)[]|number|Fraction|Term|Expression} coeffs - the coefficients.
     * @param {{ascending?: boolean, variable?: string}} [options] - options. default to {ascending: false, variable: "x"}
     *
     * Note that new Polynomial([2]) creates the constant polynomial "2" while new Polynomial(2) creates the linear polynomial "2x"
     */
    constructor(coeffs: (number | Fraction | string | Term | Expression)[] | number | Fraction | Term | Expression, options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    /** @type {Expression[]} */
    coeffs: Expression[];
    /** @type {string} */
    variable: string;
    /** @type {boolean} */
    ascending: boolean;
    /** @type {number} */
    degree: number;
    /** @type {"extended-polynomial"} */
    kind: "extended-polynomial";
    /** @type {"extended-polynomial"|"extended-linear-polynomial"|"extended-quadratic-polynomial"} */
    type: "extended-polynomial" | "extended-linear-polynomial" | "extended-quadratic-polynomial";
    /**
     * Polynomial addition
     * @param {xPolynomial|Polynomial|number|Fraction} x - the polynomial to be added
     * @returns {xPolynomial} - the sum of the two
     */
    plus(x: xPolynomial | Polynomial | number | Fraction): xPolynomial;
    /**
     * negative
     * @returns {xPolynomial} the negative of the polynomial
     */
    negative(): xPolynomial;
    /**
     * Polynomial subtraction
     * @param {xPolynomial|Polynomial|number|Fraction} x - polynomial to be subtracted
     * @returns {xPolynomial} - the difference this minus x
     */
    minus(x: xPolynomial | Polynomial | number | Fraction): xPolynomial;
    times(x: xPolynomial | Polynomial | number | Fraction): xPolynomial;
    times(x: Term | Expression | string): Expression;
    /**
     * Polynomial division (by a constant)
     * @param {number|Fraction} x - the constant to divided by
     * @returns {xPolynomial} - the quotient
     */
    divide(x: number | Fraction): xPolynomial;
    /**
     * power
     * @param {number|Fraction} n - the power to raise the polynomial to
     * @returns {xPolynomial} - the polynomial raised to the power n
     */
    pow(n: number | Fraction): xPolynomial;
    /**
     * square
     * @returns {xPolynomial} - the square of the polynomial
     */
    square(): xPolynomial;
    /**
     * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
     * @returns {Polynomial|xPolynomial} - the new Polynomial (if all coefficients can be cast as a fraction, a Polynomial. If not, an xPolynomial)
     */
    subIntoCoeffs(x: {
        [key: string]: number | Fraction;
    }): Polynomial | xPolynomial;
    /**
     * @param {number|Fraction} x - the values to sub in for the variable
     * @returns {Expression} - the new Expression
     */
    subIntoVariable(x: number | Fraction): Expression;
    /**
     * replace x with a polynomial
     * @param {xPolynomial|Polynomial|string|(number|Fraction)[]} x - polynomial to replace x with
     * @param {{ascending?: boolean, variable?: string}} [options] - options for when a coefficient array is given default to {ascending: false, variable: "x"}
     * @returns {xPolynomial}
     */
    replaceXWith(x: xPolynomial | Polynomial | string | (number | Fraction)[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined): xPolynomial;
    /**
     * quadratic discriminant
     * @returns {Expression} - the discriminant as an expression
     */
    quadraticDiscriminant(): Expression;
}
import { Expression } from '../core/index.js';
import { Polynomial } from '../core/index.js';
import { Fraction } from '../core/index.js';
import { Term } from '../core/index.js';
//# sourceMappingURL=xPolynomial.d.ts.map