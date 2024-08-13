import { Answer } from '$content/solutions/answerObject';
import { fnTerm } from 'mathlify';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import {
	generateAns,
	generateFracFnDefinition,
} from '$content/learn/h2/fns/04-more/01-self-inverse.practice';
import { EquationWorking, solve } from 'mathlify/working';

export const answer = new Answer();

// f(x) = ax/(bx-a)
// g(x) = 1/x

const fState: Parameters<typeof generateFracFnDefinition>[0] = {
	// (bx+k)/(cx+a)
	fnType: 'frac',
	a: '-a',
	b: 'a',
	c: 'b',
	k: 0,
	n: 2,
	show: false,
};
const fExp = generateFracFnDefinition(fState, { for: true })[1];
// a
{
	const { ans, soln } = generateAns(fState, fExp, 'f');
	answer.addPart(
		ans +
			mathlify`${{}}R_{f^2} = \\left( -\\infty, \\frac{a}{b} \\right) \\cup \\left( \\frac{a}{b}, \\infty \\right).`,
		soln,
	);
}
// b
{
	const soln = mathlifyQED`$${'align*'} R_g &= \\left( -\\infty, 0 \\right) \\cup \\left( 0, \\infty \\right)
\\\\ D_f &= \\left( -\\infty, \\frac{a}{b} \\right) \\cup \\left( \\frac{a}{b}, \\infty \\right)

Since ${'a'}
and ${'b'}
are non-zero,

$${{}} R_g \\not \\subseteq D_f

so the composite function ${'fg'}
does not exist`;
	answer.addPart(
		mathlify`The composite function ${'fg'}
does not exist as ${{}} {R_g \\not \\subseteq D_f.}`,
		soln,
	);
}
// c
{
	const working = new EquationWorking(fnTerm('f^{-1}', 'x'), 'x');
	working.subIn({ 'f^{-1}': fExp });
	working.crossMultiply({ hide: true }).expand().swapSides({ hide: true });
	working.makeRhsZero().factorize.commonFactor();
	const { roots, working: rootsWorking } = solve.zeroProduct(working.eqn, 'x', { qed: true });
	const soln = mathlify`$${'gather*'} ${working}

$${'align*'} ${rootsWorking}	`;
	const ans = mathlify`${'x'} = ${roots.join(' \\text{ or }')}.`;
	answer.addPart(ans, soln);
}
