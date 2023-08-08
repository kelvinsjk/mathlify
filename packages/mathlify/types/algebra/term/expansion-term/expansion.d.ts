/**
 * RationalTerm class extending the Term class
 * @property {Term} exp1 - the first expression (currently only supports a single term)
 * @property {Expression} exp2 - the second expression
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"expansion-term"} kind - mathlify rational class kind
 * @property {"expansion-term"} type - mathlify rational class type
 * @extends Term
 */
export class ExpansionTerm extends Term {
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {number|Fraction|string|Term} exp1 - the first expression (currently only supports a single term)
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp2 - the second expression
     * @throws {Error} if denominator is zero
     */
    constructor(exp1: number | Fraction | string | Term, exp2: Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[]);
    exp1: Term;
    exp2: Expression;
    /**
     * resets coeff
     * should not be used directly: only present to ensure compatibility with Expression class
     * @returns {ExpansionTerm} - the term with coeff multiplied in
     */
    resetCoeff(): ExpansionTerm;
    /**
     * multiplies to exp1.
     * this method is mainly to ensure compatibility with Expression class
     * and should not be used directly unless you know what you are doing
     * @param {number|Fraction|string|Term} x - the other term to multiply with
     */
    times(x: number | Fraction | string | Term): ExpansionTerm;
    /**
     * expands the expression
     * @returns {Expression} - the expanded expression
     */
    expand(): Expression;
}
import { Term } from "../../../core/index.js";
import { Expression } from "../../../core/index.js";
import { Fraction } from "../../../core/index.js";
//# sourceMappingURL=expansion.d.ts.map