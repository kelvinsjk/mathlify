import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: left vs right
// C: inclusive vs exclusive
// D (only for special): left2 vs right2 (0 vs \pm a)

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression } from 'mathlify';
import { generateFn } from '../../01_concepts/02_domain-and-range/02_practice-1';
import { lessThan, greaterThan } from '../03_formula/02_practice';
import { capitalizeFirstLetter, QED } from '$lib/typesetting/utils';

// (x+a)^2 + b, (2007,2008)
// abs: | (bx+c) / (x+a) | (2023).
// special: ba^2 / (x^2 - a^2). (2010,2015). inclusive asks for x < -a or x > a. Exclusive asks for 0 \leq x < a or -a < x \leq 0

const types = ['quadratic', 'abs', 'special'] as const;
type Types = typeof types;
type Type = Types[number];

interface State {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	inclusive: boolean;
	type: 'left' | 'right';
	zeroLeft: boolean;
	zeroAns: boolean;
}

export const practiceTitle = 'domain restriction';

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

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
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
	const qn = mathlifier`The function ${'f'}
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
	greatest: 'greatest' | 'least'
): { ans: string; soln: string } {
	const a = generateAns(state);
	const greatestCap = capitalizeFirstLetter(greatest);
	const ans = mathlifier`@${greatestCap} value of ${{}} {a = ${a}.}`;
	const soln = mathlifier`@${greatestCap} value of ${{}} {a = ${a}} \\; ${QED}`;
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
