import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Polynomial } from '../index';

const polynomialClass = suite('Polynomial class');

const oneHalf = new Fraction(1, 2);
const onePlus2xPlus3x2 = new Polynomial([1, 2, 3], { ascending: true });
const x2Plus2xMinus3 = new Polynomial([1, 2, -3]);
const x2Plus2xMinus3V2 = new Polynomial([0, 1, 2, -3]);
const halfYPlus1 = new Polynomial([oneHalf, 1], { variable: 'y' });
const x2Plus2x3Plus3x5 = new Polynomial([1, 2, 0, 3], { ascending: true, degree: 5 });
const x4Plus2x3Minus3x2 = new Polynomial([1, 2, -3], { degree: 4 });
const x2 = new Polynomial([1, 0, 0]);

polynomialClass('toString', () => {
	assert.throws(() => {
		new Polynomial([1, 2, 3], { degree: 1 });
	});
	assert.is(`${onePlus2xPlus3x2}`, '1 + 2 x + 3 x^2');
	assert.is(`${x2Plus2xMinus3}`, 'x^2 + 2 x - 3');
	assert.is(`${x2Plus2xMinus3V2}`, 'x^2 + 2 x - 3');
	assert.is(x2Plus2xMinus3.degree, 2);
	assert.is(`${halfYPlus1}`, '\\frac{1}{2} y + 1');
	assert.is(`${x2Plus2x3Plus3x5}`, 'x^2 + 2 x^3 + 3 x^5');
	assert.is(`${x4Plus2x3Minus3x2}`, 'x^4 + 2 x^3 - 3 x^2');
});

polynomialClass('substitute', () => {
	assert.ok(x2Plus2xMinus3.subIn(1).isEqualTo(0));
	assert.is(x2.subIn(2).isEqualTo(4), true);
	assert.ok(x2Plus2xMinus3.subIn(2).isEqualTo(5));
	assert.is(`${x2Plus2xMinus3.replaceXWith('y')}`, 'y^2 + 2 y - 3');
	assert.is(`${x2Plus2xMinus3.replaceXWith(new Polynomial([1, 1]))}`, 'x^2 + 4 x');
	assert.is(`${onePlus2xPlus3x2.replaceXWith(new Polynomial([2, -1]))}`, '2 - 8 x + 12 x^2');
});

polynomialClass('arithmetic', () => {
	assert.is(`${x2Plus2xMinus3.plus(3)}`, 'x^2 + 2 x');
	assert.is(`${x2Plus2xMinus3.negative()}`, '- x^2 - 2 x + 3');
	assert.is(`${x2Plus2xMinus3.plus('x')}`, 'x^2 + 3 x - 3');
	assert.is(`${x2Plus2xMinus3.plus(oneHalf)}`, 'x^2 + 2 x - \\frac{5}{2}');
	assert.is(`${x2Plus2xMinus3.times(2)}`, '2 x^2 + 4 x - 6');
	assert.is(`${x2Plus2xMinus3.divide(2)}`, '\\frac{1}{2} x^2 + x - \\frac{3}{2}');
	assert.is(`${x4Plus2x3Minus3x2.minus(x2Plus2xMinus3)}`, 'x^4 + 2 x^3 - 4 x^2 - 2 x + 3');
	assert.is(`${x4Plus2x3Minus3x2.times(x2Plus2xMinus3)}`, 'x^6 + 4 x^5 - 2 x^4 - 12 x^3 + 9 x^2');
	assert.is(`${halfYPlus1.square()}`, '\\frac{1}{4} y^2 + y + 1');
	assert.throws(() => halfYPlus1.pow(-1));
});

polynomialClass('clone', () => {
	const newX2Plus2xMinus3 = x2Plus2xMinus3.clone();
	assert.is(`${newX2Plus2xMinus3}`, 'x^2 + 2 x - 3');
	newX2Plus2xMinus3.ascending = true;
	assert.ok(newX2Plus2xMinus3.ascending);
	assert.not.ok(x2Plus2xMinus3.ascending);
	const newOnePlus2xPlus3x2 = onePlus2xPlus3x2.clone();
	newOnePlus2xPlus3x2.variable = 'y';
	assert.is(onePlus2xPlus3x2.variable, 'x');
	assert.is(newOnePlus2xPlus3x2.variable, 'y');
});

polynomialClass('reverse', () => {
	const array = [1, 2];
	assert.is(array[0], 1);
	const xPlus2 = new Polynomial(array);
	assert.is(`${xPlus2}`, 'x + 2');
	assert.is(`${xPlus2.changeAscending()}`, '2 + x');
	assert.is(array[0], 1);
	assert.is(`${xPlus2}`, '2 + x');
	assert.is(`${xPlus2.changeAscending(true)}`, '2 + x');
});

polynomialClass.run();
