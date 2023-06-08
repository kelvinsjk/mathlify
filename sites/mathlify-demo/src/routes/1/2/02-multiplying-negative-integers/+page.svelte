<script lang="ts">
  import { math } from 'mathlifier';
  import { chapters } from '$lib/chapters';

  const description = `In this part, we learn how to
    multiply and divide negative integers.`;
  const i = 0;
  const j = 1;
  const k = 1;
  
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


  import { getRandomInts } from 'mathlify';
  const negativeTwo = -2;
  const negativeFive = -5;
  const three = 3;
  const negativeSix = -6;
  const eight = 8;
  const qnString = `${three} \\times (${negativeTwo})`;
  const ans = three * negativeTwo;
  const qnStringB = `${negativeFive} \\cdot ${three}`;
  const ansB = negativeFive * three;
  const qnStringC = `${negativeFive} (${negativeTwo})`;
  const ansC = negativeFive * negativeTwo;
  const qnStringD = `${eight} \\div (${negativeTwo})`;
  const ansD = eight/negativeTwo;
  const qnStringE = `\\displaystyle \\frac{${negativeSix}}{${three}}`;
  const ansE = negativeSix / three;
  const qnStringF = `${negativeSix} \\div (${negativeTwo})`;
  const ansF = negativeSix/negativeTwo;
  const ansString = `${ans}`;
  const ansStringB = `${ansB}`;
  const ansStringC = `${ansC}`;
  const ansStringD = `${ansD}`;
  const ansStringE = `${ansE}`;
  const ansStringF = `${ansF}`;
  const qnStrings = [qnString, qnStringB, qnStringC, qnStringD, qnStringE, qnStringF];
  const ansStrings = [ansString, ansStringB, ansStringC, ansStringD, ansStringE, ansStringF];

  const qnStrings2: string[] = [];
  const ansStrings2: string[] = [];
  for (let i =0; i<6; i++){
    let [a,b,c] = getRandomInts(3);
    if (c===0){
      [c] = getRandomInts(1,{avoid:0})
    }
    if (i>2){
      a = a*c;
      b = c;
    }
    const signs = ['\\times ', '\\cdot ', '', '\\div ', '', '\\div ']
    const qnString = i===2 ?
      `${a}\\left( ${b} \\right)` : i===4 ?
      `\\displaystyle \\frac{${a}}{${b}}` :
      `${a} ${signs[i]} ${brackets(b)}`
    qnStrings2.push(qnString);
    ansStrings2.push(i<3 ? `${a*b}` : `${a/b}`);
  }

  function brackets(x: number): string {
    return x < 0 ? `\\left( ${x} \\right)` : `${x}`;
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
      1{String.fromCharCode(97+i)}. Evaluate {@html math(qnString)}
    </div>
    {/each}
    {#each qnStrings2 as qnString,i}
    <div>
      2{String.fromCharCode(97+i)}. Evaluate {@html math(qnString)}
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
