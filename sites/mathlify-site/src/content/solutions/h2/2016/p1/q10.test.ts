import { expect, it } from 'vitest';
import { answer } from './q10.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{
					body: mathlify`${{}} f^{-1}(x) = \\left( x - 1 \\right)^2.
\\
${{}} D_{f^{-1}} = R_f = \\left[1, \\infty \\right).`,
				},
				{ body: mathlify`${{}} x=2.62.` },
			],
		},
		{
			parts: [
				{
					body: mathlify`${{}} g(4) = 6.
\\
${{}} g(7)=8.
\\
${{}} g(12)=9.`,
				},
				{
					body: mathlify`${{}} g
does not have an inverse as ${{}} {g(7)=g(8)=8}
so ${'g'}
is not a one-to-one function.`,
				},
			],
		},
	],
};

it('2016p1q10', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
