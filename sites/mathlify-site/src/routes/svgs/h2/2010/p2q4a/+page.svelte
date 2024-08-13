<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { Polynomial } from 'mathlify';
	const exp = new Polynomial([1, 0, -1]).reciprocal();
</script>

<div class="content prose">
	<Graph
		xMin={-5}
		xMax={5}
		yMin={-5}
		yMax={5}
		asymptotes={[
			{
				y: 0,
				options: {
					color: 'black',
					label: { offset: [0, 5] },
				},
			},
			{
				x: -1,
				options: {
					color: 'green',
					label: { offset: [-12, 95] },
				},
			},
			{
				x: 1,
				options: {
					color: 'green',
					label: { offset: [12, 95] },
				},
			},
		]}
		curves={[
			{
				domain: [-4.9, -1.09731],
				exp,
				options: { color: 'blue', n: 50 },
			},
			{
				domain: [-0.89214, 0.89214],
				exp,
				options: { color: 'blue' },
			},
			{
				domain: [1.09731, 4.9],
				exp,
				options: {
					color: 'blue',
					label: { pos: 'start', text: 'y=f(x)', offset: [3, 25] },
					n: 50,
				},
			},
		]}
		yLabels={[
			{
				value: -1,
				label: math(`(0,-1)`, { xml: true }),
				offset: [-2, 0],
			},
		]}
		showOrigin={true}
	/>
</div>
