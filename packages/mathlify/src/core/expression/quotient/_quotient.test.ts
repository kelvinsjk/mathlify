import { Quotient } from '.';
import { test, expect } from 'vitest';
import { to_Expression } from '../utils';

test('quotient', () => {
	const y = to_Expression('y');
	const twoOverX = new Quotient(2, 'x');
	expect(`${twoOverX}`).toBe('\\frac{2}{x}');
	const twoOverXV2 = twoOverX.clone();
	twoOverX.num = y;
	expect(`${twoOverXV2}`).toBe('\\frac{2}{x}');
	expect(`${twoOverX}`).toBe('\\frac{y}{x}');
});
