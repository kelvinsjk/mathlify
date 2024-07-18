/**
 * Absolute function Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Abs extends Fn {
    /**
     * @returns {Abs}
     */
    clone(): Abs;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Abs}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Abs;
}
export type Expression = import("../../index.js").Expression;
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Fn } from '../../core/expression/fn/custom-function.js';
//# sourceMappingURL=absolute.d.ts.map