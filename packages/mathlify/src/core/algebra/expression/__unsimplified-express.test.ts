import { test, expect } from 'vitest';
import { Fraction } from '../../index.js';
import { UnsimplifiedExpression } from './unsimplified-expression.js';

test('Unsimplified expression', () => {
	const uExp1a = new UnsimplifiedExpression(2).plus(9);
	const uExp1b = new UnsimplifiedExpression(new Fraction(-2)).plus(9);
	const uExp1c = new UnsimplifiedExpression(2).plus(-9);
	const uExp1d = new UnsimplifiedExpression(-2, { brackets: 'always' }).plus(
		-9
	);
	const uExp2a = new UnsimplifiedExpression(4).minus(7);
	const uExp2c = new UnsimplifiedExpression(4).minus(-7);
	const uExp2d = new UnsimplifiedExpression(-4, { brackets: 'always' }).minus(
		-7
	);

	expect(`${uExp1a}`).to.equal('2 + 9');
	expect(`${uExp1b}`).to.equal('- 2 + 9');
	expect(`${uExp1c}`).to.equal('2 + \\left( - 9 \\right)');
	expect(`${uExp1d}`).to.equal('\\left( - 2 \\right) + \\left( - 9 \\right)');
	expect(`${uExp2a}`).to.equal('4 - 7');
	expect(`${uExp2c}`).to.equal('- 4 - \\left( - 7 \\right)');
	expect(`${uExp2d}`).to.equal('\\left( - 4 \\right) - \\left( - 7 \\right)');
});
