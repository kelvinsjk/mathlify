<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Fraction,
		Expression,
		Polynomial,
		xPolynomial,
		SquareRoot,
		ExpressionWorking,
		Term,
		castToPoly,
		EquationWorking,
		BinomialGeneralTerm,
		nCr,
	} from 'mathlify';
	import { alignStar, display, gatherStar, math, newParagraph, newline } from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 4: Binomial Theorem';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const ascending = { ascending: true };

	//! Question 1: 2020 P2 Q3
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const expansion = new BinomialGeneralTerm(3, -2, 1, 1, 8);
		let power: Polynomial;
		// part a
		(() => {
			const body = `By considering the general term in the binomial expansion of
				${math(`\\displaystyle ${expansion},`)}
				explain why every term is dependent on ${math(`x.`)}
			`;
			power = expansion.power();
			let sol = `${alignStar(`&\\textrm{General Term}
					\\\\ &= ${expansion.generalTerm()}
				`)}
				The power ${math(`${power}`)} is never zero because
				${math(`16`)} is not a multiple of ${math(`3.`)}
				${newline}
				Hence every term is dependent on ${math(`x. \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const term2Coeff = -2;
			const term2 = new Polynomial([5, term2Coeff], ascending);
			const body = `Find the term independent of ${math(`x`)}
				in the expansion of
				${display(`${expansion}\\left(${term2}\\right).`)}
			`;
			let sol = `In part (i), we have showed that
				there is no term independent of ${math(`x`)} in the expansion of
				${math(`\\displaystyle ${expansion}.`)}
				${newParagraph}
				For term in ${math(`x^{-1}`)} in ${math(`${expansion},`)}
			`;
			const working = new EquationWorking(power, -1);
			const r = working.solveLinear();
			const coeff = expansion.coefficientFraction(r);
			sol += `${gatherStar(`${working}`)}
				Hence the coefficient of ${math(`x^{-1}`)} in the expansion of
				${math(`${expansion}`)} is
				${alignStar(`${expansion.coefficient()}
					&= {8 \\choose ${r}} 3^{8-${r}}
					\\\\ &= ${coeff}
				`)}
			`;
			const ans = coeff.times(term2Coeff);
			sol += `${alignStar(`& ${expansion} \\left(${term2}\\right)
				\\\\ &= \\left( ${coeff}x^{-1} + \\ldots \\right)^8 \\left(${term2}\\right)
				\\\\ &= ${coeff}x^{-1}\\left(${term2Coeff}x\\right) + \\ldots
				\\\\ &= ${ans}
			`)}
				Hence the term independent of ${math(`x`)} is ${math(`${ans} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2019 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Expression(
			2,
			new Term(-1, 'x').divide(8, { fractionalDisplayMode: 'always' }),
		);
		const binom = new ExpansionTerm([poly, 6]);
		// part a
		let ans: Expression;
		(() => {
			const body = `Write down and simplify the first three terms in the expansion,
				in ascending powers of ${math(`x,`)} of
				${math(`\\displaystyle ${binom}.`)}
			`;
			ans = binom.expand().slice(3);
			let sol = `${alignStar(`& ${binom}
				\\\\ &= ${binomExpansionWorking(binom, 3)}
				\\\\ &= ${ans} + \\ldots \\; \\blacksquare
			`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const firstTerm = new xPolynomial([4, 'k', 1], { ascending: true });
			const body = `In the expansion of 
				${display(`\\left( ${firstTerm} \\right) ${binom},`)}
				the sum of the coefficients of ${math(`x`)}
				and ${math(`x^2`)} is zero. Find the value of the constant
				${math(`k.`)}
			`;
			const expansion = firstTerm.times(castToPoly(ans));
			const [_, b, c] = expansion.coeffs;
			const expansion2 = expansion.slice(3);
			let sol = alignStar(`& \\left( ${firstTerm} \\right) ${binom}
				\\\\ &= \\left( ${firstTerm} \\right) \\left( ${ans} +\\ldots \\right)
				\\\\ &= ${ans.times(4)} + 64kx - 24kx^2 + 64x^2 + \\ldots
				\\\\ &= ${expansion2} + \\ldots
			`);
			const working = new EquationWorking(b.plus(c), 0);
			working.moveTerm(1);
			working.divide(40);
			sol += `Since the sum of the coefficients of ${math(`x`)} and ${math(`x^2`)} is zero,
				${gatherStar(`\\left(${b}\\right) + \\left(${c}\\right) = 0
					\\\\ ${working} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2018 P2 Q2
	(() => {
		const firstTerm = new xPolynomial([1, -4], ascending);
		const secondPoly = new xPolynomial([2, 'a'], ascending);
		const secondTerm = new ExpansionTerm([secondPoly, 6]);
		const a1 = 64,
			b1 = -160,
			c1 = 'b';
		const result = new xPolynomial([a1, b1, c1], ascending);
		const qn = `\\left(${firstTerm}\\right) ${secondTerm}`;
		const body = `The first three terms in the expansion of
			${math(`${qn}`)}
			in ascending powers of ${math(`x`)} are
			${math(`${result}.`)}
			Find the value of each of the constants
			${math(`a`)}
			and ${math(`b.`)}
		`;
		const secondExpansion = secondTerm.expand().slice(3) as xPolynomial;
		const ans = firstTerm.times(secondExpansion).slice(3);
		let sol = `${alignStar(`& ${qn}
			\\\\ &= \\left(${firstTerm}\\right) \\left(${binomExpansionWorking(
			secondTerm,
			3,
		)} + \\ldots \\right)
			\\\\ &= \\left(${firstTerm}\\right) \\left(${secondExpansion} + \\ldots \\right)
			\\\\ &= ${secondExpansion} -${4 * 64}x - ${4 * 192}ax^2 + \\ldots
			\\\\ &= ${ans} + \\ldots
		`)}`;
		const [_, b, c] = ans.coeffs;
		const aWorking = new EquationWorking(b, b1);
		const a = aWorking.solveLinear({ variable: 'a' });
		sol += `Comparing coefficients or ${math(`x,`)}
			${gatherStar(`${aWorking} \\; \\blacksquare`)}
		`;
		const bWorking = new ExpressionWorking(c, { equalStart: true });
		const aBrackets = `\\left( ${a} \\right)`;
		bWorking.subIn({ a }, { intertext: `= -768${aBrackets} + 240${aBrackets}^2` });
		sol += `Comparing coefficients or ${math(`x^2,`)} and substituting ${math(`a=${a}`)}
			${alignStar(`b ${bWorking} \\; \\blacksquare`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 4: 2017 P2 Q3
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const expansion = new BinomialGeneralTerm('p', 3, 1, -1, 9);
		let power: Polynomial;
		// part a
		(() => {
			const body = `By considering the general term in the binomial expansion of
				${math(`\\displaystyle ${expansion},`)}
				where ${math(`p`)} is a constant,
				explain why there are no even powers of ${math(`x`)}
				in this expansion.
			`;
			power = expansion.power();
			let sol = `${alignStar(`&\\textrm{General Term}
					\\\\ &= ${expansion.generalTerm()}
				`)}
				The power ${math(`${power}`)} is never even because
				${math(`27`)} is odd and ${math(`-4r`)} is always even
				so ${math(`27 - 4r`)} is always odd.
				${newline}
				Hence there are no even powers of ${math(`x. \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that the coefficient of ${math(`x^{11}`)}
				in the expansion of ${math(`${expansion}`)} is twice
				the coefficient of ${math(`x^7,`)} find
				the value of ${math(`p.`)}
			`;
			const working1 = new EquationWorking(power, 11);
			const r1 = working1.solveLinear();
			const working2 = new EquationWorking(power, 7);
			const r2 = working2.solveLinear();
			const lhs = nCr(9, r1.valueOf());
			const rhs = nCr(9, r2.valueOf()) * 2;
			const p = new Fraction(rhs, lhs);
			let sol = `For the ${math(`x^{11}`)} term,
				${gatherStar(`${working1}`)}
				For the ${math(`x^{7}`)} term,
				${gatherStar(`${working2}`)}
				Since coefficient of ${math(`x^{11}`)} is twice
				the coefficient of ${math(`x^7,`)}
				${alignStar(`{9 \\choose ${r1}} p^{9-${r1}} &= 2{9 \\choose ${r2}} p^{9-${r2}}
					\\\\ ${lhs} p^{5} &= ${rhs} p^{4}
					\\\\ p &= ${p} \\; \\blacksquare 
					`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2016 P2 Q2
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		let secondTerm: ExpansionTerm;
		let p1: Fraction, p2: Fraction;
		// part a
		(() => {
			const firstPoly = new xPolynomial([1, -2], ascending);
			const firstTerm = new ExpansionTerm([firstPoly, 2]);
			const secondPoly = new xPolynomial([1, new Term(-1, 'p')], ascending);
			secondTerm = new ExpansionTerm([secondPoly, 6]);
			const x2Coeff = 16;
			const qn = `${firstTerm} ${secondTerm}`;
			const body = `Given that the coefficient of ${math(`x^2`)}
			in the expansion of ${math(`${qn}`)} is ${math(`${x2Coeff},`)}
			find the two possible values of the constant ${math(`p.`)}
		`;
			const firstExpansion = firstTerm.expand() as xPolynomial;
			const secondExpansion = secondTerm.expand().slice(3) as xPolynomial;
			const ans = firstExpansion.times(secondExpansion).slice(3);
			let sol = `${alignStar(`& ${qn}
			\\\\ &= \\left(${firstExpansion}\\right) \\left(${binomExpansionWorking(
				secondTerm,
				3,
			)} + \\ldots \\right)
			\\\\ &= \\left(${firstExpansion}\\right) \\left(${secondExpansion} + \\ldots \\right)
			\\\\ &= ${secondExpansion} -${4}x + ${4 * 6}px^2 + ${4}x^2 + \\ldots
			\\\\ &= ${ans} + \\ldots
		`)}`;
			const c = ans.coeffs[2];
			const pWorking = new EquationWorking(c, x2Coeff, { aligned: true });
			pWorking.rhsZero();
			pWorking.divide(3);
			[p1, p2] = pWorking.factorizeQuadratic({ variable: 'p' });
			sol += `Comparing coefficients or ${math(`x^2,`)}
			${alignStar(`${pWorking}`)}
			${display(`p=${p1} \\; \\blacksquare \\; \\textrm{or} \\; p=${p2} \\; \\blacksquare`)}
		`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `For each value of ${math(`p,`)}
				find the coefficient of ${math(`x^3`)}
				in the expansion of
				${math(`${secondTerm}.`)}
			`;
			const ans = secondTerm.expand().slice(4) as xPolynomial;
			const coeff = ans.coeffs[3];
			let sol = alignStar(`& ${secondTerm}
				\\\\ &= ${binomExpansionWorking(secondTerm, 4)} + \\ldots
				\\\\ &= ${secondTerm.expand().slice(4)} + \\ldots
			`);
			sol += `When ${math(`p=${p1},`)}
				${alignStar(
					`& \\textrm{Coefficient of } x^3
					\\\\ &= -20\\left(${p1}\\right)^3
					\\\\ &= ${coeff.subIn({ p: p1 })} \\; \\blacksquare
				`,
				)}	
				When ${math(`p=${p2},`)}
				${alignStar(
					`& \\textrm{Coefficient of } x^3
					\\\\ &= -20\\left(${p2}\\right)^3
					\\\\ &= ${coeff.subIn({ p: p2 })} \\; \\blacksquare
				`,
				)}	
			`;

			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2015 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		(() => {
			// part a
			const poly1 = new Polynomial([1, 1], ascending);
			const replacement = new Polynomial([0, 1, -1], { ascending: true, variable: 'z' });
			const poly2 = replacement.plus(1);
			const binom1 = new ExpansionTerm([poly1, 9]);
			const binom2 = new ExpansionTerm([poly2, 9]);
			const subParts = [
				{
					body: `Write down, and simplify, the first ${math(`4`)}
						terms in the expansion of ${math(`${binom1}`)}
						in ascending powers of ${math(`x.`)}
					`,
				},
				{
					body: `Replacing ${math(`x`)} with ${math(`${replacement},`)}
						determine the coefficient of ${math(`z^3`)}
						in the expansion of ${math(`${binom2}.`)}
					`,
				},
			];
			const expansion1 = binom1.expand().slice(4) as Polynomial;
			const solPart1 = alignStar(`& ${binom1}
				\\\\ &= ${binomExpansionWorking(binom1, 4)} + \\ldots
				\\\\ &= ${expansion1} + \\ldots \\; \\blacksquare
			`);
			const z = `\\left(${replacement}\\right)`;
			let solPart2 = alignStar(`& ${binom2}
				\\\\ &= 1 + 9${z} + 36${z}^2 + 84${z}^3 + \\ldots
				\\\\ &= 1 + 9${z} + 36\\left(${replacement.pow(
				2,
			)}\\right) + 84\\left(z^3 + \\ldots \\right) + \\ldots
			`);
			solPart2 += alignStar(`&\\textrm{Coefficient of } z^3
				\\\\&= 36(-2) + 84
				\\\\&= ${36 * -2 + 84} \\; \\blacksquare
			`);
			const solSubParts = [{ body: solPart1 }, { body: solPart2 }];
			parts.push({ parts: subParts });
			solParts.push({ parts: solSubParts });
		})();
		(() => {
			// part b
			const binom = new BinomialGeneralTerm(2, 1, new Fraction(1, 3), -3, 10);
			const subParts = [
				{
					body: `Write down the general term in the binomial expansion of
						${math(`\\displaystyle ${binom}.`)}
					`,
				},
				{
					body: `Write down the power of ${math(`x`)} in this general term.
					`,
				},
				{
					body: `Hence, or otherwise, determine the coefficient of ${math(`x^2`)}
						in the binomial expansion of ${math(`\\displaystyle ${binom}.`)}
					`,
				},
			];
			const solPart1 = alignStar(
				`&\\textrm{General Term} \\\\ &=${binom.generalTerm()} \\; \\blacksquare`,
			);
			const power = binom.power();
			let solPart2 = math(`${power} \\; \\blacksquare`);
			const working = new EquationWorking(power, 2, { aligned: true });
			const r = working.solveLinear();
			const solPart3 = `For term in ${math(`x^2,`)}
				${alignStar(`${working}`)}
				${alignStar(`&\\textrm{Coefficient of } x^2
					\\\\ &= {10 \\choose ${r}} 2^{10-${r}} \\left( \\frac{1}{3} \\right)^{${r}}
					\\\\ &= ${binom.coefficientFraction(r)} \\; \\blacksquare
				`)}
			`;
			const solSubParts = [{ body: solPart1 }, { body: solPart2 }, { body: solPart3 }];
			parts.push({ parts: subParts });
			solParts.push({ parts: solSubParts });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2014 P1 Q1
	(() => {
		const poly1 = new xPolynomial([2, new Term(-1, 'k')], ascending);
		const poly2 = new xPolynomial([3, 1], ascending);
		const binom1 = new ExpansionTerm([poly1, 5]);
		const binom2 = new ExpansionTerm([poly2, 6]);
		const coeff = 860;
		const body = `Find the value of ${math(`k`)} for which the coefficient
			of ${math(`x^3`)} in the expansion of
			${math(`${binom1} + ${binom2}`)}
			is ${math(`${coeff}.`)}
		`;
		const expansion1 = binom1.expand().slice(4) as xPolynomial;
		const expansion2 = binom2.expand().slice(4) as xPolynomial;
		const coeff1 = expansion1.coeffs[3].plus(expansion2.coeffs[3]);
		const working = new EquationWorking(coeff1, coeff);
		working.moveTerm(1);
		working.divide(-40);
		const k3 = working.rhs.cast.toFraction();
		const k = k3.sign() * Math.pow(k3.abs().valueOf(), 1 / 3);
		let sol = `${alignStar(`& ${binom1}
				\\\\ &= ${binomExpansionWorking(binom1, 4)} + \\ldots
				\\\\ &= ${expansion1} + \\ldots
			`)}
			${alignStar(`& ${binom2}
				\\\\ &= ${binomExpansionWorking(binom2, 4)} + \\ldots
				\\\\ &= ${expansion2} + \\ldots
			`)}
			${gatherStar(`${working}
				\\\\ k = ${k} \\; \\blacksquare
			`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 8: 2013 P1 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly1 = new xPolynomial(['a', -1], ascending);
		const poly2 = new xPolynomial([2, 1], ascending);
		const binom1 = new ExpansionTerm([poly1, 5]);
		const binom2 = new ExpansionTerm([poly2, 6]);
		const coeff = 70;
		const body = `The coefficient of ${math(`x^3`)}
			in the expansion of ${math(`${binom1} + ${binom2}`)}
			is ${math(`${coeff}.`)}
		`;
		// part a
		let a: Fraction;
		let x2Coeff1: Expression, x2Coeff2: Expression;
		(() => {
			const body = `Find the value of the positive constant ${math(`a.`)}`;
			const expansion1 = binom1.expand().slice(4) as xPolynomial;
			const expansion2 = binom2.expand().slice(4) as xPolynomial;
			const coeff1 = expansion1.coeffs[3].plus(expansion2.coeffs[3]);
			const working = new EquationWorking(coeff1, coeff);
			working.moveTerm(1);
			working.divide(-10);
			const a2 = working.rhs.cast.toFraction();
			a = new SquareRoot(a2).cast.toFraction();
			x2Coeff1 = expansion1.coeffs[2];
			x2Coeff2 = expansion2.coeffs[2];
			let sol = `${alignStar(`& ${binom1}
				\\\\ &= ${binomExpansionWorking(binom1, 4)} + \\ldots
				\\\\ &= ${expansion1} + \\ldots
			`)}
			${alignStar(`& ${binom2}
				\\\\ &= ${binomExpansionWorking(binom2, 4)} + \\ldots
				\\\\ &= ${expansion2} + \\ldots
			`)}
			By considering the coefficient of ${math(`x^3,`)}
			${gatherStar(`${working}
				\\\\ \\textrm{Since } a \\textrm{ is positive,}
				\\\\ a = ${a} \\; \\blacksquare
			`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence calculate the coefficient of ${math(`x^2`)}
				in the expansion of ${display(`${binom1} + ${binom2}.`)}
			`;
			const working = new ExpressionWorking(x2Coeff1.plus(x2Coeff2), { equalStart: true });
			working.subIn({ a }, { intertext: `= 10\\left(${a}\\right)^3 + 240` });
			const sol = alignStar(`&\\textrm{Coefficient of } x^2
				\\\\${working}
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	function binomExpansionWorking(binom: ExpansionTerm, terms: number): string {
		const [exp] = binom.expPowerMap.keys();
		const power = binom.expPowerMap.get(exp)!;
		const [a, b] = exp.terms;
		const aTerm = `${a}`.length > 1 ? `\\left( ${a} \\right)` : `${a}`;
		let string = '';
		for (let r = 0; r < terms; r++) {
			if (r === 0) {
				string += `${aTerm}^${power}`;
			} else {
				const rPower = r === 1 ? '' : `${r}`.length > 1 ? `^{${r}}` : `^${r}`;
				const nMinusR = power.minus(r);
				const nMinusRPower = `${nMinusR}`.length > 1 ? `{${nMinusR}}` : `${nMinusR}`;
				string += `+ {${power} \\choose ${r}} ${aTerm}^${nMinusRPower} \\left( ${b} \\right)${rPower}`;
			}
		}
		return string;
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h2 id="title">{title}</h2>
	<h3>Questions</h3>
	<Answer2 answers={questions} questionMode={true} />
	<hr />
	<h3>Answers</h3>
	<Answer2 {answers} />
</section>
