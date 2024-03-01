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

	const x2Minus2xPlus1 = polynomial([1, -2, 1]);
	expect(`${x2Minus2xPlus1}`).toBe('x^2 - 2x + 1');
	let factorized2 = x2Minus2xPlus1.factorize.quadratic();
	expect(`${factorized2}`).toBe('\\left( x - 1 \\right)^2');
	const x2Minus2xMinus3 = polynomial([1, -2, -3]);
	factorized2 = x2Minus2xMinus3.factorize.quadratic();
	expect(`${factorized2}`).toBe('\\left( x + 1 \\right)\\left( x - 3 \\right)');
	const twoX2MinusXMinus3 = polynomial([2, -1, -3]);
	factorized2 = twoX2MinusXMinus3.factorize.quadratic();
	expect(`${factorized2}`).toBe('\\left( x + 1 \\right)\\left( 2x - 3 \\right)');
	const twoX2Minus8 = polynomial([2, 0, -8]);
	factorized2 = twoX2Minus8.factorize.quadratic();
	expect(`${factorized2}`).toBe('2\\left( x + 2 \\right)\\left( x - 2 \\right)');
	const x2PlusX = polynomial([1, 1, 0]);
	factorized2 = x2PlusX.factorize.quadratic();
	expect(`${factorized2}`).toBe('x\\left( x + 1 \\right)');
	const nineMinusY2 = polynomial([9, 0, -1], { ascending: true, variable: 'y' });
	factorized2 = nineMinusY2.factorize.quadratic();
	expect(`${factorized2}`).toBe('\\left( 3 + y \\right)\\left( 3 - y \\right)');
});
