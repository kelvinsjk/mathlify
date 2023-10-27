/**
 * ExpansionTerm class extending the Term class
 * @property {Map<Expression,Fraction>} expPowerMap - map of all the expressions and their powers
 * @property {Term} factor
 * @property {Expression[]} exps
 * @property {"expansion-product"} type
 * @extends Term
 */
export class ExpressionProduct extends Term {
    /**
     * lcm
     * @static
     * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
     * @returns {ExpressionProduct} - the lcm of the expansion terms
     */
    static lcm(...exps: (ExpressionProduct | Expression)[]): ExpressionProduct;
    /**
     * gcd
     * @static
     * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
     * @returns {ExpressionProduct} - the lcm of the expansion terms
     */
    static gcd(...exps: (ExpressionProduct | Expression)[]): ExpressionProduct;
    /**
     * factorize
     * @static
     * @param {ExpressionProduct} exp1 - expansion term 1
     * @param {ExpressionProduct} exp2 - expansion term 2
     * @returns {ExpressionProduct} factorized expression (...)(gcd)
     */
    static factorize(exp1: ExpressionProduct, exp2: ExpressionProduct): ExpressionProduct;
    /**
     * product
     * @static
     * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
     * @returns {ExpressionProduct} - the product of the expansion terms
     */
    static product(...exps: (ExpressionProduct | Expression)[]): ExpressionProduct;
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {(number|Fraction|string|Term|Expression
     * |[Expression|(number|Fraction|string|[string,number|Fraction]|Term)[], number|Fraction])[]} exps - the expression
     */
    constructor(...exps: (number | Fraction | string | Term | Expression | [Expression | (number | Fraction | string | [string, number | Fraction] | Term)[], number | Fraction])[]);
    /** @type {Map<Expression,Fraction>} */
    expPowerMap: Map<Expression, Fraction>;
    /** @type {Expression[]} */
    exps: Expression[];
    /** @type {"expression-product"} kind - mathlify rational class kind */
    type: "expression-product";
    /** @type {Term} */
    factor: Term;
    /**
     * resets coeff
     * should not be used directly: only present to ensure compatibility with Expression class
     * @returns {ExpressionProduct} - the Expansion Term but with coeff = 1
     */
    resetCoeff(): ExpressionProduct;
    /**
     * times
     * @param {number|Fraction|string|Term|ExpressionProduct} x - the multiplier
     * @returns {ExpressionProduct} - the ExpressionProduct multiplied by x
     */
    times(x: number | Fraction | string | Term | ExpressionProduct): ExpressionProduct;
    /**
     * divide expansion terms
     * @param {ExpressionProduct} x - the divisor
     * @returns {ExpressionProduct} - the Expansion Term divided by x
     */
    divide(x: ExpressionProduct): ExpressionProduct;
    /**
     * to expression power array
     * @returns {[Expression, power: Fraction][]} - the expression power array
     */
    toExpPowerArray(): [Expression, power: Fraction][];
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
//# sourceMappingURL=expression-product.d.ts.map