import {
  ExpansionTerm,
  RationalTerm,
  castToPoly,
  discriminant,
  factorizeQuadratic,
  longDivision,
  solveLinear,
  solveQuadratic,
} from "../../algebra/index.js";
import { RationalFn } from "../../calculus/rationalFn/rationalFn.js";
import { Expression, Fraction, Polynomial } from "../../core/index.js";

/**
 * partial fractions
 * @param {RationalFn} rational
 * @param {Polynomial} [denFactor] - for cubic denominators, we require a known linear factor to proceed
 * @returns {{working: string, result: Expression}}
 * WARNING: assumes that denominator has integral coefficients and has gcd==1.
 */
export function partialFraction(rational, denFactor) {
  if (rational.denFn.degree === 2) {
    // two unique linear factors
    const [root1, root2] = solveQuadratic(rational.denFn);
    const factorizedDenom = factorizeQuadratic(rational.denFn);
    const [d1, d2] = Array.from(factorizedDenom.expPowerMap.keys());
    const A = rational.numFn.subIn(root1).divide(d2.subIn(root1));
    const B = rational.numFn.subIn(root2).divide(d1.subIn(root2));
    let str = `\\frac{${rational.numFn}}{${factorizedDenom}} = \\frac{A}{${d1}} + \\frac{B}{${d2}}`;
    str += `\\\\ A\\left(${d2}\\right) + B\\left(${d1}\\right) = ${rational.numFn}`;
    str += `\\\\ \\textrm{Substituting } x = ${root1},`;
    str += `\\\\ A = ${A}`;
    str += `\\\\ \\textrm{Substituting } x = ${root2},`;
    str += `\\\\ B = ${B}`;
    return {
      working: str,
      result: new Expression(
        new RationalFn(A, castToPoly(d1)),
        new RationalFn(B, castToPoly(d2))
      ),
    };
  }
  if (rational.denFn.degree === 3 && denFactor) {
    const longDividedExp = longDivision(rational.denFn, denFactor);
    try {
      const quadratic = castToPoly(longDividedExp);
      const d = discriminant(quadratic);
      if (d.is.negative()) {
        // linear factor and non-reducible quadratic factor
        const factorizedDenom = new ExpansionTerm(denFactor, quadratic);
        const root = solveLinear(denFactor);
        const A = rational.numFn.subIn(root).divide(quadratic.subIn(root));
        const x2Coeff = rational.numFn.coeffs[2] ?? new Fraction(0);
        const x1Coeff = rational.numFn.coeffs[1] ?? new Fraction(0);
        const x0Coeff = rational.numFn.coeffs[0] ?? new Fraction(0);
        const [d0, d1] = denFactor.coeffs;
        const [q0, q1, q2] = quadratic.coeffs;
        let str = `\\frac{${rational.numFn}}{${factorizedDenom}} = \\frac{A}{${denFactor}} + \\frac{Bx+C}{${quadratic}}`;
        str += `\\\\ A \\left(${quadratic}\\right) + \\left( Bx + C \\right) \\left(${denFactor}\\right) = ${rational.numFn}`;
        str += `\\\\ \\textrm{Substituting } x = ${root},`;
        str += `\\\\ A = ${A}`;
        str += `\\\\ \\textrm{Comparing coefficients of } x^2,`;
        const abExp = new Expression([q2, "A"], [d1, "B"]);
        const B = x2Coeff.minus(q2.times(A)).divide(d1);
        str += `\\\\ ${abExp} = ${x2Coeff}`;
        str += `\\\\ B = ${B}`;
        /** @type {Fraction} */
        let C;
        if (d0.is.zero()) {
          str += `\\\\ \\textrm{Comparing coefficients of } x,`;
          const acExp = new Expression([q1, "A"], [d0, "B"], [d1, "C"]);
          C = x0Coeff.minus(q1.times(A)).minus(d0.times(B)).divide(d1);
          str += `\\\\ ${acExp} = ${x1Coeff}`;
          str += `\\\\ C = ${C}`;
        } else {
          str += `\\\\ \\textrm{Comparing constants,}`;
          const acExp = new Expression([q0, "A"], [d0, "C"]);
          C = x0Coeff.minus(q0.times(A)).divide(d0);
          str += `\\\\ ${acExp} = ${x0Coeff}`;
          str += `\\\\ C = ${C}`;
        }
        return {
          working: str,
          result: new Expression(
            new RationalFn(A, denFactor),
            new RationalFn(
              new Polynomial([B, C], { variable: rational.numFn.variable }),
              quadratic
            )
          ),
        };
      } else {
        let root1 = solveLinear(denFactor);
        let [root2, root3] = solveQuadratic(quadratic);
        [root1, root2, root3] = [root1, root2, root3].sort((a, b) =>
          a.minus(b).valueOf()
        );
        if (root1.is.equalTo(root2) || root2.is.equalTo(root3)) {
          if (root1.is.equalTo(root3)) {
            throw new Error(
              `partial fractions not supported for three repeated roots`
            );
          }
          // repeated linear factor
          const repeatedRoot = root1.is.equalTo(root2) ? root1 : root2;
          const uniqueRoot = root1.is.equalTo(root2) ? root3 : root1;
          const repeatedFactor = new Polynomial([
            repeatedRoot.den,
            -repeatedRoot.num,
          ]);
          const uniqueFactor = new Polynomial([
            uniqueRoot.den,
            -uniqueRoot.num,
          ]);
          const factorizedDenom = new ExpansionTerm(uniqueFactor, [
            repeatedFactor,
            2,
          ]);
          const A = rational.numFn
            .subIn(uniqueRoot)
            .divide(repeatedFactor.subIn(uniqueRoot).square());
          const C = rational.numFn
            .subIn(repeatedRoot)
            .divide(uniqueFactor.subIn(repeatedRoot));
          const repeatedCoeff = repeatedFactor.leadingCoeff;
          const uniqueCoeff = uniqueFactor.leadingCoeff;
          const x2Coeff = rational.numFn.coeffs[2] ?? new Fraction(0);
          const ACoeff = repeatedCoeff.square();
          const BCoeff = uniqueCoeff.times(repeatedCoeff);
          const B = x2Coeff.minus(ACoeff.times(A)).divide(BCoeff);
          const uniqueFactorBrackets =
            `${uniqueFactor}`.length === 1
              ? `${uniqueFactor}`
              : `\\left(${uniqueFactor}\\right)`;
          const repeatedFactorBrackets =
            `${repeatedFactor}`.length === 1
              ? `${repeatedFactor}`
              : `\\left(${repeatedFactor}\\right)`;
          let str = `\\frac{${rational.numFn}}{${factorizedDenom}} = \\frac{A}{${uniqueFactor}} + \\frac{B}{${repeatedFactor}} + \\frac{C}{${repeatedFactorBrackets}^2}`;
          str += `\\\\ A ${repeatedFactorBrackets}^2 + B ${uniqueFactorBrackets}${repeatedFactorBrackets} + C ${uniqueFactorBrackets} = ${rational.numFn}`;
          str += `\\\\ \\textrm{Substituting } x = ${uniqueRoot},`;
          str += `\\\\ A = ${A}`;
          str += `\\\\ \\textrm{Substituting } x = ${repeatedRoot},`;
          str += `\\\\ C = ${C}`;
          str += `\\\\ \\textrm{Comparing coefficients of } x^2,`;
          const abExp = new Expression([ACoeff, "A"], [BCoeff, "B"]);
          str += `\\\\ ${abExp} = ${x2Coeff}`;
          str += `\\\\ B = ${B}`;
          return {
            working: str,
            result: new Expression(
              new RationalFn(A, uniqueFactor),
              new RationalFn(B, repeatedFactor),
              new RationalTerm(C, new ExpansionTerm([repeatedFactor, 2]))
            ),
          };
        } else {
          // three unique linear factors
          const factor1 = new Polynomial([root1.den, -root1.num]);
          const factor2 = new Polynomial([root2.den, -root2.num]);
          const factor3 = new Polynomial([root3.den, -root3.num]);
          const factorizedDenom = new ExpansionTerm(factor1, factor2, factor3);
          const A = rational.numFn
            .subIn(root1)
            .divide(factor2.subIn(root1))
            .divide(factor3.subIn(root1));
          const B = rational.numFn
            .subIn(root2)
            .divide(factor1.subIn(root2))
            .divide(factor3.subIn(root2));
          const C = rational.numFn
            .subIn(root3)
            .divide(factor1.subIn(root3))
            .divide(factor2.subIn(root3));
          let str = `\\frac{${rational.numFn}}{${factorizedDenom}} = \\frac{A}{${factor1}} + \\frac{B}{${factor2}} + \\frac{C}{${factor3}}`;
          str += `\\\\ A \\left(${factor2}\\right) \\left(${factor3}\\right) + B \\left(${factor1}\\right) \\left(${factor3}\\right) + C \\left(${factor1}\\right) \\left(${factor2}\\right) = ${rational.numFn}`;
          str += `\\\\ \\textrm{Substituting } x = ${root1},`;
          str += `\\\\ A = ${A}`;
          str += `\\\\ \\textrm{Substituting } x = ${root2},`;
          str += `\\\\ B = ${B}`;
          str += `\\\\ \\textrm{Substituting } x = ${root3},`;
          str += `\\\\ C = ${C}`;
          return {
            working: str,
            result: new Expression(
              new RationalFn(A, factor1),
              new RationalFn(B, factor2),
              new RationalFn(C, factor3)
            ),
          };
        }
      }
    } catch (e) {
      throw new Error(
        `Unable to factorize ${rational.denFn} with ${denFactor}. ${e}`
      );
    }
  }
  throw new Error(`partial fractions for ${rational} not implemented yet`);
}
