<script context="module" lang="ts">
	import temml from 'temml';
	const math = temml.renderToString;
	import { xToNumber, xToMathML } from './NumberLine.svelte';
	import type { Expression } from 'mathlify';

	export interface GraphOptions {
		color?: string;
		n?: number;
		label?: { text?: string; pos?: 'start' | 'end' | 'mid'; offset?: [number, number] };
		font?: string;
		fontSize?: number;
		dashed?: boolean;
	}
	export interface HorizontalLine {
		y: number;
		options?: GraphOptions;
	}
	export interface VerticalLine {
		x: number;
		options?: GraphOptions;
	}
	export interface ObliqueLine {
		pt1: [number, number];
		pt2: [number, number];
		options?: GraphOptions;
	}
	export type Line = HorizontalLine | VerticalLine | ObliqueLine;
	export interface Curve {
		exp: Expression;
		domain: [number, number];
		options?: GraphOptions;
	}
	export interface AxialIntercept {
		value: number | [number, number];
		label?: string;
		offset?: [number, number];
		font?: string;
	}
	export interface Point {
		x: number | [number, number];
		y: number | [number, number];
		label?: string;
		marker: 'open' | 'closed'; // TODO: cross
		offset?: [number, number];
	}
</script>

<script lang="ts">
	// foreignObject > math aligns to right of point
	// foreignObject > div > math centers the label

	const {
		xMin = -10,
		xMax = 10,
		yMin = -10,
		yMax = 10,
		asymptotes = [],
		lines = [],
		curves = [],
		xLabels = [],
		yLabels = [],
		points = [],
		showOrigin = false,
	}: {
		xMin?: number;
		xMax?: number;
		yMin?: number;
		yMax?: number;
		asymptotes?: Line[];
		lines?: Line[];
		curves?: Curve[];
		xLabels?: AxialIntercept[];
		yLabels?: AxialIntercept[];
		points?: Point[];
		showOrigin?: boolean;
	} = $props();

	// viewBox:
	// x: -50 to 50. 5% buffer on each side. extra 10% on right to accommodate for x axis label
	// y: scaled by comparing length to x. 5% buffer on each side

	const [xLeft, xRight] = [-50, 50];
	const yAmplitude = ((yMax - yMin) / (xMax - xMin)) * 50;
	const [yBottom, yTop] = [yAmplitude, -yAmplitude];
	const scaleX = (x: number | [number, number]) => xToNumber(x, { xMin, xMax, xLeft, xRight });
	const scaleY = (y: number | [number, number]) =>
		xToNumber(y, { xMin: yMin, xMax: yMax, xLeft: yBottom, xRight: yTop });
	const xWidth = xRight - xLeft;
	const yWidth = yBottom - yTop;
	const viewBox = `${xLeft - xWidth / 20} ${yTop - yWidth / 10} ${xWidth * 1.1} ${yWidth * 1.1}`;
	const color = 'black';
	const strokeWidth = 2;

	const colors = ['blue', 'green', 'red'];

	const ds: string[] = [];
	for (const curve of curves) {
		const [x1, x2] = curve.domain;
		const width = x2 - x1;
		const n = curve.options?.n ?? 30;
		let d = 'M';
		for (let i = 0; i < n; i++) {
			const x = x1 + (i * width) / (n - 1);
			const y = curve.exp.fn(x);
			d += `${scaleX(x).toPrecision(5)},${scaleY(y).toPrecision(5)} `;
		}
		ds.push(d);
	}

	// workaround
	const notTypeChecked = (x: any) => x;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox} class="graph">
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
			transform: translate(-50%, -50%);
		}
		foreignObject div.sm {
			font-size: 5px;
		}
		foreignObject div.xs {
			font-size: 3px;
		}
	</style>
	<!--markers-->
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
	<!--axes-->
	<line
		x1={scaleX(xMin)}
		x2={scaleX(xMax)}
		y1={scaleY(0)}
		y2={scaleY(0)}
		style={`stroke:${color};stroke-width:${strokeWidth}`}
		marker-end="url(#arrow)"
	/>
	<line
		x1={scaleX(0)}
		x2={scaleX(0)}
		y1={scaleY(yMin)}
		y2={scaleY(yMax)}
		style={`stroke:${color};stroke-width:${strokeWidth}`}
		marker-end="url(#arrow)"
	/>
	<!--x/y axis labels-->
	<foreignObject x={scaleX(xMax)} y={scaleY(0) + 5} width="1" height="1">
		{@html math('x', { xml: true })}
	</foreignObject>
	<foreignObject x={scaleX(0) - 5} y={scaleY(yMax) - 2} width="1" height="1">
		{@html math('y', { xml: true })}
	</foreignObject>
	<!--origin-->
	{#if showOrigin}
		<foreignObject x={scaleX(0) - 5} y={scaleY(0) + 5} width="1" height="1">
			<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
				{@html xToMathML(0)}
			</div>
		</foreignObject>
	{/if}
	<!--lines-->
	{#each asymptotes as asymptote, i}
		{@const color = asymptote.options?.color ?? colors[i % colors.length]}
		{#if 'x' in asymptote}
			{@const label = asymptote.options?.label?.text ?? `x=${asymptote.x}`}
			{@const offset = asymptote.options?.label?.offset ?? [0, 0]}
			<!--vertical-->
			<line
				x1={scaleX(asymptote.x)}
				x2={scaleX(asymptote.x)}
				y1={scaleY(yMin)}
				y2={scaleY(yMax)}
				style={`stroke:${color}`}
				stroke-dasharray="4"
			/>
			<foreignObject
				class="graph-label"
				x={scaleX(asymptote.x) + offset[0]}
				y={scaleY(yMax) + offset[1]}
				width="1"
				height="1"
			>
				<div
					style={`display: grid; ${asymptote.options?.fontSize ? `font-size: ${asymptote.options?.fontSize}px;` : ''}`}
					{...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}
					class:xs={asymptote?.options?.font === 'xs'}
				>
					{@html math(label, { xml: true })}
				</div>
			</foreignObject>
		{:else if 'y' in asymptote}
			{@const label = asymptote.options?.label?.text ?? `y=${asymptote.y}`}
			{@const offset = asymptote.options?.label?.offset ?? [0, 0]}
			<!--horizontal-->
			<line
				x1={scaleX(xMin)}
				x2={scaleX(xMax)}
				y1={scaleY(asymptote.y)}
				y2={scaleY(asymptote.y)}
				style={`stroke:${color};`}
				stroke-dasharray="4"
			/>
			<foreignObject
				class="graph-label"
				x={scaleX(xMin) + offset[0]}
				y={scaleY(asymptote.y) + offset[1]}
				width="1"
				height="1"
				style={`${asymptote.options?.fontSize ? `font-size: ${asymptote.options?.fontSize}px;` : ''}`}
			>
				{@html math(label, { xml: true })}
			</foreignObject>
		{:else}
			<!--oblique-->
			<line
				x1={scaleX(asymptote.pt1[0])}
				x2={scaleX(asymptote.pt2[0])}
				y1={scaleY(asymptote.pt1[1])}
				y2={scaleY(asymptote.pt2[1])}
				style={`stroke:${color};`}
				stroke-dasharray="4"
			/>
			{#if asymptote.options?.label?.text}
				{@const pos = asymptote.options.label.pos ?? 'mid'}
				{@const x =
					pos === 'start'
						? asymptote.pt1[0]
						: pos === 'end'
							? asymptote.pt2[0]
							: (asymptote.pt1[0] + asymptote.pt2[0]) / 2}
				{@const y =
					pos === 'start'
						? asymptote.pt1[1]
						: pos === 'end'
							? asymptote.pt2[1]
							: (asymptote.pt1[1] + asymptote.pt2[1]) / 2}
				{@const offset = asymptote.options?.label.offset ?? [0, 0]}
				<foreignObject
					class="graph-label"
					x={scaleX(x) + offset[0]}
					y={scaleY(y) + offset[1]}
					width="1"
					height="1"
				>
					{@html math(asymptote.options.label.text, { xml: true })}
				</foreignObject>
			{/if}
		{/if}
	{/each}
	{#each lines as asymptote, i}
		{@const color = asymptote.options?.color ?? colors[i % colors.length]}
		{#if 'x' in asymptote}
			<!--vertical-->
			<line
				x1={scaleX(asymptote.x)}
				x2={scaleX(asymptote.x)}
				y1={scaleY(yMin)}
				y2={scaleY(yMax)}
				style={`stroke:${color}`}
			/>
			<!--TODO: custom label-->
			<foreignObject
				class="graph-label"
				x={scaleX(asymptote.x)}
				y={scaleY(yMax)}
				width="1"
				height="1"
			>
				<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
					{@html math(`x=${asymptote.x}`, { xml: true })}
				</div>
			</foreignObject>
		{:else if 'y' in asymptote}
			{@const text = asymptote.options?.label?.text ?? math(`y=${asymptote.y}`, { xml: true })}
			<!--horizontal-->
			<line
				x1={scaleX(xMin)}
				x2={scaleX(xMax)}
				y1={scaleY(asymptote.y)}
				y2={scaleY(asymptote.y)}
				style={`stroke:${color};`}
			/>
			<foreignObject
				class="graph-label"
				x={scaleX(xMin)}
				y={scaleY(asymptote.y) - 5}
				width="1"
				height="1"
			>
				{@html text}
			</foreignObject>
			<!--TODO: oblique asymptotes-->
		{/if}
	{/each}
	<!--curves-->
	{#each curves as curve, i}
		{@const color = curve.options?.color ?? colors[i % colors.length]}
		<path
			d={ds[i]}
			style={`stroke:${color}; fill:none`}
			stroke-dasharray={curve.options?.dashed ? '4' : '0'}
		/>
		{#if curve.options?.label}
			{@const text = curve.options?.label.text ?? `y=${curve.exp}`}
			{@const x =
				curve.options?.label.pos === 'start'
					? curve.domain[0]
					: curve.options?.label.pos === 'mid'
						? (curve.domain[0] + curve.domain[1]) / 2
						: curve.domain[1]}
			{@const y = curve.exp.fn(x)}
			{@const offset = curve.options?.label.offset ?? [0, 0]}
			<foreignObject
				class="graph-label"
				x={scaleX(x) + offset[0]}
				y={scaleY(y) + offset[1]}
				width="1"
				height="1"
			>
				{@html math(text, { xml: true })}
			</foreignObject>
		{/if}
	{/each}
	<!--axial labels-->
	{#each xLabels as label}
		{@const x = Array.isArray(label.value)
			? scaleX(label.value[0] / label.value[1])
			: scaleX(label.value)}
		{@const text = label.label ?? xToMathML(label.value)}
		{@const offset = label.offset ?? [0, 0]}
		<line x1={x} y1={scaleY(0) - 3} x2={x} y2={scaleY(0) + 3} style="stroke:black" />
		<foreignObject x={x + offset[0]} y={scaleY(0) + 6 + offset[1]} width="1" height="1">
			<!--@expect-error-->
			<div
				style="display: grid"
				{...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}
				class:xs={label.font === 'xs'}
			>
				{@html text}
			</div>
		</foreignObject>
	{/each}
	{#each yLabels as label}
		{@const y = Array.isArray(label.value)
			? scaleY(label.value[0] / label.value[1])
			: scaleY(label.value)}
		{@const text = label.label ?? xToMathML(label.value)}
		{@const offset = label.offset ?? [0, 0]}
		<line x1={scaleX(0) - 3} y1={y} x2={scaleX(0) + 3} y2={y} style="stroke:black" />
		<foreignObject x={scaleX(0) - 10 + offset[0]} y={y + offset[1]} width="1" height="1">
			<div
				class="label-left"
				class:xs={label.font === 'xs'}
				style="display: grid"
				{...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}
			>
				{@html text}
			</div>
		</foreignObject>
	{/each}
	<!--points label-->
	{#each points as point}
		{@const x = Array.isArray(point.x) ? scaleX(point.x[0] / point.x[1]) : scaleX(point.x)}
		{@const y = Array.isArray(point.y) ? scaleY(point.y[0] / point.y[1]) : scaleY(point.y)}
		{@const xString = Array.isArray(point.x) ? `\\frac{${point.x[0]}}{${point.x[1]}}` : point.x}
		{@const yString = Array.isArray(point.y) ? `\\frac{${point.y[0]}}{${point.y[1]}}` : point.y}
		{@const text = point.label ?? math(`\\left( ${xString}, ${yString} \\right)`)}
		{@const offset = point.offset ?? [0, 0]}
		<path d={`M${x},${y}`} marker-start={`url(#${point.marker})`} style="stroke:black" />
		<foreignObject x={x + offset[0]} y={y + offset[1]} width="1" height="1">
			<!--@expect-error-->
			<div style="display: grid" {...notTypeChecked({ xmlns: 'http://www.w3.org/1999/xhtml' })}>
				{@html text}
			</div>
		</foreignObject>
	{/each}
</svg>

<style>
	:global(svg.graph math) {
		white-space: nowrap;
		transform: translate(-50%, -50%);
	}
	foreignObject,
	foreignObject > div {
		font-size: 7px;
	}
	.label-left {
		transform: translate(-100%, 0%);
	}
	svg {
		outline: 1px solid red;
	}
</style>
