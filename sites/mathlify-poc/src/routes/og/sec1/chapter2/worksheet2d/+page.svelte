<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression, Fraction } from 'mathlify';
	import { alignStar, display } from 'mathlifier';

	const title = 'Fraction and mixed numbers';

	const evalString = 'Evaluate each of the following';
	const findVal = 'Find the value of each of the following';

	// TODO: show common denominator step
	// TODO: Mixed Fractions Q1 i-l
	// TODO: Multiplication and division

	//! Question 1
	const ab1s = [
		[new Fraction(1, 4), new Fraction(1, 3)],
		[new Fraction(5, 14), new Fraction(1, 2)],
		[new Fraction(-4, 5), new Fraction(3, 10)],
		[new Fraction(-2, 3), new Fraction(1, 12)],
		[new Fraction(6, 7), new Fraction(-3, 14)],
		[new Fraction(-4, 5), new Fraction(-3, 20)],
		[new Fraction(-1, 3), new Fraction(1, 15)],
		[new Fraction(-5, 12), new Fraction(-1, 6)]
	];
	const q1s: UnsimplifiedExpression[] = [];
	const w1s: (undefined | UnsimplifiedExpression)[] = [];
	const additionArray3 = [true, false, true, false, true, true, false, false];
	ab1s.forEach((ab, i) => {
		const [a, b] = ab;
		q1s.push(new UnsimplifiedExpression(a, { term: b, addition: additionArray3[i] }));
		if (b.is.negative()) {
			w1s.push(new UnsimplifiedExpression(a, { term: b.negative(), addition: !additionArray3[i] }));
		} else {
			w1s.push(undefined);
		}
	});

	//! Compiled questions
	const qArray = [q1s];
	const wArray = [w1s];
	const preamble = [findVal, evalString];

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
