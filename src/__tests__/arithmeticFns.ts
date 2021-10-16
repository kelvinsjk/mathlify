import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';

import { gcd } from '../index';

const arithmeticFns = suite('arithmetic functions')

arithmeticFns('gcd', () => {
	assert.throws(() => gcd(0, 0));
	assert.throws(() => gcd());
	assert.throws(() => gcd(1, 1.2));
	assert.is(gcd(-3), 3);
	assert.is(gcd(0, 2), 2);
	assert.is(gcd(1, 2), 1);
	assert.is(gcd(60, 50), 10);
	assert.is(gcd(60, -50), 10);
	assert.is(gcd(-60, -50), 10);
	assert.is(gcd(0,0,5), 5);
	assert.is(gcd(5,0,0), 5);
	assert.is(gcd(60,50,6), 2);
});

arithmeticFns.run();