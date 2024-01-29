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
});
