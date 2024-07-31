import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';

export const answer = new Answer();

// a
{
	// TODO: graphs
	const soln = mathlifyQED`Asymptotes: ${`y=2`}
and ${`x=3`}`;
	const ans = mathlify`Asymptotes: ${`y=2`}
and ${`x=3`}.`;
	answer.addPart(ans, soln);
}
