import type { HandleClientError } from '@sveltejs/kit';
// To use Clerk components:
import { initializeClerkClient } from 'clerk-sveltekit/client';
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
	afterSignInUrl: '/',
	afterSignUpUrl: '/',
	signInUrl: '/auth/login',
	signUpUrl: '/auth/register'
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};
