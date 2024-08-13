<script lang="ts">
	import CriticalValueNumberLine from '$lib/components/svg/CriticalValueNumberLine.svelte';
	import temml from 'temml';
	const math = temml.renderToString;

	import { Polynomial, quotient } from 'mathlify';
	const exp = quotient(new Polynomial([1, -3]).square(), [
		new Polynomial([4, -1], { ascending: true }),
		new Polynomial([1, -2]),
	]);
</script>

<div class="content prose">
	<CriticalValueNumberLine xMin={1} xMax={5} values={[2, 3, 4]} {exp} />
</div>
