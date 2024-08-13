import { coinFlip } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants
// D: definition vs f^{-1}(x)

// we will omit the 'abs' case here, and apply it under 04/03

import type { PracticeState, PracticeQuestion } from '$lib/types/learn';

// ax+b (2013)
// (x+a)^2 + b, (2007,2008)
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019)
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

import { generateState as generateState1 } from '../02-inverse/02-domain.practice';
import { generateQn as generateQn1 } from '../02-inverse/03-formula.practice';

export interface State extends PracticeState {
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
	definition: boolean;
}

export function generateState(): State {
	const state: State = { ...generateState1({ type: 'abs' }), definition: coinFlip() };
	delete state.fnType;
	return state;
}

export function generateQn(state: PracticeState): PracticeQuestion {
	return generateQn1({fnType: 'abs', ...state});
}
