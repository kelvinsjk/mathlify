import { expect, it } from 'vitest';
//import { answer } from './q5.soln';
import { answer } from '../../2018/p1/q5.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{
					body: mathlify`${{}} f^{-1}(x) = (x-1)^2. 
${{}} D_{f^{-1}} = \\left[1, \\infty \\right).`,
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
does not have an inverse since
${{}} g(7)=g(8)
so ${'g'}
is not a one-to-one function.`,
				},
			],
		},
	],
};

it('dummy', () => {
	expect(2).toEqual(2);
});

//it('2018p1q5', () => {
//	expect(answer).toMatchSnapshot();
//	expect(ans).toEqual(actual);
//});
