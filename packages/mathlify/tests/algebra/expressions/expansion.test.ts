import { sum, product, Expression, productVerbatim } from '../../../src/';
import { test, expect } from 'vitest';

test('expansion', () => {
	const xPlus2 = sum('x', 2);

	let q = xPlus2;
	q.expand();
	expect(`${q}`).toBe('x + 2');
	q = product(2, 'x', 'y');
	q.expand();
	expect(`${q}`).toBe('2xy');
	q = product(xPlus2);
	q.expand();
	expect(`${q}`).toBe('x + 2');

	q = product(3, xPlus2);
	expect(`${q}`).toBe('3\\left( x + 2 \\right)');
	q.expand();
	expect(`${q}`).toBe('3x + 6');
	q = product(-1, [product(2, 'y'), product(-1, 'x')]);
	expect(`${q}`).toBe('- \\left( 2y - x \\right)');
	q.expand();
	expect(`${q}`).toBe('- 2y + x');

	q = productVerbatim(['()', product(-1, 'x')], ['()', product(-2, 'y')]);
	q.multiplicationSign = ' \\times ';
	expect(`${q}`).toBe('\\left( - x \\right) \\times \\left( - 2y \\right)');
	q.simplify();
	q.multiplicationSign = '';
	expect(`${q}`).toBe('2xy');

	q = product(4, 'a', sum([2, 'x'], [-1, 'y']));
	expect(`${q}`).toBe('4a\\left( 2x - y \\right)');
	q.expand();
	expect(`${q}`).toBe('8ax - 4ay');

	q = sum(product(2, sum([3, 'x'], 'y')), 'x', [-1, 'y']);
	expect(`${q}`).toBe('2\\left( 3x + y \\right) + x - y');
	const q2 = q.clone();
	q.expand();
	expect(`${q}`).toBe('7x + y');
	q2.expand({ verbatim: true });
	expect(`${q2}`).toBe(`6x + 2y + x - y`);
	q2.simplify();
	expect(`${q2}`).toBe('7x + y');
	q = sum(product(2, sum('x', [3, 'y'])), product(-1, xPlus2));
	expect(`${q}`).toBe('2\\left( x + 3y \\right) - \\left( x + 2 \\right)');
	q.expand({ verbatim: true });
	q.simplify({ product: true });
	expect(`${q}`).toBe('2x + 6y - x - 2');
	q.simplify();
	expect(`${q}`).toBe('x + 6y - 2');

	q = product(-3, sum([2, 'x'], product(-1, 'a', sum(product(5, 'y'), product(-1, sum([3, 'x'], 'y'))))));
	expect(`${q}`).toBe('- 3\\left( 2x - a\\left( 5y - \\left( 3x + y \\right) \\right) \\right)');
	q.expand();
	expect(`${q}`).toBe('- 6x + 12ay - 9ax');
});

test('expansion 2', () => {
	let q = product(sum([3, 'a'], 'b'), sum([2, 'x'], [-1, 'y'], 3));
	expect(`${q}`).toBe('\\left( 3a + b \\right)\\left( 2x - y + 3 \\right)');
	q.expand();
	expect(`${q}`).toBe('6ax - 3ay + 9a + 2bx - by + 3b');

	q = sum(product(3, 'x', sum('x', 9)), product(-1, 'x', sum([2, 'x'], 3)));
	expect(`${q}`).toBe('3x\\left( x + 9 \\right) - x\\left( 2x + 3 \\right)');
	q.expand({ verbatim: true });
	expect(`${q}`).toBe('3x^2 + 27x - 2x^2 - 3x');
	q.simplify();
	expect(`${q}`).toBe('x^2 + 24x');

	q = product(sum([2, 'x'], 1), sum('x', -3));
	expect(`${q}`).toBe('\\left( 2x + 1 \\right)\\left( x - 3 \\right)');
	q.expand({ verbatim: true });
	expect(`${q}`).toBe('2x^2 - 6x + x - 3');
	q.simplify();
	expect(`${q}`).toBe('2x^2 - 5x - 3');
	q = product(sum([2, 'x'], 1), sum('x', -3));
	q.expand();
	expect(`${q}`).toBe('2x^2 - 5x - 3');
});
