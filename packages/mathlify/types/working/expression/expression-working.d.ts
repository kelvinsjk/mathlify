/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {UnsimplifiedExpression|Expression} exp - the left hand side of the equation
 * @property {(UnsimplifiedExpression|Expression|string)[]} expArray - a collection of lhs expressions from the first step to the last
 * @property {boolean} aligned - whether or not the steps are to be aligned
 * @property {boolean} equalStart - whether to start with an equal sign
 */
export class ExpressionWorking {
    /**
     * constructor
     * @param {UnsimplifiedExpression|Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp - the left hand side of the equation
     * @param {{aligned?: boolean, equalStart?: boolean}} [options] - options object defaulting to `{aligned: true, equalStart: false}`
     */
    constructor(exp: UnsimplifiedExpression | Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[], options?: {
        aligned?: boolean | undefined;
        equalStart?: boolean | undefined;
    } | undefined);
    /** @type {UnsimplifiedExpression|Expression} */
    exp: UnsimplifiedExpression | Expression;
    /** @type {(UnsimplifiedExpression|Expression|string)[]} */
    expArray: (UnsimplifiedExpression | Expression | string)[];
    /** @type {boolean} */
    aligned: boolean;
    /** @type {boolean} */
    equalStart: boolean;
    /**
     * sub in
     * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
     * @param {{intertext?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {ExpressionWorking} - reference to this ExpressionWorking
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    subIn(x: {
        [key: string]: number | Fraction;
    }, options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * factorize
     * @param {{intertext?: string, variable?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * variable defaults to 'x'
     * @returns {ExpressionWorking} - reference to this ExpressionWorking
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     *
     */
    factorizeQuadratic(options?: {
        intertext?: string | undefined;
        variable?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * expands expansionTerm
     * @param {{intertext?: string}} [options]
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    expand(options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * rationalize surds
     * TODO: for singleton denominator
     * @param {{intertext?: string}} [options]
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    rationalize(options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * combines rational terms into a single rational term
     * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    /**
     * sets the aligned state
     * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    setAligned(aligned?: boolean | undefined): ExpressionWorking;
    /**
     * simplify terms specified (while leaving the rest untouched)
     * @param {number[]} args - the index of the terms to be simplified (0-indexed)
     * @param {{intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
     * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    simplifyTerms(args: number[], options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * simplify all terms, leaving an Expression term
     * @param {{intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
     * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    simplify(options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * changes order of terms
     * @param {number[]} args - the index of the terms to be simplified (0-indexed)
     * @param {{intertext?: string}} [options] - options object
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    changeOrder(args: number[], options?: {
        intertext?: string | undefined;
    } | undefined): ExpressionWorking;
    /**
     * @param {{intertext?: string, variable?: string}} [options] - options object defaulting to `{side: "lhs"}`. intertext for inserting text between steps.
     */
    castToPoly(options?: {
        intertext?: string | undefined;
        variable?: string | undefined;
    } | undefined): void;
    /**
     * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string | Expression | UnsimplifiedExpression;
    /**
     * clears the arrays, leaving just the final line
     * @returns {ExpressionWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    clear(): ExpressionWorking;
}
import { UnsimplifiedExpression } from "../../algebra/index.js";
import { Expression } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
import { Term } from "../../core/index.js";
//# sourceMappingURL=expression-working.d.ts.map