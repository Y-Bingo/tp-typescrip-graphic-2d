import { vec2 } from './vec2';

export class Size {
	public values: Float32Array;
	constructor(w: number = 1, h: number = 1) {
		this.values = new Float32Array([w, h]); //
	}

	public set width(value: number) {
		this.values[0] = value;
	}
	public get width(): number {
		return this.values[0];
	}

	public set height(value: number) {
		this.values[1] = value;
	}
	public get height(): number {
		return this.values[1];
	}

	public static create(w: number = 1, h: number = 1): Size {
		return new Size();
	}
}

// 矩形包围框
export class Rectangle {
	public origin: vec2;
	public size: Size;
	public constructor(origin: vec2 = new vec2(), size: Size = new Size(1, 1)) {
		this.origin = origin;
		this.size = size;
	}

	public static create(
		x: number = 0,
		y: number = 0,
		w: number = 1,
		h: number = 1,
	): Rectangle {
		let origin: vec2 = new vec2(x, y);
		let size: Size = new Size(w, h);
		return new Rectangle(origin, size);
	}

	isEmpty(): boolean {
		let area: number = this.size.width * this.size.height;
		if (area === 0) {
			return true;
		}
		return false;
	}
}
