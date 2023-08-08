/**
 * Unsimplified Term class
 * @class
 * @property {{termAtom: Term, brackets: 'off'|'auto'|'always', multiplication: boolean}[]} termAtoms - the term atoms in the term
 * @property {boolean} fractionalDisplayMode - whether division is implemented with fractions or as a division sign (false by default)
 * @property {"unsimplified-term"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-term"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedTerm {
    /**
     * @constructor
     * Creates an Unsimplified Term instance
     * @param {(number|Fraction|string|Term|{termAtom: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', multiplication?: boolean}|(number|Fraction|string)[])[]} termAtoms -
     * the terms are multiplied by default and
     * brackets is 'off' for the first term and 'auto' by default.
     */
    constructor(...termAtoms: (number | Fraction | string | Term | {
        termAtom: number | Fraction | string | Term;
        brackets?: 'off' | 'auto' | 'always';
        multiplication?: boolean;
    } | (number | Fraction | string)[])[]);
    termAtoms: {
        termAtom: Term;
        brackets: 'off' | 'auto' | 'always';
        multiplication: boolean;
    }[];
    fractionalDisplayMode: boolean;
    /** @type {"unsimplified-term"} */
    kind: "unsimplified-term";
    /** @type {"unsimplified-term"} */
    type: "unsimplified-term";
    /**
     * multiply to this Term
     * @param {number|Fraction|string|Term} x - term to be multiplied
     * @param {{brackets: 'off'|'auto'|'always'}} [options] - options for the brackets (defaults to auto)
     * @returns {UnsimplifiedTerm} - the new Unsimplified Expression
     */
    times(x: number | Fraction | string | Term, options?: {
        brackets: 'off' | 'auto' | 'always';
    } | undefined): UnsimplifiedTerm;
    /**
     * divide from this Term
     * @param {number|Fraction|string|Term} x - term to be subtracted
     * @param {{brackets?: 'off'|'auto'|'always', fractionalDisplayMode?: boolean}} [options] - options for the brackets (defaults to auto) and fractionalDisplayMode (defaults to false)
     * @returns {UnsimplifiedTerm} - the new Unsimplified Expression
     */
    divide(x: number | Fraction | string | Term, options?: {
        brackets?: "auto" | "always" | "off" | undefined;
        fractionalDisplayMode?: boolean | undefined;
    } | undefined): UnsimplifiedTerm;
    /** simplify to Term class
     * @returns {Term} - the simplified Term
     */
    simplify(): Term;
    /**
     * toString
     * @returns {string} - the LaTeX string representation of the Expression
     */
    toString(): string;
}
import { Term } from "../../../core/index.js";
import { Fraction } from "../../../core/index.js";
//# sourceMappingURL=unsimplified-term.d.ts.map