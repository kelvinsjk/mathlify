import { test, expect } from 'vitest';
import { RationalTerm, Fraction, Expression, Term } from '../../index.js';

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
const xMinus1OverXPlus1 = new RationalTerm(['x', -1], xPlus1);
const twoOverXPlus1a = new RationalTerm(two, xPlus1);
const twoOverXPlus1b = new RationalTerm(2, xPlus1);
const xPlus1Over1 = new RationalTerm(xPlus1, 1);

test('RationalTerm constructor', () => {
	expect(() => new RationalTerm(xPlus1, 0)).to.throw();

	expect(`${uExp1a}`).to.equal('2 + 9');
	expect(`${uExp1b}`).to.equal('- 2 + 9');
	expect(`${uExp1c}`).to.equal('2 + \\left( - 9 \\right)');
	expect(`${uExp1d}`).to.equal('\\left( - 2 \\right) + \\left( - 9 \\right)');
	expect(`${uExp2a}`).to.equal('4 - 7');
	expect(`${uExp2c}`).to.equal('4 - \\left( - 7 \\right)');
	expect(`${uExp2d}`).to.equal('\\left( - 4 \\right) - \\left( - 7 \\right)');
	expect(`${uExp4f}`).to.equal('- 33 - 33 + \\left( - 87 \\right)');
	expect(`${uExp4e}`).to.equal('- 24 + 16 + \\left( - 10 \\right)');
	expect(`${uExp4h}`).to.equal(
		'- 27 - \\left( - 19 \\right) - \\left( - 24 \\right)'
	);
});

test('Simplification of expression', () => {
	expect(uExp1a.simplify().toString()).to.equal('11');
	expect(`${new UnsimplifiedExpression('x', 'y')}`).to.equal('x + y');
});
