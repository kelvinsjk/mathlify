import { SquareRoot, Term, Fraction } from '../index';
import { test, expect } from 'vitest';

const root2 = new SquareRoot(2);

test('square roots', () => {
	expect(() => new SquareRoot(-1)).to.throw();
	expect(() => root2.cast.toFraction()).to.throw();
	expect(`${new SquareRoot(0).toTex()}`).to.equal(`0`);
	expect(`${root2.square().toTex()}`).to.equal(`2`);
	expect(() => root2.cast.toFraction()).to.throw();
	expect(root2.square().type).to.equal(`fraction`);
	expect(root2.times(root2).cast.toFraction().type).to.equal(`fraction`);
	expect(`${root2.pow(5).toTex()}`).to.equal(`4 \\sqrt{2}`);
	expect(`${new SquareRoot(3, { coeff: -2 }).abs().toTex()}`).to.equal(
		`2 \\sqrt{3}`
	);
	expect(root2.is.equalTo(new SquareRoot(2))).to.equal(true);
	expect(root2.is.not.equalTo(3)).to.equal(true);
	expect(root2.is.not.equalTo(new Term('x'))).to.equal(true);
	expect(root2.toPrecision(3)).to.eq('1.41');
	expect(root2.toFixed(2)).to.eq('1.41');
	expect(root2.is.constant()).to.eq(true);
	expect(root2.is.rational()).to.eq(false);
	expect(root2.is.equalTo(new SquareRoot(new Fraction(1, 2)).times(2))).to.eq(
		true
	);
	expect(root2.is.equalTo(new SquareRoot(new Fraction(1, 2)))).to.eq(false);
});

test('sqrt arithmetic', () => {
	expect(new SquareRoot(2, { coeff: 3 }).negative().toTex()).to.eq(
		'- 3 \\sqrt{2}'
	);
	expect(root2.divide('x').toTex()).to.eq('\\frac{\\sqrt{2}}{x}');
	expect(root2.divide(new Term('x')).toTex()).to.eq('\\frac{\\sqrt{2}}{x}');
	expect(root2.divide(3).toTex()).to.eq('\\frac{1}{3} \\sqrt{2}');
	expect(root2.times(new Term(3)).toTex()).to.eq('3 \\sqrt{2}');
	expect(root2.times(3).resetCoeff().toTex()).to.eq('\\sqrt{2}');
});

test('sqrt to json', () => {
	const root2JSON = JSON.stringify(root2);
	const sqrt2 = SquareRoot.fromJSON(JSON.parse(root2JSON));
	expect(sqrt2.is.equalTo(root2)).to.be.true;
});
