<script lang="ts">
	import '../app.css';
  import Header from '$lib/components/Header/Header.svelte';
</script>

<Header />
<main>
  <slot />
</main>

<style>
  main {
    height: calc(100% - var(--header-height));
  }
</style>