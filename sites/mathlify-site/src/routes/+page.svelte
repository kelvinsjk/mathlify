<script lang="ts">
	import { sections } from '$lib/structure/learn/h2/fns/sections';
</script>

<div class="content prose">
	<ul>
		{#each sections as section}
			<li>{section.title}</li>
			<ul>
				{#each section.subsections as subsection}
					<li>
						<a href={`/learn/h2/fns/${section.slug}/${subsection.slug}`}>{subsection.title}</a>
					</li>
				{/each}
			</ul>
		{/each}
	</ul>
</div>
