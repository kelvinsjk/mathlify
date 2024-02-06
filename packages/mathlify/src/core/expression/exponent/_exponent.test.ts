import { Exponent } from '.';
import { Expression } from '..';

import { test, expect } from 'vitest';

test('exponents', () => {
	const x2 = new Exponent('x', new Expression(2));
	expect(`${x2}`).toBe('x^2');
	const threeSquare = x2.subIn({ x: new Expression(3) }, { verbatim: true });
	expect(`${threeSquare}`).toBe('3^2');
});
