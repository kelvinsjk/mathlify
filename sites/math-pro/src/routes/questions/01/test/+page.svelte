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

	import { qnLogics as qn0107} from '../_logic/0107';
	const {a: qnLogic07a, b: qnLogic07b} = qn0107;
	import { qnLogics as qn010y } from '../_logic/010y';
	const { qn9: qnLogic09 } = qn010y;
	import { qnLogics as qn0111} from '../_logic/0111';
	const {a: qnLogic11a, b: qnLogic11b} = qn0111;
	import { qnLogics as qn041x } from '../_logic/011x';
	const { qn2: qnLogic12, qn3: qnLogic13, } = qn041x;
	import { qnLogics as qn041y } from '../_logic/011y';
	const { 
		qn5: qnLogic15, 
		qn6: qnLogic16, 
		qn8: qnLogic18,
		qn9: qnLogic19,
	} = qn041y;
	import { qnLogics as qn012x } from '../_logic/012x';
	const { qn0: qnLogic20, qn1: qnLogic21 } = qn012x;
	

	const questions: {
		'id': string,
		qnLogic: (x:any)=> [AnswerObject, AnswerObject],
		args: any,
		text: string
	}[] = [
		{
			id: '0107a', 
			qnLogic: qnLogic07a, 
			args: {a: 3, b: -7, c: 2, d: 1, k: 1, lessThan: false}, 
			text: '2007 Paper 1 Question 1' 
		},
		{
			id: '0107b', 
			qnLogic: qnLogic07b,
			args: {xs: [350, 260, 490], coeffs: [115, 60, 55, 120, 45, 30, 215, 90, 65, 130, 25, 50]}, 
			text: '2007 Paper 2 Question 1' 
		},
		{
			id: '0109',
			qnLogic: qnLogic09,
			args: {a: new Fraction(3,2), b: new Fraction(-17,2), c: 17},
			text: '2009 Paper 1 Question 1'
		},
		{
			id: '0111a',
			qnLogic: qnLogic11a,
			args: { b: 1, c: 1, d: 2, e: -1, lessThan: true, numPositive: true },
			text: '2011 Paper 1 Question 1'
		},
		{
			id: '0111b',
			qnLogic: qnLogic11b,
			args: { coeffs: [0.215, -0.49, 3.281], xs: [-15, 21, 34], isIncreasing: true },
			text: '2011 Paper 1 Question 2'
		},
		{
			id: '0112',
			qnLogic: qnLogic12,
			args: {coeffs: [9, 6, 4, 7, 5, 3, 10,4,5], xs: [765, 985, 852]},
			text: '2012 Paper 1 Question 1'
		},
		{
			id: '0113',
			qnLogic: qnLogic13,
			args: {b: 1, c: 1, e: -1, can: true},
			text: '2013 Paper 1 Question 2'
		},
		{
			id: '0115',
			qnLogic: qnLogic15,
			args: {t1: 6, t2: 7, d: 2, r1: 2},
			text: '2015 Paper 1 Question 1'
		},
		{
			id: '0116',
			qnLogic: qnLogic16,
			args: {root1: -2, root2: new Fraction(1,3), root3: 4, lessThan: true, a: 1, b: 3},
			text: '2016 Paper 1 Question 1'
		},
		{
			id: '0118',
			qnLogic: qnLogic18,
			args: {a: 2, b: 3, c: -2, d: -1, lessThan: true},
			text: '2018 Paper 1 Question 4'
		},
		{
			id: '0119',
			qnLogic: qnLogic19,
			args: {base: 2, c: 10, k: 6, lessThan: true, equality: true},
			text: '2019 Paper 1 Question 4'
		},
		{
			id: '0120',
			qnLogic: qnLogic20,
			args: {	
				a: new Fraction(5,2),
				x1: 1,
				x2: 2,
				c: new Fraction(1,2)
			},
			text: '2020 Paper 2 Question 1'
		},
		{
			id: '0121',
			qnLogic: qnLogic21,
			args: {a: 4, b: -6, xMin: 1, x1: -1, d: 7},
			text: '2021 Paper 1 Question 1'
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