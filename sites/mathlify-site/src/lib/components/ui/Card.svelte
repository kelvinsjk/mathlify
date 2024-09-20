<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		children,
		title,
		end
	}: {
		title?: Snippet;
		children: Snippet;
		end?: Snippet;
	} = $props();
</script>

<div class="card">
	<div class="card-body">
		{#if title}
			<div class="card-title">
				{@render title()}
			</div>
		{/if}
		{@render children()}
	</div>
	{#if end}
		<div class="card-end">
			{@render end()}
		</div>
	{/if}
</div>

<style>
	.card {
		/* @apply rounded-box; */
		:global(:where(figure:first-child)) {
			/* @apply overflow-hidden; */
			border-start-start-radius: inherit;
			border-start-end-radius: inherit;
			border-end-start-radius: unset;
			border-end-end-radius: unset;
		}
		:global(:where(figure:last-child)) {
			/* @apply overflow-hidden; */
			border-start-start-radius: unset;
			border-start-end-radius: unset;
			border-end-start-radius: inherit;
			border-end-end-radius: inherit;
		}
		&:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: 2px;
		}
		border: 1px solid var(--content, black);
		border-radius: 0.25rem;
		box-shadow: black;
		/* width: 20rem; */
		background-color: hsla(var(--secondary-hsl, 50, 100%, 50%), 0.25);
		display: grid;
		grid-template-rows: 1fr auto;
		grid-template-rows: auto 1fr;
		/* &.bordered {
    @apply border-base-200 border;
  }
  &-bordered {
    @apply border-base-200 border;
  }
  &.compact {
    .card-body {
      @apply p-4 text-sm;
    }
  } */
		/* &.image-full {
    &:before {
      @apply bg-neutral rounded-box z-10 opacity-75;
    }
  }
  &.image-full > &-body {
    @apply text-neutral-content z-20;
  }
  &.image-full {
    :where(figure) {
      @apply overflow-hidden;
      border-radius: inherit;
    }
  } */
	}
	.card-body {
		padding: var(--padding-card, 2rem);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		/* @apply flex flex-col gap-2; */
	}
	.card-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		/* @apply flex items-center gap-2 text-xl font-semibold; */
	}
</style>
