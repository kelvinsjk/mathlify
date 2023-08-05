import { test, expect } from 'vitest';
import { Fraction, Expression, Term } from '../../index.js';
import { RationalTerm } from './rational.js';

const y = new Term('y');
const xPlus1 = new Expression('x', 1);
const xMinus1 = new Expression('x', -1);
const two = new Fraction(2);
const xPlus1Over2a = new RationalTerm(xPlus1, 2);
const xPlus1Over2b = new RationalTerm(xPlus1, two);
const xPlus1OverX = new RationalTerm(xPlus1, 'x');
const xPlus1OverY = new RationalTerm(xPlus1, y);
const xPlus1OverXMinus1a = new RationalTerm(xPlus1, ['x', -1]);
const xPlus1OverXMinus1b = new RationalTerm(xPlus1, xMinus1);
const yOverXPlus1 = new RationalTerm(y, xPlus1);
const xOverXPlus1 = new RationalTerm('x', xPlus1);
const xOverTwo = new RationalTerm('x', 1);
const xMinus1OverXPlus1 = new RationalTerm(['x', -1], xPlus1);
const twoOverXPlus1a = new RationalTerm(two, xPlus1);
const xPlus1Over1 = new RationalTerm(xPlus1, 1);
const twoOverXPlus1b = new RationalTerm(2, xPlus1);

test('RationalTerm in Expression', () => {
	const exp = new Expression(twoOverXPlus1b, 3);
	expect(`${exp}`).to.equal(`\\frac{2}{x + 1} + 3`);
});

test('RationalTerm constructor', () => {
	expect(() => new RationalTerm(xPlus1, 0)).to.throw();

	expect(`${xPlus1Over2a}`).to.equal(`\\frac{x + 1}{2}`);
	expect(`${xOverTwo}`).to.equal(`x`);
});

test('Rational Arithmetic', () => {
	expect(`${xPlus1Over2b.minus(xPlus1OverX)}`).to.equal(
		`\\frac{x^2 - x - 2}{2 x}`
	);
	expect(`${xPlus1Over1.times('y')}`).to.equal(`x y + y`);
	expect(`${xPlus1OverY.divide(xPlus1OverXMinus1a)}`).to.equal(
		'\\frac{x^2 - 1}{y x + y}'
	);
	expect(`${twoOverXPlus1a.divide(2)}`).to.equal('\\frac{1}{x + 1}');
	expect(`${xPlus1OverXMinus1b.times(yOverXPlus1)}`).to.equal(
		'\\frac{x y + y}{x^2 - 1}'
	);
	expect(`${xOverXPlus1.minus(1)}`).to.equal('\\frac{- 1}{x + 1}');
	expect(`${xMinus1OverXPlus1.subIn({ x: 2 })}`).to.equal('\\frac{1}{3}');
	// simplification using lcm for addition/subtraction
	const threeQuarterX = new RationalTerm(new Term(3, 'x'), 4);
	const sevenTwelfthX = new RationalTerm(new Term(7, 'x'), 12);
	expect(`${threeQuarterX.plus(sevenTwelfthX)}`).to.equal('\\frac{4 x}{3}');
});

test('casting', () => {
	const half = new RationalTerm(1, 2);
	// @ts-expect-error
	expect(new Fraction(1, 2).is.equalTo(half)).to.be.false;
	expect(new Fraction(1, 2).is.equalTo(half.cast.toFraction())).to.be.true;
	expect(() => {
		xMinus1OverXPlus1.cast.toExpression();
	}).to.throw();
	expect(xOverTwo.cast.toTerm().type).to.be.equal('term');
});
