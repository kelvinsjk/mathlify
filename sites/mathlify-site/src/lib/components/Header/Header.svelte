<script lang="ts">
  import {links} from '$lib/structure/header/links';
  import {page} from '$app/stores';
</script>

<header>
  <div class="header-container content">
    <a class="site-name" href="/" class:active={$page.url.pathname === '/'}>Mathlify</a>
    <nav>
      {#each links as link}
        <a class:active={$page.url.pathname.startsWith(link.url)} href={link.url}>{link.title}</a>
      {/each}
    </nav>
  </div>
</header>

<style>
  header {
    background: hsl(var(--splash));
    padding-block: 1rem;
    height: var(--header-height);
  }
  .header-container {
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 1rem;
  }
  nav {
    display: flex;
    gap: 1em;
    align-items: center;
    text-align: center;
  }
  .site-name {
    font-weight: 700;
    font-size: 1.25rem;
  }
  a {
    transition: color 0.3s;
  }
  .active, a:hover {
    font-weight: 700;
    color: hsl(var(--primary));
  }
</style>