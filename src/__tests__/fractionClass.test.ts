import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, JSONParse } from '../index';

const fractionClass = suite('Fraction class');

const one = Fraction.ONE;
const zero = Fraction.ZERO;
const two = new Fraction(2, 1);
const negativeThree = new Fraction(-3);
const oneHalf = new Fraction(1, 2);
const oneThird = new Fraction(-1, -3);
const oneSixth = new Fraction(3, 18);
const negativeThreeQuarter = new Fraction(-6, 8);
const nineSixteenth = negativeThreeQuarter.square();
const negativeTwoFifth = new Fraction(2, -5);
const twentyTwoOverSeven = new Fraction(22, 7);

const oneSixthFloat = 1 / 6;
//const threePointOneFourFraction = new Fraction(3.14);

fractionClass('fraction arithmetic', () => {
	assert.throws(() => new Fraction(1, 0));
	assert.throws(() => new Fraction(1.5, 3));
	assert.throws(() => new Fraction(1, 3.1));
	assert.throws(() => new Fraction(oneSixthFloat));

	assert.is(negativeThree.num, -3);
	assert.is(negativeThree.den, 1);
	assert.is(oneHalf.num, 1);
	assert.is(oneHalf.negative().num, -1);
	assert.is(oneHalf.den, 2);
	assert.is(oneThird.num, 1);
	assert.is(oneThird.den, 3);
	assert.is(negativeThreeQuarter.num, -3);
	assert.is(negativeThreeQuarter.den, 4);
	assert.is(negativeTwoFifth.num, -2);
	assert.is(negativeTwoFifth.den, 5);
	//assert.is(threePointOneFourFraction.num,157);
	//assert.is(threePointOneFourFraction.den,50);

	assert.is(two.isEqualTo(2), true);
	assert.is(one.divide(two).isEqualTo(oneHalf), true);
	assert.is(oneHalf.minus(oneThird).isEqualTo(oneSixth), true);
	assert.is(oneSixth.isEqualTo(oneHalf), false);
	assert.is(zero.isInteger(), true);
	assert.is(negativeThree.isInteger(), true);
	assert.is(oneHalf.isInteger(), false);

	assert.is(oneHalf.plus(negativeThreeQuarter).num, -1);
	assert.is(oneHalf.plus(negativeThreeQuarter).den, 4);
	assert.is(oneHalf.plus(1).num, 3);
	assert.is(oneHalf.plus(1).den, 2);
	assert.is(negativeThreeQuarter.minus(negativeTwoFifth).num, -7);
	assert.is(negativeThreeQuarter.minus(negativeTwoFifth).den, 20);
	assert.is(negativeThreeQuarter.minus(2).num, -11);
	assert.is(negativeThreeQuarter.minus(2).den, 4);
	assert.is(negativeThreeQuarter.times(negativeTwoFifth).num, 3);
	assert.is(negativeThreeQuarter.times(negativeTwoFifth).den, 10);
	assert.is(negativeThreeQuarter.times(-6).num, 9);
	assert.is(negativeThreeQuarter.times(-6).den, 2);
	assert.throws(() => oneSixth.divide(zero));
	assert.is(negativeTwoFifth.divide(oneHalf).num, -4);
	assert.is(negativeTwoFifth.divide(oneHalf).den, 5);
	assert.is(negativeTwoFifth.divide(-6).num, 1);
	assert.is(negativeTwoFifth.divide(-6).den, 15);
	assert.throws(() => oneSixth.pow(1.2));
	assert.is(oneSixth.pow(-2).isEqualTo(36), true);
	assert.is(negativeTwoFifth.pow(0).num, 1);
	assert.is(negativeTwoFifth.pow(0).den, 1);
	assert.is(negativeTwoFifth.pow(1).num, -2);
	assert.is(negativeTwoFifth.pow(1).den, 5);
	assert.is(negativeTwoFifth.pow(2).num, 4);
	assert.is(negativeTwoFifth.pow(2).den, 25);
	assert.is(negativeTwoFifth.pow(3).num, -8);
	assert.is(negativeTwoFifth.pow(3).den, 125);

	assert.is(one.valueOf(), 1);
	assert.is(oneHalf.valueOf(), 0.5);
});

