import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';

import { gcd, getRandomInt, getRandomVec, Vector } from '../index';

const arithmeticFns = suite('arithmetic and random functions');

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
	assert.is(gcd(0, 0, 5), 5);
	assert.is(gcd(5, 0, 0), 5);
	assert.is(gcd(60, 50, 6), 2);
});

arithmeticFns('getRandomInt', () => {
	assert.is(getRandomInt() <= 9, true);
	assert.is(getRandomInt() >= -9, true);
	assert.throws(() => getRandomInt(1, 3, { avoid: [1, 2, 3] }));
	assert.not.throws(() => getRandomInt(1, 3, { avoid: [1, 3, 4] }));
	assert.is(getRandomInt(1, 3, { avoid: [1, 3, 4] }), 2);
	// 99% chance of 100% coverage
	assert.is(getRandomInt(1, 10, { avoid: [1, 2, 3, 4, 5, 6, 7, 8, 9] }), 10);
	assert.is(getRandomInt(1, 10, { avoid: [1, 2, 3, 5, 6, 7, 8, 9, 10] }), 4);
});

arithmeticFns('getRandomVec', () => {
	// 99% chance of 100% coverage
	for (let i = 0; i < 35; i++) {
		assert.is(getRandomVec({ min: 0, max: 1, nonzero: true }).isEqualTo(Vector.ZERO), false);
	}
	const simplifiedVec = getRandomVec({ simplify: true });
	assert.is(gcd(simplifiedVec.x.num, simplifiedVec.y.num, simplifiedVec.z.num), 1);
});

arithmeticFns.run();
