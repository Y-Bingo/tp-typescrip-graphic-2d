import { Canvas2DApplication } from '../Core/Canvas2DApplication';
import { CanvasKeyBoardEvent, CanvasMouseEvent } from '../Core/Event';
import { IDispatcher, ISpriteContainer } from './ISprite';
import { Sprite2DManager } from './Sprite2DSystem';

export class Sprite2DApplication extends Canvas2DApplication {
	// 声明一个受保护的类型为 IDispatch 的成员变量
	// 下面所有的虚方法都委托调用 IDispatcher 相关的方法
	protected _dispatcher: IDispatcher;

	public constructor(canvas: HTMLCanvasElement) {
		document.oncontextmenu = function () {
			return false;
		};
		super(canvas);
		this._dispatcher = new Sprite2DManager();
	}

	// 一个方便的只读属性，返回 ISpriteContainer 容器接口
	// 可以通过该方法，和 ISprite 进行交互
	public get rootContainer(): ISpriteContainer {
		return this._dispatcher.container;
	}

	public update(msec: number, diff: number): void {
		this._dispatcher.dispatchUpdate(msec, diff);
	}

	public render(): void {
		if (this.context2D) {
			// 每次都先将这个画布清空
			this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
			this._dispatcher.dispatchDraw(this.context2D);
		}
	}

	protected dispatchMouseDown(evt: CanvasMouseEvent): void {
		// 调用基类的同名方法
		super.dispatchMouseDown(evt);
		// 事件派发
		this._dispatcher.dispatchMouseEvent(evt);
	}

	protected dispatchMouseUp(evt: CanvasMouseEvent): void {
		super.dispatchMouseUp(evt);
		this._dispatcher.dispatchMouseEvent(evt);
	}

	protected dispatchMouseMove(evt: CanvasMouseEvent): void {
		super.dispatchMouseMove(evt);
		this._dispatcher.dispatchMouseEvent(evt);
	}

	protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
		super.dispatchMouseDrag(evt);
		this._dispatcher.dispatchMouseEvent(evt);
	}

	protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
		super.dispatchKeyDown(evt);
		this._dispatcher.dispatchKeyEvent(evt);
	}

	protected dispatchKeyUP(evt: CanvasKeyBoardEvent): void {
		super.dispatchKeyUp(evt);
		this._dispatcher.dispatchKeyEvent(evt);
	}

	protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
		super.dispatchKeyPress(evt);
		this._dispatcher.dispatchKeyEvent(evt);
	}
}
