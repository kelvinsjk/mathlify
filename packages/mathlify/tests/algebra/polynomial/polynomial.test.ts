import { test, expect } from 'vitest';
import { polynomial } from '../../../src';

test('factorize', () => {
	const twoXPlus4 = polynomial([2, 4]);
	expect(`${twoXPlus4}`).toBe('2x + 4');
	let factorized = twoXPlus4.factorize.commonFactor();
	expect(`${factorized}`).toBe('2\\left( x + 2 \\right)');
	expect(`${factorized.commonFactor}`).toBe('2');
	expect(`${factorized.remainingFactor}`).toBe('x + 2');
	const neg3x2_minus6x = polynomial([-3, 0, -6]);
	expect(`${neg3x2_minus6x}`).toBe('- 3x^2 - 6');
	factorized = neg3x2_minus6x.factorize.commonFactor();
	expect(`${factorized}`).toBe('- 3\\left( x^2 + 2 \\right)');
	expect(`${factorized.commonFactor}`).toBe('- 3');
	expect(`${factorized.remainingFactor}`).toBe('x^2 + 2');
	const x4Minus_x2 = polynomial([1, 0, -1, 0, 0]);
	expect(`${x4Minus_x2}`).toBe('x^4 - x^2');
	factorized = x4Minus_x2.factorize.commonFactor();
	expect(`${factorized}`).toBe('x^2\\left( x^2 - 1 \\right)');
	expect(`${factorized.commonFactor}`).toBe('x^2');
	expect(`${factorized.remainingFactor}`).toBe('x^2 - 1');
});
