import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} \\ln \\left( \\frac{n+1}{n} \\right) - \\ln 2.`,
		},
		{ body: mathlify`${{}} - \\ln 2. ` },
		{ body: mathlify`${{}} \\ln \\frac{189}{200}.` },
	],
};

it('2023p1q5', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
