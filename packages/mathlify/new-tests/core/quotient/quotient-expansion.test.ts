import { sum, product, quotient } from '../../../src/';
import { test, expect } from 'vitest';

test('quotient expansion', () => {
	const exp1 = quotient(product('x', sum('x', 1)), product('y', sum('x', -1)));
	expect(`${exp1}`).toBe(`\\frac{x\\left( x + 1 \\right)}{y\\left( x - 1 \\right)}`);
	expect(`${exp1.expand()}`).toBe(`\\frac{x^2 + x}{yx - y}`);
	expect(`${exp1.expand({ numeratorOnly: true })}`).toBe(`\\frac{x^2 + x}{y\\left( x - 1 \\right)}`);
});
