/** @typedef {import('./types.d.ts').ExpressionType} ExpressionType */
/** @typedef {import('./types.d.ts').ExpressionJSON} ExpressionJSON */
/** @typedef {import('./types.d.ts').TermJSON} TermJSON */
/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Term>} termAtomMap the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {ExpressionType} type - mathlify expression class kind
 */
export class Expression {
    /**
     * re-instantiate Expression class instance from JSON object literal
     * @param {ExpressionJSON} exp JSON object literal obtained from JSON.parse
     * @returns {Expression} Term class instance
     */
    static fromJSON(exp: ExpressionJSON): Expression;
    /**
     * @constructor
     * Creates an Expression instance
     * @param {(number|Fraction|string|Term|(number|Fraction|string|[string,number|Fraction]|Term)[])[]} terms - terms of the expression
     */
    constructor(...terms: (number | Fraction | string | Term | (number | Fraction | string | [string, number | Fraction] | Term)[])[]);
    /** @type {Map<string,Fraction>} */
    termCoeffMap: Map<string, Fraction>;
    /** @type {Map<string,Term>} */
    termAtomMap: Map<string, Term>;
    /** @type {Term[]} */
    terms: Term[];
    /** @type {ExpressionType} */
    type: ExpressionType;
    /** @type {string[]} */
    get variables(): string[];
    /**
     * boolean methods for this expression
     */
    is: {
        /**
         * @returns {boolean} whether this expression is a singleton (ie can be cast to Term class)
         * */
        term: () => boolean;
        /**
         * @returns {boolean} whether this expression is a constant (ie can be cast to Fraction class)
         * */
        constant: () => boolean;
        /**
         * @returns {boolean} whether this expression is rational (ie can be cast to Fraction class)
         * */
        rational: () => boolean;
        /**
         * @returns {boolean} whether this expression is zero
         */
        zero: () => boolean;
        /**
         * @param {Expression|number|Fraction|string|Term} exp2 the expression to compare to
         * @returns {boolean} whether the two expressions are equal
         */
        equalTo: (exp2: Expression | number | Fraction | string | Term) => boolean;
        not: {
            /** @returns {boolean} whether this expression is not a term (ie more than 1 term present) */
            term: () => boolean;
            /** @returns {boolean} whether this expression is not a constant (ie have variables)) */
            constant: () => boolean;
            /** @returns {boolean} whether this expression is not rational (ie have non-fractions)) */
            rational: () => boolean;
            /**
             *  @param {Expression|number|Fraction|string|Term} exp2
             * @returns {boolean} whether the two expressions are not equal
             */
            equalTo: (exp2: Expression | number | Fraction | string | Term) => boolean;
            /**  @returns {boolean} whether this expression is not zero */
            zero: () => boolean;
        };
    };
    /** methods to cast this term to other types */
    cast: {
        /**
         * @returns {Term} the term representation of this
         */
        toTerm: () => Term;
        /**
         * cast to Fraction type
         * @returns {Fraction} the fraction representation of this term
         */
        toFraction: () => Fraction;
    };
    /**
     * Expression addition
     * @param {number|Fraction|string|Term|Expression} x term/expression to be added
     * @returns {Expression} the sum of the two
     */
    plus(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * @returns {Expression} the negative of the expression
     */
    negative(): Expression;
    /** subtract terms from this Expression
     * @param {number|Fraction|string|Term|Expression} x - term to be subtracted
     * @returns {Expression} - the difference this minus x
     */
    minus(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * @param {number|Fraction|string|Term|Expression} x term/expression to be multiplied
     * @returns {Expression} the product
     */
    times(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * @param {number|Fraction} n the exponent (must be non-negative integer)
     * @returns {Expression} the expression raised to the power of x, fully expanded
     */
    pow(n: number | Fraction): Expression;
    /**
     * @returns {Expression} the expression squared (expanded)
     */
    square(): Expression;
    /**
     * expression divided by a term
     * @param {number|Fraction|string|Term} x term to be divided
     * @param {{fractionalDisplayMode: "always"|"auto"|"never"}} [options] whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
     * @returns {Expression} the quotient this divided by x
     * @warning division by expressions not supported. consider using the RationalTerm class
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: "always" | "auto" | "never";
    } | undefined): Expression;
    subIn(x: {
        [key: string]: number | Fraction;
    }): Expression;
    subIn(x: number | Fraction): Fraction;
    /**
     * change order of terms
     * @param {number[]} args - the indices of the terms to be placed at the front (0-indexed).
     * indices not provided will retain the original order after these terms
     * @return {Expression} the rearranged expression
     */
    changeOrder(args: number[]): Expression;
    /**
     * slice the expression
     * @param {number} end - the end index (not inclusive)
     * @return {Expression} the expression with only terms from term 0 to term end-1
     */
    slice(end: number): Expression;
    /**
     * gcd of the expression (only supports Fractions at the moment)
     * @return {Fraction} the gcd of all the term coefficients
     */
    gcd(): Fraction;
    /**
     * @returns {string} the LaTeX string representation of the Expression
     */
    toTex(): string;
    toString(): string;
    /**
     * serializes expression object. can be used with the static
     * `Expression.FromJSON` method to recreate this expression
     * class instance
     * @returns {ExpressionJSON}
     */
    toJSON(): ExpressionJSON;
}
export type ExpressionType = import('./types.d.ts').ExpressionType;
export type ExpressionJSON = import('./types.d.ts').ExpressionJSON;
export type TermJSON = import('./types.d.ts').TermJSON;
import { Fraction } from "./fraction.js";
import { Term } from "./term.js";
//# sourceMappingURL=expression.d.ts.map