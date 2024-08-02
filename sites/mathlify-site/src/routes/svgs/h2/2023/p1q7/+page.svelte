<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { absTerm } from 'mathlify/fns';
	import { Expression, Polynomial } from 'mathlify';
	const exp = absTerm(
		new Expression([new Polynomial([2, 4]), '/', new Polynomial([3, -1], { ascending: true })]),
	);
	const options = { color: 'green' };
</script>

<div class="content prose">
	<Graph
		yMax={14}
		yMin={-2}
		asymptotes={[
			{ x: 3, options },
			{ y: 2, options },
		]}
		curves={[
			{ domain: [-10, 2.333], exp, options: { n: 60, color: 'blue' } },
			{ domain: [3.909, 10], exp, options: { color: 'blue', label: { pos: 'start' } } },
		]}
		xLabels={[{ value: -2, label: math(`(-2, 0)`, { xml: true }) }]}
		yLabels={[{ value: [4, 3], label: math(`\\left(0, \\frac{4}{3}\\right)`, { xml: true }) }]}
	/>
</div>
