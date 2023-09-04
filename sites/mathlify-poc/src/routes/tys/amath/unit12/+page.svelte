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
		cramersRule,
		ExpFn,
		LnFn,
		xPolynomial,
		RationalTerm,
		InequalityWorking,
		CosFn,
		SinFn,
	} from 'mathlify';
	import {
		align,
		alignStar,
		alignatStar,
		display,
		eqn,
		gatherStar,
		math,
		newline,
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

	//! Question 1: 2017 P2 Q8a
	//TODO: diagram (right angle triangle)
	(() => {
		const theta = '\\theta';
		const cosTheta = new CosFn(theta);
		const body = `Given that ${math(`${theta}`)}
			is acute and ${math(`${cosTheta} = c,`)}
			express, in terms of ${math(`c,`)}
		`;
		const parts = [
			{ body: `${math(`\\tan ${theta},`)}` },
			{ body: `${math(`\\cosec ${theta}.`)}` },
		];
		const adj = 'c';
		const hyp = 1;
		const opp = `\\sqrt{${hyp ** 2}-${adj}^2}`;
		const solA = `By Pythagoras' Theorem,
			${gatherStar(`\\textrm{opposite side} = ${opp}
				\\\\ \\tan ${theta} = \\frac{${opp}}{${adj}} \\; \\blacksquare
			`)}
		`;
		const solB = alignStar(`\\cosec \\theta &= 1 \\div \\sin ${theta}
			\\\\ &= 1 \\div \\frac{${opp}}{${hyp}}
			\\\\ &= \\frac{${hyp}}{${opp}} \\; \\blacksquare
		`);
		const solParts = [{ body: solA }, { body: solB }];
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2019 P1 Q12
	// TODO: graphs
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sin = new SinFn(new Polynomial(2), { coeff: 2 });
		const halfX = `\\left( \\frac{x}{2} \\right)`;
		const cos = `3 \\cos ${halfX}`;
		const cosMinus1 = `3 \\cos ${halfX} - 1`;
		const body = `It is given that ${math(`${fx} = ${sin}`)}
			and ${math(`${gx} = ${cosMinus1}.`)}
		`;
		// part a
		(() => {
			const body = `State the least and greatest values of ${math(`${fx}.`)}`;
			const sol = `Least value of ${math(`${fx}: -2 \\; \\blacksquare`)}
				${newline}
				Greatest value of ${math(`${fx}: 2 \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `State the least and greatest values of ${math(`${gx}.`)}`;
			const sol = `Least value of ${math(`${gx}: -4 \\; \\blacksquare`)}
				${newline}
				Greatest value of ${math(`${fx}: 2 \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `State the period of ${math(`${fx}.`)}`;
			const sol = `Period of ${math(`${fx}: 180${degree} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `State the period of ${math(`${gx}.`)}`;
			const sol = `Period of ${math(`${fx}: 720${degree} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part e
		// TODO: graphs
		(() => {
			const body = `Sketch, on the same axes, the graphs of
				${math(`y=${fx}`)} and ${math(`y=${gx}`)}
				for ${math(`0${degree} \\leq x \\leq 360${degree}.`)}
			`;
			const sol = `TODO: graph`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part f
		(() => {
			const body = `State the number of solutions of the equation
				${display(`${sin} + 1 = ${cos}`)}
				for ${math(`0${degree} \\leq x \\leq 360${degree}.`)}
			`;
			const sol = `3 solutions ${math(`\\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2020 P2 Q8
	//TODO: graph
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `State the values between which each of the
				following must lie:
			`;
			const subparts = [
				{ body: `the principal value of ${math(`\\sin^{-1} x,`)}` },
				{ body: `the principal value of ${math(`\\cos^{-1} x.`)}` },
			];
			const solSubparts = [
				{ body: `${math(`-\\frac{\\pi}{2} \\leq x \\leq \\frac{\\pi}{2} \\; \\blacksquare`)}` },
				{ body: `${math(`0 \\leq x \\leq \\pi \\; \\blacksquare`)}` },
			];
			parts.push({ body, parts: subparts });
			solParts.push({ parts: solSubparts });
		})();
		// part b
		(() => {
			const body = `The figure shows part of the graph of
				${math(`\\displaystyle y = a \\cos \\frac{x}{b} + c.`)}
				Find the value of each of the constants
				${math(`a,b`)} and ${math(`c.`)}
			`;
			const sol = alignStar(`a &= -1 \\; \\blacksquare
				\\\\ \\frac{2\\pi}{\\frac{1}{b}} &= 12 \\pi
				\\\\ b &= 6 \\; \\blacksquare
				\\\\ c &= 2 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2013 P2 Q6
	//TODO: graph
	(() => {
		const sin = new SinFn(new Polynomial(3));
		const body = `Given that ${math(`y=p + q ${sin},`)}
			where ${math(`p`)} and ${math(`q`)} are positive integers.
		`;
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `state the period of ${math(`y.`)}`;
			const sol = alignStar(`&\\textrm{Period}
				\\\\ &= \\frac{360${degree}}{3}
				\\\\ &= 120${degree} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const uplevel = `Given that the maximum and minimum values of
				${math(`y`)} are ${math(`6`)}
				and ${math(`-2`)} respectively, find
			`;
			const body = `the amplitude of ${math(`y,`)}`;
			const sol = alignStar(`&\\textrm{Amplitude}
				\\\\ &= \\frac{6-(-2)}{2}
				\\\\ &= 4 \\; \\blacksquare
			`);
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `the value of ${math(`p`)}
				and of ${math(`q.`)}
			`;
			const sol = alignStar(`q &= 4 \\; \\blacksquare
				\\\\ p &= 2 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const uplevel = `Using the values of ${math(`p`)}
				and ${math(`q`)} found in part (iii),
			`;
			const body = `find, in degrees, the smallest positive value of
				${math(`x`)} for which ${math(`y=0,`)}
			`;
			const lhs = new Expression(2, sin.times(4));
			const alpha = 30;
			let sol = gatherStar(`${lhs} = 0
				\\\\ ${sin} = -\\frac{1}{2}
			`);
			sol += alignStar(`\\textrm{Basic angle } \\alpha &= ${alpha}${degree}
				\\\\ 3x &= 180${degree} + ${alpha}${degree}
				\\\\ \\textrm{Smallest positive value of } x &= \\frac{180${degree} + ${alpha}${degree}}{3}
				\\\\ &= 70${degree} \\; \\blacksquare
			`);
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part e
		(() => {
			const body = `sketch the graph of ${math(`y`)}
				for ${math(`0^\\circ \\leq x \\leq 240^\\circ.`)}
			`;
			const sol = `TODO: graph`;
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
