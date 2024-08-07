<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';

	import { Polynomial, sum } from 'mathlify';
	import { sqrtTerm } from 'mathlify/fns';
	const exp = sum([new Polynomial([1, -4]), '^', 2], 1);
	const fInv = sum(sqrtTerm(new Polynomial([1, -1])), 4);
</script>

<div class="content prose">
	<Graph
		xMin={-1}
		xMax={7.1}
		yMin={-1}
		yMax={7.1}
		asymptotes={[
			{
				pt1: [-0.2, -0.2],
				pt2: [7, 7],
				options: { color: 'black', label: { text: 'y=x', offset: [2, 1] } },
			},
		]}
		points={[
			{ x: 4, y: 1, marker: 'open' },
			{ x: 1, y: 4, marker: 'open' },
		]}
		curves={[
			{
				domain: [4, 6.449],
				exp,
				options: { color: 'blue', label: { pos: 'mid', text: 'y=f(x)', offset: [2, 0] } },
			},
			{
				domain: [1, 1.3],
				exp: fInv,
				options: { n: 50, color: 'green' },
			},
			{
				domain: [1.3, 7],
				exp: fInv,
				options: {
					n: 50,
					color: 'green',
					label: { pos: 'start', text: 'y=f^{-1}(x)', offset: [0, -20] },
				},
			},
		]}
		showOrigin={true}
	/>
</div>
