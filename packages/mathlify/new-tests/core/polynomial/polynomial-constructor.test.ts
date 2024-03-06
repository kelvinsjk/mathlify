import { polynomial } from '../../../src/';
import { test, expect } from 'vitest';

const xPlus2 = polynomial([0, 0, 0, 1, 2]);
test('polynomial constructor', () => {
	expect(`${xPlus2}`).toBe(`x + 2`);
	expect(xPlus2.degree).toBe(1);
});

test('cloning', () => {
	const clone = xPlus2.clone();
	xPlus2.ascending = true;
	//xPlus2.variable = 'y';
	expect(`${xPlus2}`).toBe(`2 + x`);
	expect(`${clone}`).toBe(`x + 2`);
});
