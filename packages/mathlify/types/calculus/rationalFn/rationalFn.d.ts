/**
 * @typedef {import('../../core/index.js').Term} Term
 * @typedef {import('../../core/index.js').Expression} Expression
 */
/**
 * RationalFn class extending the RationalTerm class
 * @property {Polynomial} numFn - the numerator of the term
 * @property {Polynomial} denFn - the denominator of the term
 * @property {Fraction} denPow - the power of the denominator
 * @property {"rational-term"} kind - mathlify rational class kind
 * @property {"rational-term"|"rational-expression"} type - mathlify rational class type
 * @extends RationalTerm
 */
export class RationalFn extends RationalTerm {
    /**
     * @constructor
     * Creates a Rational Fn instance
     * @param {Polynomial|number|Fraction|(number|Fraction)[]} numerator - the numerator
     * @param {Polynomial|number|Fraction|[Polynomial, number|Fraction]} denominator - the denominator
     */
    constructor(numerator: Polynomial | number | Fraction | (number | Fraction)[], denominator?: Polynomial | number | Fraction | [Polynomial, number | Fraction]);
    /** @type {Polynomial} */
    numFn: Polynomial;
    /** @type {Polynomial} */
    denFn: Polynomial;
    /** @type {"rational-fn"} */
    type: "rational-fn";
    num: Polynomial;
    denPow: Fraction;
    /**
     * differentiate
     * @returns {RationalFn} the derivative of the expression
     */
    differentiate(): RationalFn;
    times(x: number | Fraction | RationalFn): RationalFn;
    times(x: string | Term | RationalTerm): RationalTerm;
    divide(x: number | Fraction | RationalFn): RationalFn;
    divide(x: string | Term | RationalTerm): RationalTerm;
    /**
     * long division
     * @return {Expression}
     */
    longDivide(): Expression;
    /**
     * negative
     * @returns {RationalFn} the negative of the expression
     */
    negative(): RationalFn;
}
export type Term = import('../../core/index.js').Term;
export type Expression = import('../../core/index.js').Expression;
import { RationalTerm } from '../../algebra/index.js';
import { Polynomial } from '../../core/index.js';
import { Fraction } from '../../core/index.js';
//# sourceMappingURL=rationalFn.d.ts.map