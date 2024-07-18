import { mathlify } from './';

const str = mathlify`This is inline math: ${'x+2'}xyz${'k'}
and this is text.

This is display math: $${'x+2'}xyz
abcd
${'k'}

This is aligned:
$${'align'}
  x+2 &= ${'k'} \\\\
  y &= ${'z'}`;

console.log(str);
