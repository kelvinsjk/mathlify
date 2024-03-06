import { sum, brackets, sumVerbatim, product, productVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('remove brackets during simplify', () => {
	const sum1 = brackets(sumVerbatim(2, brackets(1)));
	expect(`${sum1}`).toBe(`\\left( 2 + \\left( 1 \\right) \\right)`);
	sum1.simplify();
	expect(`${sum1}`).toBe(`3`);

	const product1 = productVerbatim(2, brackets('x'));
	expect(`${product1}`).toBe(`2\\left( x \\right)`);
	product1.simplify();
	expect(`${product1}`).toBe(`2x`);

	const product2 = productVerbatim(-1, brackets(product(-1, 'x')));
	expect(`${product2}`).toBe(`- \\left( - x \\right)`);
	product2.simplify();
	expect(`${product2}`).toBe(`x`);

	const product3 = productVerbatim(-1, brackets(-1));
	expect(`${product3}`).toBe(`- \\left( - 1 \\right)`);
	product3.simplify();
	expect(`${product3}`).toBe(`1`);
});
