/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class Equation {
    /**
     * Creates an Equation
     * @param {Expression|number|string} lhs - the initial expression on the left
     * @param {Expression|number|string} [rhs=0] - the initial expression on the right
     * @param {{aligned?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
     */
    constructor(lhs: Expression | number | string, rhs?: string | number | Expression | undefined, options?: {
        aligned?: boolean | undefined;
    } | undefined);
    /** @type {Expression} the expression on the left*/
    lhs: Expression;
    /** @type {Expression} the expression on the right*/
    rhs: Expression;
    /** @type {'equation'} */
    type: 'equation';
    aligned: boolean;
    /** @typedef {import('../macros/index.js').QuotientShorthand} FractionShorthand */
    /**
     * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after substitution
     * @returns {Equation}
     */
    subIn(scope: {
        [x: string]: Expression | string | number | import("../macros/index.js").QuotientShorthand;
    }, options?: {
        verbatim?: boolean | undefined;
    } | undefined): Equation;
    /** @typedef {import('../core/expression/index.js').SimplifyOptions} SimplifyOptions */
    /**
     * simplifies the equation: warning: mutates current equation
     * @param {SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {this}
     * */
    simplify(options?: import("../core/expression/index.js").SimplifyOptions | undefined): this;
    /** @typedef {import('../core/expression/index.js').ExpansionOptions} ExpansionOptions */
    /**
     * @param {ExpansionOptions} [options] - default to automatic simplification
     * @returns {Equation}
     * */
    expand(options?: import("../core/expression/index.js").ExpansionOptions | undefined): Equation;
    factorize: {
        /**
         * factorizes by taking out common factor
         * @param {{targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
         * @returns {Equation}
         * */
        commonFactor: (options?: {
            targetRight?: boolean | undefined;
            verbatim?: boolean | undefined;
        } | undefined) => Equation;
        /**
         * @param {{targetRight?: boolean}} [options] - targets lhs by default
         * @returns {Equation}
         * */
        quadratic: (options?: {
            targetRight?: boolean | undefined;
        } | undefined) => Equation;
        /**
         * @param {'lhs'|'rhs'|{lhs: number[]}|{rhs: number[]}} target - lhs/rhs (quotient) or an array if the target is a sum
         * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
         * @returns {Equation}
         * */
        denominator: (target: 'lhs' | 'rhs' | {
            lhs: number[];
        } | {
            rhs: number[];
        }, method?: "commonFactor" | "quadratic" | undefined) => Equation;
    };
    /**
     * rearrange
     * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
     * @param {{targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
     * @returns {Equation}
     */
    rearrange(order: number[], options?: {
        targetRight?: boolean | undefined;
    } | undefined): Equation;
    /**
     * @returns {Equation} - the equation after combining fractions on both sides
     */
    combineFraction(): Equation;
    /**
     * @returns {Equation}
     */
    _common_denominator(): Equation;
    /**
     * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
     * @returns {Equation}
     */
    _combine_fraction(options?: {
        verbatim?: boolean | undefined;
    } | undefined): Equation;
    /**
     * @returns {Equation}
     */
    _remove_common_factors(): Equation;
    /**
     * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
     * @returns {Equation}
     */
    crossMultiply(options?: {
        verbatim?: boolean | undefined;
    } | undefined): Equation;
    /**
     *
     * @param {number|string|Expression} exp
     * @returns {Equation}
     */
    plus(exp: number | string | Expression): Equation;
    /**
     *
     * @param {number|string|Expression} exp
     * @returns {Equation}
     */
    minus(exp: number | string | Expression): Equation;
    /**
     *
     * @param {number|string|Expression} exp
     * @returns {Equation}
     */
    times(exp: number | string | Expression): Equation;
    /**
     * @returns {Equation}
     */
    swapSides(): Equation;
    /**
     * @return {string}
     */
    toString(): string;
    /** @return {Equation} */
    clone(): Equation;
}
import { Expression } from '../core/expression/index.js';
//# sourceMappingURL=index.d.ts.map