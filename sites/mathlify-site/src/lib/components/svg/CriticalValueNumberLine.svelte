<script context="module" lang="ts">
	import temml from 'temml';
	const math = temml.renderToString;
	import { xToNumber, xToMathML } from './NumberLine.svelte';
	import type { Expression } from 'mathlify';
</script>

<script lang="ts">
	const {
		xMin = -10,
		xMax = 10,
		values,
		exp,
	}: { xMin?: number; xMax?: number; values: (number | Expression)[]; exp: Expression } = $props();

	// viewBox:
	// x: -50 to 50. 5% buffer on each side
	// y: -15 to -5: interval. -5 to 5: number line. 5 to 25: labels. total length: 40

	const xLeft = -50;
	const xRight = 50;
	const scale = (x: number | [number, number]) => xToNumber(x, { xMin, xMax, xLeft, xRight });
	const xWidth = xRight - xLeft;
	const y1 = 0;
	const y2 = 0;
	const height = 40;
	const yUnit = height / 8;
	const x1 = xLeft;
	const x2 = xRight + xWidth / 20;
	const viewBox = `${x1 - xWidth / 20} ${-yUnit * 3} ${xWidth * 1.2} ${height * 0.9}`;
	const color = 'black';
	const strokeWidth = 2;

	const notTypeChecked = (x: any) => x;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox} class="critical-value-number-line">
	<style>
		foreignObject {
			color: black;
			font-size: 7px;
			overflow: visible;
			white-space: nowrap;
			display: grid;
		}
		foreignObject math {
			flex-wrap: nowrap;
			align-items: baseline;
			white-space: nowrap;
			transform: translate(-50%, -50%);
		}
	</style>
	<defs>
		<marker id="closed" markerWidth="5" markerHeight="5" refX="1" refY="1">
			<circle cx="1" cy="1" r="1" fill="black" />
		</marker>
		<marker id="open" markerWidth="5" markerHeight="5" refX="1" refY="1">
			<circle
				cx="1"
				cy="1"
				r="0.75"
				fill="white"
				markerUnits="strokeWidth"
				style={`stroke:${color}; stroke-width:${strokeWidth / 4}`}
			/>
		</marker>
		<marker id="arrow" markerWidth="5" markerHeight="5" refX="0" refY="1" orient="auto">
			<path d="M 0 0 L 2 1 L 0 2 z" fill="black" />
		</marker>
	</defs>
	<!--axis-->
	<line
		{x1}
		{x2}
		{y1}
		{y2}
		style={`stroke:${color};stroke-width:${strokeWidth}`}
		marker-end="url(#arrow)"
	/>
	<!--x label-->
	<foreignObject x={x2 + 4} y="5" width="1" height="1">
		<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
			{@html math('x', { xml: true })}
		</div>
	</foreignObject>
	<!--intervals-->
	{#each values as value, i}
		<!--marker-->
		{@const x = value.valueOf()}
		{@const prev = (values[i - 1] ?? xMin).valueOf()}
		{@const mid = (prev + x) / 2}
		{@const testY = exp.fn(mid)}
		{@const plus = testY > 0 ? math('+', { xml: true }) : math('-', { xml: true })}
		<line
			x1={scale(x)}
			x2={scale(x)}
			y1={-yUnit * 0.8}
			y2={yUnit * 0.8}
			style={`stroke:${color};stroke-width:${strokeWidth / 2}`}
		/>
		<!--marker label-->
		<foreignObject x={scale(x)} y={yUnit * 1.2 + 4} width="1" height="1">
			<div
				style="display: grid"
				class:fraction={typeof x !== 'number'}
				{...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}
			>
				{@html xToMathML(x)}
			</div>
		</foreignObject>
		<!-- +/- -->
		<foreignObject x={scale(mid)} y={-yUnit * 2 + 3} width="1" height="1">
			<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
				{@html plus}
			</div>
		</foreignObject>
		{#if i === values.length - 1}
			{@const mid = (x + xMax) / 2}
			{@const testY = exp.fn(mid)}
			{@const plus = testY > 0 ? math('+', { xml: true }) : math('-', { xml: true })}
			<!-- +/- -->
			<foreignObject x={scale(mid)} y={-yUnit * 2 + 3} width="1" height="1">
				<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
					{@html plus}
				</div>
			</foreignObject>
		{/if}
	{/each}
</svg>

<style>
	:global(svg *:has(math)) {
		color: black;
		font-size: 10px;
		overflow: visible;
		display: grid;
		white-space: nowrap;
	}
	:global(svg.critical-value-number-line math) {
		flex-wrap: nowrap;
		align-items: baseline;
		white-space: nowrap;
		transform: translate(-50%, -50%);
	}
	foreignObject .fraction {
		font-size: 7px;
	}
	svg {
		outline: 1px solid red;
	}
</style>
