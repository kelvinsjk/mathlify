import { product, brackets, quotient } from '.';
import { test, expect } from 'vitest';

test('macros', () => {
	let q = product(2, ['x', 'y']);
	expect(`${q}`).toBe('2\\left( x + y \\right)');
	q = brackets('x');
	expect(`${q}`).toBe('\\left( x \\right)');
	q = product([2, '/', 3]);
	expect(`${q}`).toBe('\\frac{2}{3}');
	q = product(['()', [2, '/', 3]]);
	expect(`${q}`).toBe('\\frac{2}{3}');
	expect(() => product(['()', ['()', 2]])).toThrow();
	q = product(2, ['x', [1, '/', 2]]);
	expect(`${q}`).toBe('2\\left( x + \\frac{1}{2} \\right)');
	q = quotient([1, '/', 2], ['()', 'x']);
	expect(`${q}`).toBe('\\frac{\\frac{1}{2}}{x}');
	q = quotient(['()', [1, '/', 2]], ['()', 'x']);
	expect(`${q}`).toBe('\\frac{\\frac{1}{2}}{x}');
	// @ts-expect-error
	expect(() => quotient(['()', []])).toThrow();
	// @ts-expect-error
	expect(() => quotient([])).toThrow();
	// @ts-expect-error
	expect(() => product([[]])).toThrow();
	q = product([['()', 'x']]);
	expect(`${q}`).toBe('x');
});
