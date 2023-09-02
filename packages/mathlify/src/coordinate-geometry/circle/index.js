import { ExpansionTerm } from "../../algebra/index.js";
import { Expression, Polynomial, Term } from "../../core/index.js";
import { Point } from "../point/index.js";
import { SquareRoot } from "../../surds/index.js";
import { numberToFraction } from "../../utils";

/** @typedef {import('../../core/index.js').Fraction} Fraction */

/** Circle
 * @property {Point} center - collection of Polynomials and RationalFns
 * @property {SquareRoot} radius - mathlify expression class kind
 */
export class Circle {
  /** @type {Point} center */
  center;
  /** @type {SquareRoot} */
  radius;
  /**
   * @constructor
   * Creates a Circle instance from center and radius/another point
   * @param {Point} center
   * @param {SquareRoot|number|Fraction|Point} radiusOrPoint
   */
  constructor(center, radiusOrPoint) {
    const radius =
      radiusOrPoint instanceof Point
        ? center.distanceTo(radiusOrPoint)
        : radiusOrPoint instanceof SquareRoot
        ? radiusOrPoint
        : new SquareRoot(1, { coeff: radiusOrPoint });
    this.center = center;
    this.radius = radius;
  }

  /**
   * returns equation of circle in standard (center-radius) form
   * @returns {string}
   */
  toString() {
    const xSquare = new ExpansionTerm([
      new Polynomial([1, this.center.x.negative()]),
      2,
    ]);
    const ySquare = new ExpansionTerm([
      new Polynomial([1, this.center.y.negative()], { variable: "y" }),
      2,
    ]);
    return `${xSquare} + ${ySquare} = ${this.radius.pow(2)}`;
  }

  /**
   * returns (lhs of) equation of circle in general form
   * @returns {Expression}
   */
  toGeneralForm() {
    const xTerm = new Term(this.center.x.times(-2), "x");
    const yTerm = new Term(this.center.y.times(-2), "y");
    const constantTerm = this.center.x
      .square()
      .plus(this.center.y.square())
      .minus(this.radius.square());
    return new Expression(
      new Term(["x", 2]),
      new Term(["y", 2]),
      xTerm,
      yTerm,
      constantTerm
    );
  }

  /**
   *
   * @param {Point} point
   * @returns {Polynomial}
   */
  tangentTo(point) {
    return point.normalTo(this.center);
  }

  /**
   * @param {number|Fraction} xCoeff
   * @param {number|Fraction} yCoeff
   * @param {number|Fraction} constantTerm
   * @returns {Circle}
   */
  static fromGeneralForm(xCoeff, yCoeff, constantTerm) {
    const x = numberToFraction(xCoeff).divide(2).negative();
    const y = numberToFraction(yCoeff).divide(2).negative();
    const center = new Point(x, y);
    const radius = new SquareRoot(
      x.square().plus(y.square()).negative().plus(constantTerm).negative()
    );
    return new Circle(center, radius);
  }
}
