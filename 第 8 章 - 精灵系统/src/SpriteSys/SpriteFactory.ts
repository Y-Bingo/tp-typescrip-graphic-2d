import { IShape, ISprite } from './ISprite';
import { Sprite2D } from './Sprite2D';

export class SpriteFactory {
	public static createSprite(shape: IShape, name: string): ISprite {
		let spr: ISprite = new Sprite2D(shape, name);
		return spr;
	}
}
