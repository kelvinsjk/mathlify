<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {page, navigating} from '$app/stores';
	import type {VarsPrimitive, StringObject} from '$lib/interfaces';
	
	// edit this
	import {JSONParse, type Fraction, type Term, type Expression, type Vector} from 'mathlify';
	import {qnLogics} from '../_logic/042x';
	const regex = /^042[0-1]$/;
	const sliceLocation = 3;
	// edit this

	let pageID = $page.url.href.slice($page.url.href.length-sliceLocation-1)
	let qn = pageID[0] === '/' ? pageID.slice(1) : pageID;
	// edit this
	let title = `AP/GP Qn ${qn}`;
	const topic = 'AP/GP';
	// edit this
	let qnName = `qn${qn.slice(sliceLocation)}`;
	let qnLogic = qnLogics[qnName];
	
	export let data: {varsPrimitive: VarsPrimitive, varsJSON: StringObject, subtitles: StringObject};
	let {varsPrimitive, varsJSON, subtitles} = data;
	$: ( {varsPrimitive, varsJSON, subtitles} = data);
	
	let parsedVariables: {[key: string]: (Fraction|Term|Expression|Vector)} = {};
	Object.keys(varsJSON).forEach(key=>{
		parsedVariables[key] = JSONParse(varsJSON[key]) as (Fraction|Term|Expression|Vector);
	});
	let variables = {...varsPrimitive, ...parsedVariables };
	let [question, answer] = qnLogic(variables);
	let checked = false;
	let clicked = false;
	$: if ($navigating){
		checked = false;
	}

	
	$: if (regex.test($page.url.href.slice($page.url.href.length-sliceLocation-1))) {
		pageID = $page.url.href.slice($page.url.href.length-sliceLocation-1);
		qn = pageID[0] === '/' ? pageID.slice(1) : pageID;
		qnName = `qn${qn.slice(sliceLocation)}`; // edit this
		qnLogic = qnLogics[qnName]
		Object.keys(varsJSON).forEach(key=>{
			parsedVariables[key] = JSONParse(varsJSON[key]) as (Fraction|Term|Expression|Vector);
		});
		variables = {...varsPrimitive, ...parsedVariables };
		[question, answer] = clicked ? qnLogic() : qnLogic(variables);
		// edit this
		title = `${topic} Qn ${qn}`;
		// edit this
	}
	
	let subtitle = subtitles[qnName];
	$: subtitle = subtitles[qnName];
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
					clicked = true;
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
	<Footer pageID={qn} />
</div>