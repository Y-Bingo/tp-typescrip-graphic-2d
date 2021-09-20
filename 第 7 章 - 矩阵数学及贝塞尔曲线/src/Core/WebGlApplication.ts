import { Application } from './Application';

export class WebGLApplication extends Application {
	public context3D: WebGLRenderingContext | null;

	constructor(
		canvas: HTMLCanvasElement,
		contextAttributes?: WebGLContextAttributes,
	) {
		super(canvas);

		this.context3D = canvas.getContext('webgl', contextAttributes);
		if (this.context3D === null) {
			this.context3D = this.canvas.getContext(
				'experimental-webgl',
				contextAttributes,
			) as WebGLRenderingContext;
			if (this.context3D === null) {
				alert(' 无法创建WebGLRenderingContext 上下文对象 ');
				throw new Error('无法创建WebGLRenderingContext 上下文对象');
			}
		}
	}
}
