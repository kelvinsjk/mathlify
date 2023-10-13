<script lang="ts">
	import { components } from '$lib/components';
	import { content, title } from './content';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#each content as element}
	{@const type = element.type}
	{#if type === 'h2' || type === 'h3' || type === 'p' || type === 'display'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'example'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'iExample'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'iQn'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else}
		{console.log(element)}
		<p>Error: Unknown element received</p>
	{/if}
{/each}
