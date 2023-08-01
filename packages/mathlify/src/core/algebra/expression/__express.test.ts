import { test, expect } from 'vitest';
import { Fraction, Term, Expression } from '../../index.js';

const uExp1a = new Expression(2).plus(9);
const uExp1b = new Expression(new Fraction(-2)).plus(9);
const uExp1c = new Expression(2).plus(-9);
const uExp1d = new Expression({term: -2, brackets: 'always'}).plus(
	-9
);
const uExp2a = new Expression(4).minus(7);
const uExp2c = new Expression(4).minus(-7);
const uExp2d = new Expression({term: -4, brackets: 'auto'}).minus(
	-7
);
const uExp4f = new Expression(-33, {term: 33, addition: false}, new Term(-87));
const uExp4e = new Expression(new Term(-24), 16, -10);
const uExp4h = new Expression({term: 27, addition: false}).minus(-19).minus(-24);

const uExpFraction1c = new Expression({term: new Term(new Fraction(4,5)), addition: false}).plus(new Fraction(3,10));

const zero = new Expression(1, new Fraction(-2,3)).minus(new Fraction(1,3));
const xPlus1 = new Expression(new Term('x'), 1);
const xMinus1 = new Expression(new Term('x'), -1);

test('Expression', () => {
	expect(()=>new Expression()).to.throw();
	expect(`${uExp1a}`).to.equal('11');
	expect(`${uExp1b}`).to.equal('7');
	expect(`${uExp1c}`).to.equal('- 7');
	expect(`${uExp1d}`).to.equal('- 11');
	expect(`${uExp2a}`).to.equal('- 3');
	expect(`${uExp2c}`).to.equal('11');
	expect(`${uExp2d}`).to.equal('3');
	expect(`${uExp4f}`).to.equal('- 153');
	expect(`${uExp4e}`).to.equal('- 18');
	expect(`${uExp4h}`).to.equal('16');
	expect(`${uExpFraction1c}`).to.equal('- \\frac{1}{2}');
	expect(`${zero}`).to.equal('0');
	expect(`${xPlus1}`).to.equal('x + 1');
	expect(`${xMinus1}`).to.equal('x - 1');
});

