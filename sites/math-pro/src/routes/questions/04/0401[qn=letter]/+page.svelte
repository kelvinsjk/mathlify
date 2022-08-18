<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Answer from '$lib/components/Answer.svelte';
	import Attempt from '$lib/components/Attempt.svelte';
	import TickVsCross from '$lib/components/TickVsCross.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type {AnswerObject, QuestionVariables, Question} from '$lib/interfaces';
	import {JSONParse, Fraction, type Term, type Expression} from 'mathlify';
	import {checkAnswer} from '../_logic/checkAnswer';
	import {qnProgress, defaultQnProgress} from '$lib/progress/stores';
	import {toast, SvelteToast} from '@zerodevx/svelte-toast';

	import {page, navigating} from '$app/stores';	
	import {scale} from 'svelte/transition';
	import type {VarsPrimitive, StringObject} from '$lib/interfaces';

	// edit this
	import {qnLogics} from '../_logic/0401';
	const regex = /^0401[a-c]$/;
	// edit this

	// navigating and page ID initialization
	let pageID = $page.url.href.slice($page.url.href.length-5)
	let qn = pageID[0] === '/' ? pageID.slice(1) : pageID;
	let qnLogic = qnLogics[qn?.slice(4)] as Question;

	export let data: {varsPrimitive: VarsPrimitive, varsJSON: StringObject, subtitles: StringObject};
	let {varsPrimitive, varsJSON, subtitles} = data;
	$: ( {varsPrimitive, varsJSON, subtitles} = data);

	let subtitle = subtitles[qn?.slice(4)];
	$: subtitle = subtitles[qn?.slice(4)];
	
	// initialization of props
	let parsedVariables: {[key: string]: (Fraction|Term|Expression)} = {};
	Object.keys(varsJSON).forEach(key=>{
		parsedVariables[key] = JSONParse(varsJSON[key]) as (Fraction|Term|Expression);
	});
	let variables = {...varsPrimitive, ...parsedVariables };
	let variablesVariant: {variant?: number} = {};
	let [question, answer, qnVariables] = qnLogic(variables) as [AnswerObject, AnswerObject, QuestionVariables];

	// progress
	if (!(qn.slice(0,2) in $qnProgress)){ // new updates
		qnProgress.set({...defaultQnProgress, ...$qnProgress});
	}
	let qnProg = $qnProgress[qn.slice(0,2)][qn];
	let attempted = qnProg !== 'new' || (Array.isArray(qnProg) && qnProg.some(qn=>qn !== 'new'));
	let variantCompleted = Array.isArray(qnProg) && qnProg.some(qn=>qn==='completed');
	let mastery = qnProg === 'completed' || (Array.isArray(qnProg) && qnProg.every(qn=>qn==='completed'));
	$: qnProg = $qnProgress[qn.slice(0,2)][qn];
	$: attempted = (!Array.isArray(qnProg) && qnProg !== 'new') || (Array.isArray(qnProg) && qnProg.some(qn=>qn !== 'new'));
	$: variantCompleted = Array.isArray(qnProg) && qnProg.some(qn=>qn==='completed');
	$: mastery = qnProg === 'completed' || (Array.isArray(qnProg) && qnProg.every(qn=>qn==='completed'));

	// handing of answers
	let checked = false; // if answer is revealed
	let checkedActivated = false; //if answer has been revealed before
	let clicked = false; // tracks first qn
	let disabled = false;
	let ready: boolean; // ready to submit
	let submitted = false;
	let correct: boolean;
  let attempts: (Fraction | number | number[])[];
	$: if (checked) {
		disabled = true;
		checkedActivated = true;
	}
	$: if (submitted) {
		disabled = true;
		setTimeout(()=>{
			correct = checkAnswer(qnVariables.answers, attempts);
			if (correct){
				if (Array.isArray(qnProg)){
					// try new variant
					variablesVariant['variant'] = qnVariables.variant === 1 ? 2 : 1;
					if (qnProg[qnVariables.variant-1] !== 'completed'){
						const qnProgCopy = structuredClone($qnProgress);
						qnProgCopy[qn.slice(0,2)][qn][qnVariables.variant-1] = 'completed';
						qnProgress.set(qnProgCopy);
						if (qnProgCopy[qn.slice(0,2)][qn].every(e=>e==='completed')){
							toast.push('⭐⭐⭐ Well done!');
						}
					}
				} else {
					if (qnProg !== 'completed'){
						const qnProgCopy = structuredClone($qnProgress);
						qnProgCopy[qn.slice(0,2)][qn] = 'completed';
						qnProgress.set(qnProgCopy);
						toast.push('⭐⭐⭐ Well done!');
					}
				}
			} else {
				if (Array.isArray(qnProg)){
					// repeat same variant
					variablesVariant['variant'] = qnVariables.variant === 1 ? 1 : 2;
					if (qnProg[qnVariables.variant-1] === 'new'){
						const qnProgCopy = structuredClone($qnProgress);
						qnProgCopy[qn.slice(0,2)][qn][qnVariables.variant-1] = 'attempted';
						qnProgress.set(qnProgCopy);
					}
				} else {
					if (qnProg === 'new'){
						const qnProgCopy = structuredClone($qnProgress);
						qnProgCopy[qn.slice(0,2)][qn] = 'attempted';
						qnProgress.set(qnProgCopy);
					}
				}
			}
		},300);
	}
	// page change
	$: if ($navigating){
		resetQn();
		variablesVariant = {};
		if (regex.test($page.url.href.slice($page.url.href.length-5))) {
			pageID = $page.url.href.slice($page.url.href.length-5);
			qn = pageID[0] === '/' ? pageID.slice(1) : pageID;
			qnLogic = qnLogics[qn?.slice(4)]
			Object.keys(varsJSON).forEach(key=>{
				parsedVariables[key] = JSONParse(varsJSON[key]) as (Fraction|Term|Expression);
			});
			variables = {...varsPrimitive, ...parsedVariables };
			[question, answer, qnVariables] = clicked ? qnLogic() : qnLogic(variables);
		}
	}
	
	function resetQn(): void {
		checked = false;
		checkedActivated = false;
		disabled = false;
		submitted = false;
		attempts = undefined;
		correct = undefined;
	}
