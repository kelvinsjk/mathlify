import { chooseRandom, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: (a,0), (0,b). x-intercept
// B: (a,0), (0,b). y-intercept
// C: (a,b)
// unknownConstants

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';

// quadratic: (x+a)^2 + b, (2008)
// cubic: x^3 + ax^2 + bx + c
// log: ln (cx + a) + b (2011)
// exp: e^(x-b) - a (equivalent to log with c=1)

const types = ['x', 'y', 'pt'] as const;
type Types = typeof types;
type Type = Types[number];

interface State {
	fnType: Type;
	a: number | string;
	b: number | string;
}

export const practiceTitle = 'relationship of inverse functions';

export function generateState(): State {
	const fnType = chooseRandom(types);
	const unknownConstants = coinFlip();
	const a = unknownConstants ? 'a' : getRandomNonZeroInt(1, 9);
	const b = unknownConstants ? 'b' : getRandomNonZeroInt(1, 9);
	return { fnType, a, b };
}

export function generateQn(state: State): PracticeQuestion {
	const point = state.fnType === 'pt' ? 'point' : 'points';
	const pt1 = state.fnType === 'pt' ? `(${state.a}, ${state.b})` : `(${state.a}, 0)`;
	const pt2 = state.fnType === 'pt' ? `` : `and $(0, ${state.b})$`;
	const aPointOn =
		state.fnType === 'pt'
			? `a point on`
			: state.fnType === 'x'
				? `the $x$-intercept of`
				: `the $y$-intercept of`;
	const qn = mathlifier`The curve ${'y=f(x)'}
passes through the @${point} ${pt1}
@${pt2}.

Given that ${'f^{-1}'}
exists, state the coordinates of @${aPointOn}
the curve ${'{y=f^{-1}(x).}'}`;
	const ans =
		state.fnType === 'pt'
			? `(${state.b}, ${state.a})`
			: state.fnType === 'x'
				? `(${state.b}, 0)`
				: `(0, ${state.a})`;
	return { qn, ans: mathlifier`${ans}.` };
}
