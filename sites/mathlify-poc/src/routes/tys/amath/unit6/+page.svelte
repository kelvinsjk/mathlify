<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Polynomial,
		xPolynomial,
		castToPoly,
		RationalFn,
		InequalityWorking,
		dydx,
		d2ydx2,
		GeneralFn,
		EquationWorking,
		SquareRoot,
		RationalTerm,
		Fraction,
		longDivision,
		Expression,
		ExpressionWorking,
		Term,
		PolynomialLike,
		PowerFn,
		solveLinear,
		Point,
		Circle,
		completeSquare,
		UnsimplifiedExpression,
	} from 'mathlify';
	import {
	align,
		alignStar,
		alignatStar,
		display,
		eqn,
		gatherStar,
		math,
		newParagraph,
		newline,
		strong,
	} from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 6: Coordinate Geometry';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const f = `\\operatorname{f}`;
	const fxString = `\\operatorname{f}(x)`;

	function area(...points:Point[]): Fraction {
		return points.reduce((prev,point,i)=>{
			const nextPt = i === points.length - 1 ? points[0] : points[i+1]
			return prev.plus(point.x.times(nextPt.y)).minus(point.y.times(nextPt.x));
		}, new Fraction(0)).abs().divide(2);
	}

	function areaWorking(...points:Point[]): string {
		let arrayArg = '';
		let xs = '';
		let ys = '';
		let plusTerms: Fraction[] = [];
		let minusTerms: Fraction[] = [];
		points.forEach((point,i)=>{
			arrayArg += 'c';
			xs += `${point.x} &`;
			ys += `${point.y} &`;
			if (i === points.length - 1){
				plusTerms.push(point.x.times(points[0].y));
				minusTerms.push(point.y.times(points[0].x));
			} else {
				plusTerms.push(point.x.times(points[i+1].y));
				minusTerms.push(point.y.times(points[i+1].x));
			}
		});
		arrayArg += 'c';
		xs += `${points[0].x}`;
		ys += `${points[0].y}`;
		return `&= \\frac{1}{2} \\left| \\begin{array}{${arrayArg}}
			${xs} \\\\
			${ys}
		\\end{array} \\right|
		\\\\ &= \\frac{1}{2} \\Bigl| \\left({\\textstyle ${new UnsimplifiedExpression(...plusTerms)}} \\right) - \\left( {\\textstyle ${new UnsimplifiedExpression(...minusTerms)}} \\right) \\Bigr|
		\\\\ &= ${area(...points)}
		`;
	}

	function quotientRuleWorking(rational: RationalFn): string {
		const f = rational.numFn;
		const g = rational.denFn;
		const fPrime = f.differentiate();
		const gPrime = g.differentiate();
		const fBrackets = `${f}`.length > 1 ? `\\left(${f}\\right)` : `${f}`;
		const gBrackets = `${g}`.length > 1 ? `\\left(${g}\\right)` : `${g}`;
		const fPrimeBrackets = `${fPrime}`.length > 1 ? `\\left(${fPrime}\\right)` : `${fPrime}`;
		const gPrimeBrackets = `${gPrime}`.length > 1 ? `\\left(${gPrime}\\right)` : `${gPrime}`;
		return `\\frac{${fPrimeBrackets}${gBrackets} - ${fBrackets}${gPrimeBrackets}}{\\left(${g}\\right)^2}`;
	}

	function productRuleWorking(
		f: Polynomial,
		g: PowerFn,
		options?: { aligned?: boolean },
	): { working: string; power: PowerFn; poly: Polynomial; final: ExpansionTerm } {
		const gPrime = g.differentiate();
		const fPrime = f.differentiate();
		const factor = new PowerFn(g.fx, g.power.minus(1));
		const t1 = new PowerFn(g.fx, 1, { coeff: g.coeff });
		const t2 = g.fx.differentiate().times(g.coeff).times(g.power);
		const eq = options?.aligned ? '&=' : '=';
		const poly = fPrime.times(g.fx).times(g.coeff).plus(f.times(t2));
		const final = new ExpansionTerm([g.fx, g.power.minus(1)], poly);
		return {
			working: `\\left(${fPrime}\\right)${g} + \\left(${f}\\right)${gPrime}
			\\\\ ${eq} ${factor} \\Big( \\left(${fPrime}\\right)${t1} + \\left(${f}\\right)\\left(${t2}\\right) \\Big)
			\\\\ ${eq} ${factor} \\left( ${poly} \\right)
		`,
			power: factor,
			poly,
			final,
		};
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
		const A = new Point(5,0);
		const C = new Point(0,10);
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
			const working = new EquationWorking(OB, AC, {aligned: true});
			const xM = working.solveLinear();
			const yM = OB.subIn(xM);
			sol += `At intersection of lines ${math(`OB`)} and
				${math(`AC`)}
			`;
			sol += alignStar(`${working}`);
			const xB = xM.times(2);
			const yB = yM.times(2);
			const B = new Point(xB,yB);
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
			`
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
		const A = new Point(1, 4, {name: 'A'});
		const B = new Point(9,8, {name: 'B'})
		const C = new Point(7,12,{name: 'C'});
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
			`)
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
		const A = new Point(-2,1,{name: 'A'});
		const BUnknown = `B\\left(0,p\\right)`;
		const C = new Point(1,3,{name: 'C'});
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
			mAB = new RationalFn(new Polynomial([1,-1],{variable:'p'}),2);
			let sol = alignStar(`&\\textrm{Gradient of } AB
				\\\\ &= \\frac{p - ${A.y}}{0 - (${A.x})}
				\\\\ &= ${mAB} \\; \\blacksquare
			`);
			const mCB = new Polynomial([3,-1],{variable:'p',ascending:true});
			//const mBC = new RationalFn()
			sol += alignStar(`&\\textrm{Gradient of } CB
				\\\\ &= \\frac{${C.y}-p}{${C.x}-0}
				\\\\ &= ${mCB} \\; \\blacksquare
			`);
			const rhs = new ExpansionTerm(-1,mCB);
			const working = new EquationWorking(mAB, rhs.expand());
			working.crossMultiply();
			const p = working.solveLinear({variable: 'p'});
			sol += `Since ${math(`\\angle ABO = \\angle CBO,`)}
				${gatherStar(`${mAB} = ${rhs}
					\\\\ ${working} \\; \\blacksquare
				`)}
			`;
			B = new Point(0,p);
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
			const y1 = new Polynomial([1,-1]).times(2).plus(3);
			sol += eqn(`y = ${y1}`, {leqno: true});
			sol += `Since ${math(`\\angle DAB = 90^\\circ,`)}`;
			sol += alignStar(`m_{AB} \\cdot m_{AD} &= -1
				\\\\ 2 \\frac{y-${A.y}}{x-(${A.x})} &= -1
			`);
			sol += eqn(`2(y-1) = -x -2`, {leqno: true});
			sol += `Substituting ${math(`(1)`)} into ${math(`(2),`)}`;
			const rhs = new Polynomial([-1,-2]);
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
			D = new Point(xD,yD,{name:'D'});
			sol += `Coordinates of ${math(`\\displaystyle ${D} \\; \\blacksquare`)}`
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the area of the trapezium
				${math(`ABCD.`)}
			`;
			const sol = `${alignStar(`&\\textrm{Area}
				\\\\ ${areaWorking(B,A,D,C)} \\textrm{ units}^2 \\; \\blacksquare
			`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2015 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const num = new Polynomial([2, 0, 0]);
		const den = new Polynomial([1, -1]);
		const y = new RationalFn(num, den);
		const derivative = y.differentiate();
		const derivativeFn = y.differentiateToFn();
		const d2 = `\\frac{4}{\\left(${den}\\right)^3}`;
		let x1: Fraction, x2: Fraction;
		let y1: Fraction, y2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${dydx()}`)}
			  and obtain the coordinates of
				the stationary points of the curve.
			`;
			let sol = alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${quotientRuleWorking(y)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			working.crossMultiply();
			working.divide(2);
			[x1, x2] = working.factorizeQuadratic();
			y1 = y.subIn({ x: x1 }).cast.toFraction();
			y2 = y.subIn({ x: x2 }).cast.toFraction();
			sol += `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${alignStar(`${working}`)}
				${display(`x=${x1} \\; \\textrm{ or } \\; x=${x2}`)}
				When ${math(`x=${x1},`)}
				${alignStar(`y &= \\frac{2(0)^2}{0-1}
					\\\\ &= ${y1}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`y &= \\frac{2(2)^2}{2-1}
					\\\\ &= ${y2}
				`)}
				Hence the stationary points are ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
				`\\left(${x2}, ${y2}\\right) \\; \\blacksquare`,
			)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${d2ydx2()}`)}
				and hence determine the nature of these
				stationary points.
			`;
			const num = derivativeFn.numFn;
			const sol = `${alignStar(`${dydx()} &= ${derivative}
				\\\\ ${d2ydx2()} &= \\frac{\\left(${num.differentiate()}\\right)\\left(${den}\\right)^2 - \\left(${num}\\right)2\\left(${den}\\right)(1)}{\\left(${den}\\right)^4}
				\\\\ &= \\frac{4\\left(${den}\\right)\\left( \\left(${den}\\right)^2 - \\left( ${num.divide(
				2,
			)} \\right) \\right)}{\\left(${den}\\right)^4}
					\\\\ &= \\frac{4\\left( x^2 - 2x + 1 - x^2 + 2x  \\right)}{\\left(x-1\\right)^3}
				\\\\ &= ${d2} \\; \\blacksquare
			`)}
				When ${math(`x=${x1},`)}
				${alignStar(`${d2ydx2()} &= \\frac{4}{(${x1}-1)^3}
					\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`${d2ydx2()} &= \\frac{4}{(${x2}-1)^3}
					\\\\ &> 0 \\; \\Rightarrow \\text{minimum point}
				`)}
				Hence ${math(`\\left(${x1}, ${y1}\\right)`)} is a ${strong('maximum')}
				point and ${math(`\\left(${x2}, ${y2}\\right)`)} is a ${strong('minimum')}
				point ${math(`\\blacksquare`)}

			`;
			//Hence both ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
			//	`\\left(${x2}, ${y2}\\right)`,
			//)} are ${strong('maximum')} points ${math(`\\blacksquare`)}
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2014 P1 Q3
	(() => {
		const dydt = new Fraction(3, 100);
		const dydtVal = dydt.toFixed(2);
		const dxdt = new Fraction(12, 100);
		const dxdtVal = dxdt.toFixed(2);
		const poly = new Polynomial([2]);
		const x2 = new Polynomial([1, 0, 0]);
		const num = -1;
		const rational = new RationalFn(num, x2);
		const y = new GeneralFn(poly, rational);
		const derivative = y.differentiateToFn({ divisor: new Polynomial(1) });
		const body = `A particle moves along the curve
			${math(`\\displaystyle y = ${y}`)}
			in such a way that the ${math(`y`)}-coordinate
			of the particle is increasing at a constant rate of
			${math(`${dydtVal}`)} units per second. Find the ${math(`y`)}-coordinate
			of the particle at the instant that the ${math(`x`)}-coordinate
			of the particle is increasing at ${math(`${dxdtVal}`)} units per second.
		`;
		const x = 2;
		const yVal = poly.plus(rational.subIn({ x }).cast.toFraction());
		const sol = `${alignStar(`y &= ${y}
			\\\\ &= 2 - x^{-2}
			\\\\ ${dydx()} &= 2x^{-3}
			\\\\ &= ${derivative}
		`)}
			${alignStar(`${dydx({ x: 't' })} &= ${dydx()} \\times ${dydx({ y: 'x', x: 't' })}
				\\\\ ${dydtVal} &= ${derivative} \\times ${dxdtVal}
				\\\\ ${dydtVal} x^3 &= ${dxdt.times(2).valueOf()}
				\\\\ x^3 &= ${dxdt.times(2).divide(dydt).valueOf()}
				\\\\ x &= 2
			`)}
			${alignStar(`y &= 2 - \\frac{1}{2^2}
				\\\\ y &= ${yVal} \\; \\blacksquare
			`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 8: 2013 P1 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const y = new Polynomial([2, 3, -5]);
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find the set of values of ${math(`x`)}
				for which ${math(`y+3 > 0.`)}
			`;
			const poly = y.plus(3);
			const working = new InequalityWorking(poly, 0, { sign: '>' });
			const intervals = working.factorizeQuadratic();
			const sol = gatherStar(`y + 3 > 0
				\\\\ ${working}
				\\\\ ${intervals[0]} \\; \\textrm{ or } \\; ${intervals[1]} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const dxdt = new Fraction(4, 100);
			const dxdtVal = dxdt.toFixed(2);
			const dydt = new Fraction(2, 10);
			const dydtVal = dydt.toFixed(1);
			const uplevel = `A particle moves along the curve
				${math(`y=2x^2+3x-5.`)}
				At point ${math(`P`)} the
				${math(`x`)}-coordinate of the particle is
				increasing at a rate of ${math(`${dxdtVal}`)} units/sec
				and the ${math(`y`)}-coordinate of the particle is
				increasing at ${math(`${dydtVal}`)} units/sec.
			`;
			const body = `Find the coordinates of ${math(`P.`)}
			`;
			const derivative = y.differentiate();
			let sol = `${alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${derivative} `)}
			`;
			const working = new EquationWorking(derivative, dydt.divide(dxdt), { aligned: true });
			const x = working.solveLinear();
			sol += alignStar(`${dydx({ x: 't' })} &= ${dydx()} \\times ${dydx({ y: 'x', x: 't' })}
				\\\\ ${dydtVal} &= (${derivative}) \\times ${dxdtVal}
				\\\\ ${working}
				`);
			const yVal = y.subIn(x);
			sol +=
				alignStar(`y &= ${y.subInWorking(x)}
				\\\\ &= ${yVal}
			`) + `Coordinates of ${math(`P\\left(${x}, ${yVal}\\right) \\; \\blacksquare`)}`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 9: 2013 P1 Q11
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const num = new Polynomial([1, 0, 0]);
		const den = new Polynomial([1, 2]);
		const y = new RationalFn(num, den);
		const derivative = y.differentiate();
		const derivativeFn = y.differentiateToFn();
		const d2 = `\\frac{8}{\\left(${den}\\right)^3}`;
		let x1: Fraction, x2: Fraction;
		let y1: Fraction, y2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${dydx()}`)}
			  and ${math(`\\displaystyle ${d2ydx2()}.`)}
			`;
			let sol = alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${quotientRuleWorking(y)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`);
			const num = derivativeFn.numFn;
			sol += alignStar(`${dydx()} &= ${derivative}
				\\\\ ${d2ydx2()} &= \\frac{\\left(${num.differentiate()}\\right)\\left(${den}\\right)^2 - \\left(${num}\\right)2\\left(${den}\\right)(1)}{\\left(${den}\\right)^4}
				\\\\ &= \\frac{2\\left(${den}\\right)\\left( \\left(${den}\\right)^2 - \\left( ${num} \\right) \\right)}{\\left(${den}\\right)^4}
					\\\\ &= \\frac{2\\left( ${den.square()} - x^2 - 4x  \\right)}{\\left(${den}\\right)^3}
				\\\\ &= ${d2} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Determine the nature of each of the
				stationary points of the curve.
			`;
			const working = new EquationWorking(derivative, 0, { aligned: true });
			working.crossMultiply();
			[x1, x2] = working.factorizeQuadratic();
			y1 = y.subIn({ x: x1 }).cast.toFraction();
			y2 = y.subIn({ x: x2 }).cast.toFraction();
			const dTwo1 = new Fraction(8).divide(den.subIn(x1).pow(3));
			const dTwo2 = new Fraction(8).divide(den.subIn(x2).pow(3));
			let sol = `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${alignStar(`${working}`)}
				${display(`x=${x1} \\; \\textrm{ or } \\; x=${x2}`)}
				When ${math(`x=${x1},`)}
				${alignStar(`y &= \\frac{(${x1})^2}{${x1}+2}
					\\\\ &= ${y1}
					\\\\ ${d2ydx2()} &= \\frac{8}{(${x1}+2)^3}
					\\\\ &= ${dTwo1}
					\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`y &= \\frac{${x2}^2}{${x2}+2}
					\\\\ &= ${y2}
					\\\\ ${d2ydx2()} &= \\frac{8}{(${x2}+2)^3}
					\\\\ &= ${dTwo2}
					\\\\ &> 0 \\; \\Rightarrow \\text{minimum point}
				`)}
				Hence the stationary points are ${math(`\\left(${x1}, ${y1}\\right),`)}
				which is a ${strong('maximum')} point
				and ${math(`\\left(${x2}, ${y2}\\right)`)} which is a ${strong('minimum')} point ${math(
				`\\blacksquare`,
			)}
			`;
			//Hence both ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
			//	`\\left(${x2}, ${y2}\\right)`,
			//)} are ${strong('maximum')} points ${math(`\\blacksquare`)}
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2018 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x2 = new Polynomial([0, 0, 1], { ascending: true });
		const term2 = new Polynomial([36, -1], { ascending: true });
		const y = x2.times(term2);
		const dVdt = 18;
		const r = 12;
		const oneThird = new Fraction(1, 3);
		const x = 9;
		const body = `Water is poured, at a constant rate of
			${math(`${dVdt} \\pi \\textrm{ cm}^3\\textrm{/s},`)}
			into a hemispherical bowl of radius ${math(`${r} \\textrm{ cm}.`)}
			When the depth of water directly below the center is ${math(`x \\textrm{ cm},`)}
			the volume, ${math(`V \\textrm{ cm}^3,`)} of water in the bowl is given by
			${display(`V = ${oneThird} \\pi ${x2} \\left( ${term2} \\right).`)}
			Find
		`;
		// part a
		(() => {
			const body = `the time taken for the depth of water directly below the centre to reach
				${math(`${x} \\textrm{ cm}.`)}
			`;
			let sol = alignStar(`V &= ${oneThird} \\pi ${x2} \\left( ${term2} \\right)
				\\\\ &= ${oneThird} \\pi \\left( ${y} \\right)
			`);
			sol += `When ${math(`x=${x},`)}`;
			const V = y.subIn(x).divide(3);
			sol += alignStar(`V &= ${oneThird} \\pi \\left( ${y.subInWorking(x)} \\right)
				\\\\ &= ${V} \\pi
			`);
			const t = V.divide(dVdt);
			sol += alignStar(`&\\textrm{Time taken}
				\\\\ &= \\frac{${V}\\pi}{${dVdt}\\pi}
				\\\\ &= ${t} \\textrm{ s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `the rate of change of the depth of water directly below the centre at
				this time.
			`;
			const derivative3 = y.differentiate();
			const derivative = derivative3.divide(3);
			const dVdx = dydx({ y: 'V' });
			let sol = alignStar(`V &= ${oneThird} \\pi \\left( ${y} \\right)
				\\\\ ${dVdx} &= ${oneThird} \\pi \\left( ${derivative3} \\right)
				\\\\ &= \\pi \\left( ${derivative} \\right)
			`);
			const dxdt = dydx({ y: 'x', x: 't' });
			const ans = new Fraction(dVdt).divide(derivative.subIn(x));
			sol += alignStar(`${dydx({ y: 'V', x: 't' })} &= ${dVdx} \\times ${dydx({
				y: 'x',
				x: 't',
			})}
				\\\\ ${dVdt} \\pi &= \\pi (${derivative}) \\times ${dxdt}
				\\\\ ${dxdt} &= \\frac{${dVdt}}{${derivative.subInWorking(x)}}
				\\\\ &= ${ans} \\textrm{ cm/s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2018 P1 Q10
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x2 = new Polynomial([0, 0, 1], { ascending: true });
		const term2 = new Polynomial([36, -1], { ascending: true });
		const y = x2.times(term2);
		const dVdt = 18;
		const oneThird = new Fraction(1, 3);
		const x = 9;
		const length = 20;
		let r: Expression;
		let A1: xPolynomial;
		let A2: PowerFn;
		const body = `A gardener uses ${math(`${length} \\textrm{ m}`)}
			of fencing with which to enclose ${math(`2`)}
			flower beds. One bed is to be an equilateral triangle
			of side ${math(`x \\textrm{ m}.`)}
			The other bed is to be a circle of radius
			${math(`r \\textrm{ m}.`)}
		`;
		// part a
		(() => {
			const body = `Express ${math(`r`)} in terms of ${math(`x.`)}`;
			const lhs = new Expression([3, 'x'], [2, '\\pi', 'r']);
			const working = new EquationWorking(lhs, length);
			working.moveTerm(0);
			r = working.rhs;
			let sol = gatherStar(`${working}
				\\\\ r = \\frac{${r}}{2\\pi} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			A1 = new xPolynomial([`\\sqrt{3} \\pi`, 0, 0]);
			const fx = new Polynomial([20, -3], { ascending: true });
			A2 = new PowerFn(fx, 2);
			const body = `Show that the total area, ${math(`A \\textrm{ m}^2`)}
				of the two flower beds is given by
				${display(`A = \\frac{${A1}+${A2}}{4\\pi}`)}
			`;
			const sol = alignStar(`A &= \\frac{1}{2}x^2 \\sin 60^\\circ + \\pi r^2
				\\\\ &= \\frac{1}{2} x^2 \\frac{\\sqrt{3}}{2} + \\pi \\left(\\frac{${r}}{2\\pi} \\right)^2
				\\\\ &= \\frac{\\sqrt{3}}{4} x^2 + \\pi \\frac{\\left(${r}\\right)^2}{4\\pi^2}
				\\\\ &= \\frac{\\sqrt{3}x^2}{4} + \\frac{\\left(${r}\\right)^2}{4\\pi}
				\\\\ &= \\frac{${A1}+${A2}}{4\\pi} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let A1Derivative: xPolynomial;
		let A2Derivative: PowerFn;
		let dAdx: string;
		// part c
		(() => {
			const body = `Given that ${math(`x`)} can vary,
				find the value of ${math(`x`)} that gives a stationary value of ${math(`A.`)}
			`;
			dAdx = dydx({ y: 'A' });
			A1Derivative = A1.differentiate();
			A2Derivative = A2.differentiate() as PowerFn;
			let sol = alignStar(`A &= \\frac{${A1}+${A2}}{4\\pi}
				\\\\ ${dAdx} &= \\frac{${A1Derivative} ${A2Derivative}}{4\\pi}
				\\\\ &= \\frac{\\sqrt{3}\\pi x - 3(20-3x)}{2\\pi}
				\\\\ &= \\frac{\\sqrt{3}\\pi x + 9x - 60}{2\\pi}
			`);
			sol += `At stationary value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}`;
			let x = 60 / (Math.sqrt(3) * Math.PI + 9);
			sol += gatherStar(`\\sqrt{3}\\pi x + 9x - 60 = 0
				\\\\ \\left(\\sqrt{3}\\pi + 9\\right)x = 60
			`);
			sol += alignStar(`x &= \\frac{60}{\\sqrt{3}\\pi + 9}
				\\\\ &= ${x.toPrecision(3)} \\textrm{ (3 s.f.)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `Find the nature of the stationary value and explain why the gardener might be
				disappointed.
			`;
			const d2A = d2ydx2({ y: 'A' });
			const A1D = A1Derivative.differentiate();
			const A2D = A2Derivative.differentiate();
			let sol = alignStar(`${dAdx} &= \\frac{\\sqrt{3}\\pi x + 9x - 60}{2\\pi}
				\\\\ ${d2A} &= \\frac{\\sqrt{3}\\pi + 9}{2\\pi}
				\\\\ &> 0 \\; \\Rightarrow \\text{minimum value}
			`);
			sol += `Hence the nature of this stationary value is a ${strong(`minimum`)} ${math(
				`\\blacksquare`,
			)}
				${newParagraph}
				The gardener might be disappointed as he might be hoping to maximize the total area of the two flower
				beds to plant more flowers. However the stationary value is a minimum ${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 12: 2017 P1 Q6
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const body = `A tennis club makes three equally sized tennis courts, positioned
			next to each other as shown in the diagram below. Each tennis court is rectangular
			and has side length ${math(`x \\textrm{ m}`)} and ${math(`y \\textrm{ m}.`)}
			The lines in the diagram represent wire netting. The total length of wire
			netting used is ${math(`${length} \\textrm{ m}.`)}
		`;
		let num: Polynomial;
		// part a
		(() => {
			const body = `Show that the total area, ${math(`A \\textrm{m}^2,`)}
				of the three tennis courts is given by
				${display(`A = ${A}.`)}
			`;
			num = new Polynomial([length, -6], { ascending: true });
			let sol = gatherStar(`4y + 6x = ${length}`);
			sol += eqn(`y = \\frac{${num}}{4}`, { leqno: true });
			sol += alignStar(`A &= 3xy
				\\\\ &= 3x \\left( \\frac{${num}}{4} \\right)
				\\\\ &= ${num.times(new Polynomial(3)).divide(4)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the dimensions of each
				tennis court that make ${math(`A`)} a maximum.
				${newline}
				(You are not required to show that ${math(`A`)} is a maximum.)
			`;
			const dAdx = dydx({ y: 'A' });
			const derivative = A.differentiate();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			const x = working.solveLinear();
			const y = num.subIn(x).divide(4);
			sol += `At maximum value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${working}`)}
				Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= \\frac{${num.subInWorking(x)}}{4}
					\\\\ &= ${y}
				`)}
				Hence the dimensions of each tennis court is ${math(
					`${y} \\textrm{ m by } ${x} \\textrm{ m} \\; \\blacksquare`,
				)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 13: 2016 P1 Q7
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const speedWest = 5;
		const speedNorth = 10;
		const distance = 100;
		const body = `At a given instant, a cyclist is at a cross roads ${math(`O,`)}
			travelling due west at a constant speed of ${math(`${speedWest} \\textrm{ m/s}.`)}
			At the same instant, a second cyclist is ${math(`${distance} \\textrm{ m}`)} 
			from ${math(`O,`)} travelling due north towards
			${math(`O`)} at a constant speed
			of ${math(`${speedNorth} \\textrm{ m/s}.`)}
			This is shown in Fig. 1.
			${newParagraph}
			The position, ${math(`t`)} seconds later, when the cyclists have
			reached points ${math(`P`)}
			and ${math(`Q,`)} is shown in Fig. 2.
		`;
		const radicand = 125;
		const sqrt125 = new SquareRoot(radicand);
		const fx = new Polynomial([1, -16, 80], { variable: 't' });
		const fn = new PowerFn(fx, new Fraction(1, 2));
		const dsdt = dydx({ x: 't', y: 's' });
		let num: Polynomial;
		// part a
		(() => {
			const body = `Express ${math(`OP`)}
				and ${math(`OQ`)} in terms of ${math(`t`)}
				and hence show that the distance,
				${math(`s \\textrm{ m},`)}
				between the two cyclists at time ${math(`t`)}
				is given by
				${display(`s = \\sqrt{${radicand}\\left(${fx}\\right)}.`)}
			`;
			const OP = new Polynomial([speedWest, 0], { variable: 't' });
			const OQ = new Polynomial([distance, -speedNorth], { variable: 't', ascending: true });
			let sol = alignStar(`OP &= ${OP} \\; \\blacksquare
				\\\\ OQ &= ${OQ} \\; \\blacksquare
			`);
			const OP2 = OP.square();
			const OQ2 = OQ.square();
			const s = OP2.plus(OQ2).divide(radicand);
			const t2 = new Polynomial([1, 0, 0], { variable: 't' });
			const OQFactorized = new Polynomial([10, -1], { ascending: true, variable: 't' });
			sol += `By Pythagoras Theorem,
				${alignStar(`s &= \\sqrt{OP^2 + OQ^2}
					\\\\ &= \\sqrt{(${OP})^2 + (${OQ})^2}
					\\\\  &= \\sqrt{25t^2 + 100(${OQFactorized})^2}
					\\\\  &= \\sqrt{25\\left(t^2 + 4(${OQFactorized.square()})\\right)}
					\\\\  &= \\sqrt{25\\left(${t2.plus(OQFactorized.square().times(4))})\\right)}
					\\\\ &= \\sqrt{${radicand}\\left(${s}\\right)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Obtain an expression for ${math(`\\displaystyle ${dsdt}.`)}
			`;
			const derivative = fn.differentiate();
			let sol = alignStar(`s &= \\sqrt{${radicand}\\left(${fx}\\right)}
				\\\\ &= \\sqrt{${radicand}} \\sqrt{${fx}}
				\\\\ &= ${sqrt125} ${fn}
				\\\\ ${dsdt} &= ${sqrt125} \\cdot ${derivative}
				\\\\ &= \\frac{${sqrt125} \\left(t-8\\right)}{\\sqrt{${fx}}} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const inner = fx.differentiate().divide(2);
			const t = solveLinear(inner);
			const body = `Find the least distance between the two cyclists.`;
			let sol = `When the distance is the least, ${math(`\\displaystyle ${dsdt} = 0`)}`;
			sol += gatherStar(`\\frac{${sqrt125} \\left(t-8\\right)}{\\sqrt{${fx}}} = 0
				\\\\ ${inner} = 0
				\\\\ t = ${t}
			`);
			const subbedIn = fx.subIn(t);
			const ans = new SquareRoot(subbedIn.times(radicand));
			sol += `When ${math(`t=${t},`)}
				${alignStar(`s &= \\sqrt{${radicand}\\left(${fx.subInWorking(t)}\\right)}
					\\\\ &= \\sqrt{${radicand} \\left(${subbedIn}\\right)}
					\\\\ &= ${ans} \\textrm{ m}
					\\\\ &= ${ans.toPrecision(3)} \\textrm{ m (3 s.f.)} \\; \\blacksquare
				`)}
			`;
			sol += `We also note that this distance is the least because ${math(`${dsdt} < 0`)}
				when ${math(`0 < t < ${t}`)} and ${math(`${dsdt} > 0`)} when ${math(`t > ${t}`)}
				so the stationary value obtained above is a minimum.
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 14: 2016 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const f = new Polynomial([1, -2]);
		const inner = new Polynomial([2, -5]);
		const g = new PowerFn(inner, 3);
		const y = `\\left(${f}\\right)${g}`;
		const body = `It is given that ${display(`y = ${y}.`)}`;
		let poly: Polynomial;
		let final: ExpansionTerm;
		let power: PowerFn;
		// part a
		(() => {
			const body = `Obtain an expression for ${math(`\\displaystyle ${dydx()}`)}
				in the form ${math(`(ax+b)(${inner})^2,`)}
				where ${math(`a`)} and ${math(`b`)} are integers.
			`;
			const productRule = productRuleWorking(f, g, { aligned: true });
			const { working } = productRule;
			({ poly, final, power } = productRule);
			let sol = alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${working} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Determine the values of ${math(`x`)} for which
				${math(`y`)} is a decreasing function.
			`;
			let sol = `For ${math(`y`)} to be a decreasing function, ${math(
				`\\displaystyle ${dydx()} < 0`,
			)}
				${display(`${final} < 0`)}
				Since ${math(`${power} \\geq 0`)} for all real values of ${math(`x,`)}
			`;
			const working = new InequalityWorking(poly, 0, { aligned: true, sign: '<' });
			working.moveTerm(1);
			working.divide(8);
			const x = working.rhs.cast.toFraction();
			sol += alignStar(`${working} \\; \\blacksquare`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		const x = 3;
		let dydxVal: Fraction;
		let dydt: string;
		(() => {
			const dydtVal = new Fraction(35, 100);
			const dydtString = dydtVal.toFixed(2);
			const uplevel = `The variables ${math(`x`)}
				and ${math(`y`)} are such that,
				when ${math(`x=${x},`)}
				${math(`y`)} is increasing at a rate of ${math(`${dydtString}`)}
				units per second.
			`;
			const body = `Find the rate of change of ${math(`x`)}
				when ${math(`x=${x}.`)}
			`;
			dydt = dydx({ y: 'y', x: 't' });
			const dxdt = dydx({ y: 'x', x: 't' });
			dydxVal = power.fx.subIn(x).pow(2).times(poly.subIn(x));
			const dxdtVal = dydtVal.divide(dydxVal);
			let sol = alignStar(`${dydt} &= ${dydx()} \\times ${dxdt}
				\\\\ ${dydtString} &= ${final} ${dxdt}
				\\\\ ${dydtString} &= \\left(${power.fx.subInWorking(x)}\\right)^2 \\left(${poly.subInWorking(
				x,
			)}\\right) ${dxdt}
				\\\\ ${dxdt} &= ${dydtString} \\div ${dydxVal}
				\\\\ &= ${dxdtVal.toFixed(2)} \\textrm{ units/s} \\; \\blacksquare
			`);
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const z = new Polynomial([1, 0, 0], { variable: 'y' });
			const uplevel = `It is given further that the variable ${math(`z`)}
				is such that ${math(`z = ${z}.`)}
			`;
			const body = `Show that, when ${math(`x=${x},`)} ${math(`z`)}
				is increasing at twice the rate of
				${math(`y.`)}
			`;
			const yVal = f.subIn(x).times(inner.subIn(x).pow(3));
			const dzdy = dydx({ y: 'z', x: 'y' });
			const dzdt = dydx({ y: 'z', x: 't' });
			let sol = `When ${math(`x=${x},`)}
				${alignStar(`y &= \\left(${f.subInWorking(x)}\\right)\\left(${inner.subInWorking(x)}\\right)^3
					\\\\ &= ${yVal}
				`)}
				${alignStar(`z &= ${z}
					\\\\ ${dzdy} &= ${z.differentiate()}
				`)}
			`;
			sol += alignStar(`${dzdt} &= ${dzdy} \\times ${dydt}
				\\\\ &= ${z.differentiate()} \\times ${dydt}
				\\\\ &= ${z.differentiate().subInWorking(yVal)} \\times ${dydt}
				\\\\ &= 2 ${dydt}
			`);
			sol += `Hence when ${math(`x=${x},`)} ${math(`z`)} is increasing at twice the rate of ${math(
				`y`,
			)}
				${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 15: 2016 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([1, -3, 4, -12]);
		const body = `It is given that ${display(`${fxString} = ${poly}.`)}
		`;
		let factor: Polynomial, quadratic: Polynomial;
		let x = 3;
		// part a
		(() => {
			const body = `By showing clearly your working factorise ${math(`f(x).`)}`;
			let sol = `Consider ${math(`${f}(${x}),`)}`;
			sol += alignStar(`${f}(${x}) &= ${poly.subInWorking(x)}
				\\\\ &= 27 - 27 + 12 - 12
				\\\\ &= 0
			`);
			factor = new Polynomial([1, -x]);
			sol += `By the factor theorem, ${math(`${factor}`)} is a factor of ${math(`${fxString}.`)}`;
			quadratic = castToPoly(longDivision(poly, factor));
			const [x0, _, x2, x3] = poly.coeffs;
			const [c2, b2] = quadratic.coeffs;
			const [b1] = factor.coeffs;
			sol += `${display(`${poly} = (${factor})(Ax^2 + Bx + C)`)}
			Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  A &= ${x3}
						\\\\ &x^2: \\quad &  ${b1}A + B &= ${x2}
						\\\\ && B &= ${b2}
						\\\\ &x^0: \\quad &  ${b1}C &= ${x0}
						\\\\ && C &= ${c2}
					`,
					2,
				)}
				${display(`f(x) = (${factor})(${quadratic}) \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Explain why the equation ${math(`${fxString}=0`)}
				has only one real root and state its value.
			`;
			let sol = `${alignStar(`${fxString} &= 0
				\\\\ (${factor})(${quadratic}) &= 0
			`)}
				${math(`${quadratic}`)} is always positive for all real values of ${math(`x`)} since ${math(
				`x^2 \\geq 0`,
			)} ${math(`\\forall x\\in\\mathbb{R}`)}
				${newline}
				Hence ${math(`${fxString}=0`)} has only one real root, ${math(`x = ${x} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the value of the constant ${math(`k`)} for which the graph of
				${display(`y = ${fxString} + kx`)} has a stationary point at which
				${math(`\\displaystyle ${d2ydx2()} = 0`)}
			`;
			const derivative = poly.differentiate();
			const d2 = derivative.differentiate();
			let sol = `${alignStar(
				`y &= ${poly} + kx
				\\\\ ${dydx()} &= ${derivative} + k 
				\\\\ ${d2ydx2()} &= ${d2} 
			`,
			)}
				When ${math(`\\displaystyle ${d2ydx2()} = 0,`)}
			`;
			const working1 = new EquationWorking(d2, 0, { aligned: true });
			const x = working1.solveLinear();
			sol += alignStar(`${working1}`);
			const k = derivative.subIn(x).negative();
			sol += `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)}
				${gatherStar(`${derivative} + k = 0
					\\\\ ${derivative.subInWorking(x)} + k = 0
					\\\\ k = ${k} \\; \\blacksquare
				`)}
			`;

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
