import { Math2D } from './math2D';
import { vec2 } from './vec2';

// 矩阵类
export class mat2d {
	/**
	 * 使用强类型数组来表示矩阵的各个元素
	 * 防射矩阵最后一行总是为[ 0， 0， 1 ]，因此不需要浪费三个浮点数来存储这三个变量
	 */
	public values: Float32Array;
	public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, x: number = 0, y: number = 0) {
		this.values = new Float32Array([a, b, c, d, x, y]);
	}
	public static create(a: number = 1, b: number = 0, c: number = 0, d: number = 1, x: number = 0, y: number = 0): mat2d {
		return new mat2d(a, b, c, d, x, y);
	}

	public get xAxis(): vec2 {
		return vec2.create(this.values[0], this.values[1]);
	}

	public get yAxis(): vec2 {
		return vec2.create(this.values[2], this.values[3]);
	}

	/**
	 * 矩阵乘法
	 *
	 *  a0 a2 a4      b0 b2 b4      a0*b0+a2*b1 a0*b2+a2*b3 a0*b4+a2*b5+a4
	 *  a1 a3 a5  x   b1 b3 b5   =  a1*b0+a3*b1 a1*b2+a3*b3 a1*b4+a3*b5+a5
	 *  0  0  1       0  0  1       0           0           1
	 *
	 */
	public static multiply(left: mat2d, right: mat2d, result: mat2d | null = null): mat2d {
		if (result == null) result = new mat2d();
		let a0 = left.values[0];
		let a1 = left.values[1];
		let a2 = left.values[2];
		let a3 = left.values[3];
		let a4 = left.values[4];
		let a5 = left.values[5];

		let b0 = right.values[0];
		let b1 = right.values[1];
		let b2 = right.values[2];
		let b3 = right.values[3];
		let b4 = right.values[4];
		let b5 = right.values[5];

		result.values[0] = a0 * b0 + a2 * b1;
		result.values[1] = a1 * b0 + a3 * b1;
		result.values[2] = a0 * b2 + a2 * b3;
		result.values[3] = a1 * b2 + a3 * b3;
		result.values[4] = a0 * b4 + a2 * b5 + a4;
		result.values[5] = a1 * b4 + a3 * b5 + a5;

		return result;
	}

	// 转换为单位矩阵
	public identity(): void {
		this.values[0] = 1.0;
		this.values[1] = 0.0;
		this.values[2] = 0.0;
		this.values[3] = 1.0;
		this.values[4] = 0.0;
		this.values[5] = 0.0;
	}

	// 计算矩阵的行列式
	public static determinant(mat: mat2d): number {
		return mat.values[0] * mat.values[3] - mat.values[2] * mat.values[1];
	}

	// 求矩阵src的逆矩阵，蒋结算后的逆矩阵从result参数中输出
	// 如果有逆矩阵，返回true；否则返回false
	// 下面的代码中使用：伴随矩阵/行列式的方式来求矩阵的逆
	public static invert(src: mat2d, result: mat2d): boolean {
		// 1.获取要求逆的矩阵的行列式
		let det: number = mat2d.determinant(src);
		// 2.如果行列式为0，则无法求逆，直接返回false
		if (Math2D.isEquals(det, 0)) return false;
		// 3.使用：伴随矩阵/行列式 的算法来求矩阵的逆
		// 由于计算机的出发效率低，先进行一次除法，求行列式的倒数
		// 后面代码就可以直接乘以行列式的倒数，这样避免了多次除法操作
		det = 1.0 / det;
		// 4.下面代码中，*det之前的代码都是求表针伴随矩阵的源码
		// 最后乘以行列式的倒数，获得每个元素的正确数值
		result.values[0] = src.values[3] * det;
		result.values[1] = -src.values[1] * det;
		result.values[2] = -src.values[2] * det;
		result.values[3] = src.values[0] * det;
		result.values[4] = (src.values[2] * src.values[5] - src.values[3] * src.values[4]) * det;
		result.values[5] = (src.values[1] * src.values[4] - src.values[0] * src.values[5]) * det;
		// 如果矩阵求逆成功, 返回true
		return true;
	}

	/**
	 * 矩阵平移
	 */
	public static makeTranslation(tx: number, ty: number, result: mat2d | null = null): mat2d {
		if (result == null) result = new mat2d();
		result.values[0] = 1;
		result.values[1] = 0;
		result.values[2] = 0;
		result.values[3] = 1;
		result.values[4] = tx;
		result.values[5] = ty;

		return result;
	}

	/**
	 * 矩阵拷贝
	 */
	public static copy(src: mat2d, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values[0] = src.values[0];
		result.values[1] = src.values[1];
		result.values[2] = src.values[2];
		result.values[3] = src.values[3];
		result.values[4] = src.values[4];
		result.values[5] = src.values[5];
		return result;
	}

	/**
	 * 矩阵缩放
	 */
	public static makeScale(sx: number, sy: number, result: mat2d | null = null): mat2d {
		if (result == null) result = new mat2d();
		result.values[0] = sx;
		result.values[1] = 0;
		result.values[2] = 0;
		result.values[3] = sy;
		result.values[4] = 0;
		result.values[5] = 0;

		return result;
	}

	/**
	 * 矩阵旋转
	 */
	public static makeRotation(radians: number, result: mat2d | null = null): mat2d {
		if (result == null) result = new mat2d();
		let s = Math.sin(radians);
		let c = Math.cos(radians);
		result.values[0] = c;
		result.values[1] = s;
		result.values[2] = -s;
		result.values[3] = c;
		result.values[4] = 0;
		result.values[5] = 0;

		return result;
	}

	/**
	 * 求旋转矩阵的逆矩阵
	 */
	public onlyRotationMatrixInvert(): mat2d {
		let s = this.values[1];
		this.values[1] = this.values[2];
		this.values[2] = s;
		return this;
	}

	/**
	 * 通过向量来求旋转矩阵
	 */
	public static makeRotationFromVectors(v1: vec2, v2: vec2, norm: boolean = false, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();

		result.values[0] = vec2.cosAngle(v1, v2, norm);
		result.values[1] = vec2.sinAngle(v1, v2, norm);
		result.values[2] = -vec2.sinAngle(v1, v2, norm);
		result.values[3] = vec2.cosAngle(v1, v2, norm);
		result.values[4] = 0;
		result.values[5] = 0;
		return result;
	}
}

