<script lang="ts">
  import {draw} from 'svelte/transition';
  import {quintOut} from 'svelte/easing';

  export let correct: boolean = undefined;
</script>



{#if correct}
<svg data-test-id="tick" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path 
    fill="green"
    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11 a9 9 0 11-18 0 9 9 0 0118 0z">
  </path>
  <path 
    stroke="white"
    in:draw={{duration:1000, delay:100, easing:quintOut }}
    stroke-linecap="round" stroke-linejoin="round"
    stroke-width="2" d="M9 12 l2 2 l 4 -4">
  </path>
</svg>
{:else if correct===false}
<svg data-test-id="tick" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path 
  fill="red"
  stroke-linecap="round" 
  stroke-linejoin="round" stroke-width="2" d="M21 11 a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  <path 
  stroke="white"
  in:draw={{duration:500, delay:100, easing:quintOut }}
  stroke-linejoin="round"
  stroke-width="2" d=" M8 8 l8 8"></path>
  <path 
  stroke="white"
  in:draw={{duration:500, delay:600, easing:quintOut }}
  stroke-linejoin="round"
  stroke-width="2" d="M16 8 l-8 8"></path>
</svg>
{/if}
