import { chooseRandom, coinFlip } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants
// D: definition vs f^{-1}(x)

// we will omit the 'abs' case here, and apply it under 04/03
import type { PracticeQuestion } from '$content/_types';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, sum, e, Polynomial } from 'mathlify';
import { EquationWorking } from 'mathlify/working';
import { logTerm, simplifySurd, sqrtTerm } from 'mathlify/fns';

// ax+b (2013)
// (x+a)^2 + b, (2007,2008)
// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019)
// sqrt(x+a) + b (2016). No unknown constants if restricted
// frac: c/(x+a) + b (2007,2009). No unknown constants if restricted
// improper: (bx+c) / (x+a) (2009). No unknown constants if restricted
// abs: | improper | (2023). No unknown constants if restricted
// special: ba^2 / (x^2 - a^2). (2010,2015) No unknown constants.

import {
	generateFn,
	generateRange,
	generateInequality as generateDomain,
	type Type,
	types
} from '../../01_concepts/02_domain-and-range/02_practice';
import { generateState as generateState1 } from '../02_domain/02_practice';

const QED = '\\; \\blacksquare ';

export interface State {
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
	definition: boolean;
}

export function generateState(options?: { type?: Type }): State {
	// we will omit the 'abs' case here, and apply it under 04/03
	const type = options?.type ?? chooseRandom(types.filter((x) => x !== 'abs'));
	return { ...generateState1({ type }), definition: coinFlip() };
}

export function generateQn(state: State): PracticeQuestion {
	const state1 = state;
	const [fnString, exp] = generateFn(state1);
	let qn: string;
	if (state.unknownConstants) {
		if (state1.fnType === 'frac') {
			qn = state.definition
				? mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.

Define ${'f^{-1}'}
in similar form.`
				: mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.

Find ${'f^{-1}(x)'}
and state its domain.`;
		} else if (state1.fnType === 'abs' || state1.fnType === 'improper') {
			qn = state.definition
				? mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Define ${'f^{-1}'}
in similar form.`
				: mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Find ${'f^{-1}(x)'}
and state its domain.`;
		} else {
			qn = state.definition
				? mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.

Define ${'f^{-1}'}
in similar form.`
				: mathlifier`The function ${'f'}
is defined by

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.

Find ${'f^{-1}(x)'}
and state its domain.`;
		}
	} else {
		qn = state.definition
			? mathlifier`The function ${'f'}
is defined by

$${fnString}.

Define ${'f^{-1}'}
in similar form.`
			: mathlifier`The function ${'f'}
is defined by

$${fnString}.

Find ${'f^{-1}(x)'}
and state its domain.`;
	}
	return { qn, ...generateAns(state1, exp) };
}

function generateAns(state: State, rhs: Expression): { ans: string; soln: string } {
	const { restriction, fnType, a, b, c, definition, unknownConstants } = state;
	const QED = '\\; \\blacksquare ';
	const yMinusB = sum('y', [-1, unknownConstants ? 'b' : b]).simplify();
	const xPlusA = sum('x', unknownConstants ? 'a' : a).simplify();
	if (fnType === 'linear') {
		const { working, exp: fInv } = linearInverseWorking(rhs, { swap: unknownConstants || a > 0 });
		const soln2 = definition
			? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
			: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
		const ans = definition
			? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
		return { ans, soln: working + soln2 };
	} else if (fnType === 'quadratic') {
		return quadraticInverse(state, rhs);
	} else if (fnType === 'log') {
		return logInverse(rhs, xPlusA, yMinusB, { definition, state });
	} else if (fnType === 'exp') {
		const ax = new Expression([unknownConstants ? 'a' : a, 'x']).simplify();
		return expInverse(rhs, ax, yMinusB, { definition, state });
	} else if (fnType === 'sqrt') {
		const working1 = new EquationWorking('y', rhs);
		const working2 = new EquationWorking(sqrtTerm(xPlusA), yMinusB);
		const working3 = new EquationWorking(xPlusA, [yMinusB, '^', 2]);
		working3.isolate('x');
		const fInv = working3.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
		const soln2 = definition
			? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
			: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
		const ans = definition
			? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'frac') {
		const working = new EquationWorking('y', rhs);
		const bExp = unknownConstants ? 'b' : b;
		working.minus(bExp);
		working.crossMultiply();
		working.expand();
		working.isolate('x');
		working.factorize.commonFactor();
		working._makeSubjectFromProduct('x');
		const fInv = working.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working}`;
		const soln2 = definition
			? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
			: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
		const ans = definition
			? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'improper') {
		return improperInverse(state, { definition, rhs, QED });
	} else if (fnType === 'abs') {
		// TODO: no unknown constants case here?
		const bxPlusC = unknownConstants ? new Polynomial(['b', 'c']) : new Polynomial([b, c]);
		return absoluteRationalInverse(state, [bxPlusC, xPlusA]);
	} else {
		// special case
		const working = new EquationWorking('y', rhs);
		working.crossMultiply();
		working.expand();
		if (b < 0) working.swapSides({ hide: true });
		working.isolate('x');
		working.factorize.commonFactor();
		working._makeSubjectFromProduct('x');
		if (restriction === false) throw new Error('Expected restriction for special case');
		const { type, x } = restriction;
		const testPoint = type === 'left' ? x - 1 : x + 1;
		const negative = testPoint < 0;
		const surdTerm = sqrtTerm(working.eqn.rhs);
		const newRHS = negative ? surdTerm.negative() : surdTerm;
		const fInv = newRHS.subIn({ y: 'x' });
		const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working}
			
Since ${{}} {${generateDomain(restriction)},}
$${'x'} = ${newRHS}`;
		const soln2 = definition
			? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
			: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
		const ans = definition
			? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
		return { ans, soln: soln1 + soln2 };
	}
}

export function improperInverse(
	state: State,
	options: {
		abs?: true;
		definition: boolean;
		rhs: Expression;
		QED: string;
		swap?: boolean;
		noDomain?: true;
		omitReasoningInAns?: true;
	}
): { ans: string; soln: string; exp: Expression } {
	const { definition, rhs, QED, swap, noDomain } = options;
	const { working, exp: fInv } = fractionalInverseWorking(rhs, swap, options);
	const domain = noDomain
		? ''
		: definition
			? generateInequality(state, rhs, { noFullStop: true })
			: mathlifier`$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
	const Rf = options?.omitReasoningInAns ? '' : '= R_f';
	const soln2 = definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${domain} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}\n\n` + domain;
	const ans = definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} ${Rf} = ${generateRange(state, rhs).join(' \\cup ')}.`;
	return { ans, soln: working + '\n\n' + soln2, exp: fInv };
}

