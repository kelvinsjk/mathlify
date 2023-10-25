//import { RationalFn } from "../../calculus/rationalFn/rationalFn.js";
import { Expression, Fraction, Polynomial } from "../../core/index.js";

/**
 * solve long division
 * @param {Polynomial} poly - the polynomial to be divided
 * @param {Polynomial} divisor - the divisor
 * @param {Fraction[]} [accumulator=[]] - the accumulator (for recursive calls)
 * @returns {Expression} - the long divided form q(x) + r(x)/d(x)
 */
export function longDivision(poly, divisor, accumulator = []) {
  //const degree1 = poly.degree;
  //const degree2 = divisor.degree;
  //TODO
  return poly.plus(divisor).times(accumulator[0]);
  // if (degree1 < degree2) {
  //   if (accumulator.length === 0) {
  //     return new Expression(new RationalFn(poly, divisor));
  //   } else {
  //     if (poly.isZero()) {
  //       return new Polynomial(accumulator, { variable: poly.variable });
  //     }
  //     return new Expression(
  //       ...new Polynomial(accumulator, { variable: poly.variable }).terms,
  //       new RationalFn(poly, divisor)
  //     );
  //   }
  // }
  // const divisorCoeff = poly
  //   .leadingCoefficient()
  //   .divide(divisor.leadingCoefficient());
  // const subtractionCoeff = [
  //   divisorCoeff,
  //   ...new Array(degree1 - degree2).fill(0),
  // ];
  // const subtractionPoly = new Polynomial(subtractionCoeff, {
  //   variable: poly.variable,
  // });
  // accumulator.push(divisorCoeff);
  // const quotient = poly.minus(divisor.times(subtractionPoly));
  // for (let i = 0; i < poly.degree - quotient.degree - divisor.degree; i++) {
  //   accumulator.push(new Fraction(0));
  // }
  // return longDivision(quotient, divisor, accumulator);
}
