---
title: 'Insight on symmetrical property of function inverse'
description: 'Exploring the intersection between a function and its inverse'
author: Kelvin Soh
tags: Math
---

## Intersection between a function and its inverse

A past H2 Mathematics examination question
[2008 P2 Q4iii](https://math-repo.vercel.app/08p2q04#solutions-part-3) asked for
the exact solution to the equation $f(x)=f^{-1}(x).$ Getting an exact solution
required insight on the symmetrical property of the graph of $y=f(x)$ and
$y=f^{-1}(x)$ about the line $y=x.$

And for the longest time, that was a trick I often employed to solve questions
like this: to solve $f(x)=f^{-1}(x),$ we solve $f(x)=x$ instead.

## This trick may not work all the time

A question from EJC 2023 Prelims presented a situation where this trick will not
work. They used a more complicated function, but I could replicate similar
results with a function like $f(x)=-x^3.$ Turns there are three roots to the
equation $f(x)=f^{-1}(x)$ for this example, while the equation $f(x)=x$ has only
one root.

This led to me questioning myself if I have left out answers whenever I employed
the trick in the past. It's time to investigate this further using the
mathematician's favorite tool: proofs.

## Formulating the problem

We consider only numbers that are in the domains $D_f \cap D_{f^{-1}}.$ Let $A$
denote the set of numbers that satisfy the equation $f(x)=x$ and let $B$ denote
the set of numbers that satisfy the equation $f(x)=f^{-1}(x).$

We wish to understand the relationship between sets $A$ and $B.$ As we have seen
in the previous example of $f(x)=-x^3,$ the two sets need not be the same.

## The result

1. $A \subseteq B.$
2. If $f$ is strictly increasing, then $A=B.$

## The proof

### Proof of 1

Let $x \in A.$ Then we have $f(x)=x$. Since we restrict our universal set to
only numbers in $D_f \cap D_{f^{-1}},$ we can apply the inverse function on both
sides to get $f^{-1}f(x) = f^{-1}(x)$ which simplifies to $x = f^{-1}(x).$ Thus
we have $x=f(x)=f^{-1}(x)$ so $x \in B. \; \blacksquare$

### Proof of 2

While the first proof came intuitively to me, I was not able to figure out the
"strictly increasing" condition necessary for the two sets to be equal so I did
some googling. I found the result I was looking for, and its proof, in
[vaster](https://math.stackexchange.com/users/337710/vaster)'s answer to a
[question on Math StackExchange](https://math.stackexchange.com/q/1775206).

## Reflecting on the beauty of mathematical proofs

I look back fondly on my time in university. Learning about the various
mathematical results and/or proofs is often a joy, and especially when a proof
is especially "elegant" and enlightening. Erdős's reference to
["The Book"](https://en.wikipedia.org/wiki/Proofs_from_THE_BOOK) is a imagery I
often have after digesting a good proof.

It is unfortunate I do not encounter such insights as often as I have ventured
into my career teaching pre-university mathematics.

The proof is probably too trivial to enter "The Book", but I found it especially
enlightening nevertheless. It showcases why both components of the condition
(_strictly_ and _increasing_) are necessary to get our desired result.

The proof by contradiction is a very standard technique, but employing the
[law of trichotomy](https://en.wikipedia.org/wiki/Law_of_trichotomy) makes
everything click into place. The increasing condition is needed to preserve
order, while the strictly increasing condition is needed to arrive at our
contradiction.
