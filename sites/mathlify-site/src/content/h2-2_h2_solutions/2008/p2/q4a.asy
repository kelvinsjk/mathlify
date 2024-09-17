settings.outformat = "svg";
defaultpen(fontsize(12pt));

// axes
draw((-20,0) -- (100,0), Arrow );
draw((0,-20) -- (0,100) , Arrow );
label("$x$", (100,0), S);
label("$y$", (0,100), W);
// curve
draw((40,10){right} .. (50,20) .. (60, 50) .. (70,100));
filldraw(circle((40,10),1.5), white, black);
label("$(4,1)$", (40,10), W);
// labels
label("$0$", (0,0), SW);
label("$y=f(x)$", (80,25));
// padding
draw((-25,-25), invisible);
draw((105,105), invisible);