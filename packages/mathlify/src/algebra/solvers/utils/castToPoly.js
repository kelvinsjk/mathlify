import { Polynomial } from "../../../core/algebra/polynomial/polynomial.js";
import { Expression } from "../../../core/algebra/expression/expression.js";
import { castExpression } from "../../expression/cast/cast-expression.js";

/**
 * @typedef {import('../../../core/fraction.js').Fraction} Fraction
 */

/**
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial
 * @returns {Polynomial} - the polynomial
 */
export function castToPoly(poly) {
  return poly instanceof Polynomial
    ? poly
    : poly instanceof Expression
    ? castExpression.toPolynomial(poly)
    : new Polynomial([poly]);
}
