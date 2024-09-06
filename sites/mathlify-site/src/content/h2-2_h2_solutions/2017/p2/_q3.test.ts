import { expect, it } from 'vitest';
import { answer } from './q3';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{
					body: mathlifier`${{}} \\left( \\frac{a}{2}, 0 \\right), 
${{}} \\left( 0, b \\right).`
				},
				{ body: mathlifier`${{}} \\left(a+1, 0\\right).` },
				{ body: mathlifier`${{}} \\left(\\frac{a+1}{2}, 0\\right).` },
				{
					body: mathlifier`${{}} \\left( 0,a \\right), 
${{}} \\left( b,0 \\right).`
				}
			]
		},
		{
			parts: [
				{
					body: mathlifier`${{}} a = 1.
\\
It must be excluded as ${'g'}
is not defined when ${'{x=1.}'}`
				},
				{
					body: mathlifier`${{}} g^2(x)=x.
\\
${{}} g^{-1}(x) = 1 - \\frac{1}{1-x}.`
				},
				{
					body: mathlifier`${{}}{b=0}
or ${{}} {b=2.}`
				}
			]
		}
	]
};

it('2017p2q3', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
