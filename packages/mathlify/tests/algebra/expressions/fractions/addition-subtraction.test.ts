import { sum, quotient, product, sumVerbatim } from '../../../../src';
import { test, expect } from 'vitest';

test('algebraic fractions', () => {
	let q = sum(quotient(2, 'x'), quotient(3, product(4, ['x', 2])));
	expect(`${q}`).toBe('\\frac{2}{x} + \\frac{3}{4x^2}');
	q._common_denominator();
	expect(`${q}`).toBe('\\frac{8x}{4x^2} + \\frac{3}{4x^2}');
	q._combine_fraction();
	expect(`${q}`).toBe('\\frac{8x + 3}{4x^2}');
	q = sum(quotient(2, 'x'), quotient(3, product(4, ['x', 2])));
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{8x + 3}{4x^2}');
	q = sum(2, quotient(1, sum([5, 'x'], 3)));
	expect(`${q}`).toBe('2 + \\frac{1}{5x + 3}');
	q._common_denominator();
	expect(`${q}`).toBe('\\frac{2\\left( 5x + 3 \\right)}{5x + 3} + \\frac{1}{5x + 3}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{10x + 7}{5x + 3}');
	q = sum(quotient(2, sum('x', 1)), product(-1, 'x'));
	expect(`${q}`).toBe('\\frac{2}{x + 1} - x');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{2 - x^2 - x}{x + 1}');
	q = sumVerbatim(quotient(2, sum('x', 1)), quotient(1, 3, { verbatim: true }));
	expect(`${q}`).toBe('\\frac{2}{x + 1} + \\frac{1}{3}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{7 + x}{3\\left( x + 1 \\right)}');
	q = sum(quotient(1, ['x', 2]), quotient(1, 'y'));
	expect(`${q}`).toBe('\\frac{1}{x^2} + \\frac{1}{y}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{y + x^2}{x^2y}');
	q = sum(quotient(1, product('x', ['y', 2], 'z')), quotient(1, product(3, ['x', 2], 'y')));
	expect(`${q}`).toBe('\\frac{1}{xy^2z} + \\frac{1}{3x^2y}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{3x + yz}{3x^2y^2z}');
});