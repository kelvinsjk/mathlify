import { sum, product, sumVerbatim, Expression, productVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('combine like terms', () => {
	const negative3x = product(-3, 'x');
	const x = new Expression('x');
	const negativeX = product(-1, 'x');

	let q = sum([2, 'x'], [3, 'x']);
	expect(`${q}`).toBe('5x');
	q = sumVerbatim([2, 'x'], [3, 'x']);
	expect(`${q}`).toBe('2x + 3x');
	q.simplify();
	expect(`${q}`).toBe('5x');
	q = sumVerbatim('x', ['()', negative3x]);
	expect(`${q}`).toBe('x + \\left( - 3x \\right)');
	q._remove_brackets();
	expect(`${q}`).toBe('x - 3x');
	q.simplify();
	expect(`${q}`).toBe('- 2x');
	q = sumVerbatim('x', [-1, ['()', negative3x]]);
	expect(`${q}`).toBe('x - \\left( - 3x \\right)');
	q._remove_brackets().simplify({ product: true });
	expect(`${q}`).toBe('x + 3x');
	q.simplify();
	expect(`${q}`).toBe('4x');

	q = sumVerbatim([-2, 'x'], [-2, '/', 3], [-1, ['()', negativeX]], [2, '/', 3]);
	expect(`${q}`).toBe('- 2x - \\frac{2}{3} - \\left( - x \\right) + \\frac{2}{3}');
	q._remove_brackets().simplify({ product: true });
	expect(`${q}`).toBe('- 2x - \\frac{2}{3} + x + \\frac{2}{3}');
	q.simplify();
	expect(`${q}`).toBe('- x');
	q = sumVerbatim([-2, 'x'], [-1, '/', 3], 'y', [-1, ['()', negativeX]], [2, '/', 3]);
	q.simplify();
	expect(`${q}`).toBe('- x + \\frac{1}{3} + y');
});

test('combine like terms: fractional coefficients', () => {
	let q = sumVerbatim([[1, '/', 2], 'x'], [[1, '/', 3], 'y'], [[-1, '/', 4], 'x'], 'z', [[-1, '/', 2], 'y']);
	expect(`${q}`).toBe('\\frac{1}{2}x + \\frac{1}{3}y - \\frac{1}{4}x + z - \\frac{1}{2}y');
	q.simplify();
	expect(`${q}`).toBe('\\frac{1}{4}x - \\frac{1}{6}y + z');

	q = product([1, '/', 2], sum([3, sum([2, 'x'], 1)], [-4, sum('x', [-1, 'y'])]));
	expect(`${q}`).toBe('\\frac{1}{2}\\left( 3\\left( 2x + 1 \\right) - 4\\left( x - y \\right) \\right)');
	q.expand();
	expect(`${q}`).toBe('x + \\frac{3}{2} + 2y');
});

test('combine like terms: quadratic expressions', () => {
	let q = sumVerbatim([-3, ['x', 2]], 'x', -1, [-2, 'x'], ['x', 2], [-3, 'x'], -5);
	expect(`${q}`).toBe('- 3x^2 + x - 1 - 2x + x^2 - 3x - 5');
	q.simplify();
	expect(`${q}`).toBe('- 2x^2 - 4x - 6');

	q = sumVerbatim([sum('x', 'y'), 3], [sum('y', 'x'), 3]);
	expect(`${q}`).toBe('\\left( x + y \\right)^3 + \\left( y + x \\right)^3');
	q.simplify();
	expect(`${q}`).toBe('2\\left( x + y \\right)^3');

	q = product(2, ['k', [sum('x', 'y'), 2]]);
	expect(`${q}`).toBe('2\\left( k + \\left( x + y \\right)^2 \\right)');
});
