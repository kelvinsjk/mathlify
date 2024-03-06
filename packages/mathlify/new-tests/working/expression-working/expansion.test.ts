import { sum, product } from '../../../src';
import { ExpressionWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('expansion working', () => {
	const working1 = new ExpressionWorking(product(5, sum('x', [-2, 'y'])), { lineBreakMode: 'single' });
	working1.expand();
	expect(`${working1}`).toBe(`5\\left( x - 2y \\right) = 5x - 10y`);

	// nested expansion
	const working2 = new ExpressionWorking(sum(product(2, sum([2, 'x'], [3, 'y'])), product(-3, sum('x', 'y'))), {
		lineBreakMode: 'multi',
	});
	working2.expand({ verbatim: true });
	working2.simplify();
	expect(`${working2}`).toBe(
		`2\\left( 2x + 3y \\right) - 3\\left( x + y \\right)\n\t\\\\ = 4x + 6y - 3x - 3y\n\t\\\\ = x + 3y`,
	);
});
