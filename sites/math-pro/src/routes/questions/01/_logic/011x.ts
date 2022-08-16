import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Polynomial,
	Rational,
	heads,
	Vector,
	cramers,
	SquareRoot,
	solveQuadraticSurd,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn2(variables?: { coeffs?: number[]; xs?: number[] }): [AnswerObject, AnswerObject] {
	// generate variables
	const { a1, a2, a3 } = generate0112();
	const { coeffs, xs } = {
		coeffs: [...a1, ...a2, ...a3],
		xs: [getRandomInt(100, 200) * 5, getRandomInt(140, 240) * 5, getRandomInt(600, 1100)],
		...variables,
	};

	// construct qn
	const [x, y, z] = xs;
	const total1 = (coeffs[0] * x + coeffs[1] * y + coeffs[2] * z) / 100;
	const total2 = (coeffs[3] * x + coeffs[4] * y + coeffs[5] * z) / 100;
	const total3 = (coeffs[6] * x + coeffs[7] * y + coeffs[8] * z) / 100;

	// typeset qn
	const body = `
		Tickets for a school concert are priced differently depending on whether the attendee is
		a student, a teacher, or a parent.
		Three groups of people, ${math(`A,B`)} and ${math(`C,`)}
		attend the convert. The numbers in each category for each group, along with
		the total cost of the tickets for each group, are given in the following table.
	<div style="overflow-x: auto">
		<table>
			<tr>
				<th style="padding:0.5rem;">Group</th>
				<th style="text-align: center; padding:0.5rem">Students</th>
				<th style="text-align: center; padding:0.5rem">Teachers</th>
				<th style="text-align: center; padding:0.5rem">Parents</th>
				<th style="text-align: center; padding:0.5rem">Total cost</th>
			</tr>
			<tr>
				<th style="padding:0.5rem">${math(`A`)}</th>
				<td style="text-align: center; padding:0.5rem">${coeffs[0]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[1]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[2]}</td>
				<td style="text-align: center; padding:0.5rem">$${total1.toFixed(2)}</td>
			</tr>
			<tr>
				<th style="padding:0.5rem">${math(`B`)}</th>
				<td style="text-align: center; padding:0.5rem">${coeffs[3]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[4]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[5]}</td>
				<td style="text-align: center; padding:0.5rem">$${total2.toFixed(2)}</td>
			</tr>
			<tr>
				<th style="padding:0.5rem">${math(`C`)}</th>
				<td style="text-align: center; padding:0.5rem">${coeffs[6]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[7]}</td>
				<td style="text-align: center; padding:0.5rem">${coeffs[8]}</td>
				<td style="text-align: center; padding:0.5rem">$${total3.toFixed(2)}</td>
			</tr>
		</table> 
	</div>
		Write down and solve equations to find the cost of a ticket for each of the categories.
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

	// answer
	const ans = `Student: ${math(`\\$${xSolve.toFixed(2)}.`)}<br>
		Teacher: ${math(`\\$${ySolve.toFixed(2)}.`)} <br>
		Parent: ${math(`\\$${zSolve.toFixed(2)}.`)}
	`;

	const question: AnswerObject = {
		body,
		marks: 4,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function qn3(variables?: {
	b?: number;
	c?: number;
	e?: number;
	can?: boolean;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { b, c, e, can } = {
		...generate0113(),
		can: heads(),
		...variables,
	};

	// construct qn
	const num = new Polynomial([1, b, c]);
	const den = new Polynomial([1, e]);
	const y = new Rational(num, den);
	const canTake = can ? 'can take' : 'cannot take';

	// typeset qn
	const body = `It is given that
		${display(`y = ${y}, \\quad x \\in \\mathbb{R}, x \\neq ${-e}.`)}
		Without using a calculator, find the set of values that ${math(`y`)}
		${canTake}.
	`;

	// solution working
	// x^2 + bx + c / (x + e) = y
	// x^2 + bx + c = xy + ey
	// x^2 + (b-y) x + (c-ey);
	const B = new Polynomial([-1, b]);
	const C = new Polynomial([-e, c]);
	const discriminantPoly = B.square().minus(C.times(4));
	const [root1, root2] = solveQuadraticSurd(discriminantPoly);

	// answer
	const ans = can
		? display(
				`\\{y \\in \\mathbb{R}: {y \\leq ${root1}} \\; \\textrm{ or } \\; {y \\geq ${root2}} \\}`,
		  )
		: display(`\\{y \\in \\mathbb{R}: ${root1} < y < ${root2}  \\}`, {});

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
	qn2,
	qn3,
};

export function generate0112(): {
	a1: [number, number, number];
	a2: [number, number, number];
	a3: [number, number, number];
} {
	const a1: [number, number, number] = [
		getRandomInt(5, 11),
		getRandomInt(3, 9),
		getRandomInt(2, 7),
	];
	const a2 = generateTwo(a1);
	const a3 = generateThree(a1, a2);
	return { a1, a2, a3 };
}
function generateTwo(as: [number, number, number]): [number, number, number] {
	let newAs: [number, number, number] = [
		getRandomInt(5, 11),
		getRandomInt(3, 9),
		getRandomInt(2, 7),
	];
	const aVector1 = new Vector(as[0], as[1], as[2]);
	let aVector2 = new Vector(newAs[0], newAs[1], newAs[2]);
	while (aVector1.isParallelTo(aVector2)) {
		newAs = [getRandomInt(5, 11), getRandomInt(3, 9), getRandomInt(2, 7)];
		aVector2 = new Vector(newAs[0], newAs[1], newAs[2]);
	}
	return newAs;
}
function generateThree(
	as1: [number, number, number],
	as2: [number, number, number],
): [number, number, number] {
	const aVector1 = new Vector(as1[0], as1[1], as1[2]);
	const aVector2 = new Vector(as2[0], as2[1], as2[2]);
	const nVector = aVector1.cross(aVector2);
	let newAs: [number, number, number] = [
		getRandomInt(5, 11),
		getRandomInt(3, 9),
		getRandomInt(2, 7),
	];
	let aVector3 = new Vector(newAs[0], newAs[1], newAs[2]);
	while (aVector3.isPerpendicularTo(nVector)) {
		newAs = [getRandomInt(5, 11), getRandomInt(3, 9), getRandomInt(2, 7)];
		aVector3 = new Vector(newAs[0], newAs[1], newAs[2]);
	}
	return newAs;
}

export function generate0113(): { b: number; c: number; e: number } {
	const b = getRandomInt(-9, 9, { avoid: [0] });
	const c = getRandomInt(-9, 9, { avoid: [0] });
	const e = getRandomInt(-9, 9, { avoid: [0] });
	const d = e * e - b * e + c;
	if (d <= 0) {
		return generate0113();
	}
	const surd = new SquareRoot(d);
	if (surd.radicand.num < 40) {
		// ~54%
		return { b, c, e };
	}
	return generate0113();
}
