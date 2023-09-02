<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Polynomial,
		castToPoly,
		RationalFn,
		EquationWorking,
		Fraction,
		Expression,
		Term,
		Point,
		Circle,
		completeSquare,
		UnsimplifiedExpression,
	} from 'mathlify';
	import { alignStar, display, eqn, gatherStar, math, newParagraph, newline } from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 6: Coordinate Geometry';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	function area(...points: Point[]): Fraction {
		return points
			.reduce((prev, point, i) => {
				const nextPt = i === points.length - 1 ? points[0] : points[i + 1];
				return prev.plus(point.x.times(nextPt.y)).minus(point.y.times(nextPt.x));
			}, new Fraction(0))
			.abs()
			.divide(2);
	}

	function areaWorking(...points: Point[]): string {
		let arrayArg = '';
		let xs = '';
		let ys = '';
		let plusTerms: Fraction[] = [];
		let minusTerms: Fraction[] = [];
		points.forEach((point, i) => {
			arrayArg += 'c';
			xs += `${point.x} &`;
			ys += `${point.y} &`;
			if (i === points.length - 1) {
				plusTerms.push(point.x.times(points[0].y));
				minusTerms.push(point.y.times(points[0].x));
			} else {
				plusTerms.push(point.x.times(points[i + 1].y));
				minusTerms.push(point.y.times(points[i + 1].x));
			}
		});
		arrayArg += 'c';
		xs += `${points[0].x}`;
		ys += `${points[0].y}`;
		return `&= \\frac{1}{2} \\left| \\begin{array}{${arrayArg}}
			${xs} \\\\
			${ys}
		\\end{array} \\right|
		\\\\ &= \\frac{1}{2} \\Bigl| \\left({\\textstyle ${new UnsimplifiedExpression(
			...plusTerms,
		)}} \\right) - \\left( {\\textstyle ${new UnsimplifiedExpression(
			...minusTerms,
		)}} \\right) \\Bigr|
		\\\\ &= ${area(...points)}
		`;
	}

	//! Question 1: 2020 P1 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 4,
			b = -6,
			c = -12;
		const circle = Circle.fromGeneralForm(a, b, c);
		const body = `The equation of a circle is
			${display(`${circle.toGeneralForm()} = 0.`)}
		`;
		// part a
		(() => {
			const body = `Find the radius of the circle and the coordinates of its centre.`;
			const xPoly = new Polynomial([1, a, 0]);
			const yPoly = new Polynomial([1, b, 0], { variable: 'y' });
			const sqEqn = completeSquare(xPoly)
				.plus(completeSquare(yPoly))
				.plus(c)
				.changeOrder([0, 2, 1]);
			const working = new EquationWorking(sqEqn, 0);
			working.moveTerm(2);
			const sol =
				gatherStar(`${circle.toGeneralForm()} = 0
				\\\\ ${xPoly} + ${yPoly} ${c} = 0
				\\\\ ${completeSquare(xPoly)} + ${completeSquare(yPoly)} ${c} = 0
				\\\\ ${working}
			`) +
				`Hence the radius of the circle is ${math(
					`${circle.radius} \\textrm{ units} \\; \\blacksquare`,
				)}
					and the coordinates of its centre is ${math(`${circle.center} \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const pt = new Point(1, 7);
			const body = `Find the equation of the tangent to the circle at the point ${math(`${pt}.`)}`;
			const m = pt.gradient(circle.center);
			const m2 = m.negative().reciprocal();
			const tangent = circle.tangentTo(pt);
			let sol = `Let the center of the circle be denoted by ${math(`C`)}
				and the point ${math(`${pt}`)} be
				denoted by ${math(`P`)}
			`;
			sol += alignStar(`& \\textrm{Gradient of } CP
				\\\\ &= \\frac{${pt.y} - ${circle.center.y}}{${pt.x} - (${circle.center.x})}
				\\\\ &= ${m}
			`);
			sol += `Hence the gradient of the tangent to the circle at ${math(`P`)} is ${math(`${m2}`)}
				${newParagraph}
				Equation of tangent to the circle at ${math(`P`)} is
			`;
			sol += alignStar(`y - ${pt.y} &= ${m2} \\left( x - ${pt.x} \\right)
				\\\\ y &= ${tangent} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2019 P1 Q9
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(0, 2);
		const body = `The diagram shows a kite
			${math(`ABCD`)} in which ${math(`AB=BC`)}
			and ${math(`AD=DC.`)}
			The points ${math(`${A}`)}
			and ${math(`B`)} lie on the
			${math(`y\\textrm{-axis}.`)}
			The diagonals ${math(`AC`)}
			and ${math(`BD`)} intersect at the point ${math(`P`)}
			on the ${math(`x\\textrm{-axis}.`)}
			${newParagraph}
			Given that the length of ${math(`AB`)}
			is ${math(`4 \\textrm{ units},`)}
		`;
		// part a
		let B = new Point(0, -2);
		(() => {
			const body = `explain why ${math(`BC`)} is
				parallel to the ${math(`x\\textrm{-axis}.`)}
			`;
			const sol = `Since the length of ${math(`AB`)}
				is ${math(`4 \\textrm{ units}`)}
				and ${math(`A`)} has coordinates ${math(`\\left(0, 2\\right),`)}
				${math(`B`)} has coordinates ${math(`\\left(0, -2\\right).`)}
				${newline}
				Hence ${math(`OA = OB`)}
				${newParagraph}
				Considering the triangles ${math(`AOP`)} and ${math(`BOP,`)}
				${gatherStar(`OA = OB
					\\\\ OP \\textrm{ is common}
					\\\\ \\angle AOP = \\angle BOP = 90^\\circ
				`)}
				By the ${math(`SAS`)} property, ${math(`\\triangle AOP \\equiv \\triangle BOP,`)}
				so ${math(`AP=BP`)}
				${newParagraph}
				Hence ${math(`\\triangle ABP`)} is an isosceles right angle triangle (${math(
				`\\angle APB = 90^\\circ`,
			)}
				since ${math(`ABCD`)} is a kite)
				${newline}
				Hence ${math(`\\angle ABP = 45^\\circ`)}
				${newParagraph}
				Since the diagonal ${math(`BD`)} bisects ${math(`\\angle ABC,`)} (property of kites),
				${math(`\\angle PBC = 45^\\circ,`)} so ${math(`\\angle ABC = 90^\\circ`)}
				${newParagraph}
				Since ${math(`AB`)} is parallel to the ${math(`y\\textrm{-axis}`)}
				and ${math(`\\angle ABC = 90^\\circ,`)} ${math(`BC`)} is parallel to the
				${math(`x\\textrm{-axis} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		let C: Point;
		(() => {
			const body = `find the coordinates of ${math(`C.`)}`;
			C = new Point(4, B.y);
			let sol = `Since ${math(`AB=BC=4,`)} ${math(`${B}`)} and ${math(`BC`)}
				is parallel to the ${math(`x\\textrm{-axis},`)}
				coordinates of ${math(`${C} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const uplevel = `Given further that the area of the kit is ${math(`28 \\textrm{ units}^2,`)}`;
			const body = `find the coordinates of ${math(`D.`)}`;
			const sol = `Area of triangle ${math(`ABD = 14 \\textrm{ units}^2`)}
				${newline}
				By using ${math(`AB = 4`)} as the base of the triangle,
				${alignStar(`&\\textrm{Horizontal distance from } D \\textrm{ to } x\\textrm{-axis}
					\\\\ &= \\textrm{height of } \\triangle ABD
					\\\\ &= \\frac{14}{\\frac{1}{2} (4)}
					\\\\ &= 7 \\textrm{ units}
				`)}
				Hence the ${math(`x`)}-coordinate of ${math(`D`)} is ${math(`7`)}
				${newParagraph}
				Similarly, vertical distance from ${math(`D`)} to ${math(`BC`)} extended is ${math(
				`7 \\textrm{ units}`,
			)}
				${newline}
				Since the ${math(`y`)}-coordinate of ${math(`C`)} is ${math(`-2,`)}
				the ${math(`y`)}-coordinate of ${math(`D`)} is ${math(`-2 + 7 = 5`)}
				${newParagraph}
				Hence the coordinates of ${math(`D`)} is ${math(`\\left(7, 5\\right) \\; \\blacksquare`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2019 P1 Q8
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(5, 0);
		const C = new Point(0, 10);
		const body = `The diagram shows a kite
			${math(`OABC`)} in which ${math(`OA=AB`)}
			and ${math(`OC=BC.`)} Given that the coordinates
			of ${math(`A`)} and ${math(`C`)}
			are ${math(`${A}`)} and
			${math(`${C}`)} respectively, find
		`;
		let OB: Polynomial;
		let m: Fraction;
		// part a
		(() => {
			const body = `the equation of ${math(`OB,`)}
			`;
			m = A.gradient(C);
			let sol = alignStar(`&\\textrm{Gradient of } AC
				\\\\ &= \\frac{${C.y}-${A.y}}{${C.x}-${A.x}}
				\\\\ &= ${m}
			`);
			const mOB = m.negative().reciprocal();
			OB = new Polynomial(mOB);
			sol += alignStar(`\\textrm{Gradient of OB} &= -\\frac{1}{${m}}
				\\\\ &= ${mOB}
			`);
			sol += `Since the line ${math(`OB`)}
				passes through the origin,
				equation of ${math(`OB`)}
				${alignStar(`y = ${OB} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `the coordinates of ${math(`B.`)}`;
			const AC = A.lineWithGradient(m);
			let sol = `Equation of line AC
				${alignStar(`y - ${C.y} &= ${m}\\left(x-${C.x}\\right)
					\\\\ y &= ${AC}
				`)}
			`;
			const working = new EquationWorking(OB, AC, { aligned: true });
			const xM = working.solveLinear();
			const yM = OB.subIn(xM);
			sol += `At intersection of lines ${math(`OB`)} and
				${math(`AC`)}
			`;
			sol += alignStar(`${working}`);
			const xB = xM.times(2);
			const yB = yM.times(2);
			const B = new Point(xB, yB);
			sol += `When ${math(`x=${xM},`)}
				${alignStar(`y &= ${OB.subInWorking(xM)}
					\\\\ &= ${yM}
				`)}
				Let the coordinates of ${math(`B`)} be ${math(`(x, y)`)}
				and denote the intersection between ${math(`OB`)}
				and ${math(`AC`)} be ${math(`P`)}
				${newParagraph}
				Mid point between ${math(`O`)}
				and ${math(`B`)} is ${math(`P`)}
				${alignStar(`\\frac{x+0}{2} &= ${xM}
					\\\\ x &= ${xB}
					\\\\ \\frac{y+0}{2} &= ${yM}
					\\\\ y &= ${yB}
				`)}
				Coordinates of ${math(`${B} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2018 P2 Q11
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(1, 4, { name: 'A' });
		const B = new Point(9, 8, { name: 'B' });
		const C = new Point(7, 12, { name: 'C' });
		const body = `Three points are given by
			${math(`${A},`)} ${math(`${B}`)} and
			${math(`${C}.`)}
		`;
		// part a
		(() => {
			const body = `Show that angle ${math('ABC')}
				is ${math(`90^\\circ.`)}
			`;
			const m1 = B.gradient(A);
			const m2 = B.gradient(C);
			let sol = alignStar(`&\\textrm{Gradient of } AB
				\\\\ &= \\frac{${B.y}-${A.y}}{${B.x}-${A.x}}
				\\\\ &= ${m1}
			`);
			sol += alignStar(`&\\textrm{Gradient of } BC
				\\\\ &= \\frac{${B.y}-${C.y}}{${B.x}-${C.x}}
				\\\\ &= ${m2}
			`);
			sol += alignStar(`& m_{AB} \\times m_{BC}
				\\\\ &= ${m1} \\times ${m2}
				\\\\ &= -1
			`);
			sol += `Hence ${math(`AB`)}
				is perpendicular to ${math(`BC`)}
				so ${math(`\\angle ABC = 90^\\circ \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Explain why ${math(`A,B`)}
				and ${math(`C`)} lie on a circle with diameter
				${math(`AC.`)}
			`;
			let sol = `Since ${math(`\\angle ABC = 90^\\circ,`)}
				by the right angle in semicircle circle property,
				${math(`AC`)} is a diameter of a circle passing
				through point ${math(`B.`)}
				${newline}
				Hence ${math(`A,B`)}
				and ${math(`C`)} lie on a circle with diameter
				${math(`AC \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let M: Point;
		let circle: Circle;
		// part c
		(() => {
			const body = `Find the equation of the circle.
			`;
			let sol = `Let the center of the circle be denoted by
			${math(`M.`)} ${math(`M`)} is the mid point of ${math(`AC`)}
			`;
			M = A.midPoint(C);
			sol += alignStar(`&\\textrm{Coordinates of } M
				\\\\ & = \\left( \\frac{${A.x} + ${C.x}}{2}, \\frac{${A.y} + ${C.y}}{2} \\right)
				\\\\ &= ${M}
			`);
			const radius = M.distanceTo(A);
			sol += alignStar(`&\\textrm{Radius of circle }
				\\\\ & = \\sqrt{ \\left( ${M.x} - ${A.x} \\right)^2 + \\left( ${M.y} - ${A.y} \\right)^2 }
				\\\\ &= ${radius}
			`);
			circle = new Circle(M, radius);
			sol += `Hence the equation of the circle is
				${display(`${circle} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `Explain why the tangent to the circle
				at ${math(`B`)} is parallel to the
				${math(`y\\textrm{axis}.`)}
			`;
			let sol = alignStar(`&\\textrm{Gradient of } MB
				\\\\ &= \\frac{${B.y}-${M.y}}{${B.x}-${M.x}}
				\\\\ &= 0
			`);
			sol += `Hence the radius ${math(`MB`)} is
				parallel to the ${math(`x\\textrm{-axis}`)}
				${newParagraph}
				By the tangent perpendicular to radius circle property,
				the tangent to the circle at ${math(`B`)}
				is parallel to the ${math(`y\\textrm{-axis} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part e
		(() => {
			const body = `Find the equation of the tangent to
				the circle at ${math(`C.`)}
			`;
			const m1 = M.gradient(C);
			let sol = alignStar(`&\\textrm{Gradient of } MC
				\\\\ &= \\frac{${M.y}-${C.y}}{${M.x}-${C.x}}
				\\\\ &= ${m1}
			`);
			const m2 = m1.reciprocal().negative();
			const tangent = circle.tangentTo(C);
			sol += `Hence the gradient of the tangent at ${math(`C`)} is
				${math(`${m2}`)}
				${newParagraph}
				Equation of tangent at ${math(`C`)}
				${alignStar(`y - ${C.y} &= ${m2} \\left( x - ${C.x} \\right)
					\\\\ y &= ${tangent} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2017 P2 Q9
	//TODO: Diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(-2, 1, { name: 'A' });
		const BUnknown = `B\\left(0,p\\right)`;
		const C = new Point(1, 3, { name: 'C' });
		let B: Point;
		let D: Point;
		const body = `The diagram shows a trapezium
			with vertices ${math(`${A},`)}
			${math(`${BUnknown},`)}
			${math(`${C}`)} and ${math(`D.`)}
			The sides ${math(`AB`)} and
			${math(`DC`)} are parallel and the angle
			${math(`DAB`)} is ${math(`90^\\circ.`)}
			Angle ${math(`ABO`)} is equal to angle ${math(`CBO.`)}
		`;
		// part a
		let mAB: RationalFn;
		(() => {
			const body = `Express the gradients of the lines
				${math(`AB`)} and ${math(`BC`)} in terms of
				${math(`p`)} and hence, or otherwise, show that
				${math(`p=5.`)}
			`;
			mAB = new RationalFn(new Polynomial([1, -1], { variable: 'p' }), 2);
			let sol = alignStar(`&\\textrm{Gradient of } AB
				\\\\ &= \\frac{p - ${A.y}}{0 - (${A.x})}
				\\\\ &= ${mAB} \\; \\blacksquare
			`);
			const mCB = new Polynomial([3, -1], { variable: 'p', ascending: true });
			//const mBC = new RationalFn()
			sol += alignStar(`&\\textrm{Gradient of } CB
				\\\\ &= \\frac{${C.y}-p}{${C.x}-0}
				\\\\ &= ${mCB} \\; \\blacksquare
			`);
			const rhs = new ExpansionTerm(-1, mCB);
			const working = new EquationWorking(mAB, rhs.expand());
			working.crossMultiply();
			const p = working.solveLinear({ variable: 'p' });
			sol += `Since ${math(`\\angle ABO = \\angle CBO,`)}
				${gatherStar(`${mAB} = ${rhs}
					\\\\ ${working} \\; \\blacksquare
				`)}
			`;
			B = new Point(0, p);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the coordinates of the point
				${math(`D.`)}
			`;
			let sol = alignStar(`&\\textrm{Gradient of AB}
				\\\\ &= \\frac{5-1}{2}
				\\\\ &= 2
			`);
			sol += `Let the coordinates of ${math(`D`)}
				be ${math(`(x,y)`)}
				${newParagraph}
				Since ${math(`AB`)}
				and ${math(`DC`)}
				are parallel,
			`;
			sol += alignStar(`m_{AB} &= m_{DC}
				\\\\ 2 &= \\frac{y-${C.y}}{x-${C.x}}
				\\\\ y - 3 &= 2(x-1)
			`);
			const y1 = new Polynomial([1, -1]).times(2).plus(3);
			sol += eqn(`y = ${y1}`, { leqno: true });
			sol += `Since ${math(`\\angle DAB = 90^\\circ,`)}`;
			sol += alignStar(`m_{AB} \\cdot m_{AD} &= -1
				\\\\ 2 \\frac{y-${A.y}}{x-(${A.x})} &= -1
			`);
			sol += eqn(`2(y-1) = -x -2`, { leqno: true });
			sol += `Substituting ${math(`(1)`)} into ${math(`(2),`)}`;
			const rhs = new Polynomial([-1, -2]);
			sol += gatherStar(`2\\left(${y1}-1\\right) = ${rhs}`);
			const working = new EquationWorking(y1.minus(1).times(2), rhs);
			const xD = working.solveLinear();
			sol += gatherStar(`${working}`);
			const yD = y1.subIn(xD);
			sol += `When ${math(`x=${xD},`)}
				${alignStar(`y &= ${y1.subInWorking(xD)}
					\\\\ &= ${yD}
				`)}
			`;
			D = new Point(xD, yD, { name: 'D' });
			sol += `Coordinates of ${math(`\\displaystyle ${D} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the area of the trapezium
				${math(`ABCD.`)}
			`;
			const sol = `${alignStar(`&\\textrm{Area}
				\\\\ ${areaWorking(B, A, D, C)} \\textrm{ units}^2 \\; \\blacksquare
			`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2016 P1 Q8
	//TODO: Diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(-2, 6);
		const lhs = new Expression([2, 'y'], [3, 'x']);
		const rhs = 45;
		const working = new EquationWorking(lhs, rhs);
		const body = `The diagram shows a triangle ${math(`ABC`)}
			in which the point ${math(`A`)}
			is ${math(`${A},`)} the point
			${math(`C`)} lies on the
			${math(`x\\textrm{-axis}`)}
			and angle ${math(`ABC`)}
			is ${math(`90^\\circ.`)}
			The equation of ${math(`BC`)}
			is ${math(`${working}.`)}
		`;
		let B: Point;
		// part a
		(() => {
			const body = `Find the coordinates of ${math(`B.`)}`;
			working.moveTerm(1);
			working.divide(2, { show: false });
			let sol = gatherStar(`${working}`);
			working.clear();
			sol += eqn(`${working}`, { leqno: true });
			const poly = castToPoly(working.rhs);
			const m = poly.leadingCoefficient();
			const m2 = m.negativeReciprocal();
			sol += `Hence the gradient of ${math(`BC`)}
				is ${math(`${m}`)}
				${newParagraph}
				Since ${math(`\\angle ABC = 90^\\circ,`)}
				gradient of ${math(`AB`)} is ${math(`${m2}`)}
			`;
			const AB = A.lineWithGradient(m2);
			sol += `Equation of ${math(`AB`)}
				${display(`y - ${A.y} = ${m2} \\left( x - (${A.x}) \\right)`)}
				${eqn(`y = ${AB}`, { leqno: true })}
			`;
			sol += `At point ${math(`B,`)} equating ${math(`(1)`)} and ${math(`(2),`)}`;
			const workingB = new EquationWorking(poly, AB, { aligned: true });
			workingB.times(6);
			const xB = workingB.solveLinear();
			const yB = poly.subIn(xB);
			sol += alignStar(`${workingB}`);
			sol += `When ${math(`x=${xB},`)}
				${alignStar(`y &= ${poly.subInWorking(xB)}
					\\\\ &= ${yB}
				`)}
			`;
			B = new Point(xB, yB);
			sol += `Coordinates of ${math(`B`)} is ${math(`${B} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`M`)}
				is the midpoint of ${math(`AC`)}
				and that ${math(`ABCD`)}
				is a rectangle, find the coordinates of
				${math(`M`)} and
				${math(`D.`)}
			`;
			const xC = rhs / 3;
			let sol = `At point ${math(`C,`)} ${math(`y=0`)}
				${alignStar(`2(0) + 3x &= 45
					\\\\ x &= ${xC}
					`)}
			`;
			const C = new Point(xC, 0);
			const M = A.midPoint(C);
			sol += alignStar(`&\\textrm{Coordinates of } M
				\\\\ &= \\left( \\frac{${A.x} + ${C.x}}{2}, \\frac{${A.y} + ${C.y}}{2} \\right)
				\\\\ &= ${M} \\; \\blacksquare
			`);
			const xD = M.x.times(2).minus(B.x);
			const yD = M.y.times(2).minus(B.y);
			sol += `Let the coordinates of ${math(`D`)} be ${math(`(x,y)`)}
					${newParagraph}
					The mid point of ${math(`DB`)} is ${math(`M`)}
					${alignStar(`\\frac{x+${B.x}}{2} &= ${M.x}
						\\\\ x &= ${xD}
						\\\\ \\frac{y+${B.y}}{2} &= ${M.y}
						\\\\ y &= ${yD}
					`)}
			`;
			const D = new Point(xD, yD);
			sol += `Coordinates of ${math(`D`)} is ${math(`\\displaystyle ${D} \\; \\blacksquare`)}
			`;

			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2016 P2 Q11
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = -4,
			b = -2,
			c = -95;
		const circle = Circle.fromGeneralForm(a, b, c);
		const body = `The equation of a circle, ${math(`C_1`)} with centre
			${math(`A,`)} is
			${display(`${circle.toGeneralForm().minus(c)} = ${-c}.`)}
		`;
		let A: Point;
		// part a
		(() => {
			const body = `Find the radius of the circle and the coordinates of its centre.`;
			const xPoly = new Polynomial([1, a, 0]);
			const yPoly = new Polynomial([1, b, 0], { variable: 'y' });
			const sqEqn = completeSquare(xPoly).plus(completeSquare(yPoly));
			const working = new EquationWorking(sqEqn, -c);
			working.moveTerm(1);
			A = circle.center;
			const sol =
				gatherStar(`${circle.toGeneralForm().minus(c)} = ${-c}
				\\\\ ${xPoly} + ${yPoly} = ${-c}
				\\\\ ${completeSquare(xPoly)} + ${completeSquare(yPoly)} = ${-c}
				\\\\ ${working}
			`) +
				`Hence the radius of the circle is ${math(
					`${circle.radius} \\textrm{ units} \\; \\blacksquare`,
				)}
					and the coordinates of ${math(`A`)} is ${math(`${circle.center} \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let P: Point;
		// part b
		(() => {
			P = new Point(10, 7, { name: 'P' });
			const body = `Show that the point ${math(`${P}`)}
				lies on ${math(`C_1.`)}`;
			let sol = `Substituting ${math(`x=${P.x},`)} ${math(`y=${P.y}`)}
				into the equation of ${math(`C_1,`)}
			`;
			const rhs = P.x.square().plus(P.y.square()).minus(P.x.times(4)).minus(P.y.times(2));
			sol += alignStar(`& \\textrm{LHS}
				\\\\ &= (10)^2 + (7)^2 - 4(10) - 2(7)
				\\\\ &= ${rhs}
				\\\\ &= \\textrm{RHS}
			`);
			sol += `Hence the point ${math(`${P}`)}
				lies on ${math(`C_1 \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let tangent: Polynomial;
		// part c
		(() => {
			const body = `Find the equation of the tangent to ${math(`C_1`)}
				at ${math(`P.`)}
			`;
			tangent = circle.tangentTo(P);
			let sol = alignStar(`&\\textrm{Gradient of } AP
				\\\\ &= \\frac{${P.y}-${circle.center.y}}{${P.x}-${circle.center.x}}
				\\\\ &= ${P.gradient(A)}
			`);
			sol += `Hence the gradient of the tangent is ${math(`${tangent.leadingCoefficient()}`)}`;
			sol += `${newParagraph} Equation of tangent at ${math(`P`)}
				${alignStar(`y - ${P.y} &= ${tangent.leadingCoefficient()} \\left( x - ${P.x} \\right)
					\\\\ y &= ${tangent} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const uplevel = `A second circle, ${math(`C_2,`)}
				has diameter ${math(`AP.`)}
			`;
			const M = A.midPoint(P);
			const C2 = new Circle(M, A);
			const body = `Find the equation of ${math(`C_2.`)}`;
			let sol = alignStar(`&\\textrm{Coordinates of center of } C_2
				\\\\ &= \\left( \\frac{${A.x} + ${P.x}}{2}, \\frac{${A.y} + ${P.y}}{2} \\right)
				\\\\ &= ${M}
			`);
			sol += `The radius of ${math(`C_2 = \\frac{${circle.radius}}{2} = ${C2.radius}`)}`;
			sol += `${newParagraph} Hence the equation of ${math(`C_2`)}
				${display(`${C2} \\; \\blacksquare`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part e
		(() => {
			const body = `Find the equation of the tangent to
				${math(`C_2`)} at ${math(`P.`)}
			`;
			const sol = `The equation of the tangent to ${math(`C_2`)}
				at ${math(`P`)} is the same as the tangent to ${math(`C_1`)}
				at ${math(`P`)}
				${newParagraph}
				Hence the equation of the tangent to ${math(`C_2`)}
				at ${math(`P`)} is ${math(`y = ${tangent} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 8: 2014 P1 Q7
	//TODO: Diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const OA = new Polynomial(2);
		const OC = new Polynomial(new Fraction(1, 2));
		const body = `The diagram shows a trapezium
			${math(`OABC`)} in which ${math(`OA`)}
			is parallel to ${math(`CB`)}
			and ${math(`O`)} is the origin.
			The side ${math(`AB`)}
			is parallel to the ${math(`x\\textrm{-axis}`)}
			and the diagonal ${math(`AC`)} is parallel to the
			${math(`y\\textrm{-axis}.`)} The side ${math(`OA`)}
			has equation ${math(`y=${OA}`)} and the side
			${math(`OC`)} has equation ${math(`\\displaystyle y=${OC}.`)}
			The ${math(`x`)}-coordinate of ${math(`A`)} is ${math(`h.`)}
		`;
		const xA = new Polynomial(1, { variable: 'h' });
		let yA: Polynomial;
		let xB: Polynomial;
		let yB: Polynomial;
		const xC = new Polynomial(1, { variable: 'h' });
		let yC: Polynomial;
		// part a
		(() => {
			const body = `Express the coordinates of ${math(`A,B`)}
				and ${math(`C`)} in terms of ${math(`h.`)}
			`;
			let sol = `Substituting ${math(`x=h`)} into the equations of ${math(`OA`)}
				and ${math(`OC,`)}
			`;
			sol += alignStar(`y_A &= ${OA.replaceXWith('h')}
				\\\\ y_C &= ${OC.replaceXWith('h')}
			`);
			yA = OA.replaceXWith('h');
			yC = OC.replaceXWith('h');
			yB = yA;
			const A = `\\left( h, ${yA} \\right)`;
			const C = `\\left( h, ${yC} \\right)`;
			sol += `Coordinates of ${math(`A`)} is ${math(`\\displaystyle ${A} \\; \\blacksquare`)}
				${newParagraph}
				Coordinates of ${math(`C`)} is ${math(`\\displaystyle ${C} \\; \\blacksquare`)}
			`;
			sol += `${newParagraph} Since ${math(`CB`)} is parallel to ${math(`OA,`)}
				gradient of ${math(`CB`)} is ${math(`\\displaystyle ${OA.leadingCoefficient()}`)}
			`;
			sol += `${newParagraph}
				Equation of ${math(`CB`)}
				${alignStar(`y - ${yC} &= ${OA.leadingCoefficient()} \\left( x - h \\right)
					\\\\ y &= 2x -\\frac{3}{2}h
				`)}
				Since ${math(`AB`)} is parallel to ${math(`x\\textrm{-axis},`)}
				the ${math(`y`)}-coordinate of ${math(`B`)} is ${math(`${yA}`)}
				${newParagraph}
				Substituting ${math(`y=${yA}`)} into the equation of ${math(`CB,`)}
			`;
			const lhs = new Expression([2, 'x'], [new Fraction(-3, 2), 'h']);
			const rhs = new Expression([2, 'h']);
			const working = new EquationWorking(lhs, rhs);
			working.moveTerm(1);
			working.divide(2);
			sol += gatherStar(`${working}`);
			sol += `Hence the coordinates of ${math(`B`)} are ${math(
				`\\displaystyle \\left( ${working.rhs}, ${rhs} \\right) \\; \\blacksquare`,
			)}`;
			xB = castToPoly(working.rhs, { variable: 'h' });
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const h = 4;
			const O = new Point(0, 0);
			const A = new Point(xA.subIn(h), yA.subIn(h));
			const B = new Point(xB.subIn(h), yB.subIn(h));
			const C = new Point(xC.subIn(h), yC.subIn(h));
			const body = `In the case where ${math(`h=${h},`)}
				find the area of the trapezium
				${math(`OABC.`)}
			`;
			let sol = alignStar(`& \\textrm{Area of } OABC
				\\\\ ${areaWorking(O, C, B, A)} \\textrm{ units}^2 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 9: 2013 P1 Q10
	//TODO: Diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const L1LHS = new Expression([4, 'y'], 'x');
		const L1RHS = 48;
		const L2LHS = new Expression([3, 'y']);
		const L2RHS = new Polynomial([4, -40]);
		const body = `The diagram shows lines ${math(`L_1`)}
			and ${math(`L_2`)} intersecting at
			${math(`A.`)} Line ${math(`L_1`)} has equation
			${math(`${L1LHS} = ${L1RHS}`)} and ${math(`L_2`)}
			has equation ${math(`${L2LHS} = ${L2RHS}.`)}
			The point ${math(`M`)} is the midpoint
			of ${math(`OA.`)}
			The line ${math(`L_1`)} intersects
			the ${math(`y\\textrm{-axis}`)}
			at ${math(`B`)} and the line ${math(`L_2`)}
			intersects the ${math(`x\\textrm{-axis}`)}
			at ${math(`C.`)}
		`;
		let A: Point;
		let C: Point;
		// part a
		(() => {
			const body = `Show that angle ${math(`OMC`)}
				is ${math(`90^\\circ.`)}
			`;
			const CWorking = new EquationWorking(0, L2RHS);
			const xC = CWorking.solveLinear();
			C = new Point(xC, 0, { name: 'C' });
			let sol = `For point ${math(`C,`)} ${math(`y=0`)}
				${alignStar(`3(0) &= 4x - 40
					\\\\ x &= ${xC}
				`)}
			`;
			sol += `Coordinates of ${math(`${C}`)}`;
			sol += `${newParagraph}Considering equations of ${math(`L_1`)} and ${math(`L_2,`)}`;
			const L1Working = new EquationWorking(L1LHS, L1RHS);
			sol += gatherStar(`${L1Working}`);
			L1Working.moveTerm(0, { show: false });
			L1Working.clear();
			sol += eqn(`${L1Working}`, { leqno: true });
			sol += eqn(`${L2LHS} = ${L2RHS}`, { leqno: true });
			sol += `Substituting ${math(`(1)`)} into ${math(`(2),`)}`;
			const rhsWorking = new Expression(new ExpansionTerm(4, L1Working.rhs), -40);
			const working = new EquationWorking(L2LHS, rhsWorking, { aligned: true });
			working.expand();
			const yA = working.solveLinear({ variable: 'y' });
			sol += alignStar(`${working}`);
			const xPoly = castToPoly(L1Working.rhs, { variable: 'y' });
			const xA = xPoly.subIn(yA);
			sol += `When ${math(`y=${yA},`)}
				${alignStar(`x &= ${xPoly.subInWorking(yA)}
					\\\\ &= ${xA}
				`)}
			`;
			A = new Point(xA, yA, { name: 'A' });
			sol += `Coordinates of ${math(`${A}`)}`;
			const O = new Point(0, 0, { name: 'O' });
			const M = A.midPoint(O);
			sol += `${alignStar(`&\\textrm{Coordinates of } M
					\\\\ &= \\left( \\frac{${A.x} + ${O.x}}{2}, \\frac{${A.y} + ${O.y}}{2} \\right)
					\\\\ &= ${M}
				`)}
			`;
			sol += alignStar(`&\\textrm{Gradient of } OM
				\\\\ &= \\frac{${A.y}-${O.y}}{${A.x}-${O.x}}
				\\\\ &= ${A.gradient(O)}
			`);
			sol += alignStar(`&\\textrm{Gradient of } MC
				\\\\ &= \\frac{${C.y}-${M.y}}{${C.x}-${M.x}}
				\\\\ &= ${C.gradient(M)}
			`);
			sol += alignStar(`& m_{OM} \\times m_{MC}
					\\\\ &= ${A.gradient(O)} \\times ${C.gradient(M)}
					\\\\ &= -1
			`);
			sol += `Hence ${math(`OM \\perp MC`)}
					so ${math(`\\angle OMC = 90^\\circ \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the ratio of the area of triangle
				${math(`OAB`)} to the area of triangle ${math(`OAC.`)}
			`;
			let sol = `At point ${math(`B,`)} ${math(`x=0`)}`;
			sol += alignStar(`4y &= 48
				\\\\ y &= 12
			`);
			const B = new Point(0, 12, { name: 'B' });
			sol += `Coordinates of ${math(`${B}`)}`;
			const ratio = B.y.times(A.x).divide(C.x.times(A.y));
			sol += alignStar(`&\\frac{\\textrm{Area of } OAB}{\\textrm{Area of } OAC}
				\\\\ &= \\frac{\\frac{1}{2} y_B \\cdot x_A}{\\frac{1}{2} x_c \\cdot y_A}
				\\\\ &= \\frac{${B.y} \\cdot ${A.x}}{${C.x} \\cdot ${A.y}}
				\\\\ &= ${ratio}
			`);
			sol += `Hence the ratio of the area of triangle
				${math(`OAB`)} to the area of triangle ${math(`OAC`)}
				is ${math(`${ratio.num} : ${ratio.den} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2013 P2 Q10
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 6,
			b = -4,
			c = -12;
		const circle = Circle.fromGeneralForm(a, b, c);
		const body = `A circle has the equation
			${display(`${circle.toGeneralForm()} = 0.`)}
		`;
		// part a
		(() => {
			const body = `Find the the coordinates of its centre and the radius of the circle.`;
			const xPoly = new Polynomial([1, a, 0]);
			const yPoly = new Polynomial([1, b, 0], { variable: 'y' });
			const sqEqn = completeSquare(xPoly)
				.plus(completeSquare(yPoly))
				.plus(c)
				.changeOrder([0, 2, 1]);
			const working = new EquationWorking(sqEqn, 0);
			working.moveTerm(2);
			const sol =
				gatherStar(`${circle.toGeneralForm()} = 0
				\\\\ ${xPoly} + ${yPoly} ${c} = 0
				\\\\ ${completeSquare(xPoly)} + ${completeSquare(yPoly)} ${c} = 0
				\\\\ ${working}
			`) +
				`Hence the radius of the circle is ${math(
					`${circle.radius} \\textrm{ units} \\; \\blacksquare`,
				)}
					and the coordinates of its centre is ${math(`${circle.center} \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let P: Point;
		let C: Point;
		let tangent: Polynomial;
		// part b
		(() => {
			P = new Point(-7, -1, { name: 'P' });
			const eqn = new Expression([3, 'y'], [4, 'x'], 31);
			const body = `Show that the equation of the tangent
				to the circle at the point
				${math(`${P}`)} is 
				${display(`${eqn} = 0.`)}`;
			C = circle.center;
			let sol = `We will denote the center of the circle, ${math(`${circle.center}`)} by ${math(
				`C`,
			)}`;
			sol += `${newParagraph}Gradient of ${math(`CP`)}
				${alignStar(`&= \\frac{${P.y}-${C.y}}{${P.x}-(${C.x})}
					\\\\ &= ${P.gradient(C)}
				`)}
			`;
			const mTangent = P.gradient(C).negativeReciprocal();
			sol += `Hence the gradient of the tangent is ${math(`${mTangent}`)}`;
			tangent = circle.tangentTo(P);
			sol += `${newParagraph}Equation of tangent at ${math(`P`)}
				${alignStar(`y - (${P.y}) &= ${mTangent} \\left( x - (${P.x}) \\right)
					\\\\ y &= ${tangent} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let tangent2: Polynomial;
		// part c
		(() => {
			const uplevel = `The point ${math(`Q,`)}
				which lies on the circle, is the same distance from
				the ${math(`y\\textrm{-axis}`)}
				as the point ${math(`P.`)}
			`;
			const body = `Find the equation of the tangent to 
				the circle at
				${math(`Q.`)}
			`;
			const xQ = P.x;
			const yQ = C.y.times(2).minus(P.y);
			const Q = new Point(xQ, yQ, { name: 'Q' });
			tangent2 = circle.tangentTo(Q);
			let sol = `Since ${math(`Q`)} is the same
				distance from the ${math(`y\\textrm{-axis}`)}
				as ${math(`P,`)} ${math(`x_Q = x_P = ${xQ}`)}
			`;
			sol += `${newParagraph}
				By considering the symmetry about the center,
			`;
			sol += alignStar(`\\frac{y_P + y_Q}{2} = x_C
				\\\\ \\frac{${P.y} + y_Q}{2} = ${C.y}
				\\\\ x_Q = ${Q.y}
			`);
			sol += `Coordinates of ${math(`${Q}`)}`;
			sol += alignStar(`&\\textrm{Gradient of } CQ
				\\\\ &= \\frac{${Q.y}-${C.y}}{${Q.x}-(${C.x})}
				\\\\ &= ${Q.gradient(C)}
			`);
			const mTangent = Q.gradient(C).negativeReciprocal();
			sol += `Hence the gradient of the tangent is ${math(`${mTangent}`)}`;
			sol += `${newParagraph}Equation of tangent at ${math(`Q`)}
				${alignStar(`y - ${Q.y} &= ${mTangent} \\left( x - (${Q.x}) \\right)
					\\\\ y &= ${tangent} \\; \\blacksquare
				`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const uplevel = `The tangents to the circle at ${math(`P`)}
				and ${math(`Q`)} intersect at the point
				${math(`R.`)}
			`;
			const body = `Find the coordinates of ${math(`R.`)}`;
			const working = new EquationWorking(tangent, tangent2, { aligned: true });
			const xR = working.solveLinear();
			const yR = tangent.subIn(xR);
			let sol = `Equating the equations of the tangents,`;
			sol += alignStar(`${working}`);
			sol += `Substituting ${math(`x=${xR}`)} into the equation of the tangent at ${math(`P,`)}
				${alignStar(`y &= ${tangent.subInWorking(xR)}
					\\\\ &= ${yR}
				`)}
			`;
			const R = new Point(xR, yR, { name: 'R' });
			sol += `Coordinates of ${math(`${R} \\; \\blacksquare`)}`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2020 P2 Q9
	(() => {
		//TODO: Diagram
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Point(-5, 0, { name: 'A' });
		const B = new Point(7, 5, { name: 'B' });
		const E = new Point(5, 6, { name: 'E' });
		const perimeter = 46;
		const body = `The diagram shows a parallelogram with
			vertices ${math(`${A},`)} ${math(`${B},`)}
			${math(`C`)} and ${math(`D.`)}
			The point ${math(`${E}`)} lies on the diagonal
			${math(`BD`)} of the parallelogram.
			The perimeter of the parallelogram is
			${math(`${perimeter} \\textrm{ units}.`)}
		`;
		// part a
		let poly: Polynomial;
		let rhs: number;
		let BD: Polynomial;
		(() => {
			poly = new Polynomial([5, 6, 0]);
			rhs = 11;
			const body = `Show that the
				${math(`x`)}-coordinate of ${math(`D`)}
				satisfies the equation
				${display(`${poly} = ${rhs}.`)}
			`;
			const mBE = B.gradient(E);
			let sol = alignStar(`&\\textrm{Gradient of } BE
				\\\\ &= \\frac{${B.y}-${E.y}}{${B.x}-${E.x}}
				\\\\ &= ${mBE}
			`);
			BD = B.lineTo(E);
			sol += `Equation of ${math(`BE`)}
				${alignStar(`y - ${B.y} &= ${mBE} \\left( x - ${B.x} \\right)
					\\\\ y &= ${BD}
				`)}
			`;
			sol += `Since ${math(`D`)} lies on the line ${math(`BE`)} extended,
				we will let the coordinates of ${math(`D`)} be ${math(`\\left(x, ${BD}\\right)`)}
			`;
			const lAB = A.distanceTo(B).cast.toFraction();
			sol += alignStar(`&\\textrm{Length of } AB
				\\\\ &= \\sqrt{\\left( ${B.x} - (${A.x}) \\right)^2 + \\left( ${B.y} - ${A.y} \\right)^2}
				\\\\ &= ${lAB}
			`);
			const t1 = new Polynomial([1, A.x.negative()]);
			const t2 = BD;
			const rootAD = t1.square().plus(t2.square());
			sol += alignStar(`&\\textrm{Length of } AD
				\\\\ &= \\sqrt{\\left( x - (${A.x}) \\right)^2 + \\left( ${BD} - ${A.y} \\right)^2}
				\\\\ &= \\sqrt{\\left(${t1}\\right)^2 + \\left(${t2}\\right)^2}
				\\\\ &= \\sqrt{${t1.square()} + ${t2.square()}}
				\\\\ &= \\sqrt{${rootAD}}
			`);
			const halfPerimeter = perimeter / 2;
			sol += `Since the perimeter of the parallelogram is ${math(
				`${perimeter} \\textrm{ units},`,
			)}`;
			const working = new EquationWorking(rootAD.times(4), 400);
			working.moveTerm(2);
			sol += gatherStar(`${lAB} + \\sqrt{${rootAD}} = \\frac{${perimeter}}{2}
				\\\\ \\sqrt{${rootAD}} = ${halfPerimeter} - ${lAB}
				\\\\ ${rootAD} = \\left( ${new Fraction(halfPerimeter).minus(lAB)} \\right)^2
				\\\\ ${working} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let D: Point;
		// part b
		(() => {
			const body = `Determine the coordinates of ${math(`D,`)}
				explaining why the diagram is necessary.
			`;
			const working = new EquationWorking(poly, rhs, { aligned: true });
			working.rhsZero();
			const [xD1, xD2] = working.factorizeQuadratic();
			let sol = alignStar(`${working}`);
			sol += display(`x = ${xD1} \\; \\textrm{ or } \\; x = ${xD2}`);
			const xD = xD2;
			sol += `The diagram is necessary to determine which value of ${math(
				`x`,
			)} we should take ${math(`\\blacksquare`)}
				${newline}
				In particular, the diagram shows that the ${math(`x`)}-coordinate of ${math(`D`)}
				is positive so ${math(`x=${xD}`)}
			`;
			sol += `${newParagraph}
				Substituting ${math(`x=${xD}`)} into the equation of ${math(`BE,`)}
				${alignStar(`y &= ${BD.subInWorking(xD)}
					\\\\ &= ${BD.subIn(xD)}
				`)}
			`;
			D = new Point(xD, BD.subIn(xD), { name: 'D' });
			sol += `Coordinates of ${math(`${D} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the coordinates of ${math(`C.`)}`;
			let sol = `Let the midpoint of ${math(`BD`)} be denoted by ${math(`X`)}`;
			const X = B.midPoint(D);
			sol += alignStar(`&\\textrm{Coordinates of } X
				\\\\ &= \\left( \\frac{${B.x} + ${D.x}}{2}, \\frac{${B.y} + ${D.y}}{2} \\right)
				\\\\ &= ${X} 
			`);
			sol += `Let the coordinates of ${math(`C`)}
				be ${math(`\\left( x, ${X.y} \\right)`)}
				${newParagraph}
				Since ${math(`X`)} is also the midpoint of ${math(`AC,`)}
			`;
			const xC = X.x.times(2).minus(A.x);
			const yC = X.y.times(2).minus(A.y);
			sol += alignStar(`\\frac{x_C + x_A}{2} &= x_M
				\\\\ \\frac{x_C + (${A.x})}{2} &= ${X.x}
				\\\\ x_C &= ${xC}
			`);
			sol += alignStar(`\\frac{y_C + y_A}{2} &= y_M
				\\\\ \\frac{y_C + ${A.y}}{2} &= ${X.y}
				\\\\ y_C &= ${yC}
			`);
			const C = new Point(xC, yC, { name: 'C' });
			sol += `Coordinates of ${math(`${C} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 12: 2019 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const pt = new Point(5, 5);
		const lhs = new Term(3, 'y');
		const rhs = new Polynomial([1, 2]);
		const body = `A tangent to a circle at ${math(`${pt}`)}
			passes through the origin. The line with equation
			${math(`${lhs}=${rhs}`)} is a normal to the circle.
		`;
		let circle: Circle;
		// part a
		(() => {
			const body = `Showing all your working, find the equation
				of the circle.
			`;
			const O = new Point(0, 0);
			const m = pt.gradient(O);
			const m1 = m.negativeReciprocal();
			let sol = `Let the point ${math(`${pt}`)} be denoted by ${math(`A`)}`;
			sol += alignStar(`&\\textrm{Gradient of } OA
				\\\\ &= \\frac{${pt.y}-${O.y}}{${pt.x}-${O.x}}
				\\\\ &= ${m}
			`);
			sol += `Hence the gradient of the normal at ${math(`A`)} is ${math(`${m1}`)}`;
			sol += `${newParagraph}Equation of normal at ${math(`A`)}`;
			const normal1 = pt.lineWithGradient(m1);
			sol += display(`y - ${pt.y} = ${m1} \\left( x - ${pt.x} \\right)`);
			sol += eqn(`y = ${normal1}`, { leqno: true });
			sol += `The equation of another normal is given to be ${math(`${lhs} = ${rhs}`)}`;
			const normal2 = rhs.divide(3);
			sol += eqn(`y = ${normal2}`, { leqno: true });
			sol += `The centre of the circle is the intersection of the two normals
				${newParagraph}
				Equating ${math(`(1)`)} and ${math(`(2),`)}
			`;
			const working = new EquationWorking(normal1, normal2, { aligned: true });
			const x = working.solveLinear();
			sol += alignStar(`${working}`);
			const y = normal1.subIn(x);
			sol += `Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= ${normal1.subInWorking(x)}
					\\\\ &= ${y}
				`)}
			`;
			const C = new Point(x, y, { name: 'C' });
			sol += `Let the centre of the circle be denoted by ${math(`${C}`)}`;
			circle = new Circle(C, pt);
			const r2 = circle.radius.square();
			sol += alignStar(`&\\textrm{Radius of circle}
				\\\\ &= \\textrm{Length of } AC
				\\\\ &= \\sqrt{\\left( ${C.x} - ${pt.x} \\right)^2 + \\left( ${C.y} - ${pt.y} \\right)^2}
				\\\\ &= \\sqrt{${r2}}
			`);
			sol += `Equation of circle`;
			sol += display(`${circle} \\; \\blacksquare`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the coordinates of the point on the circle
				which is nearest to the ${math(`x\\textrm{-axis}.`)}
			`;
			const sol = `The point on the circle nearest to the ${math(`x\\textrm{-axis}`)}
				is the lowest point on the circle, which is below the centre by a distance equal
				to the radius of the circle
				${newParagraph}
				Hence the coordinates of this point
				${alignStar(`&= \\left( ${circle.center.x}, ${
					circle.center.y
				} - \\sqrt{${circle.radius.square()}} \\right)
					\\\\ &= \\left( ${circle.center.x}, ${circle.center.y} - ${circle.radius} \\right) \\; \\blacksquare
				`)}
			`;

			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 13: 2016 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 8,
			b = -24,
			c = 96;
		const circle = Circle.fromGeneralForm(a, b, c);
		const lhs = new Expression([3, 'y'], [4, 'x']);
		const rhs = 'k';
		const body = `The equation of the normal to a circle
			${display(`${circle.toGeneralForm()} = 0`)}
			at the point ${math(`R`)}
			is ${math(`${lhs}=${rhs}.`)}
		`;
		let k: Fraction;
		// part a
		(() => {
			const body = `Find the value of the constant ${math(`k.`)}`;
			const xPoly = new Polynomial([1, a, 0]);
			const yPoly = new Polynomial([1, b, 0], { variable: 'y' });
			const sqEqn = completeSquare(xPoly)
				.plus(completeSquare(yPoly))
				.plus(c)
				.changeOrder([0, 2, 1]);
			const working = new EquationWorking(sqEqn, 0);
			working.moveTerm(2);
			let sol =
				gatherStar(`${circle.toGeneralForm()} = 0
				\\\\ ${xPoly} + ${yPoly} + ${c} = 0
				\\\\ ${completeSquare(xPoly)} + ${completeSquare(yPoly)} + ${c} = 0
				\\\\ ${working}
			`) +
				`Hence the coordinates of its centre is ${math(`${circle.center}`)}
				${newParagraph}
				The centre lies on the normal, so substituting ${math(`x=${circle.center.x}`)}
				and ${math(`y=${circle.center.y}`)} into the equation of the normal,
			`;
			const x = circle.center.x;
			const y = circle.center.y;
			k = lhs.subIn({ x, y }).cast.toFraction();
			sol += alignStar(`k &= 3(${y}) + 4(${x})
				\\\\ &= ${k} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const uplevel = `The normal to the circle at ${math(`R`)}
				meets the ${math(`x\\textrm{-axis}`)}
				at the point ${math(`S.`)}
			`;
			const body = `Given that ${math(`R`)} lies between
				${math(`S`)} and the centre of the circle,
				find the length of ${math(`RS.`)}
			`;
			const xS = k.divide(4);
			let sol = `Substituting ${math(`y=0`)} into the equation of the normal,
				${alignStar(`3(0) + 4x_S &= ${k}
					\\\\ x_S &= ${xS}
				`)}
			`;
			const S = new Point(xS, 0, { name: 'S' });
			const C = new Point(circle.center.x, circle.center.y, { name: 'C' });
			sol += `Coordinates of ${math(`${S}`)}
				${newParagraph}
				Denoting the centre of the circle by ${math(`${C},`)}
			`;
			const length = S.distanceTo(circle.center);
			sol += alignStar(`&\\textrm{Length of } CS
				\\\\ &= \\sqrt{\\left( ${S.x} - (${circle.center.x}) \\right)^2 + \\left( ${S.y} - ${circle.center.y} \\right)^2}
				\\\\ &= ${length}
			`);
			sol += `From the equation of the circle in (i), radius of the circle is ${math(
				`8 \\textrm{ units}`,
			)}
				${newline}
				Since ${math(`R`)} lies between ${math(`S`)} and ${math(`C,`)}
			`;
			sol += alignStar(`&\\textrm{Length of } RS
				\\\\ &= \\textrm{Length of } CS - \\textrm{radius}
				\\\\ &= ${length} - ${circle.radius}
				\\\\ &= ${length.cast
					.toFraction()
					.minus(circle.radius.cast.toFraction())} \\textrm{ units} \\; \\blacksquare
			`);
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 14: 2016 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const body = `The positive ${math(`x\\textrm{-}`)}
			and ${math(`y\\textrm{-}`)}axes are tangents to a circle
			${math(`C.`)}
		`;
		// part a
		(() => {
			const body = `What can be deduced about the coordinates of the centre of ${math(`C?`)}`;
			let sol = `The ${math(`x`)}- and ${math(`y`)}-coordinates
				of the centre are the same ${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let circle: Circle;
		let pt: Point;
		// part b
		(() => {
			pt = new Point(9, 8);
			const uplevel = `The line ${math(`T`)} is a tangent
				to ${math(`C`)} at the point
				${math(`${pt}`)} on the circle. Given that the centre
				of ${math(`C`)} lies below and to the left
				of ${math(`${pt},`)} find
			`;
			const body = `the equation of ${math(`C,`)}`;
			let sol = `Let the centre of the circle be denoted by ${math(`M (x, x)`)}
				${newline}
				We observe that the radius of the circle is also ${math(`x`)}
				${newline}
				By considering the length of ${math(`MT,`)}
			`;
			const t1 = new Polynomial([1, pt.x.negative()]);
			const t2 = new Polynomial([1, pt.y.negative()]);
			const working = new EquationWorking(
				t1.square().plus(t2.square()),
				new Polynomial([1, 0, 0]),
				{ aligned: true },
			);
			working.rhsZero();
			const [x1, x2] = working.factorizeQuadratic();
			sol += alignStar(`\\sqrt{\\left(${t1}\\right)^2 + \\left(${t2}\\right)^2} &= x
				\\\\ ${t1.square()} + ${t2.square()} &= x^2
				\\\\ ${working}
			`);
			sol += display(`x=${x1} \\; \\textrm{ or } \\; x=${x2}`);
			circle = new Circle(new Point(x1, x1), pt);
			sol += `Since the centre of ${math(`C`)} lies to the left of ${math(`${pt},`)} ${math(
				`x=${x1}`,
			)}
				${newline}
				Hence the equation of ${math(`C`)} is
				${display(`${circle} \\; \\blacksquare`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `the equation of ${math(`T.`)}`;
			const m1 = circle.center.gradient(pt);
			const m2 = m1.negativeReciprocal();
			let sol = alignStar(`&\\textrm{Gradient of } MT
				\\\\ &= \\frac{${pt.y}-${circle.center.y}}{${pt.x}-${circle.center.x}}
				\\\\ &= ${pt.gradient(circle.center)}
			`);
			sol += `Hence the gradient of ${math(`T`)} is ${math(`${m2}`)}`;
			sol += `${newParagraph}Equation of ${math(`T`)}
				${alignStar(`y - ${pt.y} &= ${m2} \\left( x - ${pt.x} \\right)
					\\\\ y &= ${pt.lineWithGradient(m2)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 15: 2014 P2 Q10
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 4,
			b = -6,
			rhs = 36;
		const C1 = Circle.fromGeneralForm(a, b, -rhs);
		const body = `A circle, ${math(`C_1,`)}
			has equation
			${display(`${C1.toGeneralForm().plus(rhs)} = ${rhs}.`)}
		`;
		// part a
		(() => {
			const body = `Find the radius and the coordinates of the centre of ${math(`C_1.`)}`;
			const xPoly = new Polynomial([1, a, 0]);
			const yPoly = new Polynomial([1, b, 0], { variable: 'y' });
			const sqEqn = completeSquare(xPoly).plus(completeSquare(yPoly)).changeOrder([0, 2, 1]);
			const working = new EquationWorking(sqEqn, rhs);
			working.moveTerm(2);
			const sol =
				gatherStar(`${C1.toGeneralForm().plus(rhs)} = ${rhs}
				\\\\ ${xPoly} + ${yPoly} = ${rhs}
				\\\\ ${completeSquare(xPoly)} + ${completeSquare(yPoly)} = ${rhs}
				\\\\ ${working}
			`) +
				`Hence the radius of the ${math(`C_1`)} is ${math(
					`${C1.radius} \\textrm{ units} \\; \\blacksquare`,
				)}
					and the coordinates of its centre is ${math(`${C1.center} \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		const A = new Point(-5, 5);
		let B: Point;
		// part b
		(() => {
			const lhs = new Term(3, 'y');
			const rhs = new Polynomial([4, -15]);
			const uplevel = `A second circle, ${math(`C_2,`)}
				has a diameter ${math(`AB.`)} The point ${math(`A`)}
				has coordinates ${math(`${A}`)}
				and the equation of the tangent to ${math(`C_2`)}
				at ${math(`B`)} is
				${math(`${lhs} = ${rhs}`)}
			`;
			const body = `Find the equation of the diameter ${math(`AB`)}
				and hence the coordinates of ${math(`B.`)}
			`;
			const tangent = rhs.divide(3);
			const m1 = tangent.leadingCoefficient();
			const m2 = m1.negativeReciprocal();
			let sol = `Rearranging the equation of the tangent at ${math(`B,`)}
				${alignStar(`${lhs} &= ${rhs}
					\\\\ y &= ${tangent}
				`)}
				Hence the gradient of the tangent is ${math(`${m1}`)}
				${newline}
				The gradient of ${math(`AB`)} is ${math(`${m2}`)}
			`;
			const AB = A.lineWithGradient(m2);
			sol += `${newParagraph}Equation of ${math(`AB`)}
				${alignStar(`y - ${A.y} &= ${m2} \\left( x - (${A.x}) \\right)
					\\\\ y &= ${AB} \\; \\blacksquare
				`)}
			`;
			const working = new EquationWorking(tangent, AB, { aligned: true });
			const xB = working.solveLinear();
			sol += `Equating the tangent at ${math(`B`)} and the diameter ${math(`AB,`)}
				${alignStar(`${working}`)}
			`;
			const yB = tangent.subIn(xB);
			B = new Point(xB, yB, { name: 'B' });
			sol += `Substituting ${math(`x=${xB}`)} into the equation of the tangent at ${math(`B,`)}
				${alignStar(`y &= ${tangent.subInWorking(xB)}
					\\\\ &= ${yB}
				`)}
			`;
			sol += `Coordinates of ${math(`${B} \\; \\blacksquare`)}`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		let C2: Circle;
		// part c
		(() => {
			const body = `Find the radius and the coordinates of the centre of ${math(`C_2.`)}`;
			let sol = `Let ${math(`M`)} denote the centre of ${math(
				`C_2,`,
			)} which is the midpoint of ${math(`AB`)}`;
			const M = A.midPoint(B);
			sol += alignStar(`&\\textrm{Coordinates of } M
				\\\\ &= \\left( \\frac{${A.x} + ${B.x}}{2}, \\frac{${A.y} + (${B.y})}{2} \\right)
				\\\\ &= ${M} \\; \\blacksquare
			`);
			C2 = new Circle(M, A);
			sol += alignStar(`&\\textrm{Radius of } C_2
				\\\\ &= \\textrm{Length of } AM
				\\\\ &= \\sqrt{\\left( ${A.x} - (${M.x}) \\right)^2 + \\left( ${A.y} - ${M.y} \\right)^2}
				\\\\ &= ${C2.radius} \\textrm{ units} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const pt = new Point(4, 6);
			const body = `Explain why the point ${math(`${pt}`)}
				lies within only one of the circles ${math(`C_1`)}
				and ${math(`C_2.`)}
			`;
			let sol = alignStar(`&\\textrm{Distance from } ${pt} \\textrm{ to centre of } C_1
				\\\\ &= \\sqrt{\\left( ${pt.x} - (${C1.center.x}) \\right)^2 + \\left( ${pt.y} - ${
				C1.center.y
			} \\right)^2}
				\\\\ &= \\sqrt{${pt.distanceTo(C1.center).square()}}
				\\\\ &< ${C1.radius}
			`);
			sol += `Hence ${math(`${pt}`)} lies within ${math(`C_1`)}`;
			sol += alignStar(`&\\textrm{Distance from } ${pt} \\textrm{ to centre of } C_2
				\\\\ &= \\sqrt{\\left( ${pt.x} - (${C2.center.x}) \\right)^2 + \\left( ${pt.y} - ${
				C2.center.y
			} \\right)^2}
				\\\\ &= \\sqrt{${pt.distanceTo(C2.center).square()}}
				\\\\ &> ${C2.radius}
			`);
			sol += `Hence ${math(`${pt}`)} lies outside ${math(`C_2`)}`;
			sol += `Hence ${math(`${pt}`)} lies within only ${math(`C_1 \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h2 id="title">{title}</h2>
	<h3>Questions</h3>
	<Answer2 answers={questions} questionMode={true} />
	<hr />
	<h3>Answers</h3>
	<Answer2 {answers} />
</section>
