import { Expression, Sum, Variable, Numeral, Fraction } from '../index';
import { test, expect } from 'vitest';

test('sum', () => {
	const y = new Variable('y');
	const xPlusY = new Sum(new Expression('x'), new Expression(y));
	expect(`${xPlusY}`).toBe('x + y');
	const x = new Expression(new Variable('x'));
	const xMinus1 = new Sum(x, new Expression(-1));
	expect(`${xMinus1}`).toBe('x - 1');
	const two = new Numeral(2);
	const xPlus2 = new Sum(new Expression('x'), new Expression(two));
	expect(`${xPlus2}`).toBe('x + 2');
	const zero = new Sum();
	expect(`${zero}`).toBe('0');
	const half = new Fraction(1, 2);
	const halfSum = new Sum(new Expression(new Numeral(half)));
	expect(`${halfSum}`).toBe('\\frac{1}{2}');
});

test('sum simplification', () => {
	// combining numerals, removing 0s
	const x = new Sum(new Expression(1), new Expression('x'), new Expression(2), new Expression(-3));
	expect(`${x}`).toBe('1 + x + 2 - 3');
	x.simplify();
	expect(`${x}`).toBe('x');
	// flattening
	const xPlus3 = new Sum(new Expression('x'), new Expression(3));
	const y = new Sum(new Expression('y'), new Expression(xPlus3));
	expect(y.terms.length).toBe(2);
	y.simplify();
	expect(y.terms.length).toBe(3);
});