fractionClass('string methods', () => {
	assert.is(one.toString(), '1');
	assert.is(`${negativeThree}`, '- 3');
	assert.is(`${nineSixteenth}`, '\\frac{9}{16}');
	assert.is(`${oneHalf}`, '\\frac{1}{2}');
	assert.is(`${negativeThreeQuarter}`, '- \\frac{3}{4}');
	assert.is(two.toFixed(), '2');
	assert.is(twentyTwoOverSeven.toFixed(), '3');
	assert.is(twentyTwoOverSeven.toFixed(2), '3.14');
	assert.is(twentyTwoOverSeven.toPrecision(3), '3.14');
	assert.is(oneSixth.times(-1).toPrecision(3), '-0.167');
	//assert.is(negativeThreeQuarter.toTerm().toString(),'- \\frac{3}{4}');
});

/* fractionClass('toFactor', () => {
	assert(`${one.toFactor()}`,'x - 1');
	assert(`${zero.toFactor()}`,'x');
	assert(`${oneHalf.toFactor()}`,'2 x - 1');
	assert(`${oneHalf.toFactor().multiply(-1)}`,'- 2 x + 1');
	assert(`${negativeThreeQuarter.toFactor()}`,'4 x + 3');
	assert(`${negativeThreeQuarter.toFactor({ variableAtom: 'y', ascending: true })}`,'3 + 4 y');
});
 */

fractionClass('gcd', () => {
	assert.is(`${Fraction.gcd(negativeThreeQuarter)}`, '- \\frac{3}{4}');
	assert.is(`${Fraction.gcd(negativeThreeQuarter, oneSixth)}`, '\\frac{1}{12}');
	assert.is(`${Fraction.gcd(twentyTwoOverSeven, negativeTwoFifth, 4)}`, '\\frac{2}{35}');
	assert.is(`${Fraction.gcd(0, 0, negativeTwoFifth)}`, '\\frac{2}{5}');
	assert.is(`${Fraction.factorize(negativeThreeQuarter, oneSixth)[0][0]}`, '- 9');
	assert.is(`${Fraction.factorize(negativeThreeQuarter, oneSixth)[0][1]}`, '2');
	assert.is(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[1]}`, '\\frac{2}{35}');
	assert.is(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][0]}`, '55');
	assert.is(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][1]}`, '- 7');
	assert.is(`${Fraction.factorize(twentyTwoOverSeven, negativeTwoFifth, 4)[0][2]}`, '70');
	assert.is(`${Fraction.factorize(negativeThreeQuarter, negativeTwoFifth)[1]}`, '- \\frac{1}{20}');
	assert.is(`${Fraction.factorize(negativeThreeQuarter, negativeTwoFifth)[0][0]}`, '15');
	assert.is(`${Fraction.factorize(negativeThreeQuarter, negativeTwoFifth)[0][1]}`, '8');

	assert.throws(() => Fraction.gcd());
});

fractionClass('comparison and misc', () => {
	assert.is(oneSixth.clone().isGreaterThan(oneSixth), false);
	assert.is(oneSixth.isAtLeast(oneSixth), true);
	assert.is(oneSixth.isLessThan(5), true);
	assert.is(oneSixth.isAtMost(-2), false);
	assert.is(oneSixth.sign(), 1);
	assert.is(`${oneSixth.round()}`, '0');
	assert.is(`${oneSixth.floor()}`, '0');
	assert.is(`${oneSixth.ceil()}`, '1');
	assert.is(`${negativeThreeQuarter.abs()}`, '\\frac{3}{4}');
});


fractionClass.run();
