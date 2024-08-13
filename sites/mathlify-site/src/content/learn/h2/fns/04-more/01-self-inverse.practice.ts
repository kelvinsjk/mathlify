import { coinFlip, chooseRandom, getRandomNonZeroInt, getRandomInt } from '$lib/utils/random';

// objectives
// A: show self inverse vs find f^{-1}(x)
// B: hence find f^n(x), where n = 2 to 4, year to year+3.
// C: fnType
// D: unknown constants (for rational)

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { fractionalInverseWorking, linearInverseWorking } from '../02-inverse/03-formula.practice';
import { e, Expression, expTerm, Polynomial, quotient, sum } from 'mathlify';
import { EquationWorking } from 'mathlify/working';
import { Brackets, logTerm, simplifySurd, sqrtTerm } from 'mathlify/fns';
import { QED } from '$lib/utils/typesetting';

// 2009, 2012: (bx+k)(cx+a). a=-b. k/b \neq a/c. possible unknown constants
// ax+b. a=-1, b=\pm 1 to 4
// ln ( (e^x + 1)/(e^x-1) ), x > 0
// x/sqrt(x^2 - 1), x > 1

interface StateFrac extends PracticeState {
	fnType: 'frac';
	b: number | string;
	c: number | string;
	k: number | string;
	show: boolean;
	n: number;
}
interface StateLinear extends PracticeState {
	fnType: 'linear';
	b: number;
	show: boolean;
	n: number;
}

interface StateOthers extends PracticeState {
	fnType: 'log' | 'sqrt';
	show: boolean;
	n: number;
}

type State = StateFrac | StateLinear | StateOthers;

export function generateState(): State {
	const show = coinFlip();
	const fnTypes = ['frac', 'linear', 'log', 'sqrt'] as const;
	const fnType = chooseRandom(fnTypes);
	const n = coinFlip() ? getRandomInt(2, 5) : getRandomInt(2024, 2027);
	if (fnType === 'frac') {
		const b = coinFlip(0.3) ? 'a' : getRandomNonZeroInt(1, 4); // 30% chance to match 2009
		const c = coinFlip(0.3) ? 'b' : getRandomNonZeroInt(1, 4); // 30% chance to match 2009
		const k = coinFlip(0.3) ? 'k' : getRandomInt(-2, 2); // 30% chance to match 2012
		if (
			typeof k === 'number' &&
			typeof b === 'number' &&
			typeof c === 'number' &&
			k * c === -b * b
		) {
			return generateState();
		}
		return { fnType, b, c, k, show, n };
	} else if (fnType === 'linear') {
		const b = getRandomNonZeroInt(1, 4);
		return { fnType, b, show, n };
	}
	return { fnType, show, n };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { show, n } = state1;

	const preamble = show
		? mathlify`A function ${'f'}
is said to be self-inverse if
${{}} {f(x)=f^{-1}(x)}
for all ${'x'}
in the domain of ${'f.'}`
		: '';
	const f = show ? 'g' : 'f';
	const [fnDefinition, fExp] = generateFnDefinition(state1, f);
	const qn1 = show
		? mathlify`Show that ${f}
is self-inverse.`
		: mathlify`Find ${f}^{-1}(x).`;
	const qn2 = mathlify`Hence or otherwise find ${f}^{${n}}(x).`;
	const qn = preamble + fnDefinition + qn1 + qn2;
	return { qn, ...generateAns(state1, fExp, f) };
}

function generateFnDefinition(state: State, f: string): [string, Expression] {
	if (state.fnType === 'frac') {
		return generateFracFnDefinition(state, { f });
	} else {
		return generateOtherFnDefinition(state, f);
	}
}

function generateOtherFnDefinition(
	state: StateLinear | StateOthers,
	f: string,
): [string, Expression] {
	if (state.fnType === 'linear') {
		const { b } = state;
		const fExp = b > 0 ? new Polynomial([b, -1], { ascending: true }) : new Polynomial([-1, b]);
		return [
			mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad \\text{for } x \\in \\mathbb{R}.`,
			fExp,
		];
	} else {
		const fExp =
			state.fnType === 'log'
				? logTerm(new Brackets(quotient(sum(expTerm('x'), 1), sum(expTerm('x'), -1))), {
						verbatim: true,
					})
				: quotient('x', sqrtTerm(new Polynomial([1, 0, -1])));
		const x = state.fnType === 'log' ? 0 : 1;
		return [
			mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad \\text{for } x \\in \\mathbb{R}, x > ${x}.`,
			fExp,
		];
	}
}

export function generateFracFnDefinition(
	state: StateFrac,
	options?: { f?: string; for?: boolean },
): [string, Expression] {
	// (bx+k)/(cx+a)
	const { b, c, k } = state;
	const aExp = new Expression(b).negative();
	const fExp = quotient(new Polynomial([b, k]), new Polynomial([c, aExp]));
	const x = aExp.divide(c).negative();
	return [fnDefinitionWithPotentialUnknowns(state, aExp, fExp, x, options), fExp];
}

