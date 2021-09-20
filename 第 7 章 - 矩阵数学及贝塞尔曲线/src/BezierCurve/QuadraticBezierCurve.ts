import { ApplicationTest } from '../ApplicationTest';
import { CanvasMouseEvent } from '../Core/Event';
import { Math2D } from '../Math/math2D';
import { vec2 } from '../Math/vec2';
import { IBezierEnumerator } from './BezierEnumetator';
import { BezierFactory } from './BezierFactory';

/** 选中控制点的类型 */
export enum ECurveHitType {
	NONE, // 没有选中
	START_POINT, // 选中起点
	END_POINT, // 选中终点
	CONTROL_POINT0, // 选中控制点 0
	CONTROL_POINT1, // 选中控制点 1， 针对三次贝塞尔曲线
}

/**
 * 贝塞尔曲线
 */
export class QuadraticBezierCurve {
	// 受保护的成员变量，能够被继承的子类访问
	protected _startAnchorPoint: vec2; // 起点，相当于 p0 点
	protected _endAnchorPoint: vec2; // 终点， 相当于 p2 点
	protected _controlPoint0: vec2; // 控制点，相当于 p1 点

	protected _drawLine: boolean; // 是否要绘制连线，方块表示的锚点和原点表示的控制点
	protected _lineColor: string; // 绘制线段的颜色
	protected _lineWidth: number; // 绘制线段的宽度
	protected _radiusOrLen: number; // 方块表示的锚点和原点表示的控制点的大小

	protected _drawSteps: number = 50; // 需要插多少个值点，默认 30 个
	protected _points!: vec2[]; // 计算出来的插值点存储在 _points 数组中
	protected _showCurvePt: boolean = true; // 是否显示所有的插值点，默认显示
	protected _dirty: boolean = true; // 标记变量，用来指明是否要重新计算所有的插值点

	protected _hitType: ECurveHitType = ECurveHitType.NONE; // 初始化没有选中

	protected _iter: IBezierEnumerator; // 迭代器

	constructor( start: vec2, control: vec2, end: vec2, steps: number = 30 ) {
		// 初始化控制点
			this._startAnchorPoint = start;
		this._endAnchorPoint = end;
		this._controlPoint0 = control;

		// 初始化渲染属性
		this._drawLine = true;
		this._lineColor = 'black';
		this._lineWidth = 1;
		this._radiusOrLen = 5;

		this._dirty = true;
		this._showCurvePt = true;

		this._drawSteps = steps;
		this._points = [];
		this._iter = BezierFactory.createQuadraticBezierEnumerator(
			start,
			control,
			end,
			steps,
		);
	}

	// @private
	private _calcDrawPoints(): void {
		// 如果 dirty 为 true， 才重新计算所有的插值点
		if (this._dirty) {
			this._points = [];
			this._iter.reset();
			while (this._iter.moveNext()) {
				this._points.push(this._iter.current!);
			}
			this._dirty = false;
		}
	}

