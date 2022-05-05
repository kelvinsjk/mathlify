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
		xFn?: (x1: number) => number;
		yFn?: (y1: number) => number;
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
		const xData = this.xData.map(xFn);
		const yData = this.yData.map(yFn);
		return new Regression(xData, yData, { x, y });
	}
}

const sumX = (xData: number[]) => xData.reduce((a, b) => a + b, 0);
const sumX2 = (xData: number[]) => xData.reduce((a, b) => a + b * b, 0);
const sumXY = (xData: number[], yData: number[]) => xData.reduce((a, b, i) => a + b * yData[i], 0);
const sXX = (xData: number[]) => sumX2(xData) - (sumX(xData) * sumX(xData)) / xData.length;
const sXY = (xData: number[], yData: number[]) =>
	sumXY(xData, yData) - (sumX(xData) * sumX(yData)) / xData.length;
