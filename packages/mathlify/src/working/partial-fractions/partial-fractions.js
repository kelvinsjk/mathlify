import {
  RationalTerm,
  castToPoly,
  factorizeQuadratic,
  solveLinear,
  ExpressionProduct,
} from "../../algebra/index.js";
import { Expression, Fraction, Polynomial, Term } from "../../core/index.js";
import { xPolynomial } from "../../extended/xPolynomial.js";

/**
 * partial fractions
 * @param {number|Fraction|string|Polynomial} num
 * @param {(Polynomial|string|[string|Polynomial, 2])[]|Polynomial|ExpressionProduct} den
 * - if polynomial provided, then expect reducible polynomial of degree 2.
 * Else expect an array of irreducible factors
 * @returns {{working: {start: string, substitutions: [Fraction, string][], comparing: string, final: string}, result: Expression}}
 */
export function partialFractionsWorking(num, den) {
  /** @type {string|undefined} */
  let variable = undefined;
  if (num instanceof Polynomial) {
    variable = num.variable;
  } else if (typeof num === "string") {
    variable = num;
  }
  const numPoly =
    num instanceof Polynomial
      ? num
      : typeof num === "string"
      ? new Polynomial(num)
      : new Polynomial([num]);
  /** @type {ExpressionProduct|undefined} */
  let denProd = den instanceof ExpressionProduct ? den : undefined;
  // handle denominators
  if (den instanceof Polynomial) {
    if (variable === undefined) {
      variable = den.variable;
    }
    try {
      denProd = factorizeQuadratic(den);
    } catch {
      throw new Error(`${den} cannot be factorized`);
    }
  } else if (Array.isArray(den)) {
    den.forEach((d) => {
      if (typeof d === "string") {
        if (variable === undefined) {
          variable = d;
        }
        d = Polynomial.ofDegree(1, { variable: d });
      }
      if (Array.isArray(d)) {
        let [factor, pow] = d;
        if (typeof factor === "string") {
          factor = Polynomial.ofDegree(1, { variable: factor });
          if (variable === undefined) {
            variable = factor.variable;
          }
        } else {
          if (variable === undefined) {
            variable = factor.variable;
          }
        }
        const expProd = new ExpressionProduct([factor, pow]);
        if (denProd) {
          denProd = denProd.times(expProd);
        } else {
          denProd = expProd;
        }
      } else {
        if (typeof d === "string") {
          d = Polynomial.ofDegree(1, { variable: d });
          if (variable === undefined) {
            variable = d.variable;
          }
        } else {
          if (variable === undefined) {
            variable = d.variable;
          }
        }
        if (denProd) {
          denProd = denProd.times(new ExpressionProduct(d));
        } else {
          denProd = new ExpressionProduct(d);
        }
      }
    });
  }
  // check for irreducible and/or repeated factors
  if (denProd === undefined) {
    throw new Error(`unable to parse denominators ${den}`);
  }
  const factor = denProd.factor;
  const exps = denProd.exps;
  if (factor.coeff.is.not.one()) {
    throw new Error(`currently do no support non-one coeff for denominator`);
  }
  /** @type {Polynomial[]} */
  const linearFactors = [];
  /** @type {Polynomial|undefined} */
  let repeatedFactor = undefined;
  /** @type {Polynomial|undefined} */
  let irreducibleFactor = undefined;
  // handle factor term
  if (factor.powerMap.size === 1) {
    const [exp] = factor.powerMap.keys();
    const [pow] = factor.powerMap.values();
    if (pow.is.one()) {
      linearFactors.push(Polynomial.ofDegree(1, { variable: exp }));
    } else if (pow.is.equalTo(2)) {
      repeatedFactor = Polynomial.ofDegree(1, { variable: exp });
    } else {
      throw new Error(`currently only support power 1 and 2 for denominator`);
    }
  } else if (factor.variables.length > 1) {
    throw new Error(
      `currently do not support denominators with more than one variable`
    );
  }
  exps.forEach((exp) => {
    const poly = castToPoly(exp);
    const pow = denProd?.expPowerMap.get(exp);
    if (pow !== undefined) {
      if (pow.is.one() && poly.degree === 1) {
        linearFactors.push(poly);
      } else if (pow.is.equalTo(2) && poly.degree === 1) {
        if (repeatedFactor === undefined) {
          repeatedFactor = poly;
        } else {
          throw new Error(`currently only support one repeated factor`);
        }
      } else if (pow.is.equalTo(1) && poly.degree === 2) {
        if (irreducibleFactor === undefined) {
          irreducibleFactor = poly;
        } else {
          throw new Error(`currently only support one irreducible factor`);
        }
      } else {
        throw new Error(`denominator ${poly} with power ${pow} not supported`);
      }
    }
  });
  if (repeatedFactor && irreducibleFactor) {
    throw new Error(
      `currently do not support both repeated and irreducible factors`
    );
  }
  if (
    linearFactors.length === 0 ||
    (linearFactors.length === 1 &&
      repeatedFactor === undefined &&
      irreducibleFactor === undefined)
  ) {
    throw new Error(`denominator ${den} must have at least one factor`);
  }
  const denDegree =
    linearFactors.length +
    (repeatedFactor ? 2 : 0) +
    (irreducibleFactor ? 2 : 0);
  if (numPoly.degree >= denDegree) {
    throw new Error(
      `numerator degree ${numPoly.degree} must be less than denominator degree ${denDegree}`
    );
  }
  const rational = new RationalTerm(numPoly, denProd);
  /** @type {string[]} */
  const unknownRationalTerms = [];
  /** @type {string[]} */
  const polyTerms = [];
  linearFactors.forEach((factor, i) => {
    unknownRationalTerms.push(
      `\\frac{${String.fromCharCode(65 + i)}}{${factor}}`
    );
    const otherFactors = linearFactors.filter((_, j) => j !== i);
    let poly = "";
    if (otherFactors.length > 0) {
      poly += `\\left(${otherFactors.join("\\right)\\left(")}\\right)`;
    }
    if (repeatedFactor) {
      const repeatedBrackets =
        `${repeatedFactor}`.length > 1
          ? `\\left(${repeatedFactor}\\right)`
          : `${repeatedFactor}`;
      poly += `${repeatedBrackets}^2`;
    }
    if (irreducibleFactor) {
      poly += `\\left(${irreducibleFactor}\\right)`;
    }
    polyTerms.push(`${String.fromCharCode(65 + i)}${poly}`);
  });
  if (repeatedFactor) {
    unknownRationalTerms.push(
      `\\frac{${String.fromCharCode(
        65 + linearFactors.length
      )}}{${repeatedFactor}}`
    );
    const repeatedBrackets =
      `${repeatedFactor}`.length > 1
        ? `\\left(${repeatedFactor}\\right)`
        : `${repeatedFactor}`;
    unknownRationalTerms.push(
      `\\frac{${String.fromCharCode(
        65 + linearFactors.length + 1
      )}}{${repeatedBrackets}^2}`
    );
    const poly2 = `\\left(${linearFactors.join("\\right)\\left(")}\\right)`;
    const poly = poly2 + `${repeatedBrackets}`;
    polyTerms.push(
      `${String.fromCharCode(65 + linearFactors.length)}${poly}`,
      `${String.fromCharCode(65 + linearFactors.length + 1)}${poly2}`
    );
  }
  if (irreducibleFactor) {
    const num = new xPolynomial(
      [
        String.fromCharCode(65 + linearFactors.length),
        String.fromCharCode(65 + linearFactors.length + 1),
      ],
      { variable: variable ?? "x" }
    );
    unknownRationalTerms.push(`\\frac{${num}}{${irreducibleFactor}}`);
    const poly = `\\left(${linearFactors.join("\\right)\\left(")}\\right)`;
    polyTerms.push(`\\left(${num}\\right)${poly}`);
  }
  const start = `${rational} = ${unknownRationalTerms.join(
    " + "
  )} \\\\\n${numPoly} = ${polyTerms.join(" + ")}`;
  /** @type {Fraction[]} */
  const fractions = [];
  /** @type {Fraction[]} */
  const leadingCoeffs = [];
  /** @type {Fraction[]} */
  const xValues = [];
  /** @type {RationalTerm[]} */
  const rationalTerms = [];
  /** @type {[Fraction, string][]} */
  const substitutions = [];
  /** @type {string} */
  let comparing = "";
  linearFactors.forEach((factor, i) => {
    const otherFactors = linearFactors.filter((_, j) => j !== i);
    const x = solveLinear(factor);
    xValues.push(x);
    const lhs = numPoly.subIn(x);
    let divisor = Fraction.ONE;
    let leadingCoeff = Fraction.ONE;
    otherFactors.forEach((other) => {
      divisor = divisor.times(other.subIn(x));
      leadingCoeff = leadingCoeff.times(other.leadingCoeff);
    });
    if (repeatedFactor) {
      divisor = divisor.times(repeatedFactor.subIn(x).square());
      leadingCoeff = leadingCoeff.times(repeatedFactor.leadingCoeff.square());
    }
    if (irreducibleFactor) {
      divisor = divisor.times(irreducibleFactor.subIn(x));
      leadingCoeff = leadingCoeff.times(irreducibleFactor.leadingCoeff);
    }
    const letter = String.fromCharCode(65 + i);
    const frac = lhs.divide(divisor);
    substitutions.push([
      x,
      `${lhs} &= ${letter} \\left( ${divisor} \\right) \\\\\n${letter} &= ${frac}`,
    ]);
    fractions.push(frac);
    rationalTerms.push(new RationalTerm(frac, factor));
    leadingCoeffs.push(leadingCoeff);
  });
  const degree =
    linearFactors.length +
    (repeatedFactor ? 2 : 0) +
    (irreducibleFactor ? 2 : 0) -
    1;
  const degreeString = `${degree}`.length > 1 ? `{${degree}}` : `${degree}`;

  if (repeatedFactor) {
    // power 1 numerator
    const lhsLeadingCoeff = numPoly.coeffs[degree] ?? Fraction.ZERO;
    const rhsLeadingCoeff = leadingCoeffs.reduce(
      (acc, curr, i) => acc.plus(curr.times(fractions[i])),
      Fraction.ZERO
    );
    // sum of leadingCoeffs
    const divisor = linearFactors
      .reduce((acc, curr) => acc.times(curr.leadingCoeff), Fraction.ONE)
      .times(repeatedFactor.leadingCoeff);
    const num = lhsLeadingCoeff.minus(rhsLeadingCoeff).divide(divisor);
    fractions.push(num);
    rationalTerms.push(new RationalTerm(num, repeatedFactor));
    const expArgs = leadingCoeffs.map((coeff, i) => {
      return [coeff, String.fromCharCode(65 + i)];
    });
    const variable = String.fromCharCode(65 + linearFactors.length);
    const exp = new Expression(...expArgs, [divisor, variable]);
    if (comparing) {
      comparing += "\\\\\n";
    }
    comparing += `&x^${degreeString}:& \\quad ${exp} &= ${lhsLeadingCoeff} \\\\\n&& ${variable} &= ${num}`;
    // power 2 numerator
    const x = solveLinear(repeatedFactor);
    const lhs = numPoly.subIn(x);
    let divisor2 = Fraction.ONE;
    linearFactors.forEach((factor) => {
      divisor2 = divisor2.times(factor.subIn(x));
    });
    const frac = lhs.divide(divisor2);
    fractions.push(frac);
    const letter = String.fromCharCode(65 + linearFactors.length + 1);
    substitutions.push([
      x,
      `${lhs} &= ${letter} \\left( ${divisor2} \\right) \\\\\n${letter} &= ${frac}`,
    ]);

    rationalTerms.push(new RationalTerm(frac, [repeatedFactor, 2]));
  }
  if (irreducibleFactor) {
    const [constant] = numPoly.coeffs;
    const coeff = numPoly.coeffs[degree] ?? Fraction.ZERO;
    let constantDivisor = Fraction.ONE;
    let coeffDivisor = Fraction.ONE;
    let exp = new Expression(0);
    /** @type {Polynomial} */
    const assertedIrreducibleFactor = irreducibleFactor;
    const irreducibleLeadingCoeff = assertedIrreducibleFactor.leadingCoeff;
    const irreducibleConstant = assertedIrreducibleFactor.coeffs[0] ?? 1;
    let sum = Fraction.ZERO;
    let sum2 = Fraction.ZERO;
    let exp2 = new Expression(0);
    linearFactors.forEach((factor, i) => {
      const [a0, a1] = factor.coeffs;
      constantDivisor = constantDivisor.times(a0 ?? 1);
      coeffDivisor = coeffDivisor.times(a1 ?? 1);
      const otherFactors = linearFactors.filter((_, j) => j !== i);
      const otherLeadingCoeff = otherFactors.reduce(
        (acc, curr) => acc.times(curr.leadingCoeff),
        Fraction.ONE
      );
      const otherConstant = otherFactors.reduce(
        (acc, curr) => acc.times(curr.coeffs[0] ?? 1),
        Fraction.ONE
      );
      exp = exp.plus(
        new Expression([
          otherLeadingCoeff.times(irreducibleLeadingCoeff),
          String.fromCharCode(65 + i),
        ])
      );
      exp2 = exp2.plus(
        new Expression([
          otherConstant.times(irreducibleConstant),
          String.fromCharCode(65 + i),
        ])
      );
      sum = sum.plus(
        otherLeadingCoeff.times(irreducibleLeadingCoeff).times(fractions[i])
      );
      sum2 = sum2.plus(
        otherConstant.times(irreducibleConstant).times(fractions[i])
      );
    });
    if (comparing) {
      comparing += "\\\\\n";
    }
    const firstLetter = String.fromCharCode(65 + linearFactors.length);
    const secondLetter = String.fromCharCode(65 + linearFactors.length + 1);
    const firstValue = coeff.minus(sum).divide(coeffDivisor);
    const secondValue = constant.minus(sum2).divide(constantDivisor);
    comparing += `&x^${degreeString}:& \\quad ${exp.plus(
      new Term(coeffDivisor, firstLetter)
    )} &= ${coeff} \\\\\n&& ${firstLetter} &= ${firstValue}\\\\\n`;
    comparing += `&x^0:& \\quad ${exp2.plus(
      new Term(constantDivisor, secondLetter)
    )} &= ${constant} \\\\\n&& ${secondLetter} &= ${secondValue}`;
    const newNum = new Polynomial([firstValue, secondValue], {
      variable: variable ?? "x",
    });
    rationalTerms.push(new RationalTerm(newNum, irreducibleFactor));
  }
  const result = new Expression(...rationalTerms);
  return {
    working: {
      start,
      substitutions,
      comparing,
      final: `${rational} = ${result}`,
    },
    result,
  };
}
