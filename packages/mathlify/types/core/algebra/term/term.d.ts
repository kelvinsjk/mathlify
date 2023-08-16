/**
 * recreates Term objects from a power map
 * @param {Map<string,Fraction>|undefined} powerMap - the power map to be converted
 * @param {Fraction?} coeff - the coefficient of the term (optional)
 * @returns {Term} the term object
 */
export function powerMapToTerm(powerMap: Map<string, Fraction> | undefined, coeff: Fraction | null): Term;
/** Term class
 * @class
 * @property {Fraction} coeff - the coefficient of the term
 * @property {Map<string,Fraction>} powerMap - the key is the variable atom, the value is the power
 * @property {string} signature - a string representation of the (sorted) variables
 * @property {"never"|"auto"|"always"} fractionalDisplayMode - default: auto. typesets as coeff followed by fraction (eg 3/5 x) if no negative indices for the variable atoms, but
 * as a fraction if negative indices encountered (eg 3x / 5y). "never" will also typeset as coeff followed by fraction, resorting to negative indices.
 * "always" will always typeset as a fraction as long as the denominator is not 1
 * @property {"term"|"rational-term"|"expansion-term"|"sqrt"} kind - mathlify term class
 * @property {"term"|"term-frac"|"rational-term"|"rational-expression"|"expansion-term"|"sqrt"|"sqrt-rational"} type - mathlify term class
 */
export class Term {
    /**
     * @constructor
     * Creates a Term instance, automatically simplifying all terms by grouping them together
     * under a "PowerTerm"
     * TODO: update different types of symbols
     * @param {(Fraction|string|number|{variable: string, power: number|Fraction}|[string,number|Fraction])[]} args -
     * the constituents of the term (either number or fraction or string)
     */
    constructor(...args: (Fraction | string | number | {
        variable: string;
        power: number | Fraction;
    } | [string, number | Fraction])[]);
    /** @type {Fraction} */
    coeff: Fraction;
    /** @type {Map<string,Fraction>} */
    powerMap: Map<string, Fraction>;
    /** @type {string} */
    signature: string;
    /** @type {"never"|"auto"|"always"} */
    fractionalDisplayMode: "never" | "auto" | "always";
    /** @type {"term"|"rational-term"|"expansion-term"|"sqrt"} */
    kind: "term" | "rational-term" | "expansion-term" | "sqrt";
    /** @type {"term"|"term-frac"|"rational-term"|"rational-expression"|"expansion-term"|"sqrt"|"sqrt-rational"} */
    type: "term" | "term-frac" | "rational-term" | "rational-expression" | "expansion-term" | "sqrt" | "sqrt-rational";
    /**
     * term multiplication
     * @param {number|Fraction|string|Term} x - the other term to multiply with
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the product of the two terms
     */
    times(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * reset coeff: changes the coefficient of the term to 1
     * @returns {Term} the term with coefficient 1
     */
    resetCoeff(): Term;
    /**
     * reciprocal
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the reciprocal of the term
     */
    reciprocal(options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * term division
     * @param {number|Fraction|string|Term} x - the other term to divide with
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the quotient of the two terms
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * negative
     * @returns {Term} the negative of the term
     * */
    negative(): Term;
    /**
     * sub in many
     * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number of Fraction is received, we assume that the variable is 'x'
     * @returns {Term} the term with the values subbed in
     */
    subIn(variableToValue: number | Fraction | {
        [key: string]: number | Fraction;
    }): Term;
    /** methods to cast this term to other types */
    cast: {
        /**
         * cast to Fraction type
         * @returns {Fraction} the fraction representation of this term
         */
        toFraction: () => Fraction;
    };
    /**
     * boolean methods for this term
     */
    is: {
        /**
         * whether this term is a constant (ie can be cast to Fraction class)
         */
        constant: () => boolean;
        /**
         * checks if two terms are equal (same signature and same coefficient)
         * @param {Term|number|Fraction|string} term2
         * @return {boolean}
         */
        equalTo: (term2: Term | number | Fraction | string) => boolean;
        /**
         * checks if two terms are alike (same signature)
         * @param {Term|number|Fraction|string} term2
         * @return {boolean}
         */
        like: (term2: Term | number | Fraction | string) => boolean;
        not: {
            constant: () => boolean;
            /** @param {Term|number|Fraction|string} term2 */
            equalTo: (term2: Term | number | Fraction | string) => boolean;
            /** @param {Term|number|Fraction|string} term2 */
            like: (term2: Term | number | Fraction | string) => boolean;
        };
    };
    /**
     * change the fractional display mode
     * WARNING: changes the term in place
     * @param {"never"|"auto"|"always"} mode - the fractional handling mode
     * @returns {Term} reference to current term
     * */
    setDisplayMode(mode: "never" | "auto" | "always"): Term;
    /**
     * casts this term as a latex string
     * @returns {string} the latex string representation of this term
     */
    toString(): string;
}
import { Fraction } from "../../fraction.js";
//# sourceMappingURL=term.d.ts.map