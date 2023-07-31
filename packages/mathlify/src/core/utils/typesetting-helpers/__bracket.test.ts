import { Fraction } from '../..';
import { bracket } from './bracket';
import { test, expect } from 'vitest';

test('auto mode', () => {
	expect(bracket(new Fraction(1, 2))).toBe('\\frac{1}{2}');
	expect(bracket(new Fraction(0, 2))).toBe('0');
	expect(bracket(new Fraction(-1, 2))).toBe('\\left( - \\frac{1}{2} \\right)');
});
test('always mode', () => {
	expect(bracket(new Fraction(1, 2), { mode: 'always' })).toBe(
		'\\left( \\frac{1}{2} \\right)'
	);
	expect(bracket(new Fraction(0, 2), { mode: 'always' })).toBe(
		'\\left( 0 \\right)'
	);
	expect(bracket(new Fraction(-1, 2), { mode: 'always' })).toBe(
		'\\left( - \\frac{1}{2} \\right)'
	);
});
