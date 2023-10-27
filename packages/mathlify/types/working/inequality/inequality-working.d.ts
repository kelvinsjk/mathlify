/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {Expression} lhs - the left hand side of the equation
 * @property {Expression} rhs - the right hand side of the equation
 * @property {("<"|">"|"\\geq"|"\\leq")[]} signArray - the sign
 * @property {("<"|">"|"\\geq"|"\\leq")} sign
 * @property {(Expression|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @property {(Expression|string)[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @property {boolean} aligned - whether or not the steps are to be aligned
 */
export class InequalityWorking {
    /**
     * constructor
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} lhs - the left hand side of the equation
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [rhs=0] - the right hand side of the equation (defaults to 0)
     * @param {{aligned?: boolean, sign?: '>'|'<'|'leq'|'geq'|'\\leq'|'\\geq'}} [options] - options object defaulting to `{aligned: false, sign: '<'}`
     */
    constructor(lhs: Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[], rhs?: string | number | Fraction | Expression | Term | (string | number | Fraction | Term)[] | undefined, options?: {
        aligned?: boolean | undefined;
        sign?: "<" | ">" | "\\geq" | "\\leq" | "geq" | "leq" | undefined;
    } | undefined);
    /** @type {Expression} */
    lhs: Expression;
    /** @type {Expression} */
    rhs: Expression;
    /** @type {("<"|">"|"\\geq"|"\\leq")} sign */
    sign: ("<" | ">" | "\\geq" | "\\leq");
    /** @type {("<"|">"|"\\geq"|"\\leq")[]} signArray */
    signArray: ("<" | ">" | "\\geq" | "\\leq")[];
    /** @type {(Expression|string)[]} */
    lhsArray: (Expression | string)[];
    /** @type {(Expression|string)[]} */
    rhsArray: (Expression | string)[];
    /** @type {boolean} */
    aligned: boolean;
    /**
     * addition
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be added to both sides
     * @param {{intertext?: string, hide?:boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    plus(x: number | Fraction | string | Term | Expression, options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * subtraction
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be subtracted from both sides
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    minus(x: number | Fraction | string | Term | Expression, options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * multiplication
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be multiplied from both sides
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
     */
    times(x: number | Fraction | string | Term | Expression, options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * negative
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
     */
    negative(options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * division
     * @param {number|Fraction|string|Term} x - the term to be divided from both sides
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     * WARNING: only checks if number/Fractions are negative. for all others, may need to toggle the sign manually
     */
    divide(x: number | Fraction | string | Term, options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * swaps lhs and rhs
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     */
    swap(options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * make rhs 0
     * @param {{intertext?: string, working?: boolean, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    rhsZero(options?: {
        intertext?: string | undefined;
        working?: boolean | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * solves linear inequality
      @param {{intertext?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {Fraction} - the root of the equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    solveLinear(options?: {
        intertext?: string | undefined;
    } | undefined): Fraction;
    /**
     * factorize the lhs
     * @param {{intertext?: string, variable?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {string[]} - the roots of the equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     *
     */
    factorizeQuadratic(options?: {
        intertext?: string | undefined;
        variable?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): string[];
    /**
     * combines rational terms into a single rational term
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    combineRationalTerms(options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * cross multiplication (only if there is a rational term on either/both sides)
     * @param {{intertext?: string, hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: assumes cross multiplication involves positive terms.
     * WARNING: mutates current instance
     */
    crossMultiply(options?: {
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * expand (only if there is lhs/rhs has singleton expression that is an expansion term)
     * @param {{intertext?: string, side?: 'lhs'|'rhs'|'both', hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * defaults to try to expand both
     * the equal sign will be push to the right by the length of the intertext
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    expand(options?: {
        intertext?: string | undefined;
        side?: "both" | "lhs" | "rhs" | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * if lhs and/or rhs are polynomials, switch the ascending/descending behavior
     * @param {boolean} [ascending] - defaults to toggling between states
     * @param {{hide?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {InequalityWorking} - a reference to this equation
     */
    changeAscending(ascending?: boolean | undefined, options?: {
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * clears the arrays, leaving just the final line
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    clear(): InequalityWorking;
    /**
     * sets the aligned state
     * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    setAligned(aligned?: boolean | undefined): InequalityWorking;
    /**
     * move term i from (lhs/rhs) to (rhs/lhs)
     * @param {number} i - the index of the term to be moved (note: 0-indexed)
     * @param {{from?: "lhs"|"rhs", intertext?: string, hide?: boolean}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
     * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    moveTerm(i: number, options?: {
        from?: "lhs" | "rhs" | undefined;
        intertext?: string | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * changes order of terms
     * @param {number[]} args - the index of the terms to be simplified (0-indexed)
     * @param {{intertext?: string, side?: 'lhs'|'rhs'|'both', hide?: boolean}} [options] - options object defaulting to {side: 'lhs'}
     * @returns {InequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    changeOrder(args: number[], options?: {
        intertext?: string | undefined;
        side?: "both" | "lhs" | "rhs" | undefined;
        hide?: boolean | undefined;
    } | undefined): InequalityWorking;
    /**
     * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string | Expression;
}
import { Expression } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
import { Term } from "../../core/index.js";
//# sourceMappingURL=inequality-working.d.ts.map