/** GeneralFn class
 * @property {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} fnTerms - collection of Polynomials and RationalFns
 * @property {"general-fn"} kind - mathlify expression class kind
 * @property {"general-fn"} type - mathlify expression class type
 */
export class GeneralFn extends Expression {
    /**
     * @constructor
     * Creates a GeneralFn instance
     * @param {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} terms - terms of the general expression
     */
    constructor(...terms: (Polynomial | RationalFn | PowerFn | ExpFn | LnFn | SinFn | CosFn)[]);
    /** @type {(Polynomial|RationalFn|PowerFn|ExpFn|LnFn|SinFn|CosFn)[]} */
    fnTerms: (Polynomial | RationalFn | PowerFn | ExpFn | LnFn | SinFn | CosFn)[];
    /** @type {"general-fn"} */
    kind: "general-fn";
    /** @type {"general-fn"} */
    type: "general-fn";
    /**
     * differentiate
     * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator (for RationalFn only)
     * @returns {Expression} - the derivative of the general function
     */
    differentiate(options?: {
        divisor?: Polynomial | undefined;
    } | undefined): Expression;
    /**
     * differentiate to function
     * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator (for RationalFn only)
     * @returns {GeneralFn} - the derivative of the general function
     */
    differentiateToFn(options?: {
        divisor?: Polynomial | undefined;
    } | undefined): GeneralFn;
}
import { Expression } from '../../core/index.js';
import { Polynomial } from '../../core/index.js';
import { RationalFn } from '../rationalFn/rationalFn.js';
import { PowerFn } from '../powerFn/powerFn.js';
import { ExpFn } from '../exp-log/expLog.js';
import { LnFn } from '../exp-log/expLog.js';
import { SinFn } from '../trig/sinCos.js';
import { CosFn } from '../trig/sinCos.js';
//# sourceMappingURL=generalFn.d.ts.map