import { sum, fraction } from '../../../src';
import { ExpressionWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('sub in expression working', () => {
	const x = 1;
	const y = fraction(1, 2);
	const z: [number, '/', number] = [-2, '/', 3];

	const working1 = new ExpressionWorking(sum('x', [2, 'y']));
	working1.subIn({ x, y }, { verbatim: true });
	working1.simplify();
	expect(`${working1}`).toBe(`& x + 2y\n\t\\\\ &= 1 + 2\\left( \\frac{1}{2} \\right)\n\t\\\\ &= 2`);

	const working2 = new ExpressionWorking(sum([2, 'z'], [-3, 'x']));
	working2.subIn({ x, z });
	expect(`${working2}`).toBe(`& 2z - 3x\n\t\\\\ &= - \\frac{13}{3}`);
});
