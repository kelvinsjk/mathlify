<script lang="ts">
	import '../app.css';
  import Header from '$lib/components/Header/Header.svelte';

  let {children} = $props();
</script>

<Header />
<main>
  {@render children()}
</main>

<style>
  main {
    height: calc(100% - var(--header-height));
  }
</style>