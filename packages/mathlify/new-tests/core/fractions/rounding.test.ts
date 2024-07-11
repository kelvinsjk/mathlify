import { expect, test } from 'vitest';
import { fraction } from '../../../src';

test('fraction simplification', () => {
	// TODO: hoist these methods to numeral class?
	const fiveOver3 = fraction(5, 3)._getNumeral().number;
	expect(fiveOver3.toFixed(3)).toBe(`1.667`);
	expect(fiveOver3.toPrecision(3)).toBe(`1.67`);
});
