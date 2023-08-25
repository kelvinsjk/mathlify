import { test, expect } from 'vitest';
import {
	Expression,
	Term,
	RationalTerm,
	EquationWorking,
	Fraction,
} from '../../index.js';
import { afterAll, vi } from 'vitest';

const y = new Term('y');
const xPlus1 = new Expression('x', 1);
const xPlus1Over2 = new RationalTerm(xPlus1, 2);
const xPlus1OverXMinus1 = new RationalTerm(xPlus1, new Expression('x', -1));

test('General Equation', () => {
	const eqn = new EquationWorking(y);
	expect(`${eqn}`).to.equal(`y = 0`);
	eqn.plus(2);
	expect(`${eqn}`).to.equal(`y = 0\n\t\\\\ y + 2 = 2`);
	const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
	afterAll(() => {
		consoleMock.mockReset();
	});
	eqn.crossMultiply();
	expect(consoleMock).toHaveBeenCalledOnce();
	eqn.combineRationalTerms();
	expect(consoleMock).toHaveBeenCalledTimes(2);
	expect(`${eqn}`).to.equal(`y = 0\n\t\\\\ y + 2 = 2`);

	const eqn2 = new EquationWorking(xPlus1Over2, xPlus1);
	expect(`${eqn2}`).to.equal(`\\frac{x + 1}{2} = x + 1`);
	eqn2.crossMultiply();
	expect(`${eqn2}`).to.equal(
		`\\frac{x + 1}{2} = x + 1\n\t\\\\ x + 1 = 2 x + 2`
	);
	eqn2.setAligned();
	eqn2.moveTerm(0);
	expect(`${eqn2}`).to.equal(
		`\\frac{x + 1}{2} &= x + 1\n\t\\\\ x + 1 &= 2 x + 2\n\t\\\\ 1 &= x + 2`
	);

	const eqn3 = new EquationWorking([xPlus1Over2, 2], xPlus1OverXMinus1, {
		aligned: true,
	});
	expect(`${eqn3}`).to.equal(`\\frac{x + 1}{2} + 2 &= \\frac{x + 1}{x - 1}`);
	eqn3.combineRationalTerms();
	expect(`${eqn3}`).to.equal(
		`\\frac{x + 1}{2} + 2 &= \\frac{x + 1}{x - 1}\n\t\\\\ \\frac{x + 5}{2} &= \\frac{x + 1}{x - 1}`
	);
	eqn3.crossMultiply();
	expect(`${eqn3}`).to.equal(
		`\\frac{x + 1}{2} + 2 &= \\frac{x + 1}{x - 1}\n\t\\\\ \\frac{x + 5}{2} &= \\frac{x + 1}{x - 1}\n\t\\\\ x^2 + 4 x - 5 &= 2 x + 2`
	);

	const eqn4 = new EquationWorking(2, xPlus1OverXMinus1);
	eqn4.crossMultiply();
	expect(`${eqn4}`).to.equal(
		`2 = \\frac{x + 1}{x - 1}\n\t\\\\ 2 x - 2 = x + 1`
	);
	eqn4.swap().negative();
	expect(`${eqn4}`).to.equal(
		`2 = \\frac{x + 1}{x - 1}\n\t\\\\ 2 x - 2 = x + 1\n\t\\\\ x + 1 = 2 x - 2\n\t\\\\ - x - 1 = - 2 x + 2`
	);
});

test('General Equation Arithmetic', () => {
	const eqn = new EquationWorking(y);
	expect(`${eqn}`).to.equal(`y = 0`);
	eqn.times(2).minus(3).divide(2);
	expect(`${eqn}`).to.equal(
		`y = 0\n\t\\\\ 2 y = 0\n\t\\\\ 2 y - 3 = - 3\n\t\\\\ y - \\frac{3}{2} = - \\frac{3}{2}`
	);

	const eqn2 = new EquationWorking(xPlus1Over2, [y, 1]);
	expect(`${eqn2}`).to.equal(`\\frac{x + 1}{2} = y + 1`);
	eqn2.moveTerm(1, { from: 'rhs', intertext: '\\text{Subtracting,}' });
	expect(`${eqn2}`).to.equal(
		`\\frac{x + 1}{2} = y + 1\n\t\\\\ \\text{Subtracting,}\n\t\\\\ \\frac{x + 1}{2} - 1 = y`
	);
});

test('Equation Working: more tests', () => {
	const eqn = new EquationWorking(['x', 1], new RationalTerm('y', 2));
	eqn.setAligned(false);
	eqn.crossMultiply();
	expect(`${eqn}`).to.equal(`x + 1 = \\frac{y}{2}\n\t\\\\ 2 x + 2 = y`);

	const eqn2 = new EquationWorking(
		new RationalTerm('y', 2),
		new Fraction(2, 3)
	);
	eqn2.setAligned(true);
	eqn2.crossMultiply({ intertext: '\\text{Cross multiplying,}' });
	expect(`${eqn2}`).to.equal(
		`\\frac{y}{2} &= \\frac{2}{3}\n\t\\\\ \\text{Cross multiplying,} &\n\t\\\\ 3 y &= 4`
	);
});
