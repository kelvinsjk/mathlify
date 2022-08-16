import type { Answer } from '$lib/interfaces';
import { Fraction, SquareRoot, Vector, Line, Plane } from 'mathlify';

export function checkAnswer(
	answers: Answer[],
	attempts: (Fraction | SquareRoot | number | Vector | number[] | Line)[],
): boolean {
	return answers.every((answer, i) => {
		const attempt = attempts[i];
		if (answer.specialCase === 'plane') {
			if (answer.value instanceof Plane && attempt instanceof Vector) {
				return answer.value.contains(attempt);
			}
			throw new Error(`Expected ${answer.value} and ${attempt} to be plane+vector`);
		} else if (answer.value instanceof Fraction) {
			if (attempt instanceof Fraction) {
				return answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Fraction`);
		} else if (answer.value instanceof Vector) {
			if (attempt instanceof Vector) {
				return answer.parallel
					? answer.value.isParallelTo(attempt)
					: answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Vector`);
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
		} else if (answer.value instanceof Line) {
			if (attempt instanceof Line) {
				return answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Line`);
		} else if (answer.value instanceof Plane) {
			if (attempt instanceof Plane) {
				return answer.value.isEqualTo(attempt);
			}
			throw new Error(`Expected ${attempt} to be a Plane`);
		} else if (Array.isArray(answer.value)) {
			// number array
			return (
				answer.value.every((x) => (<number[]>attempts[0]).includes(x)) &&
				answer.value.length === (<number[]>attempts[0]).length
			);
		} else {
			// number
			return answer.value === attempts[i];
		}
	});
}
