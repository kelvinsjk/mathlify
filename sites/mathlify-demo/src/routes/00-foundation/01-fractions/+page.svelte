<script lang="ts">
  import {chapters} from "../../chapters";
  const chapterTitle = '00-foundation';
  const sectionTitle = '01-fractions';
  const i = 0;
  const j = 0;
  const title = 'Fractions';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${chapterTitle}`}>Foundation</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">{title}</li>
</ol>

<div class="prose">
  <h1>Section 1:<br>Fractions</h1>
  <p>
    In this section, we learn how to add, subtract, multiply and divide
    fractions.
  </p>

  <h2>Subsections</h2>
  <nav class="list-nav">
    <ul>
      {#each chapters[i].sections[j].subsections as subsection}
      <li>
        <a href={`/${chapterTitle}/${sectionTitle}/${subsection.title}`}>
          <span class="badge-icon mr-1">📑</span>
          {subsection.description}
        </a>
      </li>
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
  .prose nav ul {
    margin: 0;
    padding: 0;
  }
  
</style>