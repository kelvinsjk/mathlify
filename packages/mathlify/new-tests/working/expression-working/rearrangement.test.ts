import { sumVerbatim } from '../../../src/';
import { ExpressionWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('rearranging terms in working', () => {
	const working1 = new ExpressionWorking(sumVerbatim('x', -2, [3, 'y'], [2, 'x'], [-1, 'y'], 5));
	working1.rearrange([0, 3, 2, 4, 1, 5]);
	working1.simplify();
	expect(`${working1}`).toBe(`& x - 2 + 3y + 2x - y + 5\n\t\\\\ &= x + 2x + 3y - y - 2 + 5\n\t\\\\ &= 3x + 2y + 3`);
});
