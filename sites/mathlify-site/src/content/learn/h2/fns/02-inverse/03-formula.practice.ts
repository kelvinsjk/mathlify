import { coinFlip } from '$lib/utils/random';

// objectives
// A: fnType
// B: restricted domain
// C: unknown constants
// D: definition vs f^{-1}(x)

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import { Expression, sum, e, Polynomial } from 'mathlify';
import { EquationWorking } from 'mathlify/working';
import { logTerm, sqrtTerm } from 'mathlify/fns';

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
	generateAns as generateRange,
	generateInequality as generateDomain,
	type Type,
} from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { generateState as generateState1 } from './02-domain.practice';

const QED = '\\; \\blacksquare ';

export interface State extends PracticeState {
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
	return { ...generateState1(options), definition: coinFlip() };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const [fnString, exp] = generateFn(state1);
	let qn: string;
	if (state.unknownConstants) {
		if (state1.fnType === 'frac') {
			qn = state.definition
				? mathlify`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants.

Define ${'f^{-1}'}
in similar form.`
				: mathlify`The function ${'f'}
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
				? mathlify`The function ${'f'}
is defined by

$${fnString}

where ${'a'},
${'b'}
and ${'c'}
are positive constants and ${'\\frac{c}{b} \\neq a'}.

Define ${'f^{-1}'}
in similar form.`
				: mathlify`The function ${'f'}
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
				? mathlify`The function ${'f'}
is defined by

$${fnString}

where ${'a'}
and ${'b'}
are positive constants.

Define ${'f^{-1}'}
in similar form.`
				: mathlify`The function ${'f'}
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
			? mathlify`The function ${'f'}
is defined by

$${fnString}.

Define ${'f^{-1}'}
in similar form.`
			: mathlify`The function ${'f'}
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
		const working = new EquationWorking('y', rhs);
		if (unknownConstants || a > 0) working.swapSides({ hide: true });
		working.isolate('x');
		working._makeSubjectFromProduct('x');
		const fInv = working.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'quadratic') {
		const line1 = new EquationWorking([xPlusA, '^', 2], yMinusB);
		if (restriction === false)
			throw new Error('restriction should not be false for quadratic case.');
		const positive = restriction.type === 'right' ? 1 : -1;
		const working = new EquationWorking(xPlusA, [positive, sqrtTerm(yMinusB)]);
		working.isolate('x');
		const fInv = working.eqn.rhs.subIn({ y: 'x' });
		const domain = unknownConstants
			? restriction.type === 'left'
				? 'x \\leq -a'
				: 'x \\geq -a'
			: generateDomain(restriction);
		const soln1 = mathlify`$${'gather*'} \\text{Let } y = ${rhs} \\\\ ${line1}
\\\\ \\text{Since } ${domain},
\\\\ ${working}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'log') {
		const working1 = new EquationWorking('y', rhs);
		const working2 = new EquationWorking(logTerm(xPlusA), yMinusB);
		const working3 = new EquationWorking(xPlusA, [e, '^', yMinusB]);
		working3.isolate('x');
		const fInv = working3.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'exp') {
		const working1 = new EquationWorking('y', rhs);
		const ax = (
			unknownConstants ? new Expression(['a', 'x']) : new Expression([a, 'x'])
		).simplify();
		const working2 = new EquationWorking([e, '^', ax], yMinusB);
		const working3 = new EquationWorking(ax, logTerm(yMinusB));
		working3._makeSubjectFromProduct('x');
		const fInv = working3.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'sqrt') {
		const working1 = new EquationWorking('y', rhs);
		const working2 = new EquationWorking(sqrtTerm(xPlusA), yMinusB);
		const working3 = new EquationWorking(xPlusA, [yMinusB, '^', 2]);
		working3.isolate('x');
		const fInv = working3.eqn.rhs.subIn({ y: 'x' });
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working1} \\\\ ${working2} \\\\ ${working3}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
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
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	} else if (fnType === 'improper') {
		return generateImproperAns(state, { definition, rhs, QED });
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
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}
			
Since ${generateDomain(restriction)},
$${'x'} = ${newRHS}`;
		const soln2 = definition
			? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
			: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
		const ans = definition
			? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
			: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
		return { ans, soln: soln1 + soln2 };
	}
}

function generateImproperAns(
	state: State,
	options: { abs?: true; definition: boolean; rhs: Expression; QED: string; swap?: boolean },
): { ans: string; soln: string } {
	const { definition, rhs, QED, swap } = options;
	const letText = options?.abs ? '' : '\\text{Let } ';
	const working = new EquationWorking('y', rhs);
	working.crossMultiply();
	working.expand();
	if (swap) working.swapSides({ hide: true });
	working.isolate('x');
	working.factorize.commonFactor();
	working._makeSubjectFromProduct('x');
	const fInv = working.eqn.rhs.subIn({ y: 'x' });
	const soln1 = mathlify`$${'gather*'} ${letText} ${working}`;
	const soln2 = definition
		? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)} ${QED}`
		: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, rhs)} ${QED}`;
	const ans = definition
		? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, rhs)}`
		: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, rhs)}.`;
	return { ans, soln: soln1 + soln2 };
}

export function lessThan(inclusive: boolean): string {
	return inclusive ? `\\leq ` : '<';
}
export function greaterThan(inclusive: boolean): string {
	return inclusive ? `\\geq ` : '>';
}

