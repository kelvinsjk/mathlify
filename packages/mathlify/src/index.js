export { Fraction, Term, Expression, Polynomial } from "./core/index.js";
export { gcd, lcm, bracket } from "./utils/index.js";
export {
  //! Special Term type
  RationalTerm,
  ExpansionTerm,
  //! Linear equations
  SLE,
  SLENumerical,
  solveLinear,
  solveLinearInequality,
  //! Quadratics
  discriminant,
  solveQuadratic,
  solveQuadraticSurd,
  factorizeQuadratic,
  completeSquare,
  //! Misc: factorize
  factorizeExpression,
  //! Misc: casting
  castToPoly,
  castExpression,
  //TODO: move these 3 below to "working" module
  UnsimplifiedExpression,
  UnsimplifiedTerm,
  EquationWorking,
} from "./algebra/index.js";
export { SquareRoot } from "./surds/index.js";
export {
  determinant,
  determinantNumerical,
  cramersRule,
  cramersRuleNumerical,
} from "./numerical/sle/index.js";
export {
  getRandomInt,
  getRandomInts,
  getRandomFraction,
  getRandomFractions,
} from "./random/index.js";
export {
  RationalInequalityWorking,
  solveRationalInequality,
} from "./working/index.js";
