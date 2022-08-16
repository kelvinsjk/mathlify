<script lang="ts">
  import { qnProgress, defaultQnProgress } from '$lib/progress/stores';
  import { topics } from '$lib/topics';
</script>

<svelte:head>
  <title>Your Progress</title>
</svelte:head>

<div class="prose mx-auto p-4 dark:text-zinc-100">
  <h1 class="dark:text-goldenrod">Your Progress</h1>
  {#key $qnProgress}
  {#each Object.keys($qnProgress) as topic}
  <h2 class="dark:text-zinc-300">{topic}. {topics[Number(topic)-1]}</h2>
  {#each Object.keys($qnProgress[topic]) as qn}
  {@const qnProg = $qnProgress[topic][qn]}
  {@const checked3 = qnProg === 'completed' || (Array.isArray(qnProg) && qnProg.every(e=>e==='completed'))}
  {@const checked2 = !checked3 && ((Array.isArray(qnProg) && qnProg.some(e=>e==='completed')))}
  {@const checked = (!checked2 && !checked3) && ( qnProg==='new'|| (Array.isArray(qnProg) && qnProg.every(e=>e==='new')) )}
  {@const checked1 = !checked2 && !checked3 && !checked}
    <div class="grid gap-2 items-center mx-4">
      <a href={`/questions/${topic}/${qn}`} sveltekit:prefetch class="dark:text-zinc-100">
        {qn} 
      </a>
      <div class="rating">
        <input type="radio" name="{`rating-${qn}`}" class="star rating-hidden" disabled {checked} />
        <input type="radio" name="{`rating-${qn}`}" class="star bg-yellow-500 mask mask-star" disabled checked={checked1} />
        <input type="radio" name="{`rating-${qn}`}" class="star bg-yellow-500 mask mask-star" disabled checked={checked2} />
        <input type="radio" name="{`rating-${qn}`}" class="star bg-yellow-500 mask mask-star" disabled checked={checked3} />
      </div>
    </div>
  {/each}
  {/each}
  {/key}
  <h2 class="dark:text-zinc-300">Reset progress</h2>
  <button
    class="btn btn-warning mx-2"
    on:click={()=>{
      qnProgress.set(defaultQnProgress);
    }}
  >
    Reset
  </button>
</div>



<style>
  .grid {
    grid-template-columns: 5ch 1fr;
  }
  .star {
    cursor: default;
  }
</style>