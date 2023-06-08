<script lang="ts">
  import { math } from 'mathlifier';
  import { chapters } from '$lib/chapters';

  const description = `In this part, we learn how to
    simplify fractions involving negative numbers.`;
  const i = 0;
  const j = 1;
  const k = 2;
  
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
  
  import { Fraction, getRandomInts } from 'mathlify';
  const negativeTwo = -2;
  const negativeThree = -3;
  const four = 4;
  const qnString = `\\displaystyle \\frac{${negativeTwo}}{${four}}`;
  const qnString2 = `\\displaystyle \\frac{${four}}{${negativeThree}}`;
  const qnString3 = `\\displaystyle \\frac{${negativeTwo}}{${negativeThree}}`;
  const ans = new Fraction(negativeTwo, four);
  const ans2 = new Fraction(four, negativeThree);
  const ans3 = new Fraction(negativeTwo, negativeThree);
  const ansString =  `${ans}`;
  const ansString2 = `${ans2}`;
  const ansString3 = `${ans3}`;
  const qnStrings = [qnString, qnString2, qnString3];
  const ansStrings = [ansString, ansString2, ansString3];

  const qnStrings2: string[] = [];
  const ansStrings2: string[] = [];
  for (let i = 0; i < 3; i++){
    let [num, den] = getRandomInts(2, {min: 1});
    if (i===0 || i===2){
      num = -num;
    }
    if (i===1 || i===3){
      den = -den;
    }
    qnStrings2.push(`\\displaystyle \\frac{${num}}{${den}}`);
    ansStrings2.push(`${new Fraction(num, den)}`);
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