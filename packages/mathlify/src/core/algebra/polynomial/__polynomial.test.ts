import { test, expect } from 'vitest';
import { Fraction } from '../../fraction';
import { Term } from '../term';
import { Polynomial } from './polynomial';

const two = new Polynomial([2]);
const twoXa = new Polynomial(2);
const twoXb = new Polynomial([2, 0]);
const xPlusThree = new Polynomial([1, 3]);
const threePlusX = new Polynomial([3, 1], { ascending: true });
const half = new Fraction(1, 2);
const y2MinusYPlusHalf = new Polynomial([1, -1, half], { variable: 'y' });

test('Expression', () => {
	//@ts-expect-error
	expect(() => new Polynomial()).to.throw();
	expect(`${twoXa}`).to.equal('2 x');
	expect(`${twoXb.minus(two)}`).to.equal('2 x - 2');
	expect(`${xPlusThree}`).to.equal('x + 3');
	expect(`${threePlusX}`).to.equal('3 + x');
	expect(`${y2MinusYPlusHalf}`).to.equal('y^2 - y + \\frac{1}{2}');
	expect(`${twoXa.minus(twoXb)}`).to.equal('0');
	expect(`${xPlusThree.times(threePlusX)}`).to.equal(`x^2 + 6 x + 9`);
	expect(`${xPlusThree.square()}`).to.equal(`x^2 + 6 x  + 9`);
	expect(xPlusThree.subIn(2).is.equalTo(5)).to.be.true;
});
