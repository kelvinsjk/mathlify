<script lang="ts">
  // heavy inspiration from https://github.com/huntabyte/shadcn-svelte/blob/main/apps/www/src/lib/components/docs/docs-pager.svelte
  export let prev: {shortTitle: string, slug: string, sectionSlug: string} | "theory" | undefined;
  export let next: {shortTitle: string, slug: string, sectionSlug: string} | "practice" | undefined;
  import {Button} from '$lib/components/ui/button';
  import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-svelte';
</script>

<div class="bottom-nav">
  <div class:half-width={prev&&next}>
    {#if prev}
    <Button href={prev === "theory" ? "./" :`../../${prev.sectionSlug}/${prev.slug}`} variant="outline" class="pl-2">
      <ChevronLeftIcon class="mr-2" />
      {prev==="theory" ? "Theory" : prev.shortTitle}
    </Button>
    {/if}
  </div>
  {#if next}
    <div class:half-width={prev&&next} class="ml-auto">
      <Button href={next === 'practice' ? 'practice' : `../../${next.sectionSlug}/${next.slug}`} variant="outline" class="ml-auto pr-2">
        {next==='practice' ? "Practice" : next.shortTitle}
        <ChevronRightIcon class="ml-2" />
      </Button>
    </div>
  {/if}
</div>

<style>
  .bottom-nav {
    width: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
    align-items: center;
    padding-block: 1em;
  }
  :global(.content-body-container .bottom-nav){
    padding-block-end:0;
  }
  .half-width {
    width: 100%;
  }
  :global(.half-width > *) {
    white-space: inherit;
    height: max-content;
    width: 100%;
  }
  :global(.bottom-nav > * > *){
    background-color: hsl(var(--primary-light));
    border-color: hsl(var(--primary));
    transition: background-color 0.3s;
  }
  :global(.bottom-nav > * > *:hover){
    background-color: hsl(var(--primary));
  }
</style>

