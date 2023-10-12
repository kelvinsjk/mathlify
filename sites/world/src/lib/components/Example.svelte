<script lang="ts">
	export let title = '';
	title = title ? `:${title}` : '';

	export let content: string;
</script>

<div class="collapse collapse-arrow border border-base-300 bg-base-200">
	<input type="checkbox" />
	<h3 class="collapse-title my-0">Example{title}</h3>
	<div class="collapse-content bg-base-100">
		<div class="example-content pt-4">
			{@html content}
		</div>
	</div>
</div>
