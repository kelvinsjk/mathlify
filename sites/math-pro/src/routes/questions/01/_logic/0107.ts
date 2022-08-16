import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Polynomial,
	Rational,
	solveRational,
	heads,
	Expression,
	Vector,
	cramers,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: number;
	b?: number;
	c?: number;
	d?: number;
	k?: number;
	lessThan?: boolean;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, k, lessThan } = {
		a: getRandomInt(-9, 9, { avoid: [0] }),
		k: getRandomInt(-3, 3, { avoid: [0] }),
		lessThan: heads(),
		...variables,
	};
	let { b, c, d } = { ...variables };
	b = b || getRandomInt(-9, 9, { avoid: [0, a] });
	c = c || getRandomInt(-9, 9, { avoid: [0, a, b] });
	d = d || getRandomInt(-3, 3, { avoid: [0, a, b, c] });

	// construct qn
	const lhsN = new Polynomial([1, a]).times(new Polynomial([1, b]));
	const lhsD = new Polynomial([1, c]).times(new Polynomial([1, d]));
	const lhs = new Rational(lhsN, lhsD);
	const rational = lhs.plus(k);
	const showLHS = new Expression(`${rational}`, -k);
	const sign = lessThan ? '<' : '>';

	// typeset qn
	const body = `Show that
		${display(`${showLHS}=${lhs}.`)}
		Hence, without using a calculator, solve the inequality
		${display(`${rational} ${sign} ${k} `)}
	`;

	// solution working
	const soln = solveRational(rational, k, { lessThan });

	// answer
	const ans = math(`${soln.combinedAnswer}`, { wrap: true });

	const question: AnswerObject = {
		body,
		marks: 5,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function b(variables?: { coeffs?: number[]; xs?: number[] }): [AnswerObject, AnswerObject] {
	// generate variables
	const { xs: xsDefault, a1, a2, a3, a4 } = generate();
	const { coeffs, xs } = {
		xs: xsDefault,
		coeffs: [...a1, ...a2, ...a3, ...a4],
		...variables,
	};

	// construct qn
	const [x, y, z] = xs;
	const total1 = coeffs[0] * x + coeffs[1] * y + coeffs[2] * z;
	const total2 = coeffs[3] * x + coeffs[4] * y + coeffs[5] * z;
	const total3 = coeffs[6] * x + coeffs[7] * y + coeffs[8] * z;

	// typeset qn
	const body = `
		Four siblings, Wendy, Xena, Yana and Zac bought a variety of fruits from a supermarket.
		The masses of each fruit and the total amounts paid are shown in the following table.
	<div style="overflow-x: auto">
		<table>
			<tr>
				<th style="padding:0.5rem;"></th>
				<th style="text-align: center; padding:0.5rem">Wendy</th>
				<th style="text-align: center; padding:0.5rem">Xena</th>
				<th style="text-align: center; padding:0.5rem">Yana</th>
				<th style="text-align: center; padding:0.5rem">Zac</th>
			</tr>
			<tr>
				<th style="padding:0.5rem">Apples (kg)</th>
				<td style="text-align: center; padding:0.5rem">${(coeffs[0] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[3] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[6] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[9] / 100).toFixed(2)}</td>
			</tr>
			<tr>
				<th style="padding:0.5rem">Bananas (kg)</th>
				<td style="text-align: center; padding:0.5rem">${(coeffs[1] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[4] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[7] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[10] / 100).toFixed(2)}</td>
			</tr>
			<tr>
				<th style="padding:0.5rem">Cantaloupes (kg)</th>
				<td style="text-align: center; padding:0.5rem">${(coeffs[2] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[5] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[8] / 100).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(coeffs[11] / 100).toFixed(2)}</td>
			</tr>
			<tr>
				<th style="padding:0.5rem">Total paid ($)</th>
				<td style="text-align: center; padding:0.5rem">${(total1 / 10000).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(total2 / 10000).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem">${(total3 / 10000).toFixed(2)}</td>
				<td style="text-align: center; padding:0.5rem"></td>
			</tr>
		</table> 
	</div>
		Assuming that the price per kilogram for each of the fruits is the same for all siblings, calculate
		the total amount that Zac paid.
	`;

	// solution working
	const [xSolve, ySolve, zSolve] = cramers(
		...coeffs.slice(0, 3),
		total1,
		...coeffs.slice(3, 6),
		total2,
		...coeffs.slice(6, 9),
		total3,
	);
	const total = coeffs[9] * xSolve + coeffs[10] * ySolve + coeffs[11] * zSolve;
	const soln = `\\$${(total / 10000).toFixed(2)}`;

	// answer
	const ans = math(`${soln}`, { wrap: true });

	const question: AnswerObject = {
		body,
		marks: 5,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};

export function generate(): {
	xs: [number, number, number];
	a1: [number, number, number];
	a2: [number, number, number];
	a3: [number, number, number];
	a4: [number, number, number];
} {
	const xs: [number, number, number] = [
		getRandomInt(19, 50) * 10,
		getRandomInt(19, 50) * 10,
		getRandomInt(19, 50) * 10,
	];
	const a1 = generateOne(...xs);
	const a2 = generateTwo(xs, a1);
	const a3 = generateThree(xs, a1, a2);
	const a4 = generateFour(xs, a1, a2, a3);
	return { xs, a1, a2, a3, a4 };
}
function generateOne(x: number, y: number, z: number): [number, number, number] {
	let a1 = getRandomInt(1, 50) * 5;
	let a2 = getRandomInt(1, 50) * 5;
	let a3 = getRandomInt(1, 50) * 5;
	while (!((a1 * x + a2 * y + a3 * z) % 100 === 0)) {
		// escape probability at least 0.5
		a1 = getRandomInt(1, 50) * 5;
		a2 = getRandomInt(1, 50) * 5;
		a3 = getRandomInt(1, 50) * 5;
	}
	return [a1, a2, a3];
}
function generateTwo(
	xs: [number, number, number],
	as: [number, number, number],
): [number, number, number] {
	let newAs = generateOne(...xs);
	const aVector1 = new Vector(as[0], as[1], as[2]);
	let aVector2 = new Vector(newAs[0], newAs[1], newAs[2]);
	while (aVector1.isParallelTo(aVector2)) {
		newAs = generateOne(...xs);
		aVector2 = new Vector(newAs[0], newAs[1], newAs[2]);
	}
	return newAs;
}
function generateThree(
	xs: [number, number, number],
	as1: [number, number, number],
	as2: [number, number, number],
): [number, number, number] {
	const aVector1 = new Vector(as1[0], as1[1], as1[2]);
	const aVector2 = new Vector(as2[0], as2[1], as2[2]);
	const nVector = aVector1.cross(aVector2);
	let newAs = generateOne(...xs);
	let aVector3 = new Vector(newAs[0], newAs[1], newAs[2]);
	while (aVector3.isPerpendicularTo(nVector)) {
		newAs = generateOne(...xs);
		aVector3 = new Vector(newAs[0], newAs[1], newAs[2]);
	}
	return newAs;
}
function generateFour(
	xs: [number, number, number],
	as1: [number, number, number],
	as2: [number, number, number],
	as3: [number, number, number],
): [number, number, number] {
	const aVector1 = new Vector(as1[0], as1[1], as1[2]);
	const aVector2 = new Vector(as2[0], as2[1], as2[2]);
	const aVector3 = new Vector(as3[0], as3[1], as3[2]);
	let newAs = generateOne(...xs);
	let aVector4 = new Vector(newAs[0], newAs[1], newAs[2]);
	while (
		aVector4.isParallelTo(aVector1) ||
		aVector4.isParallelTo(aVector2) ||
		aVector4.isParallelTo(aVector3)
	) {
		newAs = generateOne(...xs);
		aVector4 = new Vector(newAs[0], newAs[1], newAs[2]);
	}
	return newAs;
}
