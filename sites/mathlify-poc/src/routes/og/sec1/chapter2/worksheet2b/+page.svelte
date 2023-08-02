<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression } from 'mathlify';
	import { alignStar, display } from 'mathlifier';

	const title = 'Addition and subtraction involving negative integers';

	const evalString = 'Evaluate each of the following';
	const findVal = 'Find the value of each of the following';

	// TODO: Q4: Simplify terms one by one

	//! Question 1
	const a1 = 2,
		b1 = 9;
	const q1s = [
		new UnsimplifiedExpression(a1, b1),
		new UnsimplifiedExpression(-a1, b1),
		new UnsimplifiedExpression(a1, -b1),
		new UnsimplifiedExpression({ term: -a1, brackets: 'always' }, -b1)
	];
	const w1s = [
		,
		,
		new UnsimplifiedExpression(a1).minus(b1),
		new UnsimplifiedExpression(-a1).minus(b1)
	];
	//! Question 2
	const a2 = 4,
		b2 = 7;
	const q2s = [
		new UnsimplifiedExpression(a2).minus(b2),
		new UnsimplifiedExpression(-a2).minus(b2),
		new UnsimplifiedExpression(a2).minus(-b2),
		new UnsimplifiedExpression({ term: -a2, brackets: 'always' }).minus(-b2)
	];
	const w2s = [
		,
		,
		new UnsimplifiedExpression(a2).plus(b2),
		new UnsimplifiedExpression(-a2).plus(b2)
	];
	//! Question 3
	const ab3s = [
		[12, -15],
		[-80, 70],
		[26, 91],
		[-28, 28],
		[17, -53],
		[-49, -34],
		[84, -20],
		[-36, -36]
	];
	const q3s: UnsimplifiedExpression[] = [];
	const w3s: (undefined | UnsimplifiedExpression)[] = [];
	const additionArray3 = [true, true, false, false, true, true, false, false];
	ab3s.forEach((ab, i) => {
		const [a, b] = ab;
		q3s.push(new UnsimplifiedExpression(a, { term: b, addition: additionArray3[i] }));
		if (b < 0) {
			w3s.push(new UnsimplifiedExpression(a, { term: -b, addition: !additionArray3[i] }));
		} else {
			w3s.push(undefined);
		}
	});
	//! Question 4
	const abc4s = [
		[6, -3, -2],
		[40, 90, 30],
		[18, -25, -70],
		[12, -31, -45],
		[-24, 16, -10],
		[-33, 33, -87],
		[-49, -21, -15],
		[-27, -19, -24]
	];
	const additionArray4: [boolean, boolean][] = [
		[true, true],
		[false, false],
		[false, true],
		[false, false],
		[true, true],
		[false, true],
		[false, true],
		[false, false]
	];
	const q4s: UnsimplifiedExpression[] = [];
	const w4s: (undefined | UnsimplifiedExpression)[] = [];
	abc4s.forEach((abc, i) => {
		const [a, b, c] = abc;
		q4s.push(
			new UnsimplifiedExpression(
				a,
				{ term: b, addition: additionArray4[i][0] },
				{ term: c, addition: additionArray4[i][1] }
			)
		);
		if (b < 0) {
			if (c < 0) {
				w4s.push(
					new UnsimplifiedExpression(
						a,
						{ term: -b, addition: !additionArray4[i][0] },
						{ term: -c, addition: !additionArray4[i][1] }
					)
				);
			} else {
				w4s.push(
					new UnsimplifiedExpression(
						a,
						{ term: -b, addition: !additionArray4[i][0] },
						{ term: c, addition: additionArray4[i][1] }
					)
				);
			}
		} else if (c < 0) {
			w4s.push(
				new UnsimplifiedExpression(
					a,
					{ term: b, addition: additionArray4[i][0] },
					{ term: -c, addition: !additionArray4[i][1] }
				)
			);
		} else {
			w4s.push(undefined);
		}
	});

	//! Compiled questions
	const qArray = [q1s, q2s, q3s, q4s];
	const wArray = [w1s, w2s, w3s, w4s];
	const preamble = [evalString, evalString, findVal, findVal];

	const questions: QuestionType[] = [];
	qArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			const working = wArray[i][j];
			if (working) {
				if (i === 3) {
					// multi line
					parts.push({
						body: alignStar(`& ${q}
							\\\\ &= ${wArray[i][j]}
							\\\\ &= ${q.simplify()}`)
					});
				} else {
					parts.push({
						body: alignStar(`${q} &= ${wArray[i][j]}
							\\\\ &= ${q.simplify()}`)
					});
				}
			} else {
				parts.push({
					body: display(`${q} = ${q.simplify()}`)
				});
			}
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble[i]}`,
			parts: parts
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
