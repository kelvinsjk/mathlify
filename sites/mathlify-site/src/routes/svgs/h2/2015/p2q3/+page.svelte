<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { Expression, Polynomial } from 'mathlify';
	const exp = new Expression([1, '/', new Polynomial([1, 0, -1], { ascending: true })]);
	const options = { color: 'green' };
</script>

<div class="content prose">
	<Graph
		xMin={-1.5}
		xMax={5}
		yMax={1}
		yMin={-5.5}
		asymptotes={[
			{ x: 1, options },
			{ y: 0, options },
		]}
		lines={[{ y: -2.5, options: { color: 'black', label: { text: math(`y=k`) } } }]}
		curves={[
			{ domain: [1.095, 2], exp, options: { color: 'blue', label: { pos: 'mid' } } },
			{ domain: [2, 5], exp, options: { color: 'blue' } },
		]}
	/>
</div>
