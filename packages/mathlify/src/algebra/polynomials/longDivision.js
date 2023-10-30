//import { RationalFn } from "../../calculus/rationalFn/rationalFn.js";
import { Expression, Fraction, Polynomial } from "../../core/index.js";
import { RationalTerm } from "../term/index.js";

/**
 * solve long division
 * @param {Polynomial} poly - the polynomial to be divided
 * @param {Polynomial} divisor - the divisor
 * @param {Fraction[]} [accumulator=[]] - the accumulator (for recursive calls)
 * @returns {{exp: Expression, quotient: Polynomial, remainder: Polynomial, divisor: Polynomial}} - the long divided form q(x) + r(x)/d(x)
 */
export function longDivide(poly, divisor, accumulator = []) {
  const acc = accumulator === undefined ? [] : accumulator;
  const degree1 = poly.degree;
  const degree2 = divisor.degree;
  if (degree1 < degree2) {
    if (acc.length === 0) {
      return {
        exp: new Expression(new RationalTerm(poly, divisor)),
        quotient: new Polynomial([0]),
        divisor,
        remainder: poly,
      };
    } else {
      const quotient = new Polynomial(acc, { variable: poly.variable });
      if (poly.is.equalTo(0)) {
        return { exp: quotient, quotient, divisor, remainder: poly };
      }
      const exp = new Expression(
        ...quotient.terms,
        new RationalTerm(poly, divisor)
      );
      return { exp, quotient, divisor, remainder: poly };
    }
  }
  const divisorCoeff = poly.leadingCoeff.divide(divisor.leadingCoeff);
  const subtractionCoeff = [
    divisorCoeff,
    ...new Array(degree1 - degree2).fill(0),
  ];
  const subtractionPoly = new Polynomial(subtractionCoeff, {
    variable: poly.variable,
  });
  acc.push(divisorCoeff);
  const quotient = poly.minus(divisor.times(subtractionPoly));
  for (let i = 0; i < poly.degree - quotient.degree - divisor.degree; i++) {
    acc.push(new Fraction(0));
  }
  return longDivide(quotient, divisor, acc);
}
