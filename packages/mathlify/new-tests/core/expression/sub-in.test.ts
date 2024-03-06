import { sum, product, quotient, exponent, fraction, brackets } from '../../../src/';
import { test, expect } from 'vitest';

test('sub in method for expressions', () => {
	const x = 1;
	const y = fraction(1, 2);
	const z: [number, '/', number] = [-2, '/', 3];

	const expSum = sum('x', [2, 'y']);
	expect(`${expSum}`).toBe(`x + 2y`);
	expect(`${expSum.subIn({ x, y })}`).toBe(`2`);
	const expDiff = sum([2, 'z'], [-3, 'x']);
	expect(`${expDiff}`).toBe(`2z - 3x`);
	expect(`${expDiff.subIn({ x, z })}`).toBe(`- \\frac{13}{3}`);
	const expProd = product(2, 'x', ['y', 2]);
	expect(`${expProd}`).toBe(`2xy^2`);
	expect(`${expProd.subIn({ y })}`).toBe(`\\frac{1}{2}x`);
	const expQuot = quotient(product('x', 'y'), 'z');
	expect(`${expQuot}`).toBe(`\\frac{xy}{z}`);
	expect(`${expQuot.subIn({ x, y, z })}`).toBe(`- \\frac{3}{4}`);
	const expExp = sum(exponent('x', 2), exponent(2, 'x'));
	expect(`${expExp}`).toBe(`x^2 + 2^x`);
	expect(`${expExp.subIn({ x })}`).toBe(`3`);
	const expBrackets = brackets('x');
	expect(`${expBrackets}`).toBe(`\\left( x \\right)`);
	const bracketed2 = expBrackets.subIn({ x: 2 }, { verbatim: true });
	expect(`${bracketed2}`).toBe(`\\left( 2 \\right)`);
	const simplifiedClone = expBrackets.clone().simplify();
	expect(`${expBrackets}`).toBe(`\\left( x \\right)`);
	expect(`${simplifiedClone}`).toBe(`x`);
});
