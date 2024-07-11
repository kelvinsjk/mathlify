import { Polynomial, Rational } from '../../index';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const failing = suite('failing');

failing('2007-2009', () => {
	const num1 = new Polynomial([2, -1, -19]);
	const den = new Polynomial([1, 3, 2]);
	const term2 = new Polynomial([1]);
	const lhs = new Rational(num1, den);
	const rational = lhs.minus(term2);
	assert.is(``, '');
});

failing.run();
