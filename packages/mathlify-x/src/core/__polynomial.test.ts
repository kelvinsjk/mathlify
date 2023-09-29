import { test, expect } from 'vitest';
import { Fraction, Polynomial, Term, Expression } from './index';

const two = new Polynomial([2]);
const twoXa = Polynomial.ofDegree(1, { coeff: 2 });
const twoXb = new Polynomial([2, 0]);
const xPlusThree = new Polynomial([1, 3]);
const threePlusX = new Polynomial([3, 1], { ascending: true });
const half = new Fraction(1, 2);
const y2MinusYPlusHalf = new Polynomial([1, -1, half], { variable: 'y' });

test('Polynomial', () => {
	//@ts-expect-error
	expect(() => new Polynomial()).to.throw();
	expect(() => {
		two.pow(-1);
	}).to.throw();
	expect(() => {
		two.pow(half);
	}).to.throw();
	expect(`${twoXa.toTex()}`).to.equal('2 x');
	expect(`${twoXb.minus(two).toTex()}`).to.equal('2 x - 2');
	expect(`${xPlusThree.toTex()}`).to.equal('x + 3');
	expect(`${threePlusX.toTex()}`).to.equal('3 + x');
	expect(`${y2MinusYPlusHalf.toTex()}`).to.equal('y^2 - y + \\frac{1}{2}');
	expect(`${twoXa.minus(twoXb).toTex()}`).to.equal('0');
	expect(`${xPlusThree.times(threePlusX).toTex()}`).to.equal(`x^2 + 6 x + 9`);
	expect(`${xPlusThree.square().toTex()}`).to.equal(`x^2 + 6 x + 9`);
	expect(xPlusThree.subIn(2).is.equalTo(5)).to.be.true;
	expect(xPlusThree.subInNumber(2)).to.be.eq(5);
	expect(`${xPlusThree.subIn({ x: 3 }).toTex()}`).to.be.equal('6');
	expect(`${y2MinusYPlusHalf.pow(0).toTex()}`).to.equal('1');
	expect(`${xPlusThree.minus(1).plus(2).divide(2).toTex()}`).to.equal(
		'\\frac{1}{2} x + 2'
	);
	expect(
		`${Polynomial.ofDegree(1, { ascending: true }).times(2).plus(1).toTex()}`
	).to.equal(`1 + 2 x`);
	expect(`${y2MinusYPlusHalf.replaceXWith('x').toTex()}`).to.equal(
		'x^2 - x + \\frac{1}{2}'
	);
	expect(`${y2MinusYPlusHalf.replaceXWith([1, 2]).toTex()}`).to.equal(
		'x^2 + 3 x + \\frac{5}{2}'
	);
	expect(
		`${y2MinusYPlusHalf.replaceXWith(new Polynomial([1, 2])).toTex()}`
	).to.equal('x^2 + 3 x + \\frac{5}{2}');
	expect(y2MinusYPlusHalf.slice(1).toTex()).to.equal('\\frac{1}{2}');
	expect(y2MinusYPlusHalf.changeAscending().toTex()).to.be.equal(
		`\\frac{1}{2} - y + y^2`
	);
	expect(threePlusX.changeAscending(false).toTex()).to.be.equal(`x + 3`);
	expect(new Polynomial('x', { ascending: true }).plus(1).toTex()).to.be.equal(
		`1 + x`
	);
	expect(y2MinusYPlusHalf.variables).to.eql(['y']);
	expect(two.variables).to.eql([]);
});

test('polynomial calculus', () => {
	expect(xPlusThree.definiteIntegral(-1, 3).toTex()).to.be.equal('16');
	expect(xPlusThree.integrate(5).toTex()).to.be.equal(
		'\\frac{1}{2} x^2 + 3 x + 5'
	);
	expect(xPlusThree.differentiate().isConstant()).to.be.true;
	expect(xPlusThree.differentiate().isConstant(2)).to.be.false;
	expect(xPlusThree.differentiate().isConstant(1)).to.be.true;
	expect(xPlusThree.differentiate().differentiate().toTex()).to.be.equal('0');
});

test('polynomial checks', () => {
	expect(xPlusThree.isConstant()).to.be.false;
	expect(xPlusThree.degree).to.be.equal(1);
	expect(xPlusThree.leadingCoeff.toTex()).to.be.equal('1');
});

test('polynomial to expression', () => {
	expect(xPlusThree.times('y').toTex()).to.equal('x y + 3 y');
	expect(xPlusThree.minus(new Term('y')).toTex()).to.equal('x + 3 - y');
	expect(xPlusThree.plus(new Expression('y', 1)).toTex()).to.equal('x + 4 + y');
});

test('polynomial JSON', () => {
	const polyJSON = JSON.stringify(xPlusThree);
	const xPlusThree_v2 = Polynomial.fromJSON(JSON.parse(polyJSON));
	expect(xPlusThree_v2.is.equalTo(xPlusThree)).to.be.true;
});
