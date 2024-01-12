<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="navbar bg-base-100 border-b-4 border-b-accent">
  <div class="flex-1">
    <a 
      href="/"
      class="btn btn-ghost text-xl"
      aria-current={$page.url.pathname === '/' ? 'page' : undefined}
    >
      kelvinsoh
    </a>
    <div class="px-4">&gt;</div>
    <a 
      href="/blog"
      class="btn btn-ghost text-xl" 
      aria-current={$page.url.pathname.startsWith('/blog') ? 'page' : undefined}
    >
      blog
    </a>
  </div>
</nav>

<style>
  a[aria-current="page"] {
    color: oklch(var(--p));
  }
</style>