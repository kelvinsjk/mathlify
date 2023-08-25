/**
 * RationalInequalityWorking representing LHS (sign) RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {RationalTerm} lhs - the left hand side of the equation
 * @property {RationalTerm} rhs - the right hand side of the equation
 * @property {(RationalTerm|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @property {(RationalTerm|string)[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @property {"<"|">"} sign - the sign of the inequality
 * @property {boolean} aligned - whether or not the steps are to be aligned
 */
export class RationalInequalityWorking {
    /**
     * constructor
     * @param {RationalTerm|number|Fraction|string|Term|Expression|[Expression, Expression]} lhs - the left hand side of the inequality
     * @param {RationalTerm|number|Fraction|string|Term|Expression|[Expression, Expression]} [rhs=0] - the right hand side of the inequality (defaults to 0)
     * @param {{aligned?: boolean, sign?: '>'|'<'}} [options] - options object defaulting to `{aligned: false, sign: '<'}`
     */
    constructor(lhs: RationalTerm | number | Fraction | string | Term | Expression | [Expression, Expression], rhs?: string | number | Fraction | Term | Expression | RationalTerm | [Expression, Expression] | undefined, options?: {
        aligned?: boolean | undefined;
        sign?: "<" | ">" | undefined;
    } | undefined);
    /** @type {RationalTerm} */
    lhs: RationalTerm;
    /** @type {RationalTerm} */
    rhs: RationalTerm;
    /** @type {(RationalTerm|Expression|string)[]} */
    lhsArray: (RationalTerm | Expression | string)[];
    /** @type {(RationalTerm|string)[]} */
    rhsArray: (RationalTerm | string)[];
    /** @type {"<"|">"} */
    sign: "<" | ">";
    /** @type {boolean} */
    aligned: boolean;
    /**
     * make rhs 0
     * @param {{intertext?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
     * @returns {RationalInequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    rhsZero(options?: {
        intertext?: string | undefined;
    } | undefined): RationalInequalityWorking;
    /**
     * factorize quadratics in the numerator/denominator
     * @param {{num?: boolean, den?: boolean, intertext?: string}} [options] - options object for factorizing the lhs and/or rhs. defaults to `{num: true, den: true, intertext: undefined}`
     * @returns {RationalInequalityWorking} - a reference to this equation
     * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
     */
    factorize(options?: {
        num?: boolean | undefined;
        den?: boolean | undefined;
        intertext?: string | undefined;
    } | undefined): RationalInequalityWorking;
    /**
     * sets the aligned state
     * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
     * @returns {RationalInequalityWorking} - a reference to this equation
     * WARNING: mutates current instance
     */
    setAligned(aligned?: boolean | undefined): RationalInequalityWorking;
    /**
     * solves the inequality
     * @returns {string[]}
     */
    solve(): string[];
    /**
     * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string | Expression | RationalTerm;
}
import { RationalTerm } from "../../algebra/term/index.js";
import { Expression } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
import { Term } from "../../core/index.js";
//# sourceMappingURL=rationalInequalityWorking.d.ts.map