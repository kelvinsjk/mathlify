import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';
import { e } from 'mathlify';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} \\frac{\\mathrm{d}M}{\\mathrm{d}t} = k\\left(C-30M\\right).`,
		},
		{ body: mathlify`${{}} 3300.` },
		{
			body: mathlify`${{}} M = 88 + 22${e}^{-30kt}.`,
		},
		{
			body: mathlify`${{}} 51.`,
		},
		{
			parts: [
				{ body: mathlify`[Sketch](#soln-5-part-1).` },
				{ body: mathlify`${{}} 0 < C < 2400.` },
			],
		},
	],
};

it('2023p1q10', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
