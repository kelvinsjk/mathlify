import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, Expression } from '../index';

const expressionClasses = suite('Expression classes');

const oneHalf = new Fraction(1, 2);
// Terms
const x = new Term(1, 'x');
const negativeOne = new Term(-1);

// expressions
const x2PlusX = new Expression('x^2', x);

expressionClasses('toString', () => {
	assert.is(`${x2PlusX}`, 'x^2 + x');
});

expressionClasses.run();
