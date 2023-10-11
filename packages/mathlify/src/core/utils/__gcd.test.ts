import { gcd } from './gcd';
import { test, expect } from 'vitest';

test('invalid gcds', () => {
	expect(() => gcd()).toThrow();
	expect(() => gcd(0)).toThrow();
	expect(() => gcd(1.4)).toThrow();
	expect(() => gcd(1.4, 2)).toThrow();
	expect(() => gcd(0, 0)).toThrow();
	expect(() => gcd(0, 0, 0)).toThrow();
});

test('gcd', () => {
	expect(gcd(5)).toBe(5);
	expect(gcd(0, 4)).toBe(4);
	expect(gcd(4, -6)).toBe(2);
	expect(gcd(6, -12, 3)).toBe(3);
});
