/** Unsimplified Expression class
 * TODO: convert Fraction type to Term/Unsimplified Term type
 * @property {{term: Term, brackets: 'off'|'auto'|'always', addition: boolean}[]} terms - the terms in the expression
 * @property {"unsimplified-expression"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-expression"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedExpression {
    /**
     * @constructor
     * Creates an Unsimplified Expression instance
     * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', addition?: boolean})[]} terms -
     * the terms are added by default and
     * brackets is 'off' for the first term and 'auto' by default.
     */
    constructor(...terms: (number | Fraction | string | Term | {
        term: number | Fraction | string | Term;
        brackets?: 'off' | 'auto' | 'always';
        addition?: boolean;
    })[]);
    terms: {
        term: Term;
        brackets: 'off' | 'auto' | 'always';
        addition: boolean;
    }[];
    kind: string;
    type: string;
    /** add terms to this Expression
     * @param {number|Fraction} x - term to be added
     * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
     * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
     */
    plus(x: number | Fraction, options?: {
        brackets: 'off' | 'auto' | 'always';
    } | undefined): UnsimplifiedExpression;
    /** subtract terms from this Expression
     * @param {number|Fraction} x - term to be subtracted
     * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
     * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
     */
    minus(x: number | Fraction, options?: {
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
import { Term } from "../term/index.js";
import { Fraction } from "../../fraction.js";
import { Expression } from "./expression.js";
//# sourceMappingURL=unsimplified-expression.d.ts.map