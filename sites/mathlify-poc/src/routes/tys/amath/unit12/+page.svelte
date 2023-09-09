<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		Polynomial,
		Fraction,
		ExpFn,
		LnFn,
		CosFn,
		SinFn,
		dydx,
		d2ydx2,
		SquareRoot,
		GeneralFn,
		solveQuadraticNumerical,
	} from 'mathlify';
	import {
		alignStar,
		display,
		gatherStar,
		math,
		newParagraph,
	} from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title =
		'Unit 12: Differentiation of Trigonometric, Exponential and Logarithmic Functions and their Applications';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];
	const f = `\\operatorname{f}`;
	const fx = `${f}(x)`;
	const g = `\\operatorname{g}`;
	const gx = `${g}(x)`;
	const degree = `^\\circ`;

	const dydtString = dydx({x: 't'});
	const dxdtString = dydx({y: 'x', x: 't'});

	function productRuleWorking(
		f: Polynomial,
		g: ExpFn|LnFn,
		options?: { aligned?: boolean },
	): { working: string;  } {
		const gPrime = g.differentiate();
		const fPrime = f.differentiate();
		return {
			working: `\\left(${fPrime}\\right)${g} + \\left(${f}\\right)\\left(${gPrime}\\right)`,
		};
	}

	//! Question 1: 2017 P2 Q8a
	(() => {
		const exp_2x = new ExpFn(new Polynomial(2));
		const exp_negX = new ExpFn(new Polynomial(-1));
		const body = `Given that ${math(`y = A${exp_2x} + B ${exp_negX},`)}
			and that ${math(`\\displaystyle ${dydx()} + 4y = ${exp_2x} - ${exp_negX},`)}
			find the value of each of the constants
			${math(`A`)} and ${math(`B.`)}
		`;
		let sol = alignStar(` y &= A${exp_2x} + B ${exp_negX}
			\\\\ ${dydx()} &= 2A ${exp_2x} - B ${exp_negX}
		`)
		sol += alignStar(`&${dydx()} + 4y
			\\\\ &= 2A ${exp_2x} - B ${exp_negX} + 4 \\left( A${exp_2x} + B ${exp_negX} \\right)
			\\\\ &= 6A ${exp_2x} + 3B ${exp_negX}
		`);
		sol += `Comparing with ${math(`${exp_2x} - ${exp_negX}`)}`;
		sol += alignStar(`6A &= 1
			\\\\ A &= \\frac{1}{6} \\; \\blacksquare
			\\\\ 3B &= -1
			\\\\ B &= -\\frac{1}{3} \\; \\blacksquare
		`)
		questions.push({ body, });
		answers.push({ body: sol });
	})();

	//! Question 2: 2019 P1 Q12
	(() => {
		const poly = new Polynomial([3,-1]);
		const y = new LnFn(poly);
		const derivative = y.differentiate();
		const dydt = new Fraction(6,100);
		const x = 7;
		const body = `A particle moves along the curve
			${math(`y=${y}`)} in such a way that the
			${math(`y`)}-coordinate of the particle is increasing
			at a constant rate of 
			${math(`${dydt.toFixed(2)}`)} units per second.
			Find the rate at which the ${math(`x`)}-coordinate of the
			particle is increasing at the instant when
			${math(`x=${x}.`)}
		`;
		let sol = alignStar(` y &= ${y}
			\\\\ ${dydx()} &= ${derivative}
		`);
		const dxdt = dydt.times(poly.subIn(x)).divide(3);
		sol += alignStar(`${dydtString} &= ${dydx()} \\times ${dxdtString}
			\\\\ ${dydt.toFixed(2)} &= ${derivative} \\times ${dxdtString}
			\\\\ ${dydt.toFixed(2)} &= \\frac{3}{${poly.subInWorking(x)}} \\times ${dxdtString}
			\\\\ ${dxdtString} &= \\frac{${dydt.toFixed(2)}}{\\frac{3}{${poly.subIn(x)}}}
			\\\\ &= ${dxdt.toFixed(1)} \\textrm{ units/s} \\; \\blacksquare
		`);
		questions.push({ body, });
		answers.push({ body: sol });
	})();

	//! Question 3: 2020 P2 Q8
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const LM = 5;
		const MN = 12;
		const theta = `\\theta`;
		const body = `The diagram shows a metal plate in the shape
			of a trapezium in which angles
			${math(`NKL`)} and ${math(`KLM`)}
			are right angles. THe lengths of
			${math(`LM`)} and ${math(`MN`)} are
			${math(`${LM} \\textrm{ cm}`)} and
			${math(`${MN} \\textrm{ cm}`)}
			respectively. The acute angle ${math(`KNM`)}
			is ${math(`${theta} \\textrm{ radians}.`)}
		`;
		const constant = 22;
		const cos = new CosFn(theta);
		const sin = new SinFn(theta);
		// part a
		(() => {
			const body = `Show that the perimeter, ${math(`P \\textrm{ cm},`)}
				is given by
				${display(`P = ${constant} + ${cos.times(12)} + ${sin.times(12)}`)}
			`;
			let sol = `Let ${math(`J`)} denote the point on 
				${math(`KN`)} that is directly left of ${math(`M.`)}
			`;
			sol += alignStar(`${sin} &= \\frac{JM}{MN}
				\\\\ JM &= MN ${sin}
				\\\\ &= ${MN} ${sin}
			`);
			sol += alignStar(`${cos} &= \\frac{JN}{MN}
				\\\\ JN &= MN ${cos}
				\\\\ &= ${MN} ${cos}
			`);
			sol += alignStar(`&\\textrm{Perimeter } P
				\\\\ &= KL + LM + MN + NK
				\\\\ &= ${MN} ${sin} + ${LM} + ${MN} + ${MN} ${cos} + 5
				\\\\ &= ${constant} + ${cos.times(12)} + ${sin.times(12)} \\; \\blacksquare	
			`)
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the value of ${math(`R`)}
				when ${math(`${cos.times(12)} + ${sin.times(12)}`)}
				is expressed as ${math(`R \\cos \\left( ${theta} - \\alpha \\right),`)}
				where ${math(`R`)} and ${math(`\\alpha`)}
				are constants, and hence state the maximum perimeter of the plate.
			`;
			const radicand = Math.pow(MN,2) + Math.pow(MN,2);
			const R = new SquareRoot(radicand);
			const sol = `${alignStar(`R &= \\sqrt{${MN}^2 + ${MN}^2}
				\\\\ &= \\sqrt{${radicand}}
				\\\\ &= ${R} \\; \\blacksquare
			`)}
				${alignStar(`&\\textrm{Maximum perimeter}
					\\\\ &= \\left(${constant} + ${R}\\right) \\textrm{ cm} \\; \\blacksquare
				`)}
			`; 
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Show that the area of the plate, ${math(`A \\textrm{ cm}^2,`)}
				is given by
				${display(`A = 60${sin} + 36 \\cos 2 \\theta.`)}
			`;
			const sol = alignStar(`&\\textrm{Area } A
				\\\\ &= \\frac{1}{2} \\left( KN + LM \\right) \\times KL
				\\\\ &= \\frac{1}{2} \\left( 5 + 12 ${cos} + 5 \\right) \\times 12 ${sin}
				\\\\ &= \\left( 10 + 12 ${cos} \\right) \\times 6 ${sin}
				\\\\ &= 60 ${sin} + 72 ${cos} ${sin}
				\\\\ &= 60 ${sin} + 36 \\sin 2 ${theta} \\; \\blacksquare
			`)
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const sin_2theta = new SinFn(new Polynomial(2, {variable: theta}));
			const A = new GeneralFn(sin.times(60), sin_2theta.times(36));
			const dAdx = dydx({y: 'A'});
			const derivative = A.differentiate();
			const body = `The maximum area of the plate is obtained when the value of
				${math(`${theta},`)}
				which can vary, gives a stationary value of
				${math(`A.`)} Find this value of
				${math(`${theta}.`)}
			`;
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			sol += `At stationary value of ${math(`A,`)}
				${math(`\\displaystyle ${dAdx} = 0`)}
			`;
			sol += gatherStar(`60 \\cos \\theta + 72 \\left( 2 \\cos^2 ${theta} - 1 \\right) = 0
				\\\\ 144\\cos^2 ${theta} + 60${cos} - 72 = 0
				\\\\ 12\\cos^2 ${theta} + 5${cos} - 6 = 0
			`);
			const [a,b,c]= [12,5,-6];
			const [c1,c2] = solveQuadraticNumerical([a,b,c]);
			sol += alignStar(`${cos} &= \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
				\\\\ &= \\frac{-${b} \\pm \\sqrt{${b}^2-4(${a})(${c})}}{2\\times${a}}
				\\\\ &= ${c1.toPrecision(5)} \\; \\textrm{ or } \\; ${c2.toPrecision(5)}
			`);
			sol += `Since ${math(`${theta}`)} is acute, ${math(`${cos} > 0`)} so`;
			sol += alignStar(`${cos} &= ${c2.toPrecision(5)}
				\\\\ ${theta} &= ${cos.solve(c2).toPrecision(3)} \\textrm{ rad} \\; \\blacksquare
			`)
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2013 P2 Q6
	(() => {
		const x2 = new Polynomial([1,0,0]);
		const exp = new ExpFn();
		const exp_negX = new ExpFn(new Polynomial(-1));
		const y = `${exp_negX} ${x2}`;
		const body = `Find the value of the constant
			${math(`k`)} for which ${math(`y= ${y}`)}
			is a solution of the equation
			${display(`${exp}\\left( ${d2ydx2()} + 2 ${dydx()} + y \\right) = k.`)}
		`;
		const poly2 = new Polynomial([0,2,-1],{ascending: true});
		const poly3 = poly2.differentiate().minus(poly2);
		let sol = alignStar(` y &= ${y}
			\\\\ ${dydx()} &= ${productRuleWorking(x2, exp_negX).working}
			\\\\ &= \\left( ${poly2} \\right) ${exp_negX}
			\\\\ ${d2ydx2()} &= ${productRuleWorking(poly2, exp_negX).working}
			\\\\ &= \\left( ${poly3} \\right) ${exp_negX}
		`);
		sol += `Substituting into the given equation`;
		sol += alignStar(`k &= ${exp} \\left( ${d2ydx2()} + 2 ${dydx()} + y \\right)
			\\\\ &= ${exp} \\left( (${poly3})${exp_negX} + 2(${poly2})${exp_negX} + ${y} \\right)
			\\\\ &= ${exp} ${exp_negX} \\left( ${poly3} + ${poly2.times(2)} + ${x2} \\right)
			\\\\ &= ${poly3.plus(poly2.times(2)).plus(x2)} \\; \\blacksquare
		`)
		questions.push({ body, });
		answers.push({ body: sol });
	})();

	//! Question 5: 2020 P2 Q8
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const LM = 5;
		const MN = 12;
		const theta = `\\theta`;
		const PQ = 20;
		const QR = 30;
		const body = `The diagram shows the vertical cross
			section ${math(`PQRS`)} of an open trough made
			from plastic sheeting. The lengths of
			${math(`PQ,`)} ${math(`QR`)} and
			${math(`RS`)} are ${math(`${PQ} \\textrm{ cm},`)}
			${math(`${QR} \\textrm{ cm}`)} and 
			${math(`${PQ} \\textrm{ cm}`)}
			respectively. The trough rests with ${math(`QR`)}
			on horizontal ground and both ${math(`PQ`)}
			and ${math(`RS`)} are incline at an angle
			${math(`${theta} \\textrm{ radians}`)} to the ground. 
		`;
		const constant = 22;
		const cos = new CosFn(theta);
		const sin = new SinFn(theta);
		const sin2 = new SinFn(new Polynomial(2,{variable: theta}));
		// part a
		(() => {
			const body = `Show that the area, ${math(`A \\textrm{ cm}^2,`)}
				of the cross section ${math(`PQRS`)} is given by
				${display(`A = ${sin.times(600)} + ${sin2.times(200)}.`)}
			`;
			let sol = `Let ${math(`T`)} denote the point on 
				${math(`PS`)} that is vertically above ${math(`Q.`)}
			`;
			sol += alignStar(`${sin} &= \\frac{QT}{PQ}
				\\\\ QT &= PQ ${sin}
				\\\\ &= ${PQ} ${sin}
			`);
			sol += alignStar(`${cos} &= \\frac{PT}{PQ}
				\\\\ PT &= PQ ${cos}
				\\\\ &= ${PQ} ${cos}
			`);
			sol += alignStar(`&\\textrm{Area } A
				\\\\ &= \\frac{1}{2} \\left( QR + PS \\right) QT
				\\\\ &= \\frac{1}{2} \\left( ${QR} + ${QR} + 2 (20 ${cos}) \\right) 20 ${sin}
				\\\\ &= \\left( 60 + 40 ${cos} \\right) 10 ${sin}
				\\\\ &= 600 ${sin} + 400 ${sin} ${cos}
				\\\\ &= 600 ${sin} + 200 ${sin2} \\; \\blacksquare
			`)
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`${theta}`)}
				can vary, find the value of ${math(`${theta}`)}
				for which the trough can hold a maximum amount of water.
			`;
			const dAdtheta = dydx({y: 'A', x: '\\theta'});
			const A = new GeneralFn(sin.times(600), sin2.times(200));
			const derivative = A.differentiateToFn();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdtheta} &= ${derivative}
				\\\\ &= 600 ${cos} + 400 \\left( 2 \\cos^2${theta} - 1  \\right)
				\\\\ &= 800 \\cos^2${theta} + 600 ${cos} - 400
			`)
			sol += `At maximum ${math(`A,`)} ${math(`\\displaystyle ${dAdtheta}=0`)}`
			sol += gatherStar(`800 \\cos^2${theta} + 600 ${cos} - 400 = 0
				\\\\ 4 \\cos^2${theta} + 3 ${cos} - 2 = 0
			`)
			const [a,b,c]= [4,3,-2];
			const [c1,c2] = solveQuadraticNumerical([a,b,c]);
			sol += alignStar(`${cos} &= \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
				\\\\ &= \\frac{-${b} \\pm \\sqrt{${b}^2-4(${a})(${c})}}{2\\times${a}}
				\\\\ &= ${c1.toPrecision(5)} \\; \\textrm{ or } \\; ${c2.toPrecision(5)}
			`);
			sol += `Since ${math(`${theta}`)} is acute, ${math(`${cos} > 0`)} so`;
			const ans = cos.solve(c2);
			sol += alignStar(`${cos} &= ${c2.toPrecision(5)}
				\\\\ ${theta} &= ${ans.toPrecision(3)} \\textrm{ rad} \\; \\blacksquare
			`);
			const d2 = derivative.differentiate();
			sol += `When ${math(`${theta} = ${ans.toPrecision(5)},`)}`;
			const d2Val = Math.sin(ans)*-600-800*Math.sin(2*ans);
			sol += alignStar(`${d2ydx2({y: 'A', x: theta})} &= ${d2}
				\\\\ &= - 600 \\sin ${ans.toPrecision(5)} - 800 \\sin 2(${ans.toPrecision(5)})
				\\\\ &= ${d2Val.toPrecision(5)}
				\\\\ &< 0 
			`);
			sol += `Hence, ${math(`A,`)} as well as the amount of water is a maximum when ${math(`${theta}=${ans.toPrecision(3)}\\; \\blacksquare`)}`
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2020 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial(1);
		const lnX = new LnFn();
		const line = new Polynomial([2,-3]);
		const body = `The point ${math(`P`)} lies on the curve
			${math(`y = ${x} ${lnX}.`)} The tangent to the curve at
			${math(`P`)} is parallel to the line ${math(`y=${line}.`)}
		`;
		// part a
		(() => {
			const body = `Find the coordinates of ${math(`P.`)}`;
			let sol = alignStar(`y &= ${x} ${lnX}
				\\\\ ${dydx()} &= ${productRuleWorking(x, lnX).working}
				\\\\ &= \\ln x + 1
			`);
			sol += `Gradient of ${math(`y=${line}`)} is ${math(`2`)} so at ${math(`P,`)}`;
			sol += alignStar(`${dydx()} &= 2
				\\\\ \\ln x + 1 &= 2
				\\\\ \\ln x &= 1
				\\\\ x &= \\mathrm{e}
			`);
			const e = `\\mathrm{e}`;
			sol += `When ${math(`x=${e},`)}`
			sol += alignStar(`y = ${e} \\ln ${e} \\\\ &= ${e}`);
			sol += `Hence the coordinates of ${math(`P \\left( ${e}, ${e} \\right) \\; \\blacksquare`)}`
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const uplevel = `The normal to the curve 
				${math(`y = ${x} ${lnX}`)} at ${math(`P`)}
				meets the line ${math(`y=${line}`)} at the point
				${math(`Q.`)}
			`;
			const e = `\\mathrm{e}`;
			const body = `Show that the ${math(`x`)}-coordinate
				of ${math(`Q`)} is ${math(`k\\left(${e}+2\\right),`)}
				where ${math(`k`)} is a constant to be found.
			`;
			let sol = `Gradient of normal ${math(`= -\\frac{1}{2}`)}
				${newParagraph}
				Equation of normal
			`;
			sol += alignStar(` y - ${e} &= -\\frac{1}{2} \\left( x - ${e} \\right)
					\\\\ y &= -\\frac{1}{2} x + \\frac{1}{2}${e} + ${e}
					\\\\ &= -\\frac{1}{2} x + \\frac{3}{2}${e}			
			`);
			sol += `Equating the equations of the normal and ${math(`y=${line},`)}`;
			sol += alignStar(`-\\frac{1}{2} x + \\frac{3}{2}${e} &= ${line}
				\\\\ -\\frac{5}{2}x &= -3 - \\frac{3}{2}${e}
				\\\\ -\\frac{5}{2}x &= -\\frac{3}{2} \\left(2 +${e}\\right)
				\\\\ x &= \\frac{3}{5} \\left( ${e} + 2 \\right) \\; \\blacksquare
			`)
			sol += `Hence ${math(`\\displaystyle k = \\frac{3}{5} \\; \\blacksquare`)}`
			parts.push({ uplevel, body });
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
