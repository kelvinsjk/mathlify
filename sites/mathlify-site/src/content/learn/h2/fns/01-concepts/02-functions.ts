import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';
import { renderHTML } from 'djot-temml';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants

import type { PracticeState, PracticeQuestion, Practice } from '$content/learn/practices';
import { mathlify } from '$lib/mathlifier';
import { logTerm, sqrtTerm, absTerm } from 'mathlify/fns';
import { Expression, sum, e } from 'mathlify';

// ax+b (2013)
// (x+a)^2 + b, (2007,2008)
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019)
// sqrt(x+a) + b (2016). No unknown constants if restricted
// c/(x+a) + b (2007,2009). No unknown constants if restricted
// (bx+c) / (x+a) (2009). No unknown constants if restricted
// | improper | (2023). No unknown constants if restricted
// ba^2 / (x^2 - a^2). (2010,2015) No restrictions and unknown constants.

// special: ba^2 / (x^2 - a^2)
const types = [
	'linear',
	'quadratic',
	'log',
	'exp',
	'sqrt',
	'frac',
	'improper',
	'abs',
	'special',
] as const;
type Types = typeof types;
type Type = Types[number];

interface State extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction:
		| {
				type: 'left' | 'right';
				inclusive: boolean;
				x: number;
		  }
		| false;
	unknownConstants: boolean;
}

export function generateState(): State {
	// we try to get a final range between -5 and 5;
	const fnType = chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	let c = getRandomInt(-4, 4);
	const unknownConstants = fnType === 'special' && Math.random() < 0.3;
	const isRestricted = fnType !== 'special' && Math.random() < 0.3;
	if (fnType === 'linear') a = getRandomNonZeroInt(1, 4);
	if (fnType === 'exp') a = getRandomNonZeroInt(1, 2);
	if (fnType === 'improper') b = getRandomNonZeroInt(1, 4);
	let restriction:
		| {
				type: 'left' | 'right';
				inclusive: boolean;
				x: number;
		  }
		| false = false;
	if (isRestricted) {
		const type = coinFlip() ? 'left' : 'right';
		const inclusive = coinFlip();
		let x = 0; // for exponential case
		if (fnType === 'linear') {
			x = unknownConstants ? 0 : getRandomInt((-4 - b) / a, (4 - b) / a);
		} else if (fnType === 'quadratic') {
			x = unknownConstants ? -a : getRandomInt(-a - 2, -a + 2);
		} else if (fnType === 'log') {
			x = -a + 1;
		} else if (fnType === 'sqrt') {
			x = chooseRandom([-a, -a + 4, -a + 9, -a + 16].filter((x) => x < 9));
		} else if (fnType === 'frac' || fnType === 'improper' || fnType === 'abs') {
			x = type === 'left' ? getRandomInt(-a - 4, -a - 1) : getRandomInt(-a + 1, -a + 4);
			if (fnType === 'improper' || fnType === 'abs') {
				c = getRandomInt(-5 * (x + a) - b * x, 5 * (x + a) - b * x);
			}
		}
		restriction = { type, inclusive, x };
	}
	return { fnType, a, b, c, unknownConstants, restriction };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const qn = renderHTML(mathlify`Find the range of the following function
		
	$${generateFn(state as State)}
`);
	const ans = '';
	return { qn, ans };
}

function generateFn(state: State): string {
	let x = 'f: x \\mapsto ';
	switch (state.fnType) {
		case 'linear':
			x += `ax+b`;
			break;
		case 'quadratic':
			return `(${state.a}x+${state.b})^2`;
		case 'log':
			return `ln(${state.a}x+${state.b})`;
		case 'exp':
			return `exp(${state.a}x+${state.b})`;
		case 'sqrt':
			return `sqrt(${state.a}x+${state.b})`;
	}
	return x;
}

function generateAns(state: State): string {
	return '';
}

export const practice: Practice = {
	generateState,
	generateQn,
};
