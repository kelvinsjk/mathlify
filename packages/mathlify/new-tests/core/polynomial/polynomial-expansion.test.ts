import { polynomial } from '../../../src';
import { test, expect } from 'vitest';

const x = polynomial([1, 0]);
const xPlus2 = polynomial([1, 2]);
const x2Plus2x = x.times(xPlus2);
test('polynomial arithmetic', () => {
	expect(`${x2Plus2x}`).toBe(`x^2 + 2x`);
	expect(`${xPlus2.plus(3)}`).toBe(`x + 5`);
	expect(`${x.minus(xPlus2)}`).toBe(`- 2`);

	const yMinus1 = polynomial([1, -1], { variable: 'y' });
	expect(() => x.times(yMinus1)).toThrow();
	expect(() => x.plus(yMinus1)).toThrow();
});
