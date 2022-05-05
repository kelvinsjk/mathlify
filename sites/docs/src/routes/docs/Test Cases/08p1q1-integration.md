---
title: 2008 P1 Q1
---

<script>
  import {p1q1} from './_08';
  let [ans1, qn, ans2] = p1q1();
  import { Button } from '@svelteness/kit-docs';
</script>

# {$frontmatter.title}

## Actual TYS Answer

{@html ans1}

## Randomly variant

### Question

{@html qn}

### Answer

{@html ans2}
