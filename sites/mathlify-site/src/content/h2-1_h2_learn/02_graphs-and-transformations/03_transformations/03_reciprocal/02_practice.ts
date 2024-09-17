import { chooseRandom, coinFlip, getRandomInt } from '$lib/utils/random';

// objectives
// A: fnType

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import type { Expression } from 'mathlify';

// 1. inner: log, outer: linear or quad. no restrictions
// 2. inner: imp/frac, outer: linear or quad. 50% restriction: match domain with R_inner
// 3. inner: linear/quad/sqrt, outer: exp. 50% restriction: match domain with R_inner
// 4. inner: sqrt/quad, outer: log. let b = -a + (1-4) for inner to ensure existence
// 5. inner: quad, outer: frac/imp. let b = -a + (1-4) for inner to ensure existence

import {
	generateState as generateFnState,
	generateFn,
	generateRange,
	type IntervalOneSided,
	type Type
} from '../../01_standard-graphs/02_rational-functions/02_practice-1';
import { Interval, intervalBuilder } from '../../../01_functions/_intervals';

interface FnState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction: IntervalOneSided | false;
}

export interface State {
	inner: FnState;
	outer: FnState;
	fg: boolean;
}

export const practiceTitle = 'range of composite functions';

export function generateState(): State {
	const type = getRandomInt(1, 5);
	const fg = coinFlip();
	let inner: FnState;
	let outer: FnState;
	if (type === 1) {
		// 1. inner: log, outer: linear or quad. 30% chance of restricting inner domain
		inner = generateFnState({ type: 'log', unknownConstants: false, isRestricted: coinFlip(0.3) });
		outer = generateFnState({
			type: coinFlip() ? 'linear' : 'quadratic',
			unknownConstants: false,
			isRestricted: false
		});
	} else if (type === 2) {
		// 2. inner: imp/frac, outer: linear or quad. 70% chance of restricting inner domain.
		const types = ['improper', 'frac'] as const;
		const isRestricted = coinFlip(0.7);
		inner = generateFnState({ type: chooseRandom(types), unknownConstants: false, isRestricted });
		outer = generateFnState({
			type: coinFlip() ? 'linear' : 'quadratic',
			unknownConstants: false,
			isRestricted: false
		});
	} else if (type === 3) {
		// 3. inner: linear/quad/sqrt, outer: exp. 50% restriction of restricting inner domain
		const types = ['linear', 'quadratic', 'sqrt'] as const;
		const isRestricted = coinFlip();
		inner = generateFnState({ type: chooseRandom(types), unknownConstants: false, isRestricted });
		outer = generateFnState({ type: 'exp', unknownConstants: false, isRestricted: false });
	} else if (type === 4) {
		// 4. inner: sqrt/quad, outer: log. let b = -a + (1-4) for inner to ensure existence
		outer = generateFnState({ type: 'log', unknownConstants: false, isRestricted: false });
		const a = outer.a;
		inner = generateFnState({
			type: coinFlip() ? 'sqrt' : 'quadratic',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a + getRandomInt(1, 4)
		});
	} else {
		// 5. inner: quad, outer: frac/imp. let b = -a + (1-4) for inner to ensure existence
		outer = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: false
		});
		const a = outer.a;
		inner = generateFnState({
			type: 'quadratic',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a + getRandomInt(1, 4)
		});
	}
	//delete outer.unknownConstants;
	//delete inner.unknownConstants;
	return { inner, outer, fg };
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const { fg: isFg, inner, outer } = state1;
	const [fState, gState] = isFg ? [outer, inner] : [inner, outer];
	const [fString, fExp, fDomain] = generateFn(
		{ ...fState, unknownConstants: false },
		{ align: true }
	);
	const [gString, gExp, gDomain] = generateFn(
		{ ...gState, unknownConstants: false },
		{ fnName: 'g', align: true }
	);
	const fg = isFg ? 'fg' : 'gf';
	const qn = mathlifier`The functions ${'f'}
and ${'g'}
are defined by

$${'align*'} &${fString} \\text{ and} \\\\ &${gString}.

Find the range of the composite function ${fg}.
`;

	return {
		qn,
		...compositeRange([fExp, fDomain, gExp, gDomain], isFg, [fState, gState])
	};
}

