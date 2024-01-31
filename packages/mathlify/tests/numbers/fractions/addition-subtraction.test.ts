import { sum, sumVerbatim, fraction, brackets, product } from '../../../src/';
import { test, expect } from 'vitest';
import { Numeral } from '../../../src/core';

test('add/subtract fractions', () => {
	const a = fraction(1, 24);
	const b = fraction(1, 6);
	const c = fraction(8, 9);
	// a + b
	const aPlusB = sumVerbatim(a, b);
	const aPlusBV2 = aPlusB.clone();
	expect(`${aPlusB}`).toBe('\\frac{1}{24} + \\frac{1}{6}');
	aPlusB._common_denominator();
	expect(`${aPlusB}`).toBe('\\frac{1}{24} + \\frac{4}{24}');
	aPlusB._combine_fraction({ verbatim: true });
	expect(`${aPlusB}`).toBe('\\frac{1 + 4}{24}');
	aPlusB.simplify();
	expect(`${aPlusB}`).toBe('\\frac{5}{24}');
	expect(`${aPlusBV2}`).toBe('\\frac{1}{24} + \\frac{1}{6}');
	aPlusBV2._common_denominator();
	aPlusBV2._combine_fraction();
	expect(`${aPlusBV2}`).toBe('\\frac{5}{24}');
	expect(aPlusBV2.expression instanceof Numeral).toBe(true);
	// a - b
	const aMinusB = sumVerbatim(a, [-1, b]);
	expect(`${aMinusB}`).toBe('\\frac{1}{24} - \\frac{1}{6}');
	aMinusB._common_denominator();
	expect(`${aMinusB}`).toBe('\\frac{1}{24} - \\frac{4}{24}');
	aMinusB._combine_fraction({ verbatim: true });
	expect(`${aMinusB}`).toBe('\\frac{1 - 4}{24}');
	aMinusB.simplify({ sum: true, product: true });
	expect(`${aMinusB}`).toBe('\\frac{- 3}{24}');
	aMinusB.simplify();
	expect(`${aMinusB}`).toBe('- \\frac{1}{8}');
	// -a + b
	const negativeAPlusB = sumVerbatim([-1, a], b);
	expect(`${negativeAPlusB}`).toBe('- \\frac{1}{24} + \\frac{1}{6}');
	negativeAPlusB._common_denominator();
	expect(`${negativeAPlusB}`).toBe('- \\frac{1}{24} + \\frac{4}{24}');
	negativeAPlusB._combine_fraction({ verbatim: true });
	expect(`${negativeAPlusB}`).toBe('\\frac{- 1 + 4}{24}');
	negativeAPlusB.simplify({ sum: true, product: true });
	expect(`${negativeAPlusB}`).toBe('\\frac{3}{24}');
	negativeAPlusB.simplify();
	expect(`${negativeAPlusB}`).toBe('\\frac{1}{8}');
	// -a - b
	const negativeAMinusB = sumVerbatim([-1, a], [-1, b]);
	expect(`${negativeAMinusB}`).toBe('- \\frac{1}{24} - \\frac{1}{6}');
	negativeAMinusB._common_denominator();
	expect(`${negativeAMinusB}`).toBe('- \\frac{1}{24} - \\frac{4}{24}');
	negativeAMinusB._combine_fraction({ verbatim: true });
	expect(`${negativeAMinusB}`).toBe('\\frac{- 1 - 4}{24}');
	negativeAMinusB.simplify({ sum: true, product: true });
	expect(`${negativeAMinusB}`).toBe('\\frac{- 5}{24}');
	negativeAMinusB.simplify();
	expect(`${negativeAMinusB}`).toBe('- \\frac{5}{24}');
	// a + (-b)
	const aPlusNegativeB = sumVerbatim(a, ['()', b.negative()]);
	expect(`${aPlusNegativeB}`).toBe('\\frac{1}{24} + \\left( - \\frac{1}{6} \\right)');
	aPlusNegativeB._remove_brackets();
	expect(`${aPlusNegativeB}`).toBe('\\frac{1}{24} - \\frac{1}{6}');
	aPlusNegativeB._common_denominator();
	expect(`${aPlusNegativeB}`).toBe('\\frac{1}{24} - \\frac{4}{24}');
	aPlusNegativeB._combine_fraction({ verbatim: true });
	expect(`${aPlusNegativeB}`).toBe('\\frac{1 - 4}{24}');
	aPlusNegativeB.simplify({ sum: true, product: true });
	expect(`${aPlusNegativeB}`).toBe('\\frac{- 3}{24}');
	aPlusNegativeB.simplify();
	expect(`${aPlusNegativeB}`).toBe('- \\frac{1}{8}');
	// b - (-c)
	const bMinusNegativeC = sumVerbatim(b, [-1, ['()', c.negative()]]);
	expect(`${bMinusNegativeC}`).toBe('\\frac{1}{6} - \\left( - \\frac{8}{9} \\right)');
	bMinusNegativeC.simplify({ brackets: true, product: true });
	expect(`${bMinusNegativeC}`).toBe('\\frac{1}{6} + \\frac{8}{9}');
	bMinusNegativeC._common_denominator();
	expect(`${bMinusNegativeC}`).toBe('\\frac{3}{18} + \\frac{16}{18}');
	bMinusNegativeC._combine_fraction({ verbatim: true });
	expect(`${bMinusNegativeC}`).toBe('\\frac{3 + 16}{18}');
	bMinusNegativeC.simplify({ sum: true, product: true });
	expect(`${bMinusNegativeC}`).toBe('\\frac{19}{18}');
	bMinusNegativeC.simplify();
	bMinusNegativeC.mixedFractions = true;
	expect(`${bMinusNegativeC}`).toBe('1\\frac{1}{18}');
});
