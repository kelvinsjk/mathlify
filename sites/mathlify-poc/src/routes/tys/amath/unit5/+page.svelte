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

	const title = 'Unit 5: Exponential and Logarithmic Functions';

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

	//! Question 1: 2019 P1 Q10a
	//TODO: Indices
	(() => {
		const body = `TODO: indices`;
		const sol = ``;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2020 P1 Q2
	//TODO: indices
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const body = `TODO: indices`;
		// part a
		(() => {
			const body = ``;
			const sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = ``;
			const sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2020 P2 Q8
	//TODO: (a): exp, (c): linear law
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `TODO: Exp`;
			const sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Solve the equation`;
			let sol = `Equation of line AC
				
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `TODO: Linear law`;
			const sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2019 P1 Q5
	//TODO: exp
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2018 P1 Q1
	//TODO: Indices
	(() => {
		const body = `TODO: indices`;
		const sol = ``;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 6: 2018 P1 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `Show that`;
			let sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence solve the equation
			`;
			let sol = `
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2017 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `Show that`;
			let sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence solve the equation
			`;
			let sol = `
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 8: 2017 P2 Q7
	//TODO: exp
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 9: 2016 P2 Q7
	//TODO: exp
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2015 P1 Q2
	//TODO: graphs
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2015 P1 Q3
	//TODO: exp
	(() => {
		const body = `TODO: indices`;
		const sol = ``;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 12: 2014 P2 Q1
	//TODO: exp
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 13: 2014 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `Show that`;
			let sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence solve the equation
			`;
			let sol = `
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 14: 2013 P1 Q8
	//TODO: exp
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			const parts: QuestionType['parts'] = [];
			const solParts: QuestionType['parts'] = [];
			// part a
			(() => {
				const body = `TODO: Exp`;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part b
			(() => {
				const body = ``;
				let sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			// part c
			(() => {
				const body = ``;
				const sol = ``;
				parts.push({ body });
				solParts.push({ body: sol });
			})();
			questions.push({ parts });
			answers.push({ parts: solParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 15: 2013 P2 Q8b
	//TODO: exp
	(() => {
		const body = `TODO: indices`;
		const sol = ``;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 16: 2019 P2 Q4
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `Show that`;
			let sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence solve the equation
			`;
			let sol = `
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
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
