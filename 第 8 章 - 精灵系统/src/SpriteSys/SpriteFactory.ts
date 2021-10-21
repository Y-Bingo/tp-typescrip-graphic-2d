import { vec2 } from '../Math/vec2';
import { IShape, ISprite } from './ISprite';
import { Line } from './Shape/Line';
import { Sprite2D } from './Sprite2D';

export class SpriteFactory {
	public static createSprite(shape: IShape, name: string): ISprite {
		let spr: ISprite = new Sprite2D(shape, name);
		return spr;
	}

	// 通过两点获取的一条直线
	public static createLine(start: vec2, end: vec2): IShape {
		let line: Line = new Line();
		line.start = start;
		line.end = end;
		return line;
	}

	//  通过线段长度和[ 0 , 1 ] 之间的 t 获得一条与 x 轴方向平行的、原点在该线段任意一天点的直线
	public static createXLine(len: number = 10, t: number = 0): IShape {
		return new Line(len, t);
	}
}
