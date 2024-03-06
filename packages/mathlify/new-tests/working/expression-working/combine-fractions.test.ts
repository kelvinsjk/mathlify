import { product, sum } from '../../../src/';
import { ExpressionWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('combine fractions', () => {
	const working1 = new ExpressionWorking(sum(1, [2, '/', 'x']));
	working1.combineFraction();
	expect(`${working1}`).toBe(`& 1 + \\frac{2}{x}\n\t\\\\ &= \\frac{x + 2}{x}`);

	const working2 = new ExpressionWorking(sum([5, '/', 12], [-1, ['x', '/', 9]], [-3, 'x']), { startOnFirstLine: true });
	working2.combineFraction({ steps: true });
	expect(`${working2}`).toBe(
		`\\frac{5}{12} - \\frac{x}{9} - 3x &= \\frac{15}{36} - \\frac{4x}{36} - \\frac{108x}{36}\n\t\\\\ &= \\frac{15 - 4x - 108x}{36}\n\t\\\\ &= \\frac{15 - 112x}{36}`,
	);

	const working3 = new ExpressionWorking(sum([product(2, 'x'), '/', 3], [-1, ['x', '/', 6]]));
	working3.combineFraction({ steps: true });
	expect(`${working3}`).toBe(
		`& \\frac{2x}{3} - \\frac{x}{6}\n\t\\\\ &= \\frac{4x}{6} - \\frac{x}{6}\n\t\\\\ &= \\frac{4x - x}{6}\n\t\\\\ &= \\frac{3x}{6}\n\t\\\\ &= \\frac{x}{2}`,
	);

	const working4 = new ExpressionWorking(sum([product(2, 'x'), '/', 3], ['x', '/', 3]));
	working4.combineFraction({ steps: true });
	expect(`${working4}`).toBe(
		`& \\frac{2x}{3} + \\frac{x}{3}\n\t\\\\ &= \\frac{2x + x}{3}\n\t\\\\ &= \\frac{3x}{3}\n\t\\\\ &= x`,
	);
});
