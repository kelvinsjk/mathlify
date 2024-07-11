<script lang="ts">
  import type {Heading} from './Content.svelte';
  export let toc: Heading[];
</script>

<ul class="toc">
  {#each toc as heading}
    <li><a href={`#${heading.text.replaceAll(' ','-')}`}>{heading.text}</a></li>
    {#if heading.children}
      <svelte:self toc={heading.children} />
    {/if}
  {/each}
</ul>

<style>
  :global(.toc li){
    margin: 0;
    padding: 0;
  }
  :global(.toc li a){
    font-weight: 400;
    display: block;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
  :global(.toc ul){
    margin-block: 0;
    padding-block: 0;
    margin-inline-start: 1rem;
  }
  :global(.toc li::marker){
    content: '';
  }
</style>