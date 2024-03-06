import { sum } from '../../../src';
import { ExpressionWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('factorization of common factor: working', () => {
	const working1 = new ExpressionWorking(sum([-9, ['x', 2]], [-3, 'x']));
	working1.factorize.commonFactor();
	expect(`${working1}`).toBe(`& - 9x^2 - 3x\n\t\\\\ &= - 3x\\left( 3x + 1 \\right)`);

	// two-steps: factorize, then expand and simplify inner factor
	const working2 = new ExpressionWorking(sum([2, 'x', sum('x', 'y')], 'x'));
	working2.factorize.commonFactor();
	expect(`${working2}`).toBe(
		`& 2x\\left( x + y \\right) + x
	\\\\ &= x\\left( 2\\left( x + y \\right) + 1 \\right)
	\\\\ &= x\\left( 2x + 2y + 1 \\right)`,
	);
});

//TODO: quadratic factorization
//TODO: factorization by grouping
