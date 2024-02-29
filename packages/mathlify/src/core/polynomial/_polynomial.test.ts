import { Numeral, Polynomial } from '..';
import { test, expect } from 'vitest';

const one = new Numeral(1);
const minus3 = new Numeral(-3);
const minus4 = new Numeral(-4);
const zero = new Numeral(0);

test('polynomial constructor and toString', () => {
	const x2_3x_4 = new Polynomial([one, minus3, minus4]);
	expect(`${x2_3x_4}`).toBe('x^2 - 3x - 4');
	const minus3Y_plus_1 = new Polynomial([minus3, one], { variable: 'y' });
	expect(`${minus3Y_plus_1}`).toBe('- 3y + 1');
	const oneMinus3xMinus4X3 = new Polynomial([one, minus3, zero, minus4], { ascending: true });
	expect(`${oneMinus3xMinus4X3}`).toBe('1 - 3x - 4x^3');
});
