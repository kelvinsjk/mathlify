<script lang="ts">
  import { math } from 'mathlifier';
  import { chapters } from '$lib/chapters';

  const description = `In this part, we learn how to
    add, subtract, multiply and divide negative fractions.
  `;
  const i = 0;
  const j = 1;
  const k = 3;
  
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
      return [`/${i}/${j+2}}`, sections[j+1].title, sections[j+1].shortTitle]
    }
    if (i < chapters.length - 1){
      return [`/${i+1}}`, chapters[i+1].title, chapters[i+1].shortTitle]
    }
    return [null, null, null];
  })();
  const [prevLink, _, prevShortTitle] = (()=>{
    if (k > 0) {
      return [`/${i}/${j+1}/${subsections[k-1].slug}`, subsections[k-1].title, subsections[k-1].shortTitle];
    }
    if (j > 0) {
      return [`/${i}/${j+1}}`, sections[j].title, sections[j].shortTitle]
    }
    if (i > 0){
      return [`/${i}}`, chapters[i].title, chapters[i].shortTitle]
    }
    return [null, null, null];
  })();
  
  import { Fraction, getRandomFracs } from 'mathlify';
  const negativeTwoThird = new Fraction(-2,3);
  const negativeHalf = new Fraction(-1,2);
  const threeQuarter = new Fraction(3,4);
  const twoFifth = new Fraction(2,5);
  const qnStrings = [
    `${negativeTwoThird} \\times \\left( ${negativeHalf} \\right)`,
    `${threeQuarter} \\div \\left( ${negativeHalf} \\right)`,
    `${twoFifth} + \\left( ${negativeTwoThird} \\right)`,
    `${negativeHalf} - \\left( ${negativeTwoThird} \\right)`,
  ];
  const answers = [
    negativeTwoThird.times(negativeHalf),
    threeQuarter.divide(negativeHalf),
    twoFifth.plus(negativeTwoThird),
    negativeHalf.minus(negativeTwoThird)
  ];
  const ansStrings = answers.map(x=>`${x}`);

  const fracs = getRandomFracs(8);
  const qnStrings2: string[] = [
    `${fracs[0]} \\times ${brackets(fracs[1])}`,
    `${fracs[2]} \\div ${brackets(fracs[3])}`,
    `${fracs[4]} + ${brackets(fracs[5])}`,
    `${fracs[6]} - ${brackets(fracs[7])}`,
  ];
  const ansStrings2: string[] = [
    `${fracs[0].times(fracs[1])}`,
    `${fracs[2].divide(fracs[3])}`,
    `${fracs[4].plus(fracs[5])}`,
    `${fracs[6].minus(fracs[7])}`,
  ];
  function brackets(x: Fraction): string {
    return x.isGreaterThan(0) ? `${x}` : `\\left( ${x} \\right)`
  }
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
    {#each qnStrings as qnString,i}
    <div>
      1{String.fromCharCode(97+i)}. Simplify {@html math(qnString)}
    </div>
    {/each}
    {#each qnStrings2 as qnString,i}
    <div>
      2{String.fromCharCode(97+i)}. Simplify {@html math(qnString)}
    </div>
    {/each}
  </div>
  
  <h2>Answers</h2>
  <div class="grid gap-4">
    {#each ansStrings as ansString,i}
    <div>
      1{String.fromCharCode(97+i)}. {@html math(ansString)}
    </div>
    {/each}
    {#each ansStrings2 as ansString,i}
    <div>
      2{String.fromCharCode(97+i)}. {@html math(ansString)}
    </div>
    {/each}
  </div>

  {#if nextLink}
  <h2>Up Next</h2>
  <div>
    <span class="mr-2 mb-4 inline-block">
      {nextDesc}
    </span> <a href={nextLink} class="btn variant-filled-primary">🎓 Continue >></a>
  </div>
  {/if}

</div>