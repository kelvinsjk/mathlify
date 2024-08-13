import { expect, it } from 'vitest';
//import { answer } from './q6.soln';
import { answer } from '../../2015/p2/q3.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`Translate the curve by ${'a'}
units in the positive ${{}} x\\text{-axis}
direction.
\\
Scale the resulting curve by a factor of ${{}} a^2 + k
parallel to the ${{}} y\\text{-axis}.
\\
Translate the resulting curve by ${'a'}
units in the positive ${{}} y\\text{-axis}
direction.`,
		},
		{
			body: mathlify`${{}} f^{-1}(x) = \\frac{ax+k}{x-a}.`,
		},
		{
			body: mathlify`${{}} f^2(x) = x.`,
		},
		{
			body: mathlify`f^{2023}(1) = \\frac{a+k}{1-a}.`,
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
