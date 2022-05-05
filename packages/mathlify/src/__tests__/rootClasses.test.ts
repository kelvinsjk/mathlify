import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, SquareRoot, NthRoot } from '../index';

const rootClasses = suite('root classes');

const zero = new SquareRoot(0);
const two = new SquareRoot(4);
const sqrtTwo = new SquareRoot(2);
const threeSqrtTwo = new SquareRoot(2, 3);
const oneSixthRootThree = new SquareRoot(new Fraction(1, 12));
const cubeRootTwo = new NthRoot(3, 2);
const four = new NthRoot(3, 64);

rootClasses('throws', () => {
	assert.throws(() => new SquareRoot(-1));
	assert.throws(() => new NthRoot(1.2, 3));
	assert.throws(() => new NthRoot(3, -2));
	assert.throws(() => sqrtTwo.pow(-1));
	assert.throws(() => cubeRootTwo.pow(-1));
	assert.throws(() => cubeRootTwo.toFraction());
	assert.throws(() => cubeRootTwo.times(sqrtTwo));
	assert.throws(() => cubeRootTwo.divide(sqrtTwo));
});

rootClasses('toString', () => {
	assert.is(`${zero}`, '0');
	assert.is(`${two}`, '2');
	assert.is(`${sqrtTwo}`, '\\sqrt{2}');
	assert.is(`${threeSqrtTwo}`, '3 \\sqrt{2}');
	assert.is(`${oneSixthRootThree}`, '\\frac{1}{6} \\sqrt{3}');
	assert.is(`${cubeRootTwo}`, '\\sqrt[3]{2}');
});

rootClasses('arithmetic', () => {
	assert.is(`${cubeRootTwo.pow(4)}`, '\\sqrt[3]{16}');
	assert.is(`${threeSqrtTwo.pow(3)}`, '54 \\sqrt{2}');
	assert.is(`${oneSixthRootThree.times(sqrtTwo).negative()}`, '- \\frac{1}{6} \\sqrt{6}');
	assert.is(sqrtTwo.divide(threeSqrtTwo).isRational(), true);
	assert.is(threeSqrtTwo.square().isEqualTo(18), true);
	assert.is(`${cubeRootTwo.times(new NthRoot(3, 3))}`, '\\sqrt[3]{6}');
	assert.is(`${cubeRootTwo.divide(new NthRoot(3, 3))}`, '\\sqrt[3]{\\frac{2}{3}}');
	assert.is(`${sqrtTwo.reciprocal()}`, '\\frac{1}{2} \\sqrt{2}');
	assert.is(`${cubeRootTwo.times(2)}`, '2 \\sqrt[3]{2}');
	assert.is(`${cubeRootTwo.divide(2)}`, '\\frac{1}{2} \\sqrt[3]{2}');
	assert.is(`${threeSqrtTwo.times(3)}`, '9 \\sqrt{2}');
	assert.is(`${threeSqrtTwo.divide(3)}`, '\\sqrt{2}');
});

rootClasses('type conversions', () => {
	assert.is(cubeRootTwo.isRational(), false);
	assert.is(sqrtTwo.valueOf().toFixed(2), '1.41');
	assert.is(sqrtTwo.isEqualTo(threeSqrtTwo), false);
	assert.is(oneSixthRootThree.isEqualTo(new SquareRoot(3, new Fraction(1, 6))), true);
	assert.is(four.toFraction().isEqualTo(4), true);
	assert.is(four.isEqualTo(new Fraction(4)), true);
});

rootClasses('clone', () => {
	const sqrtTwoClone = sqrtTwo.clone();
	sqrtTwoClone.radicand = new Fraction(3);
	assert.is(sqrtTwo.radicand.isEqualTo(2), true);
	assert.is(sqrtTwoClone.radicand.isEqualTo(3), true);
	const cubeRootTwoClone = cubeRootTwo.clone();
	cubeRootTwoClone.radicand = new Fraction(3);
	assert.is(cubeRootTwo.radicand.isEqualTo(2), true);
	assert.is(cubeRootTwoClone.radicand.isEqualTo(3), true);
});

rootClasses.run();
