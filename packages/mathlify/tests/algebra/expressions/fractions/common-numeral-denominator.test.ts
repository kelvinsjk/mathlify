import { sum, quotient, product } from '../../../../src/';
import { test, expect } from 'vitest';

test('common numeral denominator', () => {
	let q = sum(1, quotient(product(2, 'x'), 3));
	expect(`${q}`).toBe('1 + \\frac{2x}{3}');
	q._common_denominator();
	expect(`${q}`).toBe('\\frac{3}{3} + \\frac{2x}{3}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{3 + 2x}{3}');

	q = sum(quotient('x', 3), [1, '/', 2]);
	expect(`${q}`).toBe('\\frac{x}{3} + \\frac{1}{2}');
	q._common_denominator();
	expect(`${q}`).toBe('\\frac{2x}{6} + \\frac{3}{6}');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{2x + 3}{6}');

	q = sum('x', [-1, quotient(sum('x', 1), 3)]);
	expect(`${q}`).toBe('x - \\frac{x + 1}{3}');
	q._common_denominator();
	expect(`${q}`).toBe('\\frac{3x}{3} - \\frac{x + 1}{3}');
	q._combine_fraction({ verbatim: true });
	expect(`${q}`).toBe('\\frac{3x - \\left( x + 1 \\right)}{3}');
	q.expand({ verbatim: true });
	expect(`${q}`).toBe('\\frac{3x - x - 1}{3}');
	q.simplify();
	expect(`${q}`).toBe('\\frac{2x - 1}{3}');

	q = sum([-2, '/', 3], [-1, quotient(sum('x', 1), 2)]);
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{- 7 - 3x}{6}');

	q = sum(quotient('x', 3), quotient('y', 4));
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{4x + 3y}{12}');

	q = sum(quotient('x', 3), [-1, quotient('y', 4)]);
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{4x - 3y}{12}');

	q = sum([-1, quotient('y', 4)], 5);
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{- y + 20}{4}');

	q = sum([-1, quotient('y', 4)], quotient('x', 5));
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{- 5y + 4x}{20}');

	q = sum([-1, quotient('y', 4)], [-1, quotient('x', 5)]);
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{- 5y - 4x}{20}');

	q = sum([-1, quotient('y', 4)], 'x');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{- y + 4x}{4}');

	q = sum(quotient('y', 4), 'x');
	q.combine_fraction();
	expect(`${q}`).toBe('\\frac{y + 4x}{4}');
});
