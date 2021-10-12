import { ApplicationTest } from '../ApplicationTest';
import { CanvasMouseEvent } from '../Core/Event';
import { vec2 } from '../Math/vec2';
import { CubeBezierCurve } from "./CubeBezierCurve";
import { QuadraticBezierCurve } from './QuadraticBezierCurve';

export class BezierDemo extends ApplicationTest {
	protected _mouseX: number = 0;
	protected _mouseY: number = 0;

	public isSupportMouseMove: boolean = true;

		private _quadCurve: QuadraticBezierCurve;
		private _cubeCurve: CubeBezierCurve;

	constructor( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
		super(canvas, contextAttributes);
		this._quadCurve = new QuadraticBezierCurve(
			vec2.create(400, 100),
			vec2.create(550, 200),
			vec2.create(400, 300),
		);
		this._cubeCurve = new CubeBezierCurve(
			vec2.create(60, 100),
			vec2.create(240, 100),
			vec2.create(60, 300),
			vec2.create(240, 300)
		)
	}

	public update(elapsedMsec: number, intervalSec: number): void {
		// super.update( elapsedMsec, intervalSec );
		this._quadCurve.update(intervalSec);
		this._cubeCurve.update(intervalSec);
	}

	public render(): void {
		if (this.context2D === null) return;

		this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.strokeGrid();

		this.drawCanvasCoordCenter();
		this.draw4Quadrant();

		this._quadCurve.draw(this);
		this._cubeCurve.draw(this, false);
	}

	protected dispatchMouseUp(evt: CanvasMouseEvent): void {
		this._quadCurve.onMouseUp(evt);
		this._cubeCurve.onMouseUp(evt);
	}

	protected dispatchMouseMove(evt: CanvasMouseEvent): void {
		this._quadCurve.onMouseMove(evt);
		this._cubeCurve.onMouseMove(evt);
	}

	protected dispatchMouseDown(evt: CanvasMouseEvent): void {
		this._quadCurve.onMouseDown(evt);
		this._cubeCurve.onMouseDown(evt);
	}

	public distance(x0: number, y0: number, x1: number, y1: number): number {
		let diffX: number = x1 - x0;
		let diffY: number = y1 - y0;
		return Math.sqrt(diffX * diffX + diffY * diffY);
	}

	// 绘制二次贝赛尔曲线的方法
	public quadraticCurveTo(
		cpx: number,
		cpy: number,
		x: number,
		y: number,
	): void {}

	// 绘制三次贝塞尔曲线的方法
	public bezierCurveTo(
		cp1x: number,
		cp1y: number,
		cp2x: number,
		cp2y: number,
		x: number,
		y: number,
	): void {}
}

let canvas: HTMLCanvasElement = document.querySelector(
	'#canvas',
) as HTMLCanvasElement;
let startBtn: HTMLButtonElement = document.querySelector(
	'#start',
) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector(
	'#stop',
) as HTMLButtonElement;

let app: ApplicationTest = new BezierDemo(canvas);

// app.render();

app.start();

startBtn.onclick = (ev: MouseEvent): void => {
	app.start();
};

stopBtn.onclick = (ev: MouseEvent): void => {
	app.stop();
};
