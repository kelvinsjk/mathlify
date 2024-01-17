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
    type: "general-fn";
    /**
     * differentiate
     * @returns {Expression} - the derivative of the general function
     */
    differentiate(): Expression;
    /**
     * differentiate to function
     * @returns {GeneralFn} - the derivative of the general function
     */
    differentiateToFn(): GeneralFn;
}
import { Expression } from "../../core/index.js";
import { Polynomial } from "../../core/index.js";
import { RationalFn } from "../rationalFn/rationalFn.js";
import { PowerFn } from "../powerFn/powerFn.js";
import { ExpFn } from "../exp-log/expLog.js";
import { LnFn } from "../exp-log/expLog.js";
import { SinFn } from "../trig/sinCos.js";
import { CosFn } from "../trig/sinCos.js";
//# sourceMappingURL=generalFn.d.ts.map