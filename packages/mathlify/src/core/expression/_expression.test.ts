import { Expression, Fraction, Sum, Numeral, Variable, Product, Quotient, Exponent, Fn, Brackets } from '.';
import { test, expect } from 'vitest';
//import { to_Expression } from './utils';
//import { brackets } from '../../macros';

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
	expect(`${half}`).toBe(`\\frac{2}{4}`);
	//const halfSum = new Sum(new Expression(new Numeral(half)));
	//expect(`${halfSum}`).toBe(`\\frac{2}{4}`);
	//const halfExp = new Expression(new Sum(new Expression(new Numeral(half))));
	//expect(`${halfExp}`).toBe(`\\frac{2}{4}`);
	//const halfExp2 = halfExp.clone();
	//halfExp.simplify();
	//expect(`${halfExp}`).toBe(`\\frac{1}{2}`);
	//expect(`${halfExp2}`).toBe(`\\frac{2}{4}`);
	// removal of singleton sums
	const zero = new Expression(new Sum());
	expect(`${zero}`).toBe('0');
	expect(zero.expression instanceof Sum).toBe(true);
	zero.simplify();
	expect(zero.expression instanceof Sum).toBe(false);
	expect(zero.expression instanceof Numeral).toBe(true);
	const x = new Expression(new Sum(new Expression('x')));
	expect(`${x}`).toBe('x');
	expect(x.expression instanceof Sum).toBe(true);
	x.simplify();
	expect(x.expression instanceof Sum).toBe(false);
	expect(x.expression instanceof Variable).toBe(true);
	const y = new Expression(new Product(new Expression('y')));
	expect(y.expression instanceof Product).toBe(true);
	y.simplify();
	expect(y.expression instanceof Product).toBe(false);
	expect(y.expression instanceof Variable).toBe(true);
	// simplification of quotient
	const zero2 = new Expression(new Quotient(new Expression(0), new Expression('x')));
	expect(`${zero2}`).toBe('\\frac{0}{x}');
	expect(zero2.expression instanceof Quotient).toBe(true);
	zero2.simplify();
	expect(`${zero2}`).toBe('0');
	expect(zero2.expression instanceof Quotient).toBe(false);
	expect(zero2.expression instanceof Numeral).toBe(true);
	const x2 = new Expression(new Quotient(new Expression('x'), new Expression(1)));
	expect(`${x2}`).toBe('\\frac{x}{1}');
	expect(x2.expression instanceof Quotient).toBe(true);
	x2.simplify();
	expect(x2.expression instanceof Quotient).toBe(false);
	expect(x2.expression instanceof Variable).toBe(true);
});

test('brackets', () => {
	const x = new Variable('x');
	const xPlusNegativeOne = new Expression(
		new Sum(new Expression(x), new Expression(new Fn(new Brackets(new Expression(-1))))),
	);
	const exp2 = xPlusNegativeOne.clone();
	expect(`${xPlusNegativeOne}`).toBe(`x + \\left( - 1 \\right)`);
	xPlusNegativeOne.simplify();
	expect(`${xPlusNegativeOne}`).toBe('x - 1');
	x.name = 'y';
	expect(`${xPlusNegativeOne}`).toBe('y - 1');
	expect(`${exp2}`).toBe('x + \\left( - 1 \\right)');
	const twoMinus5 = new Expression(
		new Sum(new Expression(2), new Expression(new Fn(new Brackets(new Expression(-5))))),
	);
	expect(`${twoMinus5}`).toBe(`2 + \\left( - 5 \\right)`);
	twoMinus5._remove_brackets();
	expect(`${twoMinus5}`).toBe(`2 - 5`);
	twoMinus5.simplify();
	expect(`${twoMinus5}`).toBe(`- 3`);
	//const exp = new Expression(new Brackets(5));
	//expect(`${exp}`).toBe(`\\left( 5 \\right)`);
});

