import { coinFlip, chooseRandomSubset } from '$lib/utils/random';

// objectives
// A: fnType

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import type { Expression } from 'mathlify';
import type { Interval } from '../../_intervals';
import {
	types,
	generateFn,
	generateRange,
	generateState as generateState1,
	type Type,
	type IntervalOneSided
} from '../../01_concepts/02_domain-and-range/02_practice';
import { generateDomain } from '../../02_inverse/02_domain/02_practice';
import { QED } from '$lib/typesetting/utils';

// ax+b (2013). unknown constants + restriction: x=0
// (x+a)^2 + b, (2007,2008). unknown constants + restriction: x=-a
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

interface fnState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction: IntervalOneSided | false;
}

interface State {
	f: fnState;
	g: fnState;
	fg: boolean;
}

export function generateState(): State {
	const [type1, type2] = chooseRandomSubset(types, 2);
	const f = generateState1({ type: type1, unknownConstants: false });
	const g = generateState1({ type: type2, unknownConstants: false });
	return {
		f,
		g,
		fg: coinFlip()
	};
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const [fString, f] = generateFn({ ...state1.f, unknownConstants: false }, { align: true });
	const [gString, g] = generateFn(
		{ ...state1.g, unknownConstants: false },
		{ fnName: 'g', align: true }
	);
	const fg = state1.fg ? 'fg' : 'gf';
	const qn = mathlifier`The functions ${'f'}
and ${'g'}
are defined by

$${'align*'} &${fString} \\text{ and} \\\\ &${gString}.

Does the composite function ${fg}
exist?
`;
	return { qn, ...compositeExists(state1, [f, g]) };
}

export function compositeExists(
	state: State,
	exps: [Expression, Expression],
	options?: { fName?: string; gName?: string }
): { ans: string; soln: string } {
	let f = options?.fName ?? 'f';
	let g = options?.gName ?? 'g';
	let [fExp, gExp] = exps;
	let { f: fState, g: gState } = state;
	if (!state.fg) {
		[f, g] = [g, f];
		[fExp, gExp] = [gExp, fExp];
		[fState, gState] = [gState, fState];
	}
	let fg = `${f}${g}`;
	if (f === g) fg = `${f}^2`;
	const Rg = generateRange({ ...gState, unknownConstants: false }, gExp);
	const Df = generateDomain({ ...fState, unknownConstants: false });
	const subset = checkSubset(Rg, Df);
	const not = subset ? '' : '\\not ';
	const doesNotExist = subset ? 'exists' : 'does not exist';
	const soln = mathlifier`$${'align*'}
R_{${g}} &= ${Rg.join(' \\cup ')} \\\\
D_{${f}} &= ${Df.join(' \\cup ')}

Since ${{}} R_{${g}} ${not} \\subseteq D_{${f}},
the composite function ${fg}
@${doesNotExist} ${QED}
`;
	const ans = mathlifier`${fg}
@${doesNotExist} as ${{}} {R_{${g}} ${not} \\subseteq D_{${f}}.}`;
	return { ans, soln };
}

function checkSubset(A: Interval[], B: Interval[]): boolean {
	for (const inner of A) {
		let subset = false;
		for (const outer of B) {
			if (inner.isSubsetOf(outer)) {
				subset = true;
				break;
			}
		}
		if (!subset) return false;
	}
	return true;
}
