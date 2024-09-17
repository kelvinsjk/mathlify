import type { Handle } from '@sveltejs/kit';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
import { CLERK_SECRET_KEY } from '$env/static/private';

import { withClerkHandler } from 'svelte-clerk/server';
export const handle: Handle = withClerkHandler({
	//debug: true,
	afterSignInUrl: '/',
	afterSignUpUrl: '/',
	publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
	secretKey: CLERK_SECRET_KEY
});
