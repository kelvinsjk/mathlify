import { Polynomial } from "../../core/index.js";
import { SquareRoot } from "../../surds/index.js";
import { numberToFraction } from "../../utils/index.js";

/** @typedef {import('../../core/index.js').Fraction} Fraction */

/**
 * @class Point
 * @property {Fraction} x
 * @property {Fraction} y
 * @property {string|undefined} name
 */
export class Point {
  /** @type {Fraction} */
  x;
  /** @type {Fraction} */
  y;
  /** @type {string|undefined} */
  name;
  /**
   * @constructor
   * Creates a Rational Fn instance
   * @param {number|Fraction} x
   * @param {number|Fraction} y
   * @param {{name?: string}} [options]
   */
  constructor(x, y, options) {
    this.x = numberToFraction(x);
    this.y = numberToFraction(y);
    this.name = options?.name;
  }

  /**
   * distance to another point
   * @param {Point} point
   * @returns {SquareRoot}
   */
  distanceTo(point) {
    const xDiff = this.x.minus(point.x);
    const yDiff = this.y.minus(point.y);
    return new SquareRoot(xDiff.pow(2).plus(yDiff.pow(2)));
  }

  /**
   * gradient
   * @param {Point} point2
   * @return {Fraction}
   */
  gradient(point2) {
    return point2.y.minus(this.y).divide(point2.x.minus(this.x));
  }

  /**
   * gradientNormal
   * @param {Point} point2
   * @return {Fraction}
   */
  gradientNormal(point2) {
    return this.gradient(point2).negative().reciprocal();
  }

  /**
   * mid point
   * @param {Point} point2
   * @return {Point}
   */
  midPoint(point2) {
    const x = this.x.plus(point2.x).divide(2);
    const y = this.y.plus(point2.y).divide(2);
    return new Point(x, y);
  }

  /**
   * line to another point
   * @param {Point} point2
   * @returns {Polynomial}
   */
  lineTo(point2) {
    const gradient = this.gradient(point2);
    const yIntercept = this.y.minus(gradient.times(this.x));
    return new Polynomial([gradient, yIntercept]);
  }

  /**
   * line normal to another point
   * @param {Point} point2
   * @returns {Polynomial}
   */
  normalTo(point2) {
    const gradient = this.gradientNormal(point2);
    const yIntercept = this.y.minus(gradient.times(this.x));
    return new Polynomial([gradient, yIntercept]);
  }

  /**
   * line with gradient provided
   * @param {Fraction} gradient
   * @returns {Polynomial}
   */
  lineWithGradient(gradient) {
    const yIntercept = this.y.minus(gradient.times(this.x));
    return new Polynomial([gradient, yIntercept]);
  }

  /**
   * line with normal gradient provided
   * @param {Fraction} gradient
   * @returns {Polynomial}
   */
  lineWithNormalGradient(gradient) {
    gradient = gradient.negative().reciprocal();
    return this.lineWithGradient(gradient);
  }

  /**
   * @returns {string}
   */
  toString() {
    const name = this.name ? `${this.name} ` : "";
    return `${name}\\left( ${this.x}, ${this.y} \\right)`;
  }
}
