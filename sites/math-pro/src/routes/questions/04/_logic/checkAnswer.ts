import type { Answer } from '$lib/interfaces';
import { Fraction, SquareRoot, Polynomial } from 'mathlify';

export function checkAnswer(
	answers: Answer[],
	attempts: (Fraction | SquareRoot | number | Polynomial | number[])[],
): boolean {
	return answers.every((answer, i) => {
		const attempt = attempts[i];
		if (answer.value instanceof Fraction) {
			if (attempt instanceof Fraction) {
				return answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Fraction`);
		} else if (answer.value instanceof Polynomial) {
			if (attempt instanceof Polynomial) {
				return answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Polynomial`);
		} else if (answer.value instanceof SquareRoot) {
			if (answer.approx) {
				return (
					Math.abs(answer.value.valueOf() - (<SquareRoot>attempts[i]).valueOf()) <=
					Math.abs(answer.value.valueOf()) / 100
				);
			}
			if (attempt instanceof SquareRoot) {
				return answer.value.isRational()
					? answer.value.isEqualTo(attempt)
					: answer.value.toPrecision(3) === (<SquareRoot>attempts[i]).toPrecision(3);
			}
			throw new Error(`Expected ${attempt} to be a SquareRoot`);
		} else if (Array.isArray(answer.value)) {
			// number array
			return (
				answer.value.every((x) => (<number[]>attempts[0]).includes(x)) &&
				answer.value.length === (<number[]>attempts[0]).length
			);
		} else {
			// number
			const attempt = attempts[i];
			if (attempt instanceof Fraction) {
				return attempt.isEqualTo(<number>answer.value);
			} else if (typeof attempt === 'number') {
				return answer.value === attempt;
			}
			throw new Error(`Expected ${attempt} to be a Fraction or number`);
		}
	});
}
