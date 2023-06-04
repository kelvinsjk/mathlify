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

  import { CodeBlock } from '@skeletonlabs/skeleton';
  import { Fraction, getRandomFrac } from 'mathlify';
  import { math, display } from 'mathlifier';

  const x = new Fraction(4,9);
  const y = new Fraction(3,5);
  const qnString = `${x} \\times ${y}`;
  const ans = x.times(y);
  const ansString = `${ans}`;
  const latexString = `${x} \\times ${y} = ${ans}`;
  const code = 
`const x = new Fraction(4,9);
const y = new Fraction(3,5);
const ans = x.times(y);
const latexString = \`\${x} \\times \${y} = \${ans}\`;`;

  const x2 = getRandomFrac().abs();
  const y2 = getRandomFrac({allowInt: false}).abs();
  const qnString2 = `${x2} \\cdot ${y2}`;
  const ans2 = x2.times(y2);
  const ansString2 = `${ans2}`;
  const latexString2 = `${x2} \\times ${y2} = ${ans2}`;
  const code2 = 
`const x = new Fraction(4,9);
const y = new Fraction(3,5);
const ans = x.times(y);
const latexString = \`\${x} \\times \${y} = \${ans}\`;`;

  import {svelteCode} from '../01-multiplying-integers/+page.svelte';

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
  <div class="grid gap-4">
    <div>
      Q1. Evaluate {@html math(qnString)}
    </div>
    <div>
      Q2. Evaluate {@html math(qnString2)}
    </div>
  </div>
  
  <h2>Answers</h2>
  <div class="grid gap-4">
    <div>
      A1. {@html math(`${ans}`)}
    </div>
    <div>
      A2. {@html math(`${ans2}`)}
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

  <p>
    The mathlify library, used in conjunction with JavaScript's template literal strings,
    makes for idiomatic code that conveniently outputs as a {@html math('\\LaTeX')} string.
    We can then display it with our medium of choice (to a {@html math('\\TeX')} file to
    pdf, or to the DOM for the web via libraries like {@html math('\\KaTeX')} and MathJax).
  </p>
  <h3>Static Q1</h3>
  <CodeBlock language="ts" {code} />
  {@html display(latexString)}
  <h3>Random generated Q2</h3>
  <CodeBlock language="ts" code={code2} />
  {@html display(latexString2)}
  <h3>Example with Svelte and Mathlifier</h3>
  <p>
    We like using the mathlifier library (which is a small wrapper over {@html math('\\KaTeX')}),
    and the Svelte framework.
  </p>
  <CodeBlock language="svelte" code={svelteCode} />

</div>

<style>
  a.btn {
    text-decoration: none;
  }
  
</style>