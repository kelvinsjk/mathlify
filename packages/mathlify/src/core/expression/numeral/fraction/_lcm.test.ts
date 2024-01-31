import { test, expect } from 'vitest';
import { lcm } from './lcm';

test('lcm', () => {
	expect(() => lcm(0, 1)).toThrow();
	expect(() => lcm(3, 1.2)).toThrow();
	expect(lcm(6, 9)).toEqual(18);
});
