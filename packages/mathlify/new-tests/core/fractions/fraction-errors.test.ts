import { expect, test } from 'vitest';
import { fraction } from '../../../src';

test('fraction constructor errors', () => {
	expect(() => fraction(1, 0)).toThrow();
	expect(() => fraction(1.2)).toThrow();
});
