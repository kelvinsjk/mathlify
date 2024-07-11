import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, Imaginary, SquareRoot, Surd } from '../index';

const termClasses = suite('Term classes');

const oneHalf = new Fraction(1, 2);
const negativeThreeQuarter = new Fraction(-6, 8);

const x = new Term(1, 'x');
const zero = new Term(0);
const negativeOne = new Term(-1);
const one = new Term(1);

//const i = new Term(new Imaginary());
//const negativeTwo = new Term(new Imaginary(), new Imaginary(2));
//const twoRoot6i = new Term(new SquareRoot(2), new SquareRoot(2), new SquareRoot(3), new SquareRoot(2), 'i');
const i = new Term('i');
const negativeTwo = new Term('i', 2, 'i');
const twoRoot6i = new Term(new Surd(2), new Surd(2), new Surd(3), new Surd(2), 'i');

termClasses('toString', () => {
	assert.is(`${x}`, 'x');
	assert.is(`${zero}`, '0');
	assert.is(`${one}`, '1');
	assert.is(`${negativeOne}`, '- 1');
	assert.is(`${negativeTwo}`, '- 2');
	assert.is(`${twoRoot6i}`, '2 \\mathrm{i} \\sqrt{6}');
	assert.is(`${twoRoot6i.times('i')}`, '- 2 \\sqrt{6}');
	assert.is(`${negativeOne.square()}`, '1');
	assert.is(`${i.square()}`, '- 1');
	assert.is(`${i.pow(3)}`, '- \\mathrm{i}');
	assert.throws(() => {
		x.valueOf();
	});
	assert.throws(() => {
		i.subInNumber(2);
	});
	assert.throws(() => {
		i.subIn(2);
	});
});

termClasses('scalar multiplication', () => {
	assert.is(`${x.times(2)}`, '2 x');
	assert.is(`${x.negative()}`, '- x');
	//assert.is(`${x.minus(1)}`, 'x - 1');
	//assert.is(`${x.minus('y')}`, 'x - y');
});

termClasses('clone', () => {
	const newX = x.clone();
	newX.kind = 'new';
	assert.is(x.kind, 'singleton');
	assert.is(newX.kind, 'new');
});

termClasses.run();
