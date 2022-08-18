<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import type { AnswerObject } from '$lib/interfaces';
	import {Fraction, Vector} from 'mathlify';

	// edit this
	const pageID = '04';
	const title = 'AP/GP Test Page';
	// edit this

	import { qnLogics as qn040y } from '../_logic/040y';
	const { qn7: qnLogic07, qn8: qnLogic08, qn9: qnLogic09 } = qn040y;
	import { qnLogics as qn041x } from '../_logic/041x';
	const { qn0: qnLogic10, qn1: qnLogic11, qn2: qnLogic12, qn3: qnLogic13, qn4: qnLogic14 } = qn041x;
	import { qnLogics as qn041y } from '../_logic/041y';
	const { 
		qn5: qnLogic15, 
		qn6: qnLogic16, 
		qn7: qnLogic17, 
		qn8: qnLogic18,
		qn9: qnLogic19,
	} = qn041y;
	import { qnLogics as qn042x } from '../_logic/042x';
	const { qn0: qnLogic20, qn1: qnLogic21 } = qn042x;
	

	const questions: {
		'id': string,
		qnLogic: (x:any)=> [AnswerObject, AnswerObject],
		args: any,
		text: string
	}[] = [
		{
			id: '0407', 
			qnLogic: qnLogic07, 
			args: {m: 4, n: 6, k: 4}, 
			text: '2007 Paper 1 Question 10' 
		},
		{
			id: '0408', 
			qnLogic: qnLogic08, 
			args: {startingAmount: 10, percentage1: 30, percentage2: 2, xTimes: 200, years: 2}, 
			text: '2008 Paper 1 Question 10' 
		},
		{
			id: '0409',
			qnLogic: qnLogic09,
			args: {divisor: 4, start: 20, k: 12}, 
			text: '2009 Paper 1 Question 8'
		},
		{
			id: '0410',
			qnLogic: qnLogic10,
			args: {a:2, b:0},
			text: '2010 Paper 1 Question 3'
		},
		{
			id: '0411',
			qnLogic: qnLogic11,
			args: {start: 256, d: 7, end: 10, n: 10, num: 8, den: 9, percentageCase: 2},
			text: '2011 Paper 1 Question 9'
		},
		{
			id: '0412',
			qnLogic: qnLogic12,
			args: {startingAmount: 100, percentage1: 10, percentage2: 5, xTimes: 50},
			text: '2012 Paper 2 Question 4'
		},
		{
			id: '0413',
			qnLogic: qnLogic13,
			args: {x: 7, y: 1, z: -1},
			text: '2013 Paper 1 Question 7'
		},
		{
			id: '0414',
			qnLogic: qnLogic14,
			args: {base: 4, distance1: 5, stageNo: 10, distance2: 10},
			text: '2014 Paper 2 Question 3'
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
			args: {m1: 3, m2a: 5, m3a: 3, n1: 4, n2a: 3, n3a: 7},
			text: '2016 Paper 1 Question 4'
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