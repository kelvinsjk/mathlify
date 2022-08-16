<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import type { AnswerObject } from '$lib/interfaces';
	import {Fraction, Vector} from 'mathlify';

	// edit this
	const pageID = '01';
	const title = 'Eqns and Inequalities Test Page';
	// edit this

	import { qnLogics as qn0107} from './_logic/0107';
	const {a: qnLogic07a, b: qnLogic07b} = qn0107;
	import { qnLogics as qn040y } from './_logic/010y';
	const { qn9: qnLogic09 } = qn040y;
	import { qnLogics as qn0111} from './_logic/0111';
	const {a: qnLogic11a, b: qnLogic11b} = qn0111;
	import { qnLogics as qn041x } from './_logic/011x';
	const { qn2: qnLogic12, qn3: qnLogic13, } = qn041x;
	import { qnLogics as qn041y } from './_logic/011y';
	const { 
		qn5: qnLogic15, 
		qn6: qnLogic16, 
		qn7: qnLogic17, 
		qn8: qnLogic18,
		qn9: qnLogic19,
	} = qn041y;
	import { qnLogics as qn042x } from './_logic/042x';
	const { qn0: qnLogic20, qn1: qnLogic21 } = qn042x;
	

	const questions: {
		'id': string,
		qnLogic: (x:any)=> [AnswerObject, AnswerObject],
		args: any,
		text: string
	}[] = [
		{
			id: '0407a', 
			qnLogic: qnLogic07a, 
			args: {a: 3, b: -7, c: 2, d: 1, k: 1, lessThan: false}, 
			text: '2007 Paper 1 Question 1' 
		},
		{
			id: '0407b', 
			qnLogic: qnLogic07b,
			args: {xs: [350, 260, 490], coeffs: [115, 60, 55, 120, 45, 30, 215, 90, 65, 130, 25, 50]}, 
			text: '2007 Paper 2 Question 1' 
		},
		{
			id: '0409',
			qnLogic: qnLogic09,
			args: {a: new Fraction(3,2), b: new Fraction(-17,2), c: 17},
			text: '2009 Paper 1 Question 1'
		},
		{
			id: '0411a',
			qnLogic: qnLogic11a,
			args: { b: 1, c: 1, d: 2, e: -1, lessThan: true, numPositive: true },
			text: '2011 Paper 1 Question 1'
		},
		{
			id: '0411b',
			qnLogic: qnLogic11b,
			args: { coeffs: [0.215, -0.49, 3.281], xs: [-15, 21, 34] },
			text: '2011 Paper 1 Question 2'
		},
		{
			id: '0412',
			qnLogic: qnLogic12,
			args: {coeffs: [9, 6, 4, 7, 5, 3, 10,4,5], xs: [765, 985, 852]},
			text: '2012 Paper 1 Question 1'
		},
		{
			id: '0413',
			qnLogic: qnLogic13,
			args: {b: 1, c: 1, e: -1, can: true},
			text: '2013 Paper 1 Question 2'
		},
		{
			id: '1415',
			qnLogic: qnLogic15,
			args: {t1: 6, t2: 7, d: 2, r1: 2},
			text: '2015 Paper 1 Question 8'
		},
		{
			id: '0416',
			qnLogic: qnLogic16,
			args: {root1: -2, root2: new Fraction(1,3), root3: 4, lessThan: true, a: 1, b: 3},
			text: '2016 Paper 1 Question 1'
		},
		{
			id: '0417',
			qnLogic: qnLogic17,
			args: {a: 3, k: 52, n: 13, multiple: 100},
			text: '2017 Paper 2 Question 2'
		},
		{
			id: '0418',
			qnLogic: qnLogic18,
			args: {monthly: 100, a1: 2, a2: 10, multiple1: 30, multiple2: 28, n: 60},
			text: '2018 Paper 1 Question 11'
		},
		{
			id: '0419',
			qnLogic: qnLogic19,
			args: {base: 2, exponent: 6, sum: 14, n2: 11, terms: 4},
			text: '2019 Paper 1 Question 8'
		},
		{
			id: '0420',
			qnLogic: qnLogic20,
			args: {	
				a: 4,
				d: new Fraction(10-4,4),
				nAP1: 5,
				nAP2: 30,
				nAPStart: 21,
				nAPEnd: 50,
				rDen: 5, // r = (x-1)/x
				percentage: 98 // 75%-99%}
			},
			text: '2020 Paper 1 Question 8'
		},
		{
			id: '1421',
			qnLogic: qnLogic21,
			args: {start: 25, end: 40, isSwim: true, minutes: 8},
			text: '2021 Paper 2 Question 4'
		},

	]
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="prose mx-auto">
	<Header qn={title} />
	<div class="flex flex-wrap gap-2 my-4">
		{#each questions as qn}
		<a href="{`#${qn.id}`}">{qn.id}</a>
		{/each}
	</div>
	<main class="mx-4 dark:text-zinc-100">
		{#each questions as qn}
		<h1 id="{qn.id}" class="mt-8 negative-bottom">{qn.text}</h1>
		{@const [question, answer] = qn.qnLogic(qn.args)}
		<Answer answer={question} questionMode />
		<!--Attempt-->
		<Answer {answer} checked />
		{/each}
	</main>
	<!--Prev and next navigation-->
	<Footer {pageID} />
</div>

<style>
	.negative-bottom {
		margin-bottom: -2rem;
	}
</style>