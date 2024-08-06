<script lang="ts">
	const solns = import.meta.glob('/src/content/solutions/**/*.soln.ts');
	console.log(solns);
</script>

<ul class="prose">
	{#each Object.keys(solns) as key}
		{@const soln = key.slice(12, key.length - 8)}
		<li><a href={soln}>{soln.slice(11)}</a></li>
	{/each}
</ul>
