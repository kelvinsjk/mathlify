import { coinFlip, chooseRandom, getRandomInt } from '$lib/utils/random';

// objectives
// A: otherwise or not
// no otherwise: case 1: g(x), x < x2. case 2: h(x), x > x2. equal on one side
// otherwise: case 1: g(x), x1 \leq x < x2. case 2: h(x), x2 < x \leq x3. equal on one side

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, Polynomial, quotient } from 'mathlify';
import { ExpressionWorking } from 'mathlify/working';

import {
	type IntervalOneSided,
	type IntervalTwoSided,
	generateFn,
	generateState as generateState1
} from '../../01_concepts/02_domain-and-range/02_practice-1';
import { Interval, intervalBuilder } from '../../_intervals';

const typesG = ['linear', 'quadratic', 'exp', 'const'] as const;
const typesH = ['linear', 'special-quadratic', 'exp', 'sqrt', 'log', 'improper'] as const;
// special quadratic: \frac{1}{b}(x-a)^2 where b = 1,4,9

interface State {
	intervalG: IntervalOneSided | IntervalTwoSided;
	intervalH: IntervalOneSided | IntervalTwoSided;
	g: {
		fnType: (typeof typesG)[number];
		a: number;
		b: number;
		c: number;
	};
	h: {
		fnType: (typeof typesH)[number];
		a: number;
		b: number;
		c: number;
	};
	x: number;
}

export const practiceTitle = 'piecewise functions';

export function generateState(): State {
	// handle h
	const fnTypeH = chooseRandom(typesH);
	const hState = generateState1({
		type: fnTypeH === 'special-quadratic' ? 'linear' : fnTypeH,
		unknownConstants: false
	});
	// handle intervalH
	const aH = hState.a;
	const shift = getRandomInt(1, 3);
	const x2 =
		fnTypeH === 'special-quadratic'
			? -aH - shift
			: fnTypeH === 'sqrt' || fnTypeH === 'log' || fnTypeH === 'improper'
				? -aH
				: getRandomInt(-2, 2);
	const otherwise = coinFlip();
	const inclusive = fnTypeH === 'log' || fnTypeH === 'improper' ? false : coinFlip();
	const intervalH: IntervalOneSided | IntervalTwoSided = otherwise
		? { type: 'two', inclusive: [inclusive, true], x: [x2, x2 + getRandomInt(1, 4)] }
		: { type: 'right', inclusive, x: x2 };
	// handle g
	const fnTypeG = chooseRandom(typesG);
	const gState = generateState1({
		type: fnTypeG === 'const' ? 'linear' : fnTypeG,
		unknownConstants: false
	});
	// handle intervalG
	const intervalG: IntervalOneSided | IntervalTwoSided = otherwise
		? { type: 'two', inclusive: [true, !inclusive], x: [x2 - getRandomInt(1, 4), x2] }
		: { type: 'left', inclusive: !inclusive, x: x2 };
	const x = x2 + getRandomInt(-4, 4);
	return {
		intervalG,
		intervalH,
		g: {
			fnType: fnTypeG,
			a: gState.a,
			b: fnTypeG === 'const' ? 0 : gState.b,
			c: fnTypeG === 'const' ? 0 : gState.c
		},
		h: {
			fnType: fnTypeH,
			a: hState.a,
			b: fnTypeH === 'special-quadratic' ? shift * shift : gState.b,
			c: fnTypeH === 'special-quadratic' ? 0 : gState.c
		},
		x
	};
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const { x } = state1;
	const [fnDef, g, h] = generatePieceWiseFn(state1);
	const qn =
		mathlifier`A function ${'f'}
is defined on all real numbers by` +
		fnDef +
		mathlifier`Find ${{}} f(${x}).`;
	return { qn, ans: generateAns(state1, g, h)[0] };
}

function generatePieceWiseFn(state: State): [string, Expression, Expression] {
	const { intervalG, intervalH, g, h } = state;
	const otherwise = intervalG.type === 'two';
	const gExp =
		g.fnType === 'const'
			? generateConst({ ...g, fnType: 'const' })
			: generateFn({ ...g, restriction: false, unknownConstants: false, fnType: g.fnType })[1];
	const hExp =
		h.fnType === 'special-quadratic'
			? generateSpecialQuadratic({ ...h, fnType: 'special-quadratic' })
			: generateFn({ ...h, restriction: false, unknownConstants: false, fnType: h.fnType })[1];
	const string = otherwise
		? mathlifier`$${{}} f(x) = \\begin{cases} ${gExp} \\quad &\\text{for } ${intervalToInequality(intervalG)},
\\\\ ${hExp} \\quad &\\text{for } ${intervalToInequality(intervalH)},
\\\\ 0 \\quad &\\text{otherwise}. \\end{cases}`
		: mathlifier`$${{}} f(x) = \\begin{cases} ${gExp} \\quad &\\text{for } ${intervalToInequality(intervalG)},
\\\\ ${hExp} \\quad &\\text{for } ${intervalToInequality(intervalH)}. \\end{cases}`;
	return [string, gExp, hExp];
}

function generateConst(state: { fnType: 'const'; a: number }): Expression {
	return new Expression(state.a);
}
function generateSpecialQuadratic(state: {
	fnType: 'special-quadratic';
	a: number;
	b: number;
}): Expression {
	return new Expression([quotient(1, state.b), [new Polynomial([1, state.a]), '^', 2]]).simplify();
}
function intervalToInequality(interval: IntervalOneSided | IntervalTwoSided): string {
	return intervalToObj(interval).toInequality();
}
function intervalToObj(interval: IntervalOneSided | IntervalTwoSided): Interval {
	return interval.type === 'two'
		? new Interval({
				left: interval.x[0],
				right: interval.x[1],
				leftInclusive: interval.inclusive[0],
				rightInclusive: interval.inclusive[1]
			})
		: intervalBuilder(interval.type, interval.x, interval.inclusive);
}

function generateAns(state: State, g: Expression, h: Expression): [string, Expression] {
	const { intervalG, intervalH, x } = state;
	const [intG, intH] = [intervalG, intervalH].map((x) => intervalToObj(x));
	const verbatim = true;
	if (intG.includes(x)) {
		const working = new ExpressionWorking(g.subIn({ x }, { verbatim }), { leadingEqual: true });
		working.simplify();
		const ans = mathlifier`$${'align*'} f(${x}) ${working}.`;
		return [ans, working.expression];
	}
	if (intH.includes(x)) {
		const working = new ExpressionWorking(h.subIn({ x }, { verbatim }), { leadingEqual: true });
		working.simplify();
		const ans = mathlifier`$${'align*'} f(${x}) ${working}.`;
		return [ans, working.expression];
	}
	return [mathlifier`$${{}}f(x)=0.`, new Expression(0)];
}
