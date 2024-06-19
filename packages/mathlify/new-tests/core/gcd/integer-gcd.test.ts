import { gcd } from '../../../src/';
import { test, expect } from 'vitest';

test('integer gcd', () => {
	expect(() => gcd()).toThrow();
	expect(() => gcd(0)).toThrow();
	expect(() => gcd(1.2)).toThrow();
	expect(() => gcd(0, 0)).toThrow();
	expect(() => gcd(2, 2.1)).toThrow();
	expect(gcd(-5)).toBe(5);
	expect(gcd(0, 0, 5)).toBe(5);
	expect(gcd(4, 6, -10)).toBe(2);
});
