import { Answer } from '$lib/classes/answer';
import { QED } from '$lib/typesetting/utils';
import { mathlifierDj as mathlifier } from 'mathlifier';
import {
	generateAns,
	generateFracFnDefinition
} from '$content/h2-1_h2_learn/01_functions/04_more/01_self-inverse/02_practice';
import { expressionToPolynomial } from 'mathlify';
import svg from '$static/images/h2/fns/2012p1q7b.svg?raw';

export const answer = new Answer();

// f(x) = ax/(bx-a)
// g(x) = 1/x

const fState: Parameters<typeof generateFracFnDefinition>[0] = {
	// (bx+k)/(cx+a)
	fnType: 'frac',
	b: 1,
	c: 1,
	k: 'k',
	n: 2,
	show: true
};
const fExp = generateFracFnDefinition(fState, { for: true })[1];
// a
{
	const { soln } = generateAns(fState, fExp, 'g', { hideF2: true, qed: true });
	answer.addPart(mathlifier`[Show](#soln-1).`, soln);
}
// b
{
	const soln = `\`\`\` =html\n${svg}\n\`\`\`\n\n`;
	const ans = mathlifier`[Sketch](#soln-2).`;
	answer.addPart(ans, soln);
}
// c
{
	const [num, den] = fExp._getQuotientTerms();
	const { quotient, remainder, result } = expressionToPolynomial(num).longDivide(
		expressionToPolynomial(den)
	);
	const ans = mathlifier`Line of symmetry: ${{}} {y=x.}

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
	const soln = mathlifier`Line of symmetry: ${{}} y = x \\; ${QED}

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
