import { product, productVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('product constructor and toString method', () => {
	// empty product
	expect(`${product()}`).toBe(`1`);

	// brackets for numerals that is not the coefficient
	expect(`${productVerbatim('x', 2)}`).toBe(`x\\left( 2 \\right)`);

	// how -1 is handled according to multiplication sign
	const negativeX = product(-1, 'x');
	expect(`${negativeX}`).toBe(`- x`);
	negativeX._multiplicationSign = ' \\times ';
	expect(`${negativeX}`).toBe(`- 1 \\times x`);

	expect(`${product(2, ['x', 'y'])}`).toBe('2\\left( x + y \\right)');
});