export function fractionalInverseWorking(
	rhs: Expression,
	swap?: boolean,
	options?: {
		abs?: boolean;
		reportInverse?: boolean;
		f?: string;
		qed?: boolean;
		swapNum?: boolean;
	}
): { working: string; exp: Expression } {
	const letText = options?.abs ? '' : '\\text{Let } ';
	const f = options?.f ?? 'f';
	const working = new EquationWorking('y', rhs);
	working.crossMultiply();
	working.expand();
	if (swap) working.swapSides({ hide: true });
	if (options?.swapNum) {
		working.isolate('x', { hide: true }).rearrange([1, 0], { targetRight: true });
	} else {
		working.isolate('x');
	}
	working.factorize.commonFactor();
	working._makeSubjectFromProduct('x');
	const fInv = working.eqn.rhs.subIn({ y: 'x' });
	const QEDString = options?.qed ? QED : '';
	const soln1 = options?.reportInverse
		? mathlifier`$${'gather*'} ${letText} ${working} \\\\ ${f}^{-1}(x) = ${fInv} ${QEDString}`
		: mathlifier`$${'gather*'} ${letText} ${working}`;
	return { working: soln1, exp: fInv };
}

export function linearInverseWorking(
	rhs: Expression,
	options?: {
		swap?: boolean;
		f?: string;
		qed?: boolean;
	}
): { working: string; exp: Expression } {
	const working = new EquationWorking('y', rhs);
	const f = options?.f ?? 'f';
	if (options?.swap) working.swapSides({ hide: true });
	working.isolate('x');
	working._makeSubjectFromProduct('x');
	const fInv = working.eqn.rhs.subIn({ y: 'x' });
	const QEDString = options?.qed ? QED : '';
	const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working} \\\\ ${f}^{-1}(x) = ${fInv} ${QEDString}`;
	return { working: soln1, exp: fInv };
}

export function quadraticInverse(state: State, rhs: Expression): { ans: string; soln: string } {
	const { restriction, a, b, definition, unknownConstants } = state;
	const yMinusB = sum('y', [-1, unknownConstants ? 'b' : b]).simplify();
	const xPlusA = sum('x', unknownConstants ? 'a' : a).simplify();
	const line1 = new EquationWorking([xPlusA, '^', 2], yMinusB);
	if (restriction === false) throw new Error('restriction should not be false for quadratic case.');
	const positive = restriction.type === 'right' ? 1 : -1;
	const working = new EquationWorking(xPlusA, [positive, sqrtTerm(yMinusB)]);
	working.isolate('x');
	const fInv = working.eqn.rhs.subIn({ y: 'x' });
	const domain = unknownConstants
		? restriction.type === 'left'
			? 'x \\leq -a'
			: 'x \\geq -a'
		: generateDomain(restriction);
	const soln1 = mathlifier`$${'gather*'} \\text{Let } y = ${rhs} \\\\ ${line1}