/**
 * 矩阵堆栈
 */
export class MatrixStack {
	// 持有一个矩阵堆栈
	private _mats: mat2d[];

	public constructor() {
		// 初始化矩阵堆栈后 push 一个单位矩阵
		this._mats = [];
		this._mats.push(new mat2d());
	}

	/**
	 * 获取栈顶的矩阵
	 * 矩阵堆栈操作的都是当前栈顶的矩阵
	 */
	public get matrix(): mat2d {
		if (this._mats.length === 0) {
			throw new Error("'矩阵堆栈为空'");
		}
		return this._mats[this._mats.length - 1];
	}

	/**
	 * 复制栈顶的矩阵，将其 push 到堆栈中成为当前操作的矩阵
	 */
	public pushMatrix(): void {
		let mat: mat2d = mat2d.copy(this.matrix);
		this._mats.push(mat);
	}

	/**
	 * 删除栈顶矩阵
	 */
	public popMatrix(): void {
		if (this._mats.length === 0) {
			throw new Error("'矩阵堆栈为空'");
		}
		this._mats.pop();
	}

	/**
	 * 将栈顶的矩阵设置为单位矩阵
	 */
	public loadIdentity(): void {
		this.matrix.identity();
	}

	/**
	 * 将参数 mat 矩阵替换栈顶的矩阵
	 */
	public loadMatrix(mat: mat2d) {
		mat2d.copy(mat, this.matrix);
	}

	/**
	 * 将栈顶矩阵与参数矩阵相乘
	 * 作用是更新栈顶元素，积累变换的效果
	 * 是一个关键操作
	 */
	public multMatrix(mat: mat2d) {
		mat2d.multiply(this.matrix, mat, this.matrix);
	}

	/**
	 * 平移操作
	 */
	public translate(x: number = 0, y: number = 0): void {
		let mat: mat2d = mat2d.makeTranslation(x, y);
		// 看到 translate、rotate 和 scale 都会调用 multMatrix 方法
		this.multMatrix(mat);
	}

	/**
	 * 旋转
	 */
	public rotate(angle: number, isRadian: boolean = true): void {
		if (isRadian === false) {
			angle = Math2D.toRadian(angle);
		}
		let mat: mat2d = mat2d.makeRotation(angle);
		this.multMatrix(mat);
	}

	/**
	 * 从两个向量构建旋转矩阵
	 */
	public rotateFrom(v1: vec2, v2: vec2, norm: boolean = false): void {
		let mat: mat2d = mat2d.makeRotationFromVectors(v1, v2, norm);
		this.multMatrix(mat);
	}

	/**
	 * 缩放
	 */
	public scale(x: number = 1.0, y: number = 1.0): void {
		let mat: mat2d = mat2d.makeScale(x, y);
		this.multMatrix(mat);
	}

	/**
	 * 求逆矩阵
	 */
	public invert(): mat2d {
		let ret: mat2d = new mat2d();
		if (mat2d.invert(this.matrix, ret) === false) {
			throw new Error('堆栈顶部的矩阵为奇异矩阵，无法求逆');
		}
		return ret;
	}
}


