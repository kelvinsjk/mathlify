import { getRandomFrac, getRandomFracs } from './getRandomFrac';
import { test, expect } from 'vitest';
import { Fraction } from '../core';

test('invalid arguments', () => {
	expect(() => getRandomFracs(0)).toThrow();
});

test('randomFracs', () => {
	expect(getRandomFrac().num > -10).toBe(true);
	expect(getRandomFrac().num < 10).toBe(true);
	expect(getRandomFrac().den > -10).toBe(true);
	expect(getRandomFrac().den < 10).toBe(true);
	for (let i = 0; i < 17; i++) {
		// > 99% chance of full coverage
		expect(getRandomFrac({ allowInt: false }).den != 1).toBe(true);
	}
	expect(
		getRandomFrac({
			numRange: [1, 3],
			denRange: [1, 1],
			avoid: [2, 3],
		}).is.equalTo(1)
	).toBe(true);
	const twoArr = getRandomFracs(2);
	expect(twoArr.length).toBe(2);
	const [x, y] = getRandomFracs(2, {
		numRange: [1, 1],
		denRange: [1, 3],
		avoid: new Fraction(1, 3),
		allowReps: false,
	});
	const [half, one] = x.is.greaterThan(y) ? [y, x] : [x, y];
	expect(one.num).toBe(1);
	expect(one.den).toBe(1);
	expect(half.num).toBe(1);
	expect(half.den).toBe(2);
});
