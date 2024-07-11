import { polynomial } from '../../../src';
import { test, expect } from 'vitest';

const x = polynomial([1, 0]);
const xPlus2 = polynomial([1, 2]);
const x2Plus2x = x.times(xPlus2);
test('solving linear polynomial equations', () => {
	expect(`${xPlus2.solve.linear()}`).toBe(`- 2`);
	expect(`${xPlus2.solve.linear(5)}`).toBe(`3`);

	expect(() => x2Plus2x.solve.linear()).toThrow();
});

test('solving/factorizing quadratic polynomial equations', () => {
	expect(`${x2Plus2x.factorize.quadratic()}`).toBe(`x\\left( x + 2 \\right)`);
});
