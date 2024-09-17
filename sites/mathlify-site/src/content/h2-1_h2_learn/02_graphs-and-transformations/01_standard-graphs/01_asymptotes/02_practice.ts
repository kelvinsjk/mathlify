import type { Interval } from '$lib/components/svg/NumberLine.svelte';
import { chooseRandom, getRandomInt, coinFlip } from '$lib/utils/random';
import { mathlifier } from 'mathlifier';

// objectives
// A: interval vs inequality
// B: left, right, two, neq, union
// C: inclusive vs exclusive

type Type = 'left' | 'right' | 'two' | 'neq' | 'union';
const types: Type[] = ['left', 'right', 'two', 'neq', 'union'];
interface StateOne {
	type: 'left' | 'right';
	a: number;
	inclusive: boolean;
}
interface StateTwo {
	type: 'two';
	a: number;
	b: number;
	inclusiveA: boolean;
	inclusiveB: boolean;
}
interface StateNeq {
	type: 'neq';
	a: number;
}
interface StateUnion {
	type: 'union';
	intervals: [StateOne | StateTwo, StateOne | StateTwo];
}
type State = (StateOne | StateTwo | StateNeq | StateUnion) & { isInequality: boolean };

export function generateState(options: {
	type: 'left' | 'right';
	a?: number;
}): StateOne & { isInequality: boolean };
export function generateState(options: {
	type: 'two';
	a?: number;
	b?: number;
}): StateTwo & { isInequality: boolean };
export function generateState(options: {
	type: 'left' | 'two' | 'right';
	a?: number;
	b?: number;
}): (StateOne | StateTwo) & { isInequality: boolean };
export function generateState(): State;
export function generateState(options?: { type?: Type; a?: number; b?: number }): State {
	const type = options?.type ?? chooseRandom(types);
	let a = options?.a ?? getRandomInt(-9, 9);
	const inclusive = coinFlip();
	const isInequality = coinFlip();
	if (type === 'left' || type === 'right') {
		return { type, a, inclusive, isInequality };
	} else if (type === 'two') {
		// leave a gap of at least 2
		a = options?.a ?? getRandomInt(-9, 7);
		const b = options?.b ?? getRandomInt(a + 2, 9);
		return { type, a, b, inclusiveA: inclusive, inclusiveB: coinFlip(), isInequality };
	} else if (type === 'neq') {
		return { type, a, isInequality };
	} else {
		let type: 'left' | 'right' | 'two' = coinFlip() ? 'left' : 'two';
		let a = getRandomInt(-9, 3);
		let b = getRandomInt(a + 2, 5);
		const firstState = generateState({ type, a, b });
		a = getRandomInt(type === 'left' ? a + 2 : b + 2, 7);
		type = coinFlip() ? 'right' : 'two';
		b = getRandomInt(a + 2, 9);
		const secondState = generateState({ type, a, b });
		return { type: 'union', intervals: [firstState, secondState], isInequality };
	}
}

export function generateQn(state: State) {
	const inequalityText = state.isInequality ? `inequality` : `number line`;
	const qn = mathlifier`Write down the set described by the following @${inequalityText} in interval notation.`;
	const ans = mathlifier`$${generateAns(state)}`;
	const inequalityOrInterval: string | Interval[] = state.isInequality
		? mathlifier`$${generateInequality(state)}`
		: generateIntervals(state);
	return { qn, ans, inequalityOrInterval };
}

function generateAns(state: State): string {
	switch (state.type) {
		case 'left': {
			const delimiter = state.inclusive ? ']' : ')';
			return `\\left( -\\infty, ${state.a} \\right${delimiter}`;
		}
		case 'right': {
			const delimiter = state.inclusive ? '[' : '(';
			return `\\left${delimiter} ${state.a}, \\infty \\right)`;
		}
		case 'two': {
			const delimiter1 = state.inclusiveA ? '[' : '(';
			const delimiter2 = state.inclusiveB ? ']' : ')';
			return `\\left${delimiter1} ${state.a}, ${state.b} \\right${delimiter2}`;
		}
		case 'neq':
			return `\\left(-\\infty, ${state.a} \\right) \\cup \\left(${state.a}, \\infty \\right)`;
		case 'union':
			return (
				generateAns({ ...state.intervals[0], isInequality: true }) +
				` \\cup ` +
				generateAns({ ...state.intervals[1], isInequality: true })
			);
	}
}

function generateInequality(state: State): string {
	switch (state.type) {
		case 'left': {
			const sign = state.inclusive ? '\\leq ' : '<';
			return `x ${sign} ${state.a}`;
		}
		case 'right': {
			const sign = state.inclusive ? '\\geq ' : '>';
			return `x ${sign} ${state.a}`;
		}
		case 'two': {
			const sign1 = state.inclusiveA ? '\\leq ' : '<';
			const sign2 = state.inclusiveB ? '\\leq ' : '<';
			return `${state.a} ${sign1} x ${sign2} ${state.b}`;
		}
		case 'neq':
			return `x \\in \\mathbb{R}, \\; x \\neq ${state.a}`;
		case 'union':
			return (
				generateInequality({ ...state.intervals[0], isInequality: true }) +
				`\\; \\text{ or } \\;` +
				generateInequality({ ...state.intervals[1], isInequality: true })
			);
	}
}

function generateIntervals(state: State): Interval[] {
	const type = state.type;
	if (type === 'left' || type === 'right') {
		return [{ type, x: state.a, inclusive: state.inclusive }];
	} else if (type === 'two') {
		return [
			{
				type,
				x1: state.a,
				x2: state.b,
				inclusive: [state.inclusiveA, state.inclusiveB]
			}
		];
	} else if (type === 'neq') {
		const inclusive = false;
		return [
			{ type: 'left', x: state.a, inclusive },
			{ type: 'right', x: state.a, inclusive }
		];
	} else if (type === 'union') {
		const isInequality = true; //dummy
		return [
			...generateIntervals({ ...state.intervals[0], isInequality }),
			...generateIntervals({ ...state.intervals[1], isInequality })
		];
	}
	console.warn(`unexpected interval`, state);
	throw new Error('unexpected interval');
}
