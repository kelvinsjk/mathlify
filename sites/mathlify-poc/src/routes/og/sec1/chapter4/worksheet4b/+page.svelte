<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression, Fraction, Term } from 'mathlify';
	import { alignStar, display } from 'mathlifier';

	const title = 'Addition and subtraction of linear terms';

	const simplifyString = 'Simplify each of the following';

	// TODO: Word problems: sum/subtract

	//! Question 1
	const ab1s = [
		[new Term(7, 'x'), new Term(4, 'x')],
		[new Term(5, 'x'), new Term(2, 'x')],
		[new Term(8, 'x'), new Term(-3, 'x')],
		[new Term(-6, 'x'), 'x'],
		[new Term(-2, 'x'), new Term(9, 'x')],
		[new Term(-4, 'x'), new Term(-5, 'x')],
	];
	const additionArray3 = [true, false, true, true, false, false];
	const q1s: UnsimplifiedExpression[] = [];
	const w1s: (undefined | UnsimplifiedExpression)[] = [];
	ab1s.forEach((ab, i) => {
		const [a, b] = ab;
		q1s.push(new UnsimplifiedExpression(a, { term: b, addition: additionArray3[i] }));
		if (b instanceof Term && b.coeff.is.negative()) {
			w1s.push(new UnsimplifiedExpression(a, { term: b.negative(), addition: !additionArray3[i] }));
		} else {
			w1s.push(undefined);
		}
	});
	//! Question 2
	const q2s = [
		// a
		new UnsimplifiedExpression(
			new Term(3, 'x'),
			10,
			{ term: new Term(6, 'x'), addition: false },
			5,
		),
		// b
		new UnsimplifiedExpression(new Term(9, 'x'), { term: 4, addition: false }, new Term(-1, 'x'), {
			term: -1,
			addition: false,
		}),
		// c
		new UnsimplifiedExpression(new Term(5, 'x'), new Term(8, 'y'), new Term(7, 'x'), {
			term: 'y',
			addition: false,
		}),
		// d
		new UnsimplifiedExpression(
			new Term(4, 'y'),
			{ term: new Term(10, 'x'), addition: false },
			{ term: new Term(3, 'y'), addition: false },
			new Term(6, 'x'),
		),
		// e
		new UnsimplifiedExpression(
			new Term(-9, 'x'),
			{ term: new Term(2, 'y'), addition: false },
			new Term(-1, 'x'),
			{ term: new Term(-2, 'y'), addition: false },
		),
		// f
		new UnsimplifiedExpression(
			new Term(-8, 'y'),
			new Term(-3, 'x'),
			{ term: new Term(5, 'y'), addition: false },
			new Term(-4, 'x'),
		),
		// g
		new UnsimplifiedExpression(
			new Term(4, 'x'),
			{ term: 'y', addition: false },
			12,
			new Term(5, 'y'),
			{ term: 9, addition: false },
			{ term: new Term(9, 'x'), addition: false },
		),
		// h
		new UnsimplifiedExpression(
			3,
			{ term: new Term(6, 'y'), addition: false },
			new Term(-2, 'x'),
			{ term: 8, addition: false },
			{ term: new Term(-7, 'y'), addition: false },
			'x',
		),
	];
	const w2s = [
		,
		// a
		new UnsimplifiedExpression(
			new Term(9, 'x'),
			{ term: 4, addition: false },
			{ term: new Term(1, 'x'), addition: false },
			1,
		), // c,d
		,
		,
		new UnsimplifiedExpression(
			new Term(-9, 'x'),
			{ term: new Term(2, 'y'), addition: false },
			{ term: new Term(1, 'x'), addition: false },
			new Term(2, 'y'),
		),
		new UnsimplifiedExpression(
			new Term(-8, 'y'),
			{ term: new Term(3, 'x'), addition: false },
			{ term: new Term(5, 'y'), addition: false },
			{ term: new Term(4, 'x'), addition: false },
		), //g
		,
		new UnsimplifiedExpression(
			3,
			{ term: new Term(6, 'y'), addition: false },
			{ term: new Term(2, 'x'), addition: false },
			{ term: 8, addition: false },
			new Term(7, 'y'),
			'x',
		),
	];

	//! Compiled questions
	const qArray = [q1s, q2s];
	const wArray = [w1s, w2s];
	const preamble = [simplifyString, simplifyString];

	const questions: QuestionType[] = [];
	qArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			const working = wArray[i][j];
			if (working) {
				if (i === 1) {
					// multi line
					parts.push({
						body: alignStar(`& ${q}
							\\\\ &= ${wArray[i][j]}
							\\\\ &= ${q.simplify()}`),
					});
				} else {
					parts.push({
						body: alignStar(`${q} &= ${wArray[i][j]}
							\\\\ &= ${q.simplify()}`),
					});
				}
			} else {
				if (i === 1) {
					// multiline
					parts.push({
						body: alignStar(`& ${q}
							\\\\ &= ${q.simplify()}`),
					});
				} else {
					parts.push({
						body: display(`${q} = ${q.simplify()}`),
					});
				}
			}
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble[i]}`,
			parts: parts,
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h2 id="title">{title}</h2>
	{#each questions as question}
		<Question {question} />
	{/each}
</section>
