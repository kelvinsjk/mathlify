// src/+layout.server.ts
import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';

// To enable Clerk SSR support, pass the `initialState` to the `ClerkProvider` component.
export const load: LayoutServerLoad = ({ locals }) => {
	console.log('locals', locals);
	return {
		...buildClerkProps(locals.auth)
	};
};
