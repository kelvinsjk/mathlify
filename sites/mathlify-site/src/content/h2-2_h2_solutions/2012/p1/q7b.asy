settings.outformat = "svg";
defaultpen(fontsize(12pt));

// axes
draw((-100,0) -- (100,0), Arrow );
draw((0,-100) -- (0,100) , Arrow );
label("$x$", (100,0), S);
label("$y$", (0,100), W);
// curve
draw((-100,8){right} .. (-50,0) .. (0,-50) .. {down}(8,-100));
draw((12,100){down} .. {right}(100,12)  );
draw((10,-100)--(10,100), dashed);
draw((-100,10)--(100,10), dashed);
// labels
label("$0$", (0,0), SW);
label("$x=1$", (10,-100), NE);
label("$y=1$", (-100,10), NE);
label("$y=g(x)$", (60,50));
// intercepts
draw((-5,-50)--(5,-50));
label("$(0,-k)$", (-5,-50), W);
draw((-50,-5) -- (-50,5));
label("$(-k,0)$", (-50,-5), S);
// padding
draw((-105,-105), invisible);
draw((105,-105), invisible);