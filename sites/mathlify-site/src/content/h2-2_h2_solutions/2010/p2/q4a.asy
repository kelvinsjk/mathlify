settings.outformat = "svg";
defaultpen(fontsize(12pt));

// axes
draw((-100,0) -- (100,0), Arrow );
draw((0,-80) -- (0,100) , Arrow );
label("$x$", (100,0), S);
label("$y$", (0,100), W);
// curve
draw((-100,2){right} .. {up}(-32,100));
draw((-28,-80){up} .. {right}(0,-10){right} .. {down}(28,-80));
draw((32,100){down} .. {right}(100,2));
draw((30,-80)--(30,100), dashed);
draw((-30,-80)--(-30,100), dashed);
// labels
label("$0$", (0,0), SW);
label("$x=1$", (30,-80), NE);
label("$x=-1$", (-30,-80), NW);
label("$y=0$", (-100,0), SE);
label("$y=f(x)$", (70,50));
// intercepts
dot((0,-10));
label("$(0,-1)$", (0,-10), SW);
// padding
draw((-105,-85), invisible);
draw((105,105), invisible);