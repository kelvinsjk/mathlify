# Special composite functions

## Self composition

Just like we can compose two functions $`f` and $`g` to get $`fg,` we can also
compose a function with itself. This function is denoted by $`f^2 = ff` and is
not to be confused with squaring the original function.

For example, if
$`{f(x) = 2x + 3,}` then
$`f^2(x) = ff(x) = {f(2x+3)} = {2(2x+3) + 3} = {4x + 9},`
which is not the same as $`{\big(f(x)\big)^2 = (2x+3)^2.}`

In a similar fashion to the existence of $`fg,` we also have that the composite
function $`f^2` exists if $`R_f \subseteq D_f.`

### A note about notation

We have just seen that
$`f^2(x)` stands for $`ff(x)` and is different from the
square of $`f` which we denote $`\big(f(x)\big)^2.` In a similar fashion, we
note that the previous section on inverse functions use the notation
$`f^{-1}(x)`
to denote the "reverse" and is not to be confused with the reciprocal
$`{\big(f(x)\big)^{-1} = \frac{1}{f(x)}.}`

## Composing with inverses

We can also compose a function with its inverse to get composite functions
$`ff^{-1}` and $`f^{-1}f.`

We can try to find the formula for $`f^{-1}(x)` and perform composition, but
turns out we can get the result in a simpler manner by consideration the meaning
of this composition.

$`f^{-1}` is the function that reverses $`f,` so $`f^{-1}f`
will take a number, apply $`f` to it and then try to reverse the process. We
then end up with the original number. A similar argument can be made for
$`ff^{-1},`
leading us to the following results.

- {=$`ff^{-1}(x) = x`=}
- {=$`f^{-1}f(x) = x`=}

### Differences between the two functions

So is $`ff^{-1}(x)` and $`f^{-1}f(x)` the exact same function? Turns out that is
not true because of domain considerations. Recall that $`{D_{fg} = D_g}` so we
have

- {=$`D_{f^{-1}f} = D_f`=}
- {=$`D_{ff^{-1}} = D_{f^{-1}}`=}

```=comment
Add a picture for these graphs
```
