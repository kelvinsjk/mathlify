<script lang="ts">
	import Practice from '$lib/components/Content/Practice.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
	import { scale } from 'svelte/transition';

  const {data} = $props();

  //import {practices} from '$content/learn/practices';
	import { page } from '$app/stores';
	import type { Snapshot } from '../$types.js';
  
  //const practice = $derived(practices[data.syllabus][data.chapter][data.section][data.subsection]);

  const modules = import.meta.glob(['/src/content/learn/**/*.ts', '!**/*.state.ts']);

  const practice = $derived(modules[`/src/content/learn/${data.syllabus}/${data.chapter}/${data.section}/${data.subsection}.ts`]());
  type Practice = {
    generateQn: (state: unknown) => {qn: string, ans: string, soln?: string},
    generateState: () => unknown;
  }
  async function getQn(qState: unknown) {
    const p = await practice as Practice;
    return p.generateQn(qState);
  }
  async function getNewState() {
    const p = await practice as Practice;
    const state = p.generateState();
    return state;
  }

  let qnState = $state(data.state);
  let q = $derived(getQn(qnState));
  let showAnswer = $state(false);
  
  // for validation
  $inspect(qnState);
  let pw = $state("");
  let code = $state(0);
  let disabled = $state(false);

  export const snapshot: Snapshot<typeof qnState> = {
    capture: ()=>qnState,
    restore: (value)=>qnState = value
  }
</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Practice title={data.title} next={data.next} sections={data.sections} section={data.section} subsection={data.subsection} 
  {q}
bind:showAnswer>
  {#snippet question()}
  {#key qnState}
  <div class="question-container" in:scale>
    {#await q}
    Loading...
    {:then {qn}}
        {@html qn}
    {/await}
  </div>
  {/key}
  {/snippet}
  {#snippet questionButton()}
    <Button onclick={async()=>{
      showAnswer = false;
      qnState = await getNewState();
    }}
    >Generate New</Button>
  {/snippet}
</Practice>

<style>
  input {
    border: 1px black solid;
  }
</style>