import { expect, it } from 'vitest';
import { answer } from './q7';
import { mathlifierDj } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlifierDj`[Sketch](#soln-1).` },
		{ body: mathlifierDj`${{}}R_f = \\left[ 0, \\infty \\right).` },
		{
			body: mathlifierDj`${{}}f^2
does not exist as ${{}} {R_{f} \\not  \\subseteq D_{f}.}`
		},
		{ body: mathlifierDj`Greatest value of ${{}} {a = - 2.}` },
		{
			body: mathlifierDj`${{}} f^{-1}(x) = \\frac{3x + 4}{x - 2}.
\\
${{}} D_{f^{-1}} = R_f = \\left[ 0, 2 \\right).`
		}
	]
};

it('2023p1q7', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
