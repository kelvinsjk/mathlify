/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap - the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Term>} termAtomMap - the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {"expression"|"polynomial"} kind - mathlify expression class kind
 * @property {"expression"|"expression-term"|"polynomial"|"linear-polynomial"|"quadratic-polynomial"} type - mathlify expression class type
 */
export class Expression {
    /**
     * @constructor
     * Creates an Expression instance
     * TODO: brackets handling
     * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, addition?: boolean}|(number|Fraction|string)[])[]} terms - terms of the expression
     *
     * The terms are added by default. Use the {term, addition} type to specify whether to add or subtract the term.
     */
    constructor(...terms: (number | Fraction | string | Term | {
        term: number | Fraction | string | Term;
        addition?: boolean;
    } | (number | Fraction | string)[])[]);
    /** @type {Map<string,Fraction>} */
    termCoeffMap: Map<string, Fraction>;
    /** @type {Map<string,Term>} */
    termAtomMap: Map<string, Term>;
    /** @type {Term[]} */
    terms: Term[];
    /** @type {"expression"|"polynomial"|"extended-polynomial"} */
    kind: "expression" | "polynomial" | "extended-polynomial";
    /** @type {"expression"|"expression-term"|"polynomial"|"linear-polynomial"|"quadratic-polynomial"|"extended-polynomial"|"extended-linear-polynomial"|"extended-quadratic-polynomial"} */
    type: "expression" | "expression-term" | "polynomial" | "linear-polynomial" | "quadratic-polynomial" | "extended-polynomial" | "extended-linear-polynomial" | "extended-quadratic-polynomial";
    /**
     * Expression addition
     * @param {number|Fraction|string|Term|Expression} x - term/expression to be added
     * @returns {Expression} - the sum of the two
     */
    plus(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * negative
     * @returns {Expression} the negative of the expression
     */
    negative(): Expression;
    /** subtract terms from this Expression
     * @param {number|Fraction|string|Term|Expression} x - term to be subtracted
     * @returns {Expression} - the difference this minus x
     */
    minus(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * expression multiplication
     * @param {number|Fraction|string|Term|Expression} x - term to be multiplied
     * @returns {Expression} - the product
     */
    times(x: number | Fraction | string | Term | Expression): Expression;
    /**
     * power
     * @param {number|Fraction} x - the exponent (must be non-negative integer)
     * @returns {Expression} - the expression raised to the power of x, fully expanded
     */
    pow(x: number | Fraction): Expression;
    /**
     * square
     * @returns {Expression} - the expression squared (expanded)
     */
    square(): Expression;
    /**
     * expression division
     * @param {number|Fraction|string|Term} x - term to be divided
     * @param {{fractionalDisplayMode: "always"|"auto"|"never"}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
     * @returns {Expression} - the quotient
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: "always" | "auto" | "never";
    } | undefined): Expression;
    subIn(x: {
        [key: string]: number | Fraction;
    }): Expression;
    subIn(x: number | Fraction): Fraction;
    /**
     * changes order of terms
     * @param {number[]} args - the index of the terms to be simplified (0-indexed)
     * @return {Expression}
     */
    changeOrder(args: number[]): Expression;
    /**
     * slice
     * @param {number} end - the end index (not inclusive)
     * @return {Expression}
     */
    slice(end: number): Expression;
    /**
     * gcd of the expression (only supports Fractions at the moment)
     * @return {Fraction} - the gcd of all the terms
     */
    gcd(): Fraction;
    /**
     * boolean methods for this expression
     */
    is: {
        /**
         * @returns {boolean} - whether this expression is a singleton (ie can be cast to Term class)
         * */
        term: () => boolean;
        /**
         * @returns {boolean} - whether this expression is a constant (ie can be cast to Fraction class)
         * */
        constant: () => boolean;
        /**
         * checks if two expressions are equal
         * @param {Expression|number|Fraction|string|Term} exp2 - the expression to compare to
         * @returns {boolean} - whether the two expressions are equal
         */
        equalTo: (exp2: Expression | number | Fraction | string | Term) => boolean;
        not: {
            term: () => boolean;
            constant: () => boolean;
            /** @param {Expression|number|Fraction|string|Term} exp2 */
            equalTo: (exp2: Expression | number | Fraction | string | Term) => boolean;
        };
    };
    /** methods to cast this term to other types */
    cast: {
        /**
         * cast to Term type
         * @returns {Term} the term representation of this term
         */
        toTerm: () => Term;
        /**
         * cast to Fraction type
         * @returns {Fraction} the fraction representation of this term
         */
        toFraction: () => Fraction;
    };
    /** toString
     * @returns {string} - the LaTeX string representation of the Expression
     */
    toString(): string;
}
import { Fraction } from "../../fraction.js";
import { Term } from "../term/index.js";
//# sourceMappingURL=expression.d.ts.map