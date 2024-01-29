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
