export { Fraction, Term, Expression, Polynomial } from './core/index.js';
export { gcd, lcm, bracket } from './utils/index.js';
export {
	//! Special Term type
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
} from './algebra/index.js';
export { SquareRoot } from './surds/index.js';
export { xPolynomial } from './extended/index.js';
export {
	determinant,
	determinantNumerical,
	cramersRule,
	cramersRuleNumerical,
} from './numerical/sle/index.js';
export {
	getRandomInt,
	getRandomInts,
	getRandomFraction,
	getRandomFractions,
} from './random/index.js';
export {
	EquationWorking,
	InequalityWorking,
	RationalInequalityWorking,
	solveRationalInequality,
	solveLinearInequality,
	solveQuadraticInequality,
} from './working/index.js';
