import { quotient } from '../../../src/';
import { test, expect } from 'vitest';

test('quotient simplification', () => {
	const zeroOverX = quotient(0, 'x', { verbatim: true });
	expect(`${zeroOverX}`).toBe(`\\frac{0}{x}`);
	const zero = zeroOverX.simplify();
	expect(`${zero}`).toBe(`0`);
	expect(zero.node.type).toBe('numeral');
});
