<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import type { Snippet } from 'svelte';
  import type {Section} from "$lib/types/learn";
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { scale, slide } from 'svelte/transition';
  
  let {title, next, question, sections, section, subsection, showAnswer = $bindable(false), q, questionButton, stateAnalysis}: {
    title: string,
    next: {shortTitle: string, slug: string, sectionSlug: string} | "practice" | undefined,
    sections: Section[];
    section: string|undefined;
    subsection: string|undefined;
    showAnswer: boolean,
    q: Promise<{soln?:string,ans:string}>,
    question: Snippet,
    questionButton?: Snippet,
    stateAnalysis?: Snippet
  } = $props();
  const prev = "theory";
</script>

<Content {title} {prev} {next} >
  {#snippet content()}
    <div class="static-content learn">
      <h1 id={title.replaceAll(" ","-").replaceAll(",","")}>{title}</h1>
      <div class="question-container">
        <section class="question" aria-label="Question">
          <div class="question-heading-container">
            <h2>Question</h2>
            {#if questionButton}
            {@render questionButton()}
            {/if}
          </div>
          {@render question()}
        </section>
      </div>
      <section class="answer" aria-label="Answer">
        <div class="answer-heading-container">
          <h2>Answer</h2>
          <Switch bind:checked={showAnswer} />
        </div>
        {#if showAnswer}
          <div class="answer-container" in:scale out:slide>
            {#await q then {ans, soln}}
            {@html ans}
              {#if soln}
              <h2>Solution</h2>
              {@html soln}
              {/if}
            {/await}
          </div>
          {#if stateAnalysis}
          {@render stateAnalysis()}
          {/if}
        {/if}
      </section>
    </div>
  {/snippet}
  {#snippet desktopExtraNav()}
    <div>
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
  .question-container {
    background-color: hsl(var(--primary-light));
    margin-left: 50%;
    margin-block-start: 1em;
    transform: translateX(-50%);
    padding-block-start: 1em;
    padding-block-end: 1px;
    width: 100dvw;
  }
  .question{
    margin-inline: auto;
    padding-inline: 1rem;
  }
  .answer-container {
    /* workaround to prevent margin making transition jerk */
    padding: 1px;
  }

  /** TODO: sync with app.css var(--max-width) */
  @media (min-width: 800px){
    .question-container {
      --bleed-width: calc(100dvw - clamp(250px, calc(250px + (100vw - var(--container-width)) / 2), 400px));
      width: var(--bleed-width);
    }
    .question{
      width: min(800px, var(--bleed-width));
    }
  }
  .question-heading-container, .answer-heading-container {
    display: flex;
    align-items: center;
    margin-block-end: 1em;
    gap: 1em;
    flex-wrap: wrap;
  }
  @media (max-width:374px){
    .question-heading-container {
      gap: 0.25em;
    }  
  }
  .answer-heading-container {
    margin-block-start: 1em;
  }
  h1, h2 {
    margin-block: 0;
  }

</style>