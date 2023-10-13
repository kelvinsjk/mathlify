import { Polynomial, Expression } from "../../core/index.js";

/**
 * @typedef {import('../../core/index.js').Fraction} Fraction
 */

/**
 * @param {Polynomial|number|Fraction|Expression} poly the polynomial in Expression/number/Fraction form
 * @param {{variable?: string, ascending?: boolean}} [options] options for the polynomial
 * @returns {Polynomial} the polynomial
 */
export function castToPoly(poly, options) {
  return poly instanceof Polynomial
    ? poly
    : poly instanceof Expression
    ? expressionToPolynomial(poly, options)
    : new Polynomial([poly], options);
}

/**
 * cast an Expression to Polynomial type with single variable x
 * @param {Expression} exp - the expression to be casted
 * @param {{ascending?: boolean, variable?: string}} [options] - options for the polynomial (default: {ascending: false, variable: 'x'})
 * @returns {Polynomial} the polynomial representation of this term
 */
function expressionToPolynomial(exp, options) {
  const variables = exp.variables;
  /** @type {string} */
  let variable;
  if (variables.length === 0) {
    variable = options?.variable ?? "x";
  } else if (variables.length === 1) {
    if (options?.variable && options?.variable !== variables[0]) {
      throw new Error(
        `Incompatible variables: ${options?.variable} provided in options but ${variables[0]} detected.`
      );
    }
    variable = variables[0];
  } else {
    throw new Error(
      `More than 1 variable detected: ${variables} in ${exp.toTex()}`
    );
  }
  const x = variable;
  /** @type {(number|Fraction)[]} */
  const coeffs = [];
  exp.terms.forEach((term) => {
    if (term.powerMap.size === 0) {
      coeffs[0] = term.coeff;
    } else if (term.powerMap.size === 1) {
      const power = term.powerMap.get(x);
      if (power) {
        if (power.is.integer() && power.is.positive()) {
          coeffs[power.valueOf()] = term.coeff;
        } else {
          throw new Error(
            `cannot cast ${exp.toTex()} to Polynomial: non-positive integer power ${power.toTex()} detected`
          );
        }
      }
    }
    // theoretically impossible because of variable check above
    // else {
    //   throw new Error(
    //     `cannot cast ${exp.toTex()} to Polynomial: more than 1 variable detected`
    //   );
    // }
  });
  const ascending = options?.ascending ?? false;
  for (let i = 0; i < coeffs.length; i++) {
    if (coeffs[i] === undefined) {
      coeffs[i] = 0;
    }
  }
  if (!ascending) {
    coeffs.reverse();
  }
  const newPoly = new Polynomial(coeffs, { ascending, variable });
  return newPoly;
}
