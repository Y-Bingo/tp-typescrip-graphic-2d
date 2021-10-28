import { CanvasKeyBoardEvent, EInputEventType } from './Core/Event';
import { vec2 } from './Math/vec2';
import { ISprite } from './SpriteSys/ISprite';
import { Sprite2DApplication } from './SpriteSys/Sprite2DApplication';
import { SpriteFactory } from './SpriteSys/SpriteFactory';

class TankDemo2 {
	private _app: Sprite2DApplication;
	private _tankSprite: ISprite;
	private _turretSprite: ISprite;

	constructor(app: Sprite2DApplication) {
		this._app = app;
		this._tankSprite = SpriteFactory.createSprite(SpriteFactory.createRect(80, 50, 0.5, 0.5));
		this._tankSprite.fillStyle = 'blue';
		this._tankSprite.keyEvent = this.keyEvent.bind(this);

		// turretSprite 的位置必须永远和 tankSprite 一致
		this._turretSprite = SpriteFactory.createSprite(SpriteFactory.createXLine(100));
		this._turretSprite.strokeStyle = 'red';
		this._turretSprite.lineWidth = 5;
		this._turretSprite.keyEvent = this.keyEvent.bind(this);
		this._app.rootContainer.addSprite(this._tankSprite);
		this._app.rootContainer.addSprite(this._turretSprite);

		this._app.start();
	}

	private keyEvent(spr: ISprite, evt: CanvasKeyBoardEvent): void {
		if (evt.type === EInputEventType.KEYPRESS) {
			if (evt.key === 'a') {
				this._tankSprite.rotation += 2;
				this._turretSprite.rotation += 2;
			} else if (evt.key === 'q') {
				this._tankSprite.rotation -= 2;
				this._turretSprite.rotation -= 2;
			} else if (evt.key === 'd') {
				this._turretSprite.rotation += 5;
			} else if (evt.key === 'e') {
				this._turretSprite.rotation -= 5;
			} else if (evt.key === 'w') {
				let forward: vec2 = this._tankSprite.getWorldMatrix().xAxis;

				this._tankSprite.x += forward.x * 3;
				this._tankSprite.y += forward.x * 3;
				this._turretSprite.x += forward.x * 3;
				this._turretSprite.y += forward.x * 3;
			} else if (evt.key === 's') {
				let forward: vec2 = this._tankSprite.getWorldMatrix().xAxis;

				this._tankSprite.x -= forward.x * 3;
				this._tankSprite.y -= forward.x * 3;
				this._turretSprite.x -= forward.x * 3;
				this._turretSprite.y -= forward.x * 3;
			}
		}
	}
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;

let app: Sprite2DApplication = new Sprite2DApplication(canvas);

new TankDemo2(app);
