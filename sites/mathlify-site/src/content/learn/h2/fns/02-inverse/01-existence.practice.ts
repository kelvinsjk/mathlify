import { chooseRandom, coinFlip, getRandomInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import type { Expression } from 'mathlify';

// similar to 01/02, but without linear case

import {
	generateState as generateState1,
	generateFn,
	type State,
} from '../01-concepts/02-functions.practice';

export function generateState(): State {
	// more chance to get non-inverses
	const typesWithNoInverse = ['quadratic', 'abs', 'special'] as const;
	const state = coinFlip()
		? generateState1()
		: generateState1({ type: chooseRandom(typesWithNoInverse) });
	if (state.fnType === 'linear') return generateState();
	return state;
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const [fnString, exp] = generateFn(state1);
	let qn: string;
	if (state.unknownConstants) {
		if (state1.fnType === 'frac') {
			qn = mathlify`The function ${'f'}
is defined by 

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.

Determine, with reason, if ${'f'}
has an inverse.`;
		} else if (state1.fnType === 'abs' || state1.fnType === 'improper') {
			qn = mathlify`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Determine, with reason, if ${'f'}
has an inverse.

Remark: what happens to ${'f'}
if ${'\\frac{c}{b} = a'}?`;
		} else {
			qn = mathlify`The function ${'f'}
is defined by

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.

Determine, with reason, if ${'f'}
has an inverse.`;
		}
	} else {
		qn = mathlify`The function ${'f'}
is defined by

$${fnString}.

Determine, with reason, if ${'f'}
has an inverse.`;
	}
	const modB = state1.fnType === 'abs' ? '|b|' : 'b';
	const { allHorizontalLines, line, atMostOnce, not, has } = generateAns(state1, exp);
	const ans =
		(state1.fnType === 'abs' || state1.fnType === 'improper') && state1.unknownConstants
			? mathlify`@${allHorizontalLines} ${line}
cuts the graph of ${'y=f(x)'}
@${atMostOnce}. Hence ${'f'}
is @${not} one-to-one and 
@${has} an inverse.

If ${'\\frac{c}{b} = a'}, 
then ${'f'}
will be a constant function
${`f(x)=${modB}`},
which does not have an inverse as it is not one-to-one.`
			: mathlify`@${allHorizontalLines} ${line}
cuts the graph of ${'y=f(x)'}
@${atMostOnce}. Hence ${'f'}
is @${not} one-to-one and 
@${has} an inverse.`;
	return { qn, ans };
}

const hasInverse = {
	allHorizontalLines: 'All horizontal lines',
	line: 'y=k, k \\in \\mathbb{R},',
	atMostOnce: 'at most once',
	not: '',
	has: 'has',
};
const noInverse = {
	allHorizontalLines: 'The horizontal line',
	atMostOnce: 'more than once',
	not: 'not',
	has: 'does not have',
};

function generateAns(
	state: State,
	exp: Expression,
): {
	allHorizontalLines: string;
	line: string;
	atMostOnce: string;
	not: string;
	has: string;
} {
	const { fnType, restriction, a, b, c, unknownConstants } = state;
	if (fnType === 'quadratic') {
		// (x+a)^2 + b
		let bPlus1 = b + 1;
		if (restriction) {
			const { type, x } = restriction;
			if ((x < -a && type === 'left') || (x > -a && type === 'right') || x === -a) {
				return hasInverse;
			}
			const y2 = exp.subIn({ x });
			bPlus1 = getRandomInt(bPlus1, y2.valueOf() - 0.01);
		}
		const line = unknownConstants ? `y=b+1` : `y=${bPlus1}`;
		return {
			line,
			...noInverse,
		};
	} else if (
		fnType === 'log' ||
		fnType === 'exp' ||
		fnType === 'sqrt' ||
		fnType === 'frac' ||
		fnType === 'improper'
	) {
		return hasInverse;
	} else if (fnType === 'abs') {
		const y = Math.abs(b) === 1 ? '0.5' : '1';
		const noInverse1 = { line: `y=${y}`, ...noInverse };
		if (restriction) {
			const { x, type } = restriction;
			// https://www.desmos.com/calculator/yb2bwgxywr
			if (-c / b < -a) {
				if (type === 'left') {
					if (x < -c / b) {
						return hasInverse;
					} else {
						const y2 = exp.subIn({ x });
						const half = y2.divide(2);
						const y3 = half.valueOf() < 1 ? half : 1;
						return y2.valueOf() >= Math.abs(b) ? noInverse1 : { line: `y=${y3}`, ...noInverse };
					}
				} else {
					return hasInverse;
				}
			} else {
				if (type === 'left') {
					return hasInverse;
				} else {
					if (x > -c / b) {
						return hasInverse;
					} else {
						const y2 = exp.subIn({ x });
						const half = y2.divide(2);
						const y3 = half.valueOf() < 1 ? half : 1;
						return y2.valueOf() >= Math.abs(b) ? noInverse1 : { line: `y=${y3}`, ...noInverse };
					}
				}
			}
		}
		return unknownConstants ? { line: `y=b+1`, ...noInverse } : noInverse1;
	} else if (fnType === 'special') {
		return state.restriction
			? hasInverse
			: {
					line: `y=${state.b > 0 ? 1 : -1}`,
					...noInverse,
				};
	} else {
		throw new Error(`Did not expect ${fnType} fnType.`);
	}
}

export function specialExistence(state: State): { ans: string; soln: string } {
	const { allHorizontalLines, line, atMostOnce, not, has } = state.restriction
		? hasInverse
		: {
				line: `y=${state.b > 0 ? 1 : -1}`,
				...noInverse,
			};
	const ans = mathlify`@${allHorizontalLines} ${line}
cuts the graph of ${'y=f(x)'}
@${atMostOnce}. Hence ${'f'}
is @${not} one-to-one and 
@${has} an inverse.`;
	const soln = mathlifyQED`@${allHorizontalLines} ${line}
cuts the graph of ${'y=f(x)'}
@${atMostOnce}. Hence ${'f'}
is @${not} one-to-one and 
@${has} an inverse`;
	return { ans, soln };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