function generateInequality(state: State, exp: Expression): string {
	const { fnType, restriction, a, b, c, unknownConstants } = state;
	const ans = `x \\in \\mathbb{R}`;
	if (fnType === 'linear') {
		if (restriction) {
			const { type, x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if ((a > 0 && type === 'left') || (a < 0 && type === 'right')) {
				return ans + `, x ${lessThan(inclusive)} ${y}.`;
			} else {
				return ans + `, x ${greaterThan(inclusive)} ${y}.`;
			}
		}
		return ans + '.';
	} else if (fnType === 'quadratic') {
		// (x+a)^2 + b
		if (restriction) {
			const { type, x, inclusive } = restriction;
			if (unknownConstants) {
				return ans + `, x ${greaterThan(inclusive)} b.`;
			}
			const y = exp.subIn({ x });
			if ((x < -a && type === 'left') || (x > -a && type === 'right') || !inclusive) {
				return ans + `, x ${greaterThan(inclusive)} ${y}.`;
			}
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\geq ${bString}.`;
	} else if (fnType === 'log') {
		if (restriction) {
			// chosen to be ln 1 and on the right
			return ans + `, x ${greaterThan(restriction.inclusive)} ${b}.`;
		}
		return ans + '.';
	} else if (fnType === 'exp') {
		const bString = unknownConstants ? 'b' : b;
		const bPlus1 = unknownConstants ? 'b+1' : b + 1;
		if (restriction) {
			// chosen to be e^0 + b
			const { inclusive, type } = restriction;
			if ((type === 'left' && a > 0) || (type === 'right' && a < 0)) {
				return ans + `, ${bString} < x ${lessThan(inclusive)} ${bPlus1}.`;
			} else {
				return ans + `, x ${greaterThan(inclusive)} ${bPlus1}.`;
			}
		}
		return ans + `, x > ${bString}.`;
	} else if (fnType === 'sqrt') {
		if (restriction) {
			// chosen to be right
			const { inclusive, x } = restriction;
			const y = Math.sqrt(x + a) + b;
			return ans + `, x ${greaterThan(inclusive)} ${y}.`;
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\geq ${bString}.`;
	} else if (fnType === 'frac' || fnType == 'improper') {
		if (restriction) {
			// chosen to be a single interval
			const { x, inclusive } = restriction;
			const y = exp.subIn({ x });
			if (y.valueOf() < b) {
				return ans + `${y} ${lessThan(inclusive)} x < ${b}.`;
			} else {
				return ans + `${b} < x ${lessThan(inclusive)} ${y}.`;
			}
		}
		const bString = unknownConstants ? 'b' : b;
		return ans + `, x \\neq ${bString}.`;
	} else if (fnType === 'abs') {
		if (restriction) {
			const { x, inclusive, type } = restriction;
			const y = exp.subIn({ x });
			// https://www.desmos.com/calculator/yb2bwgxywr
			if (-c / b < -a) {
				if (type === 'left') {
					if (x < -c / b) {
						return ans + `, ${y} ${lessThan(inclusive)} x < ${Math.abs(b)}.`;
					} else {
						return y.valueOf() < Math.abs(b)
							? ans + `, 0 \\leq x < ${Math.abs(b)}.`
							: ans + `, 0 \\leq x ${lessThan(inclusive)} ${y}.`;
					}
				} else {
					return ans + `, ${Math.abs(b)} < x ${lessThan(inclusive)} ${y}.`;
				}
			} else {
				if (type === 'left') {
					return ans + `, ${Math.abs(b)} < x ${lessThan(inclusive)} ${y}.`;
				} else {
					if (x > -c / b) {
						return ans + `, ${y} ${lessThan(inclusive)} x < ${Math.abs(b)}.`;
					} else {
						return y.valueOf() < Math.abs(b)
							? ans + `, 0 \\leq x < ${Math.abs(b)}.`
							: ans + `, 0 \\leq x ${lessThan(inclusive)} ${y}.`;
					}
				}
			}
		}
		return ans + `, x \\geq 0.`;
	} else {
		// special
		const y = exp.subIn({ x: 0 });
		if (restriction) {
			return y.valueOf() < 0 ? ans + `, x > 0.` : `, x < 0.`;
		}
		return b < 0
			? ans + `, x \\leq 0 \\text{ or } x \\geq ${y}.`
			: ans + `, x \\leq ${y} \\text{ or } x \\geq 0.`;
	}
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
	options?: { swap?: boolean },
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
	const working1 = mathlify`$${{}} \\text{Let } y = \\left| ${inner} \\right|

Since ${inner} ${sign} 0
for
${generateDomain(restriction)},
`;
	const { ans, soln } = generateImproperAns(state, {
		abs: true,
		definition,
		rhs: newRHS,
		QED,
		swap,
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
	exp: Expression,
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
	const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}
			
Since ${generateDomain(restriction)},
$${'x'} = ${newRHS}`;
	const soln2 = definition
		? mathlify`$${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, exp)} ${QED}`
		: mathlify`$${{}} f^{-1}(x) = ${fInv} ${QED}

$${'align*'} D_{f^{-1}} &= R_{f} \\\\ &= ${generateRange(state, exp)} ${QED}`;
	const ans = definition
		? mathlify`${{}} f^{-1}: x \\mapsto ${fInv}, \\quad ${generateInequality(state, exp)}`
		: mathlify`${{}} f^{-1}(x) = ${fInv}.
\\
${{}} D_{f^{-1}} = R_{f} = ${generateRange(state, exp)}.`;
	return { ans, soln: soln1 + soln2 };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
