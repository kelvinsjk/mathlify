import { math, display } from 'mathlifier';
import { zTest } from './normal';

/**
 * @returns [working, pValue]
 */
export function zTestWorking(
	mu: number,
	h1: '>' | '<' | '\\neq',
	xBar: number,
	sigma2: number,
	n: number,
	alpha: number,
	context: string,
	options?: { s2Mode?: boolean; cltMode?: boolean; alphaMode?: boolean },
): [string, number, string] {
	const { s2Mode, cltMode, alphaMode } = {
		s2Mode: false,
		cltMode: false,
		alphaMode: false,
		...options,
	};
	const sigma = s2Mode ? 's' : '\\sigma';
	const clt = cltMode ? `approximately by CLT since ${math(`n=${n}`)} is large` : '';
	const tail = h1 === '>' ? 'right' : h1 === '<' ? 'left' : 'two';
	const p = zTest(mu, Math.sqrt(sigma2), xBar, n, tail);
	let working = `${math(`\\textrm{H}_0: \\mu = ${mu}`)}
		<br>${math(`\\textrm{H}_1: \\mu ${h1} ${mu}`)}
		<div style="margin-top:1em">
			Under ${math(`\\textrm{H}_0, `)} test statistic
			${display(`Z= \\frac{\\overline{X} - \\mu}{\\frac{${sigma}}{\\sqrt{n}}} \\sim N(0,1)`)}
			${clt}
		</div>
		<div style="margin-top:1em">
			${math(`p\\textrm{-value} = ${p.toPrecision(5)}`)}
		</div>
	`;
	if (alphaMode) {
		return [working, p, ''];
	}
	let conclusion: string;
	if (p < alpha / 100) {
		working += `Since ${math(`p < ${alpha / 100}, `)} we reject ${math(`\\textrm{H}_0`)}`;
		conclusion = `There is sufficient evidence at the ${math(
			`${alpha}\\%`,
		)} level of significance to conclude that
				${context}`;
	} else {
		working += `Since ${math(`p\\textrm{-value} > ${alpha / 100}, `)} we do not reject ${math(
			`\\textrm{H}_0`,
		)}`;
		conclusion = `There is insufficient evidence at the ${math(
			`${alpha}\\%`,
		)} level of significance to conclude whether
			${context}`;
	}
	working += `<div style="margin-top:1em">${conclusion} ${math('\\blacksquare')}</div>`;
	return [working, p, conclusion];
}

export function noAssumptions(n: number, X = 'X', distribution = ''): string {
	return `Since ${math(`n=${n}`)} is large, by the Central Limit Theorem, the sample mean 
    ${math(
			`\\overline{${X}}`,
		)} is normally distributed approximately. Hence no assumptions are needed about
    the population ${distribution} in order for the test to be valid.`;
}