\\\\ \\text{Since } ${domain},
\\\\ ${working}`;
	const soln2 = definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
	const ans = definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
	return { ans, soln: soln1 + soln2 };
}

export function logInverse(
	rhs: Expression,
	argument: Expression,
	yMinusB: Expression,
	options?: { definition?: boolean; state?: State }
): { ans: string; soln: string; exp: Expression } {
	const working1 = new EquationWorking('y', rhs);
	const working2 = new EquationWorking(logTerm(argument), yMinusB);
	const working3 = new EquationWorking(argument, [e, '^', yMinusB]);
	working3.isolate('x');
	working3._makeSubjectFromProduct('x');
	const fInv = working3.eqn.rhs.subIn({ y: 'x' });
	const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
	if (options?.definition && options?.state === undefined)
		throw new Error('state must be provided if definition is true');
	if (options?.definition && options?.state === undefined)
		throw new Error('state must be provided if definition is true');
	const state = options?.state as State;
	const Rf =
		options?.state === undefined
			? `\\left( -\\infty, \\infty \\right)`
			: generateRange(state, rhs).join(' \\cup ');
	const soln2 = options?.definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${Rf} ${QED}`;

	const ans = options?.definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${Rf}.`;
	return { ans, soln: soln1 + soln2, exp: fInv };
}

export function expInverse(
	rhs: Expression,
	argument: Expression,
	yMinusB: Expression,
	options?: { definition?: boolean; state?: State; b?: number }
): { ans: string; soln: string; exp: Expression } {
	const working1 = new EquationWorking('y', rhs);
	const working2 = new EquationWorking([e, '^', argument], yMinusB);
	const working3 = new EquationWorking(argument, logTerm(yMinusB));
	working3._makeSubjectFromProduct('x');
	const fInv = working3.eqn.rhs.subIn({ y: 'x' });
	const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
	if (options?.state === undefined && options?.b === undefined) {
		console.warn('b must be provided if state is undefined');
		throw new Error('b must be provided if state is undefined');
	}
	if (options?.definition && options?.state === undefined)
		throw new Error('state must be provided if definition is true');
	const state = options?.state as State;
	const Rf =
		options?.state === undefined
			? `\\left( ${options?.b}, \\infty \\right)`
			: generateRange(options?.state, rhs).join(' \\cup ');
	const soln2 = options?.definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${Rf} ${QED}`;
	const ans = options?.definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${Rf}.`;
	return { ans, soln: soln1 + soln2, exp: fInv };
}

export function sqrtInverse(
	state: State,
	rhs: Expression,
	options?: { definition?: boolean }
): { ans: string; soln: string; exp: Expression } {
	const hide = true;
	const working = new EquationWorking('y', rhs);
	working.swapSides({ hide }).isolate('x');
	EquationWorking.RegisterCustomSimplifier(simplifySurd);
	working.square();
	working.solve.linear('x');
	EquationWorking.DeregisterCustomSimplifier();
	const fInv = working.eqn.rhs.subIn({ y: 'x' });
	const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working}`;
	const soln2 = options?.definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs, { noFullStop: true })} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs).join(' \\cup ')} ${QED}`;
	const ans = options?.definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs).join(' \\cup ')}.`;
	return { ans, soln: soln1 + soln2, exp: fInv };
}

