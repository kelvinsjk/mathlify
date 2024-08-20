import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import {
	generateAns,
	generateFracFnDefinition,
} from '$content/learn/h2/fns/04-more/01-self-inverse.practice';
import { expressionToPolynomial } from 'mathlify';
import { QED } from '$lib/utils/typesetting';
import svg from '$static/images/h2/fns/2012p1q7.svg?raw';

export const answer = new Answer();

// TODO: sketch (ii), transformations (iii)
// f(x) = ax/(bx-a)
// g(x) = 1/x

const fState: Parameters<typeof generateFracFnDefinition>[0] = {
	// (bx+k)/(cx+a)
	fnType: 'frac',
	b: 1,
	c: 1,
	k: 'k',
	n: 2,
	show: true,
};
const fExp = generateFracFnDefinition(fState, { for: true })[1];
// a
{
	const { soln } = generateAns(fState, fExp, 'g', { hideF2: true });
	answer.addPart(mathlify`[Show](#soln-1).`, soln);
}
// b
{
	const soln = svg;
	const ans = mathlify`[Sketch](#soln-2).`;
	answer.addPart(ans, soln);
}
// c
{
	const [num, den] = fExp._getQuotientTerms();
	const { quotient, remainder, result } = expressionToPolynomial(num).longDivide(
		expressionToPolynomial(den),
	);
	const ans = mathlify`Line of symmetry: ${{}} {y=x.}

Translate the curve ${{}} {y = \\frac{1}{x}}
by ${1}
unit in the positive ${{}} x\\text{-axis}
direction.
\\
Scale the resulting curve by a factor of ${remainder}
parallel to the ${{}} y\\text{-axis}.
\\
Translate the resulting curve by ${quotient}
unit in the positive ${{}} y\\text{-axis}
direction.`;
	const soln = mathlifyQED`Line of symmetry: ${{}} y = x ${QED}

$${fExp} = ${result}

- Translate the curve ${{}} {y = \\frac{1}{x}}
by ${1}
unit in the positive ${{}} x\\text{-axis}
direction
- Scale the resulting curve by factor ${remainder}
parallel to the ${{}} y\\text{-axis}
- Translate the resulting curve by ${quotient}
unit in the positive ${{}} y\\text{-axis}
direction`;
	answer.addPart(ans, soln);
}
