/** @typedef {'aligned'|'single'|'multi'} LineBreakMode */
/** @typedef {{hide?: boolean, string?: boolean}} WorkingOptions */
/**
 * ExpressionWorking Class to handle the step-by-step working in manipulating an expression
 */
export class ExpressionWorking {
    /**
     * Creates an ExpressionWorking
     * @param {Expression} expression - the initial expression
     * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean}} [options] - lineBreakMode is either 'aligned' (default), 'single' or 'multi'
     */
    constructor(expression: Expression, options?: {
        lineBreakMode?: LineBreakMode | undefined;
        startOnFirstLine?: boolean | undefined;
    } | undefined);
    /** @type {Expression} the current expression*/
    expression: Expression;
    /** @type {(Expression|string)[]} */
    expressions: (Expression | string)[];
    /**
     * @type {LineBreakMode}
     * aligned: x &= y \\ &= z ...
     * single: x = y = z ...
     * multi: x \\ = y \\ = z ...
     */
    lineBreakMode: LineBreakMode;
    /**
     * @type {boolean}
     * Only applicable for aligned lineBreakMode
     * If true: x &= y \\ &= z ...
     * else: & x \\ &= y \\ &= z ...
     * */
    startOnFirstLine: boolean;
    /** @typedef {import('../../../macros/index.js').QuotientShorthand} FractionShorthand */
    /**
     * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     */
    subIn(scope: {
        [x: string]: Expression | string | number | import("../../../macros/index.js").QuotientShorthand;
    }, options?: (WorkingOptions & {
        verbatim?: boolean | undefined;
    }) | undefined): ExpressionWorking;
    /** @typedef {import('../../../core/expression/index.js').SimplifyOptions} SimplifyOptions */
    /**
     * @param {SimplifyOptions & WorkingOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {ExpressionWorking}
     * */
    simplify(options?: (import("../../../core/expression/index.js").SimplifyOptions & WorkingOptions) | undefined): ExpressionWorking;
    /** @typedef {import('../../../core/expression/index.js').ExpansionOptions} ExpansionOptions */
    /**
     * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     * */
    expand(options?: (WorkingOptions & import("../../../core/expression/index.js").ExpansionOptions) | undefined): ExpressionWorking;
    factorize: {
        /**
         * factorizes by taking out common factor
         * @param {WorkingOptions} [options]
         * @returns {ExpressionWorking}
         * */
        commonFactor: (options?: WorkingOptions | undefined) => ExpressionWorking;
        /**
         * @param {WorkingOptions} [options]
         * @returns {ExpressionWorking}
         * */
        quadratic: (options?: WorkingOptions | undefined) => ExpressionWorking;
        /**
         * @param {number[][]} groupedIndices - indices of the groups (eg [[0, 1], [2, 3]] means group first two terms and last two terms)
         * @param {WorkingOptions & {negative?: (number|{group: number, rearrange: number[]})[]}} [options] {negative: [1, {group: 3, rearrange: [1,0]}]} means the 2nd and 4th groups will be factorized with an extra negative. The 4th group will also have a reversed order
         */
        byGrouping: (groupedIndices: number[][], options?: (WorkingOptions & {
            negative?: (number | {
                group: number;
                rearrange: number[];
            })[] | undefined;
        }) | undefined) => ExpressionWorking;
    };
    /**
     * toggle Mixed fractions
     * @param {WorkingOptions} [options] - options to hide this step
     * @returns {ExpressionWorking}
     */
    toggleMixedFractions(options?: WorkingOptions | undefined): ExpressionWorking;
    /**
     * rearrange
     * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
     * @param {WorkingOptions} [options] - options to hide this step
     * @returns {ExpressionWorking}
     */
    rearrange(order: number[], options?: WorkingOptions | undefined): ExpressionWorking;
    /**
     * @param {string|Expression} exp
     * @return {ExpressionWorking}
     */
    addCustomStep(exp: string | Expression): ExpressionWorking;
    /**
     * @param {WorkingOptions & {steps?: boolean}} [options]
     */
    combineFraction(options?: (WorkingOptions & {
        steps?: boolean | undefined;
    }) | undefined): ExpressionWorking;
    /**
     * @return {string}
     */
    toString(): string;
}
export type LineBreakMode = 'aligned' | 'single' | 'multi';
export type WorkingOptions = {
    hide?: boolean;
    string?: boolean;
};
import { Expression } from '../../../core/index.js';
//# sourceMappingURL=index.d.ts.map