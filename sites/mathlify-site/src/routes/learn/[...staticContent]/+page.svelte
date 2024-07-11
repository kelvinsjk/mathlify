<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
	import type { ViteHotContext } from 'vite/types/hot.js';
  import BottomNav from './BottomNav.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	//import { invalidateAll } from '$app/navigation';

  export let data;
  let scrollable: HTMLElement;

  afterNavigate(()=> {
    scrollable?.scrollIntoView();
  });

  $: [body, endnotes] = updateData(data.content);

  
  $: updateMD(import.meta.hot);

  async function updateMD(x: ViteHotContext|undefined) {
    if (x){
      x.on('md-update', async () => {
        location.reload();
        //await invalidateAll();
        //[body, endnotes] = (data.content as string).split('<section role="doc-endnotes">');
        //console.log(`updated md: ${body===undefined}`)
      });
    }
  }

  function updateData(content: string){
    return content.split('<section role="doc-endnotes">');
  }
</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content toc={data.toc} title={data.title}>
  <div class="static-content learn" bind:this={scrollable}>
  {@html body}
  <BottomNav prev={data.prev} next={data.next} />
  {#if endnotes}
  <div class="endnotes-container">
    {@html `<section role="doc-endnotes">${endnotes}`}
  </div>
  {/if}
</div>
</Content>

<style>
  :global(
    .learn.static-content .definition,
    .learn.static-content .technique,
    .learn.static-content .example,
    .learn.static-content .formula
    ) {
    border: 2px double hsl(var(--primary));
    background-color: hsl(var(--primary-light));
    padding-inline: 0.5em;
    padding-top: 2.25em;
    position: relative;
    --tw-prose-bullets: hsl(var(--foreground));
  }
  :global(.learn.static-content .definition::before) {
    content: 'Definition';
    position: absolute;
    top: .75em;
    font-weight: bold;
    border-bottom: 3px solid hsl(var(--primary));
    width: calc(100% - 1em);
    font-family: serif;
  }
  :global(.learn.static-content .technique::before) {
    content: 'Technique';
    position: absolute;
    top: .75em;
    font-weight: bold;
    border-bottom: 3px solid hsl(var(--primary));
    width: calc(100% - 1em);
    font-family: serif;
  }
  :global(.learn.static-content .example::before) {
    content: 'Example';
    position: absolute;
    top: .75em;
    font-weight: bold;
    border-bottom: 3px solid hsl(var(--primary));
    width: calc(100% - 1em);
    font-family: serif;
  }
  :global(.learn.static-content .formula::before) {
    content: 'Formula';
    position: absolute;
    top: .75em;
    font-weight: bold;
    border-bottom: 3px solid hsl(var(--primary));
    width: calc(100% - 1em);
    font-family: serif;
  }
  :global(.learn.static-content .technique > h2:first-child) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  :global(.learn.static-content .citation p), .endnotes-container {
    font-size: 0.6em;
  }
  :global(.learn.static-content img) {
    margin: auto;
  }
  :global(.learn.static-content .example hr){
    margin-block: 1rem;
    border-color: hsl(var(--primary));
  }

</style>