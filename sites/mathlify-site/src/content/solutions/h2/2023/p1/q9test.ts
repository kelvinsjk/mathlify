import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} a=2.
\\
Coordinates of ${{}} B = \\left(1,3,6\\right).`,
		},
		{ body: mathlify`${{}} \\frac{20}{\\sqrt{14}}.` },
		{
			body: mathlify`${{}} \\theta = 63.0^\\circ`,
		},
		{
			body: mathlify`${{}} -3x+4y+z-15.`,
		},
	],
};

it('2023p1q9', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
