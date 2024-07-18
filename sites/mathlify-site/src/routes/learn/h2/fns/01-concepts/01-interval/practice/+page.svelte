<script lang="ts">
	import Practice from '$lib/components/Content/Practice.svelte';
	import NumberLine from '$lib/components/svg/NumberLine.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
  
  const {data} = $props();

  import {generateState, generateQn} from './generators';
  
  let qnState = $state(data.state);
  let {qn,ans,inequalityOrInterval} = $derived(generateQn(qnState));
  let showAnswer = $state(false);
</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Practice title={data.title} prev={data.prev} next={data.next} sections={data.sections} section={data.section} subsection={data.subsection} {showAnswer}>
  {#snippet question()}
    {@html qn}
    {#if typeof inequalityOrInterval === 'string'}
      {@html inequalityOrInterval}
    {:else}
      <NumberLine intervals={inequalityOrInterval}/>
    {/if}
  {/snippet}
  {#snippet questionButton()}
    <Button onclick={()=>{
      qnState = generateState();
      // workaround to get the state to propagate
      showAnswer = !showAnswer;
      showAnswer = false;
    }}
    >Generate New</Button>
  {/snippet}
  {#snippet answer()}
    {@html ans}
  {/snippet}
</Practice>
