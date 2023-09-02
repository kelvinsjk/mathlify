/** ExpFn class representing k exp( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {string|number} base
 * @property {"exp-fn"} kind - mathlify kind
 * @property {"exp-fn"} type - mathlify type
 */
export class ExpFn extends Term {
    /**
     * @constructor
     * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
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
    /** @type {"exp-fn"} */
    kind: "exp-fn";
    /** @type {"exp-fn"} */
    type: "exp-fn";
    times(x: number | Fraction | ExpFn): ExpFn;
    times(x: string | Term): Term;
    /**
     * reciprocal
     * @returns {ExpFn} the reciprocal of the term
     */
    reciprocal(): ExpFn;
    divide(x: number | Fraction | ExpFn): ExpFn;
    divide(x: string | Term): Term;
    /**
     * sub in many
     * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number of Fraction is received, we assume that the variable is 'x'
     * @returns {ExpFn} the term with the values subbed in
     */
    subIn(variableToValue: number | Fraction): ExpFn;
    /**
     * solves k exp(f(x)) = rhs, where f(x) is of the form nx
     * @param {number|Fraction} rhs - the rhs
     * @return {LnFn} the solution
     */
    solve(rhs: number | Fraction): LnFn;
}
/** LnFn class representing k ln( f(x) )
 * @class
 * @property {string} log - the long string
 * @property {Polynomial} fx
 * @property {string|number} base
 * @property {"ln-fn"} kind - mathlify kind
 * @property {"ln-fn"} type - mathlify type
 */
export class LnFn extends Term {
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
    /** @type {"ln-fn"} */
    kind: "ln-fn";
    /** @type {"ln-fn"} */
    type: "ln-fn";
    /**
     * move the coeff up to f(x)
     */
    coeffToPower(): LnFn;
    /**
     * @param {LnFn} x - the other term to add with
     * @returns {LnFn} the sum of the two terms
     */
    plus(x: LnFn): LnFn;
    /**
     * @param {LnFn} x -
     * @returns {string}
     */
    minus(x: LnFn): string;
    /**
     * change base
     * @param {number|string} newBase - the new base
     * @returns {[LnFn, LnFn, RationalTerm]} the new numerator and denominator, as well as the fraction in RationalTerm class
     */
    changeBase(newBase: number | string): [LnFn, LnFn, RationalTerm];
    times(x: number | Fraction): LnFn;
    times(x: string | Term): Term;
    divide(x: number | Fraction): LnFn;
    divide(x: string | Term): Term;
    /**
     * sub in many
     * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number of Fraction is received, we assume that the variable is 'x'
     * @returns {LnFn} the term with the values subbed in
     */
    subIn(variableToValue: number | Fraction): LnFn;
    /**
     * solves k ln(f(x)) = rhs, where f(x) is of the form nx
     * @param {number|Fraction} rhs - the rhs
     * @return {ExpFn} the solution
     */
    solve(rhs: number | Fraction): ExpFn;
}
import { Term } from "../../core";
import { Polynomial } from "../../core";
import { Fraction } from "../../core";
import { RationalTerm } from "../../algebra";
//# sourceMappingURL=expLog.d.ts.map