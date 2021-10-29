import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, xTerm, Expression, xExpression } from '../index';

const expressionClasses = suite('Expression classes')

const oneHalf = new Fraction(1, 2);
// Terms
const x = new Term(1, 'x');
const negativeOne = new Term(-1);
// xTerms
const negativeX = new xTerm(-1, 'x');
const lnX = new xTerm(1, '\\ln x', (x: number | Fraction) => {
	if (x.valueOf() === 1) {
		return Fraction.ZERO;
	}
})
// expressions
const zero = new Expression(x, negativeX);
const x2PlusX = new Expression('x^2', x);
const xPlusOne = x.subtract(negativeOne);
const xMinusOne = x.add(negativeOne);
const xPlusTwo = x.subtract(-2);
const xMinusY = x.subtract('y');
const lnXPlusHalf = new xExpression(lnX, oneHalf);
// xExpressions
const negativeXMinusOne = negativeX.subtract(1);
const negativeHalfX = negativeX.subtract(negativeX.multiply(oneHalf));
const negativeTwoX = negativeX.subtract('x');
const negativeXPlusOne = negativeX.add(1);


expressionClasses('toString', () => {
	assert.is(`${zero}`, '0');
	assert.is(`${x2PlusX}`, 'x^2 + x');
	assert.is(`${negativeXMinusOne}`, '- x - 1');
	assert.is(`${negativeXPlusOne}`, '- x + 1');
	assert.is(`${negativeHalfX}`, '- \\frac{1}{2} x');
	assert.is(`${negativeTwoX}`, '- 2 x');
	assert.is(`${xPlusOne}`, 'x + 1');
	assert.is(`${xMinusOne}`, 'x - 1');
	assert.is(`${xPlusTwo}`, 'x + 2');
	assert.is(`${xMinusY}`, 'x - y');
	assert.is(`${lnXPlusHalf}`, '\\ln x + \\frac{1}{2}');
});

expressionClasses('substitute', () => {
	assert.ok(lnXPlusHalf.subXAs(1).isEqualTo(oneHalf));
	assert.not.ok(lnXPlusHalf.subXAs(2));
});

expressionClasses('arithmetic', () => {
	assert.is(`${negativeXMinusOne.multiply(-2)}`, '2 x + 2');
	assert.is(`${xPlusOne.add(negativeOne)}`, 'x');
	assert.is(`${xPlusOne.subtract(negativeOne)}`, 'x + 2');
	assert.is(`${negativeXPlusOne.add(1)}`, '- x + 2');
	assert.is(`${negativeXMinusOne.subtract('x')}`, '- 2 x - 1');
});

expressionClasses('clone', () => {
	const newXPlusOne = xPlusOne.clone();
	xPlusOne.terms[0].variable = 'y';
	assert.is(`${xPlusOne}`, 'y + 1');
	assert.is(`${newXPlusOne}`, 'x + 1');
	assert.ok(negativeTwoX.clone());
});


expressionClasses.run();

