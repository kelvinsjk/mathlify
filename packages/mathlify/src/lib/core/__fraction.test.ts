import { Fraction } from './fraction';
import { test, expect } from 'vitest';

test('fraction throws on invalid constructor inputs', () => {
	// @ts-ignore
	expect(() => new Fraction('hello')).toThrow();
	expect(() => new Fraction(1, 1 / 2)).toThrow();
	expect(() => new Fraction(1 / 0)).toThrow();
	expect(() => new Fraction(1, 1 / 0)).toThrow();
	expect(() => new Fraction(1, 0)).toThrow();
});

test('constructor hoists negatives and simplifies with gcd', () => {
	const half = new Fraction(12, -9);
	expect(half.num).toBe(-4);
	expect(half.den).toBe(3);
});
