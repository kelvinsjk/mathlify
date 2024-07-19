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
    {#if $page.url.searchParams.get('supa')==='base'}
      <input bind:value={pw} />
      <div>
        <Button {disabled} onclick={async ()=>{
          const res = await fetch('/db', {method: 'POST', body:JSON.stringify({state:qnState,validity:false,practice:'h2/fns/01-concepts/01-interval',pw})});
          const json = await res.json();
          count = json.count;
          code = json.code;
        }}> 
          Bad 
        </Button>
        <Button {disabled} onclick={async ()=>{
          const res = await fetch('/db', {method: 'POST', body:JSON.stringify({state:qnState,validity:'investigate',practice:'h2/fns/01-concepts/01-interval',pw})});
          const json = await res.json();
          count = json.count;
          code = json.code;
        }}> 
          Investigate 
        </Button>
        <Button {disabled} onclick={async ()=>{
          disabled = true;
          const res = await fetch('/db', {method: 'POST', body:JSON.stringify({state:qnState,validity:true,practice:'h2/fns/01-concepts/01-interval',pw})});
          const json = await res.json();
          count = json.count;
          code = json.code;
          disabled = false;
        }}> 
          Good
        </Button>
      </div>
      <div>
        Count: {count}
      </div>
      <div>
        Response: {code}
      </div>
    {/if}
  {/snippet}
</Practice>

<style>
  input {
    border: 1px black solid;
  }
</style>