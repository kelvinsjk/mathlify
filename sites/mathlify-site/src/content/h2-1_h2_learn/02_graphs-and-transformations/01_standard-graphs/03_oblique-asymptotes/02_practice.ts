import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, Polynomial, sum, quotient } from 'mathlify';
import { solve } from 'mathlify/working';
import { generateAxPlusB } from '../01_asymptotes/02_practice';

// objectives
// A: integers vs unknown constants
// B: improper vs long divided

type State = {
	improper: boolean;
	a: number | string | [-1, string];
	b: number | string | [-1, string];
	c: number | string | [-1, string];
	d: number | string | [-1, string];
};

export function generateState(): State {
	// 0.9^3 * 0.7 (.5103) chance of no unknowns
	const a = coinFlip(0.1) ? 'a' : getRandomInt(1, 4);
	let b: number | string | [-1, string] =
		typeof a === 'string'
			? 0
			: coinFlip(0.1)
				? chooseRandom(['b', [-1, 'b']])
				: getRandomInt(-4, 4);
	const c: number | string | [-1, string] = coinFlip(0.3)
		? chooseRandom(['c', [-1, 'c']])
		: getRandomNonZeroInt(1, 4);
	const d: number | string | [-1, string] =
		typeof b !== 'number'
			? 0
			: coinFlip(0.1)
				? chooseRandom(['d', [-1, 'd']])
				: getRandomInt(-4, 4);
	if (typeof d !== 'number') b = 0;
	return { a, b, c, d, improper: coinFlip(0.5) };
}

export function generateQn(state: State): {
	qn: string;
	ans: string;
} {
	const unknowns: string[] = [];
	const { a, b, c, d, improper } = state;
	if (typeof a !== 'number') unknowns.push('a');
	if (typeof b !== 'number') unknowns.push('b');
	if (typeof c !== 'number') unknowns.push('c');
	if (typeof d !== 'number') unknowns.push('d');
	const unknownText =
		unknowns.length > 0
			? mathlifier`where ${unknowns.join(', ')}
@${unknowns.length > 1 ? 'are' : 'is a'} non-zero real number@${unknowns.length > 1 ? 's' : ''}.`
			: '';
	const quot = generateAxPlusB(a, b);
	const den = new Polynomial([1, d]);
	const cPoly = new Polynomial([c]);
	const num = quot.times(den).plus(cPoly);
	const improperExp = quotient(num, den);
	const properExp = sum(quot, quotient(c, den));
	const exp = improper ? improperExp : properExp;
	const eqn = `y = ${exp}`;
	const qn =
		mathlifier`The curve ${'C'}
has equation

$${eqn}${unknowns.length === 0 ? '.' : ','}` +
		`\n\n${unknownText}` +
		'\n\n' +
		mathlifier`Write down the asymptote(s) of ${'C'}.`;
	const ans = generateAns(state, improperExp, properExp, den, quot);
	return { qn, ans };
}

function generateAns(
	state: State,
	improperExp: Expression,
	properExp: Expression,
	den: Polynomial,
	oblique: Expression
): string {
	const start = state.improper ? mathlifier`$${{}} ${improperExp} = ${properExp}\n\n` : '';
	const { root: x1 } = solve.linear(den);
	const vertical = `x = ${x1}`;
	return (
		start +
		mathlifier`@${state.improper ? 'Hence the' : 'The'} asymptotes are ${vertical}
and ${{}} y = ${oblique}.`
	);
}
