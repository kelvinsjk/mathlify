/** @typedef {{hide?: boolean, string?: boolean}} WorkingOptions */
/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class EquationWorking {
    /**
     * Creates an ExpressionWorking
     * @param {Equation|Expression|number|string} lhs - the initial expression on the left
     * @param {Expression|number|string} [rhs=0] - the initial expression on the right. (ignored if Equation supplied for previous argument)
     * @param {{aligned?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
     */
    constructor(lhs: Equation | Expression | number | string, rhs?: string | number | Expression | undefined, options?: {
        aligned?: boolean | undefined;
    } | undefined);
    /** @type {Equation} the current equation */
    eqn: Equation;
    /** @type {[(Expression|string), (Expression|string)][]} array of the lhs/rhs expressions on each step */
    eqns: [(Expression | string), (Expression | string)][];
    /** @type {boolean}	 */
    aligned: boolean;
    /** @typedef {import('../../../macros/index.js').QuotientShorthand} FractionShorthand */
    /**
     * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {EquationWorking}
     */
    subIn(scope: {
        [x: string]: Expression | string | number | import("../../../macros/index.js").QuotientShorthand;
    }, options?: (WorkingOptions & {
        verbatim?: boolean | undefined;
    }) | undefined): EquationWorking;
    /** @typedef {import('../../../core/expression/index.js').SimplifyOptions} SimplifyOptions */
    /**
     * @param {WorkingOptions & SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {EquationWorking}
     * */
    simplify(options?: (WorkingOptions & import("../../../core/expression/index.js").SimplifyOptions) | undefined): EquationWorking;
    /** @typedef {import('../../../core/expression/index.js').ExpansionOptions} ExpansionOptions */
    /**
     * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
     * @returns {EquationWorking}
     * */
    expand(options?: (WorkingOptions & import("../../../core/expression/index.js").ExpansionOptions) | undefined): EquationWorking;
    factorize: {
        /**
         * factorizes by taking out common factor
         * @param {WorkingOptions & {targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        commonFactor: (options?: (WorkingOptions & {
            targetRight?: boolean | undefined;
            verbatim?: boolean | undefined;
        }) | undefined) => EquationWorking;
        /**
         * @param {WorkingOptions & {targetRight?: boolean}} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        quadratic: (options?: (WorkingOptions & {
            targetRight?: boolean | undefined;
        }) | undefined) => EquationWorking;
    };
    /**
     * rearrange
     * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
     * @param {WorkingOptions & {targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
     * @returns {EquationWorking}
     */
    rearrange(order: number[], options?: (WorkingOptions & {
        targetRight?: boolean | undefined;
    }) | undefined): EquationWorking;
    /**
     * @param {Equation|Expression|string|number} lhs
     * @param {Expression|string|number} [rhs] - defaults to original rhs
     * @return {EquationWorking}
     */
    addCustomStep(lhs: Equation | Expression | string | number, rhs?: string | number | Expression | undefined): EquationWorking;
    /**
     * @return {string}
     */
    toString(): string;
}
export type WorkingOptions = {
    hide?: boolean;
    string?: boolean;
};
import { Equation } from '../../../equation/index.js';
import { Expression } from '../../../core/index.js';
//# sourceMappingURL=index.d.ts.map