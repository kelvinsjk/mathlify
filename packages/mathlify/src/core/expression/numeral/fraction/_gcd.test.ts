import { test, expect } from 'vitest';
import {
	gcd,
	//signed_gcd
} from './gcd';

test('gcd', () => {
	expect(() => gcd()).toThrow();
	expect(() => gcd(1.2)).toThrow();
	expect(() => gcd(0)).toThrow();
	expect(() => gcd(0, 0)).toThrow();
	expect(() => gcd(3, 1.2)).toThrow();
	expect(gcd(-1)).toEqual(1);
	expect(gcd(0, 4)).toEqual(4);
	expect(gcd(6, 4)).toEqual(2);
	expect(gcd(0, 0, -21)).toEqual(21);
	expect(gcd(6, 9, -21)).toEqual(3);
	//expect(signed_gcd(-6, -9, -21)).toEqual(-3);
	//expect(signed_gcd(6, -9, -21)).toEqual(3);
});
