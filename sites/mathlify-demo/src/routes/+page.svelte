<script lang="ts">
  import {chapters} from "$lib/chapters";
</script>

<svelte:head>
  <title>Mathlify Demo</title>
</svelte:head>

<div class="prose">
  <h1>
    Chapters
  </h1>
  <nav class="list-nav">
    <ul>
      {#each chapters as chapter,i}
      <li>
        <a href={`/${i}`}>
          <span class="badge-icon mr-1">📙</span>
          {chapter.title}
        </a>
      </li>
      <ul class="nested">
        {#each chapter.sections as section,j}
        <li>
          <a href={`/${i}/${j+1}`}>
            <span class="badge-icon mr-1">📖</span>
            {section.title}
          </a>
        </li>
        <ul class="nested">
          {#each section.subsections as subsection}
          <li>
            <a href={`/${i}/${j+1}/${subsection.slug}`}>
              <span class="badge-icon mr-1">📑</span>
              {subsection.title}
            </a>
          </li>
          {/each}
        </ul>      
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
  .nested .nested a {
    margin-left: 1.5rem;
  }
  .prose nav ul {
    margin: 0;
    padding: 0;
  }
  
</style>