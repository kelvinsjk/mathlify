import { mathlifierDj as mathlifier } from 'mathlifier';

// q3
export const q3 = {
	parts: [
		{
			parts: [
				{
					body: mathlifier`All horizontal lines ${{}}{y=k, k \\in \\mathbb{R},}
cuts the graph of ${{}}{y=f(x)}
at most once. Hence ${'f'}
is  one-to-one and has an inverse.`
				},
				{
					body: mathlifier`${{}} f^{-1}(x) = \\sqrt{\\frac{x - 1}{x}}.
\\
${{}} D_{f^{-1}} = R_{f} = \\left( -\\infty, 0 \\right).`
				}
			]
		},
		{
			body: mathlifier`${{}} \\left( -\\infty, \\frac{2 - \\sqrt{3}}{2} \\right] \\allowbreak \\cup \\left[ \\frac{2 + \\sqrt{3}}{2}, \\infty \\right).`
		}
	]
};

// q5
export const q5 = {
	parts: [
		{
			body: mathlifier`Translate the curve by ${{}} 3
	units in the positive ${{}} x\\text{-axis}
	direction.\\
	Scale the resulting curve by scale factor ${{}} \\frac{1}{4}
	parallel to the ${{}} y\\text{-axis}.`
		},
		{
			body: mathlifier`Sketch`
		},
		{
			body: mathlifier`Sketch`
		}
	]
};
