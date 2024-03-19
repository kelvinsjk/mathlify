import { EquationWorking } from '../eqn-working/index.js';

// TODO: combine isolate and makeSubjectFromProduct into one step and hide intermediate working by default

/** @typedef {import('../../../core').Expression} Expression */
/** @typedef {import('../../../equation').Equation} Equation */
export const solvers = {
	/**
	 * @param {Expression|Equation} exp
	 * @param {string} [variable='x']
	 * @returns {{working: string, cols: number, roots: Expression[]}}
	 */
	zeroProduct: (exp, variable = 'x') => {
		if (exp.type === 'equation' && !(exp.rhs.node.type === 'numeral' && exp.rhs.node.is.zero())) {
			throw new Error('The right-hand side of the equation must be zero');
		}
		exp = exp.type === 'equation' ? exp.lhs : exp;
		if (exp.node.type === 'exponent') {
			const working = new EquationWorking(exp.node.baseExp, 0, { aligned: true });
			working.isolate(variable, { hide: true });
			working._makeSubjectFromProduct(variable);
			return { working: working.toString(), cols: 1, roots: [working.eqn.rhs] };
		} else if (exp.node.type === 'product') {
			/** @type {EquationWorking[]} */
			const workings = [];
			exp.node._factorsExp.forEach((factor) => {
				if (factor.node.type === 'exponent') {
					workings.push(new EquationWorking(factor.node.baseExp, 0, { aligned: true }));
				} else {
					workings.push(new EquationWorking(factor, 0, { aligned: true }));
				}
			});
			workings.forEach((working) => {
				working.isolate(variable);
				working._makeSubjectFromProduct(variable);
			});
			const rows = workings.map((working) => working._to_string_array());
			const maxRows = Math.max(...rows.map((arr) => arr.length));
			let content = '';
			for (let i = 0; i < maxRows; i++) {
				const separator = i === 0 ? ' &&\\quad\\text{ or }\\quad& ' : ' &&\\quad& ';
				if (i !== 0) content += '\n\t\\\\ ';
				for (const [j, row] of rows.entries()) {
					content += j === 0 ? '' : separator;
					content += row[i] ?? '&';
				}
			}
			const alignatArg = workings.length * 2 - 1;
			const roots = workings.map((working) => working.eqn.rhs);
			return { working: content, cols: alignatArg, roots };
		} else {
			throw new Error('The expression must be a product or an exponent');
		}
	},
};
