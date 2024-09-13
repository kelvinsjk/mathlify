<script lang="ts">
	/**
	 * Mathlified Header version 0.0.1
	 * generated on 9/4/2024, 8:48:56 PM
	 */
	let { name } = $props();
	import MobileNav from './MobileNav.svelte';
	import {
		SignInButton,
		SignUpButton,
		SignedIn,
		SignedOut,
		UserButton
	} from 'svelte-clerk/components';
	import { page } from '$app/stores';
</script>

<header>
	<div class="site-name">
		<a href="/">{name}</a>
	</div>
	<div class="header-right">
		<SignedIn>
			<UserButton afterSignOutUrl="/" />
		</SignedIn>
		<SignedOut>
			<SignInButton mode="modal" forceRedirectUrl={$page.url.pathname} />
			<SignUpButton mode="modal" forceRedirectUrl={$page.url.pathname} />
			<!-- <a href="/auth/login">Sign in</a> <span>|</span> <a href="/auth/register">Sign up</a> -->
			<!-- You could also use <SignInButton mode="modal" /> and <SignUpButton mode="modal" /> here -->
		</SignedOut>
		<MobileNav />
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: var(--primary, hsl(240, 63%, 47%));
		/* color: var(--primary-content, white); */
		color: var(--secondary, white);
		height: var(--header-height, 3.5rem);
	}
	@media (min-width: 40rem) {
		header {
			padding-inline-start: var(--md-inline-padding-start, 1.5rem);
		}
	}
	a {
		text-decoration: none;
		font-size: 1.25rem;
		font-weight: 700;
		color: inherit;
	}
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	:global(.cl-avatarBox),
	:global(.cl-userButtonTrigger) {
		border-radius: 25%;
	}
</style>
