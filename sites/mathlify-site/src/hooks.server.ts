import type { Handle } from '@sveltejs/kit';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { withClerkHandler } from 'svelte-clerk/server';
export const handle: Handle = withClerkHandler({
	debug: true,
	afterSignInUrl: '/',
	afterSignUpUrl: '/',
	publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
});
