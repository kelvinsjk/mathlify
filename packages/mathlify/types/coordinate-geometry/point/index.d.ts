/** @typedef {import('../../core/index.js').Fraction} Fraction */
/**
 * @class Point
 * @property {Fraction} x
 * @property {Fraction} y
 * @property {string|undefined} name
 */
export class Point {
    /**
     * @constructor
     * Creates a Rational Fn instance
     * @param {number|Fraction} x
     * @param {number|Fraction} y
     * @param {{name?: string}} [options]
     */
    constructor(x: number | Fraction, y: number | Fraction, options?: {
        name?: string | undefined;
    } | undefined);
    /** @type {Fraction} */
    x: Fraction;
    /** @type {Fraction} */
    y: Fraction;
    /** @type {string|undefined} */
    name: string | undefined;
    /**
     * distance to another point
     * @param {Point} point
     * @returns {SquareRoot}
     */
    distanceTo(point: Point): SquareRoot;
    /**
     * gradient
     * @param {Point} point2
     * @return {Fraction}
     */
    gradient(point2: Point): Fraction;
    /**
     * gradientNormal
     * @param {Point} point2
     * @return {Fraction}
     */
    gradientNormal(point2: Point): Fraction;
    /**
     * mid point
     * @param {Point} point2
     * @return {Point}
     */
    midPoint(point2: Point): Point;
    /**
     * line to another point
     * @param {Point} point2
     * @returns {Polynomial}
     */
    lineTo(point2: Point): Polynomial;
    /**
     * line normal to another point
     * @param {Point} point2
     * @returns {Polynomial}
     */
    normalTo(point2: Point): Polynomial;
    /**
     * line with gradient provided
     * @param {Fraction} gradient
     * @returns {Polynomial}
     */
    lineWithGradient(gradient: Fraction): Polynomial;
    /**
     * line with normal gradient provided
     * @param {Fraction} gradient
     * @returns {Polynomial}
     */
    lineWithNormalGradient(gradient: Fraction): Polynomial;
    /**
     * @returns {string}
     */
    toString(): string;
}
export type Fraction = import('../../core/index.js').Fraction;
import { SquareRoot } from "../../surds/index.js";
import { Polynomial } from "../../core/index.js";
//# sourceMappingURL=index.d.ts.map