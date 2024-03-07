import { product, productVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('product constructor and toString method', () => {
	const oneA = product('x', ['x', -1], 1);
	expect(`${oneA}`).toBe(`1`);
	const oneB = productVerbatim('x', ['x', -1], 1);
	expect(`${oneB}`).toBe(`xx^{- 1}\\left( 1 \\right)`);
	oneB.simplify();
	expect(`${oneB}`).toBe(`1`);

	const x = product(['x', 3], ['x', -2]);
	expect(x.node.type).toBe('variable');
});
