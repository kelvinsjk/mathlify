<script lang="ts">
  import { CodeBlock } from '@skeletonlabs/skeleton';
  import { math,display } from 'mathlifier';
  import { chapters } from '$lib/chapters';

  const shortTitle = `Multiplication 1`;
  const description = `In this part, we learn how to
    multiply fractions with whole numbers and vice versa.
  `;
  const i = 0;
  const j = 0;
  const k = 1;
  
  const chapter = chapters[i];
  const sections = chapter.sections;
  const section = sections[j];
  const subsections = section.subsections;
  const subsection = subsections[k];
  const title = subsection.title;
  const [nextLink, nextDesc] = (()=>{
    if (k < subsections.length-1) {
      return [`/${i}/${j+1}/${subsections[k+1].slug}`, subsections[k+1].title];
    }
    if (j < sections.length - 1) {
      return [`/${i}/${j+2}}`, sections[j+1].title]
    }
    if (i < chapters.length - 1){
      return [`/${i+1}}`, chapters[i+1].title]
    }
    return [null, null];
  })();
  
  import { Fraction, getRandomFrac, getRandomInt } from 'mathlify';
  const frac = new Fraction(4,9);
  const int = 2;
  const qnString = `${frac} \\times ${int}`;
  const ans = frac.times(int);
  const ansString = `${ans}`;
  const latexString = `${frac} \\times ${int} = ${ans}`;

  const code = 
`import { Fraction } from 'mathlify';
const frac = new Fraction(4,9);
const int = 2;
const latexString = \`\${frac} \\\\times \${int} = \${frac.times(int)}\`;
// latexString: "\\frac{4}{9} \\times 2 = \\frac{8}{9}"`;

  const frac2 = getRandomFrac({allowInt: false}).abs();
  const int2 = getRandomInt({min: 2});
  const qnString2 = `${int2} \\cdot ${frac2}`;
  const ans2 = frac2.times(int2);
  const ansString2 = `${ans2}`;
  const latexString2 = `${frac2} \\times ${int2} = ${ans2}`;

  const code2 = 
`import { getRandomFrac, getRandomInt } from 'mathlify';
const frac = getRandomFrac({allowInt: false}).abs();
const int = getRandomInt({min: 2});
const latexString = \`\${int} \\\\cdot \${frac} = \${frac.times(int)}\`;`;

const svelteCode = 
`<script>
  import { math } from 'mathlifier';
  // frac, int from above
  const qnString = \`\${frac} \\\\times \${int}\`;
  const ans = frac.times(int);
  const ansString = \`\${ans}\`;
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
	<li class="crumb"><a class="anchor" href={`/${i}`}>{chapter.shortTitle}</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={`/${i}/${j+1}`}>{section.shortTitle}</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">{shortTitle}</li>
</ol>

<div class="prose">
  <h1>Subsection {k+1}:<br>{title}</h1>
  <p>
    {description}
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
      A1. {@html math(ansString)}
    </div>
    <div>
      A2. {@html math(ansString2)}
    </div>
  </div>

  {#if nextLink}
  <h2>Up Next</h2>
  <div>
    <span class="mr-2 mb-4 inline-block">
      {nextDesc}
    </span> <a href={nextLink} class="btn variant-filled-primary">🎓 Continue >></a>
  </div>
  {/if}

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
  :global(div.code) {
    white-space: pre;
  }
</style>