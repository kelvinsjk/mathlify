<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression, Fraction, UnsimplifiedTerm } from 'mathlify';
	import { alignStar, display } from 'mathlifier';

	const title = 'Fraction and mixed numbers';

	const evalString = 'Evaluate each of the following';
	const findVal = 'Find the value of each of the following';

	// TODO: show common denominator step
	// TODO: Mixed Fractions Q1 i-l

	//! Question 1
	const ab1s = [
		[new Fraction(1, 4), new Fraction(1, 3)],
		[new Fraction(5, 14), new Fraction(1, 2)],
		[new Fraction(-4, 5), new Fraction(3, 10)],
		[new Fraction(-2, 3), new Fraction(1, 12)],
		[new Fraction(6, 7), new Fraction(-3, 14)],
		[new Fraction(-4, 5), new Fraction(-3, 20)],
		[new Fraction(-1, 3), new Fraction(1, 15)],
		[new Fraction(-5, 12), new Fraction(-1, 6)],
	];
	const q1s: UnsimplifiedExpression[] = [];
	const w1s: (undefined | UnsimplifiedExpression)[] = [];
	const additionArray1 = [true, false, true, false, true, true, false, false];
	ab1s.forEach((ab, i) => {
		const [a, b] = ab;
		q1s.push(new UnsimplifiedExpression(a, { term: b, addition: additionArray1[i] }));
		if (b.is.negative()) {
			w1s.push(new UnsimplifiedExpression(a, { term: b.negative(), addition: !additionArray1[i] }));
		} else {
			w1s.push(undefined);
		}
	});

	//! Question 2
	// q2a, 2e, 2i, 2j
	const ab2s = [
		[new Fraction(3, 10), new Fraction(20, 27)],
		[new Fraction(1, 2), new Fraction(-34, 15)],
		[new Fraction(22, 9), new Fraction(11, 6)],
		[new Fraction(25, 7), new Fraction(-40, 49)],
	];
	const multiplicationArray2 = [true, true, false, false];
	const q2s: UnsimplifiedTerm[] = [];
	const w2s: (undefined | UnsimplifiedTerm)[] = [];
	ab2s.forEach((ab, i) => {
		const [a, b] = ab;
		q2s.push(new UnsimplifiedTerm(a, { termAtom: b, multiplication: multiplicationArray2[i] }));
		if (!multiplicationArray2[i]) {
			w2s.push(new UnsimplifiedTerm(a, { termAtom: b.reciprocal(), multiplication: true }));
		} else {
			w2s.push(undefined);
		}
	});

	//! Compiled questions
	const qArray = [q1s, q2s];
	const wArray = [w1s, w2s];
	const preamble = [findVal, evalString];

	const questions: QuestionType[] = [];
	qArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			const working = wArray[i][j];
			if (working) {
				if (i === 1 && j === 3) {
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
				parts.push({
					body: display(`${q} = ${q.simplify()}`),
				});
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
