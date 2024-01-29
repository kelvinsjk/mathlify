import { Expression, Fraction, Sum, Numeral, Variable } from '.';
import { test, expect } from 'vitest';

test('expression cloning', () => {
	const x = new Expression('x');
	const x2 = x.clone();
	// @ts-ignore
	x2.expression.name = 'y';
	expect(`${x}`).toBe('x');
	expect(`${x2}`).toBe('y');
});

test('expression simplification', () => {
	// simplification of fraction
	const half = new Fraction(2, 4);
	const halfExp = new Expression(new Sum(half));
	expect(`${halfExp}`).toBe(`\\frac{2}{4}`);
	const halfExp2 = halfExp.clone();
	halfExp.simplify();
	expect(`${halfExp}`).toBe(`\\frac{1}{2}`);
	expect(`${halfExp2}`).toBe(`\\frac{2}{4}`);
	// removal of singleton sums
	const zero = new Expression(new Sum());
	expect(`${zero}`).toBe('0');
	expect(zero.expression instanceof Sum).toBe(true);
	zero.simplify();
	expect(zero.expression instanceof Sum).toBe(false);
	expect(zero.expression instanceof Numeral).toBe(true);
	const x = new Expression(new Sum('x'));
	expect(`${x}`).toBe('x');
	expect(x.expression instanceof Sum).toBe(true);
	x.simplify();
	expect(x.expression instanceof Sum).toBe(false);
	expect(x.expression instanceof Variable).toBe(true);
});

test('brackets', () => {
	const x = new Variable('x');
	const xPlusNegativeOne = new Expression(new Sum(x, Expression.brackets(-1)));
	const exp2 = xPlusNegativeOne.clone();
	expect(`${xPlusNegativeOne}`).toBe(`x + \\left( - 1 \\right)`);
	xPlusNegativeOne.simplify();
	expect(`${xPlusNegativeOne}`).toBe('x - 1');
	x.name = 'y';
	expect(`${xPlusNegativeOne}`).toBe('y - 1');
	expect(`${exp2}`).toBe('x + \\left( - 1 \\right)');
	const twoMinus5 = new Expression(new Sum(2, Expression.brackets(-5)));
	expect(`${twoMinus5}`).toBe(`2 + \\left( - 5 \\right)`);
	twoMinus5._remove_brackets();
	expect(`${twoMinus5}`).toBe(`2 - 5`);
	twoMinus5.simplify();
	expect(`${twoMinus5}`).toBe(`- 3`);
});
