import { Exponent, Expression } from '..';

import { test, expect } from 'vitest';
import { to_Expression } from '../utils';

test('exponents', () => {
	const x2 = new Exponent(new Expression('x'), to_Expression(2));
	expect(`${x2}`).toBe('x^2');
	const threeSquare = x2.subIn({ x: to_Expression(3) }, { verbatim: true });
	expect(`${threeSquare}`).toBe('3^2');
});
