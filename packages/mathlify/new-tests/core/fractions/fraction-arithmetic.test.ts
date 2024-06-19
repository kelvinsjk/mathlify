import { expect, test } from 'vitest';
import { fraction } from '../../../src';
import { Fraction } from '../../../src/submodules/classes';

test('fraction arithmetic', () => {
	// expression-numeral node
	const half1 = fraction(1, 2);
	expect(`${half1._getNumeral().reciprocal()}`).toBe('2');
	expect(`${half1._getNumeral().pow(3)}`).toBe('\\frac{1}{8}');

	// fraction node
	const half2 = new Fraction(1, 2);
	expect(half2.is.nonnegative()).toBe(true);
	expect(() => half2.pow(0.5)).toThrow();
	expect(`${half2.pow(-2)}`).toBe('4');

	const zero = new Fraction(0);
	expect(() => zero.reciprocal()).toThrow();
	expect(() => half2.divide(zero)).toThrow();
});
