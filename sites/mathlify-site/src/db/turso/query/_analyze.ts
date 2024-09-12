import { turso } from '../../';
import {
	tysQuestionsToTechniques
	//techniques
} from '../qns-techniques';

import pl from 'nodejs-polars';

const result = await turso.select().from(tysQuestionsToTechniques);

let df = pl.DataFrame(result);
df = df.groupBy('technique').agg(pl.col('question').count().alias('count')).sort('technique');
console.dir(df.toObject());
