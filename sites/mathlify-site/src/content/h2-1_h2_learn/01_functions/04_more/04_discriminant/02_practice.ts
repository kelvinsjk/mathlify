import type { PracticeQuestion } from '$content/_types';
import { chooseRandom, coinFlip } from '$lib/utils/random';
import { z } from 'zod';
import json from './2024-0911.json';

// objectives
// A: (dx+e) / (ax^2 + bx + c)
// B: a + bx + c / (dx+e)
// C: (dx+e) / (c^2 - a^2x^2)

import { mathlifierDj as mathlifier } from 'mathlifier';
import { expressionToPolynomial, Polynomial, quotient, Expression } from 'mathlify';
import { EquationWorking } from 'mathlify/working';
import { QED } from '$lib/typesetting/utils';

export interface State {
	type: 1 | 2 | 3;
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	surd: boolean;
	algebraic: boolean;
}

export const practiceTitle = `using the quadratic discriminant`;

const jsonSchema = z.array(
	z.object({
		a: z.number(),
		b: z.number(),
		c: z.number(),
		d: z.number(),
		e: z.number(),
		surd: z.boolean(),
		type: z.literal(1).or(z.literal(2).or(z.literal(3)))
	})
);

export function generateState(): State {
	const jsonStates = jsonSchema.parse(json);
	const jsonState = chooseRandom(jsonStates);
	return {
		...jsonState,
		algebraic: coinFlip()
	};
}

export function generateQn(state: State): PracticeQuestion {
	const useAnAlgebraicMethodTo = state.algebraic
		? `Use an algebraic method to `
		: `Without using a graphic calculator, `;
	const { exp, domain } = generateFnAndDomain(state);
	const qn = mathlifier`The function ${'f'}
is defined by

$${''} f: x \\mapsto ${exp}, \\quad, x \\in \\mathbb{R} ${domain}

@${useAnAlgebraicMethodTo} find the range of ${'f'}.`;
	return { qn, ...discriminantRange(state) };
}

export function discriminantRange(state: {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	type: 1 | 2 | 3;
}): { ans: string; soln: string } {
	const { exp } = generateFnAndDomain(state);
	const hide = true;
	const working = new EquationWorking('y', exp);
	working.crossMultiply().expand().makeRhsZero({ hide }).toPolynomial('x', { hide });
	const xPoly = expressionToPolynomial(working.eqn.lhs, 'x');
	if (new Expression(xPoly.leadingCoefficient).is.negative()) {
		working.times(-1, { expand: true });
	} else {
		working.times(1, { expand: true });
	}
	const discriminant = expressionToPolynomial(working.eqn.lhs, 'x').quadraticDiscriminant();
	const working2 = new EquationWorking(discriminant, 0, { sign: '>=' });
	working2.expand().toPolynomial('y');
	const yPoly = expressionToPolynomial(working2.eqn.lhs, 'y');
	if (new Expression(yPoly.leadingCoefficient).is.negative()) {
		working2.times(-1, { expand: true });
	}
	const { answers, rootsWorking, roots } = working2.solve.quadraticInequality('y');
	let soln = mathlifier`$${'gather*'}${working}

The range of ${'f'}
corresponds to the values of ${'y'}
for which there are at least one real root to the equation above in ${'x'}.
$${'gather*'}b^2-4ac \\geq 0 \\\\ ${working2}`;
	if (rootsWorking) {
		soln +=
			'\n\n' +
			mathlifier`Solving ${working2.eqn.lhs}=0,
$${'align*'}${rootsWorking}

Hence the solution to the inequality is`;
	}
	soln += `\n\n` + mathlifier`$${answers.join('\\quad \\text{ or } \\quad ')}`;
	soln += '\n\n';
	const [root1, root2] = roots.sort((a, b) => a.valueOf() - b.valueOf());
	let ans: string;
	if (answers.length === 1) {
		soln += mathlifier`$${'R_f'} = \\left[ ${root1}, ${root2} \\right] \\; ${QED}`;
		ans = mathlifier`${'R_f'} = \\left[ ${root1}, ${root2} \\right].`;
	} else {
		soln += mathlifier`$${'R_f'} = \\left( -\\infty, ${root1} \\right] \\cup \\left[ ${root2}, \\infty \\right) \\; ${QED}`;
		ans = mathlifier`${{}} \\left( -\\infty, ${root1} \\right] \\allowbreak \\cup \\left[ ${root2}, \\infty \\right).`;
	}

	return { soln, ans };
}

function generateFnAndDomain(state: {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	type: 1 | 2 | 3;
}): { exp: Expression; domain: string } {
	const { a, b, c, d, e, type } = state;
	let exp: Expression;
	let domain: string;
	if (type === 1) {
		const ascending = a < 0 || d < 0;
		const num = new Polynomial([d, e]);
		const den = new Polynomial([a, b, c]);
		num.ascending = ascending;
		den.ascending = ascending;
		exp = quotient(num, den);
		domain = `.`;
	} else if (type === 2) {
		const oblique = new Polynomial([a, b]);
		const den = new Polynomial([d, e]);
		if (d < 0) den.ascending = true;
		exp = quotient(oblique.times(den).plus(c), den);
		const asymptote = quotient(-e, d);
		domain = `, x \\neq ${asymptote}.`;
	} else {
		// type 3
		const num = new Polynomial([d, e]);
		if (e > 0) num.ascending = true;
		const den = new Polynomial([c * c, 0, -a * a], { ascending: true });
		exp = quotient(num, den);
		const asymptote = quotient(Math.abs(c), Math.abs(a));
		domain = `, x \\neq \\pm ${asymptote}.`;
	}
	return { exp, domain };
}
