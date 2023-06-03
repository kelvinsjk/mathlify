<script lang="ts">
  const chapter = '00-foundation';
  const section = '01-fractions';
  const title = 'Multiplying fractions with fractions';
  import {chapters} from '../../../chapters';
  const i = 0;
  const j = 0;
  const k = 1;
  //const nextLink = `/${chapters[i].title}/${chapters[i].sections[j].title}/${chapters[i].sections[j].subsections[k+1].title}`;
  //const nextDesc = chapters[i].sections[j].subsections[k+1].description;
  const nextLink = `/${chapters[i].title}/${chapters[i].sections[j].title}/${chapters[i].sections[j].subsections[k].title}`;
  const nextDesc = chapters[i].sections[j].subsections[k].description;

  import {Fraction} from 'mathlify';
  import {math} from 'mathlifier';

  const frac = new Fraction(4,9);
  const int = 2;
  const qnString = `${frac} \\times ${int}`;
  const ans = frac.times(int);

  //let a = Math.ceil(Math.random()*9);
  //let b = Math.ceil(Math.random()*10);
  //const c = Math.ceil(Math.random()*10);
  //let frac1 = new Fraction(a,b);
  //while (frac1.isInteger()){
  //  a = Math.ceil(Math.random()*9);
  //  b = Math.ceil(Math.random()*10);
  //  frac1 = new Fraction(a,b);
  //}
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${chapter}`}>Foundation</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${chapter}/${section}`}>Fractions</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">Multiplication 2</li>
</ol>

<div class="prose">
  <h1>Subsection {k+1}:<br>{title}</h1>
  <p>
    In this section, we learn how to multiply fractions with fractions.
  </p>

  <h2>Questions</h2>
  <div>
    <div>
      Q1. Evaluate {@html math(qnString)}
    </div>
  </div>
  
  <h2>Answers</h2>
  <div>
    <div>
      A1. {@html math(`${ans}`)}
    </div>
  </div>

  <h2>Up Next</h2>
  <div>
    <span class="mr-2 mb-4 inline-block">
      {nextDesc}
    </span> <a href={nextLink} class="btn variant-filled-primary">🎓 Continue >></a>
  </div>

  <h2>
    Source code
  </h2>
  <div>
    The following is the source code used to generate the questions.
    Q1 is static (ie the numbers are fixed), while Q2 is generated randomly.
  </div>
</div>

<style>
  a.btn {
    text-decoration: none;
  }
  
</style>