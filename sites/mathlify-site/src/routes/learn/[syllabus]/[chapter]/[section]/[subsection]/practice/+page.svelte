<script lang="ts">
	import Practice from '$lib/components/Content/Practice.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
	import { scale } from 'svelte/transition';

  const {data} = $props();

  import {practices} from '$content/learn/practices';
	import { page } from '$app/stores';
  
  const practice = $derived(practices[data.syllabus][data.chapter][data.section][data.subsection]);
  let qnState = $state(data.state);
  let {qn,ans} = $derived(practice.generateQn(qnState));
  let showAnswer = $state(false);
  
  // for validation
  $inspect(qnState);
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
    </div>
    {/key}
  {/snippet}
  {#snippet questionButton()}
    <Button onclick={()=>{
      showAnswer = false;
      qnState = practice.generateState();
    }}
    >Generate New</Button>
  {/snippet}
  {#snippet answer()}
    {@html ans}
  {/snippet}
</Practice>
