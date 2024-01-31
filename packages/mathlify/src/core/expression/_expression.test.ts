import { Expression, Fraction, Sum, Numeral, Variable, Product, Quotient } from '.';
import { test, expect } from 'vitest';
import { Brackets } from './fn';
import { e } from 'vitest/dist/reporters-1evA5lom';

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
	const y = new Expression(new Product('y'));
	expect(y.expression instanceof Product).toBe(true);
	y.simplify();
	expect(y.expression instanceof Product).toBe(false);
	expect(y.expression instanceof Variable).toBe(true);
	// simplification of quotient
	const zero2 = new Expression(new Quotient(0, 'x'));
	expect(`${zero2}`).toBe('\\frac{0}{x}');
	expect(zero2.expression instanceof Quotient).toBe(true);
	zero2.simplify();
	expect(`${zero2}`).toBe('0');
	expect(zero2.expression instanceof Quotient).toBe(false);
	expect(zero2.expression instanceof Numeral).toBe(true);
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

test('expression lcm', () => {
	expect(() => Expression.denominator_lcm()).toThrow();
	const half = new Expression(new Fraction(1, 2));
	expect(() => half._common_denominator()).toThrow();
	expect(() => half._combine_fraction()).toThrow();
	const xOver3 = new Expression(new Fraction(2, 3));
	const negative1_10 = new Expression(new Product(-1, new Fraction(1, 10)));
	expect(Expression.denominator_lcm(half, xOver3, negative1_10).toString()).toBe('30');
	const y = new Expression('y');
	const sum = new Expression(new Sum(negative1_10, y));
	sum.combine_fraction();
	expect(`${sum}`).toBe('\\frac{- 1 + 10y}{10}');
	const sum2 = new Expression(new Sum(y, negative1_10));
	sum2.combine_fraction();
	expect(`${sum2}`).toBe('\\frac{10y - 1}{10}');
	const xz = new Expression(new Product('x', 'z'));
	const yPlusXZ = new Expression(new Sum('y', xz, half));
	yPlusXZ.combine_fraction();
	expect(`${yPlusXZ}`).toBe('\\frac{2y + 2xz + 1}{2}');
	const sum3 = new Expression(new Sum(half, y));
	sum3.combine_fraction();
	expect(`${sum3}`).toBe('\\frac{1 + 2y}{2}');
	expect(`${Expression.denominator_lcm(y)}`).toBe('1');
});

test('expression arithmetic', () => {
	const xy = new Expression(new Product('x', 'y'));
	expect(`${xy}`).toBe('xy');
	expect(`${xy.negative()}`).toBe('- xy');
	const q = new Expression(new Quotient('x', 'y'));
	expect(() => q.negative()).toThrow();
});
