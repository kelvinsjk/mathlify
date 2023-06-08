<script lang="ts">
  import {chapters} from "$lib/chapters";
</script>

<svelte:head>
  <title>Mathlify Demo</title>
</svelte:head>

<div class="prose">
  <h1>
    Contents
  </h1>
</div>
  <nav class="list-nav mt-6 md:mt-10">
    <ul>
      {#each chapters as chapter,i}
      <li>
        <a href={`/${i}`}>
          <span>{i}.</span><span>{chapter.title}</span>
        </a>
      </li>
      <ul class="nested">
        {#each chapter.sections as section,j}
        <li>
          <a href={`/${i}/${j+1}`}>
            <span>{i}.{j+1}.</span><span>{section.title}</span>
          </a>
        </li>
        <ul class="nested">
          {#each section.subsections as subsection,k}
          <li>
            <a href={`/${i}/${j+1}/${subsection.slug}`}>
              <span>{i}.{j+1}.{k+1}</span><span>{subsection.title}</span>
            </a>
          </li>
          {/each}
        </ul>      
        {/each}
      </ul>
      {/each}
    </ul>
  </nav>

<style>
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 1rem;
  }
  nav ul {
    margin: 0;
    padding: 0;
  }
  nav ul li {
    margin: 0;
    padding: 0;
  }
  nav > ul {
    @apply bg-primary-300;
    border-radius: 1rem 0 0 1rem;
    border: none;
    max-width: calc(100vw - 2rem);
  }
  @media screen and (min-width: 640px) {
    nav > ul {
      border: 1rem solid rgb(225,92,119);
      border-right: none;
    }
  }
  nav ul > ul {
    @apply bg-primary-200;
    border-left: 1rem solid rgb(126, 170, 199);
  }
  nav ul ul > ul {
    @apply bg-primary-50;
    border-left: 1rem solid #fef08a;
  }
  nav a {
    padding-left: 1.25rem;
    padding-right: 2.5rem;
    border-radius: 0;
  }
  nav ul ul ul li {
    border-bottom: 1px solid rgba(225,92,119,0.3);
  }
  nav ul ul ul li:last-child {
    border-bottom: 0px;
  }
  nav ul ul ul a:hover{
    background-color: #fef08a;
  }
  nav ul ul a:hover{
    background-color: rgb(126, 170, 199);
  }
  nav ul a:hover{
    background-color: rgb(225,92,119);
  }
  a span {
    font-weight: 600;
  }
  nav a > span:not(first-child) {
    text-decoration: underline;
  }
  nav a > span:first-child {
    text-decoration: none;
  }
  @media screen and (max-width: 640px) {
    nav ul ul ul a span:first-child {
      display: none;
    }
    nav ul ul ul a span {
      margin: 0;
    }
  }
  
</style>