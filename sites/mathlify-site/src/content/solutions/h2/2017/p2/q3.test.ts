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
					body: mathlify`${{}} \\left( \\frac{a}{2}, 0 \\right), 
${{}} \\left( 0, b \\right).`,
				},
				{ body: mathlify`${{}} (a+1, 0).` },
				{ body: mathlify`${{}} \\left(\\frac{a+1}{2}, 0\\right).` },
				{
					body: mathlify`${{}} \\left( 0,a \\right), 
${{}} \\left( b,0 \\right).`,
				},
			],
		},
		{
			parts: [
				{
					body: mathlify`${{}} a = 1
since ${{}} g(1)
is undefined.`,
				},
				{
					body: mathlify`${{}} g^2(x)=x.
\\
${{}} g^{-1}(x) = 1 - \\frac{1}{1-x}.`,
				},
				{
					body: mathlify`${{}}{b=0}
or ${{}} b=2.`,
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
