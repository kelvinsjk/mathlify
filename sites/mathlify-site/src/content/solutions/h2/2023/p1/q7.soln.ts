import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Polynomial } from 'mathlify';
import { functionRange } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { absoluteRationalInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { absTerm } from 'mathlify/fns';
import svg from '$static/images/h2/fns/2023p1q7.svg?raw';

export const answer = new Answer();

// TODO: (a) graphs
// TODO: (c) use existence of composite from learn/practice
// TODO: (d) use restriction from learn/practice

// | (2x+4) / (3-x) |
// equivalent to | (bx+c) / (x+a) |
// from the learn/practice section

const [a, b, c] = [-3, 2, 4];
const num = new Polynomial([b, c]);
const den = new Polynomial([3, -1], { ascending: true });
const exp = absTerm([num, '/', den]);
const state: Parameters<typeof absoluteRationalInverse>[0] = {
	fnType: 'abs',
	a,
	b,
	c,
	restriction: { type: 'left', x: -2, inclusive: true },
	unknownConstants: false,
	definition: false,
};

// a
{
	const soln = svg;
	const ans = mathlify`Asymptotes: ${`x=3`}
and ${`y=2`}.`;
	answer.addPart(ans, soln);
}
// b
const R_f = functionRange({ ...state, restriction: false }, exp);
{
	const soln = mathlifyQED`${{}} R_f = ${R_f}`;
	const ans = mathlify`${{}}R_f = ${R_f}.`;
	answer.addPart(ans, soln);
}
// c
{
	const ans = mathlify`${{}}R_f \\not \\subseteq D_f.`;
	const soln = mathlifyQED`Since ${{}} R_f = ${R_f}
and ${{}} D_f = \\left( -\\infty, 3 \\right) \\cup \\left( 3, \\infty \\right),

$${{}} R_f \\not \\subseteq D_f

Hence the composite function ${'f^2'}
does not exist`;
	answer.addPart(ans, soln);
}
// d
{
	const soln = mathlifyQED`Greatest value of ${{}} a = -2`;
	const ans = mathlify`Greatest value of ${{}} a = -2.`;
	answer.addPart(ans, soln);
}
// e

{
	const { ans, soln } = absoluteRationalInverse(state, [num, den], { swap: true });
	answer.addPart(ans, soln);
}
