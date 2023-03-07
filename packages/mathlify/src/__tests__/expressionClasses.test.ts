import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, Expression, SquareRoot, VariableTerm } from '../index';

const expressionClasses = suite('Expression classes');

const oneHalf = new Fraction(1, 2);
// Terms
const x = new Term(1, 'x');
const negativeOne = new Term(-1);

// expressions
const x2PlusX = new Expression('x^2', x);

// conjugate
const surd = new Expression(2, new SquareRoot(3));

// sub in number: 2 + 3x
const exp = new Expression(2, new VariableTerm(3));

expressionClasses('toString', () => {
	assert.is(`${x2PlusX}`, 'x^2 + x');
	assert.is(`${surd.conjugate()}`, '2 - \\sqrt{3}');
	assert.throws(() => {
		surd.pow(1.5);
	});
	assert.is(exp.subInNumber(2), 8);
	assert.is(Math.abs(surd.valueOf() - 2 - Math.sqrt(3)) < 0.01, true);
	assert.is(Math.abs(surd.subInNumber(2) - 2 - Math.sqrt(3)) < 0.01, true);
});

expressionClasses.run();
