<script lang="ts">
	export let title = '';
	export let plural = false;

	title = title ? `:${title}` : '';
	const s = plural ? 's' : '';

	export let content: string;
</script>

<div class="collapse collapse-arrow border border-base-300 bg-base-200 my-4">
	<input type="checkbox" />
	<h3 class="collapse-title my-0">Example{s}{title}</h3>
	<div class="collapse-content bg-base-100">
		<div class="example-content pt-4">
			{@html content}
		</div>
	</div>
</div>
