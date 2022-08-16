<script lang="ts">
	import DarkModeToggle from "./DarkModeToggle.svelte";
</script>

<nav class="navbar bg-midnightblue dark:bg-midnightblue-dark text-white font-bold justify-center p-4">
	<div class="w-full max-w-prose text-lg flex justify-between">
		<a class="text-lg link-hover" sveltekit:prefetch href="/">
			Math Pro
		</a>
		<div class="flex gap-4">
			<DarkModeToggle />
			<a class="link-hover text-base hidden sm:block" sveltekit:prefetch href="/about">
				about
			</a>
			<a class="link-hover text-base" sveltekit:prefetch href="/topical">
				<span class="sm:hidden">qns</span>
				<span class="hidden sm:inline">questions</span>
			</a>
			<a class="link-hover text-base" sveltekit:prefetch href="/profile">
				progress
			</a>
		</div>
	</div>
</nav>