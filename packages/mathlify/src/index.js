export { Fraction, Term, Expression, Polynomial } from "./core/index.js";
export { gcd, lcm, bracket } from "./utils/index.js";
export {
  //! Special Term type
  ExpressionProduct,
  RationalTerm,
  ExpansionTerm,
  //! Linear equations
  SLE,
  SLENumerical,
  solveLinear,
  //! Quadratics
  discriminant,
  solveQuadratic,
  solveQuadraticSurd,
  solveQuadraticNumerical,
  factorizeQuadratic,
  completeSquare,
  //! Misc: factorize
  factorizeExpression,
  //! Misc: casting
  castExpression,
  //TODO: move these 3 below to "working" module
  UnsimplifiedTerm,
  longDivision,
} from "./algebra/index.js";
export { SquareRoot } from "./surds/index.js";
export { xPolynomial } from "./extended/index.js";
export {
  determinant,
  determinantNumerical,
  cramersRule,
  cramersRuleNumerical,
  factorial,
  nCr,
} from "./numerical/index.js";
export {
  getRandomInt,
  getRandomInts,
  getRandomFraction,
  getRandomFractions,
} from "./random/index.js";
export {
  // rewrite done
  UnsimplifiedExpression,
  // rewrite to implement again
  EquationWorking,
  InequalityWorking,
  RationalInequalityWorking,
  solveRationalInequality,
  solveLinearInequality,
  solveQuadraticInequality,
  ExpressionWorking,
  BinomialGeneralTerm,
  partialFraction,
} from "./working/index.js";
export {
  RationalFn,
  GeneralFn,
  PowerFn,
  ExpFn,
  LnFn,
  SinFn,
  CosFn,
  dydx,
  d2ydx2,
  PolynomialLike,
} from "./calculus/index.js";
export { Circle, Point } from "./coordinate-geometry/index.js";
