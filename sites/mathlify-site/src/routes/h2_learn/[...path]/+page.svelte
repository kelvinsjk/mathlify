<script lang="ts">
  /**
   * Mathlified generic Page version 0.0.1
   * generated on 9/4/2024, 9:34:40 PM
   */
  import { invalidate } from '$app/navigation';
  import Content from '$lib/components/mathlified/Content.svelte';

  const { data } = $props();

  $effect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('md-update', () => {
        invalidate('md');
      });
    }
  });
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content content={data.content} />
