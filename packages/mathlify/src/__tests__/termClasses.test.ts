import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term } from '../index';

const termClasses = suite('Term classes');

const oneHalf = new Fraction(1, 2);
const negativeThreeQuarter = new Fraction(-6, 8);

const x = new Term(1, 'x');
const zero = new Term(0);
const negativeOne = new Term(-1);
const one = new Term(1);

termClasses('toString', () => {
	assert.is(`${x}`, 'x');
	assert.is(`${zero}`, '0');
	assert.is(`${one}`, '1');
	assert.is(`${negativeOne}`, '- 1');
});

termClasses('scalar multiplication', () => {
	assert.is(`${x.times(2)}`, '2 x');
	assert.is(`${x.negative()}`, '- x');
});

termClasses('clone', () => {
	const newX = x.clone();
	newX.variableString = 'y';
	assert.is(`${x}`, 'x');
	assert.is(`${newX}`, 'y');
});

termClasses.run();
