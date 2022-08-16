<script lang="ts">
	import DarkModeToggle from "./DarkModeToggle.svelte";
</script>

<div class="navbar bg-midnightblue dark:bg-midnightblue-dark text-white font-bold justify-center p-4">
	<DarkModeToggle />
	<div class="w-full max-w-prose text-lg flex justify-around">
		<a class="link-hover text-base" sveltekit:prefetch href="/about">
			about
		</a>
		<a class="link-hover text-base" sveltekit:prefetch href="/topical">
			questions
		</a>
		<a class="link-hover text-base" sveltekit:prefetch href="/profile">
			progress
		</a>
	</div>
</div>