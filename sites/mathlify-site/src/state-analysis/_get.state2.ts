import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';

const SUPABASE_URL = 'https://ihbokvprtegrllxqwadp.supabase.co';
const SUPABASE_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYm9rdnBydGVncmxseHF3YWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzNTc4OTYsImV4cCI6MjAzNjkzMzg5Nn0.lZvWbuSZdP6fjXYi2Q5ojrmlB3zZOYuUQtrXeMS-Sdg';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY!);

//const section = '01-existence';
//! 50 rows hit for 01
const section = '02-domain';
//const section = '03-formula';
//const section = '04-restriction';
//const section = '05-relationship';
const practice = `h2/fns/02-inverse/${section}`;

const { error, data } = await supabase
	.from('practice_validity')
	.select('state,is_valid,should_investigate')
	.eq('practice', practice);
if (error) throw error;

console.log(data.length, ' rows received for ', practice);
writeFileSync(`./${section}.state.json`, JSON.stringify(data));
console.log('Data written to disk');

export {};
