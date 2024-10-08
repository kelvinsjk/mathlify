import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';

// ax+b (2013)
// (x+a)^2 + b, (2007,2008)
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019)
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

import {
	generateFn,
	generateRange,
	types,
	type Type
} from '../../01_concepts/02_domain-and-range/02_practice-1';
import { Interval, intervalBuilder } from '../../_intervals';
import { Expression } from 'mathlify';

interface State {
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

export const practiceTitle = 'domain and range of inverse functions';

export function generateState(options?: { type?: Type }): State {
	// we try to get a final range between -5 and 5;
	const fnType = options?.type ?? chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	let c = getRandomInt(-4, 4);
	let unknownConstants = Math.random() < 0.3;
	let isRestricted = Math.random() < 0.3;
	if (fnType === 'linear' || fnType === 'special') a = getRandomNonZeroInt(1, 4);
	if (fnType === 'special') {
		unknownConstants = false;
		a = Math.abs(a);
	}
	if (fnType === 'linear' && unknownConstants) a = 1;
	if (fnType === 'exp') a = getRandomNonZeroInt(1, 2);
	if (fnType === 'frac') c = getRandomNonZeroInt(1, 4);
	if (fnType === 'improper' || fnType === 'abs' || fnType === 'special')
		b = getRandomNonZeroInt(1, 4);
	if ((fnType === 'improper' || fnType === 'abs') && c / b === a) return generateState(options);
	if (fnType === 'quadratic' || fnType === 'abs' || fnType === 'special') isRestricted = true;
	let restriction:
		| {
				type: 'left' | 'right';
				inclusive: boolean;
				x: number;
		  }
		| false = false;
	if (isRestricted) {
		let type: 'left' | 'right' = coinFlip() ? 'left' : 'right';
		let inclusive = coinFlip();
		let x = 0; // for exponential case
		if (fnType === 'linear') {
			x = unknownConstants ? 0 : getRandomInt((-4 - b) / a, (4 - b) / a);
		} else if (fnType === 'quadratic') {
			x = unknownConstants
				? -a
				: type === 'left'
					? getRandomInt(-a - 2, -a)
					: getRandomInt(-a, -a + 2);
		} else if (fnType === 'log') {
			unknownConstants = false;
			x = -a + 1;
			type = 'right';
		} else if (fnType === 'sqrt') {
			unknownConstants = false;
			x = chooseRandom([-a, -a + 4, -a + 9, -a + 16].filter((x) => x < 9));
			type = 'right';
			if (x === -a && inclusive) {
				const restriction = { x, inclusive: false, type };
				return { fnType, a, b, c, unknownConstants, restriction };
			}
		} else if (fnType === 'frac' || fnType === 'improper' || fnType === 'abs') {
			unknownConstants = false;
			x = type === 'left' ? getRandomInt(-a - 4, -a - 1) : getRandomInt(-a + 1, -a + 4);
			if (fnType === 'improper' || fnType === 'abs') {
				c = getRandomInt(-5 * (x + a) - b * x, 5 * (x + a) - b * x);
				const intercept = c / b;
				if (intercept === a || Math.abs(intercept) > 8) return generateState(options);
			}
			if (fnType === 'abs') {
				// https://www.desmos.com/calculator/yb2bwgxywr
				if (-c / b < -a && type === 'left') {
					x = getRandomInt(-c / b - 4, -c / b);
				} else if (-c / b > -a && type === 'right') {
					x = getRandomInt(-c / b, -c / b + 4);
				}
				if (Math.abs(x) > 8) return generateState(options);
			}
		} else if (fnType === 'special') {
			x = type === 'left' ? -a : a;
			inclusive = false;
		}
		restriction = { type, inclusive, x };
	}
	return { fnType, a, b, c, unknownConstants, restriction };
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const [fnString, exp] = generateFn(state1);
	let qn: string;
	if (state.unknownConstants) {
		if (state1.fnType === 'frac') {
			qn = mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.

Find the range and domain of the inverse function ${'f^{-1}.'}`;
		} else if (state1.fnType === 'abs' || state1.fnType === 'improper') {
			qn = mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Find the range and domain of the inverse function ${'f^{-1}.'}`;
		} else {
			qn = mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.

Find the range and domain of the inverse function ${'f^{-1}.'}`;
		}
	} else {
		qn = mathlifier`The function ${'f'}
is defined by

$${fnString}.

Find the range and domain of the inverse function ${'f^{-1}.'}`;
	}
	const ans = mathlifier`
${'D_{f^{-1}}'} = R_f = ${generateRange(state1, exp).join(' \\cup ')}.
\\
${'R_{f^{-1}}'} = D_f = ${generateDomain(state1).join(' \\cup ')}.`;
	return { qn, ans };
}

export function generateDomain(state: State): Interval[] {
	const { fnType, restriction, a, unknownConstants } = state;
	const negativeA = new Expression(unknownConstants ? [-1, 'a'] : -a);
	if (fnType === 'quadratic' && restriction) {
		return [intervalBuilder(restriction.type, restriction.x, restriction.inclusive)];
	}
	if (restriction) return [intervalBuilder(restriction.type, restriction.x, restriction.inclusive)];
	if (fnType === 'log') {
		return [intervalBuilder('right', negativeA, false)];
	} else if (fnType === 'sqrt') {
		return [intervalBuilder('right', negativeA, true)];
	} else if (fnType === 'improper' || fnType === 'abs' || fnType === 'frac') {
		return [intervalBuilder('left', negativeA, false), intervalBuilder('right', negativeA, false)];
	} else if (fnType === 'special') {
		return [
			intervalBuilder('left', -Math.abs(a), false),
			new Interval({ left: -Math.abs(a), right: Math.abs(a) }),
			intervalBuilder('right', Math.abs(a), false)
		];
	}
	return [Interval.ALL_REAL];
}
