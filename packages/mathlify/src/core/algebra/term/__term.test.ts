import { Fraction } from '../../fraction';
import { Term } from './term';
import { test, expect } from 'vitest';

test('Terms', () => {
	expect(`${new Term(1, 'x')}`).to.equal('x');
	expect(`${new Term(-1, 'x')}`).to.equal('- x');
	expect(`${new Term(2, 'x')}`).to.equal('2 x');
	-expect(`${new Term(0, 'x')}`).to.equal('0');
	expect(`${new Term('y', { variable: 'x', power: 2 })}`).to.equal('y x^2');
	expect(`${new Term({ variable: 'x', power: 20 }, 'y')}`).to.equal('x^{20} y');
	expect(`${new Term('x', { variable: 'x', power: -1 }, '')}`).to.equal('1');
	expect(`${new Term(['x', 2])}`).to.equal('x^2');
	expect(new Term(2).type).to.equal('term-frac');
	expect(new Term(2).kind).to.equal('term');
});

const threeFifth = new Fraction(3, 5);
test('Term Fractional Display', () => {
	const threeFifthX = new Term(threeFifth, 'x');
	expect(`${threeFifthX}`).to.equal('\\frac{3}{5} x');
	threeFifthX.setDisplayMode('always');
	expect(`${threeFifthX}`).to.equal('\\frac{3 x}{5}');
	threeFifthX.setDisplayMode('never');
	expect(`${threeFifthX}`).to.equal('\\frac{3}{5} x');
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

	expect(`${oneOverX1}`).to.equal('\\frac{1}{x}');
	expect(`${oneOverX2}`).to.equal('x^{- 1}');
	expect(`${oneOverX3}`).to.equal('\\frac{1}{x}');
	const negativeOneOverX = new Term(-1).divide('x', {
		fractionalDisplayMode: 'always',
	});
	expect(`${negativeOneOverX}`).to.equal('- \\frac{1}{x}');
	expect(
		`${threeFifthX.reciprocal({ fractionalDisplayMode: 'never' })}`
	).to.equal('\\frac{5}{3} x^{- 1}');
	expect(`${new Term('x').setDisplayMode('always')}`).to.equal('x');
	expect(`${new Term('x', -1).setDisplayMode('always')}`).to.equal('- x');
	expect(`${new Term('x', 2).setDisplayMode('always')}`).to.equal('2 x');
	expect(`${new Term('x', new Fraction(3, 5), ['y', -1])}`).to.equal(
		'\\frac{3 x}{5 y}'
	);
});

const x = new Term('x');
const y = new Term('y');

test('Term multiplication', () => {
	expect(`${x.times('x')}`).to.equal('x^2');
	expect(`${x.times('z')}`).to.equal('x z');
	expect(`${x.times(2)}`).to.equal('2 x');
	expect(`${x.negative()}`).to.equal('- x');
	expect(`${x.times(new Fraction(1, 2))}`).to.equal('\\frac{1}{2} x');
	expect(`${x.times(y)}`).to.equal('x y');
	expect(`${x.divide('y', { fractionalDisplayMode: 'never' })}`).to.equal(
		'x y^{- 1}'
	);
	expect(
		`${x.negative().divide('y', { fractionalDisplayMode: 'never' })}`
	).to.equal('- x y^{- 1}');
	expect(`${x.divide(y)}`).to.equal('\\frac{x}{y}');
	expect(`${x.divide(2, { fractionalDisplayMode: 'always' })}`).to.equal(
		'\\frac{x}{2}'
	);
	expect(`${x.divide(x)}`).to.equal('1');
});

test('Term sub in method', () => {
	expect(`${x.subIn(2)}`).to.equal('2');
	expect(`${new Term({ variable: 'x', power: 2 }).subIn(2)}`).to.equal('4');
	expect(() => {
		new Term({ variable: 'x', power: new Fraction(1, 2) }).subIn(2);
	}).to.throw();
	const xy = new Term('x', 'y');
	expect(`${xy.subIn(2)}`).to.equal('2 y');
	expect(`${xy.subIn({ y: 2 })}`).to.equal('2 x');
	const xy2 = xy.subIn({ z: 2 });
	expect(`${xy2}`).to.equal('x y');
	expect(`${xy.subIn({ x: 2, y: 3 })}`).toBe('6');
});

test('Term casting', () => {
	const threeFifthTerm = new Term(threeFifth);
	// @ts-expect-error
	expect(threeFifth.is.equalTo(threeFifthTerm)).toBe(false);
	expect(threeFifth.is.equalTo(threeFifthTerm.cast.toFraction())).toBe(true);
	expect(() => {
		new Term('x').cast.toFraction();
	}).to.throw();
});
