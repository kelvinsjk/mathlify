/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap - the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Map<string,Fraction>>} termPowerMap - key: term signature, value: term's power map
 * @property {Map<string,boolean>} termFractionalDisplayMap - key: term signature, value: the fractionalDisplayMode of the term
 * @property {Term[]} terms - array of terms in the expression
 * @property {"expression"} kind - mathlify expression class kind
 * @property {"expression"|"expression-term"} type - mathlify expression class type
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
    termCoeffMap: Map<string, Fraction>;
    termPowerMap: Map<string, Map<string, Fraction>>;
    termFractionalDisplayMap: Map<string, boolean>;
    terms: Term[];
    kind: string;
    type: string;
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
     * expression division
     * @param {number|Fraction|string|Term} x - term to be divided
     * @param {{fractionalDisplayMode: boolean}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
     * @returns {Expression} - the quotient
     */
    divide(x: number | Fraction | string | Term, options?: {
        fractionalDisplayMode: boolean;
    } | undefined): Expression;
    /**
     * sub in a value for a variable
     * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * @returns {Expression} - the new Expression
     */
    subIn(variableToValue: number | Fraction | {
        [key: string]: number | Fraction;
    }): Expression;
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