import { test, expect } from 'vitest';
import { Fraction, Term, Expression } from './index';

const uExp1a = new Expression(2).plus(9);
const uExp1b = new Expression(new Fraction(-2)).plus(9);
const uExp1c = new Expression(2).plus(-9);
const uExp2a = new Expression(4).minus(7);
const uExp2c = new Expression(4).minus(-7);
const uExp4e = new Expression(new Term(-24), 16, -10);

const zero = new Expression(1, new Fraction(-2, 3)).minus(new Fraction(1, 3));
const xPlus1 = new Expression(new Term('x'), 1);
const xMinus1 = new Expression('x', -1);
const minusXPlus1 = new Expression([-1, 'x'], 1);
const xPlus2 = new Expression('x', 2);
const threeFifth = new Fraction(3, 5);
const threeFifthX = new Term(threeFifth, 'x');
threeFifthX.setDisplayMode('always');
const threeFifthXPlus1 = new Expression(threeFifthX, 1);

const xPlusY = new Expression('x', 'y');

test('Expression', () => {
	expect(() => new Expression()).to.throw();
	expect(`${uExp1a.toTex()}`).to.equal('11');
	expect(`${uExp1b.toTex()}`).to.equal('7');
	expect(`${uExp1c.toTex()}`).to.equal('- 7');
	expect(`${uExp2a.toTex()}`).to.equal('- 3');
	expect(`${uExp2c.toTex()}`).to.equal('11');
	expect(`${uExp4e.toTex()}`).to.equal('- 18');
	expect(`${zero.toTex()}`).to.equal('0');
	expect(`${xPlus1.toTex()}`).to.equal('x + 1');
	expect(`${xPlus2.toTex()}`).to.equal('x + 2');
	expect(`${xMinus1.toTex()}`).to.equal('x - 1');
	expect(`${minusXPlus1.toTex()}`).to.equal('- x + 1');
	expect(`${threeFifthXPlus1.toTex()}`).to.equal('\\frac{3 x}{5} + 1');
	expect(`${threeFifthXPlus1.subIn(5).toTex()}`).to.equal('4');
	expect(`${threeFifthXPlus1.negative().toTex()}`).to.equal(
		'- \\frac{3 x}{5} - 1'
	);
	expect(`${threeFifthXPlus1.negative().square().toTex()}`).to.equal(
		'\\frac{9 x^2}{25} + \\frac{6 x}{5} + 1'
	);
	expect(`${new Expression([2, 'x'], 1).toTex()}`).to.be.equal('2 x + 1');
});

test('Expression casting', () => {
	const frac2 = new Fraction(1, 2);
	const exp2 = new Expression(frac2);
	const zeroExp = new Expression(1, -1);
	// @ts-expect-error
	expect(frac2.is.not.equalTo(exp2)).toBe(true);
	expect(frac2.is.equalTo(exp2.cast.toFraction())).toBe(true);
	expect(`${zeroExp.toTex()}`).to.equal('0');
	expect(() => {
		zeroExp.gcd();
	}).to.throw();
	expect(`${zeroExp.cast.toTerm().toTex()}`).to.equal('0');
	expect(`${zeroExp.cast.toFraction().toTex()}`).to.equal('0');
	expect(() => {
		new Expression(2, 'x').cast.toFraction();
	}).to.throw();
	expect(() => {
		new Expression(2, 'x').cast.toTerm();
	}).to.throw();
	expect(zero.is.not.constant()).toBe(false);
	expect(xPlus1.is.constant()).toBe(false);
	expect(xPlus1.is.not.rational()).toBe(true);
	expect(zero.is.not.term()).toBe(false);
	expect(xPlus1.is.not.term()).toBe(true);
	expect(
		new Expression([-1, 'x', threeFifth, new Term('x'), ['x', 2]]).toTex()
	).toBe('- \\frac{3}{5} x^4');
});

test('Expression boolean methods', () => {
	expect(zero.is.not.zero()).to.be.false;
	expect(zero.is.not.equalTo(1)).to.be.true;
});

test('Expression variables', () => {
	const x2_plus_xy_plus_1 = xPlusY.times('x').plus(1);
	expect(x2_plus_xy_plus_1.variables).to.have.members(['x', 'y']);
	expect(x2_plus_xy_plus_1.variables.length).to.be.eq(2);
});

const xPlus1_squared = xPlus1.square();
test('Expression arithmetic', () => {
	expect(xPlus1_squared.toTex()).toBe('x^2 + 2 x + 1');
	expect(xPlus1_squared.slice(2).toTex()).toBe('x^2 + 2 x');
	expect(() => {
		xPlus1.pow(-1);
	}).to.throw();
	expect(() => {
		xPlus1.pow(1.5);
	}).to.throw();
	const onePlusX = new Expression(1, 'x');
	expect(onePlusX.is.equalTo(xPlus1)).toBe(true);
	expect(onePlusX.minus('x').is.equalTo(1)).toBe(true);
	expect(threeFifthXPlus1.gcd().toTex()).toBe(`\\frac{1}{5}`);
	expect(xPlus1_squared.divide(2).toTex()).toBe(
		`\\frac{1}{2} x^2 + x + \\frac{1}{2}`
	);
	expect(xPlus1_squared.divide('x').toTex()).toBe(`x + 2 + \\frac{1}{x}`);
	expect(xPlus1.pow(0).toTex()).toBe(`1`);
	expect(zero.plus(xPlus1_squared).plus(threeFifthXPlus1).toTex()).toBe(
		`x^2 + \\frac{13}{5} x + 2`
	);
	expect(zero.plus('x').toTex()).toBe('x');
});

test('expression ordering', () => {
	expect(xPlus1_squared.changeOrder([2, 0, 1]).toTex()).to.equal(
		`1 + x^2 + 2 x`
	);
});

test('expression sub in', () => {
	expect(() => xPlusY.subIn(1)).to.throw();
	expect(xPlusY.subIn({ x: 1 }).toTex()).to.equal('1 + y');
});

test('expression JSON', () => {
	const json = xPlusY.toJSON();
	expect(json.type).toBe('expression');
	const json_string = JSON.stringify(json);
	const xPlusY_v2 = Expression.fromJSON(JSON.parse(json_string));
	expect(xPlusY_v2.toTex()).toBe('x + y');
	expect(xPlusY_v2.type).toBe('expression');
});
