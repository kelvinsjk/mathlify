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

const negativeFourThird = new Fraction(12, -9);
const half = new Fraction(1, 2);
const zero = new Fraction(0, 6);
const negativeFive = new Fraction(-5);
test('constructor hoists negatives and simplifies with gcd', () => {
	expect(negativeFourThird.num).toBe(-4);
	expect(negativeFourThird.den).toBe(3);
});

test('primitive returns', () => {
	expect(negativeFourThird.valueOf()).toEqual(-4 / 3);
	expect(negativeFourThird.toString()).toBe('- \\frac{4}{3}');
	expect(half.toString()).toBe('\\frac{1}{2}');
	expect(`${zero}`).toBe('0');
	expect(`${new Fraction(-0)}`).toBe('0');
	expect(`${negativeFive}`).toBe('- 5');
});

test('logical operators', () => {
	expect(half.isInteger()).toBe(false);
	expect(negativeFourThird.isEqualTo(-4 / 3)).toBe(true);
	expect(negativeFourThird.isNotEqualTo(half)).toBe(true);
	expect(negativeFourThird.isAtLeast(half)).toBe(false);
	expect(negativeFourThird.isAtMost(half)).toBe(true);
	expect(negativeFourThird.isGreaterThan(2)).toBe(false);
	expect(negativeFourThird.isLessThan(2)).toBe(true);
});

test('arithmetic operators', () => {
	expect(() => {
		zero.reciprocal();
	}).toThrow();
	expect(() => {
		half.divide(zero);
	}).toThrow();
	expect(() => {
		half.pow(1.2);
	}).toThrow();
	expect(zero.sign()).toBe(0);
	expect(negativeFourThird.plus(half).isEqualTo(new Fraction(-5, 6))).toBe(
		true
	);
	expect(negativeFourThird.divide(half).isEqualTo(new Fraction(-8, 3))).toBe(
		true
	);
	expect(negativeFourThird.minus(half).isEqualTo(new Fraction(-11, 6))).toBe(
		true
	);
	expect(negativeFourThird.square().isEqualTo(new Fraction(16, 9))).toBe(true);
	expect(negativeFourThird.pow(-2).isEqualTo(new Fraction(9, 16))).toBe(true);
});

test('number methods', () => {
	expect(negativeFourThird.round()).toBe(-1);
	expect(negativeFourThird.ceil()).toBe(-1);
	expect(negativeFourThird.floor()).toBe(-2);
	expect(negativeFourThird.toFixed(1)).toBe('-1.3');
	expect(negativeFourThird.toPrecision(3)).toBe('-1.33');
});

test('toJSON', () => {
	const halfJSON = JSON.stringify(half);
	const newHalf = Fraction.fromJSON(JSON.parse(halfJSON));
	expect(`${newHalf}`).toBe(`\\frac{1}{2}`);
});

test('static methods/props', () => {
	expect(
		Fraction.gcd(negativeFourThird, half).isEqualTo(new Fraction(1, 6))
	).toBe(true);
	expect(
		Fraction.gcd(negativeFourThird, -2).isEqualTo(new Fraction(-2, 3))
	).toBe(true);
	expect(Fraction.ONE.num).toBe(1);
	expect(Fraction.ZERO.num).toBe(0);
});
