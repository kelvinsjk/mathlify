import { expect, it } from 'vitest';
import { answer } from './q3';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`${{}} f^{-1}(x) = \\frac{ax}{bx-a}.

${{}} f^2(x) = x.

${{}} R_{f^2} = \\left(-\\infty, \\frac{a}{b} \\right) \\cup \\left( \\frac{a}{b}, \\infty \\right).`
		},
		{
			body: mathlifier`The composite function ${'fg'}
does not exist as ${{}} {R_g \\not \\subseteq D_f.}`
		},
		{
			body: mathlifier`${{}} x=0 \\text{ or } \\frac{2a}{b}.`
		}
	]
};

it('2009p2q3', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
