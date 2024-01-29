import { Variable } from '.';
import { test, expect } from 'vitest';

test('variable', () => {
	const x = new Variable('x');
	expect(`${x}`).toBe('x');
	const x2 = x.clone();
	x2.name = 'y';
	expect(`${x}`).toBe('x');
	expect(`${x2}`).toBe('y');
});
