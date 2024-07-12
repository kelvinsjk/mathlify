<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
	import type { ViteHotContext } from 'vite/types/hot.js';
  import BottomNav from './BottomNav.svelte';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { onDestroy, onMount, tick } from 'svelte';
	import NavAccordion from './NavAccordion.svelte';
	import type { Action } from '@sveltejs/kit';

  export let data;
  let scrollable: HTMLElement;


  let observer: IntersectionObserver;
  let ids: Set<string> = new Set();
  let sectionNames: string[] = [];
  let currentSection: string;

  const callback = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        ids.add(entry.target.id);
      } else {
        ids.delete(entry.target.id);
      }
    }
    ids = ids;
    currentSection = updateSection(ids);
  }
  afterNavigate(()=> {
    scrollable?.scrollIntoView();
    if (observer) observer.disconnect();
    ids = new Set();

    observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
    });
    const sections = Array.from(document.querySelectorAll('section:has(>h2, >h3'));
    sectionNames = sections.map(section => section.id);
    for (const section of sections) { 
      observer.observe(section);
    }
    currentSection = sectionNames[0];
  });

  $: [body, endnotes] = updateData(data.content);

  
  $: updateMD(import.meta.hot);

  async function updateMD(x: ViteHotContext|undefined) {
    if (x){
      x.on('md-update', async () => {
        await tick();
        await invalidateAll();
      });
    }
  }

  function updateData(content: string){
    return content.split('<section role="doc-endnotes">');
  }

  
  function updateSection(ids: Set<string>): string {
    const indices = Array.from(ids).map(i=>sectionNames.indexOf(i));
    return sectionNames[Math.max(...indices)];
  }

</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content toc={data.toc} title={data.title} {currentSection}>
  <div class="static-content learn" bind:this={scrollable}>
  {@html body}
  <BottomNav prev={data.prev} next={data.next} />
  {#if endnotes}
  <div class="endnotes-container">
    {@html `<section role="doc-endnotes">${endnotes}`}
  </div>
  {/if}
  </div>

  <div slot="desktop-extra-nav">
    <hr />
    <BottomNav prev={data.prev} next={data.next} />
    <hr />
    <div class="chapter-nav">
      Chapter navigation
    </div>
    <NavAccordion sections={data.sections} section={data.section} subsection={data.subsection}>
    </NavAccordion>
  </div>
</Content>

<style>
  .chapter-nav {
    font-weight: bold;
    font-size: 1.2rem;
    margin-block-start: 2rem;
  }
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