import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: left vs right
// C: inclusive vs exclusive
// D (only for special): left2 vs right2 (0 vs \pm a)

import type { PracticeState, PracticeQuestion } from '$lib/types/learn';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression } from 'mathlify';
import { generateFn } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { lessThan, greaterThan } from './03-formula.practice';
import { capitalizeFirstLetter } from '$lib/utils/typesetting';

// (x+a)^2 + b, (2007,2008)
// abs: | (bx+c) / (x+a) | (2023).
// special: ba^2 / (x^2 - a^2). (2010,2015). inclusive asks for x < -a or x > a. Exclusive asks for 0 \leq x < a or -a < x \leq 0

const types = ['quadratic', 'abs', 'special'] as const;
type Types = typeof types;
type Type = Types[number];

interface State extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	inclusive: boolean;
	type: 'left' | 'right';
	zeroLeft: boolean;
	zeroAns: boolean;
}

export function generateState(options?: { type?: Type }): State {
	const fnType = options?.type ?? chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	const c = getRandomInt(-4, 4);
	const type = coinFlip() ? 'left' : 'right';
	let inclusive = coinFlip();
	let zeroLeft = true;
	let zeroAns = true;
	if (fnType === 'special') a = getRandomInt(1, 4);
	if (fnType === 'abs' || fnType === 'special') b = getRandomNonZeroInt(1, 4);
	if (fnType === 'abs') {
		if (c / b === a) return generateState(options);
		if ((-c / b < -a && type === 'right') || (-c / b > -a && type === 'left')) {
			inclusive = false;
		}
	} else if (fnType === 'special') {
		a = Math.abs(a);
		if (inclusive) {
			zeroLeft = coinFlip();
			zeroAns = coinFlip();
		}
	}
	return { fnType, a, b, c, type, inclusive, zeroLeft, zeroAns };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const [fnString] = generateFn({ ...state1, restriction: false, unknownConstants: false });
	const { fnType, type, inclusive, zeroLeft, zeroAns, a } = state1;
	const sign = type === 'left' ? lessThan(inclusive) : greaterThan(inclusive);
	let restriction = `x ${sign} a`;
	let greatest: 'greatest' | 'least' = type === 'left' ? 'greatest' : 'least';
	if (fnType === 'special') {
		if (inclusive) {
			// 0 \\leq x < a or a < x \\leq 0
			if (zeroLeft) {
				restriction = zeroAns ? `a \\leq x < ${a}` : `0 \\leq x < a`;
				greatest = zeroAns ? 'least' : 'greatest';
			} else {
				restriction = zeroAns ? `${-a} < x \\leq a` : `a < x \\leq 0`;
				greatest = zeroAns ? 'greatest' : 'least';
			}
		}
	}
	const qn = mathlify`The function ${'f'}
is defined by

$${fnString}.

The domain of ${'f'}
is restricted to ${restriction},
where ${'a'}
is a constant.

State the @${greatest} value of ${'a'}
such that the function ${'f^{-1}'}
exists.`;

	const { ans } = domainRestriction(state1, greatest);
	return { qn, ans };
}

export function domainRestriction(
	state: State,
	greatest: 'greatest' | 'least',
): { ans: string; soln: string } {
	const a = generateAns(state);
	const greatestCap = capitalizeFirstLetter(greatest);
	const ans = mathlify`@${greatestCap} value of ${{}} {a = ${a}.}`;
	const soln = mathlifyQED`@${greatestCap} value of ${{}} {a = ${a}}`;
	return { ans, soln };
}

export function generateAns(state: State): Expression {
	const { fnType, a, b, c, type, inclusive, zeroLeft, zeroAns } = state;
	const aExp = new Expression(a);
	const minusA = new Expression(-a);
	const zero = new Expression(0);
	if (fnType === 'quadratic') {
		return minusA;
	} else if (fnType === 'abs') {
		return (-c / b < -a && type === 'right') || (-c / b > -a && type === 'left')
			? minusA
			: new Expression([-c, '/', b]).simplify();
	} else {
		// special
		if (inclusive) {
			if (zeroAns) {
				return zero;
			} else {
				return zeroLeft ? aExp : minusA;
			}
		} else {
			return type === 'left' ? minusA : aExp;
		}
	}
}