	public draw(app: ApplicationTest, useMyCurveDrawFunc: boolean = true): void {
		if (app.context2D !== null) {
			app.context2D.save();
			// 设置线段的渲染属性
			app.context2D.lineWidth = this._lineWidth;
			app.context2D.strokeStyle = this._lineColor;
			// 二次贝塞尔曲线绘制的代码
			app.context2D.beginPath();

			app.context2D.moveTo(this._points[0].x, this._points[0].y);
			if (useMyCurveDrawFunc === false) {
				app.context2D.quadraticCurveTo(
					this._controlPoint0.x,
					this._controlPoint0.y,
					this._endAnchorPoint.x,
					this._endAnchorPoint.y,
				);
			} else {
				// 只需要将计算出来的插值用lineTo 方法连接起来就能绘制出自己的曲线
				// 所以曲线的光滑度取决于 drawStep 的数量，数量越多，越光滑
				for (let i = 1; i < this._points.length; i++) {
					app.context2D.lineTo(this._points[i].x, this._points[i].y);
				}
			}
			app.context2D.stroke();

			// 绘制辅助信息
			if (this._drawLine) {
				// 绘制起点 p0 到控制点 p1 的连线
				app.strokeLine(
					this._startAnchorPoint.x,
					this._startAnchorPoint.y,
					this._controlPoint0.x,
					this._controlPoint0.y,
				);
				// 绘制终点 p2 到控制点 p1 的连线
				app.strokeLine(
					this._endAnchorPoint.x,
					this._endAnchorPoint.y,
					this._controlPoint0.x,
					this._controlPoint0.y,
				);

				// 绘制绿色的正方形表示起点 p0
				app.fillRectWithTitle(
					this._startAnchorPoint.x - (this._radiusOrLen + 5) * 0.5,
					this._startAnchorPoint.y - (this._radiusOrLen + 5) * 0.5,
					this._radiusOrLen + 5,
					this._radiusOrLen + 5,
					undefined,
					undefined,
					'green',
					false,
				);
				// 绘制蓝色的正方形表示终点 p2
				app.fillRectWithTitle(
					this._endAnchorPoint.x - (this._radiusOrLen + 5) * 0.5,
					this._endAnchorPoint.y - (this._radiusOrLen + 5) * 0.5,
					this._radiusOrLen + 5,
					this._radiusOrLen + 5,
					undefined,
					undefined,
					'blue',
					false,
				);

				// 绘制红色的原点表示控制点 p1
				app.fillCircle(
					this._controlPoint0.x,
					this._controlPoint0.y,
					this._radiusOrLen,
				);
			}

			// 增加显示已经计算出来的所有插值点
			if (this._showCurvePt) {
				for (let i = 0; i < this._points.length; i++) {
					app.fillCircle(this._points[i].x, this._points[i].y, 2);
				}
			}

			// 绘制三个点的坐标信息，显示出当前 p0、p1 和 p2 的坐标信息
			app.drawCoordInfo(
				'p0: ' + this._startAnchorPoint.toString(),
				this._startAnchorPoint.x,
				this._startAnchorPoint.y - 10,
			);
			app.drawCoordInfo(
				'p1: ' + this._controlPoint0.toString(),
				this._controlPoint0.x,
				this._controlPoint0.y - 10,
			);
			app.drawCoordInfo(
				'p2: ' + this._endAnchorPoint.toString(),
				this._endAnchorPoint.x,
				this._endAnchorPoint.y - 10,
			);

			app.context2D?.restore();
		}
	}

	// 让动画回调中一直调用 update 函数
	// 而 update 函数内部调用 _calcDrawPoints 方法，该方法会根据 _dirty 标记决定是否重新计算插值点
	public update(intervalSec: number) {
		this._calcDrawPoints();
	}

	// 虚方法，子类复写
	protected hitTest(pt: vec2): ECurveHitType {
		if (Math2D.isPointInCircle(pt, this._controlPoint0, this._radiusOrLen)) {
			// 选中控制点 0
			return ECurveHitType.CONTROL_POINT0;
		} else if (
			Math2D.isPointInRect(
				// 选中起点
				pt.x,
				pt.y,
				this._startAnchorPoint.x - (this._radiusOrLen + 5) * 0.5,
				this._startAnchorPoint.y - (this._radiusOrLen + 5) * 0.5,
				this._radiusOrLen + 5,
				this._radiusOrLen + 5,
			)
		) {
			return ECurveHitType.START_POINT;
		} else if (
			Math2D.isPointInRect(
				// 选中终点
				pt.x,
				pt.y,
				this._endAnchorPoint.x - (this._radiusOrLen + 5) * 0.5,
				this._endAnchorPoint.y - (this._radiusOrLen + 5) * 0.5,
				this._radiusOrLen + 5,
				this._radiusOrLen + 5,
			)
		) {
			return ECurveHitType.END_POINT;
		} else {
			return ECurveHitType.NONE;
		}
	}

	// 鼠标事件处理
	public onMouseDown(evt: CanvasMouseEvent): void {
		// 每次 mousedown 时调用 hitTest 进行碰撞检测
		// 将检测到的结果记录下来
		this._hitType = this.hitTest(evt.canvasPosition);
	}

	// 鼠标事件处理
	public onMouseUp(evt: CanvasMouseEvent): void {
		// 每次 mouseUp时， 将_hitType 清空为 NONE
		this._hitType = ECurveHitType.NONE;
	}

	// 鼠标事件处理
	public onMouseMove(evt: CanvasMouseEvent): void {
		// 如果有选中的点
		if (this._hitType !== ECurveHitType.NONE) {
			let ctrPoint = null;
			switch (this._hitType) {
				case ECurveHitType.START_POINT:
					ctrPoint = this._startAnchorPoint;
					break;
				case ECurveHitType.END_POINT:
					ctrPoint = this._endAnchorPoint;
					break;
				case ECurveHitType.CONTROL_POINT0:
					ctrPoint = this._controlPoint0;
					break;
			}
			ctrPoint!.x = evt.canvasPosition.x;
			ctrPoint!.y = evt.canvasPosition.y;
			this._dirty = true;
		}
	}
}
