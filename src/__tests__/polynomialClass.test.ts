import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Polynomial } from '../index';

const polynomialClass = suite('Polynomial class');

const oneHalf = new Fraction(1, 2);
const onePlus2xPlus3x2 = new Polynomial([1, 2, 3], { ascending: true });
const x2Plus2xMinus3 = new Polynomial([1, 2, -3]);
const x2Plus2xMinus3V2 = new Polynomial([0, 1, 2, -3]);
const halfYPlus1 = new Polynomial([oneHalf, 1], { variableAtom: 'y' });
const x2Plus2x3Plus3x5 = new Polynomial([1, 2, 0, 3], { ascending: true, degree: 5 });
const x4Plus2x3Minus3x2 = new Polynomial([1, 2, -3], { degree: 4 });

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
	assert.ok(x2Plus2xMinus3.subXAs(1).isEqualTo(0));
});

polynomialClass('arithmetic', () => {
	assert.is(`${x2Plus2xMinus3.add(3)}`, 'x^2 + 2 x');
	assert.is(`${x2Plus2xMinus3.add('x')}`, 'x^2 + 3 x - 3');
	assert.is(`${x2Plus2xMinus3.add(oneHalf)}`, 'x^2 + 2 x - \\frac{5}{2}');
	assert.is(`${x2Plus2xMinus3.multiply(2)}`, '2 x^2 + 4 x - 6');
	assert.is(`${x4Plus2x3Minus3x2.subtract(x2Plus2xMinus3)}`, 'x^4 + 2 x^3 - 4 x^2 - 2 x + 3');
	assert.is(`${x4Plus2x3Minus3x2.multiply(x2Plus2xMinus3)}`, 'x^6 + 4 x^5 - 2 x^4 - 12 x^3 + 9 x^2');
	assert.is(`${halfYPlus1.square()}`, '\\frac{1}{4} y^2 + y + 1');
	assert.throws(() => halfYPlus1.pow(-1));
});

polynomialClass('clone', () => {
	const newX2Plus2xMinus3 = x2Plus2xMinus3.clone();
	newX2Plus2xMinus3.ascending = true;
	assert.ok(newX2Plus2xMinus3.ascending);
	assert.not.ok(x2Plus2xMinus3.ascending);
	const newOnePlus2xPlus3x2 = onePlus2xPlus3x2.clone();
	newOnePlus2xPlus3x2.variableAtom = 'y';
	assert.is(onePlus2xPlus3x2.variableAtom, 'x');
	assert.is(newOnePlus2xPlus3x2.variableAtom, 'y');
});

polynomialClass('reverse', () => {
	const xPlus2 = new Polynomial([1, 2]);
	assert.is(`${xPlus2}`, 'x + 2');
	assert.is(`${xPlus2.changeAscending()}`, '2 + x');
	assert.is(`${xPlus2}`, '2 + x');
	assert.is(`${xPlus2.changeAscending(true)}`, '2 + x');
});

polynomialClass.run();
