import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import { logTerm, sqrtTerm, absTerm } from 'mathlify/fns';
import { Expression, sum, e } from 'mathlify';

// ax+b (2013). unknown constants + restriction: x=0
// (x+a)^2 + b, (2007,2008). unknown constants + restriction: x=-a
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

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
export type Type = Types[number];

export interface State extends PracticeState {
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

export function generateState(options?: { type?: Type }): State {
	// we try to get a final range between -5 and 5;
	const fnType = options?.type ?? chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	let c = getRandomInt(-4, 4);
	let unknownConstants = Math.random() < 0.3;
	const isRestricted = Math.random() < 0.3;
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
			? mathlify`$${'R_f'} = ${generateAns(state1, exp)}.

If ${'\\frac{c}{b} = a'}, 
then ${'f'}
will be a constant function
${`f(x)=${modB}`}.`
			: mathlify`$${'R_f'} = ${generateAns(state1, exp)}.`;
	return { qn, ans };
}

export function generateFn(state: State): [string, Expression] {
	let x = 'f: x \\mapsto ';
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
	x += `${exp}, \\quad x \\in \\mathbb{R}`;
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
			x += `, x ${sign} -a`;
		} else {
			x += ', ' + generateInequality(restriction);
		}
	} else {
		if (fnType === 'log') {
			x += unknownConstants ? `, x > -a` : `, x > ${-a}`;
		} else if (fnType === 'sqrt') {
			x += unknownConstants ? `, x \\geq -a` : `, x \\geq ${-a}`;
		} else if (fnType === 'frac' || fnType === 'improper' || fnType === 'abs') {
			x += unknownConstants ? `, x \\neq -a` : `, x \\neq ${-a}`;
		} else if (fnType === 'special') {
			x += `, x \\neq \\pm ${Math.abs(a)}`;
		}
	}
	return [x, exp];
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

export function generateAns(state: State, exp: Expression): string {
	const { fnType, restriction, a, b, c, unknownConstants } = state;
	if (fnType === 'linear') {
		if (restriction) {
			const { type, x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if ((a > 0 && type === 'left') || (a < 0 && type === 'right')) {
				return `\\left( -\\infty, ${y} \\right${rightBracket(inclusive)}`;
			} else {
				return `\\left${leftBracket(inclusive)} ${y}, \\infty \\right)`;
			}
		}
		return `\\left( -\\infty, \\infty \\right)`;
	} else if (fnType === 'quadratic') {
		// (x+a)^2 + b
		if (restriction) {
			const { type, x, inclusive } = restriction;
			if (unknownConstants) {
				return `\\left${leftBracket(inclusive)} b, \\infty \\right)`;
			}
			const y = exp.subIn({ x });
			if ((x < -a && type === 'left') || (x > -a && type === 'right') || !inclusive) {
				return `\\left${leftBracket(inclusive)} ${y}, \\infty \\right)`;
			}
		}
		return unknownConstants ? `\\left[ b, \\infty \\right)` : `\\left[ ${b}, \\infty \\right)`;
	} else if (fnType === 'log') {
		if (restriction) {
			// chosen to be ln 1 and on the right
			return `\\left${leftBracket(restriction.inclusive)} ${b}, \\infty \\right)`;
		}
		return `\\left( -\\infty, \\infty \\right)`;
	} else if (fnType === 'exp') {
		if (restriction) {
			// chosen to be e^0 + b
			const { inclusive, type } = restriction;
			if ((type === 'left' && a > 0) || (type === 'right' && a < 0)) {
				return unknownConstants
					? `\\left( b, b+1 \\right${rightBracket(inclusive)}`
					: `\\left( ${b}, ${b + 1} \\right${rightBracket(inclusive)}`;
			} else {
				return unknownConstants
					? `\\left${leftBracket(inclusive)} b+1, \\infty \\right)`
					: `\\left${leftBracket(inclusive)} ${b + 1}, \\infty \\right)`;
			}
		}
		return unknownConstants ? `\\left( b, \\infty \\right)` : `\\left( ${b}, \\infty \\right)`;
	} else if (fnType === 'sqrt') {
		if (restriction) {
			// chosen to be right
			const { inclusive, x } = restriction;
			const y = Math.sqrt(x + a) + b;
			return `\\left${leftBracket(inclusive)} ${y}, \\infty \\right)`;
		}
		return unknownConstants ? `\\left[ b, \\infty \\right)` : `\\left[ ${b}, \\infty \\right)`;
	} else if (fnType === 'frac' || fnType == 'improper') {
		if (restriction) {
			// chosen to be a single interval
			const { x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if (y.valueOf() < b) {
				return `\\left${leftBracket(inclusive)} ${y}, ${b} \\right)`;
			} else {
				return `\\left( ${b}, ${y} \\right${rightBracket(inclusive)}`;
			}
		}
		return unknownConstants
			? `\\left( -\\infty, b \\right) \\cup \\left( b, \\infty \\right)`
			: `\\left( -\\infty, ${b} \\right) \\cup \\left( ${b}, \\infty \\right)`;
	} else if (fnType === 'abs') {
		if (restriction) {
			const { x, inclusive, type } = restriction;
			const y = exp.subIn({ x });
			// https://www.desmos.com/calculator/yb2bwgxywr
			if (-c / b < -a) {
				if (type === 'left') {
					if (x < -c / b) {
						return `\\left${leftBracket(inclusive)} ${y}, ${Math.abs(b)} \\right)`;
					} else {
						return y.valueOf() < Math.abs(b)
							? `\\left[0 , ${Math.abs(b)} \\right)`
							: `\\left[0, ${y}\\right${rightBracket(inclusive)}`;
					}
				} else {
					return `\\left( ${Math.abs(b)}, ${y} \\right${rightBracket(inclusive)}`;
				}
			} else {
				if (type === 'left') {
					return `\\left( ${Math.abs(b)}, ${y} \\right${rightBracket(inclusive)}`;
				} else {
					if (x > -c / b) {
						return `\\left${leftBracket(inclusive)} ${y}, ${Math.abs(b)} \\right)`;
					} else {
						return y.valueOf() < Math.abs(b)
							? `\\left[0 , ${Math.abs(b)} \\right)`
							: `\\left[0, ${y}\\right${rightBracket(inclusive)}`;
					}
				}
			}
		}
		return `\\left[ 0, \\infty \\right)`;
	} else {
		// special
		const y = exp.subIn({ x: 0 });
		if (restriction) {
			return y.valueOf() < 0 ? `\\left( 0, \\infty \\right)` : `\\left(-\\infty, 0 \\right)`;
		}
		return b < 0
			? `\\left( -\\infty, 0 \\right) \\cup \\left[ ${y}, \\infty \\right)`
			: `\\left( -\\infty, ${y} \\right] \\cup \\left( 0, \\infty \\right)`;
	}
}

export const functionRange = generateAns;

function leftBracket(inclusive: boolean): string {
	return inclusive ? '[' : '(';
}
function rightBracket(inclusive: boolean): string {
	return inclusive ? ']' : ')';
}

export const practice: Practice = {
	generateState,
	generateQn,
};