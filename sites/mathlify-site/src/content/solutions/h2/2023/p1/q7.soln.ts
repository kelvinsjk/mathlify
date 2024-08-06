import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Polynomial } from 'mathlify';
import { absTerm } from 'mathlify/fns';
import { generateRange } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { absoluteRationalInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { domainRestriction } from '$content/learn/h2/fns/02-inverse/04-restriction.practice';
import { compositeExists } from '$content/learn/h2/fns/03-composite/01-existence.practice';
import svg from '$static/images/h2/fns/2023p1q7.svg?raw';

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
	definition: false,
};
// from part (d) onwards
const restriction = { type: 'left', x: -2, inclusive: true } as const;

// a
{
	const soln = svg;
	const ans = mathlify`Asymptotes: ${`x=3`}
and ${`y=2`}.`;
	answer.addPart(ans, soln);
}
// b
const R_f = generateRange({ ...state, restriction: false }, exp).join(' \\cup ');
{
	const soln = mathlifyQED`${{}} R_f = ${R_f}`;
	const ans = mathlify`${{}}R_f = ${R_f}.`;
	answer.addPart(ans, soln);
}
// c
{
	const { ans, soln } = compositeExists({ f: state, g: state, fg: true }, [exp, exp], {
		gName: 'f',
	});
	//	const ans = mathlify`${{}}R_f \\not \\subseteq D_f.`;
	//	const soln = mathlifyQED`Since ${{}} R_f = ${R_f}
	//and ${{}} D_f = \\left( -\\infty, 3 \\right) \\cup \\left( 3, \\infty \\right),
	//
	//$${{}} R_f \\not \\subseteq D_f
	//
	//Hence the composite function ${'f^2'}
	//does not exist`;
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
