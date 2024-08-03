import { chooseRandom, getRandomInt, coinFlip, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: left vs right
// C: inclusive vs exclusive
// D (only for special): left2 vs right2 (0 vs \pm a)

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression, type Numeral, Polynomial, e, sum } from 'mathlify';
import { bisection } from 'mathlify/numerical';
import { generateFn } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { lessThan, greaterThan } from './03-formula.practice';
import { QED, capitalizeFirstLetter } from '$lib/utils/typesetting';
import { logTerm } from 'mathlify/fns';
import { EquationWorking } from 'mathlify/working';

// quadratic: (x-a)^2 + b, (2008)
// cubic: x^3 + ax^2 + bx + c
// log: ln (cx + a) + b (2011)
// exp: e^(x-b) - a (equivalent to log with c=1)

const types = ['quadratic', 'cubic', 'log', 'exp'] as const;
type Types = typeof types;
type Type = Types[number];

interface State extends PracticeState {
	fnType: Type;
	a: number;
	b: number;
	c: number;
}

export function generateState(options?: { type?: Type }): State {
	const fnType = options?.type ?? chooseRandom(types);
	let a = getRandomInt(-4, 4);
	let b = getRandomInt(-4, 4);
	let c = 1;
	return { fnType, a, b, c };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { fnType, a, b, c } = state1;
	const [fnString, exp] =
		fnType === 'quadratic'
			? generateFn({
					...state1,
					fnType: 'quadratic',
					restriction: { type: 'right', x: -a, inclusive: true },
					unknownConstants: false,
				})
			: generateFn2(state1);
	const qn = mathlify`The function ${'f'}
is defined by

$${fnString}.

Using the symmetrical property of inverses, solve, without finding the formula for
${'f^{-1}(x),'}
the equation ${'f(x)=f^{-1}(x).'} 
`;

	const { ans, soln } = inverseRelationshipSolver(state1, exp);
	return { qn, ans: soln };
}

function generateFn2(state: State): [string, Expression] {
	let exp: Expression;
	let domain = `x \\in \\mathbb{R}.`;
	const { fnType, a, b, c } = state;
	if (fnType === 'cubic') {
		exp = new Polynomial([1, a, b, c]);
	} else if (fnType === 'log') {
		exp = sum(logTerm(new Polynomial([c, a])), b);
		const negativeAOverC = new Expression([-a, '/', c]).simplify();
		domain = `x \\in \\mathbb{R}, x > ${negativeAOverC}.`;
	} else if (fnType === 'exp') {
		exp = sum([e, '^', new Polynomial([1, -b])], -a);
	} else throw new Error(`expected other types to have been handled`);
	const fnString = `f: x \\mapsto ${exp}, \\quad ${domain}`;
	return [fnString, exp];
}

export function inverseRelationshipSolver(
	state: State,
	exp: Expression,
): { ans: string; soln: string; roots: (number | Numeral | Expression)[] } {
	const { fnType, a, c } = state;
	const roots: (number | Numeral | Expression)[] = [];
	const intersections = fnType === 'log' || fnType === 'exp' ? 'intersections' : 'intersection';
	const are = fnType === 'log' || fnType === 'exp' ? 'are' : 'is';
	let soln = mathlify`The graphs of ${'y = f^{-1}(x)'}
is a reflection of the graph of ${`y=f(x)`}
about the line ${'y=x'}.

We observe that the @${intersections}
between the two graphs @${are}
also the @${intersections} between the graph of
${'y=f(x)'}
and the line ${'y=x'}.`;
	const working = new EquationWorking(exp, 'x');
	working.expand();
	working.makeRhsZero();
	if (fnType === 'quadratic') {
		const { roots: quadraticRoots, rootsWorking } = working.solve.quadratic();
		const root = quadraticRoots[1];
		roots.push(root);
		soln += mathlify`$${'gather*'}${working}
		
$${'align*'}${rootsWorking}

Since ${`x > ${-a},`}
$${{}} x = ${root} ${QED}`;
	} else if (fnType === 'cubic') {
		roots.push();
	} else {
		// both log and exp case done via logs
		const xStationary = 1;
		const g = (x: number) => exp.fn(x) - x;
		const lower = Math.max(-a / c + 0.1, -5);
		const x1 = bisection(g, lower, xStationary);
		const x2 = bisection(g, xStationary, 5);
		roots.push(x1, x2);
		soln += mathlify`$${'gather*'}${working}
		
Using a GC, the ${'x'}\\text{-coordinates}
of the points of intersection are

$${{}} x = ${x1.toFixed(3)} ${QED}, \\quad x = ${x2.toFixed(3)} ${QED}
`;
	}
	const answers = roots.map((x) => (typeof x === 'number' ? x.toFixed(3) : x.toString()));
	const ans = mathlify`${'x='}${answers.join(',')}.`;
	return { ans, soln, roots };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