/**
 * Finds inverse of y = | num / den |
 * @param fraction [num, den] as Expressions
 * @param restriction {type: 'left'|'right', x: number, inclusive: boolean}
 * @param options {swap: boolean}
 * @returns `{ans: string, soln: string}`
 */
export function absoluteRationalInverse(
	state: State,
	fraction: [Expression, Expression],
	options?: { swap?: boolean }
): { ans: string; soln: string } {
	const { restriction, definition } = state;
	const swap = options?.swap ?? false;
	if (restriction === false)
		throw new Error('expected restriction when finding inverse of an absolute rational function');
	const [num, den] = fraction;
	const inner = new Expression([num, '/', den]);
	const { type, x } = restriction;
	const testPoint = type === 'left' ? x - 1 : x + 1;
	const negative = inner.subIn({ x: testPoint }).is.negative();
	const sign = negative ? '<' : '>';
	const newRHS = negative ? inner.negative() : inner;
	const working1 = mathlifier`$${{}} \\text{Let } y = \\left| ${inner} \\right|

Since ${{}} {${inner} ${sign} 0}
for
${{}}{${generateDomain(restriction)},}

`;
	const { ans, soln } = improperInverse(state, {
		abs: true,
		definition,
		rhs: newRHS,
		QED,
		swap
	});
	return { ans, soln: working1 + soln };
}

/**
 * Finds inverse of y = ba^2 / (x^2 - a^2) or y = |b|a^2 / (a^2 - x^2)
 * @param fraction [num, den] as Expressions
 * @param restriction {type: 'left'|'right', x: number, inclusive: boolean}
 * @param options {swap: boolean}
 * @returns `{ans: string, soln: string}`
 */
export function specialInverse(
	state: State,
	exp: Expression
	//options?: { swap?: boolean },
): { ans: string; soln: string } {
	const { restriction, definition, b } = state;
	//const swap = options?.swap ?? false;
	if (restriction === false)
		throw new Error('expected restriction when finding inverse of an absolute rational function');
	const working = new EquationWorking('y', exp);
	working.crossMultiply();
	working.expand();
	if (b < 0) working.swapSides({ hide: true });
	working.isolate('x');
	working.factorize.commonFactor();
	working._makeSubjectFromProduct('x');
	const { type, x } = restriction;
	const testPoint = type === 'left' ? x - 1 : x + 1;
	const negative = testPoint < 0;
	const surdTerm = sqrtTerm(working.eqn.rhs);
	const newRHS = negative ? surdTerm.negative() : surdTerm;
	const fInv = newRHS.subIn({ y: 'x' });
	const soln1 = mathlifier`$${'gather*'} \\text{Let } ${working}
			
Since ${generateDomain(restriction)},
$${'x'} = ${newRHS}`;
	const soln2 = definition
		? mathlifier`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, exp, { noFullStop: true })} ${QED}`
		: mathlifier`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, exp).join(' \\cup ')} ${QED}`;
	const ans = definition
		? mathlifier`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, exp)}`
		: mathlifier`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, exp).join(' \\cup ')}.`;
	return { ans, soln: soln1 + soln2 };
}

export function lessThan(inclusive: boolean): string {
	return inclusive ? `\\leq ` : '<';
}
export function greaterThan(inclusive: boolean): string {
	return inclusive ? `\\geq ` : '>';
}

