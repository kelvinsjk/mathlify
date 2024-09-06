import pl from 'nodejs-polars';
import { readFileSync, writeFileSync } from 'node:fs';

// ! 24/7/30:
// 50 entries for both sections
// for section:
// 26 vs 24 distribution of isInequality
// l vs r vs two vs neq vs union: 14 vs 9 vs 11 vs 9 vs 7
// for 2nd section:
// unknownConstants: 7 vs 43
// restriction: 11 vs 39
// fnTypes: 4 to 8

//const section = '01-interval';
const section = '02-functions';

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
//const isDuplicated = df.getColumn('state').isDuplicated();
//console.log(df.getColumn('state').filter(isDuplicated));
//console.log(df.getColumn('state').filter(isDuplicated).getIndex(0));

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
