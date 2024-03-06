import { sum, product, productVerbatim, exponent } from '../../../src';
import { test, expect } from 'vitest';

test('expansion', () => {
	const exp1 = product(5, sum('x', [-2, 'y']));
	expect(`${exp1}`).toBe(`5\\left( x - 2y \\right)`);
	const expanded1 = exp1.expand();
	expect(`${expanded1}`).toBe(`5x - 10y`);
	expect(`${exp1}`).toBe(`5\\left( x - 2y \\right)`);

	const exp2 = product('x', sum([3, 'x'], 'y', -2));
	expect(`${exp2}`).toBe(`x\\left( 3x + y - 2 \\right)`);
	expect(`${exp2.expand()}`).toBe(`3x^2 + xy - 2x`);

	const exp3 = productVerbatim(3, 'x', 'y', 'x');
	expect(`${exp3}`).toBe(`3xyx`);
	expect(`${exp3.simplify()}`).toBe(`3x^2y`);
});

test('nested expansion', () => {
	const exp1 = sum(product(2, sum([2, 'x'], [3, 'y'])), product(-3, sum('x', 'y')));
	expect(`${exp1}`).toBe(`2\\left( 2x + 3y \\right) - 3\\left( x + y \\right)`);
	expect(`${exp1.expand({ verbatim: true })}`).toBe(`4x + 6y - 3x - 3y`);
	expect(`${exp1.expand()}`).toBe(`x + 3y`);
});

test('expansion of exponents', () => {
	const twoX_squared = exponent(sum('x', 1), 2);
	expect(`${twoX_squared}`).toBe(`\\left( x + 1 \\right)^2`);
	expect(`${twoX_squared.expand()}`).toBe(`x^2 + 2x + 1`);
});
