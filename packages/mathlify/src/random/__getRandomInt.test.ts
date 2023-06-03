import {
	getRandomInt,
	getRandomInts,
} from "./getRandomInt";
import { test, expect } from "vitest";

test("invalid arguments", () => {
	expect(() => getRandomInt({ min: 10 })).toThrow();
	expect(() => getRandomInts(0)).toThrow();
});

test("randomInts", () => {
	expect(getRandomInt() > -10).toBe(true);
	expect(getRandomInt() < 10).toBe(true);
	expect(getRandomInt({ min: 4, max: 4 })).toBe(4);
	for (let i = 0; i < 7; i++) {
		// > 99% chance of full coverage
		expect(getRandomInt({ min: 3, max: 4, avoid: 3 })).toBe(
			4
		);
	}
	expect(
		getRandomInt({ min: 3, max: 5, avoid: [3, 5] })
	).toBe(4);
	const twoArr = getRandomInts(2);
	expect(twoArr.length).toBe(2);
	const threeArr = getRandomInts(3, {
		min: 1,
		max: 4,
		avoid: 4,
		allowReps: false,
	});
	expect(new Set(threeArr).size).toEqual(3);
});
