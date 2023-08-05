/** Unsimplified Expression class
 * @property {{term: Term, brackets: 'off'|'auto'|'always', addition: boolean}[]} terms - the terms in the expression
 * @property {"unsimplified-expression"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-expression"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedExpression {
    /**
     * @constructor
     * Creates an Unsimplified Expression instance
     * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', addition?: boolean}|(number|Fraction|string)[])[]} terms -
     * the terms are added by default and
     * brackets is 'off' for the first term and 'auto' by default.
     */
    constructor(...terms: (number | Fraction | string | Term | {
        term: number | Fraction | string | Term;
        brackets?: 'off' | 'auto' | 'always';
        addition?: boolean;
    } | (number | Fraction | string)[])[]);
    terms: {
        term: Term;
        brackets: 'off' | 'auto' | 'always';
        addition: boolean;
    }[];
    /** @type {"unsimplified-expression"} */
    kind: "unsimplified-expression";
    /** @type {"unsimplified-expression"} */
    type: "unsimplified-expression";
    /** add terms to this Expression
     * @param {number|Fraction|Term|string} x - term to be added
     * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
     * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
     */
    plus(x: number | Fraction | Term | string, options?: {
        brackets: 'off' | 'auto' | 'always';
    } | undefined): UnsimplifiedExpression;
    /** subtract terms from this Expression
     * @param {number|Fraction|Term|string} x - term to be subtracted
     * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
     * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
     */
    minus(x: number | Fraction | Term | string, options?: {
        brackets: 'off' | 'auto' | 'always';
    } | undefined): UnsimplifiedExpression;
    /** simplify to Expression class
     * @returns {Expression} - the simplified Expression
     */
    simplify(): Expression;
    /** toString
     * @returns {string} - the LaTeX string representation of the Expression
     */
    toString(): string;
}
import { Term } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=unsimplified-expression.d.ts.map