/** @typedef {import('../../core/index.js').Fraction} Fraction */
/** Circle
 * @property {Point} center - collection of Polynomials and RationalFns
 * @property {SquareRoot} radius - mathlify expression class kind
 */
export class Circle {
    /**
     * @param {number|Fraction} xCoeff
     * @param {number|Fraction} yCoeff
     * @param {number|Fraction} constantTerm
     * @returns {Circle}
     */
    static fromGeneralForm(xCoeff: number | Fraction, yCoeff: number | Fraction, constantTerm: number | Fraction): Circle;
    /**
     * @constructor
     * Creates a Circle instance from center and radius/another point
     * @param {Point} center
     * @param {SquareRoot|number|Fraction|Point} radiusOrPoint
     */
    constructor(center: Point, radiusOrPoint: SquareRoot | number | Fraction | Point);
    /** @type {Point} center */
    center: Point;
    /** @type {SquareRoot} */
    radius: SquareRoot;
    /**
     * returns equation of circle in standard (center-radius) form
     * @returns {string}
     */
    toString(): string;
    /**
     * returns (lhs of) equation of circle in general form
     * @returns {Expression}
     */
    toGeneralForm(): Expression;
}
export type Fraction = import('../../core/index.js').Fraction;
import { Point } from "../point/index.js";
import { SquareRoot } from "../../surds/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=index.d.ts.map