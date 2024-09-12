settings.outformat = "svg";
defaultpen(fontsize(12pt));

draw((-15,0) -- (100,0), Arrow );
draw((0,-100) -- (0,15) , Arrow );
draw((12,-100){up} .. {right}(90,-2)  );
draw((10,-100)--(10,15), dashed);
label("$x$", (100,0), S);
label("$y$", (0,15), W);
label("$0$", (0,0), SW);
label("$y=0$", (90,0), NW);
label("$x=1$", (10,-100), NW);
label("$y=f(x)$", (70,-25));
draw((-15,-50)--(100,-50));
label("$y=k$", (90,-50), SW);
draw((105,0), invisible);
draw((-20,0), invisible);
draw((0,-105), invisible);