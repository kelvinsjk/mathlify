<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import type { AnswerObject } from '$lib/interfaces';
	import {Fraction, Vector} from 'mathlify';

	const pageID = '13';
	const title = 'Vectors II Test Page';

	import { qnLogics as qn120y } from './_logic/130y';
	const { qn7: qnLogic07, qn8: qnLogic08, qn9: qnLogic09, } = qn120y;
	import { qnLogics as qn121x } from './_logic/131x';
	const { qn0: qnLogic10, qn1: qnLogic11, qn2: qnLogic12, qn3: qnLogic13, qn4: qnLogic14 } = qn121x;
	import { qnLogics } from './_logic/131y';
	const { qn5: qnLogic15, qn6: qnLogic16, qn7: qnLogic17, qn8: qnLogic18, qn9: qnLogic19 } = qnLogics;
	import { qnLogics as qn132x } from './_logic/132x';
	const { qn0: qnLogic20, qn1: qnLogic21 } = qn132x;

	const questions: {
		'id': string,
		qnLogic: (x:any)=> [AnswerObject, AnswerObject],
		args: any,
		text: string
	}[] = [
		{
			id: '1307', 
			qnLogic: qnLogic07, 
			args: {a: new Vector(1,2,4), b: new Vector(-2,3,1), n: new Vector(3,-1,2), lambda: new Fraction(-1,2)}, 
			text: '2007 Paper 1 Question 8' 
		},
		{
			id: '1308', 
			qnLogic: qnLogic08,
			args: {
				n1: new Vector(2,-5,3), n2: new Vector(3,2,-5), n3: new Vector(5, new Fraction(-209,10), 17),
				rhs1: new Fraction(3), rhs2: new Fraction(-5), rhs3: new Fraction(166,10), b: new Vector(1,-1,3)
			}, 
			text: '2008 Paper 1 Question 11' 
		},
		{
			id: '1309', 
			qnLogic: qnLogic09,
			args: {n1: new Vector(2,1,3), n2: new Vector(-1,2,1), rhs1: 1, rhs2: 2, a: new Vector(2,3,4)}, 
			text: '2009 Paper 1 Question 10'
		},
		{
			id: '1310',
			qnLogic: qnLogic10,
			args: {pt: new Vector(10,-1,-3), n: new Vector(1,-2,-3), k: -3, rhs: new Fraction(0), lambda: 4}, 
			text: '2010 Paper 1 Question 10'
		},
		{
			id: '1311',
			qnLogic: qnLogic11,
			args: {
				pt1: new Vector(4,-1,-3), pt2: new Vector(-2,-5,2), pt3: new Vector(4,-3,-2),
				a1: new Vector(1,2,-3), d1: new Vector(2,-4,1), a2: new Vector(-2,1,3), d2: new Vector(1,5,-7),			
			}, 
			text: '2011 Paper 1 Question 11'
		},
		{
			id: '1312',
			qnLogic: qnLogic12,
			args: {a: new Vector(7,8,9), b:new Vector(-1,-8,1), c: new Vector(1,8,3)},
			text: '2012 Paper 1 Question 9'
		},
		{
			id: '1313',
			qnLogic: qnLogic13,
			args: {n1: new Vector(2,-2,1), n2: new Vector(-6,3,2), rhs1: 1, rhs2: -1, aX: 4, aY: 3},
			text: '2013 Paper 2 Question 4'
		},
		{
			id: '1314',
			qnLogic: qnLogic14,
			args: {a: new Vector(1,-1,3), dPrime: new Vector(4,1,2), nQ: new Vector(-1,2,1), rhs: new Fraction(12), d: new Vector(2,-1,4)},
			text: '2014 Paper 1 Question 9'
		},
		{
			id: '1315',
			qnLogic: qnLogic15,
			args: {a: new Vector(1,-2,-4), d: new Vector(2,3,-6), p: new Vector(2,5,-6)},
			text: '2015 Paper 1 Question 7'
		},
		{
			id: '1316',
			qnLogic: qnLogic16,
			args: {a1: new Vector(1,-3,2), dp1: new Vector(1,2,0), dp2: new Vector(0,4,-2), a2: new Vector(-1,0,1), n: new Vector(-2,1,2), distance: 12},
			text: '2016 Paper 1 Question 5'
		},
		{
			id: '1317',
			qnLogic: qnLogic17,
			args: {d: new Vector(3,1,-2), p: new Vector(1,2,-1), q: new Vector(5, 7, -3)},
			text: '2017 Paper 1 Question 10'
		},
		{
			id: '1318',
			qnLogic: qnLogic18,
			args: {a: new Vector(5,-4,1), b: new Vector(5,4,0), c: new Vector(-5,4,2), eZ: 10},
			text: '2018 Paper 2 Question 3'
		},
		{
			id: '1319',
			qnLogic: qnLogic19,
			args: {d: new Vector(-2,-3,-6), n: new Vector(1,1,1), rhs1: 1, rhs2: -9, p: new Vector(2,2,4), s: new Vector(-5,-6,-7)},
			text: '2019 Paper 1 Question 12'
		},
		{
			id: '1320',
			qnLogic: qnLogic20,
			args: {d1: new Vector(1,1,0), d2: new Vector(1,-5,-2), n2: new Vector(4,5,-6)},
			text: '2020 Paper 1 Question 1'
		},
		{
			id: '1321',
			qnLogic: qnLogic21,
			args: {a1: new Vector(3,2,0), d1: new Vector(2,-3,1), a2: new Vector(-4,1,-3), d2: new Vector(1,2,4), b: new Vector(1,-3,-1)},
			text: '2021 Paper 1 Question 8'
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