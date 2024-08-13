<script lang="ts">
	import {qns} from '$content/solutions/h2/topical';
</script>

<div class="prose" data-sveltekit-preload-data="false">
	{#each Object.keys(qns) as topic}
	<h2>{topic}</h2>
	<div class="grid">
		{#each qns[topic] as qnString}
			{@const [year, paper, qn] = qnString.split('/')}
				<span>
					{year} P{paper.slice(1)} Q{qn.slice(1)}
				</span>
				<a href={`/solutions/h2/${year}/${paper}/${qn}`}>Solution</a>
				<a href={`/protected/h2/${year}/${paper}/${qn}`}>Question</a>
				<a href={`/protected/prototype/h2/${year}/${paper}/${qn}`}>Prototype</a>
		{/each}
	</div>
	{/each}
</div>

<style>
	div.grid {
		display: grid;
		grid-template-columns: repeat(4, auto);
	}
</style>