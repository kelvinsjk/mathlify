import { polynomial } from '.';
import { test, expect } from 'vitest';

test('polynomial constructor and toString', () => {
	const x2_3x_4 = polynomial([1, -3, -4]);
	expect(`${x2_3x_4}`).toBe('x^2 - 3x - 4');
	const minus3Y_plus_half = polynomial([-3, [1, '/', 2]], { variable: 'y' });
	expect(`${minus3Y_plus_half}`).toBe('- 3y + \\frac{1}{2}');
	const oneMinus3xMinus4X3 = polynomial([1, -3, 0, -4], { ascending: true });
	expect(`${oneMinus3xMinus4X3}`).toBe('1 - 3x - 4x^3');
});
