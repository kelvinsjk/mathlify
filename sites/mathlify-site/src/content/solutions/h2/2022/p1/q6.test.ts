import { expect, it } from 'vitest';
import { answer } from './q6.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`Translate the curve ${''}{y=\\frac{1}{x}}
by ${'a'}
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
			// TODO: change xa to ax
			body: mathlify`${{}} f^{-1}(x) = \\frac{xa+k}{x-a}.`,
		},
		{
			body: mathlify`${{}} f^2(x) = x.`,
		},
		{
			body: mathlify`${{}} f^{2023}(1) = \\frac{a+k}{1-a}.`,
		},
	],
};

it('2022p1q6', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
