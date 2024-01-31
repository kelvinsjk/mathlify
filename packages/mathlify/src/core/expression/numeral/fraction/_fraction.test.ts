import { test, expect } from 'vitest';
import { Fraction } from './fraction';

test('fraction basics', () => {
	expect(() => new Fraction(1.2)).to.throw();
	expect(() => new Fraction(1, 0)).to.throw();
	expect(() => new Fraction(1, 1.2)).to.throw();
	const negativeHalf = new Fraction(3, -6);
	expect(negativeHalf.toFixed(2)).toBe('-0.50');
	expect(negativeHalf.toPrecision(3)).toBe('-0.500');
	expect(negativeHalf.toString()).toBe('\\frac{3}{- 6}');
	const quarter = new Fraction(-1, -4);
	expect(quarter.toString()).toBe('\\frac{- 1}{- 4}');
	quarter._hoist_negative();
	expect(quarter.toString()).toBe('\\frac{1}{4}');
	negativeHalf.simplify();
	expect(negativeHalf.toString()).toBe('- \\frac{1}{2}');
	const zero = new Fraction(0, 6);
	zero.simplify();
	const negativeThree = new Fraction(-3);
	expect(zero.toString()).toBe('0');
	expect(negativeThree.toString()).toBe('- 3');
});

test('fraction boolean checks', () => {
	const half = new Fraction(1, 2);
	expect(half.is.negative()).toBe(false);
	expect(half.is.positive()).toBe(true);
	expect(half.is.zero()).toBe(false);
	expect(half.is.integer()).toBe(false);
	expect(half.is.nonnegative()).toBe(true);
	const zero = new Fraction(0);
	expect(zero.is.negative()).toBe(false);
	expect(zero.is.positive()).toBe(false);
	expect(zero.is.zero()).toBe(true);
	expect(zero.is.integer()).toBe(true);
	expect(zero.is.nonnegative()).toBe(true);
	const negativeHalf = new Fraction(-1, 2);
	expect(negativeHalf.is.negative()).toBe(true);
	expect(negativeHalf.is.positive()).toBe(false);
	expect(negativeHalf.is.zero()).toBe(false);
	expect(negativeHalf.is.nonnegative()).toBe(false);
});

test('fraction gcd, lcm', () => {
	const zero = new Fraction(0);
	const sixFifth = new Fraction(6, 5);
	const twoThird = new Fraction(2, 3);
	const oneSixth = new Fraction(1, 6);
	expect(() => Fraction.gcd()).toThrow();
	expect(() => Fraction.gcd(zero)).toThrow();
	expect(`${Fraction.gcd(sixFifth)}`).toBe(`\\frac{6}{5}`);
	expect(`${Fraction.gcd(sixFifth, zero)}`).toBe(`\\frac{6}{5}`);
	expect(`${Fraction.gcd(zero, sixFifth, twoThird)}`).toBe('\\frac{2}{15}');

	expect(() => Fraction.lcm()).toThrow();
	expect(() => Fraction.lcm(zero)).toThrow();
	expect(`${Fraction.lcm(sixFifth)}`).toBe(`\\frac{6}{5}`);
	expect(`${Fraction.lcm(sixFifth, twoThird, oneSixth)}`).toBe('6');
});

test('fraction arithmetic', () => {
	const zero = new Fraction(0);
	const half = new Fraction(1, 2);
	expect(() => zero.reciprocal()).to.throw();
	expect(() => half.divide(zero)).to.throw();
});
