import { coinFlip, chooseRandom } from '$lib/utils/random';

// objectives
// A: fnType

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import {
	types,
	generateFn,
	generateState as generateState1,
	type Type,
	type IntervalOneSided,
} from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { compositeExists } from './01-existence.practice';
import { compositeFormula } from './02-formula.practice';

// ax+b (2013). unknown constants + restriction: x=0
// (x+a)^2 + b, (2007,2008). unknown constants + restriction: x=-a
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

interface State extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
	restriction: IntervalOneSided | false;
	qnType: 'exist' | 'formula';
}

export function generateState(): State {
	const formulaTypes = ['linear', 'sqrt', 'frac', 'improper'] as const;
	const qnType = coinFlip() ? 'exist' : 'formula';
	const fnType = qnType === 'exist' ? chooseRandom(types) : chooseRandom(formulaTypes);
	const state = generateState1({ type: fnType, unknownConstants: false });
	const { a, c } = state;
	let { b, restriction } = state;
	if (qnType === 'formula') {
		restriction = false;
		if ((fnType === 'sqrt' && b < -a) || fnType === 'frac' || fnType === 'improper') {
			b = -a;
		}
	}
	return {
		fnType,
		a,
		b,
		c,
		restriction,
		qnType,
	};
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { qnType } = state1;
	const [fString, f, fDomain] = generateFn({ ...state1, unknownConstants: false });
	const qn2 =
		qnType === 'exist'
			? mathlify`Does the composite function ${'f^2'}
exist?`
			: mathlify`Find ${'f^2(x)'},
stating its domain.`;
	const qn =
		mathlify`The function ${'f'}
is defined by

$${{}} ${fString}.` + qn2;
	const ansObject =
		qnType === 'exist'
			? compositeExists({ f: state1, g: state1, fg: true }, [f, f], { gName: 'f' })
			: compositeFormula([f, fDomain, f, fDomain], true, false, { ansInline: true, gName: 'f' });
	return { qn, ...ansObject };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
