import { sum, product, quotient } from '../../../src/';
import { test, expect } from 'vitest';

test('sub in', () => {
	let q = sum([2, 'x'], [3, 'y']);
	expect(`${q}`).toBe('2x + 3y');
	q = sum([2, 'x'], [-3, 'y']);
	expect(`${q}`).toBe('2x - 3y');
	q = product(2, 'x', 'y');
	expect(`${q}`).toBe('2xy');
	q = quotient(product('x', 'y'), 3);
	expect(`${q}`).toBe('\\frac{xy}{3}');
});
