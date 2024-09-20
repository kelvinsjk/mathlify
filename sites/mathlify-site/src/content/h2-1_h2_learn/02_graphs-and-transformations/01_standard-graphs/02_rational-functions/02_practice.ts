import { chooseRandom, getRandomInt, coinFlip } from '$lib/utils/random';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, Polynomial, sum, quotient } from 'mathlify';
import { solve } from 'mathlify/working';
import { generateAxPlusB } from '../01_asymptotes/02_practice';

// objectives
// A: integers vs unknown constants

type State = {
	a: number | string | [-1, string];
	b: number | string | [-1, string];
	c: number | string | [-1, string];
	d: number | string | [-1, string];
};

export function generateState(): State {
	// 0.9 * 4/5 * 5/6 * 5/6 chance of no unknowns
	const c = coinFlip(0.1) ? 'c' : getRandomInt(1, 2);
	let d: number | string | [-1, string] = chooseRandom([1, 2, 3, 4, 'd']);
	if (coinFlip()) {
		d = typeof d === 'number' ? -d : [-1, d];
	}
	let a: number | string | [-1, string] = chooseRandom([1, 2, 3, 4, 5, 'a']);
	const aNegative = coinFlip();
	if (aNegative) {
		a = typeof a === 'number' ? -a : [-1, a];
	}
	let b: number | string | [-1, string] = chooseRandom([0, 1, 2, 3, 4, 'b']);
	if (!aNegative && coinFlip()) {
		b = typeof b === 'number' ? -b : [-1, b];
	}
	if (
		typeof a === 'number' &&
		typeof b === 'number' &&
		typeof c === 'number' &&
		typeof d === 'number' &&
		b * c === a * d
	)
		return generateState();
	return { a, b, c, d };
}

export function generateQn(state: State): {
	qn: string;
	ans: string;
} {
	const unknowns: string[] = [];
	const { a, b, c, d } = state;
	if (typeof a !== 'number') unknowns.push('a');
	if (typeof b !== 'number') unknowns.push('b');
	if (typeof c !== 'number') unknowns.push('c');
	if (typeof d !== 'number') unknowns.push('d');
	const ad = new Expression([a, d]).simplify();
	const bc = new Expression([b, c]).simplify();
	let restriction: string;
	if (unknowns.length === 1) {
		const unknown = unknowns[0];
		const { root } = solve.linear(sum(ad, [-1, bc]), unknown);
		restriction = `${unknown} \\neq ${root}`;
	} else {
		restriction = `${ad} \\neq ${bc}`;
	}
	const unknownText =
		unknowns.length > 0
			? mathlifier`where ${unknowns.join(', ')}
@${unknowns.length > 1 ? 'are' : 'is a'} non-zero real number@${unknowns.length > 1 ? 's' : ''}
and ${restriction}.`
			: '';
	const num = generateAxPlusB(state.a, state.b);
	const den = generateAxPlusB(state.c, state.d);
	const exp = quotient(num, den);
	const eqn = `y = ${exp}`;
	const qn =
		mathlifier`The curve ${'C'}
has equation

$${eqn}${unknowns.length === 0 ? '.' : ','}` +
		`\n\n${unknownText}` +
		'\n\n' +
		mathlifier`Write down the asymptote(s) of ${'C'}.`;
	const ans = generateAns(state, exp, num, den);
	return { qn, ans };
}

function generateAns(state: State, exp: Expression, num: Polynomial, den: Polynomial): string {
	const { root: x1 } = solve.linear(den);
	const { result, quotient } = num.longDivide(den);
	const vertical = `x = ${x1}`;
	return mathlifier`$${{}} ${exp} = ${result}

Hence the asymptotes are ${vertical}
and ${{}} y = ${quotient}.`;
}
