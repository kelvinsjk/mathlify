import { sum, brackets, sumVerbatim, product } from '../../../src/';
import { test, expect } from 'vitest';

test('simplify like terms', () => {
	const sum1 = sumVerbatim('x', [-2, 'x']);
	expect(`${sum1}`).toBe(`x - 2x`);
	expect(`${sum1.simplify()}`).toBe(`- x`);
	expect(`${sum('x', [-2, 'x'])}`).toBe(`- x`);

	const sum2 = sumVerbatim('x', brackets(product(-1, 'x')));
	expect(`${sum2}`).toBe(`x + \\left( - x \\right)`);
	expect(`${sum2.simplify()}`).toBe(`0`);

	const sum3 = sumVerbatim('x', -2, [3, 'y'], ['x', 2], [-1, 'y'], 5);
	expect(`${sum3}`).toBe(`x - 2 + 3y + x^2 - y + 5`);
	expect(`${sum3.simplify()}`).toBe(`x + 3 + 2y + x^2`);

	const sum4 = sumVerbatim([[1, '/', 2], 'x'], 5, [-1, 'x']);
	expect(`${sum4}`).toBe(`\\frac{1}{2}x + 5 - x`);
	expect(`${sum4.simplify()}`).toBe(`- \\frac{1}{2}x + 5`);
});
