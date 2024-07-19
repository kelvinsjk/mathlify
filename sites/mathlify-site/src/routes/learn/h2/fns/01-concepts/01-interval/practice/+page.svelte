<script lang="ts">
	import Practice from '$lib/components/Content/Practice.svelte';
	import NumberLine from '$lib/components/svg/NumberLine.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { scale } from 'svelte/transition';
  import {page} from '$app/stores';
	import type { Snapshot } from './$types.js';
  
  const {data} = $props();

  import {generateState, generateQn} from '$content/learn/h2/fns/01-concepts/01-interval';
  
  let qnState = $state(data.state);
  let {qn,ans,inequalityOrInterval} = $derived(generateQn(qnState));
  let showAnswer = $state(false);
  
  
  export const snapshot: Snapshot<typeof qnState> = {
    capture: ()=>qnState,
    restore: (value)=>qnState = value
  }
  
  // for validation
  let pw = $state("");
  let count = $state(-1);
  let code = $state(0);
  let disabled = $state(false);
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Practice title={data.title} next={data.next} sections={data.sections} section={data.section} subsection={data.subsection} bind:showAnswer>
  {#snippet question()}
    {#key qnState}
    <div class="question-container" in:scale>
      {@html qn}
      {#if typeof inequalityOrInterval === 'string'}
        {@html inequalityOrInterval}
      {:else}
        <NumberLine intervals={inequalityOrInterval}/>
      {/if}
    </div>
    {/key}
  {/snippet}
  {#snippet questionButton()}
    <Button onclick={()=>{
      showAnswer = false;
      qnState = generateState();
    }}
    >Generate New</Button>
  {/snippet}
  {#snippet answer()}
    {@html ans}
  {/snippet}
</Practice>