function generateInequality(
	state: State,
	exp: Expression,
	options?: { noFullStop?: boolean }
): string {
	const fullStop = options?.noFullStop ? '' : '.';
	const { fnType, restriction, a, b, c, unknownConstants } = state;
	const ans = `x \\in \\mathbb{R}`;
	if (fnType === 'linear') {
		if (restriction) {
			const { type, x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if ((a > 0 && type === 'left') || (a < 0 && type === 'right')) {
				return ans + `, x ${lessThan(inclusive)} ${y}${fullStop}`;
			} else {
				return ans + `, x ${greaterThan(inclusive)} ${y}${fullStop}`;
			}
		}
		return ans + fullStop;
	} else if (fnType === 'quadratic') {
		// (x+a)^2 + b
		if (restriction) {
			const { type, x, inclusive } = restriction;
			if (unknownConstants) {
				return ans + `, x ${greaterThan(inclusive)} b${fullStop}`;
			}
			const y = exp.subIn({ x });
			if ((x < -a && type === 'left') || (x > -a && type === 'right') || (x === -a && !inclusive)) {
				return ans + `, x ${greaterThan(inclusive)} ${y}${fullStop}`;
			}
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\geq ${bString}${fullStop}`;
	} else if (fnType === 'log') {
		if (restriction) {
			// chosen to be ln 1 and on the right
			return ans + `, x ${greaterThan(restriction.inclusive)} ${b}${fullStop}`;
		}
		return ans + fullStop;
	} else if (fnType === 'exp') {
		const bString = unknownConstants ? 'b' : b;
		const bPlus1 = unknownConstants ? 'b+1' : b + 1;
		if (restriction) {
			// chosen to be e^0 + b
			const { inclusive, type } = restriction;
			if ((type === 'left' && a > 0) || (type === 'right' && a < 0)) {
				return ans + `, ${bString} < x ${lessThan(inclusive)} ${bPlus1}${fullStop}`;
			} else {
				return ans + `, x ${greaterThan(inclusive)} ${bPlus1}${fullStop}`;
			}
		}
		return ans + `, x > ${bString}${fullStop}`;
	} else if (fnType === 'sqrt') {
		if (restriction) {
			// chosen to be right
			const { inclusive, x } = restriction;
			const y = Math.sqrt(x + a) + b;
			return ans + `, x ${greaterThan(inclusive)} ${y}${fullStop}`;
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\geq ${bString}${fullStop}`;
	} else if (fnType === 'frac' || fnType == 'improper') {
		if (restriction) {
			// chosen to be a single interval
			const { x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if (y.valueOf() < b) {
				return ans + `${y} ${lessThan(inclusive)} x < ${b}${fullStop}`;
			} else {
				return ans + `${b} < x ${lessThan(inclusive)} ${y}${fullStop}`;
			}
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\neq ${bString}${fullStop}`;
	} else if (fnType === 'abs') {
		if (restriction) {
			const { x, inclusive, type } = restriction;
			const y = exp.subIn({ x });
			// https://www.desmos.com/calculator/yb2bwgxywr
			if (-c / b < -a) {
				if (type === 'left') {
					if (x < -c / b) {
						return ans + `, ${y} ${lessThan(inclusive)} x < ${Math.abs(b)}${fullStop}`;
					} else {
						return y.valueOf() < Math.abs(b)
							? ans + `, 0 \\leq x < ${Math.abs(b)}${fullStop}`
							: ans + `, 0 \\leq x ${lessThan(inclusive)} ${y}${fullStop}`;
					}
				} else {
					return ans + `, ${Math.abs(b)} < x ${lessThan(inclusive)} ${y}${fullStop}`;
				}
			} else {
				if (type === 'left') {
					return ans + `, ${Math.abs(b)} < x ${lessThan(inclusive)} ${y}${fullStop}`;
				} else {
					if (x > -c / b) {
						return ans + `, ${y} ${lessThan(inclusive)} x < ${Math.abs(b)}${fullStop}`;
					} else {
						return y.valueOf() < Math.abs(b)
							? ans + `, 0 \\leq x < ${Math.abs(b)}${fullStop}`
							: ans + `, 0 \\leq x ${lessThan(inclusive)} ${y}${fullStop}`;
					}
				}
			}
		}
		return ans + `, x \\geq 0${fullStop}`;
	} else {
		// special
		const y = exp.subIn({ x: 0 });
		if (restriction) {
			return y.valueOf() < 0 ? ans + `, x > 0.` : `, x < 0${fullStop}`;
		}
		return b < 0
			? ans + `, x \\leq 0 \\text{ or } x \\geq ${y}${fullStop}`
			: ans + `, x \\leq ${y} \\text{ or } x \\geq 0${fullStop}`;
	}
}
