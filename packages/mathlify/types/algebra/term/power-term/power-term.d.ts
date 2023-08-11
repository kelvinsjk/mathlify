/**
 * PowerTerm class extending the Term class
 * Represents a term of the form k (exp)^n
 * @property {Expression} exp - the expression under exponentiation
 * @property {Fraction} power - the power n in k (exp)^n
 * @property {Fraction} coeff - the coefficient k in k (exp)^n
 * @property {"power-term"} kind - mathlify rational class kind
 * @property {"power-term"} type - mathlify rational class type
 * @extends Term
 */
export class PowerTerm extends Term {
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp - the expression under exponentiation
     * @param {number|Fraction} power - the power n in k (exp)^n
     * @param {{coeff?: number|Fraction}} [options] - options object defaulting to `{coeff: 1}`
     */
    constructor(exp: Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[], power: number | Fraction, options?: {
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {Expression} */
    exp: Expression;
    /** @type {Fraction} */
    power: Fraction;
    /** @type {"power-term"} */
    kind: "power-term";
    /** @type {"power-term"} */
    type: "power-term";
    /**
     * resets coeff
     * should not be used directly: only present to ensure compatibility with Expression class
     * @returns {PowerTerm} - the term with coeff multiplied in
     */
    resetCoeff(): PowerTerm;
    /**
     * multiplies to coeff.
     * this method is mainly to ensure compatibility with Expression class
     * and should not be used directly unless you know what you are doing
     * @param {number|Fraction} x - the other term to multiply with
     */
    times(x: number | Fraction): PowerTerm;
    /**
     * expands the expression
     * @returns {Expression} - the expanded expression
     */
    expand(): Expression;
}
import { Term } from '../../../core/index.js';
import { Expression } from '../../../core/index.js';
import { Fraction } from '../../../core/index.js';
//# sourceMappingURL=power-term.d.ts.map