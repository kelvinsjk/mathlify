settings.outformat = "svg";
defaultpen(fontsize(6pt));

// axes
draw((-30,0) -- (45,0), Arrow );
draw((0,-10) -- (0,40) , Arrow );
label("$x$", (45,0), S);
label("$y$", (0,40), W);
// curve
draw((-30,1){right} .. {(2,3)}(0,10) .. {right}(45,29));
draw((-30,30)--(45,30), dashed);
// labels
label("$y=0$", (-32,0), SE);
label("$y=3$", (47,30), NW);
label("$y=\frac{3}{2\mathrm{e}^{-x}+1}$", (27,15));
// padding
draw((-35,-15), invisible);
draw((50,45), invisible);