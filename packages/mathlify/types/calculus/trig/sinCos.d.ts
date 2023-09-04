/** SinFn class representing k sin( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {string|number} base
 * @property {"sin-fn"} kind - mathlify kind
 * @property {"sin-fn"} type - mathlify type
 */
export class SinFn extends Term {
    /**
     * @constructor
     * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k sin( f(x) )
     * @param {{base?: string|number, coeff?: number|Fraction}} [options] - the base and coefficient of the term
     */
    constructor(fx?: string | number | Fraction | Polynomial | undefined, options?: {
        base?: string | number | undefined;
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {Polynomial} */
    fx: Polynomial;
    /** @type {number|string} */
    base: number | string;
    /** @type {"sin-fn"} */
    kind: "sin-fn";
    /** @type {"sin-fn"} */
    type: "sin-fn";
    times(x: number | Fraction | SinFn): SinFn;
    times(x: string | Term): Term;
    divide(x: number | Fraction | SinFn): SinFn;
    divide(x: string | Term): Term;
    /**
     * negative
     * @returns {SinFn} the negative of the term
     * */
    negative(): SinFn;
    /**
     * absolute value
     * @returns {SinFn} the absolute value of the term
     */
    abs(): SinFn;
    /**
     * sub in many
     * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number of Fraction is received, we assume that the variable is 'x'
     * @returns {SinFn} the term with the values subbed in
     */
    subIn(variableToValue: number | Fraction): SinFn;
    /**
     * solves k exp(f(x)) = rhs, where f(x) is of the form nx
     * @param {number|Fraction} rhs - the rhs
     * @return {CosFn} the solution
     */
    solve(rhs: number | Fraction): CosFn;
}
/** LnFn class representing k ln( f(x) )
 * @class
 * @property {string} log - the long string
 * @property {Polynomial} fx
 * @property {string|number} base
 * @property {"cos-fn"} kind - mathlify kind
 * @property {"cos-fn"} type - mathlify type
 */
export class CosFn extends Term {
    /**
     * @constructor
     * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
     * @param {{base?: string|number, coeff?: number|Fraction}} [options] - the base and coefficient of the term
     */
    constructor(fx?: string | number | Fraction | Polynomial | undefined, options?: {
        base?: string | number | undefined;
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {string} */
    log: string;
    /** @type {Polynomial} */
    fx: Polynomial;
    /** @type {number|string} */
    base: number | string;
    /** @type {"cos-fn"} */
    kind: "cos-fn";
    /** @type {"cos-fn"} */
    type: "cos-fn";
    /**
     * move the coeff up to f(x)
     */
    coeffToPower(): CosFn;
    /**
     * @param {CosFn} x - the other term to add with
     * @returns {CosFn} the sum of the two terms
     */
    plus(x: CosFn): CosFn;
    /**
     * @param {CosFn} x -
     * @returns {string}
     */
    minus(x: CosFn): string;
    times(x: number | Fraction): CosFn;
    times(x: string | Term): Term;
    divide(x: number | Fraction): CosFn;
    divide(x: string | Term): Term;
    /**
     * negative
     * @returns {CosFn} the negative of the term
     * */
    negative(): CosFn;
    /**
     * sub in many
     * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number of Fraction is received, we assume that the variable is 'x'
     * @returns {CosFn} the term with the values subbed in
     */
    subIn(variableToValue: number | Fraction): CosFn;
    /**
     * solves k ln(f(x)) = rhs, where f(x) is of the form nx
     * @param {number|Fraction} rhs - the rhs
     * @return {SinFn} the solution
     */
    solve(rhs: number | Fraction): SinFn;
}
import { Term } from "../../core";
import { Polynomial } from "../../core";
import { Fraction } from "../../core";
//# sourceMappingURL=sinCos.d.ts.map