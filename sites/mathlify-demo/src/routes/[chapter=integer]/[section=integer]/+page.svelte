<script lang="ts">
  import type {PageData} from './$types';
  export let data: PageData;

  let {i, j, title, shortTitle, description, chapterShortTitle, subsections} = data;
  $: ({i, j, title, shortTitle, description, chapterShortTitle, subsections} = data);

</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${i}`}>{chapterShortTitle}</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">{shortTitle}</li>
</ol>

<div class="prose">
  <h1>Section {j}:<br>{title}</h1>
  <p>
    {description}
  </p>
  <h2>Subsections</h2>
  <nav class="list-nav">
    <ul>
      {#each subsections as subsection}
      <li>
        <a href={`/${i}/${j}/${subsection.slug}`}>
          <span class="badge-icon mr-1">📖</span>
          {subsection.title}
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