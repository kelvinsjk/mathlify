<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import type { AnswerObject } from '$lib/interfaces';
	import {Fraction, Vector} from 'mathlify';

	// edit this
	const pageID = '14';
	const title = 'Complex Numbers Test Page';
	// edit this

	import { qnLogics as qn120y } from '../_logic/140y';
	const { qn7: qnLogic07, } = qn120y;
	import { qnLogics as qn1408 } from '../_logic/1408';
	const { a: qnLogic08a, b: qnLogic08b } = qn1408;
	import { qnLogics as qn1410 } from '../_logic/1410';
	const { a: qnLogic10a, b: qnLogic10b } = qn1410;
	import { qnLogics as qn121x } from '../_logic/141x';
	const { qn1: qnLogic11, qn2: qnLogic12 } = qn121x;
	import { qnLogics as qn1413 } from '../_logic/1413';
	const { a: qnLogic13a, b: qnLogic13b } = qn1413;
	import { qnLogics as qn1414 } from '../_logic/1414';
	const { a: qnLogic14a, b: qnLogic14b } = qn1414;
	import { qnLogics } from '../_logic/141y';
	const { qn5: qnLogic15, qn6: qnLogic16, qn7: qnLogic17, qn8: qnLogic18, } = qnLogics;
	import { qnLogics as qn1419 } from '../_logic/1419';
	const { a: qnLogic19a, b: qnLogic19b } = qn1419;
	import { qnLogics as qn1420 } from '../_logic/1420';
	const { a: qnLogic20a, b: qnLogic20b } = qn1420;
	import { qnLogics as qn1421 } from '../_logic/1421';
	const { a: qnLogic21a, b: qnLogic21b } = qn1421;
	

	const questions: {
		'id': string,
		qnLogic: (x:any)=> [AnswerObject, AnswerObject],
		args: any,
		text: string
	}[] = [
		{
			id: '1407', 
			qnLogic: qnLogic07, 
			args: {a: -1, b: 2, k: 2}, 
			text: '2007 Paper 1 Question 3' 
		},
		{
			id: '1408a', 
			qnLogic: qnLogic08a,
			args: {
				x: 1, y: 3, k: -1
			}, 
			text: '2008 Paper 1 Question 11' 
		},
		{
			id: '1408b', 
			qnLogic: qnLogic08b,
			args: {
				wOnTop: true, n: 5, condition: 1
			}, 
			text: '2008 Paper 2 Question 3' 
		},
		{
			id: '1410a',
			qnLogic: qnLogic10a,
			args: {k1: new Fraction(1,3), k2: new Fraction(-3,4)}, 
			text: '2010 Paper 1 Question 10'
		},
		{
			id: '1410b',
			qnLogic: qnLogic10b,
			args: {x1: 3, y1: 5, x2: -2, y2: 1, x3: -2, x4: 2}, 
			text: '2010 Paper 2 Question 1'
		},
		{
			id: '1411',
			qnLogic: qnLogic11,
			args: {
				k: 2, quadrant: 2, b: 4
			}, 
			text: '2011 Paper 1 Question 11'
		},
		{
			id: '1412',
			qnLogic: qnLogic12,
			args: {a: 1, xUnknown: false},
			text: '2012 Paper 1 Question 6'
		},
		{
			id: '1413a',
			qnLogic: qnLogic13a,
			args: {x: 1, y: 2, a: -59, b: 27},
			text: '2013 Paper 1 Question 4'
		},
		{
			id: '1413b',
			qnLogic: qnLogic13b,
			args: {k: new Fraction(-1,3), n: 10},
			text: '2013 Paper 1 Question 8'
		},
		{
			id: '1414a',
			qnLogic: qnLogic14a,
			args: {x: 1, y: 2, n1: 2, n2: 3, real: true},
			text: '2014 Paper 1 Question 5'
		},
		{
			id: '1414b',
			qnLogic: qnLogic14b,
			args: {k: new Fraction(-1,6), n: 6, divide: true, positive: false},
			text: '2014 Paper 2 Question 4'
		},
		{
			id: '1415',
			qnLogic: qnLogic15,
			args: {divideCase: 1, real: false},
			text: '2015 Paper 1 Question 9'
		},
		{
			id: '1416',
			qnLogic: qnLogic16,
			args: {x1: -1, y1: 5, x2: 2, y2: 3, positive: true, a: 3, z3: 3},
			text: '2016 Paper 1 Question 7'
		},
		{
			id: '1417',
			qnLogic: qnLogic17,
			args: {alphaCase: 1, quadrant1: 4, positiveBeta: false, quadrant2: 4, x: 2, y: 5},
			text: '2017 Paper 1 Question 8'
		},
		{
			id: '1418',
			qnLogic: qnLogic18,
			args: {x1: 2, y1: -3, x3: new Fraction(1,2), k: 3},
			text: '2018 Paper 2 Question 2'
		},
		{
			id: '1419a',
			qnLogic: qnLogic19a,
			args: {x: 2, y: 1, x3: -3},
			text: '2019 Paper 1 Question 1'
		},
		{
			id: '1419b',
			qnLogic: qnLogic19b,
			args: {k: 3, real: false},
			text: '2019 Paper 1 Question 9ii'
		},
		{
			id: '1420a',
			qnLogic: qnLogic20a,
			args: {k1: new Fraction(1,3), k2: new Fraction(-1,4), k3: new Fraction(1,6), real: false},
			text: '2020 Paper 1 Question 4'
		},
		{
			id: '1420b',
			qnLogic: qnLogic20b,
			args: {c: -4, k: 2, x: 2, y: 1},
			text: '2020 Paper 1 Question 6'
		},
		{
			id: '1421a',
			qnLogic: qnLogic21a,
			args: {k: new Fraction(1,4), positive: false},
			text: '2021 Paper 1 Question 4'
		},
		{
			id: '1421b',
			qnLogic: qnLogic21b,
			args: {a: 1, b: new Fraction(1,2), positive: false},
			text: '2021 Paper 2 Question 1'
		},
	]
	const checked = true;
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