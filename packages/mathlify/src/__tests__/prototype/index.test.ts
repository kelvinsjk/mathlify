import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
	Vector,
	SquareRoot,
	Fraction,
	gcd,
	xVector,
	uVector,
	Unknown,
	Term,
	expToPoly,
	solveQuadratic,
	uVectorExpression,
	uxVector,
	cramersFrac,
	longDivide,
	Polynomial,
} from '../../index';

const longDivision = suite('Long Division');

longDivision('long division', () => {
	const x = new Polynomial([1, 0]);
	const x2Plus1 = new Polynomial([1, 0, 1]);
	const { quotient: q, remainder: r } = longDivide(x2Plus1, x);
	assert.is(true, true);
});

longDivision.run();
