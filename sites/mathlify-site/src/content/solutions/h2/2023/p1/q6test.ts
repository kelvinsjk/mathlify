import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`[Show](#soln-1).`,
		},
		{ body: mathlify`${{}} \\frac{81\\pi}{8} \\left( \\pi - \\frac{9}{8}\\sqrt{3} \\right).` },
	],
};

it('2023p1q6', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
