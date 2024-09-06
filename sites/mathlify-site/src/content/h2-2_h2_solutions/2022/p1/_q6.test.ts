import { expect, it } from 'vitest';
import { answer } from './q6';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`Translate the curve ${''}{y=\\frac{1}{x}}
by ${'a'}
units in the positive ${{}} x\\text{-axis}
direction.
\\
Scale the resulting curve by a factor of ${{}} a^2 + k
parallel to the ${{}} y\\text{-axis}.
\\
Translate the resulting curve by ${'a'}
units in the positive ${{}} y\\text{-axis}
direction.`
		},
		{
			// TODO: change xa to ax
			body: mathlifier`${{}} f^{-1}(x) = \\frac{xa+k}{x-a}.`
		},
		{
			body: mathlifier`${{}} f^2(x) = x.`
		},
		{
			body: mathlifier`${{}} f^{2023}(1) = \\frac{a+k}{1-a}.`
		}
	]
};

it('2022p1q6', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
