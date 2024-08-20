import { expect, it } from 'vitest';
import { answer } from './q3.soln';
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
				{ body: mathlify`${{}} \\left(a+1, 0\\right).` },
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
					body: mathlify`${{}} a = 1.
\\
It must be excluded as ${'g'}
is not defined when ${'{x=1.}'}`,
				},
				{
					body: mathlify`${{}} g^2(x)=x.
\\
${{}} g^{-1}(x) = 1 - \\frac{1}{1-x}.`,
				},
				{
					body: mathlify`${{}}{b=0}
or ${{}} {b=2.}`,
				},
			],
		},
	],
};

it('2017p2q3', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
