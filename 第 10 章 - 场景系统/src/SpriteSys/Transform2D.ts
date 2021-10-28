import { Math2D } from '../Math/math2D';
import { mat2d } from '../Math/matrix';
import { vec2 } from '../Math/vec2';

/**
 * 封装坐标系变换的相关功能
 */
export class Transform2D {
	public position: vec2; // 位移
	public rotation: number; // 方位 （角度表示）
	public scale: vec2; // 缩放

	public constructor(x: number = 0, y: number = 0, rotation: number = 0, scaleX: number = 1, scaleY: number = 1) {
		this.position = new vec2(x, y);
		this.rotation = rotation;
		this.scale = new vec2(scaleX, scaleY);
	}

	public toMatrix(): mat2d {
		Math2D.matStack.loadIdentity(); // 设置矩阵栈顶矩阵归一化
		Math2D.matStack.translate(this.position.x, this.position.y); // 先平移
		Math2D.matStack.rotate(this.rotation, false); // 旋转，最后一个参数 false，表示 rotation 是角度而不是弧度
		Math2D.matStack.scale(this.scale.x, this.scale.y);
		return Math2D.matStack.matrix; // 返回 TRS 合成后的，表示局部到世界的变换矩阵
	}

	public toInvMatrix(result: mat2d): boolean {
		// 获取局部到世界的变换矩阵
		let mat: mat2d = this.toMatrix();
		// 对 mat 矩阵求逆，获得从世界到局部坐标的变换矩阵
		return mat2d.invert(mat, result);
	}
}
