import { mat2d } from '../Math/matrix';
import { vec2 } from '../Math/vec2';
import {
    EOrder,
    ERenderType,
    IShape,
    ISprite,
    ISpriteContainer,
    KeyboardEventHandler,
    MouseEventHandler,
    RenderEventHandler,
    UpdateEventHandler
} from './ISprite';
import { SpriteNode } from './SpriteNode';
import { Transform2D } from './Transform2D';
import { TreeNode } from './TreeNode';

// 实现 ISprite
export class Sprite2D implements ISprite {
	// IRenderState 接口需要的成员属性（或变量）
	public showCoordSystem: boolean = false;
	public renderType: ERenderType = ERenderType.FILL;
	public isVisible: boolean = true;
	public fillStyle: string | CanvasGradient | CanvasPattern = 'white';
	public strokeStyle: string | CanvasGradient | CanvasPattern = 'black';
	public lineWidth: number = 1;
	// ITransformable 接口成员属性和方法都委托到 Transform2D 来实现
	public transform: Transform2D = new Transform2D();
	public name: string;
	public shape: IShape;
	public data: any;
	public owner!: ISpriteContainer; // 确保被设置，当前精灵的拥有者
	// 事件回调
	public mouseEvent: MouseEventHandler | null = null;
	public keyEvent: KeyboardEventHandler | null = null;
	public updateEvent: UpdateEventHandler | null = null;
	public renderEvent: RenderEventHandler | null = null;

	// 构造函数
	public constructor(shape: IShape, name: string) {
		this.name = name;
		this.shape = shape;
	}

	public get x(): number {
		return this.transform.position.x;
	}

	public set x(x: number) {
		this.transform.position.x = x;
	}

	public get y(): number {
		return this.transform.position.y;
	}

	public set y(y: number) {
		this.transform.position.y = y;
	}

	public get rotation(): number {
		return this.transform.rotation;
	}

	public set rotation(rotation: number) {
		this.transform.rotation = rotation;
	}

	public get scaleX(): number {
		return this.transform.scale.x;
	}

	public set scaleX(scaleX: number) {
		this.transform.scale.x = scaleX;
	}

	public get scaleY(): number {
		return this.transform.scale.y;
	}

	public set scaleY(scaleY: number) {
		this.transform.scale.y = scaleY;
	}

	public getWorldMatrix(): mat2d {
		// 使用 js  instance 操作符，能判断 this.owner 是不是 SpriteNode 类的对象
		// 如果是，则获得当前精灵的根节点精灵合成的局部-全局变换矩阵
		if (this.owner instanceof SpriteNode) {
			let arr: TreeNode<ISprite>[] = [];
			let cur: TreeNode<ISprite> | undefined = this.owner as SpriteNode;
			while (cur !== undefined) {
				arr.push(cur);
				cur = cur.parent;
			}
			let out: mat2d = mat2d.create();
			let currMat: mat2d;
			for (let i: number = arr.length - 1; i >= 0; i--) {
				cur = arr[i];
				if (cur.data) {
					// transform2D 类并没有公开接口给 ISprite 接口，因此需要证明
					// as 关键词惊醒向下转型操作
					currMat = (cur.data as Sprite2D).transform.toMatrix();
					mat2d.multiply(out, currMat, out);
				}
			}
			return out;
		} else {
			return this.transform.toMatrix();
		}
	}

	public getLocalMatrix(): mat2d {
		let src: mat2d = this.getWorldMatrix();
		let out: mat2d = mat2d.create();
		if (mat2d.invert(src, out)) {
			return out;
		} else {
			throw new Error('矩阵求逆失败');
		}
	}

	public update(msec: number, diff: number, order: EOrder): void {
		// 如果当前有精灵挂接 updateEvent， 则触发是事件
		if (this.updateEvent) {
			this.updateEvent(this, msec, diff, order);
		}
	}

	public hitTest(localPt: vec2): boolean {
		if (this.isVisible) {
			return this.shape.hitTest(localPt, this);
		} else {
			return false;
		}
	}

	public draw(context: CanvasRenderingContext2D): void {
		if (this.isVisible) {
			// 渲染状态进栈
			// 然后设置渲染状态及当前变换矩阵
			this.shape.beginDraw(this, this, context);
			// 在 Draw 之前，触发 PREORDER 渲染事件
			if (this.renderEvent !== null) {
				this.renderEvent(this, context, EOrder.PREORDER);
			}
			// 调用主要的绘制方法
			this.shape.draw(this, this, context);
			// 在 draw 之后，触发 POSTORDER 渲染事件
			if (this.renderEvent !== null) {
				this.renderEvent(this, context, EOrder.POSTORDER);
			}
			this.shape.endDraw(this, this, context);
		}
	}
}