import { denominator_lcm } from './utils/gcd-lcm';
test('expression lcm', () => {
	expect(() => denominator_lcm()).toThrow();
	const half = new Expression(new Numeral(new Fraction(1, 2)));
	expect(() => half._common_denominator()).toThrow();
	expect(() => half._combine_fraction()).toThrow();
	const xOver3 = new Expression(new Numeral(new Fraction(2, 3)));
	const negative1_10 = new Expression(new Numeral(new Fraction(-1, 10)));
	expect(denominator_lcm(half, xOver3, negative1_10).toString()).toBe('30');
	const y = new Expression('y');
	const sum = new Expression(new Sum(negative1_10, y));
	sum.combine_fraction();
	expect(`${sum}`).toBe('\\frac{- 1 + 10y}{10}');
	const sum2 = new Expression(new Sum(y, negative1_10));
	sum2.combine_fraction();
	expect(`${sum2}`).toBe('\\frac{10y - 1}{10}');
	const xz = new Expression(new Product(new Expression('x'), new Expression('z')));
	const yPlusXZ = new Expression(new Sum(new Expression('y'), xz, half));
	yPlusXZ.combine_fraction();
	expect(`${yPlusXZ}`).toBe('\\frac{2y + 2xz + 1}{2}');
	const sum3 = new Expression(new Sum(half, y));
	sum3.combine_fraction();
	expect(`${sum3}`).toBe('\\frac{1 + 2y}{2}');
	expect(`${denominator_lcm(y)}`).toBe('1');

	const sum4 = new Expression(new Sum(new Expression('x'), new Expression('y')));
	sum4._common_denominator();
	expect(`${sum4}`).toBe('x + y');
	sum4.combine_fraction();
	expect(sum4.toString()).toBe('x + y');
});

test('expression arithmetic', () => {
	const xy = new Expression(new Product(new Expression('x'), new Expression('y')));
	expect(`${xy}`).toBe('xy');
	expect(`${xy.negative()}`).toBe('- xy');
	const q = new Expression(new Quotient(new Expression('x'), new Expression('y')));
	expect(() => q.negative()).toThrow();
});

test('lexical string', () => {
	const xPlusY = new Sum(
		new Expression('x'),
		new Expression(new Fn(new Brackets(new Expression('z')))),
		new Expression('y'),
	);
	const yPlusX = new Sum(
		new Expression('y'),
		new Expression('x'),
		new Expression(new Fn(new Brackets(new Expression('z')))),
	);
	const xy = new Product(new Expression('x'), new Expression('y'));
	const yx = new Product(new Expression('y'), new Expression('x'));
	const q1 = new Expression(new Quotient(new Expression(xPlusY), new Expression(xy)));
	const q2 = new Expression(new Quotient(new Expression(yPlusX), new Expression(yx)));
	expect(q1._to_lexical_string()).toBe('((z)+x+y)/(1x*y)');
	expect(q1._to_lexical_string()).toBe(q2._to_lexical_string());
});

test('expansion', () => {
	const sum = new Expression(new Sum(new Expression('x'), new Expression('y')));
	sum._expand_product();
	expect(`${sum}`).toBe('x + y');
});

test('simplify exponent', () => {
	let q = new Expression(
		new Product(
			2,
			new Expression('x'),
			new Expression(new Exponent(new Expression('x'), new Expression(2))),
			new Expression(new Exponent(new Expression('y'), new Expression(0))),
			new Expression(new Exponent(new Expression(new Numeral(new Fraction(2, 3))), new Expression(-2))),
			new Expression(
				new Exponent(new Expression(new Sum(new Expression('x'), new Expression('y'))), new Expression(1)),
			),
		),
	);
	expect(`${q}`).toBe('2xx^2y^0\\frac{2}{3}^{- 2}\\left( x + y \\right)^1');
	q.simplify();
	expect(`${q}`).toBe('\\frac{9}{2}x^3\\left( x + y \\right)');
});

