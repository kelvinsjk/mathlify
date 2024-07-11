<script lang="ts">
  // heavy inspiration from https://github.com/huntabyte/shadcn-svelte/blob/main/apps/www/src/lib/components/docs/docs-pager.svelte
  export let prev: {shortTitle: string, slug: string, sectionSlug: string} | undefined;
  export let next: {shortTitle: string, slug: string, sectionSlug: string} | undefined;
  import {Button} from '$lib/components/ui/button';
</script>

<div class="bottom-nav">
  <div class:half-width={prev&&next}>
      {#if prev}
      <Button href={`../${prev.sectionSlug}/${prev.slug}`} variant="outline">← {prev.shortTitle}</Button>
      {/if}
    </div>
  {#if next}
    <div class:half-width={prev&&next}>
      <Button href={`../${next.sectionSlug}/${next.slug}`} variant="outline" class="ml-auto">{next.shortTitle} →</Button>
    </div>
  {/if}
</div>

<style>
  .bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
  }
  .half-width {
    max-width: calc(50% - 0.5rem);
  }
  :global(.half-width > *) {
    white-space: inherit;
    max-width: 100%;
    height: max-content;
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

