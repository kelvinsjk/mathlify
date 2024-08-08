import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const GET: RequestHandler = async ({ url }) => {
	const file = url.searchParams.get('file');
	if (!file) return json({ code: 400 });
	const { data, error, status } = await supabase.from('content').select('*').eq('slug', file);
	if (error) {
		console.log(error);
		return json({ code: status });
	}
	return json(data);
};
