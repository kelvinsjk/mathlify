import { productVerbatim, sumVerbatim, fraction } from '../../../src/';
import { test, expect } from 'vitest';

test('multiply fractions', () => {
	const a = fraction(6, 5);
	const b = fraction(35, 12);
	const aTimesB = productVerbatim(a, b);
	aTimesB.multiplicationSign = ' \\times ';
	expect(`${aTimesB}`).toBe('\\frac{6}{5} \\times \\frac{35}{12}');
	aTimesB.simplify();
	expect(`${aTimesB}`).toBe('\\frac{7}{2}');
	const half = fraction(1, 2);
	const third = fraction(1, 3);
	const quarter = fraction(1, 4);
	const exp = productVerbatim(sumVerbatim(half, [-1, third], quarter), ['()', a.negative()]);
	expect(`${exp}`).toBe('\\left( \\frac{1}{2} - \\frac{1}{3} + \\frac{1}{4} \\right)\\left( - \\frac{6}{5} \\right)');
	exp.simplify();
	expect(`${exp}`).toBe('- \\frac{1}{2}');
});
