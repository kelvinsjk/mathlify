/**
 * recreates Term objects from a power map
 * @param {Map<string,Fraction>|undefined} powerMap - the power map to be converted
 * @param {Fraction?} coeff - the coefficient of the term (optional)
 * @returns {Term} the term object
 */
export function powerMapToTerm(powerMap: Map<string, Fraction> | undefined, coeff: Fraction | null): Term;
/** Term class
 * @property {Fraction} coeff - the coefficient of the term
 * @property {Map<string,Fraction>} powerMap - the key is the variable atom, the value is the power
 * @property {string} signature - a string representation of the (sorted) variables
 * @property {boolean} fractionalDisplayMode - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
 * @property {"term"} kind - mathlify fraction class
 * @property {"term"|"term-frac"} kind - mathlify fraction class
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
    coeff: Fraction;
    powerMap: Map<string, Fraction>;
    signature: string;
    kind: string;
    type: string;
    fractionalDisplayMode: boolean;
    /**
     * term multiplication
     * @param {number|Fraction|string|Term} x - the other term to multiply with
     * @returns {Term} the product of the two terms
     */
    times(x: number | Fraction | string | Term): Term;
    /**
     * reciprocal
     * @param {{fractionalDisplayMode: boolean}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
     * @returns {Term} the reciprocal of the term
     */
    reciprocal(options?: {
        fractionalDisplayMode: boolean;
    } | undefined): Term;
    /**
     * term division
     * @param {number|Fraction|string|Term} x - the other term to divide with
     * @param {{fractionalDisplayMode: boolean}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
     * @returns {Term} the quotient of the two terms
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: boolean;
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
    };
    /**
     * change the fractional display to true
     * WARNING: changes the term in place
     * @returns {Term} reference to current term
     * */
    setFractionalDisplay(): Term;
    /**
     * change the fractional display to false
     * WARNING: changes the term in place
     * @returns {Term} reference to current term
     * */
    setCoeffDisplay(): Term;
    /**
     * casts this term as a latex string
     * @returns {string} the latex string representation of this term
     */
    toString(): string;
}
import { Fraction } from "../../fraction.js";
//# sourceMappingURL=term.d.ts.map