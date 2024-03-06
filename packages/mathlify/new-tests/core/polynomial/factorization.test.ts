import { polynomial } from '../../../src/';
import { test, expect } from 'vitest';

test('polynomial factorization', () => {
	const fourMinus2Y = polynomial([4, -2], { variable: 'y', ascending: true });
	expect(`${fourMinus2Y}`).toBe(`4 - 2y`);
	expect(`${fourMinus2Y.factorize.commonFactor()}`).toBe(`2\\left( 2 - y \\right)`);

	const x2MinusXMinus2 = polynomial([1, -1, -2]);
	expect(`${x2MinusXMinus2}`).toBe(`x^2 - x - 2`);
	expect(`${x2MinusXMinus2.factorize.quadratic()}`).toBe(`\\left( x + 1 \\right)\\left( x - 2 \\right)`);

	//TODO: handle the case of -x^4 - x^2. currently gives (-x^2)(x^2 + 1). we want -x^2(x^2 + 1)
	const x4MinusX2 = polynomial([1, 0, -1, 0, 0]);
	expect(`${x4MinusX2}`).toBe(`x^4 - x^2`);
	expect(`${x4MinusX2.factorize.commonFactor()}`).toBe(`x^2\\left( x^2 - 1 \\right)`);

	const minusX2MinusXMinus2 = polynomial([-1, -1, -2]);
	expect(`${minusX2MinusXMinus2}`).toBe(`- x^2 - x - 2`);
	expect(`${minusX2MinusXMinus2.factorize.commonFactor()}`).toBe(`- \\left( x^2 + x + 2 \\right)`);
});
