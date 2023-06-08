<script lang="ts">
  import { CodeBlock } from '@skeletonlabs/skeleton';
  import { math,display } from 'mathlifier';
  import { chapters } from '$lib/chapters';

  const description = `In this part, we learn how to
    add fractions.
  `;
  const i = 0;
  const j = 0;
  const k = 5;
  
  const chapter = chapters[i];
  const sections = chapter.sections;
  const section = sections[j];
  const subsections = section.subsections;
  const subsection = subsections[k];
  const title = subsection.title;
  const [nextLink, nextDesc, nextShortTitle] = (()=>{
    if (k < subsections.length-1) {
      return [`/${i}/${j+1}/${subsections[k+1].slug}`, subsections[k+1].title, subsections[k+1].shortTitle];
    }
    if (j < sections.length - 1) {
      return [`/${i}/${j+2}`, sections[j+1].title, sections[j+1].shortTitle]
    }
    if (i < chapters.length - 1){
      return [`/${i+1}`, chapters[i+1].title, chapters[i+1].shortTitle]
    }
    return [null, null, null];
  })();
  const [prevLink, _, prevShortTitle] = (()=>{
    if (k > 0) {
      return [`/${i}/${j+1}/${subsections[k-1].slug}`, subsections[k-1].title, subsections[k-1].shortTitle];
    }
    if (j > 0) {
      return [`/${i}/${j+1}`, sections[j].title, sections[j].shortTitle]
    }
    if (i > 0){
      return [`/${i}`, chapters[i].title, chapters[i].shortTitle]
    }
    return [null, null, null];
  })();
  
  import { Fraction, getRandomFrac } from 'mathlify';
  const x = new Fraction(1,2);
  const y = new Fraction(2,3);
  const qnString = `${x} + ${y}`;
  const ans = x.plus(y);
  const ansString = `${ans}`;
  const latexString = `${x} + ${y} = ${ans}`;
  const code = 
`const x = new Fraction(1,2);
const y = new Fraction(2,3);
const latexString = \`\${x} + \${y} = \${x.plus(y)}\`;
// latexString: "\\frac{1}{2} + \\frac{2}{3} = \\frac{7}{6}"
`;

  const x2 = getRandomFrac().abs();
  const y2 = getRandomFrac({allowInt: false}).abs();
  const qnString2 = `${x2} + ${y2}`;
  const ans2 = x2.plus(y2);
  const ansString2 = `${ans2}`;
  const latexString2 = `${x2} + ${y2} = ${ans2}`;
  const code2 = 
`const x2 = getRandomFrac().abs();
const y2 = getRandomFrac({allowInt: false}).abs();
const latexString = \`\${x} + \${y} = \${x.plus(y)}\`;
`;

const svelteCode = 
`<script>
  import { math } from 'mathlifier';
  // x,y from above
  const qnString = \`\${x} + \${y}\`;
  const ans = x.plus(y);
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
	<li class="crumb">{subsection.shortTitle}</li>
</ol>
<ol class="breadcrumb mt-4 text-sm">
  {#if prevLink}
	<li class="crumb"><a class="anchor" href={prevLink}>{prevShortTitle}</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
  {/if}
	<li class="crumb">{subsection.shortTitle}</li>
  {#if nextLink}
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a class="anchor" href={nextLink}>{nextShortTitle}</a></li>
  {/if}
</ol>

<div class="prose">
  <h1>{i}.{j+1}.{k+1}. {title}</h1>
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