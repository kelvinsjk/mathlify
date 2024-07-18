/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../expression.js').Shorthand} Shorthand */
/** @typedef {import('../expression.js').Variable} Variable */
/**
 * The `Fn` class is the base class for building custom functions. By default this behaves
 * as an identity function, but can be extended to create custom functions.
 * Important methods that should be modified if we desire non-identity behavior:
 * - `toString`
 * - `_to_lexical_string`
 * - `contains`
 * - `simplify`
 * - `clone`
 * - `subIn`
 * @property {Expression} argument
 */
export class Fn {
    /**
     * @constructor
     * Creates a Fn
     * @param {Shorthand} argument
     */
    constructor(argument: Shorthand);
    /** @type {'fn'} */
    type: "fn";
    /** @type {string} */
    functionType: string;
    /** @type {Expression} */
    argument: Expression;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * Returns a custom string representation of the expression, using the provided function.
     * If the function returns undefined, the default toString will be used
     * @param {(exp:Expression)=>string|undefined} toStringFn
     * @returns {string}
     */
    toCustomString(toStringFn: (exp: Expression) => string | undefined): string;
    /**
     * @returns {string}
     */
    _to_lexical_string(): string;
    /**
     *
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * @param {SimplifyOptions} [_options]
     * @returns {ExpressionNode}
     */
    simplify(_options?: import("../expression.js").SimplifyOptions | undefined): ExpressionNode;
    /**
     * @returns {Fn}
     */
    clone(): Fn;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {ExpressionNode}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): ExpressionNode;
    /**
     * @param {number} x
     * @param {string|Variable} [variable]
     * @returns {number}
     */
    fn: (x: number, variable?: string | import("../expression.js").Variable | undefined) => number;
    is: {
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /**
     * @returns {number}
     */
    valueOf(): number;
}
export type Expression = import("../expression.js").Expression;
export type ExpressionNode = import("../expression.js").ExpressionNode;
export type SimplifyOptions = import("../expression.js").SimplifyOptions;
export type Shorthand = import("../expression.js").Shorthand;
export type Variable = import("../expression.js").Variable;
//# sourceMappingURL=custom-function.d.ts.map