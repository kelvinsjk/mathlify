<script context="module" lang="ts">
  export interface Heading {level: number, text: string, children?: Heading[]};
</script>

<script lang="ts">
	import { slide } from "svelte/transition";

	import TOC from "./TOC.svelte";
  import {SquareMenuIcon} from 'lucide-svelte'
	import { browser } from "$app/environment";
  export let toc: Heading[];
  export let title: string;

	let width = browser ? window.innerWidth : 1000;
  let mobile = false;
  let showTOC = !mobile;
  $: showTOC = responsiveTOC(width);
  function responsiveTOC(width: number): boolean {
    return width >= 800;
  };

  import {clickOutside} from '$lib/utils/clickOutside';

</script>

<svelte:window bind:innerWidth={width} />

<div class="content-container">
  <div class="content-header-container">
    <nav class="content-header">
      <div class="toc-heading">
        <button class="toc-heading-small" on:click={() => showTOC = !showTOC} use:clickOutside={()=> {if (mobile) showTOC = false}}>
          <SquareMenuIcon />
          <h1>{title}</h1>
        </button>
        <a href={"#" + title.replaceAll(" ","-").replaceAll(",","")} class="toc-heading-large">
          {title}
        </a>
      </div>
      {#if showTOC}
        <div class="toc-container" transition:slide>
          <TOC {toc} />
        </div>
      {/if}
    </nav>
  </div>
  <div class="content-body-container">
    <div class="content-body content prose">
      <slot />
    </div>
  </div>
</div>

<style>
  h1 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  a {
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  .content-container {
    display: grid;
    --container-width: min(100vw, var(--max-width));
    width: var(--container-width);
    margin:auto;
    height: 100%;
  }
  .content-header-container {
    background-color: hsl(var(--accent));
    padding-inline: 1rem;
    padding-block: 0.5rem;
    width: var(--container-width);
  }
  .toc-heading {
    margin-block-end: 0.5rem;
    font-weight: 700;
  }
  .toc-heading-small {
    width: calc(100% - 1rem);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
  }
  .toc-heading-large {
    display: none;
  }
  .toc-container {
    line-height: 2;
  }
  .content-body-container {
    padding-block-start: 0.5rem;
    padding-block-end: 1rem;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  .content-body {
    width: var(--container-width);
    font-size: 1.25rem;
    margin-bottom: 1rem;
    padding-inline: 1rem;
  } 
  /** TODO: sync with app.css var(--max-width) */
  @media (min-width: 800px){
    .content-container {
      width: 100vw;
    grid-auto-rows: 100%;
      grid-template-columns: 1fr clamp(200px, calc(200px + 100vw - var(--container-width)), 400px);
    }
    .content-header-container {
      margin-block-end: 0;
      width: 100%;
    }
    .content-header * {
      padding-block: 0;
      font-size: 1em;
    }
    .toc-container {
    line-height: 1.2;
  }
    .toc-heading-small {
      display: none;
    }
    .toc-heading-large {
      display: block;
      margin-block-start: 0.5rem;
      font-size: 1.2rem;
      white-space: nowrap;
    }
    .content-body-container{
      order: -1;
      padding-block-start: 1rem;
    }
    .content-body {
      margin-inline: auto;
      width: 100%;
    }
    :global(.content-header li) {
      margin-block: 1rem;
    }
  }
  .prose {
    max-width: var(--max-width);
  }
</style>