import { chooseRandom, getRandomInt, getRandomNonZeroInt } from '$lib/utils/random';

// objectives
// A: fnType
// B: left vs right
// C: inclusive vs exclusive
// D (only for special): left2 vs right2 (0 vs \pm a)

import type { PracticeState, PracticeQuestion, Practice } from '$lib/types/learn';
import { mathlify } from '$lib/mathlifier';
import { Expression, Polynomial, e, sum } from 'mathlify';
import { bisection, cubicRoot } from 'mathlify/numerical';
import { generateFn } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { QED } from '$lib/utils/typesetting';
import { logTerm } from 'mathlify/fns';
import { EquationWorking } from 'mathlify/working';
import { logCoeffs } from './05-log-coeffs.data';

// quadratic: (x+a)^2 + b, (2008)
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
	let b = getRandomInt(-4, -a + 1 / 4); // to guarantee root exists for quadratic
	let c = 1;
	if (fnType === 'cubic') {
		// a^2 < 3b for curve to be strictly increasing (hence it intersects with y=x, and exactly once)
		const bToAs: Record<number, number[]> = {
			1: [1],
			2: [1, 2],
			3: [1, 2],
			4: [1, 2, 3],
		};
		b = getRandomInt(1, 4);
		// note to self: ensure b is a key of bToAs
		a = chooseRandom(bToAs[b]);
		c = getRandomNonZeroInt(1, 4);
	} else if (fnType === 'log' || fnType === 'exp') {
		({ a, b, c } = chooseRandom(logCoeffs.filter(({ c }) => c === 1)));
	}
	return { fnType, a, b, c };
}

export function generateQn(state: PracticeState): PracticeQuestion {
	const state1 = state as State;
	const { fnType, a } = state1;
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

$${fnString}

Using the symmetrical property of inverses, solve, without finding the formula for
${'f^{-1}(x),'}
the equation ${'f(x)=f^{-1}(x).'} 
`;

	const { soln, ans } = inverseRelationshipSolver(state1, exp);
	return { qn, ans, soln };
}

function generateFn2(state: State): [string, Expression] {
	let exp: Expression;
	let domain = `x \\in \\mathbb{R}.`;
	const { fnType, a, b, c } = state;
	if (fnType === 'cubic') {
		exp = new Polynomial([1, a, b, c]);
	} else if (fnType === 'log') {
		exp = sum(logTerm(new Polynomial([c, a])), b).simplify();
		const negativeAOverC = new Expression([-a, '/', c]).simplify();
		domain = `x \\in \\mathbb{R}, x > ${negativeAOverC}.`;
	} else if (fnType === 'exp') {
		exp = sum([e, '^', new Polynomial([1, -b])], -a).simplify();
	} else throw new Error(`expected other types to have been handled`);
	const fnString = `f: x \\mapsto ${exp}, \\quad ${domain}`;
	return [fnString, exp];
}

export function inverseRelationshipSolver(
	state: State,
	exp: Expression,
	options?: {
		lineQED?: boolean;
		precision?: number;
		tys2011ExtraStep?: true;
	},
): { ans: string; soln: string; roots: (number | Expression)[] } {
	const { fnType, a, c } = state;
	const roots: (number | Expression)[] = [];
	const intersections = fnType === 'log' || fnType === 'exp' ? 'intersections' : 'intersection';
	const solutions = fnType === 'log' || fnType === 'exp' ? 'solutions' : 'solution';
	const are = fnType === 'log' || fnType === 'exp' ? 'are' : 'is';
	const extraQED = options?.lineQED ? QED : '.';
	let soln = mathlify`The graph of ${'{y = f^{-1}(x)}'}
is a reflection of the graph of ${`{y=f(x)}`}
about the line ${'{y=x}'}${extraQED}

We observe that the @${intersections}
between the two curves @${are}
also the @${intersections} between the graph of
${'{y=f(x)}'}
and the line ${'{y=x}'}.

Hence the @${solutions} to ${'{f(x)=f^{-1}(x)}'}
can be found by solving`;
	const working = new EquationWorking(exp, 'x');
	working.expand();
	if (fnType === 'quadratic') {
		const { roots: quadraticRoots, rootsWorking } = working.solve.quadratic();
		const root = quadraticRoots[1];
		roots.push(root);
		soln += mathlify`$${'gather*'}f(x) = x \\\\ ${working}
		
$${'align*'}${rootsWorking}

Since ${`x > ${-a},`}
$${{}} x = ${root} ${QED}`;
	} else if (fnType === 'cubic') {
		const root = cubicRoot(exp as Polynomial, -5, 5);
		roots.push(root);
		const rootString =
			root instanceof Expression
				? root.toString()
				: options?.precision
					? root.toPrecision(options.precision)
					: root.toFixed(3);
		soln += mathlify`$${'gather*'}f(x) = x \\\\ ${working}
		
Using a GC, the ${'x'}\\text{-coordinates}
of the point of intersection is

$${{}} x = ${rootString} ${QED}
`;
	} else {
		// both log and exp cases have same answers
		const xStationary = (c - a) / c;
		const g = (x: number) => exp.fn(x) - x;
		const lower = Math.max(-a / c + 0.01, -5);
		const x1 = bisection(g, lower, xStationary);
		const x2 = bisection(g, xStationary, 6);
		const x1String = options?.precision ? x1.toPrecision(options.precision) : x1.toFixed(3);
		const x2String = options?.precision ? x2.toPrecision(options.precision) : x2.toFixed(3);
		roots.push(x1, x2);
		let extraQED = '';
		if (options?.tys2011ExtraStep) {
			working.moveTerms(1);
			extraQED = QED;
		}
		soln += mathlify`$${'gather*'}f(x) = x \\\\ ${working} ${extraQED}
		
Using a GC, the ${'x'}\\text{-coordinates}
of the points of intersection are

$${{}} x = ${x1String} ${QED}, \\quad x = ${x2String} ${QED}
`;
	}
	const answers = roots.map((x) =>
		typeof x === 'number'
			? options?.precision
				? x.toPrecision(options.precision)
				: x.toFixed(3)
			: x.toString(),
	);
	const ans = mathlify`${'x='}${answers.join(', ')}.`;
	return { ans, soln, roots };
}

export const practice: Practice = {
	generateState,
	generateQn,
};
