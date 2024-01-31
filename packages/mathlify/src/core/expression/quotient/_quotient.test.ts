import { Quotient } from '.';
import { Expression } from '../../';
import { test, expect } from 'vitest';

test('quotient', () => {
	const y = new Expression('y');
	const twoOverX = new Quotient(2, 'x');
	expect(`${twoOverX}`).toBe('\\frac{2}{x}');
	const twoOverXV2 = twoOverX.clone();
	twoOverX.num = y;
	expect(`${twoOverXV2}`).toBe('\\frac{2}{x}');
	expect(`${twoOverX}`).toBe('\\frac{y}{x}');
});
