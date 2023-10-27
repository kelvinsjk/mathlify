/**
 * recreates Term objects from a power map
 * @param {Map<string,Fraction>|undefined} powerMap - the power map to be converted
 * @param {Fraction?} coeff - the coefficient of the term (optional)
 * @returns {Term} the term object
 */
export function powerMapToTerm(powerMap: Map<string, Fraction> | undefined, coeff: Fraction | null): Term;
/**
 * @typedef {import('./types.js').TermType} TermType
 * @typedef {import('./expression.js').Expression} Expression
 */
/** Term class
 * @class
 * @property {Fraction} coeff the coefficient of the term
 * @property {Map<string,Fraction>} powerMap Map object with the key is the variable string and the value is the power/index
 * @property {string} signature a string representation of the (sorted) variables. useful for determining if two terms are alike
 * @property {"never"|"auto"|"always"} fractionalDisplayMode default: auto. For example, consider the terms 2x/5 and 2x/5y.
 * In auto mode, they will be typeset as $\frac{2}{5} x$ and $\frac{2 x}{5 y}$ respectively.
 * In never mode, they will be typeset as $\frac{2}{5} x$ and $\frac{2}{5} x y^{-1}$.
 * In always mode, they will be typeset as $\frac{2}{5 x}$ and $\frac{2 x}{5 y}$
 * @property {TermType} type - mathlify term class
 */
export class Term {
    /**
     * gcd of n terms
     * @param {(Term|Expression)[]} terms
     * @returns {Term} the gcd of the terms
     */
    static gcd(...terms: (Term | Expression)[]): Term;
    /**
     * lcm of n terms
     * @param {(Term|Expression)[]} terms
     * @returns {Term} the lcm of the terms
     */
    static lcm(...terms: (Term | Expression)[]): Term;
    /**
     * re-instantiate Term class instance from JSON object literal
     * @param {TermJSON} t JSON object literal obtained from JSON.parse
     * @returns {Term} Term class instance
     */
    static fromJSON(t: import("./types.js").TermJSON): Term;
    /**
     * @constructor
     * Creates a Term instance, automatically combining all like variables using powers
     * @param {(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction])[]} args
     * the constituents of the term (either number or fraction or string)
     * @warning to change the fractionalDisplayMode, use the setDisplayMode method
     */
    constructor(...args: (number | Fraction | string | {
        variable: string;
        power: number | Fraction;
    } | [string, number | Fraction])[]);
    /** @type {Fraction} */
    coeff: Fraction;
    /** @type {Map<string,Fraction>}
     * map of variable string as key and index/power as the value
     */
    powerMap: Map<string, Fraction>;
    /** @type {string} */
    signature: string;
    /** @type {"never"|"auto"|"always"} */
    fractionalDisplayMode: "never" | "auto" | "always";
    /** @type {TermType} */
    type: TermType;
    /** @type {string[]} */
    get variables(): string[];
    /**
     * @param {"never"|"auto"|"always"} mode the fractional handling mode
     * @returns {Term} reference to current term
     * @warning modifies current instance
     * */
    setDisplayMode(mode: "never" | "auto" | "always"): Term;
    /**
     * boolean methods for this term
     */
    is: {
        /**
         * @returns {boolean} whether this term is a constant (no variables)
         */
        constant: () => boolean;
        /**
         * @returns {boolean} whether this term is rational (ie can be cast to Fraction class)
         */
        rational: () => boolean;
        /**
         * @param {Term|number|Fraction|string} term2
         * @return {boolean} whether the two terms are equal (have same signature and coefficient)
         */
        equalTo: (term2: Term | number | Fraction | string) => boolean;
        /**
         * @param {Term|number|Fraction|string} term2
         * @return {boolean} whether the two terms are alike (have same signature)
         */
        like: (term2: Term | number | Fraction | string) => boolean;
        not: {
            /**
             * @returns whether this term is not a constant (ie variables present)
             */
            constant: () => boolean;
            /**
             * @returns whether this term is not rational (ie variables present)
             */
            rational: () => boolean;
            /**
             * @param {Term|number|Fraction|string} term2
             * @returns {boolean} whether the two terms are not equal to each other
             * */
            equalTo: (term2: Term | number | Fraction | string) => boolean;
            /**
             * @param {Term|number|Fraction|string} term2
             * @returns {boolean} whether the two terms are not alike (ie different term signature)
             * */
            like: (term2: Term | number | Fraction | string) => boolean;
        };
    };
    /** methods to cast this term to other types */
    cast: {
        /**
         * @returns {Fraction} the fraction representation of this term
         */
        toFraction: () => Fraction;
    };
    /**
     * @param {number|Fraction|string|Term|[string,number|Fraction]} x the other term to multiply with
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the product of the two terms
     */
    times(x: number | Fraction | string | Term | [string, number | Fraction], options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the reciprocal of the term
     */
    reciprocal(options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * @param {number|Fraction|string|Term} x - the other term to divide with
     * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
     * @returns {Term} the quotient this divided by x
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: "never" | "auto" | "always";
    } | undefined): Term;
    /**
     * @returns {Term} the negative of the term
     * */
    negative(): Term;
    /**
     * @returns {Term} the absolute value of the term (ie make coefficient non-negative)
     */
    /**
     * @param {number|Fraction} n - the power to raise the term to
     * @returns {Term} power of the term
     */
    pow(n: number | Fraction): Term;
    abs(): Term;
    /**
     * @returns {Term} the term with same variables but with coefficient 1
     */
    resetCoeff(): Term;
    /**
     * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * If a number/Fraction type is received, we assume that the variable is 'x'
     * @returns {Term} the term after the values are subbed in
     */
    subIn(variableToValue: number | Fraction | {
        [key: string]: number | Fraction;
    }): Term;
    /**
     * @returns {string} the latex string representation of this term
     */
    toTex(): string;
    toString(): string;
    /**
     * @typedef {import('./types.js').TermJSON} TermJSON
     * @typedef {import('./types.js').FractionJSON} FractionJSON
     */
    /**
     * serializes term object. can be used with the static
     * `Term.FromJSON` method to recreate this term
     * class instance
     * @returns {TermJSON}
     */
    toJSON(): import("./types.js").TermJSON;
}
export type TermType = import('./types.js').TermType;
export type Expression = import('./expression.js').Expression;
import { Fraction } from "./fraction.js";
//# sourceMappingURL=term.d.ts.map