import { sum, product, exponent, fraction } from '../../../src/';
import { test, expect } from 'vitest';

test('negative expressions', () => {
	const half = fraction(1, 2);
	expect(`${half}`).toBe(`\\frac{1}{2}`);
	const negativeHalf = half.negative();
	expect(`${negativeHalf}`).toBe(`- \\frac{1}{2}`);
	expect(negativeHalf.node.type).toBe('numeral');
	expect(negativeHalf.node.valueOf()).toEqual(-0.5);
	expect(`${half}`).toBe(`\\frac{1}{2}`);

	const twoX = product(2, 'x');
	expect(`${twoX}`).toBe(`2x`);
	expect(`${twoX.negative()}`).toBe(`- 2x`);

	const xMinusY = sum('x', [-1, 'y']);
	expect(`${xMinusY}`).toBe(`x - y`);
	expect(`${xMinusY.negative()}`).toBe(`- x + y`);

	const x2 = exponent('x', 2);
	expect(`${x2}`).toBe(`x^2`);
	expect(`${x2.negative()}`).toBe(`- x^2`);
});
