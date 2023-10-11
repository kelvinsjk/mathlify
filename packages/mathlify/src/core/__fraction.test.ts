import { gcd, lcm } from './utils';
import { Fraction } from './fraction';
import { test, expect } from 'vitest';
test('fraction throws on invalid constructor inputs', () => {
	// @ts-expect-error
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
	expect(negativeFourThird.toTex()).toBe('- \\frac{4}{3}');
	expect(half.toTex()).toBe('\\frac{1}{2}');
	expect(zero.toTex()).toBe('0');
	expect(`${new Fraction(-0).toTex()}`).toBe('0');
	expect(`${negativeFive.toTex()}`).toBe('- 5');
});

test('logical operators', () => {
	expect(half.is.integer()).toBe(false);
	expect(negativeFourThird.is.equalTo(-4 / 3)).toBe(true);
	expect(negativeFourThird.is.not.equalTo(half)).toBe(true);
	expect(negativeFourThird.is.not.greaterThan(2)).toBe(true);
	expect(negativeFourThird.is.not.lessThan(2)).toBe(false);
	expect(negativeFourThird.is.negative()).toBe(true);
	expect(negativeFourThird.is.positive()).toBe(false);
	expect(negativeFourThird.is.zero()).toBe(false);
	expect(zero.is.not.negative()).toBe(true);
	expect(zero.is.not.positive()).toBe(true);
	expect(zero.is.not.zero()).toBe(false);
	expect(negativeFourThird.is.not.atLeast(half)).toBe(true);
	expect(negativeFourThird.is.not.atMost(half)).toBe(false);
	expect(half.is.not.one()).to.be.true;
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
	expect(() => {
		half.pow(half);
	}).toThrow();
	expect(zero.sign()).toBe(0);
	expect(negativeFourThird.plus(half).is.equalTo(new Fraction(-5, 6))).toBe(
		true
	);
	expect(negativeFourThird.divide(half).is.equalTo(new Fraction(-8, 3))).toBe(
		true
	);
	expect(negativeFourThird.minus(half).is.equalTo(new Fraction(-11, 6))).toBe(
		true
	);
	expect(negativeFourThird.square().is.equalTo(new Fraction(16, 9))).toBe(true);
	expect(negativeFourThird.pow(-2).is.equalTo(new Fraction(9, 16))).toBe(true);
	expect(negativeFourThird.abs().toTex()).toBe('\\frac{4}{3}');
	expect(negativeFourThird.negativeReciprocal().toTex()).toBe(`\\frac{3}{4}`);
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
	expect(`${newHalf.toTex()}`).toBe(`\\frac{1}{2}`);
});

test('static methods/props', () => {
	expect(
		Fraction.gcd(negativeFourThird, half).is.equalTo(new Fraction(1, 6))
	).toBe(true);
	expect(
		Fraction.gcd(negativeFourThird, -2).is.equalTo(new Fraction(-2, 3))
	).toBe(true);
	expect(Fraction.ONE.num).toBe(1);
	expect(Fraction.ZERO.num).toBe(0);
	expect(
		Fraction.lcm(
			new Fraction(5, 8),
			new Fraction(3, 4),
			new Fraction(1, 2)
		).is.equalTo(new Fraction(15, 2))
	).toBe(true);
});

test('fraction type', () => {
	expect(negativeFourThird.type).toBe('fraction');
});
