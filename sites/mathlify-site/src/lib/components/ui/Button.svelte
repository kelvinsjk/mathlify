<script lang="ts">
	import type { Snippet } from 'svelte';
	import { z } from 'zod';
	const propsSchema = z.object({ children: z.custom<Snippet>() }).catchall(z.any());
	type Props = z.infer<typeof propsSchema>;
	let { children, ...restProps }: Props = $props();
</script>

<button {...restProps}>
	{@render children()}
</button>

<style>
	button {
		background-color: var(--secondary);
		cursor: pointer;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		font-weight: 500;
		line-height: 1.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		height: 2.5rem;
		border: none;

		&:hover {
			background-color: hsla(var(--secondary-hsl), 0.9);
		}
	}
</style>
