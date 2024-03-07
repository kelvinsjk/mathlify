import { Exponent, Expression, Product, Sum } from '../index';

import { test, expect } from 'vitest';

test('product', () => {
	const one = new Product();
	expect(`${one}`).toBe('1');
	const one2 = new Product(new Expression(1));
	expect(`${one2}`).toBe('1');
	const negativeX = new Product(-1, new Expression('x'));
	expect(`${negativeX}`).toBe('- x');
	const negX = new Expression(negativeX);
	negX._multiplicationSign = ' \\times ';
	expect(`${negX}`).toBe('- 1 \\times x');
	negativeX.simplify();
	expect(`${negativeX}`).toBe('- x');
	const xPlusY = new Sum(new Expression('x'), new Expression('y'));
	const negativeXPlusY = new Product(new Expression(xPlusY), new Expression(-1)).simplify();
	negativeXPlusY.simplify();
	expect(`${negativeXPlusY}`).toBe('- \\left( x + y \\right)');
	const sum = new Sum(new Expression(1), new Expression(negativeX));
	expect(`${sum}`).toBe('1 - x');
});

test('product simplification', () => {
	const sixXY = new Product(
		new Expression('x'),
		new Expression(2),
		new Expression(new Product(new Expression('y'), new Expression(3))),
	);
	expect(`${sixXY}`).toBe('x\\left( 2 \\right)y\\left( 3 \\right)');
	const sixXY2 = sixXY.clone();
	expect(sixXY2.factors.length).toBe(3);
	sixXY2._flatten();
	expect(sixXY2.factors.length).toBe(4);
	sixXY.simplify();
	expect(`${sixXY}`).toBe('6xy');
	expect(sixXY.factors.length).toBe(2);
	const sixXYPlus2 = new Sum(new Expression(sixXY), new Expression(2));
	sixXYPlus2.simplify();
	expect(`${sixXYPlus2}`).toBe('6xy + 2');

	const x = new Expression(
		new Product(
			new Expression(new Exponent(new Expression('x'), new Expression(2))),
			new Expression('y'),
			new Expression(new Exponent(new Expression('x'), new Expression(-1))),
			new Expression(new Exponent(new Expression('y'), new Expression(-1))),
		),
	);
	expect(`${x}`).toBe('x^2yx^{- 1}y^{- 1}');
	const y = x.simplify();
	expect(`${x}`).toBe('x');
	expect(`${y}`).toBe('x');
});
