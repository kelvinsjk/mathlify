import { expect, test } from 'vitest';
import { Fraction } from '../../../src/submodules/classes';

const zero = new Fraction(0);
const half = new Fraction(1, 2);
const negativeFiveSixth = new Fraction(-5, 6);

test('Fraction static gcd/lcm errors', () => {
	expect(() => Fraction.gcd()).toThrow();
	expect(() => Fraction.gcd(zero)).toThrow();
	expect(() => Fraction.gcd(zero, zero, zero)).toThrow();
	expect(() => Fraction.lcm()).toThrow();
	expect(() => Fraction.lcm(zero)).toThrow();
	expect(() => Fraction.lcm(zero, zero)).toThrow();
});

test('Fraction static gcd/lcm calculations', () => {
	expect(`${Fraction.gcd(half)}`).toBe(`\\frac{1}{2}`);
	expect(`${Fraction.gcd(zero, zero, half)}`).toBe(`\\frac{1}{2}`);
	expect(`${Fraction.gcd(half, negativeFiveSixth, 3)}`).toBe(`\\frac{1}{6}`);
	expect(`${Fraction.lcm(half)}`).toBe(`\\frac{1}{2}`);
	expect(`${Fraction.lcm(half, negativeFiveSixth, 3)}`).toBe(`15`);
});
