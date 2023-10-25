import { test, expect } from 'vitest';
import { Fraction, Expression, Term } from '../../../index.js';
import { ExpansionTerm } from './expansion.js';

const threeY2 = new Term(3, ['y', 2]);
const xPlus2 = new Expression('x', 2);
const half = new Fraction(1, 2);

const twoTimesXPlus2 = new ExpansionTerm(2, xPlus2);
const halfXPlus2 = new ExpansionTerm(half, xPlus2);
const xXPlus2 = new ExpansionTerm('x', xPlus2);
const threeY2XPlus2 = new ExpansionTerm(threeY2, xPlus2);

test('ExpansionTerm constructor', () => {
	expect(`${twoTimesXPlus2}`).to.equal(`2 \\left( x + 2 \\right)`);
	expect(`${halfXPlus2}`).to.equal(`\\frac{1}{2} \\left( x + 2 \\right)`);
	expect(`${xXPlus2}`).to.equal(`x \\left( x + 2 \\right)`);
	expect(`${threeY2XPlus2}`).to.equal(`3 y^2 \\left( x + 2 \\right)`);
	expect(`${new ExpansionTerm(2, new Expression('x', 2))}`).to.equal(
		`2 \\left( x + 2 \\right)`
	);
	expect(`${new ExpansionTerm(2, 'x', 'y')}`).to.equal(`2 x y`);
	expect(`${new ExpansionTerm(3, [xPlus2, 4], xPlus2)}`).to.equal(
		`3 \\left( x + 2 \\right)^5`
	);
});

test('ExpansionTerm expansion', () => {
	expect(`${twoTimesXPlus2.expand()}`).to.equal(`2 x + 4`);
	expect(`${halfXPlus2.expand()}`).to.equal(`\\frac{1}{2} x + 1`);
	expect(`${xXPlus2.expand()}`).to.equal(`x^2 + 2 x`);
	expect(`${threeY2XPlus2.expand()}`).to.equal(`3 y^2 x + 6 y^2`);
});

test('ExpansionTerm in Expression', () => {
	const exp = new Expression(twoTimesXPlus2, 3);
	expect(`${exp}`).to.equal(`2 \\left( x + 2 \\right) + 3`);
});

test('negative ExpansionTerm', () => {
	const exp = new ExpansionTerm(-1, xPlus2);
	const exp2 = new ExpansionTerm(-2, xPlus2);
	const exp3 = new ExpansionTerm(1, xPlus2);
	expect(`${exp}`).to.equal(`- \\left( x + 2 \\right)`);
	expect(`${exp2}`).to.equal(`- 2 \\left( x + 2 \\right)`);
	expect(`${exp3}`).to.equal(`x + 2`);
	const expression = new Expression(5, exp);
	expect(`${expression}`).to.equal(`5 - \\left( x + 2 \\right)`);
});

test('lcm, division', () => {
	const lcm = ExpansionTerm.lcm(xXPlus2, threeY2XPlus2);
	expect(`${lcm}`).to.equal(`3 x \\left( x + 2 \\right) y^2`);
	expect(`${lcm.divide(xXPlus2)}`).to.equal(`3 y^2`);
	const xPlus2Square = new ExpansionTerm([xPlus2, 2]);
	const lcm2 = ExpansionTerm.lcm(xPlus2Square, threeY2XPlus2);
	expect(`${lcm2}`).to.equal(`3 \\left( x + 2 \\right)^2 y^2`);
	expect(`${lcm2.divide(threeY2XPlus2)}`).to.equal(`x + 2`);
	expect(`${lcm2.divide(xPlus2Square)}`).to.equal(`3 y^2`);
});