test('expression gcd/lcm', () => {
	const sixX2YZ2 = new Expression(
		new Product(
			new Expression(6),
			new Expression(new Exponent(new Expression('x'), new Expression(2))),
			new Expression('y'),
			new Expression(new Exponent(new Expression('z'), new Expression(2))),
		),
	).simplify();
	const tenZ3X = new Expression(
		new Product(
			new Expression(10),
			new Expression(new Exponent(new Expression('z'), new Expression(3))),
			new Expression('x'),
		),
	).simplify();
	const gcd = Expression.gcd(sixX2YZ2, tenZ3X);
	expect(`${gcd}`).toBe('2xz^2');
	const lcm = Expression.lcm(sixX2YZ2, tenZ3X);
	expect(`${lcm}`).toBe('30x^2yz^3');
	const a2b = new Expression(
		new Product(new Expression(new Exponent(new Expression('a'), new Expression(2))), new Expression('b')),
	);
	expect(`${Expression.lcm(sixX2YZ2, a2b)}`).toBe('6x^2yz^2a^2b');

	const eX = new Expression(new Exponent(new Expression('e'), new Expression('x')));
	expect(`${Expression.gcd(eX, sixX2YZ2)}`).toBe('1');

	const x = new Expression('x');
	const x2 = new Expression(new Exponent(new Expression('x'), new Expression(2)));
	const xHalf = new Expression(new Exponent(new Expression('x'), new Expression(new Numeral(new Fraction(1, 2)))));
	const x3 = new Expression(new Exponent(new Expression('x'), new Expression(3)));
	const w4 = new Expression(new Exponent(new Expression('w'), new Expression(4)));
	const y = new Expression('y');
	const xY = new Expression(new Exponent(new Expression('x'), new Expression('y')));
	const first = new Exponent(new Expression('x'), new Expression('y'));
	const second = new Exponent(new Expression(first), new Expression(3));
	const xSuperPower = new Expression(second);
	expect(`${Expression.lcm(x2, x3)}`).toBe('x^3');
	expect(`${Expression.gcd(x2, x3)}`).toBe('x^2');
	expect(`${Expression.gcd(x2, w4)}`).toBe('1');
	expect(`${Expression.gcd(x2, sixX2YZ2)}`).toBe('x^2');
	expect(`${Expression.lcm(x3, sixX2YZ2)}`).toBe('6x^3yz^2');
	expect(`${Expression.gcd(sixX2YZ2, w4)}`).toBe('1');
	expect(`${xSuperPower}`).toBe('x^y^3');
	expect(`${Expression.gcd(xSuperPower, xY)}`).toBe('x^y');
	expect(`${Expression.gcd(xSuperPower, y)}`).toBe('1');
	const xPlusY = new Expression(new Sum(new Expression('x'), new Expression('y')));
	const yPlusX = new Expression(new Sum(new Expression('y'), new Expression('x')));
	expect(`${Expression.gcd(xPlusY, yPlusX)}`).toBe('x + y');
	expect(`${Expression.gcd(xPlusY, y)}`).toBe('1');
	const two = new Expression(2);
	expect(`${Expression.gcd(sixX2YZ2, two)}`).toBe('2');
	expect(`${Expression.lcm(sixX2YZ2, two)}`).toBe('6x^2yz^2');
	const threeYPlusX = new Expression(new Product(new Expression(3), yPlusX));
	const threeYPlusX2 = new Expression(
		new Product(new Expression(3), new Expression(new Exponent(yPlusX, new Expression(2)))),
	);
	expect(`${Expression.gcd(threeYPlusX2, xPlusY)}`).toBe('x + y');
	expect(`${Expression.gcd(threeYPlusX, xPlusY)}`).toBe('x + y');
	expect(`${Expression.gcd(threeYPlusX, y)}`).toBe('1');
	expect(`${Expression.lcm(threeYPlusX, xPlusY)}`).toBe('3\\left( y + x \\right)');
	expect(`${Expression.lcm(threeYPlusX, x2)}`).toBe('3\\left( y + x \\right)x^2');
	expect(`${Expression.lcm(x2, w4)}`).toBe('x^2w^4');
	expect(`${Expression.lcm(x2, x)}`).toBe('x^2');
	expect(`${Expression.lcm(xHalf, x)}`).toBe('x');
	expect(`${Expression.lcm(y, x2)}`).toBe('x^2y');
	expect(`${Expression.lcm(xPlusY, y)}`).toBe('\\left( x + y \\right)y');
});

test('factorize', () => {
	let exp = new Expression(
		new Sum(
			new Expression(new Product(new Expression(3), new Expression('x')).simplify()),
			new Expression(6),
			new Expression(new Product(new Expression(-12), new Expression('y')).simplify()),
		),
	);
	exp.factorize();
	expect(`${exp}`).toBe('3\\left( x + 2 - 4y \\right)');
});
