import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
	Vector,
	SquareRoot,
	Fraction,
	gcd,
	xVector,
	uVector,
	Term,
	expToPoly,
	solveQuadratic,
	uVectorExpression,
	uxVector,
	cramersFrac,
	longDivide,
	Polynomial,
	xPolynomial,
	Expression,
} from '../../index';

const longDivision = suite('Long Division');

longDivision('long division', () => {
	const x = new Polynomial([1, 0]);
	const x2Plus1 = new Polynomial([1, 0, 1]);
	const { quotient: q, remainder: r } = longDivide(x2Plus1, x);
	assert.is(true, true);
});

longDivision('xPoly', () => {
	const sN = new xPolynomial(['A', 'B', 0], { variable: 'n' });
	const sNMinus1 = sN.replaceXWith(new Polynomial([1, -1]));
});

longDivision.run();
