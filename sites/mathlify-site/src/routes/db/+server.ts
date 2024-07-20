import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL, PW } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const { practice, state, pw, validity } = await request.json();
	if (pw !== PW) {
		return json({ code: 401 });
	}
	if (
		typeof practice !== 'string' ||
		!(validity === true || validity === false || validity === 'investigate')
	) {
		return json({ code: 400 });
	}
	const row =
		validity === 'investigate'
			? { practice, state, should_investigate: true }
			: { practice, state, is_valid: validity };
	const { error, status } = await supabase.from('practice_validity').insert([row]);
	if (error) {
		console.log(error);
		return json({ code: 500 });
	} else {
		return json({ code: status });
	}
};
