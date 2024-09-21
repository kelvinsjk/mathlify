import {
	chooseRandom,
	getRandomInt,
	coinFlip,
	getRandomNonZeroInt,
	getRandomSign
} from '$lib/utils/random';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, Polynomial, sum, quotient, expTerm } from 'mathlify';
import { Logarithm } from 'mathlify/fns';
import { solve } from 'mathlify/working';

// objectives
// A: fnType: rational vs exp vs log
// B: integers vs unknown constants

type FnType = 'rational' | 'exp' | 'log';
type State = {
	type: FnType;
	a: number | string | [-1, string];
	b: number | string | [-1, string];
	c: number | string | [-1, string];
	d: number | string | [-1, string];
};

export function generateState(): State {
	const type = chooseRandom(['rational', 'exp', 'log'] as const);
	// (1-0.8)^3 = 0.512 chance of no unknowns
	const abUnknown = coinFlip(0.2);
	let a: number | string | [-1, string];
	let b: number | string | [-1, string];
	if (abUnknown) {
		b = chooseRandom([0, 'b', [-1, 'b']] as const);
		if (b === 0) {
			a = 'a';
		} else {
			a =
				typeof b === 'string'
					? chooseRandom([1, -1, 2, -2, 'a', [-1, 'a']] as const)
					: chooseRandom(['a', 1, 2]);
		}
	} else {
		a = getRandomNonZeroInt(1, 5);
		b = getCoprimeB(a);
		if (a > 0) {
			b = b * getRandomSign();
		}
	}
	const c = coinFlip(0.2) ? 'c' : getRandomInt(-4, 4);
	const d = coinFlip(0.2) ? 'd' : getRandomNonZeroInt(1, 4);
	return { type, a, b, c, d };
}

function getCoprimeB(a: number): number {
	if (Math.abs(a) === 1) {
		return getRandomInt(0, 4);
	} else if (Math.abs(a) === 2) {
		return chooseRandom([1, 3, 5, 7]);
	} else if (Math.abs(a) === 3) {
		return chooseRandom([1, 2, 4, 5]);
	} else if (Math.abs(a) === 4) {
		return chooseRandom([1, 3, 5, 7]);
	}
	return chooseRandom([1, 2, 3, 4]);
}

function generateExp(state: State): Expression {
	const { type, a, b, c, d } = state;
	const poly = generateAxPlusB(a, b);
	return type === 'rational'
		? sum(c, quotient(d, poly))
		: type === 'exp'
			? sum(c, [d, expTerm(poly)])
			: sum(c, [d, new Logarithm(poly)]);
}
export function generateAxPlusB(
	a: number | string | [-1, string],
	b: number | string | [-1, string]
): Polynomial {
	const aExp = Array.isArray(a) ? new Expression([-1, a[1]]) : new Expression(a);
	const bExp = Array.isArray(b) ? new Expression([-1, b[1]]) : new Expression(b);
	return aExp.is.negative()
		? new Polynomial([bExp, aExp], { ascending: true })
		: new Polynomial([aExp, bExp]);
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
	const unknownText =
		unknowns.length > 0
			? mathlifier`where ${unknowns.join(', ')}
@${unknowns.length > 1 ? 'are' : 'is a'} positive real number@${unknowns.length > 1 ? 's' : ''}.`
			: '';
	const exp = generateExp(state);
	const eqn = `y = ${exp}`;
	const qn =
		mathlifier`The curve ${'C'}
has equation

$${eqn}${unknowns.length === 0 ? '.' : ','}` +
		`\n\n${unknownText}` +
		'\n\n' +
		mathlifier`Write down the asymptote(s) of ${'C'}.`;
	const ans = generateAns(state);
	return { qn, ans };
}

function generateAns(state: State): string {
	if (state.type === 'exp') {
		return mathlifier`y = ${state.c}.`;
	}
	const poly = generateAxPlusB(state.a, state.b);
	const { root: x1 } = solve.linear(poly);
	const vertical = `x = ${x1}`;
	return state.type === 'log'
		? mathlifier`${vertical}.`
		: mathlifier`${vertical}
and ${{}} y = ${state.c}.`;
}
