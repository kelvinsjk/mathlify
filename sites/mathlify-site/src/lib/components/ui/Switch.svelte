<script lang="ts">
	let { checked = $bindable() }: { checked: boolean } = $props();
	// modified from daisyui and tailwindcss
</script>

<input type="checkbox" class="switch" bind:checked />

<style>
	input {
		/* --tglbg: theme(colors.base-100);
		@apply text-base-content/50 rounded-badge h-6 w-12 cursor-pointer appearance-none border border-current bg-current; */
		--tglbg: white;
		--togglehandleborder: 0 0;
		--handleoffset: 1.5rem;
		--handleoffsetcalculator: calc(var(--handleoffset) * -1);
		cursor: pointer;
		appearance: none;
		height: 1.5rem;
		width: 3rem;
		border-radius: 1.9rem;
		border: 1px solid black;
		background-color: hsla(0, 0%, 0%, 0.5);

		transition:
			background,
			box-shadow var(--animation-input, 0.2s) ease-out;
		box-shadow:
			var(--handleoffsetcalculator) 0 0 2px var(--tglbg) inset,
			0 0 0 2px var(--tglbg) inset,
			var(--togglehandleborder);
		/* [dir='rtl'] & {
			--handleoffsetcalculator: calc(var(--handleoffset) * 1);
		} */
		/* &:focus-visible {
			@apply outline-base-content/20 outline outline-2 outline-offset-2;
		}
		&:hover {
			@apply bg-current;
		} */
		/* &[aria-checked='true'] {
			 
		 } */
		&:checked {
			background-image: none;
			background-color: var(--primary);
			border-color: var(--primary);
			--handleoffsetcalculator: var(--handleoffset);
			/* @apply text-base-content;
			[dir='rtl'] & {
				--handleoffsetcalculator: calc(var(--handleoffset) * -1);
			} */
		}
		&:indeterminate {
			/* @apply text-base-content; */
			box-shadow:
				calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
				calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
				0 0 0 2px var(--tglbg) inset;
			/* [dir='rtl'] & {
				box-shadow:
					calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
					calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
					0 0 0 2px var(--tglbg) inset;
			} */
		}
		/* &-primary {
			&:focus-visible {
				@apply outline-primary;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-primary bg-primary text-primary-content border-opacity-10;
			}
		}
		&-secondary {
			&:focus-visible {
				@apply outline-secondary;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-secondary bg-secondary text-secondary-content border-opacity-10;
			}
		}
		&-accent {
			&:focus-visible {
				@apply outline-accent;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-accent bg-accent text-accent-content border-opacity-10;
			}
		}
		&-success {
			&:focus-visible {
				@apply outline-success;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-success bg-success text-success-content border-opacity-10;
			}
		}
		&-warning {
			&:focus-visible {
				@apply outline-warning;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-warning bg-warning text-warning-content border-opacity-10;
			}
		}
		&-info {
			&:focus-visible {
				@apply outline-info;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-info bg-info text-info-content border-opacity-10;
			}
		}
		&-error {
			&:focus-visible {
				@apply outline-error;
			}
			&:checked,
			&[aria-checked='true'] {
				@apply border-error bg-error text-error-content border-opacity-10;
			}
		} */
		/* &:disabled {
			@apply border-base-content cursor-not-allowed bg-transparent opacity-30;
			--togglehandleborder: 0 0 0 3px theme(colors.base-content) inset,
				var(--handleoffsetcalculator) 0 0 3px theme(colors.base-content) inset;
		} */
	}
</style>
