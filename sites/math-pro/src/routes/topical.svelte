<script lang="ts">
  import Select from 'svelte-select';
  import {contents} from '$lib/components/contents';
  import { topic } from './stores';

  const shortLabels = [
    '1: Eqns & Inequalities',
    '2: Functions',
    '3: Graphs',
    '4: AP/GP',
    '5: Sigma Notation',
    '6: Tangents',
    '7: Maxima',
    '8: Maclaurin Series',
    '9: Integration',
    '10: Areas & Volumes',
    '11: DE',
    '12: Vectors I',
    '13: Vectors II',
    '14: Complex Numbers',
    'S1: P&C',
    'S2. Probability',
    'S3: DRV',
    'S4: Binomial',
    'S5: Normal',
    'S6: Sampling',
    'S7: Hypothesis Testing',
    'S8: Linear Regression'
  ]
  const longLabels = [
    '1. Equations and Inequalities',
    '2.	Functions',
    '3. Graphs and Transformations',
    '4. Arithmetic and Geometric Progressions (APs, GPs)',
		'5. Sigma Notation',
		'6. Differentiation I: Tangents and Normals, Parametric Curves',
		'7. Differentiation II: Maxima, Minima, Rates of Change',
		'8. Maclaurin Series',
		'9. Integration Techniques',
		'10. Definite Integrals: Areas and Volumes',
		'11. Differential Equations (DEs)',
		'12. Vectors I: Basics, Dot and Cross Products',
		'13. Vectors II: Lines and Planes',
		'14. Complex Numbers',
		'S1. Permutations and Combinations (P&C)',
		'S2. Probability',
		'S3. Discrete Random Variables (DRVs)',
		'S4. The Binomial Distribution',
		'S5. The Normal Distribution',
		'S6. Sampling Theory',
		'S7. Hypothesis Testing',
		'S8. Linear Correlation and Regression'
	];

  const items: {label: string, value: string, index: number}[] = contents.map((topic,i) => {
    return {
      label: longLabels[i],
      index: i,
      value: shortLabels[i]
    } 
  })
  $: selected = items[$topic]

  import {slide} from 'svelte/transition';
</script>

<svelte:head>
	<title>Questions By Topic</title>
</svelte:head>

<div class="prose mx-auto text-lg font-bold">
  <header class="p-4 bg-goldenrod dark:bg-zinc-800">
    <div class="text-lg max-w-prose font-bold mx-auto">
      <h1 class="font-serif text-zinc-900 dark:text-goldenrod mb-0" id="top">
        Questions
      </h1>
    </div>
	</header>
  <main class="px-4 pb-8 sm:px-0 font-normal">
    <h2 class="dark:text-zinc-200">Select Topic</h2>
    <div class="grid select-grid items-center gap-1">
      <!--Decrement button-->
      <button class="btn btn-xs btn-primary" 
        on:click={()=>{
          topic.set(((selected?.index??21) +20)%21)
        }}
      >«</button>
      <!--Select search bar-->
      <div class="grow select-container">
        <Select {items} bind:value={selected} placeholder={"Select Topic..."} isClearable={false}/>
      </div>
      <!--Increment button-->
      <button class="btn btn-xs btn-primary" on:click={()=>{topic.set(((selected?.index??-1) + 1)%21)}}>»</button>
    </div>
    <!--List of questions-->
    <section aria-labelledby="topic" class="mt-12 py-8 px-4 qns bg-goldenrod dark:bg-zinc-800">
      {#key selected}
      <div class="max-w-prose mx-auto text-lg font-bold">
        <h3 id="topic" class="font-serif mt-0 dark:text-goldenrod" transition:slide|local>
          {selected?.label?? 'Please select a topic'}
        </h3>
      </div>
      {/key}
      {#if selected}
			<div class="max-w-prose mx-auto text-lg font-bold">
				<h3 class="dark:text-zinc-100">Core concepts</h3>
        {#each contents[selected.index].basic as qList}
				<div class="flex flex-wrap gap-x-4 my-2">
					{#each qList as q}
					<a sveltekit:prefetch href={`/questions/${q.slug.slice(0,2)}/${q.slug}`} class="dark:text-zinc-200 text-center">
						{q.text}
					</a>
					{/each}
					</div>
        {/each}
      </div>
			<div class="max-w-prose mx-auto text-lg font-bold">
				<h3 class="dark:text-zinc-100">Exam-style practice</h3>
				<div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
					{#each contents[selected.index].exam as q}
					<a sveltekit:prefetch href={`/questions/${q.slice(0,2)}/${q}`} class="dark:text-zinc-200">
						{q}
					</a>
					{/each}
				</div>
      </div>
      {/if}
      <!--Topic buttons-->
      <div class="qns pt-4 px-4 flex gap-y-2 gap-x-2 flex-wrap mt-4 overflow-clip">
        {#each items.slice(0,14) as item,i}
          <button 
            class="btn btn-xs btn-primary text-white" on:click={()=>{topic.set(i)}}
            class:btn-accent={selected.index === i}
            class:text-black={selected.index === i}
          >
            {shortLabels[i]}
          </button>
        {/each}
      </div>
      <div class="qns pb-4 px-4 flex gap-y-2 gap-x-2 flex-wrap mt-4 overflow-clip">
        {#each items.slice(14) as item,i}
          <button 
            class="btn btn-xs btn-primary text-white" on:click={()=>{topic.set(14+i)}}
            class:btn-accent={selected.index === i+14}
            class:text-black={selected.index === i+14}
          >
            {shortLabels[14+i]}
          </button>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
	header, .qns {
		width: 100vw;
		margin-left: 50%;
		transform: translateX(-50%);
	}
  .select-grid{
    grid-template-columns: 1.5rem calc(100% - 3.5rem) 1.5rem;
  }
</style>