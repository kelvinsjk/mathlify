import { sum, product, exponent } from '../../../src';
import { test, expect } from 'vitest';

test('combine fractions', () => {
	const sum1 = sum(1, [2, '/', 'x']);
	expect(`${sum1}`).toBe(`1 + \\frac{2}{x}`);
	expect(`${sum1.combineFraction()}`).toBe(`\\frac{x + 2}{x}`);
	expect(`${sum1}`).toBe(`1 + \\frac{2}{x}`);

	const sum2 = sum([5, '/', 12], [-1, ['x', '/', 9]]);
	expect(`${sum2}`).toBe(`\\frac{5}{12} - \\frac{x}{9}`);
	expect(`${sum2.combineFraction()}`).toBe(`\\frac{15 - 4x}{36}`);

	const sum3 = sum([-5, '/', 12], [-1, ['x', '/', 9]], 'y');
	expect(`${sum3}`).toBe(`- \\frac{5}{12} - \\frac{x}{9} + y`);
	expect(`${sum3.combineFraction()}`).toBe(`\\frac{- 15 - 4x + 36y}{36}`);

	const sum4 = sum([1, '/', product(2, ['x', 2])], [1, '/', ['x', 3]], [3, '/', 'x']);
	expect(`${sum4}`).toBe(`\\frac{1}{2x^2} + \\frac{1}{x^3} + \\frac{3}{x}`);
	expect(`${sum4.combineFraction()}`).toBe(`\\frac{x + 2 + 6x^2}{2x^3}`);

	const sum5a = sum([1, '/', product(2, exponent('x', [1, '/', 2]))], [1, '/', product(2, 'x')]);
	expect(`${sum5a}`).toBe(`\\frac{1}{2x^{\\frac{1}{2}}} + \\frac{1}{2x}`);
	expect(`${sum5a.combineFraction()}`).toBe(`\\frac{x^{\\frac{1}{2}} + 1}{2x}`);
	const sum5b = sum([1, '/', product(2, exponent('x', [1, '/', 2]))], [1, '/', 'x']);
	expect(`${sum5b}`).toBe(`\\frac{1}{2x^{\\frac{1}{2}}} + \\frac{1}{x}`);
	expect(`${sum5b.combineFraction()}`).toBe(`\\frac{x^{\\frac{1}{2}} + 2}{2x}`);

	// no quotients
	const sum6 = sum([product(2, 'x'), '/', 3], ['x', '/', 3]);
	expect(`${sum6}`).toBe(`\\frac{2x}{3} + \\frac{x}{3}`);
	const noQuotients = sum6.combineFraction();
	expect(`${noQuotients}`).toBe(`x`);
	expect(noQuotients.node.type).toBe('variable');

	const sum7 = sum('x', 1);
	expect(`${sum7.combineFraction()}`).toBe(`x + 1`);
	expect(() => product(1, 'x').combineFraction()).toThrow();

	const sum8 = sum([2, '/', 'x'], [1, '/', product(5, 'x')]);
	expect(`${sum8}`).toBe(`\\frac{2}{x} + \\frac{1}{5x}`);
	expect(`${sum8.combineFraction()}`).toBe(`\\frac{11}{5x}`);
});
