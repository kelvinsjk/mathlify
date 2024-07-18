<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
  import BottomNav from '$lib/components/Nav/BottomNav.svelte';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import type { Snippet } from 'svelte';
  import type {Section} from "$lib/types/learn";
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { slide } from 'svelte/transition';
  
  let {title, prev, next, question, sections, section, subsection, showAnswer = $bindable(false), answer, solution, questionButton}: {
    title: string,
    prev: {shortTitle: string, slug: string, sectionSlug: string} | undefined,
    next: {shortTitle: string, slug: string, sectionSlug: string} | "practice" | undefined,
    sections: Section[];
    section: string|undefined;
    subsection: string|undefined;
    showAnswer: boolean,
    question: Snippet,
    answer: Snippet,
    solution?: Snippet,
    questionButton?: Snippet,
  } = $props();
</script>

<Content {title}>
  {#snippet content()}
  <div class="static-content learn">
    <h1 id={title.replaceAll(" ","-").replaceAll(",","")}>Practice: {title.toLocaleLowerCase()}</h1>
    <section class="question" aria-label="Question">
      <div class="question-heading-container">
        <h2>Question</h2>
        {#if questionButton}
        {@render questionButton()}
        {/if}
      </div>
      {@render question()}
    </section>
    <section class="answer" aria-label="Answer">
      <div class="answer-heading-container">
        <h2>Answer</h2>
        <Switch bind:checked={showAnswer} />
      </div>
      {#if showAnswer}
        <div class="answer-container" transition:slide >
          {@render answer()}
          {#if solution}
          <h2>Solution</h2>
          {@render solution()}
          {/if}
        </div>
      {/if}
    </section>
  <BottomNav {prev} {next} />
  </div>
  {/snippet}
  {#snippet desktopExtraNav()}
  <div>
    <hr />
    <BottomNav {prev} {next} />
    <hr />
    <div class="chapter-nav">
      Chapter navigation
    </div>
    <NavAccordion {sections} section={section} subsection={subsection}>
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
  .question-heading-container, .answer-heading-container {
    display: flex;
    align-items: center;
    margin-top: 2em;
    margin-bottom: 1em;
    gap: 1em;
  }
  h1, h2 {
    margin-block: 0;
  }

</style>