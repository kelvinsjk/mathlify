<script lang="ts">
	import Graph from '$lib/components/svg/Graph.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { e, Expression, Polynomial, sum } from 'mathlify';
	import { logTerm, sqrtTerm } from 'mathlify/fns';
	const exp = sum(logTerm(new Polynomial([2, 1])), 3);
	const fInv = new Expression([sum([e, '^', new Polynomial([1, -3])], -1), '/', 2]);
</script>

<div class="content prose">
	<Graph
		xMin={-2}
		xMax={7}
		yMin={-2}
		yMax={7}
		asymptotes={[
			{
				pt1: [-2, -2],
				pt2: [7, 7],
				options: { color: 'black', label: { text: 'y=x', offset: [2, 1] } },
			},
			{
				x: -0.6,
				options: {
					color: 'blue',
					label: { text: 'x=-\\frac{1}{2}', offset: [-10, 7] },
					fontSize: 6,
				},
			},
			{
				y: -0.6,
				options: {
					color: 'green',
					label: { text: 'y=-\\frac{1}{2}', offset: [80, 8] },
					fontSize: 6,
				},
			},
		]}
		curves={[
			{
				domain: [-0.496, 0],
				exp,
				options: { color: 'blue', n: 50 },
			},
			{
				domain: [0, 7],
				exp,
				options: {
					color: 'blue',
					label: { pos: 'start', text: 'y=f(x)', offset: [10, -26] },
					n: 50,
				},
			},
			{
				domain: [-1.828, 5.708],
				exp: fInv,
				options: {
					n: 50,
					color: 'green',
					label: { pos: 'mid', text: 'y=f^{-1}(x)', offset: [26, -15] },
				},
			},
		]}
		xLabels={[
			{ value: 3, label: math(`(3,0)`, { xml: true }) },
			{
				value: -0.475,
				label: math(`\\left(\\frac{\\mathrm{e}^{-3}-1}{2},0\\right)`, { xml: true }),
				offset: [-11, -13],
				font: 'xs',
			},
		]}
		yLabels={[
			{ value: 3, label: math(`(0,3)`, { xml: true }) },
			{
				value: -0.475,
				label: math(`\\left(0,\\frac{\\mathrm{e}^{-3}-1}{2}\\right)`, { xml: true }),
				offset: [23, 7],
				font: 'xs',
			},
		]}
	/>
</div>
