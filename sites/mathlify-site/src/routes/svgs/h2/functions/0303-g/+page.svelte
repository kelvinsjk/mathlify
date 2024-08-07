<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { absTerm } from 'mathlify/fns';
	import { Expression, Polynomial } from 'mathlify';
	const exp = new Polynomial([3, -1], { ascending: true });
	const options = { color: 'green' };
</script>

<div class="content prose">
	<Graph
		xMin={-0.5}
		yMin={-1.5}
		xMax={4.5}
		yMax={2.5}
		curves={[
			{
				domain: [1, 4],
				exp,
				options: { n: 2, color: 'blue', label: { pos: 'mid', offset: [0, -5], text: 'y=g(x)' } },
			},
		]}
		points={[
			{ x: 1, y: 2, marker: 'open', offset: [0, -5] },
			{ x: 4, y: -1, marker: 'closed', offset: [0, 5] },
		]}
		showOrigin={true}
	/>
</div>