export function compositeRange(
	states: [Expression, Interval[], Expression, Interval[]], // fState, fExp, gState, gExp
	isFg: boolean,
	fnStates: [FnState, FnState],
	options?: { fName?: string; gName?: string }
): { ans: string; soln: string; range: Interval[] } {
	let f = options?.fName ?? 'f';
	let g = options?.gName ?? 'g';
	let [fExp, fDomain, gExp, gDomain] = states;
	let [fState, gState] = fnStates;
	if (!isFg) {
		[f, g] = [g, f];
		[fExp, gExp] = [gExp, fExp];
		[fDomain, gDomain] = [gDomain, fDomain];
		[fState, gState] = [gState, fState];
	}
	let fg = `${f}${g}`;
	if (f === g) fg = `${f}^2`;
	const Rg = generateRange({ ...gState, unknownConstants: false }, gExp);
	const Rfg = generateCompositeRange(fState, fExp, Rg);
	const soln = mathlifier`$${'align*'}
	D_{${g}} &= ${gDomain.join(' \\cup ')} \\\\
	&\\downarrow ${g} \\\\
	R_{${g}} &= ${Rg} \\\\
	&\\downarrow ${f} \\\\
	R_{${fg}} &= ${Rfg}
`;
	const ans = mathlifier`${{}} R_{${fg}} = ${Rfg}.`;
	const range: Interval[] = [];
	return { ans, soln, range };
}

