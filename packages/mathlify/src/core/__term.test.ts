import { Term, Fraction } from './index';
import { test, expect } from 'vitest';

const x = new Term('x');
test('Terms', () => {
	const zero = new Term(0, 'x');
	const negativeX = new Term('x', -1);
	const twoX = new Term(2, 'x');
	expect(`${x.toTex()}`).to.equal('x');
	expect(`${negativeX.toTex()}`).to.equal('- x');
	expect(negativeX.abs().is.equalTo(x)).toBe(true);
	expect(negativeX.is.equalTo(x)).toBe(false);
	expect(x.abs().toTex()).to.equal('x');
	expect(`${twoX.toTex()}`).to.equal('2 x');
	expect(twoX.resetCoeff().toTex()).toBe('x');
	expect(`${zero.toTex()}`).to.equal('0');
	expect(`${new Term('y', { variable: 'x', power: 2 }).toTex()}`).to.equal(
		'y x^2'
	);
	expect(`${new Term({ variable: 'x', power: 20 }, 'y').toTex()}`).to.equal(
		'x^{20} y'
	);
	expect(`${new Term('x', { variable: 'x', power: -1 }, '').toTex()}`).to.equal(
		'1'
	);
	expect(`${new Term(['x', 2]).toTex()}`).to.equal('x^2');
	expect(x.type).to.equal('term');
	expect(x.is.constant()).toBe(false);
	expect(zero.is.constant()).toBe(true);
	expect(() => zero.reciprocal()).to.throw();
	expect(() => x.divide(0)).to.throw();
});

const threeFifth = new Fraction(3, 5);
const threeFifthX = new Term(threeFifth, 'x');
test('Term Fractional Display', () => {
	expect(`${threeFifthX.toTex()}`).to.equal('\\frac{3}{5} x');
	threeFifthX.setDisplayMode('always');
	expect(`${threeFifthX.toTex()}`).to.equal('\\frac{3 x}{5}');
	threeFifthX.setDisplayMode('never');
	expect(`${threeFifthX.toTex()}`).to.equal('\\frac{3}{5} x');
	const oneOverX1 = new Term({
		variable: 'x',
		power: -1,
	});
	const oneOverX2 = new Term({
		variable: 'x',
		power: -1,
	}).setDisplayMode('never');
	const oneOverX3 = new Term({
		variable: 'x',
		power: -1,
	}).setDisplayMode('always');

	expect(`${oneOverX2.toTex()}`).to.equal('x^{- 1}');
	expect(`${oneOverX1.toTex()}`).to.equal('\\frac{1}{x}');
	expect(`${oneOverX3.toTex()}`).to.equal('\\frac{1}{x}');
	const negativeOneOverX = new Term(-1).divide('x', {
		fractionalDisplayMode: 'always',
	});
	expect(`${negativeOneOverX.toTex()}`).to.equal('- \\frac{1}{x}');
	expect(
		`${threeFifthX.reciprocal({ fractionalDisplayMode: 'never' }).toTex()}`
	).to.equal('\\frac{5}{3} x^{- 1}');
	expect(`${new Term('x').setDisplayMode('always').toTex()}`).to.equal('x');
	expect(`${new Term('x', -1).setDisplayMode('always').toTex()}`).to.equal(
		'- x'
	);
	expect(`${new Term('x', 2).setDisplayMode('always').toTex()}`).to.equal(
		'2 x'
	);
	expect(`${new Term('x', new Fraction(3, 5), ['y', -1]).toTex()}`).to.equal(
		'\\frac{3 x}{5 y}'
	);
});

const y = new Term('y');

test('Term multiplication', () => {
	expect(`${x.times('z').toTex()}`).to.equal('x z');
	expect(`${x.times('x').toTex()}`).to.equal('x^2');
	expect(`${x.times(2).toTex()}`).to.equal('2 x');
	expect(`${x.negative().toTex()}`).to.equal('- x');
	expect(`${x.times(new Fraction(1, 2)).toTex()}`).to.equal('\\frac{1}{2} x');
	expect(`${x.times(y).toTex()}`).to.equal('x y');
	const xOverY = x.divide('y', { fractionalDisplayMode: 'never' });
	expect(`${xOverY.toTex()}`).to.equal('x y^{- 1}');
	expect(xOverY.times(5).signature).to.be.equal('x y^{- 1}');
	expect(new Term('x', ['y', -1]).signature).to.be.equal('x y^{- 1}');
	expect(
		`${x.negative().divide('y', { fractionalDisplayMode: 'never' }).toTex()}`
	).to.equal('- x y^{- 1}');
	expect(`${x.divide(y).toTex()}`).to.equal('\\frac{x}{y}');
	expect(
		`${x.divide(2, { fractionalDisplayMode: 'always' }).toTex()}`
	).to.equal('\\frac{x}{2}');
	expect(`${x.divide(x).toTex()}`).to.equal('1');
	expect(threeFifthX.pow(3).toTex()).to.equal('\\frac{27}{125} x^3');
	expect(x.pow(half).toTex()).to.equal('x^{\\frac{1}{2}}');
	expect(() => threeFifthX.pow(half)).to.throw();
});

const half = new Fraction(1, 2);
const xy = new Term('x', 'y');
test('Term sub in method', () => {
	const sqrtX = new Term(['x', half]);
	expect(sqrtX.toTex()).to.equal('x^{\\frac{1}{2}}');
	expect(() => sqrtX.subIn(2)).to.throw();
	expect(() => sqrtX.subIn(half)).to.throw();
	expect(`${x.subIn(2).toTex()}`).to.equal('2');
	expect(`${new Term({ variable: 'x', power: 2 }).subIn(2).toTex()}`).to.equal(
		'4'
	);
	expect(() => {
		new Term({ variable: 'x', power: new Fraction(1, 2) }).subIn(2);
	}).to.throw();
	expect(`${xy.subIn(2).toTex()}`).to.equal('2 y');
	expect(`${xy.subIn({ y: 2 }).toTex()}`).to.equal('2 x');
	const xy2 = xy.subIn({ z: 2 });
	expect(`${xy2.toTex()}`).to.equal('x y');
	expect(`${xy.subIn({ x: 2, y: 3 }).toTex()}`).toBe('6');
});

test('Term variables', () => {
	expect(xy.variables).to.have.members(['y', 'x']);
	expect(xy.variables.length).to.eq(2);
});

const threeFifthTerm = new Term(threeFifth);
test('Term casting', () => {
	// @ts-expect-error
	expect(threeFifth.is.equalTo(threeFifthTerm)).toBe(false);
	expect(threeFifth.is.equalTo(threeFifthTerm.cast.toFraction())).toBe(true);
	expect(() => {
		new Term('x').cast.toFraction();
	}).to.throw();
});

test('boolean methods', () => {
	const twoX = new Term(2, 'x');
	expect(twoX.is.not.like('x')).toBe(false);
	expect(twoX.is.not.equalTo('x')).toBe(true);
	expect(twoX.is.not.constant()).toBe(true);
	expect(threeFifthTerm.is.not.rational()).toBe(false);
});

test('JSON', () => {
	const threeFifth_x_half_y2 = new Term(threeFifth, ['x', half], ['y', 2]);
	const termJSON = JSON.stringify(threeFifth_x_half_y2);
	const termJSONObj = JSON.parse(termJSON);
	const term2 = Term.fromJSON(termJSONObj);
	expect(term2.toTex()).to.equal(`\\frac{3}{5} x^{\\frac{1}{2}} y^2`);
});
