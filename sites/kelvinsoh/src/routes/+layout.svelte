<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.pcss';
	import '$lib/temml-css/Temml-Latin-Modern.css';
</script>

<Navbar />
<main class="mx-6 my-4">
	<slot />
</main>
