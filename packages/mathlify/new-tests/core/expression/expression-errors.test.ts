import { expect, test } from 'vitest';
import { sum } from '../../../src/';

test('_get methods expected to throw under certain scenarios', () => {
	const sum1 = sum(1, 'x');
	expect(() => sum1._getProductTerms()).toThrow();
	expect(() => sum1._getNumeral()).toThrow();
});
