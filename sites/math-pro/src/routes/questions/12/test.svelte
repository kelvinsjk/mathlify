<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import {Vector} from 'mathlify';

	const pageID = '12';
	const title = 'Vectors I Test Page';

	import qnLogic11a from './_logic/1211a';
	import qnLogic11b from './_logic/1211b';
	import { qnLogics as qn120y } from './_logic/120y';
	const { qn7: qnLogic07, qn8: qnLogic08, qn9: qnLogic09, } = qn120y;
	import { qnLogics as qn121x } from './_logic/121x';
	const { qn0: qnLogic10, qn2: qnLogic12, qn3: qnLogic13, qn4: qnLogic14 } = qn121x;
	import { qnLogics } from './_logic/121y';
	const { qn5: qnLogic15, qn6: qnLogic16, qn8: qnLogic18, qn9: qnLogic19 } = qnLogics;

	const questions = [
		{
			id: '1207', 
			qnLogic: qnLogic07, 
			args: {a: new Vector(1,-1,2), b: new Vector(2,4,1), c: new Vector(-4,2,2), lambda: 1, mu:2}, 
			text: '2007 Paper 1 Question 6' 
		},
		{
			id: '1208', 
			qnLogic: qnLogic08,
			args: {a: new Vector(1,4,-3), b: new Vector(5,-1)}, 
			text: '2008 Paper 1 Question 3' 
		},
		{
			id: '1209', 
			qnLogic: qnLogic09,
			args: {p1: new Vector(6,-2,3), k: 2, q: new Vector(-1,-9,-4), l: 2, m: 1}, 
			text: '2009 Paper 2 Question 2'
		},
		{
			id: '1210',
			qnLogic: qnLogic10,
			args: {a: new Vector(2,3,6), b:new Vector(1,-2,2)}, 
			text: '2010 Paper 1 Question 1'
		},
		{
			id: '1211a',
			qnLogic: qnLogic11a,
			args: {l1: 1, m1: 2, l2: 3, m2: 2}, 
			text: '2011 Paper 1 Question 7i'
		},
		{
			id: '1211b',
			qnLogic: qnLogic11b,
			args: {a: new Vector(2,-6,3), b:new Vector(1,1,-2)},
			text: '2011 Paper 1 Question 7ii'
		},
		{
			id: '1212',
			qnLogic: qnLogic12,
			args: {a: new Vector(1,-1,1), b:new Vector(1,2), m1: 6, l2: 1, m2: 4},
			text: '2012 Paper 1 Question 5'
		},
		{
			id: '1213',
			qnLogic: qnLogic13,
			args: {l: 3, m:4},
			text: '2013 Paper 1 Question 6'
		},
		{
			id: '1214',
			qnLogic: qnLogic14,
			args: {a: new Vector(1,2,-2), axis: 3},
			text: '2014 Paper 1 Question 3'
		},
		{
			id: '1215',
			qnLogic: qnLogic15,
			args: {l1: 3, m1: 2, l2: 5, m2: 6},
			text: '2015 Paper 1 Question 7'
		},
		{
			id: '1216',
			qnLogic: qnLogic16,
			args: {u: new Vector(2, -1, 2)},
			text: '2016 Paper 1 Question 5'
		},
		{
			id: '1218',
			qnLogic: qnLogic18,
			args: {l: 3, m: 2, modB: 4, sixtyDegrees: true},
			text: '2018 Paper 1 Question 6'
		},
		{
			id: '1219',
			qnLogic: qnLogic19,
			args: {l1: 2, m1: 4, l2: 5},
			text: '2019 Paper 2 Question 5'
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