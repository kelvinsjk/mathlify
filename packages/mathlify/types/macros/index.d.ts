/** @typedef {[number|string|Expression, '/', number|string|Expression]} QuotientShorthand */
/** @typedef {['-', number|string|Expression|PowerShorthand]} NegativeShorthand */
/** @typedef {['()', Expression|number|string|QuotientShorthand|NegativeShorthand]} BracketShorthand */
/** @typedef {[Expression|string, number]} PowerShorthand */
/**
 * creates a fraction as an expression.
 * by default, the fraction is simplified.
 * Note: to work arithmetically, we recommend using the `Fraction` constructor rather than this function (which produces an Expression)
 * @param {number} num - numerator
 * @param {number} [den=1] - denominator. defaults to 1
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the fraction.
 * @returns {Expression}
 */
export function fraction(num: number, den?: number | undefined, options?: {
    verbatim?: boolean | undefined;
} | undefined): Expression;
/**
 * creates a sum as an expression
 * by default, the sum is simplified
 * product shorthand: [a,b] represents the product ab
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} terms
 * @returns {Expression}
 */
export function sum(...terms: (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand | (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand)[])[]): Expression;
/**
 * creates a sum as an expression that is not simplified
 * product shorthand: [a,b] represents the product ab
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} terms
 * @returns {Expression}
 */
export function sumVerbatim(...terms: (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand | (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand)[])[]): Expression;
/**
 * creates a product as an expression
 * by default, the product is simplified
 * sum shorthand: [a,b] represents the sum a+b
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} factors
 */
export function product(...factors: (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand | (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand)[])[]): Expression;
/**
 * creates a product as an expression that is not simplified
 * sum shorthand: [a,b] represents the sum a+b
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * exponent shorthand: [a, n] where n must be a number and a cannot be '()'
 * @param {...(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand
 * |(Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand)[])} factors
 */
export function productVerbatim(...factors: (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand | (Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand)[])[]): Expression;
/**
 * @param {Expression|string|number|NegativeShorthand|QuotientShorthand|PowerShorthand} exp
 * @returns {Expression} An un-simplified expression wrapped in parentheses
 */
export function brackets(exp: Expression | string | number | NegativeShorthand | QuotientShorthand | PowerShorthand): Expression;
/**
 * creates a quotient as an expression.
 * by default, the quotient is simplified.
 * negative shorthand: ['-', x] represents the negative value -x
 * quotient shorthand: [a, '/', b] represents the quotient a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * power shorthand: [a, n] where n must be a number represents the exponentiation a^n
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} num
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} den
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the quotient.
 * @returns {Expression}
 */
export function quotient(num: Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand, den: Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand, options?: {
    verbatim?: boolean | undefined;
} | undefined): Expression;
/**
 * creates a exponent as an expression.
 * by default, the exponent is simplified.
 * negative shorthand: ['-', x] represents the negative value -x
 * quotient shorthand: [a, '/', b] represents the quotient a/b
 * brackets shorthand: ['()', a] represents the bracketed expression (a)
 * power shorthand: [a, n] where n must be a number represents the exponentiation a^n
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} base
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} power
 * @param {{verbatim?: boolean}} [options] - options. verbatim: if true, do not simplify the quotient.
 * @returns {Expression}
 */
export function exponent(base: Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand, power: Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand, options?: {
    verbatim?: boolean | undefined;
} | undefined): Expression;
/**
 *
 * @param {Expression|number|string|NegativeShorthand|QuotientShorthand|BracketShorthand|PowerShorthand} exp
 * @returns {Expression|number|string}
 */
export function unpack_shorthand_single(exp: Expression | number | string | NegativeShorthand | QuotientShorthand | BracketShorthand | PowerShorthand): Expression | number | string;
export { polynomial } from "./polynomials.js";
export type QuotientShorthand = [number | string | Expression, '/', number | string | Expression];
export type NegativeShorthand = ['-', number | string | Expression | [string | Expression, number]];
export type BracketShorthand = ['()', Expression | number | string | [string | number | Expression, "/", string | number | Expression] | ["-", string | number | Expression | PowerShorthand]];
export type PowerShorthand = [Expression | string, number];
import { Expression } from '../core/expression/index.js';
//# sourceMappingURL=index.d.ts.map