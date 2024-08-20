import { expect, it } from 'vitest';
import { answer } from './q7.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`[Show](#soln-1).` },
		{ body: mathlify`[Sketch](#soln-2).` },
		{
			body: mathlify`Line of symmetry: ${{}} {y=x.}

Translate the curve ${{}} {y=\\frac{1}{x}}
by ${1}
unit in the positive ${{}} x\\text{-axis}
direction.
\\
Scale the resulting curve by a factor of ${'1+k'}
parallel to the ${{}} y\\text{-axis}.
\\
Translate the resulting curve by ${1}
unit in the positive ${{}} y\\text{-axis}
direction.`,
		},
	],
};

it('2012p1q7', () => {
	expect(ans).toEqual(actual);
	expect(ans).toMatchSnapshot();
});
