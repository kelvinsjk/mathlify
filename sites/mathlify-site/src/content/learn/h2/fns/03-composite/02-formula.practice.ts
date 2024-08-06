import { chooseRandom, coinFlip, getRandomInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants
// D: definition vs f^{-1}(x)

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import type { Expression } from 'mathlify';
import { ExpressionWorking } from 'mathlify/working';

// 1. inner: log, outer: linear or quad. no restrictions
// 2. inner: imp/frac, outer: linear or quad. 50% restriction: match domain with R_inner
// 3. inner: linear/quad/sqrt, outer: exp. 50% restriction: match domain with R_inner
// 4. inner: sqrt/quad, outer: log. let b = -a + (1-4) for inner to ensure existence
// 5. inner: quad, outer: frac/imp. let b = -a + (1-4) for inner to ensure existence
// 6. inner: frac/imp, outer: frac/imp. let b = -a for inner to ensure existence

import {
	generateState as generateFnState,
	generateFn,
	generateRange,
	type IntervalOneSided,
	type Type,
} from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { QED } from '$lib/utils/typesetting';
import type { Interval } from '../intervals';

interface FnState extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction: IntervalOneSided | false;
}

export interface State extends PracticeState {
	inner: FnState; // TODO: remove unknownConstants from this
	outer: FnState;
	definition: boolean;
	fg: boolean;
}

export function generateState(): State {
	const type = getRandomInt(1, 6);
	const definition = coinFlip();
	const fg = coinFlip();
	let inner: FnState;
	let outer: FnState;
	if (type === 1) {
		// 1. inner: log, outer: linear or quad. no restrictions
		inner = generateFnState({ type: 'log', unknownConstants: false, isRestricted: false });
		outer = generateFnState({
			type: coinFlip() ? 'linear' : 'quadratic',
			unknownConstants: false,
			isRestricted: false,
		});
	} else if (type === 2) {
		// 2. inner: imp/frac, outer: linear or quad. 50% restriction: match domain with R_inner
		const types = ['improper', 'frac'] as const;
		const isRestricted = coinFlip();
		inner = generateFnState({ type: chooseRandom(types), unknownConstants: false, isRestricted });
		outer = generateFnState({
			type: coinFlip() ? 'linear' : 'quadratic',
			unknownConstants: false,
			isRestricted,
		});
		if (isRestricted) {
			const ranges = generateRange(
				{ ...inner, unknownConstants: false },
				generateFn({ ...inner, unknownConstants: false })[1],
			);
			if (ranges.length !== 1) throw new Error('expected range to be made up of a single interval');
			const range = ranges[0];
			if (range.isOneSided()) {
				outer.restriction = range.toOneSidedInterval();
			}
		}
	} else if (type === 3) {
		// 3. inner: linear/quad/sqrt, outer: exp. 50% restriction: match domain with R_inner
		const types = ['linear', 'quadratic', 'sqrt'] as const;
		const isRestricted = coinFlip();
		inner = generateFnState({ type: chooseRandom(types), unknownConstants: false, isRestricted });
		outer = generateFnState({ type: 'exp', unknownConstants: false, isRestricted });
		if (isRestricted) {
			const ranges = generateRange(
				{ ...inner, unknownConstants: false },
				generateFn({ ...inner, unknownConstants: false })[1],
			);
			if (ranges.length !== 1) throw new Error('expected range to be made up of a single interval');
			outer.restriction = ranges[0].toOneSidedInterval();
		}
	} else if (type === 4) {
		// 4. inner: sqrt/quad, outer: log. let b = -a + (1-4) for inner to ensure existence
		outer = generateFnState({ type: 'log', unknownConstants: false, isRestricted: false });
		const a = outer.a;
		inner = generateFnState({
			type: coinFlip() ? 'sqrt' : 'quadratic',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a + getRandomInt(1, 4),
		});
	} else if (type === 5) {
		// 5. inner: quad, outer: frac/imp. let b = -a + (1-4) for inner to ensure existence
		outer = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: false,
		});
		const a = outer.a;
		inner = generateFnState({
			type: 'quadratic',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a + getRandomInt(1, 4),
		});
	} else {
		// 6. inner: frac/imp, outer: frac/imp. let b = -a for inner to ensure existence
		outer = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: false,
		});
		const a = outer.a;
		inner = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a,
		});
	}
	delete outer.unknownConstants;
	delete inner.unknownConstants;
	return { inner, outer, definition, fg };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { fg: isFg, inner, outer, definition } = state1;
	const [fState, gState] = isFg ? [outer, inner] : [inner, outer];
	const [fString, fExp, fDomain] = generateFn(
		{ ...fState, unknownConstants: false },
		{ align: true },
	);
	const [gString, gExp, gDomain] = generateFn(
		{ ...gState, unknownConstants: false },
		{ fnName: 'g', align: true },
	);
	const fg = isFg ? 'fg' : 'gf';
	const qn2 = definition
		? mathlify`Define the composite function ${fg},
including its domain, in similar form.`
		: mathlify`Find ${fg}(x)
and state its domain.`;
	const qn =
		mathlify`The functions ${'f'}
and ${'g'}
are defined by

$${'align*'} &${fString} \\text{ and} \\\\ &${gString}.
` + qn2;
	return {
		qn,
		...compositeFormula([fState, fExp, fDomain, gState, gExp, gDomain], isFg, definition),
	}; // { ans: compositeFormula([fState, fExp, gState, gExp], definition) }
}

