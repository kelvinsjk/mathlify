<script lang="ts">
  import {chapters} from "./chapters";
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
      {#each chapters as chapter}
      <li>
        <a href={`/${chapter.title}`}>
          <span class="badge-icon mr-1">📙</span>
          {chapter.description}
        </a>
      </li>
      <ul class="nested">
        {#each chapter.sections as section}
        <li>
          <a href={`/${chapter.title}/${section.title}`}>
            <span class="badge-icon mr-1">📖</span>
            {section.description}
          </a>
        </li>
        <ul class="nested">
          {#each section.subsections as subsection}
          <li>
            <a href={`/${chapter.title}/${section.title}/${subsection.title}`}>
              <span class="badge-icon mr-1">📑</span>
              {subsection.description}
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