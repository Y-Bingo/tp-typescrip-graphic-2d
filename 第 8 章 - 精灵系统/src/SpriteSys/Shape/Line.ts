import { Math2D } from '../../Math/math2D';
import { mat2d } from '../../Math/matrix';
import { vec2 } from '../../Math/vec2';
import { IRenderState, IShape, ITransformable } from '../ISprite';

export class Line implements IShape {
	public start: vec2;
	public end: vec2;
	public data: any;

	/** t 的取值范围在 0 ~ 1 之间，用来控制线段的原点位与线段上的某一处 */
	constructor(len: number = 10, t: number = 0) {
		if (t < 0.0 || t > 1.0) {
			throw Error('参数 t 必须处于 【 0，  1 】 之间');
		}
		this.start = vec2.create(-len * t, 0);
		this.end = vec2.create(len * (1.0 - t), 0);
		this.data = undefined;
	}

	/**
	 * @override
	 * @param localPt
	 * @param transformable
	 */
	public hitTest(localPt: vec2, transformable: ITransformable): boolean {
		return Math2D.isPointOnLineSegment(localPt, this.start, this.end);
	}

	public beginDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {
		context.save();

		context.lineWidth = state.lineWidth;
		context.strokeStyle = state.strokeStyle;

		let mat: mat2d = transformable.getWorldMatrix();
		context.setTransform(mat.values[0], mat.values[1], mat.values[2], mat.values[3], mat.values[4], mat.values[5]);
	}

	public draw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {
		context.beginPath();
		context.moveTo(this.start.x, this.start.y);
		context.lineTo(this.end.x, this.end.y);
		context.stroke();
	}

	public endDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {
		context.restore();
	}

	public get type(): string {
		return 'Line';
	}
}
