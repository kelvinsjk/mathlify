import { exponent, sum } from '../../../src/';
import { test, expect } from 'vitest';

test('factorize sums', () => {
	const sum1 = sum([9, 'x'], -12);
	expect(`${sum1}`).toBe(`9x - 12`);
	expect(`${sum1.factorize.commonFactor()}`).toBe(`3\\left( 3x - 4 \\right)`);
	expect(`${sum1}`).toBe(`9x - 12`);

	const sum2 = sum([-9, ['x', 2]], [-6, ['x', 3]], [-3, 'x']);
	expect(`${sum2}`).toBe(`- 9x^2 - 6x^3 - 3x`);
	expect(`${sum2.factorize.commonFactor()}`).toBe(`- 3x\\left( 3x + 2x^2 + 1 \\right)`);
	const sum2a = sum('x', ['x', 2]);
	expect(`${sum2a.factorize.commonFactor()}`).toBe(`x\\left( 1 + x \\right)`);
	const sum2b = sum(['x', 2], ['x', 3], 'x');
	expect(`${sum2b.factorize.commonFactor()}`).toBe(`x\\left( x + x^2 + 1 \\right)`);

	const sum3 = sum([2, 'x', sum('x', 'y')], 'x');
	expect(`${sum3}`).toBe(`2x\\left( x + y \\right) + x`);
	expect(`${sum3.factorize.commonFactor({ verbatim: true })}`).toBe(`x\\left( 2\\left( x + y \\right) + 1 \\right)`);
	expect(`${sum3.factorize.commonFactor()}`).toBe(`x\\left( 2x + 2y + 1 \\right)`);

	const sum4 = sum(['x', 'y'], exponent('x', [1, '/', 2]));
	expect(`${sum4}`).toBe(`xy + x^{\\frac{1}{2}}`);
	expect(`${sum4.factorize.commonFactor()}`).toBe(`x^{\\frac{1}{2}}\\left( x^{\\frac{1}{2}}y + 1 \\right)`);
});
