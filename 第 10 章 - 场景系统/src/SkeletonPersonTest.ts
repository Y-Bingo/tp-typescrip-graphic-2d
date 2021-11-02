import { CanvasKeyBoardEvent, CanvasMouseEvent, EInputEventType } from './Core/Event';
import { IShape, ISprite, ISpriteContainer } from './SpriteSys/ISprite';
import { Sprite2DApplication } from './SpriteSys/Sprite2DApplication';
import { SpriteFactory } from './SpriteSys/SpriteFactory';

class SkeletonPersonTest {
	private _app: Sprite2DApplication;
	private _skeletonPerson!: ISprite;
	private _bone: IShape;
	private _boneLen: number; // 骨骼基准长度
	private _armScale: number; // 手臂精灵缩放系数
	private _hand_foot_Scale: number; // 左手脚精灵 和  右手脚精灵 缩放系数
	private _legScale: number; // 腿部精灵 x 轴方向的缩放系数

	private _hittedBoneSprite: ISprite | null;
	public constructor(app: Sprite2DApplication) {
		this._app = app;
		this._hittedBoneSprite = null;
		this._boneLen = 60;
		this._armScale = 0.8;
		this._hand_foot_Scale = 0.4;
		this._legScale = 1.5;
		// 创建朝向 x 轴，长度为 boneLen 个单位的 Bone 形体实例
		this._bone = SpriteFactory.createBone(this._boneLen, 0);
		this.createSkeleton();

		if (this._app.rootContainer.sprite !== undefined) {
			this._app.rootContainer.sprite.mouseEvent = this.mouseEvent.bind(this);
			this._app.rootContainer.sprite.keyEvent = this.keyEvent.bind(this);
		}
		this._app.start();
	}

	// scale 参数 表示当前创建的精灵 x 轴方向的缩放数
	private _createSkeletonSprite(scale: number, rotation: number, parent: ISpriteContainer, name: string = ''): ISprite {
		let spr: ISprite = SpriteFactory.createSprite(this._bone);
		spr.lineWidth = 2;
		spr.strokeStyle = 'red';
		spr.scaleX = scale;
		spr.rotation = rotation;
		spr.name = name;
		spr.mouseEvent = this.mouseEvent.bind(this);

		parent.addSprite(spr);
		return spr;
	}

	private createSkeleton(x: number = 200, y: number = 200): void {
		let spr: ISprite;
		this._skeletonPerson = this._createSkeletonSprite(1.0, -90, this._app.rootContainer, 'person');
		this._skeletonPerson.x = x;
		this._skeletonPerson.y = y;

		// 头使用一个 半径 10 的圆表示
		let circle: IShape = SpriteFactory.createCircle(10);
		spr = SpriteFactory.createISprite(circle, this._boneLen, 0);
		spr.fillStyle = 'blue';
		spr.rotation = 0;
		this._skeletonPerson.owner.addSprite(spr);

		// 左臂，在身躯的基础上逆时针旋转 90°
		spr = this._createSkeletonSprite(this._armScale, -90, this._skeletonPerson.owner);
		// 左手，在左臂的基础上逆时针旋转 90°
		spr = this._createSkeletonSprite(this._hand_foot_Scale, -90, spr.owner);
		spr.x = this._boneLen;

		// 右臂，顺时针旋转 90°
		spr = this._createSkeletonSprite(this._armScale, 90, this._skeletonPerson.owner);
		// 右手，在右臂的基础上顺时针旋转 90°
		spr = this._createSkeletonSprite(this._hand_foot_Scale, -90, spr.owner);
		spr.x = this._boneLen;

		// 左腿
		spr = this._createSkeletonSprite(this._legScale, -160, this._skeletonPerson.owner);
		// 左脚
		spr = this._createSkeletonSprite(this._hand_foot_Scale, 70, spr.owner);
		spr.x = this._boneLen;

		// 右腿
		spr = this._createSkeletonSprite(this._legScale, 160, this._skeletonPerson.owner);
		// 右脚
		spr = this._createSkeletonSprite(this._hand_foot_Scale, -70, spr.owner);
		spr.x = this._boneLen;
	}

	private mouseEvent(spr: ISprite, evt: CanvasMouseEvent): void {
		if (evt.button === 0) {
			if (evt.type === EInputEventType.MOUSEDOWN) {
				if (spr === this._app.rootContainer.sprite) {
					if (this._hittedBoneSprite !== null) {
						this._hittedBoneSprite.strokeStyle = 'red';
						this._hittedBoneSprite.lineWidth = 2;
					}
				} else if (this._hittedBoneSprite !== spr) {
					if (this._hittedBoneSprite !== null) {
						this._hittedBoneSprite.strokeStyle = 'red';
						this._hittedBoneSprite.lineWidth = 2;
					}
					this._hittedBoneSprite = spr;
					this._hittedBoneSprite.strokeStyle = 'green';
					this._hittedBoneSprite.lineWidth = 4;
				}
			} else if (evt.type === EInputEventType.MOUSEDRAG) {
				if (spr === this._skeletonPerson) {
					spr.x = evt.canvasPosition.x;
					spr.y = evt.canvasPosition.y;
				}
			}
		}
	}

	private keyEvent(spr: ISprite, evt: CanvasKeyBoardEvent) {
		if (this._hittedBoneSprite === null) {
			return;
		}

		if (evt.type === EInputEventType.KEYPRESS) {
			if (evt.key === 'f') {
				this._hittedBoneSprite.rotation += 1;
			} else if (evt.key === 'b') {
				this._hittedBoneSprite.rotation -= 1;
			}
		}
	}
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;

let app: Sprite2DApplication = new Sprite2DApplication(canvas, true);

new SkeletonPersonTest(app);
