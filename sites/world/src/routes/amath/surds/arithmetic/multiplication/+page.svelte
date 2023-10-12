<script lang="ts">
	import { components } from '$lib/components';
	import { content, title } from './content';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#each content as element}
	<svelte:component this={components[element.type]} {...element} />
{/each}
