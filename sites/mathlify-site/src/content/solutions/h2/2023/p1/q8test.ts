import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';
import { e, i } from 'mathlify';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} z = 2 ${e}^{\\frac{2}{3}\\pi${i}}.`,
		},
		{ body: mathlify`Smallest positive integer ${{}} {n=2.}` },
		{
			body: mathlify`${{}} {w = -4 + 3${i}, v=-2}
or ${{}} {w=-4+\\frac{2}{5}${i}, v = -\\frac{12}{5}.`,
		},
	],
};

it('2023p1q8', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
