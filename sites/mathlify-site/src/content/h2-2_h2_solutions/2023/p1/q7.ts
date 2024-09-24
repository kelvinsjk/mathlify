import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial } from 'mathlify';
import { absTerm } from 'mathlify/fns';
import { generateRange } from '$content/h2-1_h2_learn/01_functions/01_concepts/02_domain-and-range/02_practice-1';
import { absoluteRationalInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { domainRestriction } from '$content/h2-1_h2_learn/01_functions/02_inverse/04_restriction/02_practice';
import { compositeExists } from '$content/h2-1_h2_learn/01_functions/03_composite/01_existence/02_practice';
import { QED } from '$lib/utils/typesetting/utils';
import svg from '$static/images/h2/fns/2023p1q7a.svg?raw';

export const answer = new Answer();

// ! Complete

// | (2x+4) / (3-x) |
// equivalent to | (bx+c) / (x+a) |
// from the learn/practice section

const [a, b, c] = [-3, 2, 4];
const num = new Polynomial([b, c]);
const den = new Polynomial([3, -1], { ascending: true });
const exp = absTerm([num, '/', den]);
const state: Parameters<typeof absoluteRationalInverse>[0] &
	Parameters<typeof domainRestriction>[0] = {
	fnType: 'abs',
	a,
	b,
	c,
	restriction: false,
	type: 'left',
	inclusive: true,
	zeroAns: true,
	zeroLeft: true,
	unknownConstants: false,
	definition: false
};
// from part (d) onwards
const restriction = { type: 'left', x: -2, inclusive: true } as const;

// a
{
	const soln = `\`\`\` =html\n${svg}\n\`\`\``;
	const ans = mathlifier`[Sketch](#soln-1).`;
	answer.addPart(ans, soln);
}
// b
const R_f = generateRange({ ...state, restriction: false }, exp).join(' \\cup ');
{
	const soln = mathlifier`$${{}} R_f = ${R_f} \\;${QED}`;
	const ans = mathlifier`${{}}R_f = ${R_f}.`;
	answer.addPart(ans, soln);
}
// c
{
	const { ans, soln } = compositeExists({ f: state, g: state, fg: true }, [exp, exp], {
		gName: 'f'
	});
	answer.addPart(ans, soln);
}
// d
{
	const { ans, soln } = domainRestriction(state, 'greatest');
	answer.addPart(ans, soln);
}
state.restriction = restriction;
// e
{
	const { ans, soln } = absoluteRationalInverse(state, [num, den], { swap: true });
	answer.addPart(ans, soln);
}
