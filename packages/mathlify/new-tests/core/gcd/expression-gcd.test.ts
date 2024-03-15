import { sum, quotient } from '../../../src';
import { test, expect } from 'vitest';

test('expression gcd to combine fractions', () => {
	const xMinus1 = sum('x', -1);
	const twoXMinus2 = sum([2, 'x'], -2);
	const exp1 = sum(quotient(1, xMinus1), quotient(1, twoXMinus2));
	expect(`${exp1.combineFraction()}`).toBe(`\\frac{3}{2\\left( x - 1 \\right)}`);
});
