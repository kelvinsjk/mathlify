import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Term, xTerm, pTerm } from '../index';

const termClasses = suite('Term classes')

const oneHalf = new Fraction(1, 2);
const negativeThreeQuarter = new Fraction(-6, 8);

const x = new Term(1, 'x');
const negativeX = new xTerm(-1, 'x');
const zero = new Term(0);
const halfX = new pTerm(oneHalf);
const negativeThreeQuarterX2 = new pTerm(negativeThreeQuarter, { n: 2 });
const half = new pTerm(oneHalf, {n: 0});
const y10 = new pTerm(1, { n: 10, variableAtom: 'y' });
const negativeOne = new Term(-1);
const one = new Term(1);
const lnX = new xTerm(1, '\\ln x', (x: number | Fraction) => {
	if (x.valueOf() === 1) {
		return Fraction.ZERO;
	}
})

termClasses('toString', () => {
	assert.is(`${x}`, 'x');
	assert.is(`${negativeX}`, '- x');
	assert.is(`${zero}`, '0');
	assert.is(`${one}`, '1');
	assert.is(`${negativeOne}`, '- 1');
	assert.is(`${halfX}`, '\\frac{1}{2} x');
	assert.is(`${half}`, '\\frac{1}{2}');
	assert.is(`${y10}`, 'y^{10}');
	assert.is(`${negativeThreeQuarterX2}`, '- \\frac{3}{4} x^2');
	assert.is(`${lnX}`, '\\ln x');
});

termClasses('substitute', () => {
	assert.ok(negativeX.subXAs(oneHalf).isEqualTo(new Fraction(-1,2)));
	assert.ok(halfX.subXAs(2).isEqualTo(1));
	assert.ok(half.subXAs(2).isEqualTo(oneHalf));
	assert.ok(negativeThreeQuarterX2.subXAs(oneHalf).isEqualTo(new Fraction(-3,16)));
	assert.ok(lnX.subXAs(1).isEqualTo(0));
	assert.not.ok(lnX.subXAs(0));
});

termClasses('scalar multiplication', () => {
	assert.is(`${x.multiply(2)}`, '2 x');
	assert.is(`${negativeX.multiply(0)}`, '0');
	assert.is(`${negativeThreeQuarterX2.multiply(4)}`, '- 3 x^2');
	assert.is(`${x.negative()}`, '- x');
	assert.is(`${negativeX.negative()}`, 'x');
	assert.is(`${negativeThreeQuarterX2.negative()}`, '\\frac{3}{4} x^2');
});

termClasses('clone', () => {
	const newX = x.clone();
	const newNegativeX = negativeX.clone();
	const newNegativeThreeQuarterX2 = negativeThreeQuarterX2.clone();
	newX.variable = 'y';
	assert.is(`${x}`, 'x');
	assert.is(`${newX}`, 'y');
	assert.is(`${newNegativeX}`, '- x');
	assert.is(`${newNegativeThreeQuarterX2}`, '- \\frac{3}{4} x^2');
});


termClasses.run();

