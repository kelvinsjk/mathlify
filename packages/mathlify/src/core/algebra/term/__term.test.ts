import { Fraction, Term, UnsimplifiedExpression } from '../../index.js';
import { test, expect } from 'vitest';

test('Terms', () => {
	expect(`${new Term(1, 'x')}`).to.equal('x');
	expect(`${new Term(-1, 'x')}`).to.equal('- x');
	expect(`${new Term(2, 'x')}`).to.equal('2 x');
	expect(`${new Term(0, 'x')}`).to.equal('0');
});