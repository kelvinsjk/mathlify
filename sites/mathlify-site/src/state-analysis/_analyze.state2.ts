import pl from 'nodejs-polars';
import { readFileSync, writeFileSync } from 'node:fs';

const section = '01-existence';
//const section = '02-domain';
//const section = '03-formula';
//const section = '04-restriction';
//const section = '05-relationship';

const data = JSON.parse(readFileSync(`./${section}.state.json`, 'utf8')).map((row, id) => {
	return {
		id,
		...row,
		...row.state,
		//isInequality: row.state.isInequality,
		//type: row.state.type,
		state: JSON.stringify(row.state),
		restriction: row.state.restriction !== false,
	};
});

//console.log(data);
const df = pl.readRecords(data);
console.log(df.head());
//console.log(df.describe());

// ! duplication
const isDuplicated = df.getColumn('state').isDuplicated();
console.log(df.getColumn('state').filter(isDuplicated));
console.log(df.getColumn('state').filter(isDuplicated).getIndex(0));

// ! unknown constants (for 02-functions)
//console.log(df.filter(pl.col('unknownConstants').eq(true)));

// ! groupby (for 01-interval)
//console.log(df.groupBy('isInequality').agg(pl.col('isInequality').count().alias('count')));
//console.log(df.groupBy('type').agg(pl.col('type').count().alias('count')));
// ! groupby (for 02-functions)
console.log(df.groupBy('fnType').agg(pl.col('fnType').count().alias('count')));
console.log(df.groupBy('unknownConstants').agg(pl.col('unknownConstants').count().alias('count')));
console.log(df.groupBy('restriction').agg(pl.col('restriction').count().alias('count')));

//
//writeFileSync(
//'./data.state.html',
//	df.filter(pl.col('unknownConstants').eq(true)).sort(pl.col('fnType')).toHTML(),
//);
export {};
