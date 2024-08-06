import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants

import type { PracticeState, PracticeQuestion, Practice, SupportedTypes } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import { logTerm, sqrtTerm, absTerm } from 'mathlify/fns';
import { Expression, sum, e } from 'mathlify';
import { Interval, intervalBuilder } from '$content/learn/h2/fns/intervals';

// ax+b (2013). unknown constants + restriction: x=0
// (x+a)^2 + b, (2007,2008). unknown constants + restriction: x=-a
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

export const types = [
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
export type Type = Types[number];

export interface IntervalOneSided extends Record<string, SupportedTypes> {
	type: 'left' | 'right';
	inclusive: boolean;
	x: number;
}

export interface State extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction: IntervalOneSided | false;
	unknownConstants: boolean;
}

export function generateState(options?: {
	type?: Type;
	unknownConstants?: boolean;
	isRestricted?: boolean;
	b?: number;
}): State {
	// we try to get a final range between -5 and 5;
	const fnType = options?.type ?? chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = options?.b ?? getRandomInt(-4, 4);
	let c = getRandomInt(-4, 4);
	let unknownConstants = options?.unknownConstants ?? coinFlip(0.3);
	const isRestricted = options?.isRestricted ?? coinFlip(0.3);
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
			x = unknownConstants ? -a : getRandomInt(-a - 2, -a + 2);
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
		} else if (fnType === 'special') {
			x = type === 'left' ? -a : a;
			inclusive = false;
		}
		restriction = { type, inclusive, x };
	}
	return { fnType, a, b, c, unknownConstants, restriction };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const [fnString, exp] = generateFn(state1);
	let qn: string;
	if (state.unknownConstants) {
		if (state1.fnType === 'frac') {
			qn = mathlify`Find the range of the function

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.`;
		} else if (state1.fnType === 'abs' || state1.fnType === 'improper') {
			qn = mathlify`Find the range of the function

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Remark: what happens to ${'f'}
if ${'\\frac{c}{b} = a'}?`;
		} else {
			qn = mathlify`Find the range of the function

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.`;
		}
	} else {
		qn = mathlify`Find the range of the function

$${fnString}.`;
	}
	const modB = state1.fnType === 'abs' ? '|b|' : 'b';
	const ans =
		(state1.fnType === 'abs' || state1.fnType === 'improper') && state1.unknownConstants
			? mathlify`$${'R_f'} = ${generateRange(state1, exp).join(' \\cup ')}.

If ${'\\frac{c}{b} = a'}, 
then ${'f'}
will be a constant function
${`f(x)=${modB}`}.`
			: mathlify`$${'R_f'} = ${generateRange(state1, exp).join(' \\cup ')}.`;
	return { qn, ans };
}

/**
 *
 * @param state
 * @param options
 * @returns [fnString(including domain), fnExp, domain]
 */
export function generateFn(
	state: State,
	options?: { fnName?: string; align?: boolean },
): [string, Expression, Interval[]] {
	const alignChar = options?.align ? '&&' : '';
	const f = options?.fnName ?? 'f';
	let output = `${f}: x \\mapsto `;
	let exp: Expression;
	const { a, b, c, fnType, restriction, unknownConstants } = state;
	if (fnType === 'linear') {
		exp = new Expression(sum(['a', 'x'], 'b'));
	} else if (fnType === 'quadratic') {
		exp = new Expression(sum([sum('x', 'a'), '^', 2], 'b'));
	} else if (fnType === 'log') {
		exp = new Expression(sum(logTerm(sum('x', 'a')), 'b'));
	} else if (fnType === 'exp') {
		exp = new Expression(sum([e, '^', ['a', 'x']], 'b'));
	} else if (fnType === 'sqrt') {
		exp = new Expression(sum(sqrtTerm(sum('x', 'a')), 'b'));
	} else if (fnType === 'frac') {
		exp = new Expression(sum('b', ['c', '/', sum('x', 'a')]));
	} else if (fnType === 'improper') {
		exp = new Expression([sum(['b', 'x'], 'c'), '/', sum('x', 'a')]);
	} else if (fnType === 'abs') {
		exp = absTerm([sum(['b', 'x'], 'c'), '/', sum('x', 'a')]);
	} else {
		// special
		exp =
			b > 0
				? new Expression([b * a * a, '/', sum(['x', '^', 2], -a * a)])
				: new Expression([Math.abs(b) * a * a, '/', sum(a * a, [-1, ['x', '^', 2]])]);
	}
	if (!unknownConstants) {
		exp = exp.subIn({ a, b, c });
	} else if (fnType === 'linear' && a < 0 && b > 0) {
		exp = new Expression(sum(b, [a, 'x']));
	}
	let domain = `x \\in \\mathbb{R}`;
	let d = [Interval.ALL_REAL];
	const negativeA = unknownConstants ? new Expression([-1, 'a']) : new Expression(-a);
	if (restriction) {
		if (fnType === 'quadratic' && unknownConstants) {
			const sign =
				restriction.type === 'left'
					? restriction.inclusive
						? ' \\leq '
						: ' < '
					: restriction.inclusive
						? ' \\geq '
						: ' > ';
			domain += `, x ${sign} -a`;
			d = [intervalBuilder(restriction.type, negativeA, restriction.inclusive)];
		} else {
			d = [intervalBuilder(restriction.type, restriction.x, restriction.inclusive)];
			domain += ', ' + generateInequality(restriction);
		}
	} else {
		if (fnType === 'log') {
			d = [intervalBuilder('right', negativeA, false)];
			domain += unknownConstants ? `, x > -a` : `, x > ${-a}`;
		} else if (fnType === 'sqrt') {
			d = [intervalBuilder('right', negativeA, true)];
			domain += unknownConstants ? `, x \\geq -a` : `, x \\geq ${-a}`;
		} else if (fnType === 'frac' || fnType === 'improper' || fnType === 'abs') {
			d = [intervalBuilder('left', negativeA, false), intervalBuilder('right', negativeA, false)];
			domain += unknownConstants ? `, x \\neq -a` : `, x \\neq ${-a}`;
		} else if (fnType === 'special') {
			d = [
				intervalBuilder('left', -Math.abs(a), false),
				new Interval({ left: -Math.abs(a), right: Math.abs(a) }),
				intervalBuilder('right', Math.abs(a), false),
			];
			domain += `, x \\neq \\pm ${Math.abs(a)}`;
		}
	}
	output += `${exp}, \\quad ${alignChar}${domain}`;
	return [output, exp, d];
}

