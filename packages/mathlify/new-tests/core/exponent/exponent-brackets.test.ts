import { exponent, sum, product } from '../../../src/';
import { test, expect } from 'vitest';

test('exponent brackets', () => {
	expect(`${exponent('x', 2)}`).toBe(`x^2`);
	expect(`${exponent(-2, 3, { verbatim: true })}`).toBe(`\\left( - 2 \\right)^3`);
	expect(`${exponent(-2, 3)}`).toBe(`- 8`);
	expect(`${exponent(sum(1, 'x'), 2)}`).toBe(`\\left( 1 + x \\right)^2`);
	expect(`${exponent(product(3, 'x'), 2, { verbatim: true })}`).toBe(`\\left( 3x \\right)^2`);
	expect(`${exponent(product(3, 'x'), 2)}`).toBe(`9x^2`);
});

test('power braces', () => {
	expect(`${exponent('x', 2)}`).toBe(`x^2`);
	expect(`${exponent('x', 1)}`).toBe(`x`);
	expect(`${exponent('x', -1)}`).toBe(`x^{- 1}`);
});
