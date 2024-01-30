import { sum, sumVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('add/subtract negative integers', () => {
	// a + b
	const twoPlus5 = sumVerbatim(2, 5);
	expect(`${twoPlus5}`).toBe('2 + 5');
	twoPlus5.simplify();
	expect(`${twoPlus5}`).toBe('7');
	const twoPlus5v2 = sum(2, 5);
	expect(`${twoPlus5v2}`).toBe('7');
	// a - b
	const twoMinus5 = sumVerbatim(2, -5);
	expect(`${twoMinus5}`).toBe('2 - 5');
	twoMinus5.simplify();
	expect(`${twoMinus5}`).toBe('- 3');
	// -a + b
	const negativeTwoPlus5 = sumVerbatim(-2, 5);
	expect(`${negativeTwoPlus5}`).toBe('- 2 + 5');
	negativeTwoPlus5.simplify();
	expect(`${negativeTwoPlus5}`).toBe('3');
	// -a - b
	const negativeTwoMinus5 = sumVerbatim(-2, -5);
	expect(`${negativeTwoMinus5}`).toBe('- 2 - 5');
	negativeTwoMinus5.simplify();
	expect(`${negativeTwoMinus5}`).toBe('- 7');
	// a + (-b)
	const twoPlusNegative5 = sumVerbatim(2, ['()', -5]);
	expect(`${twoPlusNegative5}`).toBe('2 + \\left( - 5 \\right)');
	twoPlusNegative5._remove_brackets();
	expect(`${twoPlusNegative5}`).toBe('2 - 5');
	twoPlusNegative5.simplify();
	expect(`${twoPlusNegative5}`).toBe('- 3');
	// (-a) + (-b)
	const negativeTwoPlusNegative5 = sumVerbatim(['()', -2], ['()', -5]);
	expect(`${negativeTwoPlusNegative5}`).toBe('\\left( - 2 \\right) + \\left( - 5 \\right)');
	negativeTwoPlusNegative5._remove_brackets();
	expect(`${negativeTwoPlusNegative5}`).toBe('- 2 - 5');
	negativeTwoPlusNegative5.simplify();
	expect(`${negativeTwoPlusNegative5}`).toBe('- 7');
	// a - (-b)
	const twoMinusNegative5 = sumVerbatim(2, [-1, ['()', -5]]);
	expect(`${twoMinusNegative5}`).toBe('2 - \\left( - 5 \\right)');
	twoMinusNegative5._remove_brackets();
	twoMinusNegative5.simplify({ product: true });
	expect(`${twoMinusNegative5}`).toBe('2 + 5');
	twoMinusNegative5.simplify();
	expect(`${twoMinusNegative5}`).toBe('7');
	// (-a) - (-b)
	const negativeTwoMinusNegative5 = sumVerbatim(['()', -2], [-1, ['()', -5]]);
	expect(`${negativeTwoMinusNegative5}`).toBe('\\left( - 2 \\right) - \\left( - 5 \\right)');
	negativeTwoMinusNegative5._remove_brackets();
	negativeTwoMinusNegative5.simplify({ product: true });
	expect(`${negativeTwoMinusNegative5}`).toBe('- 2 + 5');
	negativeTwoMinusNegative5.simplify();
	expect(`${negativeTwoMinusNegative5}`).toBe('3');
});
