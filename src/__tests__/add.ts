import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { add } from '../index';

test('add', () => {
	assert.is(add(1, 2), 3);
});

test.run();