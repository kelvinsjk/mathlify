/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @param {Expression} lhs - the left hand side of the equation
 * @param {Expression} rhs - the right hand side of the equation
 * @param {(Expression|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @param {Expression[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @param {boolean} aligned - whether or not the steps are to be aligned
 */
export class GeneralEquation {
    /**
     * constructor
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} lhs - the left hand side of the equation
     * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [rhs=0] - the right hand side of the equation (defaults to 0)
     * @param {{aligned: boolean}} [options] - options object defaulting to `{aligned: false}`
     */
    constructor(lhs: Expression | number | Fraction | string | Term | (number | Fraction | string | Term)[], rhs?: string | number | Fraction | Term | Expression | (string | number | Fraction | Term)[] | undefined, options?: {
        aligned: boolean;
    } | undefined);
    /** @type {Expression} */
    lhs: Expression;
    /** @type {Expression} */
    rhs: Expression;
    /** @type {(Expression|string)[]} */
    lhsArray: (Expression | string)[];
    /** @type {(Expression|string)[]} */
    rhsArray: (Expression | string)[];
    /** @type {boolean} */
    aligned: boolean;
    /**
     * addition
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be added to both sides
     * @param {{intertext: string}} [options] - options object for inserting text between steps
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    plus(x: number | Fraction | string | Term | Expression, options?: {
        intertext: string;
    } | undefined): GeneralEquation;
    /**
     * subtraction
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be subtracted from both sides
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    minus(x: number | Fraction | string | Term | Expression): GeneralEquation;
    /**
     * multiplication
     * @param {number|Fraction|string|Term|Expression} x - the term/expression to be multiplied from both sides
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    times(x: number | Fraction | string | Term | Expression): GeneralEquation;
    /**
     * negative
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    negative(): GeneralEquation;
    /**
     * division
     * @param {number|Fraction|string|Term} x - the term to be divided from both sides
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    divide(x: number | Fraction | string | Term): GeneralEquation;
    /**
     * swaps lhs and rhs
     * @returns {GeneralEquation} - a reference to this equation
     */
    swap(): GeneralEquation;
    /**
     * combines rational terms into a single rational term
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    combineRationalTerms(): GeneralEquation;
    /**
     * cross multiplication (only if there is a rational term on either/both sides)
     * @returns {GeneralEquation} - a reference to this equation
     */
    crossMultiply(): GeneralEquation;
    /**
     * sets the aligned state
     * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates current instance
     */
    setAligned(aligned?: boolean | undefined): GeneralEquation;
    /**
     * move term i from (lhs/rhs) to (rhs/lhs)
     * @param {number} i - the index of the term to be moved (note: 0-indexed)
     * @param {{from: "lhs"|"rhs"}} [options] - options object defaulting to `{from: "lhs"}`
     * @returns {GeneralEquation} - a reference to this equation
     * WARNING: mutates current instance
     */
    moveTerm(i: number, options?: {
        from: "lhs" | "rhs";
    } | undefined): GeneralEquation;
    /**
     * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string | Expression;
}
import { Expression } from "../../../core/index.js";
import { Fraction } from "../../../core/index.js";
import { Term } from "../../../core/index.js";
//# sourceMappingURL=general-equation.d.ts.map