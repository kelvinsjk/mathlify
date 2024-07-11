import { productVerbatim, sum } from '../../../src/';
import { test, expect } from 'vitest';

test('multiply negative integers', () => {
	// a b
	const twoTimes5 = productVerbatim(2, 5);
	twoTimes5._multiplicationSign = ' \\times ';
	expect(`${twoTimes5}`).toBe('2 \\times 5');
	twoTimes5.simplify();
	expect(`${twoTimes5}`).toBe('10');
	const twoPlus5v2 = sum(2, 5);
	expect(`${twoPlus5v2}`).toBe('7');
	// a (-b)
	const twoTimesNegative5 = productVerbatim(2, ['()', -5]);
	twoTimesNegative5._multiplicationSign = ' \\times ';
	expect(`${twoTimesNegative5}`).toBe('2 \\times \\left( - 5 \\right)');
	twoTimesNegative5.simplify();
	expect(`${twoTimesNegative5}`).toBe('- 10');
	// (-a) b
	const negativeTwoTimes5 = productVerbatim(['()', -2], 5);
	negativeTwoTimes5._multiplicationSign = ' \\times ';
	expect(`${negativeTwoTimes5}`).toBe('\\left( - 2 \\right) \\times 5');
	negativeTwoTimes5.simplify();
	expect(`${negativeTwoTimes5}`).toBe('- 10');
	// (-a) (-b)
	const negativeTwoTimesNegative5 = productVerbatim(['()', -2], ['()', -5]);
	negativeTwoTimesNegative5._multiplicationSign = ' \\times ';
	expect(`${negativeTwoTimesNegative5}`).toBe('\\left( - 2 \\right) \\times \\left( - 5 \\right)');
	negativeTwoTimesNegative5.simplify();
	expect(`${negativeTwoTimesNegative5}`).toBe('10');
});
