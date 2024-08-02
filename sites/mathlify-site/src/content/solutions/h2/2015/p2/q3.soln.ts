import { Answer } from '$content/solutions/answerObject';
//import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression, Polynomial } from 'mathlify';
import { specialExistence } from '$content/learn/h2/fns/02-inverse/01-existence.practice';
import { specialInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import svg from '$static/images/h2/fns/2015p2q3.svg?raw';

export const answer = new Answer();

// TODO: (b) discriminant from inequalities topic

// | 1 / 1-x^2 |
// equivalent to | ba^2 / x^2 - a^2 |
// from the learn/practice section
// where b=-1 and a=1

const [a, b] = [1, -1];
const exp = new Expression([a, '/', new Polynomial([a * a, 0, -1], { ascending: true })]);
const state: Parameters<typeof specialInverse>[0] = {
	fnType: 'special',
	a,
	b,
	restriction: { type: 'right', x: a, inclusive: false },
	definition: false,
	// dummies
	c: 1,
	unknownConstants: false,
};

// ai
{
	const { ans, soln } = specialExistence(state);
	answer.addSubPart(ans, svg + soln);
}
// aii
{
	const { ans, soln } = specialInverse(state, exp);
	answer.addSubPart(ans, soln);
}
// TODO: (b)
