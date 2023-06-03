<script lang="ts">
  const chapter = '00-foundation';
  const section = '01-fractions';
  const title = 'Multiplying fractions with whole numbers';
  import {chapters} from '../../../chapters';
  const i = 0;
  const j = 0;
  const k = 0;
  const nextLink = `/${chapters[i].title}/${chapters[i].sections[j].title}/${chapters[i].sections[j].subsections[k+1].title}`;
  const nextDesc = chapters[i].sections[j].subsections[k+1].description;

  import {Fraction} from 'mathlify';
  import {math} from 'mathlifier';

  const frac = new Fraction(4,9);
  const int = 2;
  const qnString = `${frac} \\times ${int}`;
  const ans = frac.times(int);
  const ansString = `${ans}`
  const code = 
`import { Fraction } from 'mathlify';
const frac = new Fraction(4,9);
const int = 2;
const qnString = \`\${frac} \\times \${int}\`;
const ans = frac.times(int);
const ansString = \`\${ans}\`
// qnString: "\\frac{4}{9} \\times 2"
// ansString: "\\frac{8}{9}"`;

  import { CodeBlock } from '@skeletonlabs/skeleton';

  const svelteCode = 
`<script>
  import { math } from 'mathlifier';
  // qnString and ansString from code above
<\/script>

<h2>Question</h2>
Q1. {@html math(qnString)}
<h2>Answer</h2>
A1. {@html math(ansString)}
`;

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
	<li class="crumb">Multiplication 1</li>
</ol>

<div class="prose">
  <h1>Subsection 1:<br>{title}</h1>
  <p>
    In this section, we learn how to multiply fractions with whole numbers and vice versa.
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
      A1. {@html math(ansString)}
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
  <p>
    The following is the source code used to generate the questions.
    Q1 is static (ie the numbers are fixed), while Q2 is generated randomly.
  </p>
  <p>
    The mathlify library, used in conjunction with JavaScript's template literal strings,
    makes for idiomatic code that conveniently outputs as a {@html math('\\LaTeX')} string.
    We can then display it with our medium of choice (to a {@html math('\\TeX')} file to
    pdf, or to the DOM for the web via libraries like {@html math('\\KaTeX')} and MathJax).
  </p>
  <h3>Static Q1</h3>
  <CodeBlock language="ts" {code} />
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
  :global(div.code) {
    white-space: pre;
  }
</style>