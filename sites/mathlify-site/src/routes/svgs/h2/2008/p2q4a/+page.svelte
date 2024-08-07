<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';

	import { Polynomial, sum } from 'mathlify';
	const exp = sum([new Polynomial([1, -4]), '^', 2], 1);
</script>

<div class="content prose">
	<Graph
		xMin={-1}
		xMax={7.1}
		yMin={-1}
		yMax={7.1}
		points={[{ x: 4, y: 1, marker: 'open' }]}
		curves={[
			{
				domain: [4, 6.449],
				exp,
				options: { color: 'blue', label: { pos: 'mid', text: 'y=f(x)', offset: [1, 0] } },
			},
		]}
		showOrigin={true}
	/>
</div>
