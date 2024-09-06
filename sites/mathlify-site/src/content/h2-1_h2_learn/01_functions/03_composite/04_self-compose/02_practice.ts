import { coinFlip, chooseRandom } from '$lib/utils/random';

// objectives
// A: fnType

import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import {
	types,
	generateFn,
	generateState as generateState1,
	type Type,
	type IntervalOneSided
} from '../../01_concepts/02_domain-and-range/02_practice';
import { compositeExists } from '../01_existence/02_practice';
import { compositeFormula } from '../02_formula/02_practice';

// ax+b (2013). unknown constants + restriction: x=0
// (x+a)^2 + b, (2007,2008). unknown constants + restriction: x=-a
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

interface State {
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
		qnType
	};
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const { qnType } = state1;
	const [fString, f, fDomain] = generateFn({ ...state1, unknownConstants: false });
	const qn2 =
		qnType === 'exist'
			? mathlifier`Does the composite function ${'f^2'}
exist?`
			: mathlifier`Find ${'f^2(x)'},
stating its domain.`;
	const qn =
		mathlifier`The function ${'f'}
is defined by

$${{}} ${fString}.` + qn2;
	const ansObject =
		qnType === 'exist'
			? compositeExists({ f: state1, g: state1, fg: true }, [f, f], { gName: 'f' })
			: compositeFormula([f, fDomain, f, fDomain], true, false, { ansInline: true, gName: 'f' });
	return { qn, ...ansObject };
}
