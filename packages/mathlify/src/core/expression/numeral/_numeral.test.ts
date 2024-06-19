import { Numeral } from '.';
import { Fraction } from './fraction';
import { test, expect } from 'vitest';

test('numeral', () => {
	const two = new Numeral(2);
	const half = new Numeral([2, 4]);
	const half2 = new Fraction(2, 4);
	const half3 = new Numeral(half2);
	expect(() => new Numeral(1.2)).toThrow();
	expect(() => new Numeral([1, 0])).toThrow();
	expect(`${two}`).toBe('2');
	expect(`${half}`).toBe('\\frac{1}{2}');
	expect(`${half2}`).toBe('\\frac{2}{4}');
	expect(`${half3}`).toBe('\\frac{1}{2}');
	const negativeHalf = new Numeral([-1, 2]);
	expect(`${negativeHalf}`).toBe('- \\frac{1}{2}');
	expect(`${negativeHalf.abs()}`).toBe('\\frac{1}{2}');
	expect(`${negativeHalf.plus(1)}`).toBe('\\frac{1}{2}');
	expect(`${negativeHalf.plus(half)}`).toBe('0');
	expect(`${negativeHalf.times(2)}`).toBe('- 1');

	expect(`${negativeHalf.reciprocal()}`).toBe('- 2');
	expect(`${negativeHalf.divide(3)}`).toBe('- \\frac{1}{6}');
});

test('numeral static methods', () => {
	expect(`${Numeral.min(new Numeral(1), 2)}`).toBe('1');
	expect(`${Numeral.min(new Numeral(1), -3)}`).toBe('- 3');
	expect(`${Numeral.max(2, 3)}`).toBe('3');
	expect(`${Numeral.max(4, 3)}`).toBe('4');
});
