import { vec2 } from '../Math/vec2';
import { IRenderState, ITransformable } from './ISprite';
import { BaseShape2D } from './Shape/BaseShape2D';

export class BezierPath extends BaseShape2D {
	public points: vec2[]; // 指向参数曲线控制的点击数据源
	public isCubic: boolean; // 是二次还是三次贝塞尔曲线路径

	public constructor(points: vec2[], isCubic: boolean = false) {
		super();
		this.points = points;
		this.isCubic = isCubic;
		this.data = points;
	}

	public get type(): string {
		return 'BezierPath';
	}

	/** 不支持贝塞尔曲线的碰撞检测，直接返回 false  */
	public hitTest(localPt: vec2, transform: ITransformable): boolean {
		return false;
	}

	public draw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {
		context.beginPath();
		context.moveTo(this.points[0].x, this.points[0].y);
		if (this.isCubic) {
			// 绘制三次贝塞尔曲线
			for (let i = 1; i < this.points.length; i += 3) {
				context.bezierCurveTo(
					this.points[i].x,
					this.points[i].y,
					this.points[i + 1].x,
					this.points[i + 1].y,
					this.points[i + 2].x,
					this.points[i + 2].y,
				);
			}
		} else {
			// 绘制二次贝塞尔曲线
			for (let i: number = 1; i < this.points.length; i += 2) {
				context.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
			}
		}
		super.draw(transformable, state, context);
	}
}
