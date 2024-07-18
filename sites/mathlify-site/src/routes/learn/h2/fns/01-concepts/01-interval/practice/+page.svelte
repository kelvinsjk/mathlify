<script lang="ts">
	import Practice from '$lib/components/Content/Practice.svelte';
	import NumberLine from '$lib/components/svg/NumberLine.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { scale } from 'svelte/transition';
  
  const {data} = $props();

  import {generateState, generateQn} from '$content/learn/h2/fns/01-concepts/01-interval';
	import type { Snapshot } from './$types.js';
  
  let qnState = $state(data.state);
  let {qn,ans,inequalityOrInterval} = $derived(generateQn(qnState));
  let showAnswer = $state(false);

  export const snapshot: Snapshot<typeof qnState> = {
    capture: ()=>qnState,
    restore: (value)=>qnState = value
  }
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
