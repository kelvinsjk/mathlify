import { productVerbatim, exponent, type Exponent, type Product } from '../../../src';
import { test, expect } from 'vitest';

test('bracket shorthand', () => {
	expect(`${productVerbatim(2, ['()', 'x'])}`).toBe(`2\\left( x \\right)`);
	const eX = exponent(['()', 'e'], 'x', { verbatim: true });
	expect(`${eX}`).toBe(`\\left( e \\right)^x`);
	expect(`${eX.simplify()}`).toBe(`e^x`);
});

test('negative shorthand', () => {
	const negative2X = productVerbatim(2, ['-', 'x']);
	expect(`${negative2X}`).toBe(`2\\left( - x \\right)`);
	expect(`${negative2X.simplify()}`).toBe(`- 2x`);

	const exp_negativeX = exponent('e', ['-', 'x']);
	expect(`${exp_negativeX}`).toBe(`e^{- x}`);
	const node = exp_negativeX.node as Exponent;
	const power = node.power as Product;
	expect(power.type).toBe('product');
	expect(power.coeff.valueOf()).toBe(-1);
});
