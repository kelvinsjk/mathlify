import { exponent, polynomial, sum } from '../../../src';
import { EquationWorking } from '../../../src/submodules/working';
import { test, expect } from 'vitest';

test('equation factorization', () => {
	const x2MinusXMinus2 = polynomial([1, -1, -2]);
	expect(`${x2MinusXMinus2}`).toBe(`x^2 - x - 2`);
	expect(`${x2MinusXMinus2.factorize.quadratic()}`).toBe(`\\left( x + 1 \\right)\\left( x - 2 \\right)`);

	const x2MinusXMinus2V2 = new EquationWorking(sum(exponent('x', 2), [-1, 'x'], -2));
	expect(`${x2MinusXMinus2V2.factorize.quadratic()}`).toBe(
		`x^2 - x - 2 = 0\n\t\\\\ \\left( x + 1 \\right)\\left( x - 2 \\right) = 0`,
	);

	const x2MinusXMinus2V3 = polynomial([1, -1, -2], { variable: 'y' });
	expect(`${x2MinusXMinus2V3}`).toBe(`y^2 - y - 2`);
	expect(`${x2MinusXMinus2V3.factorize.quadratic()}`).toBe(`\\left( y + 1 \\right)\\left( y - 2 \\right)`);

	const x2MinusXMinus2V4 = new EquationWorking(sum(exponent('y', 2), [-1, 'y'], -2));
	expect(`${x2MinusXMinus2V4.factorize.quadratic()}`).toBe(
		`y^2 - y - 2 = 0\n\t\\\\ \\left( y + 1 \\right)\\left( y - 2 \\right) = 0`,
	);
	const x2MinusXMinus2V5 = new EquationWorking(sum(exponent('y', 2), [-1, 'x'], -2));
	expect(() => x2MinusXMinus2V5.factorize.quadratic()).toThrow();
});
