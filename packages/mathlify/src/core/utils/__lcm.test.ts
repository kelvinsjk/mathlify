import { lcm } from './lcm';
import { test, expect } from 'vitest';

test('invalid lcms', () => {
	expect(() => lcm()).toThrow();
	expect(() => lcm(1.4)).toThrow();
	expect(() => lcm(1.4, 2)).toThrow();
});

test('gcd', () => {
	expect(lcm(-5)).toBe(5);
	expect(lcm(0, 4)).toBe(0);
	expect(lcm(4, -6)).toBe(12);
	expect(lcm(6, 4, 5)).toBe(60);
});
