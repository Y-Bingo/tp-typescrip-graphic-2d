import { vec2 } from '../../Math/vec2';
import { IRenderState, IShape, ITransformable } from '../ISprite';

export class EndClipShape implements IShape {
	public data: any;

	public get type(): string {
		return 'EndClipShape';
	}

	public hitTest(localPt: vec2, transformable: ITransformable): boolean {
		return false;
	}

	public beginDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {}

	public draw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void {}

	public endDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D) {
		context.restore();
	}
}
