export class Regression {
	x: string;
	y: string;
	xData: number[];
	yData: number[];

	constructor(xData: number[], yData: number[], options?: { x?: string; y?: string }) {
		this.xData = xData;
		this.yData = yData;
		this.x = options?.x || 'x';
		this.y = options?.y || 'y';
	}

	xBar(): number {
		return sumX(this.xData) / this.xData.length;
	}
	yBar(): number {
		return sumX(this.yData) / this.yData.length;
	}
	r(): number {
		return sXY(this.xData, this.yData) / Math.sqrt(sXX(this.xData) * sXX(this.yData));
	}
	r2(): number {
		return Math.pow(this.r(), 2);
	}

	/**
	 * @returns [a, b] such that y = a + bx
	 */
	yOnX(): [number, number] {
		const b = sXY(this.xData, this.yData) / sXX(this.xData);
		const a = this.yBar() - b * this.xBar();
		return [a, b];
	}

	yOnXAt(x: number): number {
		const [a, b] = this.yOnX();
		return a + b * x;
	}
	/**
	 * @returns [a, b] such that x = a + by
	 */
	xOnY(): [number, number] {
		const b = sXY(this.xData, this.yData) / sXX(this.yData);
		const a = this.xBar() - b * this.yBar();
		return [a, b];
	}

	toString(precision = 3, options?: { dpMode?: boolean }): string {
		const dpMode = options?.dpMode || false;
		const [a, b] = this.yOnX();
		const aString = dpMode ? a.toFixed(precision) : a.toPrecision(precision);
		const sign = b > 0 ? '+' : '';
		const bString = dpMode ? b.toFixed(precision) : b.toPrecision(precision);
		return `${this.y} = ${aString}${sign}${bString}${this.x}`;
	}

	linearize(functions?: {
		xFn?: ((x1: number) => number) | 'ln' | 'reciprocal' | 'square';
		yFn?: ((y1: number) => number) | 'ln' | 'reciprocal' | 'square';
		x?: string;
		y?: string;
	}): Regression {
		const { xFn, yFn, x, y } = {
			xFn: (x1: number) => x1,
			yFn: (y1: number) => y1,
			x: this.x,
			y: this.y,
			...functions,
		};
		let xFnFinal: (x: number) => number;
		let yFnFinal: (x: number) => number;
		if (typeof xFn === 'string') {
			if (xFn === 'ln') {
				xFnFinal = ln;
			} else if (xFn === 'reciprocal') {
				xFnFinal = reciprocal;
			} else if (xFn === 'square') {
				xFnFinal = square;
			} else {
				throw new Error(`Invalid function name ${xFn}`);
			}
		} else {
			xFnFinal = xFn;
		}
		if (typeof yFn === 'string') {
			if (yFn === 'ln') {
				yFnFinal = ln;
			} else if (yFn === 'reciprocal') {
				yFnFinal = reciprocal;
			} else if (yFn === 'square') {
				yFnFinal = square;
			} else {
				throw new Error(`Invalid function name ${xFn}`);
			}
		} else {
			yFnFinal = yFn;
		}
		const xData = this.xData.map(xFnFinal);
		const yData = this.yData.map(yFnFinal);
		return new Regression(xData, yData, { x, y });
	}
}

const sumX = (xData: number[]) => xData.reduce((a, b) => a + b, 0);
const sumX2 = (xData: number[]) => xData.reduce((a, b) => a + b * b, 0);
const sumXY = (xData: number[], yData: number[]) => xData.reduce((a, b, i) => a + b * yData[i], 0);
const sXX = (xData: number[]) => sumX2(xData) - (sumX(xData) * sumX(xData)) / xData.length;
const sXY = (xData: number[], yData: number[]) => sumXY(xData, yData) - (sumX(xData) * sumX(yData)) / xData.length;

function ln(x: number): number {
	return Math.log(x);
}
function reciprocal(x: number): number {
	return 1 / x;
}
function square(x: number): number {
	return x * x;
}