function fnDefinitionWithPotentialUnknowns(
	state: StateFrac,
	aExp: Expression,
	fExp: Expression,
	x: Expression,
	options?: { f?: string; for?: boolean },
): string {
	const { a, b, c, k } = state;
	const f = options?.f ?? 'f';
	const forString = options?.for ? '\\text{for }' : '';
	const nonZeros: string[] = [];
	// (bx+k)/(cx+a)
	if (typeof b === 'string') nonZeros.push(b);
	if (typeof c === 'string') nonZeros.push(c);
	let avoid: undefined | [string, Expression] = undefined;
	if (typeof k === 'string') {
		// k/b \neq a/c
		const kAvoid = aExp.divide(c).times(b);
		avoid = [k, kAvoid];
	} else if (typeof c === 'string') {
		// c \neq ab/k
		const cAvoid = aExp.times(b).divide(k);
		avoid = [c, cAvoid];
	} else if (typeof a === 'string') {
		// at this moment, we have a = '-a' and b = 'a'. so we have a^2 \neq -kc
		if (!(typeof k === 'number' && typeof c === 'number' && k * c > 0)) {
			const a2Avoid = new Expression([-1, k, c]);
			const aAvoid = sqrtTerm(a2Avoid);
			avoid = [a, aAvoid];
		}
	}
	const are = nonZeros.length > 1 ? 'are' : 'is a';
	const constants = nonZeros.length === 1 ? 'constant' : 'constants';
	if (nonZeros.length === 0) {
		return avoid === undefined
			? mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad ${forString} x \\in \\mathbb{R}, x \\neq ${x}.`
			: mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad ${forString} x \\in \\mathbb{R}, x \\neq ${x},

where ${avoid[0]}
is a constant, ${avoid[0]} \\neq ${avoid[1]}.`;
	}
	return avoid === undefined
		? mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad ${forString} x \\in \\mathbb{R}, x \\neq ${x},

where ${nonZeros.join(' \\text{ and } ')}
@${are} non-zero @${constants}.`
		: mathlify`The function ${f}
is defined by

$${{}} ${f}: x \\mapsto ${fExp}, \\quad ${forString} x \\in \\mathbb{R}, x \\neq ${x},

where ${nonZeros.join(' \\text{ and } ')}
@${are} non-zero @${constants} and 
${avoid[0]}
is a constant, ${avoid[0]} \\neq ${avoid[1]}.`;
}

export function generateAns(
	state: State,
	fExp: Expression,
	f: string,
): { ans: string; soln: string } {
	const { fnType, show, n } = state;
	const { working } =
		fnType === 'frac'
			? fractionalInverseWorking(fExp, false, { reportInverse: true, f, qed: !show, swapNum: true })
			: fnType === 'linear'
				? linearInverseWorking(fExp, { f, qed: !show })
				: specialInverseWorking(state, fExp, f, !show);
	const ans1 = show ? '' : mathlify`${{}} ${f}^{-1}(x) = ${fExp}.`;
	const even = n % 2 === 0;
	const ansExp = even ? 'x' : fExp;
	const ans2 = mathlify`${f}^{${n}}(x) = ${ansExp}.`;
	const showSoln = show
		? mathlifyQED`Hence ${f}
is self-inverse as ${{}} {${f}(x) = ${f}^{-1}(x)}
and ${{}} D_{${f}^{-1}} = R_${f} = D_${f}`
		: '';
	const finalStep = even ? `x` : `${f}(x) \\\\ &= ${fExp}`;
	const fnSoln =
		n > 3
			? mathlifyQED`$${'align*'} ${f}^{${n}}(x) &= ${f}^{${n - 2}}${f}${f}(x)
\\\\ &= ${f}^{${n - 2}}${f}${f}^{-1}(x)
\\\\ &= ${f}^{${n - 2}}(x)
\\\\ &= \\dotsb
\\\\ &= ${finalStep}`
			: n === 2
				? mathlifyQED`$${'align*'} ${f}^{${n}}(x) &= ${f}${f}(x) \\\\ &= ${f}${f}^{-1}(x) \\\\ &= x`
				: mathlifyQED`$${'align*'} ${f}^{${n}}(x) &= ${f}${f}${f}(x) \\\\ &= ${f}${f}${f}^{-1}(x) \\\\ &= ${finalStep}`;
	const soln = working + showSoln + fnSoln;
	return { ans: ans1 + ans2, soln };
}

function specialInverseWorking(
	state: StateOthers,
	fExp: Expression,
	f: string,
	qed?: boolean,
): { working: string } {
	if (state.fnType === 'log') {
		const working = new EquationWorking('y', fExp);
		working.inverse({ hide: true }).simplify().crossMultiply().expand();
		const fInv = fExp;
		const QEDString = qed ? QED : '';
		const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}
\\\\ ${e}^x ${e}^y - ${e}^x = ${e}^y + 1
\\\\ ${e}^x \\left( ${e}^y - 1 \\right) =  ${e}^y + 1
\\\\ ${e}^x  =  \\frac{${e}^y + 1}{${e}^y - 1)}
\\\\ x = \\ln \\left( \\frac{${e}^y + 1}{${e}^y - 1} \\right)
\\\\ ${f}^{-1}(x) = ${fInv} ${QEDString}`;
		return { working: soln1 };
	}
	const working = new EquationWorking('y', fExp);
	EquationWorking.RegisterCustomSimplifier(simplifySurd);
	working
		.square()
		.crossMultiply()
		.expand()
		.isolate('x')
		.factorize.commonFactor()
		._makeSubjectFromProduct('x');
	EquationWorking.DeregisterCustomSimplifier();
	const fInv = fExp;
	const soln1 = mathlify`$${'gather*'} \\text{Let } ${working}
\\\\ \\text{Since } x, y > 0,
\\\\ x = \\sqrt{ \\frac{y^2}{y^2-1} }
\\\\ x = \\frac{y}{\\sqrt{y^2-1}}
\\\\ ${f}^{-1}(x) = ${fInv}`;
	return { working: soln1 };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
