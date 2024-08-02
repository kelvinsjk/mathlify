<script context="module" lang="ts">
	import temml from 'temml';
	const math = temml.renderToString;

	type LeftInterval = { type: 'left'; x: number | [number, number]; inclusive: boolean };
	type RightInterval = { type: 'right'; x: number | [number, number]; inclusive: boolean };
	type TwoSidedInterval = {
		type: 'two';
		x1: number | [number, number];
		x2: number | [number, number];
		inclusive: [boolean, boolean];
	};
	export type Interval = LeftInterval | RightInterval | TwoSidedInterval;

	/**
	 * xMin and xMax are in the same units as x
	 * xLeft and xRight are scale required
	 */
	export function xToNumber(
		x: number | [number, number],
		options: { xMin: number; xMax: number; xLeft: number; xRight: number },
	): number {
		const { xMin, xMax, xLeft, xRight } = options;
		const xVal = typeof x === 'number' ? x : x[0] / x[1];
		// scale
		return xLeft + ((xVal - xMin) / (xMax - xMin)) * (xRight - xLeft);
	}
	export function xToMathML(x: number | [number, number]): string {
		let tex = x.toString();
		if (typeof x !== 'number') {
			const [num, den] = x;
			const sign = num < 0 ? '-' : '';
			tex = `${sign}\\frac{${Math.abs(num)}}{${den}}`;
		}
		return math(tex, { xml: true });
	}
</script>

<script lang="ts">
	const {
		xMin = -10,
		xMax = 10,
		intervals = [
			{ type: 'left', x: -7, inclusive: false },
			{ type: 'two', x2: -5, x1: [-1, 2], inclusive: [true, false] },
			{ type: 'right', x: 3, inclusive: true },
		],
	}: { xMin?: number; xMax?: number; intervals: Interval[] } = $props();

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
</script>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox} class="number-line">
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
	<foreignObject x={x2 + 2} y="0" width="1" height="1">
		{@html math('x', { xml: true })}
	</foreignObject>
	<!--intervals-->
	{#each intervals as interval}
		<!--marker-->
		{@const x = interval.type === 'two' ? interval.x1 : interval.x}
		<line
			x1={scale(x)}
			x2={scale(x)}
			y1={-yUnit * 0.8}
			y2={yUnit * 0.8}
			style={`stroke:${color};stroke-width:${strokeWidth / 2}`}
		/>
		{#if interval.type === 'two'}
			{@const x1 = scale(interval.x2)}
			<line
				{x1}
				x2={x1}
				y1={-yUnit * 0.8}
				y2={yUnit * 0.8}
				style={`stroke:${color};stroke-width:${strokeWidth / 2}`}
			/>
		{/if}
		<!--marker label-->
		<foreignObject x={scale(x)} y={yUnit * 1.2} width="1" height="1">
			<div class:fraction={typeof x !== 'number'}>
				{@html xToMathML(x)}
			</div>
		</foreignObject>
		{#if interval.type === 'two'}
			<foreignObject x={scale(interval.x2)} y={yUnit * 1.2} width="1" height="1">
				<div class:fraction={typeof interval.x2 !== 'number'}>
					{@html xToMathML(interval.x2)}
				</div>
			</foreignObject>
		{/if}
		<!--interval-->
		{#if interval.type === 'two'}
			<line
				x1={scale(interval.x1)}
				x2={scale(interval.x2)}
				y1={-yUnit * 2}
				y2={-yUnit * 2}
				style={`stroke:${color};stroke-width:${strokeWidth}`}
				marker-start={`url(#${interval.inclusive[0] ? 'closed' : 'open'})`}
				marker-end={`url(#${interval.inclusive[1] ? 'closed' : 'open'})`}
			/>
		{:else}
			<line
				x2={interval.type === 'left' ? xLeft : x2}
				x1={scale(interval.x)}
				y1={-yUnit * 2}
				y2={-yUnit * 2}
				style={`stroke:${color};stroke-width:${strokeWidth}`}
				marker-end={`url(#arrow)`}
				marker-start={`url(#${interval.inclusive ? 'closed' : 'open'})`}
			/>
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
	:global(svg.number-line math) {
		flex-wrap: nowrap;
		align-items: baseline;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		margin-top: 5px;
	}
	foreignObject .fraction {
		font-size: 7px;
	}
</style>
