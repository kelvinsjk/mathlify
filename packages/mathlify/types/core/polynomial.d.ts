/** Polynomial class
 * @property {Fraction[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {"polynomial"} type - mathlify polynomial type
 */
export class Polynomial extends Expression {
    /**
     * @param {number} degree
     * @param {{variable?: string, ascending?: boolean, coeff?: number|Fraction}} [options] defaults to {variable:'x', ascending: false, coeff: 1}
     * @returns {Polynomial} a single-term polynomial of required degree
     */
    static ofDegree(degree: number, options?: {
        variable?: string | undefined;
        ascending?: boolean | undefined;
        coeff?: number | Fraction | undefined;
    } | undefined): Polynomial;
    /**
     * re-instantiate Polynomial class instance from JSON object literal
     * @param {PolynomialJSON} p JSON object literal obtained from JSON.parse
     * @returns {Polynomial} Term class instance
     */
    static fromJSON(p: import("./types.d.ts").PolynomialJSON): Polynomial;
    /**
     * @constructor
     * @param {(number|Fraction)[]|string} coeffs the coefficients.
     * @param {{ascending?: boolean, variable?: string}} [options] options. default to {ascending: false, variable: "x"}
     */
    constructor(coeffs: (number | Fraction)[] | string, options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    /** @type {Fraction[]} */
    coeffs: Fraction[];
    /** @type {string} */
    variable: string;
    /** @type {boolean} */
    ascending: boolean;
    /** @type {"polynomial"} */
    type: "polynomial";
    /** degree of polynomial @type {number} */
    get degree(): number;
    /** leading coeff @type {Fraction} */
    get leadingCoeff(): Fraction;
    /** @type {boolean} */
    get descending(): boolean;
    /**
     * @param {boolean} [ascending] whether the new polynomial should be ascending (defaults to toggle current)
     * @returns {Polynomial} the polynomial with the new ascending property
     */
    changeAscending(ascending?: boolean | undefined): Polynomial;
    plus(x: Polynomial | number | Fraction): Polynomial;
    plus(x: Term | Expression | string): Expression;
    /**
     * @returns {Polynomial} the negative of the polynomial
     */
    negative(): Polynomial;
    minus(x: Polynomial | number | Fraction): Polynomial;
    minus(x: Term | Expression | string): Expression;
    times(x: Polynomial | number | Fraction): Polynomial;
    times(x: Term | Expression | string): Expression;
    /**
     * Polynomial division (by a constant)
     * @param {number|Fraction} x the constant to divided by
     * @returns {Polynomial} the quotient this divided by x
     * @warning for polynomial division consider the rational term class
     */
    divide(x: number | Fraction): Polynomial;
    /**
     * @param {number|Fraction} n the power to raise the polynomial to
     * @returns {Polynomial} the polynomial raised to the power n
     */
    pow(n: number | Fraction): Polynomial;
    /**
     * @returns {Polynomial} the square of the polynomial
     */
    square(): Polynomial;
    subIn(x: Fraction | number): Fraction;
    subIn(x: {
        [key: string]: number | Fraction;
    }): Expression;
    /**
     * @param {number|Fraction} x the value to sub in
     * @returns {number} the result after subbing in x
     */
    subInNumber(x: number | Fraction): number;
    /**
     * @param {Polynomial|string|(number|Fraction)[]} x polynomial to replace variable with
     * @param {{ascending?: boolean, variable?: string}} [options] options for constructing polynomial from string/coeff Array. defaults to {ascending: false, variable: "x"}
     * @returns {Polynomial} the new polynomial after replacement
     */
    replaceXWith(x: Polynomial | string | (number | Fraction)[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined): Polynomial;
    /**
     * slices the polynomial, returning a concatenated polynomial of degree n
     * @param {number} end the end index (degree of the new polynomial will be end-1)
     * @return {Polynomial} the sliced polynomial
     */
    slice(end: number): Polynomial;
    /**
     * @param {number|Fraction} [x] if undefined, check if polynomial is a constant. otherwise, check if the polynomial is a constant equal to x
     * @returns {boolean} whether the polynomial is a constant/is equal to a provided constant
     */
    isConstant(x?: number | Fraction | undefined): boolean;
    /**
     * @returns {Polynomial} the derivative
     */
    differentiate(): Polynomial;
    /**
     * @param {number|Fraction} [c=0] the constant of integration
     * @returns {Polynomial} the integral
     */
    integrate(c?: number | Fraction | undefined): Polynomial;
    /**
     * @param {number|Fraction} lower the lower limit
     * @param {number|Fraction} upper the upper limit
     * @returns {Fraction} the definite integral
     */
    definiteIntegral(lower: number | Fraction, upper: number | Fraction): Fraction;
    /** @typedef {import('./types.d.ts').PolynomialJSON} PolynomialJSON */
    /**
     * serializes polynomial object. can be used with the static
     * `Polynomial.FromJSON` method to recreate this polynomial
     * class instance
     * @returns {PolynomialJSON}
     */
    toJSON(): import("./types.d.ts").PolynomialJSON;
}
import { Expression } from "./expression.js";
import { Fraction } from "./fraction.js";
import { Term } from "./term.js";
//# sourceMappingURL=polynomial.d.ts.map