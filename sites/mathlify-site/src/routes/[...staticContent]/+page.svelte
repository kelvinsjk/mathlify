<script lang="ts">
  import {page} from '$app/stores';
</script>

<main class="content prose static-content">
  {@html $page.data.content}
</main>

<style>
  main {
    font-size: 1.25rem;
    padding-inline: 1rem;
  }
</style>