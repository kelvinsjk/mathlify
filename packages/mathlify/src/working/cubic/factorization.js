import {
  ExpressionProduct,
  factorizeQuadraticIntoPolynomials,
  longDivide,
  solveLinear,
} from "../../algebra";
import { Fraction, Polynomial, Term, Expression } from "../../core";

/**
 * cubic factorization
 * @param {Polynomial} cubic
 * @param {number|Fraction|Polynomial} root
 * @param {{constants: [string, string, string]}} [options] - options for constant names. defaults to a,b,c
 * @returns {{factors: [Polynomial, Polynomial, Polynomial?], exp: ExpressionProduct, working: string, quadratic: Polynomial} }
 */
export function factorizeCubicWorking(cubic, root, options) {
  // Ax^3 + Bx^2 + Cx + D = (alpha x + beta) (ax^2 + bx + c)
  const factor =
    root instanceof Polynomial
      ? root
      : Polynomial.fromRoot(root, { variable: cubic.variable });
  if (cubic.degree !== 3 || factor.degree !== 1) {
    throw new Error(
      "factorizeCubic only works for cubic expressions and root results in a linear polynomial"
    );
  }
  const x = solveLinear(factor);
  if (cubic.subIn(x).is.not.equalTo(0)) {
    throw new Error("root incorrect for cubic expression");
  }
  const [D, , B, A] = cubic.coeffs;
  const [beta, alpha] = factor.coeffs;
  const [aLetter, bLetter, cLetter] = options?.constants ?? ["a", "b", "c"];
  const x3Term = new Term(alpha, aLetter);
  const x2Exp = new Expression([alpha, bLetter], [beta, aLetter]);
  const x0Term = new Term(beta, cLetter);
  const { quotient: quadratic } = longDivide(cubic, factor);
  const [c, b, a] = quadratic.coeffs;
  const workingA = alpha.is.one() ? "" : `\\\\\n&& ${aLetter} &= ${a}`;
  const workingB =
    alpha.is.one() && beta.is.zero() ? "" : `\\\\\n&& ${bLetter} &= ${b}`;
  const workingC = beta.is.zero() ? "" : `\\\\\n&& ${cLetter} &= ${c}`;
  const working = `&x^3:& \\quad ${x3Term} &= ${A}${workingA} \\\\\n&x^2:& \\quad ${x2Exp} &= ${B}${workingB} \\\\\n&x^0: & \\quad ${x0Term} &= ${D}${workingC}`;
  try {
    const quadraticFactors = factorizeQuadraticIntoPolynomials(quadratic);
    const exp = new ExpressionProduct(factor)
      .times(quadraticFactors[0])
      .times(quadraticFactors[1]);
    return { exp, working, quadratic, factors: [factor, ...quadraticFactors] };
  } catch {
    return {
      exp: new ExpressionProduct(factor, quadratic),
      factors: [factor, quadratic],
      working,
      quadratic,
    };
  }
}
