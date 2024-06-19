import { Quotient, Expression } from '..';
import { test, expect } from 'vitest';

test('quotient', () => {
	const y = new Expression('y');
	const twoOverX = new Quotient(new Expression(2), new Expression('x'));
	expect(`${twoOverX}`).toBe('\\frac{2}{x}');
	const twoOverXV2 = twoOverX.clone();
	twoOverX.num = y;
	expect(`${twoOverXV2}`).toBe('\\frac{2}{x}');
	expect(`${twoOverX}`).toBe('\\frac{y}{x}');
});
