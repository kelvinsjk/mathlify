<script lang="ts">
  import {chapters} from "../chapters";
  const chapterTitle = '00-foundation';
  const i = 0;
</script>

<svelte:head>
  <title>Foundations with numbers</title>
</svelte:head>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">Foundations</li>
</ol>

<div class="prose">
  <h1>Chapter 0:<br>Foundation with numbers</h1>
  <p>
    In this chapter, we develop our arithmetic skill with numbers, branching from
    the familiar whole numbers to fractions and negative numbers.
  </p>

  <h2>Sections</h2>
  <nav class="list-nav">
    <ul>
      {#each chapters[0].sections as section}
      <li>
        <a href={`/${chapterTitle}/${section.title}`}>
          <span class="badge-icon mr-1">📖</span>
          {section.description}
        </a>
      </li>
      <ul class="nested">
        {#each section.subsections as subsection}
        <li>
          <a href={`/${chapterTitle}/${section.title}/${subsection.title}`}>
            <span class="badge-icon mr-1">📑</span>
            {subsection.description}
          </a>
        </li>
        {/each}
      </ul>      
      {/each}
    </ul>
  </nav>
</div>

<style>
  a {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a, li {
    padding-left: 0;
  }
  .nested a {
    margin-left: 0.75rem;
  }
  .prose nav ul {
    margin: 0;
    padding: 0;
  }
  
</style>