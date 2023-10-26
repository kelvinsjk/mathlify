import { Expression, Polynomial, numberToFraction } from "../../core/index.js";
import { SquareRoot } from "../../surds/square-roots.js";
import { castToPoly } from "../utils/castToPoly.js";
import { ExpressionProduct } from "../term/index.js";

/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */

/**
 * solve quadratic polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {[Fraction, Fraction]} - the solution [x1, x2], where x1 \\leq x2
 * WARNING: only works for rational roots. use solveQuadraticSurd or solveQuadraticComplex for other cases
 */
export function solveQuadratic(poly, rhs = 0, options) {
  const lhsPoly = castToPoly(poly, options);
  const rhsPoly = castToPoly(rhs, options);
  const newPoly = lhsPoly.minus(rhsPoly);
  if (newPoly.degree !== 2) {
    throw new Error(
      `${poly} = ${rhs} does not simplify to a quadratic polynomial`
    );
  }
  const [_, b, a] = newPoly.coeffs;
  const d = discriminant(newPoly);
  if (d.is.negative()) {
    throw new Error(
      `Complex roots detected for ${poly}. Consider using the solveQuadraticComplex solver instead`
    );
  }
  const root = new SquareRoot(d);
  if (root.is.not.rational()) {
    throw new Error(
      `Irrational roots detected for ${poly}. Consider using the solveQuadraticSurd or solveQuadratic solvers instead`
    );
  }
  const rootFrac = root.cast.toFraction();
  const x1 = b.negative().minus(rootFrac).divide(a.times(2));
  const x2 = b.negative().plus(rootFrac).divide(a.times(2));
  return x1.is.lessThan(x2) ? [x1, x2] : [x2, x1];
}

/**
 * solve quadratic polynomial/equations
 * @param {Polynomial|Expression|[(number|Fraction), (number|Fraction), (number|Fraction)]} poly - the polynomial to be solved/left hand side of the equation
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {[number, number]} - the solution [x1, x2], where x1 \\leq x2
 */
export function solveQuadraticNumerical(poly, options) {
  /** @type {(number|Fraction)[]} */
  let coeffs;
  if (poly instanceof Polynomial) {
    coeffs = [...poly.coeffs].reverse();
    if (poly.degree !== 2) {
      throw new Error(`${poly} does not simplify to a quadratic polynomial`);
    }
  } else if (poly instanceof Expression) {
    const newPoly = castToPoly(poly, options);
    if (newPoly.degree !== 2) {
      throw new Error(`${poly} does not simplify to a quadratic polynomial`);
    }
    coeffs = [...newPoly.coeffs].reverse();
  } else {
    coeffs = poly;
  }
  let [a, b, c] = coeffs.map((x) => numberToFraction(x));
  if (a.is.negative()) {
    a = a.negative();
    b = b.negative();
    c = c.negative();
  }
  const d = b.square().minus(a.times(c).times(4));
  if (d.is.negative()) {
    throw new Error(
      `Complex roots detected for ${poly}. Consider using the solveQuadraticComplex solver instead`
    );
  }
  const root1 =
    (b.negative().valueOf() - Math.sqrt(d.valueOf())) / a.times(2).valueOf();
  const root2 =
    (b.negative().valueOf() + Math.sqrt(d.valueOf())) / a.times(2).valueOf();
  return [root1, root2];
}

/**
 * factorize quadratic
 * @param {Polynomial|Expression} poly
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {ExpressionProduct} - the factorized form
 */
export function factorizeQuadratic(poly, options) {
  const newPoly = castToPoly(poly, options);
  if (newPoly.degree !== 2) {
    throw new Error(`${poly} is not a quadratic polynomial`);
  }
  try {
    const [x1, x2] = solveQuadratic(newPoly, 0, options);
    // (a1 x - b1)(a2 x - b2)
    const a1 = x1.den;
    const b1 = x1.negative().num;
    const a2 = x2.den;
    const b2 = x2.negative().num;
    const expansionCoeff = a1 * a2;
    const multiple = newPoly.coeffs[2].divide(expansionCoeff);
    if (multiple.is.negative()) {
      if (b1 < 0) {
        return new ExpressionProduct(
          multiple.abs(),
          new Polynomial([b1 * -1, a1 * -1], {
            variable: newPoly.variable,
            ascending: true,
          }),
          new Polynomial([a2, b2], { variable: newPoly.variable })
        );
      } else if (b2 < 0) {
        return new ExpressionProduct(
          multiple.abs(),
          new Polynomial([a1, b1], { variable: newPoly.variable }),
          new Polynomial([b2 * -1, a2 * -1], {
            variable: newPoly.variable,
            ascending: true,
          })
        );
      }
    }
    return new ExpressionProduct(
      multiple,
      new Polynomial([a1, b1], { variable: newPoly.variable }),
      new Polynomial([a2, b2], { variable: newPoly.variable })
    );
  } catch (e) {
    throw new Error(
      `Unable to factorize ${poly}. No rational roots detected ${e}`
    );
  }
}

/**
 * solve quadratic polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {[Expression, Expression]} - the solution [x1, x2], where x1 \\leq x2
 */
export function solveQuadraticSurd(poly, rhs = 0) {
  const lhsPoly = castToPoly(poly);
  const rhsPoly = castToPoly(rhs);
  const newPoly = lhsPoly.minus(rhsPoly);
  if (newPoly.degree !== 2) {
    throw new Error(
      `${poly} = ${rhs} does not simplify to a quadratic polynomial`
    );
  }
  const [_, b, a] = newPoly.coeffs;
  const d = discriminant(newPoly);
  if (d.is.negative()) {
    throw new Error(
      `Complex roots detected for ${poly}. Consider using the solveQuadraticComplex solver instead`
    );
  }
  const root = new SquareRoot(d);
  if (root.is.rational()) {
    throw new Error(
      `Rational roots found for ${poly}. Consider using the solveQuadraticRational or solveQuadratic solvers instead`
    );
  }
  const term1 = b.negative().divide(a.times(2));
  const surdTerm = root.divide(a.abs().times(2));
  return [
    new Expression(term1, surdTerm.negative()),
    new Expression(term1, surdTerm),
  ];
}

/**
 * discriminant of a quadratic polynomial
 * @param {Polynomial|[number|Fraction, number|Fraction, number|Fraction]} poly - the polynomial (or array of coefficients ax^2 + bx + c)
 * @returns {Fraction} - the discriminant
 */
export function discriminant(poly) {
  const [a, b, c] =
    poly instanceof Polynomial
      ? [...poly.coeffs].reverse()
      : poly.map((x) => numberToFraction(x));
  return b.square().minus(a.times(c).times(4));
}
