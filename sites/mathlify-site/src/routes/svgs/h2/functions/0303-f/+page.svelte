<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { absTerm } from 'mathlify/fns';
	import { Expression, Polynomial } from 'mathlify';
	const exp = Polynomial.ofDegree(2);
	const options = { color: 'green' };
</script>

<div class="content prose">
	<Graph
		xMin={-2.3}
		yMin={-0.5}
		xMax={2.3}
		yMax={Math.pow(2.3, 2)}
		curves={[
			{
				domain: [-1, 2],
				exp,
				options: { color: 'blue', label: { pos: 'end', offset: [-18, 65], text: 'y=f(x)' } },
			},
			{
				domain: [-1, -2.3],
				exp,
				options: { color: 'green', dashed: true },
			},
			{
				domain: [2, 2.3],
				exp,
				options: { color: 'green', dashed: true },
			},
		]}
		points={[
			{ x: -1, y: 1, marker: 'closed', offset: [-11, 0] },
			{ x: 2, y: 4, marker: 'open', offset: [-8, 0] },
		]}
		showOrigin={true}
	/>
</div>
