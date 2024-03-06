import { expect, test } from 'vitest';
import { fraction } from '../../../src';

test('fraction simplification', () => {
	const twoQuarters = fraction(2, 4, { verbatim: true });
	expect(`${twoQuarters}`).toBe(`\\frac{2}{4}`);
	expect(`${twoQuarters.simplify()}`).toBe(`\\frac{1}{2}`);

	const threeOverNegative2 = fraction(3, -2, { verbatim: true });
	expect(`${threeOverNegative2}`).toBe(`\\frac{3}{- 2}`);
	expect(`${threeOverNegative2.simplify()}`).toBe(`- \\frac{3}{2}`);
	threeOverNegative2._mixedFractions = true;
	expect(`${threeOverNegative2.simplify()}`).toBe(`- 1\\frac{1}{2}`);
});