export function generateInequality(restriction: {
	type: 'left' | 'right';
	inclusive: boolean;
	x: number;
}): string {
	const { type, inclusive, x } = restriction;
	const sign = type === 'left' ? (inclusive ? '\\leq ' : '< ') : inclusive ? '\\geq ' : '> ';
	return `x ${sign}${x}`;
}

export function generateRange(state: State, exp: Expression): Interval[] {
	const { fnType, restriction, a, b, c, unknownConstants } = state;
	const allReal: Interval[] = [Interval.ALL_REAL];
	const bExp = new Expression(unknownConstants ? 'b' : b);
	if (fnType === 'linear') {
		if (!restriction) return allReal;
		const { type, x, inclusive } = restriction;
		const y = exp.subIn({ x });
		const rangeType = (a > 0 && type === 'left') || (a < 0 && type === 'right') ? 'left' : 'right';
		return [intervalBuilder(rangeType, y, inclusive)];
	} else if (fnType === 'quadratic') {
		// (x+a)^2 + b
		const defaultRange = [intervalBuilder('right', bExp, true)];
		if (!restriction) return defaultRange;
		const { type, x, inclusive } = restriction;
		if (unknownConstants) return [intervalBuilder('right', bExp, inclusive)];
		const y = exp.subIn({ x });
		return (x < -a && type === 'left') || (x > -a && type === 'right') || x === a
			? [intervalBuilder('right', y, inclusive)]
			: defaultRange;
	} else if (fnType === 'log') {
		return restriction ? [intervalBuilder('right', bExp, restriction.inclusive)] : allReal;
	} else if (fnType === 'exp') {
		if (!restriction) return [intervalBuilder('right', bExp, false)];
		// restriction chosen to be e^0 + b
		const { inclusive, type } = restriction;
		const bPlus1 = bExp.plus(1);
		return (type === 'left' && a > 0) || (type === 'right' && a < 0)
			? [new Interval({ left: bExp, right: bPlus1, rightInclusive: inclusive })]
			: [intervalBuilder('right', bPlus1, inclusive)];
	} else if (fnType === 'sqrt') {
		if (!restriction) return [intervalBuilder('right', bExp, true)];
		// restriction chosen to be right
		const { inclusive, x } = restriction;
		const y = Math.sqrt(x + a) + b;
		return [intervalBuilder('right', y, inclusive)];
	} else if (fnType === 'frac' || fnType == 'improper') {
		if (!restriction)
			return [intervalBuilder('left', bExp, false), intervalBuilder('right', bExp, false)];
		// restriction chosen to be a single interval
		const { x, inclusive } = restriction;
		const y = exp.subIn({ x });
		return y.valueOf() < b
			? [new Interval({ left: y, leftInclusive: inclusive, right: bExp })]
			: [new Interval({ left: bExp, right: y, rightInclusive: inclusive })];
	} else if (fnType === 'abs') {
		if (!restriction) return [intervalBuilder('right', 0, true)];
		const { x, inclusive, type } = restriction;
		const y = exp.subIn({ x });
		// https://www.desmos.com/calculator/yb2bwgxywr
		if (-c / b < -a) {
			if (type === 'left') {
				if (x < -c / b) {
					return [new Interval({ left: y, leftInclusive: inclusive, right: Math.abs(b) })];
				} else {
					return y.valueOf() < Math.abs(b)
						? [new Interval({ left: 0, leftInclusive: true, right: Math.abs(b) })]
						: [new Interval({ left: 0, leftInclusive: true, right: y, rightInclusive: inclusive })];
				}
			} else {
				return [new Interval({ left: Math.abs(b), right: y, rightInclusive: inclusive })];
			}
		} else {
			if (type === 'left') {
				return [new Interval({ left: Math.abs(b), right: y, rightInclusive: inclusive })];
			} else {
				if (x > -c / b) {
					return [new Interval({ left: y, leftInclusive: inclusive, right: Math.abs(b) })];
				} else {
					return y.valueOf() < Math.abs(b)
						? [new Interval({ left: 0, leftInclusive: true, right: Math.abs(b) })]
						: [new Interval({ left: 0, leftInclusive: true, right: y, rightInclusive: inclusive })];
				}
			}
		}
	} else {
		// special
		const y = exp.subIn({ x: 0 });
		if (restriction) {
			const intervalType = y.valueOf() < 0 ? 'right' : 'left';
			return [intervalBuilder(intervalType, 0, false)];
		}
		return b < 0
			? [new Interval({ right: 0 }), new Interval({ left: y, leftInclusive: true })]
			: [new Interval({ right: y, rightInclusive: true }), new Interval({ left: 0 })];
	}
}

export const practice: Practice = {
	generateState,
	generateQn,
};