export function compositeFormula(
	states: [FnState, Expression, Interval[], FnState, Expression, Interval[]], // fState, fExp, gState, gExp
	isFg: boolean,
	definition: boolean,
	options?: { fName?: string; gName?: string },
): { ans: string; soln: string; exp: Expression } {
	let f = options?.fName ?? 'f';
	let g = options?.gName ?? 'g';
	let [fState, fExp, fDomain, gState, gExp, gDomain] = states;
	if (!isFg) {
		[f, g] = [g, f];
		[fExp, gExp] = [gExp, fExp];
		[fState, gState] = [gState, fState];
		[fDomain, gDomain] = [gDomain, fDomain];
	}
	console.log(`${fExp}, ${fDomain}, ${gExp}, ${gDomain}`);
	let fg = `${f}${g}`;
	if (f === g) fg = `${f}^2`;
	const working = new ExpressionWorking(fExp.subIn({ x: gExp }, { verbatim: true }), {
		leadingEqual: true,
	});
	working.expand({ onlyLinear: true, verbatim: 'quotient' });
	if (
		working.expression.node.type === 'quotient' ||
		(working.expression.is.negativeUnit() &&
			working.expression._getProductTerm().node.type === 'quotient')
	) {
		working.combineFraction();
	}
	working.simplify();
	working.expand({ onlyLinear: true });
	const fgExp = working.expression;
	const QEDSymbol = definition ? '' : QED;
	const domainInequality = generateInequality(gDomain);
	const soln2 = definition
		? mathlify`
$${{}} ${fg}: x \\mapsto ${fgExp}, \\quad ${domainInequality} ${QED}`
		: mathlify`
$${'align*'} D_{${fg}} &= D_${g} \\\\ &= ${gDomain.join(` \\cup `)} ${QED}`;
	const soln =
		mathlify`$${'align*'}
${fg}(x) &= ${f} \\left( ${gExp} \\right)
\\\\ ${working} ${QEDSymbol}
` + soln2;
	console.log(`D_{${fg}} = ${gDomain.join(` \\cup `)}`);
	const ans = definition
		? mathlify`
$${fg}:x\\mapsto ${fgExp}, \\quad ${domainInequality}.`
		: mathlify`${fg}(x) = ${fgExp}
\\
${{}}D_{${fg}} = ${gDomain.join(` \\cup `)}.`;
	return { ans, soln, exp: fgExp };
}

function generateInequality(domain: Interval[]): string {
	if (domain.length === 1) {
		let d = domain[0].toInequality();
		if (d !== `x \\in \\mathbb{R}`) {
			d = `x \\in \\mathbb{R}, ${d}`;
		}
		return d;
	} else if (domain.length === 2) {
		const [d1, d2] = domain;
		if (
			d1.left === Number.NEGATIVE_INFINITY &&
			!d1.rightInclusive &&
			d1.right.toString() === d2.left.toString() &&
			!d2.leftInclusive &&
			d2.right === Number.POSITIVE_INFINITY
		) {
			return `x \\in \\mathbb{R}, x \\neq ${d1.right}`;
		}
	}
	throw new Error('Unexpected intervals received');
}

export const practice: Practice = {
	generateState,
	generateQn,
};
