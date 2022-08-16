<script lang="ts">
	export let value: number = undefined;
	export let invalid = value === undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;
	export let disabled = false;
  export let options: string[] = [];

	$: invalid = value === undefined;
</script>

<div class="grid gap-2">
	{#if name}
		{name}
	{:else}
		Select the correct option:
	{/if}
  {#each options as option,i}
  <button 
		class="btn mx-2"
		class:btn-accent={value===i}
		class:btn-success={correct && value === i}
		class:btn-error={correct===false && value === i}
		disabled={disabled && !(correct!==undefined && value === i)}
		on:click={()=>{
			value = i
		}}
	>
		{@html option}
	</button>
  {/each}
</div>

<style>
	.btn {
		text-transform: none;
	}
	:global(.btn>span.katex){
		padding-inline: 0.5ch;
	}
</style>


