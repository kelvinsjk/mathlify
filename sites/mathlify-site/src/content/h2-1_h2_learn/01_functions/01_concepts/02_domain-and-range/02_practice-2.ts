import type { PracticeQuestion } from '$content/_types';
import { chooseRandom, getRandomInt, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType

import { mathlifierDj as mathlifier } from 'mathlifier';
import { logTerm, sqrtTerm } from 'mathlify/fns';
import { Expression, sum } from 'mathlify';

// ln(x+a) + b (2011). No unknown constants if restricted
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted

export const types = ['log', 'sqrt', 'frac', 'improper'] as const;
type Types = typeof types;
export type Type = Types[number];

export interface State {
	fnType: Type;
	a: number;
	b: number;
	c: number;
}

export function generateState(): State {
	// we try to get a final range between -5 and 5;
	const fnType = chooseRandom(types);
	const a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	let c = getRandomInt(-4, 4);
	if (fnType === 'frac') c = getRandomNonZeroInt(1, 4);
	if (fnType === 'improper') b = getRandomNonZeroInt(1, 4);
	if (fnType === 'improper' && c / b === a) return generateState();
	return { fnType, a, b, c };
}

export const practiceTitle = `function definition`;

export function generateQn(state: State): PracticeQuestion {
	const [fnString, exp] = generateFn(state);
	const qn1 = mathlifier`The function ${'f'}
is defined by

$${fnString}.\n\n`;
	const qn2 =
		state.fnType === 'frac' || state.fnType === 'improper'
			? mathlifier`State the value of ${'k'}
and explain why this value has to be excluded from the domain of ${'f'}.`
			: mathlifier`State the least possible value of ${'k'}
and explain why the definition of ${'f'}
is invalid for values of ${'k'}
smaller than the value stated.`;
	const range = state.fnType === 'log' ? `x > ${-state.a}` : `x \\geq ${-state.a}`;
	const ans =
		state.fnType === 'frac' || state.fnType === 'improper'
			? mathlifier`${{}} k = ${-state.a}.

This value has to be excluded from the domain of ${'f'}
as ${exp}
is undefined for ${`x=${-state.a}`}.`
			: mathlifier`Least ${{}} k = ${-state.a}.

The definition of ${'f'}
is invalid if ${'k'}
is smaller than ${`${-state.a}`}
because ${exp}
is only defined for ${range}.`;
	return { qn: qn1 + qn2, ans };
}

/**
 *
 * @param state
 * @param options
 * @returns [fnString(including domain), fnExp, domain]
 */
export function generateFn(
	state: State,
	options?: { fnName?: string; align?: boolean; for?: boolean; splitPm?: boolean }
): [string, Expression] {
	const alignChar = options?.align ? '&&' : '';
	const f = options?.fnName ?? 'f';
	let output = `${f}: x \\mapsto `;
	let exp: Expression;
	const { a, b, c, fnType } = state;
	if (fnType === 'log') {
		exp = new Expression(sum(logTerm(sum('x', 'a')), 'b'));
	} else if (fnType === 'sqrt') {
		exp = new Expression(sum(sqrtTerm(sum('x', 'a')), 'b'));
	} else if (fnType === 'frac') {
		exp = new Expression(sum('b', ['c', '/', sum('x', 'a')]));
	} else {
		// improper
		exp = new Expression([sum(['b', 'x'], 'c'), '/', sum('x', 'a')]);
	}
	exp = exp.subIn({ a, b, c });
	const forText = options?.for ? `\\text{for }` : '';
	let domain = `${forText}x \\in \\mathbb{R}`;
	if (fnType === 'log') {
		domain += `, x > k`;
	} else if (fnType === 'sqrt') {
		domain += `, x \\geq k`;
	} else if (fnType === 'frac' || fnType === 'improper') {
		domain += `, x \\neq k`;
	}
	const comma = options?.for ? '' : ',';
	output += `${exp}${comma} \\quad ${alignChar}${domain}`;
	return [output, exp];
}
