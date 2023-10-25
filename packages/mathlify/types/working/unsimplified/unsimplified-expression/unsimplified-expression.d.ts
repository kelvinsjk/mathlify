/** Unsimplified Expression class
 * @property {Map<string,Term>} termAtomMap the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {({brackets: "off"|"auto"|"always", additions: boolean})[]} termOptions - array indicating whether to typeset term with brackets, and if it is under addition/subtraction
 * @property {"unsimplified-expression"} type - mathlify expression class kind
 */
export class UnsimplifiedExpression {
    /**
     * @constructor
     * Creates an Expression instance
     * @param {(number|Fraction|string|Term|(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction]|Term)[]|{term: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', addition?: boolean})[]} terms - terms of the expression
     */
    constructor(...terms: (number | Fraction | string | Term | (number | Fraction | string | {
        variable: string;
        power: number | Fraction;
    } | [string, number | Fraction] | Term)[] | {
        term: number | Fraction | string | Term;
        brackets?: 'off' | 'auto' | 'always';
        addition?: boolean;
    })[]);
    /** @type {Map<string,Term>} */
    termAtomMap: Map<string, Term>;
    /** @type {Term[]} */
    terms: Term[];
    /** @type {({brackets: "off"|"auto"|"always", addition: boolean})[]} */
    termOptions: ({
        brackets: "off" | "auto" | "always";
        addition: boolean;
    })[];
    /** @type {"unsimplified-expression"} */
    type: "unsimplified-expression";
    /** @type {string[]} */
    get variables(): string[];
    /**
     * simplifies to an Expression class, combining like terms
     * @returns {Expression} the simplified expression
     */
    simplify(): Expression;
    /**
     * Expression addition
     * @param {number|Fraction|string|Term|UnsimplifiedExpression} x term/expression to be added
     * @returns {UnsimplifiedExpression} the sum of the two
     */
    plus(x: number | Fraction | string | Term | UnsimplifiedExpression): UnsimplifiedExpression;
    /**
     * @returns {UnsimplifiedExpression} the negative of the expression
     */
    negative(): UnsimplifiedExpression;
    /**
     * @returns {string} the LaTeX string representation of the Expression
     */
    toTex(): string;
    toString(): string;
}
import { Term } from "../../../core/index.js";
import { Expression } from "../../../core/index.js";
import { Fraction } from "../../../core/index.js";
//# sourceMappingURL=unsimplified-expression.d.ts.map