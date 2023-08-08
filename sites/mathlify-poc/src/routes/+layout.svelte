<script>
	import { browser } from '$app/environment';
	import '../app.postcss';
	import '../katex.min.css';
</script>

{#if browser}
	<script
		src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/copy-tex.min.js"
		integrity="sha384-ww/583aHhxWkz5DEVn6OKtNiIaLi2iBRNZXfJRiY1Ai7tnJ9UXpEsyvOITVpTl4A"
		crossorigin="anonymous"
	></script>
{/if}
<a href="/" class="link">Home</a>
<slot />
