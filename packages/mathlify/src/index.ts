export {
	Fraction,
	SquareRoot,
	NthRoot,
	VariableTerm,
	Imaginary,
	BasicTerm,
	Term,
	Expression,
	Polynomial,
	gcd,
	lcm,
	factorize,
	numberToFraction,
	numberToSquareRoot,
	MathSymbol,
	ImaginarySymbol,
	type ImaginarySymbolJSON,
	Surd,
	type SurdJSON,
	RootSymbol,
	type RootSymbolJSON,
} from './core';

export { Vector, Line, Plane, xVector, uVector, uxVector, uVectorExpression, uxVectorExpression } from './vectors';

export {
	getRandomInt,
	getRandomInts,
	getRandomVec,
	getNiceVec,
	getRandomPerps,
	getRandomPerp,
	getRandomLine,
	getRandomFrac,
	shuffle,
	heads,
	getRandomAngle,
	sample,
	sampleN,
} from './random';

export { JSONParse, factorPairs, UnsimplifiedExpression, BracketedTerm } from './misc';

export {
	expToPoly,
	simplifyPoly,
	factorizeQuadratic,
	factorizeCubic,
	solveQuadratic,
	solveQuadraticSurd,
	solveQuadraticComplex,
	solveLinear,
	shiftPoly,
	completeSquare,
	longDivide,
	linear,
	subSurdInPoly,
} from './polynomialMethods';

export { cramers, cramersFrac, determinantFrac, bisection } from './numerical';

export { Complex, ComplexExp, xComplex, expToCartesian, complexToQuadratic, subComplexIntoPoly } from './complex';
export { Angle, sin, cos, tan, asin, acos, atan } from './trigo';
export { AP, GP, solveGpSN, solveGpSNNumber } from './sequences';

export { Rational, solveRational, partialFractions, xPolynomial } from './algebra';
export {
	PowerFn,
	SinFn,
	CosFn,
	ExpFn,
	LnFn,
	RationalFn,
	Laurent,
	Parametric,
	integrate,
	definiteIntegral,
	rationalToPowerFn,
	simpsons,
	finiteDifference,
	de,
} from './calculus';

export { Maclaurin, xMaclaurin } from './maclaurin';

export {
	binomPdf,
	binomCdf,
	binomCdfRange,
	normCdf,
	invNorm,
	zTest,
	factorial,
	Normal,
	nCr,
	NCR,
	Regression,
} from './stats';

export type {
	NumberArray2x2,
	FractionArray2x2,
	NumberArray3x3,
	FractionArray3x3,
	NumberArray4x4,
	FractionArray4x4,
} from './numerical';
