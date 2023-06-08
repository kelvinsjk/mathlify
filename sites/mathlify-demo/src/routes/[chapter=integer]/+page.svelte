<script lang="ts">
  import type {PageData} from './$types';
  export let data: PageData;

  let {i, title, shortTitle, description, sections} = data;
  $: ({i, title, shortTitle, description, sections} = data);

  const nextShortTitle = sections[0].title;
</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">{shortTitle}</li>
</ol>
<ol class="breadcrumb mt-4 text-sm">
	<li class="crumb">{shortTitle}</li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${i}/1`}>{nextShortTitle}</a></li>
</ol>

<div class="prose">
  <h1>Chapter {i}:<br>{title}</h1>
  <p>
    {description}
  </p>
  <h2>Sections</h2>
  <nav class="list-nav">
    <ul>
      {#each sections as section,j}
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