/**
 * RationalTerm class extending the Term class
 * @property {Expression} num - the numerator of the term
 * @property {Expression} den - the denominator of the term
 * @property {"rational"} kind - mathlify rational class kind
 * @property {"rational"|"rational-expression"} type - mathlify rational class type
 * @extends Term
 */
export class RationalTerm extends Term {
    /**
     * @constructor
     * Creates a Rational Term instance
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} numerator - the numerator
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [denominator=1] - the denominator
     * @throws {Error} if denominator is zero
     */
    constructor(numerator: Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[], denominator?: string | number | Fraction | Term | Expression | (string | number | Fraction | Term)[] | undefined);
    num: Expression;
    den: Expression;
    /**
     * multiplication
     * @param {number|Fraction|string|Term|Expression|RationalTerm} x - the other term/expression to multiply with
     * @returns {RationalTerm} the product of the two
     * @override
     */
    override times(x: number | Fraction | string | Term | Expression | RationalTerm): RationalTerm;
    /**
     * division
     * @param {number|Fraction|string|Term|Expression|RationalTerm} x - the other term/expression to divide with
     * @returns {RationalTerm} the quotient of the two
     */
    divide(x: number | Fraction | string | Term | Expression | RationalTerm): RationalTerm;
    /**
     * addition
     * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be added
     * @returns {RationalTerm} - the sum of the two
     */
    plus(x: number | Fraction | string | Term | Expression | RationalTerm): RationalTerm;
    /**
     * negative
     * @returns {RationalTerm} the negative of the expression
     */
    negative(): RationalTerm;
    /**
     * subtraction
     * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be subtracted
     * @returns {RationalTerm} - the difference this minus x
     */
    minus(x: number | Fraction | string | Term | Expression | RationalTerm): RationalTerm;
    /**
     * sub in a value for a variable
     * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
     * @returns {RationalTerm} - the new RationalTerm
     */
    subIn(variableToValue: number | Fraction | {
        [key: string]: number | Fraction;
    }): RationalTerm;
    /** methods to cast this term to other types */
    cast: {
        /**
         * cast to Expression type (denominator must be a constant)
         * @returns {Expression} an Expression representation of this term
         */
        toExpression: () => Expression;
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
}
import { Term } from '../../core/index.js';
import { Expression } from '../../core/index.js';
import { Fraction } from '../../core/index.js';
//# sourceMappingURL=rational.d.ts.map