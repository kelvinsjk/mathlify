import { fraction } from '../../../src/';
import { test, expect } from 'vitest';

test('fraction simplification', () => {
	// a/b
	const five = fraction(10, 2, { verbatim: true });
	expect(`${five}`).toBe('\\frac{10}{2}');
	five.simplify();
	expect(`${five}`).toBe('5');
	const fiveV2 = fraction(10, 2);
	expect(`${fiveV2}`).toBe('5');
	// -a/b.
	const negativeTwoOver10 = fraction(-2, 10, { verbatim: true });
	// TODO: use quotient to tackle
	//expect(`${negativeTwoOver10}`).toBe('\\frac{- 2}{10}');
	negativeTwoOver10.simplify();
	expect(`${negativeTwoOver10}`).toBe('- \\frac{1}{5}');
	// a/-b
	const twoOverNegative10 = fraction(2, -10, { verbatim: true });
	expect(`${twoOverNegative10}`).toBe('\\frac{2}{- 10}');
	twoOverNegative10.simplify();
	expect(`${twoOverNegative10}`).toBe('- \\frac{1}{5}');
	// -a/-b
	const negativeTwoOverNegative10 = fraction(-2, -10, { verbatim: true });
	expect(`${negativeTwoOverNegative10}`).toBe('\\frac{- 2}{- 10}');
	negativeTwoOverNegative10.simplify();
	expect(`${negativeTwoOverNegative10}`).toBe('\\frac{1}{5}');
	// 0 / b
	const zeroOver10 = fraction(0, -10, { verbatim: true });
	expect(`${zeroOver10}`).toBe('\\frac{0}{- 10}');
	zeroOver10.simplify();
	expect(`${zeroOver10}`).toBe('0');
});
