/** @typedef {'aligned'|'single'|'multi'} LineBreakMode */
/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').QuotientShorthand} FractionShorthand */
/** @typedef {import('../../core/expression/index.js').SimplifyOptions} SimplifyOptions */
/** @typedef {{hide?: boolean, string?: boolean}} ExpressionWorkingOptions */
/**
 * ExpressionWorking Class to handle the step-by-step working in manipulating an expression
 */
export class ExpressionWorking {
    /**
     * Creates an ExpressionWorking
     * @param {Expression} expression - the initial expression
     * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean}} [options] - defaults to `{lineBreakMode: 'aligned', startOnFirstLine: false}`
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
     * Only applicable for aligned and multi lineBreakMode
     * If true: x = y \\ = z ...
     * else: x \\ = y \\ = z ...
     * */
    startOnFirstLine: boolean;
    /**
     * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {{verbatim?: boolean, hide?: boolean}} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     */
    subIn(scope: {
        [x: string]: Expression | string | number | import("../../macros/index.js").QuotientShorthand;
    }, options?: {
        verbatim?: boolean | undefined;
        hide?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * @typedef {SimplifyOptions & {hide?: boolean}} WorkingSimplifyOptions
     * */
    /**
     * @param {WorkingSimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {ExpressionWorking}
     * */
    simplify(options?: (import("../../core/expression/index.js").SimplifyOptions & {
        hide?: boolean | undefined;
    }) | undefined): ExpressionWorking;
    /**
     * @param {{verbatim?: boolean, numerator?: boolean, hide?: boolean}} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     * */
    expand(options?: {
        verbatim?: boolean | undefined;
        numerator?: boolean | undefined;
        hide?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * @param {{hide?: boolean}} [options]
     * @returns {ExpressionWorking}
     * */
    factorize(options?: {
        hide?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * toggle Mixed fractions
     * @param {{hide?: boolean}} [options] - options to hide this step
     * @returns {ExpressionWorking}
     */
    toggleMixedFractions(options?: {
        hide?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * rearrange
     * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
     * @param {{hide?: boolean}} [options] - options to hide this step
     * @returns {ExpressionWorking}
     */
    rearrange(order: number[], options?: {
        hide?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * @param {string} exp
     * @return {this}
     */
    addCustomStep(exp: string): this;
    /**
     * @param {{hide?: boolean, working?: boolean}} [options]
     */
    combineFraction(options?: {
        hide?: boolean | undefined;
        working?: boolean | undefined;
    } | undefined): ExpressionWorking;
    /**
     * @return {string}
     */
    toString(): string;
}
export type LineBreakMode = 'aligned' | 'single' | 'multi';
export type BracketShorthand = import('../../macros/index.js').BracketShorthand;
export type FractionShorthand = import('../../macros/index.js').QuotientShorthand;
export type SimplifyOptions = import('../../core/expression/index.js').SimplifyOptions;
export type ExpressionWorkingOptions = {
    hide?: boolean;
    string?: boolean;
};
import { Expression } from '../../core/index.js';
//# sourceMappingURL=index.d.ts.map