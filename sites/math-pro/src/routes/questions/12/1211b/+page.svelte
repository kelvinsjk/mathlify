<script lang="ts">
	throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {JSONParse, Vector} from 'mathlify';

	import {page} from '$app/stores';
	let pageID = $page.routeId.slice($page.routeId.length-5)
	pageID = pageID[0] === '/' ? pageID.slice(1) : pageID;
	const qn = pageID;
	$: title = `Vectors I Qn ${qn}`

	import qnLogic from '../_logic/1211b';
	const subtitle = "2011 Paper 1 Question 7ii Variant"
	export let vectors: string;
	let [a,b] = JSONParse(vectors) as Vector[];
	let [question, answer] = qnLogic({a,b});
	let checked = false;

</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="prose mx-auto">
	<Header {qn} {subtitle} />
	<main class="mx-4 dark:text-zinc-100">
		<Answer answer={question} questionMode >
			<button 
				class="btn btn-accent btn-sm"
				on:click={()=>{
					if (checked) {
						checked = false;
					}
					[question, answer] = 
						qnLogic();
				}}
			>
				Generate new
			</button>
		</Answer>
		<!--Attempt-->
		<Answer {answer} bind:checked />
	</main>
	<!--Prev and next navigation-->
	<Footer {pageID} />
</div>