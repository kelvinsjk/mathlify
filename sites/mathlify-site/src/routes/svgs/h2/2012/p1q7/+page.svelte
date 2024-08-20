<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { e, Expression, Polynomial, quotient, sum } from 'mathlify';
	const exp = quotient(new Polynomial([1, 2]), new Polynomial([1, -1]));
</script>

<div class="content prose">
	<Graph
		showOrigin={true}
		xMin={-5}
		xMax={5}
		yMin={-5}
		yMax={5}
		asymptotes={[
			{
				x: 1,
				options: {
					color: 'green',
					label: { offset: [8, 97] },
					fontSize: 6,
				},
			},
			{
				y: 1,
				options: {
					color: 'green',
					label: { offset: [88, 5] },
					fontSize: 6,
				},
			},
		]}
		curves={[
			{
				domain: [-5, 0.5],
				exp,
				options: { color: 'blue', n: 50 },
			},
			{
				domain: [1.75, 5],
				exp,
				options: {
					color: 'blue',
					label: { pos: 'start', text: 'y=g(x)', offset: [10, 15] },
					n: 50,
				},
			},
		]}
		xLabels={[{ value: -2, label: math(`(-k,0)`, { xml: true }) }]}
		yLabels={[{ value: -2, label: math(`(0,-k)`, { xml: true }) }]}
	/>
</div>