export function generateCompositeRange(fState: FnState, fExp: Expression, Rg: Interval[]) {
	if (Rg.length === 0 || Rg.length > 2)
		throw new Error('We only support two intervals at the moment');
	if (
		Rg.length === 2 &&
		!(
			Rg[0].left === Number.NEGATIVE_INFINITY &&
			Rg[1].right === Number.POSITIVE_INFINITY &&
			!Rg[0].rightInclusive &&
			!Rg[1].leftInclusive
		) &&
		Rg[0].right.valueOf() === Rg[1].left.valueOf()
	)
		throw new Error('We only support two intervals of the type x \\neq a');
	// all intervals of length 2 are of the type x \\neq a
	// intervals of length 1 are either "all", "left", "right" or "two"
	const { fnType, a, b } = fState;
	if (fnType === 'linear') {
		// ax + b
		if (Rg.length === 2) {
			const x = Rg[0].right;
			const y = fExp.subIn({ x });
			return [new Interval({ right: y }), new Interval({ left: y })];
		}
		const range = Rg[0];
		const type = range.type;
		if (type === 'all') return [Interval.ALL_REAL];
		if (type === 'left') {
			const x = range.right;
			const y = fExp.subIn({ x });
			return a > 0
				? [intervalBuilder('left', y, range.rightInclusive)]
				: [intervalBuilder('right', y, range.rightInclusive)];
		} else if (type === 'right') {
			const x = range.left;
			const y = fExp.subIn({ x });
			return a > 0
				? [intervalBuilder('right', y, range.leftInclusive)]
				: [intervalBuilder('left', y, range.leftInclusive)];
		}
		// two-side
		const x1 = range.left;
		const x2 = range.right;
		const inclusive1 = range.leftInclusive;
		const inclusive2 = range.rightInclusive;
		const y1 = fExp.subIn({ x: x1 });
		const y2 = fExp.subIn({ x: x2 });
		const [left, right, leftInclusive, rightInclusive] =
			y1.valueOf() < y2.valueOf()
				? [y1, y2, inclusive1, inclusive2]
				: [y2, y1, inclusive2, inclusive1];
		return [new Interval({ left, right, leftInclusive, rightInclusive })];
	} else if (fnType === 'quadratic') {
		// (x+a)^2 + b
		if (Rg.length === 2) {
			const x = Rg[0].right;
			const y = fExp.subIn({ x });
			// range only change if f(x)=b
			return [intervalBuilder('right', b, y.valueOf() === b ? false : true)];
		}
		const range = Rg[0];
		const type = range.type;
		if (type === 'all') return [intervalBuilder('right', b, true)];
		if (type === 'left') {
			const x = range.right;
			if (x.valueOf() > -a) return [intervalBuilder('right', b, true)];
			const y = fExp.subIn({ x });
			return [intervalBuilder('right', y, range.rightInclusive)];
		} else if (type === 'right') {
			const x = range.left;
			if (x.valueOf() > -a) return [intervalBuilder('right', b, true)];
			const y = fExp.subIn({ x });
			return [intervalBuilder('left', y, range.leftInclusive)];
		}
		// two-sided
		interface Value {
			x: number | Expression;
			inclusive: boolean;
		}
		const x1 = range.left;
		const x2 = range.right;
		const values: Value[] = [];
		values.push({ x: fExp.subIn({ x: x1 }), inclusive: range.leftInclusive });
		values.push({ x: fExp.subIn({ x: x2 }), inclusive: range.rightInclusive });
		if (x1.valueOf() < -a && -a < x2.valueOf()) {
			values.push({ x: b, inclusive: true });
		}
		values.sort((a, b) => a.x.valueOf() - b.x.valueOf());
		const leftObj = values.shift()!; // we have at least two elements
		const rightObj = values.pop()!;
		return [
			new Interval({
				left: leftObj.x,
				leftInclusive: leftObj.inclusive,
				right: rightObj.x,
				rightInclusive: rightObj.inclusive
			})
		];
	} else if (fnType === 'exp') {
		// e^{ax} + b
		if (Rg.length === 2) {
			const x = Rg[0].right;
			const y = fExp.subIn({ x });
			return [new Interval({ left: b, right: y }), new Interval({ left: y })];
		}
		const range = Rg[0];
		const type = range.type;
		if (type === 'all') return [intervalBuilder('right', b, false)];
		if (type === 'left') {
			const x = range.right;
			const y = fExp.subIn({ x });
			return [new Interval({ left: b, right: y, rightInclusive: range.rightInclusive })];
		} else if (type === 'right') {
			const x = range.left;
			const y = fExp.subIn({ x });
			return [intervalBuilder('right', y, range.leftInclusive)];
		}
		// two-side
		const x1 = range.left;
		const x2 = range.right;
		const y1 = fExp.subIn({ x: x1 });
		const y2 = fExp.subIn({ x: x2 });
		return [
			new Interval({
				left: y1,
				right: y2,
				leftInclusive: range.leftInclusive,
				rightInclusive: range.rightInclusive
			})
		];
	} else if (fnType === 'log') {
		// only support right sided interval > -a at the moment
		if (
			Rg.length !== 1 ||
			Rg[0]?.type !== 'right' ||
			Rg[0]?.left.valueOf() < -a ||
			(Rg[0]?.left.valueOf() === -a && Rg[0]?.leftInclusive)
		)
			throw new Error(`Only support right sided intervals within domain for logarithm`);
		const range = Rg[0];
		const x = range.left;
		if (x.valueOf() === -a) return [Interval.ALL_REAL];
		const y = fExp.subIn({ x });
		return [intervalBuilder('right', y, range.leftInclusive)];
	} else if (fnType === 'frac' || fnType === 'improper') {
		// only support right sided interval > -a at the moment
		if (
			Rg.length !== 1 ||
			Rg[0]?.type !== 'right' ||
			Rg[0]?.left.valueOf() < -a ||
			(Rg[0]?.left.valueOf() === -a && Rg[0]?.leftInclusive)
		)
			throw new Error(`Only support right sided intervals within domain for logarithm`);
		const range = Rg[0];
		const x = range.left;
		const testPoint = fExp.subIn({ x: -a + 1 }).valueOf();
		if (x.valueOf() === -a)
			return testPoint < b ? [new Interval({ right: b })] : [new Interval({ left: b })];
		const y = fExp.subIn({ x });
		return y.valueOf() < b
			? [new Interval({ left: y, leftInclusive: range.leftInclusive, right: b })]
			: [new Interval({ left: b, right: y, rightInclusive: range.leftInclusive })];
	}
	throw new Error('We only outer functions of the type linear/quadratic/exp/log/frac/improper');
}
