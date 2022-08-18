<script>
	import '../app.css';
	import Nav from '$lib/nav/Nav.svelte';
	import BottomNav from '$lib/nav/BottomNav.svelte';
	import {darkMode} from '$lib/nav/stores';
</script>

<div class="body" class:dark={$darkMode}>
	<!--Prevent flash of color-->
  <script>
		if (typeof initialized === 'undefined'){
			const darkInitial = localStorage.getItem('darkMode');
			if (typeof document !== 'undefined') {
				if (darkInitial==='true') {
					document.querySelector('.body').classList.add('dark')
				} else {
					document.querySelector('.body').classList.remove('dark')
				}
				initialized = true;
			}
		}
  </script>
	<!--Prevent flash of color-->
	<Nav/>
	<div class="bg-goldenrod-light dark:bg-zinc-700">
		<slot />
	</div>
	<BottomNav/>
</div>

<style>
	.bg-goldenrod-light {
		min-height: calc(100vh - 8rem);
	}
	@media (min-width: 640px){
		.bg-goldenrod-light {
			min-height: calc(100vh - 4rem);
		}
	}
</style>