export {
	Fraction,
	SquareRoot,
	NthRoot,
	Unknown,
	Imaginary,
	BasicTerm,
	Term,
	Expression,
	Polynomial,
	gcd,
	numberToFraction,
	numberToSquareRoot,
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
} from './random';

export { JSONParse, factorPairs } from './misc';

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
} from './polynomialMethods';

export { cramers, cramersFrac, determinantFrac, bisection } from './numerical';

export { Complex, ComplexExp, xComplex, expToCartesian, complexToQuadratic, subComplexIntoPoly } from './complex';
export { Angle, sin, cos, tan } from './trigo';
export { AP, GP, solveGpSN } from './sequences';
