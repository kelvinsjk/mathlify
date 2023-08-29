/**
 * ExpansionTerm class extending the Term class
 * @property {Map<Expression,Fraction>} expPowerMap - map of all the expressions and their powers
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"expansion-term"} kind - mathlify rational class kind
 * @property {"expansion-term"} type - mathlify rational class type
 * @extends Term
 */
export class ExpansionTerm extends Term {
    /**
     * lcm
     * @static
     * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
     * @returns {ExpansionTerm} - the lcm of the expansion terms
     */
    static lcm(...exps: (ExpansionTerm | Expression)[]): ExpansionTerm;
    /**
     * gcd
     * @static
     * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
     * @returns {ExpansionTerm} - the lcm of the expansion terms
     */
    static gcd(...exps: (ExpansionTerm | Expression)[]): ExpansionTerm;
    /**
     * factorize
     * @static
     * @param {ExpansionTerm} exp1 - expansion term 1
     * @param {ExpansionTerm} exp2 - expansion term 2
     * @returns {ExpansionTerm} factorized expression (...)(gcd)
     */
    static factorize(exp1: ExpansionTerm, exp2: ExpansionTerm): ExpansionTerm;
    /**
     * product
     * @static
     * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
     * @returns {ExpansionTerm} - the product of the expansion terms
     */
    static product(...exps: (ExpansionTerm | Expression)[]): ExpansionTerm;
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {(number|Fraction|string|Term|Expression|{exp: Expression, power: number|Fraction}|[Expression, number|Fraction])[]} exps - the expression
     */
    constructor(...exps: (number | Fraction | string | Term | Expression | {
        exp: Expression;
        power: number | Fraction;
    } | [Expression, number | Fraction])[]);
    /** @type {Map<Expression,Fraction>} */
    expPowerMap: Map<Expression, Fraction>;
    /** @type {"expansion-term"} kind - mathlify rational class kind */
    kind: "expansion-term";
    /** @type {"expansion-term"} type - mathlify rational class type */
    type: "expansion-term";
    /**
     * resets coeff
     * should not be used directly: only present to ensure compatibility with Expression class
     * @returns {ExpansionTerm} - the Expansion Term but with coeff = 1
     */
    resetCoeff(): ExpansionTerm;
    /**
     * times (into coefficient)
     * @param {number|Fraction} x - the multiplier
     * @returns {ExpansionTerm} - the Expansion Term multiplied by x
     */
    times(x: number | Fraction): ExpansionTerm;
    /**
     * divide expansion terms
     * @param {ExpansionTerm} x - the divisor
     * @returns {ExpansionTerm} - the Expansion Term divided by x
     */
    divide(x: ExpansionTerm): ExpansionTerm;
    /**
     * to expression power array
     * @returns {{exp: Expression, power: Fraction}[]} - the expression power array
     */
    toExpPowerArray(): {
        exp: Expression;
        power: Fraction;
    }[];
    /**
     * expands the expression
     * @returns {Expression} - the expanded expression
     * WARNING: only works for positive integral powers
     */
    expand(): Expression;
}
import { Term } from "../../../core/index.js";
import { Expression } from "../../../core/index.js";
import { Fraction } from "../../../core/index.js";
//# sourceMappingURL=expansion.d.ts.map