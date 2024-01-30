import { Product } from '.';
import { Sum } from '../sum';
//import { Variable } from '../variable';
//import { Numeral, Fraction } from '../numeral';
import { Expression } from '..';

import { test, expect } from 'vitest';

test('product', () => {
	const one = new Product();
	expect(`${one}`).toBe('1');
	const one2 = new Product(1);
	expect(`${one2}`).toBe('1');
	const negativeX = new Product(-1, 'x');
	expect(`${negativeX}`).toBe('- x');
	const negX = new Expression(negativeX);
	negX.multiplicationSign = ' \\times ';
	expect(`${negX}`).toBe('- 1 \\times x');
	negativeX.simplify();
	expect(`${negativeX}`).toBe('- x');
	const xPlusY = new Sum('x', 'y');
	const negativeXPlusY = new Product(xPlusY, -1);
	negativeXPlusY.simplify();
	expect(`${negativeXPlusY}`).toBe('- \\left( x + y \\right)');
	const sum = new Sum(1, negativeX);
	expect(`${sum}`).toBe('1 - x');
});

test('product simplification', () => {
	const sixXY = new Product('x', 2, new Product('y', 3));
	expect(`${sixXY}`).toBe('x2y3');
	const sixXY2 = sixXY.clone();
	expect(sixXY2.factors.length).toBe(3);
	sixXY2._flatten();
	expect(sixXY2.factors.length).toBe(4);
	sixXY.simplify();
	expect(`${sixXY}`).toBe('6xy');
	expect(sixXY.factors.length).toBe(2);
	const sixXYPlus2 = new Sum(sixXY, 2);
	sixXYPlus2.simplify();
	expect(`${sixXYPlus2}`).toBe('6xy + 2');
});
