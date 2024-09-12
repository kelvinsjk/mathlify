import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error: err } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				message: 'Server error. Try again later.'
			});
		}

		redirect(303, '/');
	}
};
