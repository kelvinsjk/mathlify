/** SinFn class representing k sin( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {"sin-fn"} kind - mathlify kind
 * @property {"sin-fn"} type - mathlify type
 */
export class SinFn extends Term {
    /**
     * @constructor
     * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k sin( f(x) )
     * @param {{coeff?: number|Fraction}} [options] - the base and coefficient of the term
     */
    constructor(fx?: string | number | Fraction | Polynomial | undefined, options?: {
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {Polynomial} */
    fx: Polynomial;
    /** @type {"sin-fn"} */
    kind: "sin-fn";
    /** @type {"sin-fn"} */
    type: "sin-fn";
    times(x: number | Fraction): SinFn;
    times(x: string | Term): Term;
    divide(x: number | Fraction): SinFn;
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
     * solves k sin(f(x)) = rhs, returning the basic angle alpha
     * alpha = arcsin (rhs/k)
     * @param {number|Fraction} rhs - the rhs
     * @param {{degreeMode?: boolean}} [options] -
     * @return {number} the solution
     */
    solve(rhs: number | Fraction, options?: {
        degreeMode?: boolean | undefined;
    } | undefined): number;
}
/** CosFn class representing k cos( f(x) )
 * @class
 * @property {Polynomial} fx
 * @property {"cos-fn"} kind - mathlify kind
 * @property {"cos-fn"} type - mathlify type
 */
export class CosFn extends Term {
    /**
     * @constructor
     * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
     * @param {{coeff?: number|Fraction}} [options] - the base and coefficient of the term
     */
    constructor(fx?: string | number | Fraction | Polynomial | undefined, options?: {
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {Polynomial} */
    fx: Polynomial;
    /** @type {"cos-fn"} */
    kind: "cos-fn";
    /** @type {"cos-fn"} */
    type: "cos-fn";
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
     * returns basic angle alpha = arccos(rhs / k)
     * @param {number|Fraction} rhs - the rhs
     * @param {{degreeMode?: boolean}} [options] -
     * @return {number} the solution
     */
    solve(rhs: number | Fraction, options?: {
        degreeMode?: boolean | undefined;
    } | undefined): number;
}
import { Term } from '../../core';
import { Polynomial } from '../../core';
import { Fraction } from '../../core';
//# sourceMappingURL=sinCos.d.ts.map