import { chooseRandom, coinFlip, getRandomInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: existence vs non-existence

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { quotient, type Expression } from 'mathlify';
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
	type Type
} from '../../01_concepts/02_domain-and-range/02_practice-1';
import { QED } from '$lib/typesetting/utils';
import type { Interval } from '../../_intervals';

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
	definition: boolean;
	fg: boolean;
}

export const practiceTitle = 'formula of composite functions';

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
			isRestricted: false
		});
	} else if (type === 2) {
		// 2. inner: imp/frac, outer: linear or quad. 50% restriction: match domain with R_inner
		const types = ['improper', 'frac'] as const;
		//const isRestricted = coinFlip();
		const isRestricted = true;
		inner = generateFnState({ type: chooseRandom(types), unknownConstants: false, isRestricted });
		outer = generateFnState({
			type: coinFlip() ? 'linear' : 'quadratic',
			unknownConstants: false,
			isRestricted
		});
		if (isRestricted) {
			const ranges = generateRange(
				{ ...inner, unknownConstants: false },
				generateFn({ ...inner, unknownConstants: false })[1]
			);
			if (ranges.length !== 1) throw new Error('expected range to be made up of a single interval');
			const range = ranges[0];
			if (range.isOneSided()) {
				outer.restriction = range.toOneSidedInterval();
			} else {
				outer.restriction = false;
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
				generateFn({ ...inner, unknownConstants: false })[1]
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
			b: -a + getRandomInt(1, 4)
		});
	} else if (type === 5) {
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
	} else {
		// 6. inner: frac/imp, outer: frac/imp. let b = -a for inner to ensure existence
		outer = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: false
		});
		const a = outer.a;
		inner = generateFnState({
			type: coinFlip() ? 'frac' : 'improper',
			unknownConstants: false,
			isRestricted: coinFlip(),
			b: -a
		});
	}
	//delete outer.unknownConstants;
	//delete inner.unknownConstants;
	return { inner, outer, definition, fg };
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const { fg: isFg, inner, outer, definition } = state1;
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
	const qn2 = definition
		? mathlifier`Define the composite function ${fg},
including its domain, in similar form.`
		: mathlifier`Find ${fg}(x)
and state its domain.`;
	const qn =
		mathlifier`The functions ${'f'}
and ${'g'}
are defined by

$${'align*'} &${fString} \\text{ and} \\\\ &${gString}.
` + qn2;
	return {
		qn,
		...compositeFormula([fExp, fDomain, gExp, gDomain], isFg, definition)
	}; // { ans: compositeFormula([fState, fExp, gState, gExp], definition) }
}

/**
 *
 * @param states [fExp, fDomain, gExp, gDomain]
 * @param isFg
 * @param definition
 * @param options optional, {fName, gName, noDomain, ansInline}
 * @returns {ans: string, soln: string, exp: Expression}
 */
export function compositeFormula(
	states: [Expression, Interval[], Expression, Interval[]], // fExp, fDomain, gExp, gDomain
	isFg: boolean,
	definition: boolean,
	options?: {
		fName?: string;
		gName?: string;
		noDomain?: boolean;
		ansInline?: boolean;
		combineFraction?: boolean;
		QED?: boolean;
		factorizeDenominator?: boolean;
	}
): { ans: string; soln: string; exp: Expression } {
	let f = options?.fName ?? 'f';
	let g = options?.gName ?? 'g';
	let [fExp, fDomain, gExp, gDomain] = states;
	if (!isFg) {
		[f, g] = [g, f];
		[fExp, gExp] = [gExp, fExp];
		[fDomain, gDomain] = [gDomain, fDomain];
	}
	let fg = `${f}${g}`;
	if (f === g) fg = `${f}^2`;
	const working = new ExpressionWorking(fExp.subIn({ x: gExp }, { verbatim: true }), {
		leadingEqual: true
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
	if (options?.combineFraction) {
		working.combineFraction();
	}
	if (options?.factorizeDenominator) {
		working.factorize.denominator();
		// workaround
		const q = working.expression._getProductTerm()._getQuotientTerms();
		const denFactors = q[1]._getProductTerms()[1];
		const newQ = quotient(q[0], [
			denFactors[1].times(-1, { expand: true }).rearrange([1, 0]),
			denFactors[0]
		]);
		working.expression = newQ;
		working.expressions[working.expressions.length - 1] = newQ;
	}
	const fgExp = working.expression;
	const QEDSymbol = options?.noDomain
		? options?.QED
			? `\\; ${QED}`
			: ''
		: definition
			? ''
			: `\\; ${QED}`;
	const definitionQED = options?.QED ? `\\; ${QED}` : '';
	const domainInequality = options?.noDomain ? '' : generateInequality(gDomain);
	const soln2 = options?.noDomain
		? ''
		: definition
			? mathlifier`
$${{}} ${fg}: x \\mapsto ${fgExp}, \\quad ${domainInequality} ${definitionQED}`
			: mathlifier`
$${'align*'} D_{${fg}} &= D_${g} \\\\ &= ${gDomain.join(` \\cup `)} ${QEDSymbol}`;
	const soln =
		mathlifier`$${'align*'}
${fg}(x) &= ${f} \\left( ${gExp} \\right)
\\\\ ${working} ${QEDSymbol}
` + soln2;
	let ans: string;
	if (options?.ansInline) {
		ans = options?.noDomain
			? mathlifier`${fg}(x) = ${fgExp}.`
			: definition
				? mathlifier`${fg}:x\\mapsto ${fgExp}, \\quad \\allowbreak  {${domainInequality}}.`
				: mathlifier`${fg}(x) = ${fgExp}.
\\
${{}}D_{${fg}} = ${gDomain.join(` \\cup `)}.`;
	} else {
		ans = options?.noDomain
			? mathlifier`${fg}(x) = ${fgExp}.`
			: definition
				? mathlifier`$${fg}:x\\mapsto ${fgExp}, \\quad ${domainInequality}.`
				: mathlifier`${fg}(x) = ${fgExp}.
	\\
	${{}}D_{${fg}} = ${gDomain.join(` \\cup `)}.`;
	}
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
