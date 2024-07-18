<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
  import BottomNav from '$lib/components/Nav/BottomNav.svelte';
	import { afterNavigate, invalidate } from '$app/navigation';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
  
  const {data} = $props();

  let scrollable: HTMLElement;
  let observer: IntersectionObserver;
  let observed: {id: string, tagName: string}[] = [];
  let sectionIds: string[] = [];
  let currentSection = $state("");

  const callback = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const tagName = entry.target.tagName === "SECTION" ? entry.target.firstElementChild?.tagName ?? "" : entry.target.tagName;
        observed.push({id: entry.target.id, tagName});
      } else {
        observed = observed.filter(e=>e.id !== entry.target.id);
      }
    }
    observed = observed;
    currentSection = updateSection(observed);
  }
  afterNavigate(()=> {
    scrollable?.scrollIntoView();
    if (observer) observer.disconnect();
    observed = [];

    observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
    });
    const sections = Array.from(document.querySelectorAll('section:has(>h2, >h3), h2[id], h3[id]'));
    sectionIds = sections.map(section => section.id);
    for (const section of sections) { 
      observer.observe(section);
    }
    currentSection = sectionIds[0];
  });

  let [body, endnotes] = $derived(data.content.split('<section role="doc-endnotes">'));
  $effect(()=>{
    if (import.meta.hot){
      import.meta.hot.on('md-update', async ()=>{
        invalidate('md');
      })
    }
  })
  
  function updateSection(ids: {id: string, tagName: string}[]): string {
    const sortedIDs = ids.toSorted((a,b)=>{
      return a.tagName > b.tagName ? -1:
        a.tagName < b.tagName ? 1: 
        sectionIds.indexOf(a.id) - sectionIds.indexOf(b.id); ;
    })
    return sortedIDs[0]?.id ?? "";
  }
</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content toc={data.toc} title={data.title} {currentSection}>
  {#snippet content()}
  <div class="static-content learn" bind:this={scrollable}>
  {@html body}
  <BottomNav prev={data.prev} next="practice" />
  {#if endnotes}
  <div class="endnotes-container">
    {@html `<section role="doc-endnotes">${endnotes}`}
  </div>
  {/if}
  </div>
  {/snippet}
  {#snippet desktopExtraNav()}
  <div>
    <hr />
    <BottomNav prev={data.prev} next="practice" />
    <hr />
    <div class="chapter-nav">
      Chapter navigation
    </div>
    <NavAccordion sections={data.sections} section={data.section} subsection={data.subsection}>
    </NavAccordion>
  </div>
  {/snippet}
</Content>

<style>
  .chapter-nav {
    font-weight: bold;
    font-size: 1.25rem;
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