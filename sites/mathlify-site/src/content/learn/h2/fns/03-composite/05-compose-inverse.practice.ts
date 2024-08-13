import { coinFlip, chooseRandom, getRandomNonZeroInt, getRandomInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: fg(x) = rhs vs f(x) = rhs, where g(x) = x+c. a=0 indicate second case

import type { PracticeState, PracticeQuestion } from '$lib/types/learn';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { generateFn } from '../01-concepts/02-functions.practice';
import { expInverse, logInverse } from '../02-inverse/03-formula.practice';
import { Expression, quotient, sum } from 'mathlify';
import { EquationWorking } from 'mathlify/working';
import { logTerm } from 'mathlify/fns';

// ln(x+a) + b (2011). No unknown constants if restricted
// exp(ax) + b (2019). unknown constants + restriction: x=0

interface State extends PracticeState {
	fnType: 'exp' | 'log';
	a: number;
	b: number;
	c: number;
	rhs: number;
}

export function generateState(): State {
	const fnTypes = ['exp', 'log'] as const;
	const fnType = chooseRandom(fnTypes);
	const c = coinFlip() ? 0 : getRandomNonZeroInt(1, 4);
	const b = getRandomNonZeroInt(1, 4);
	let rhs: number;
	let a: number;
	if (fnType === 'exp') {
		// exp(2x) + b
		// x > b
		a = 2;
		const argument = chooseRandom([4, 9, 25]);
		rhs = b + argument;
	} else {
		// ln(x+a) + b
		// x > -a.
		a = getRandomNonZeroInt(1, 4);
		rhs = getRandomInt(-a, 5);
	}
	return {
		fnType,
		a,
		b,
		c,
		rhs,
	};
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { fnType, a, b, c, rhs } = state1;
	const f = generateFn({ ...state1, unknownConstants: false, restriction: false })[1];
	const fInv = (
		fnType === 'exp'
			? expInverse(f, new Expression([a, 'x']), sum('y', -b), { b })
			: logInverse(f, sum('x', a), sum('y', -b))
	).exp;
	const fg = c === 0 ? 'f' : 'fg';
	const g = sum('x', c);
	const extra = c === 0 ? '.' : `, \\\\ g(x) &= ${g}.`;
	const qn = mathlify`It is given that 
$${'align*'} f(x) &= ${f}, \\\\
f^{-1}(x) &= ${fInv} ${extra}

Solve the equation $${fg}(x) = ${rhs}.`;
	return { qn, ...generateAns(state1, fInv) };
}

export function generateAns(state: State, fInv: Expression): { ans: string; soln: string } {
	const { fnType, b, c, rhs } = state;
	const verbatim = true;
	let ans: string;
	let soln: string;
	if (c === 0) {
		const working = new EquationWorking('x', fInv.subIn({ x: rhs }, { verbatim }));
		working.simplify();
		if (fnType === 'exp') {
			const argument = Math.sqrt(rhs - b);
			working.addCustomStep(
				working.eqn.lhs,
				quotient(logTerm([argument, '^', 2], { verbatim }), 2, { verbatim }),
			);
			working.addCustomStep(working.eqn.lhs, quotient([2, logTerm(argument)], 2, { verbatim }));
			working.simplify();
		}
		const x = working.eqn.rhs;
		soln = mathlifyQED`$${'gather*'} f(x) = ${rhs} \\\\ f^{-1}f(x) = f^{-1}(${rhs}) \\\\ ${working}`;
		ans = mathlify`${{}} x=${x}.`;
	} else {
		const verbatimTerm = fInv.subIn({ x: rhs }, { verbatim });
		const working = new EquationWorking(sum('x', c), verbatimTerm.simplify());
		if (fnType === 'exp') {
			const argument = Math.sqrt(rhs - b);
			working.addCustomStep(
				working.eqn.lhs,
				quotient(logTerm([argument, '^', 2], { verbatim }), 2, { verbatim }),
			);
			working.addCustomStep(working.eqn.lhs, quotient([2, logTerm(argument)], 2, { verbatim }));
			working.simplify();
		}
		const { root } = working.solve.linear('x');
		soln = mathlifyQED`$${'gather*'} fg(x) = ${rhs} \\\\ f^{-1}fg(x) = f^{-1}(${rhs}) \\\\ g(x) = ${verbatimTerm} \\\\ ${working}`;
		ans = mathlify`${{}} x=${root}.`;
	}
	return { ans, soln };
}
