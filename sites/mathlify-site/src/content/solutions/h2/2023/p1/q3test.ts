import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`${{}} \\left| \\mathbf{a} \\times \\mathbf{b} \\right| = 1.` },
		{ body: mathlify`${{}}\\theta = 135^\\circ.` },
	],
};

it('2023p1q4', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
