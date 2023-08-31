/** Expression class
 * @property {Map<Fraction,Fraction>} coeffsMap - the coefficients. {power: coefficient}
 * @property {string} variable - the variable
 * @property {"polynomial-like"} kind - mathlify expression class kind
 * @property {"polynomial-like"} type - mathlify expression class type
 */
export class PolynomialLike extends Expression {
    /**
     * @constructor
     * Creates a PolynomialLike instance
     * @param {[number|Fraction, number|Fraction][]} coeffsPowerArr - the coefficients in the order [coeff, power]
     * @param {{variable?: string}} [options] - options. default to {variable: "x"}
     */
    constructor(coeffsPowerArr: [number | Fraction, number | Fraction][], options?: {
        variable?: string | undefined;
    } | undefined);
    /** @type {Map<Fraction,Fraction>} */
    coeffsMap: Map<Fraction, Fraction>;
    /** @type {string} */
    variable: string;
    /** @type {"polynomial-like"} */
    kind: "polynomial-like";
    /** @type {"polynomial-like"} */
    type: "polynomial-like";
    /**
     * to constructor args
     * @returns {[[number|Fraction, number|Fraction][], {variable: string}]}
     */
    toConstructorArgs(): [[number | Fraction, number | Fraction][], {
        variable: string;
    }];
    /**
     * flatten, returning an expression of the form ax^n + bx^(n-1) + ... + cx + d
     * @returns {Expression}
     */
    flatten(): Expression;
    plus(x: PolynomialLike): PolynomialLike;
    plus(x: string | number | Expression): Expression;
    /**
     * negative
     * @returns {PolynomialLike} the negative of the polynomial
     */
    negative(): PolynomialLike;
    minus(x: PolynomialLike): PolynomialLike;
    minus(x: string | number | Expression): Expression;
    /**
     * differentiate
     * @returns {PolynomialLike} - the derivative
     */
    differentiate(): PolynomialLike;
    /**
     * integrate
     * @param {number|Fraction} [c=0] - the constant of integration
     * @returns {PolynomialLike} - the integral
     */
    integrate(c?: number | import("../../core").Fraction | undefined): PolynomialLike;
}
export type Fraction = import('../../core/index.js').Fraction;
import { Expression } from "../../core";
//# sourceMappingURL=polynomialLike.d.ts.map