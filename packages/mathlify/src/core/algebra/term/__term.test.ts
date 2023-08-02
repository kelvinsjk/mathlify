import { Fraction, Term, } from '../../index.js';
import { test, expect } from 'vitest';

test('Terms', () => {
	expect(`${new Term(1, 'x')}`).to.equal('x');
	expect(`${new Term(-1, 'x')}`).to.equal('- x');
	expect(`${new Term(2, 'x')}`).to.equal('2 x');
	expect(`${new Term(0, 'x')}`).to.equal('0');
	expect(`${new Term('y', {variable: 'x', power: 2})}`).to.equal('y x^2');
	expect(`${new Term({variable: 'x', power: 20}, 'y')}`).to.equal('x^{20} y');
	expect(`${new Term('x', {variable: 'x', power: -1}, '')}`).to.equal('1');
});

test('Fractions', () => {
	const threeFifthX = new Term(new Fraction(3, 5), 'x');
	expect(`${threeFifthX}`).to.equal('\\frac{3}{5} x');
	threeFifthX.setFractionalDisplay();
	expect(`${threeFifthX}`).to.equal('\\frac{3 x}{5}');
	threeFifthX.setCoeffDisplay();
	expect(`${threeFifthX}`).to.equal('\\frac{3}{5} x');
	const oneOverX = new Term({variable: 'x', power: -1}).setFractionalDisplay();
	expect(`${oneOverX}`).to.equal('\\frac{1}{x}');
	expect(`${new Term('x', 'y').setFractionalDisplay()}`).to.equal('x y');
	expect(`${new Term('x', 'y', -1).setFractionalDisplay()}`).to.equal('- x y');
	expect(`${new Term('x', 'y', 2).setFractionalDisplay()}`).to.equal('2 x y');
	expect(`${new Term('x', new Fraction(1,5)).setFractionalDisplay()}`).to.equal('\\frac{x}{5}');
	expect(`${new Term('x', new Fraction(-1,5), {variable: 'y', power: -1}).setFractionalDisplay()}`).to.equal('\\frac{- x}{5 y}');

})