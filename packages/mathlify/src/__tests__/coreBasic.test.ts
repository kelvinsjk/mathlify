import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, Imaginary, SquareRoot, VariableTerm } from '../index';

const coreBasic = suite('Core Basic coverage tests');

const oneHalf = new Fraction(1, 2);
const negativeThreeQuarter = new Fraction(-6, 8);

const x = new VariableTerm();
const zero = new Term(0);
const negativeOne = new Term(-1);
const one = new Term(1);

const i = new Imaginary();
const negativeTwo = new Term(new Imaginary(), new Imaginary(2));
const twoRoot6i = new Term(new SquareRoot(2), new SquareRoot(2), new SquareRoot(3), new SquareRoot(2), 'i');

coreBasic('VariableTerm', () => {
	assert.throws(() => {
		new VariableTerm('x').times(new VariableTerm('y'));
	});
	assert.is(`${x.times(x)}`, 'x^2');
	assert.is(`${x.negative()}`, '- x');
	assert.is(`${x.times(2)}`, '2 x');
	assert.throws(() => {
		new VariableTerm('x').divide(new VariableTerm('y'));
	});
	assert.is(`${x.divide(x)}`, '1');
	assert.is(`${x.divide(2)}`, '\\frac{1}{2} x');
	assert.throws(() => {
		const sqrtX = new VariableTerm(1, { n: oneHalf });
		sqrtX.subIn(2);
	});
});

coreBasic('Imaginary', () => {
	assert.is(`${i.plus(i)}`, `2 \\mathrm{i}`);
	assert.is(`${i.minus(i)}`, `0`);
	assert.is(`${i.square()}`, `- 1`);
	assert.is(`${i.negative()}`, `- \\mathrm{i}`);
	assert.throws(() => {
		i.pow(-1);
	});
});

coreBasic.run();