</script>

<svelte:head>
	<title>{subtitle}</title>
</svelte:head>

<div class="prose mx-auto">
	<Header {qn} {subtitle} />
	<main class="mx-4 dark:text-zinc-100">
		<!--Question-->
		<Answer answer={question} questionMode >
			<!--Generate New-->
			<button 
				class="btn btn-accent btn-sm"
				disabled={submitted && !checked}
				on:click={()=>{
					clicked = true;
					[question, answer, qnVariables] = qnLogic(variablesVariant);
					resetQn();
				}}
			>
				Generate new
			</button>
		</Answer>
		<!--Attempt-->
		{#key [question]}
		<Attempt answers={qnVariables.answers} {disabled} bind:ready bind:attempts {correct}
				on:enter="{() => {
				if (ready) {
					submitted = true;
					setTimeout(()=>{
						checked = true;
					}, 1100);
				}
			}}"
		/>
		<!--Marking: Tick vs cross-->
		{#if correct !== undefined}
			<div class="w-12 h-12 m-x">
				<TickVsCross {correct} />
			</div>
		{/if}
		{#if ready && !submitted && !checkedActivated}
			<!--Submit-->
			<button 
				class="btn btn-primary m-2" 
				in:scale
				on:click={()=>{
					submitted = true;
					setTimeout(()=>{
						checked = true;
					}, 1100);
				}}
			>
				Submit
			</button>
		{:else if checkedActivated}
			<!--Generate New-->
			<button 
				class="btn btn-accent btn-sm m-2"
				on:click={()=>{
					clicked = true;
					[question, answer, qnVariables] = qnLogic(variablesVariant);
					resetQn();
				}}
			>
				Generate new
			</button>
		{/if}
		<!--Answer-->
		<Answer {answer} bind:checked />
		<!--Progress-->
		<section class="flex flex-col" aria-labelledby="progress">
			<h2 id="progress" class="dark:text-zinc-300">Question Progress</h2>
			<div class="flex justify-center">
				<ul class="steps pl-0">
					<li class="step step-accent">Start</li>
					<li class="step" class:step-accent={attempted}></li>
					{#if Array.isArray(qnProg)}
					<li class="step" class:step-accent={variantCompleted}></li>
					{/if}
					<li class="step" class:step-accent={mastery}>Mastery</li>
				</ul>
			</div>
		</section>
		{/key}
	</main>
	<!--Prev and next navigation-->
	<Footer {pageID} />
</div>
<SvelteToast options={{duration:3000	}} />
