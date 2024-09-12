settings.outformat = "svg";
defaultpen(fontsize(12pt));

// axes
draw((-50,0) -- (100,0), Arrow );
draw((0,-20) -- (0,100) , Arrow );
label("$x$", (100,0), S);
label("$y$", (0,100), W);
// curve
draw((-50,-4.9){right} .. (-4.8,-4.8) .. (0,-4.7) .. (30,0) .. (54.8, 54.8) .. (60.4,100));
draw((-50,-6)--(100,-6), dashed);
draw((-6,-20)--(-6,100), dashed);
draw((-4.9,-20){up} .. (-4.8,-4.8) .. (-4.7,0) .. (0,30) .. (54.8,54.8) .. (100,60.4));
draw((-20,-20)--(100,100),dashed);
// labels
label("$y=f^{-1}(x)$", (75,15));
label("$y=f(x)$", (5,75), E);
label("$y=x$", (85,75), S);
label("$y=-\frac{1}{2}$", (100,-6), SW);
label("$x=-\frac{1}{2}$", (-6,100), SW);
// intercepts
draw((30,5)--(30,-5));
label("$(3,0)$", (30,5), N);
draw((5,30)--(-5,30));
label("$(0,3)$", (-5,30), W);
dot((0,-4.7));
label("$\left(\frac{\mathrm{e}^{-3}-1}{2}, 0 \right)$", (-2,0), NW);
label("$\left(0,\frac{\mathrm{e}^{-3}-1}{2} \right)$", (0,-2), SE);
dot((-4.7,0));
// padding
draw((-25,-25), invisible);
draw((105,105), invisible);