import { IEnumerator } from "../Core/IEnumerator";
import { Math2D } from "../math/math2D";
import { vec2 } from "../Math/vec2";

export interface IBezierEnumerator extends IEnumerator<vec2> {
  steps: number;
}

export class BezierEnumerator implements IBezierEnumerator {

  private _steps: number;
  private _i: number;  // 1.0 / ( this._steps )， 表示每次 t 的增量在 [ 0, 1 ] 之间
  private _startAnchorPoint: vec2;
  private _endAnchorPoint: vec2;
  private _controlPoint0: vec2;
  private _controlPoint1: vec2 | null;

  private _curIndex: number; // 用来表明当前迭代到哪一步

  public constructor( start: vec2, end: vec2, control0: vec2, control1: vec2 | null = null, steps: number = 30 ) {
    // 初始化控制点
    this._startAnchorPoint = start;
    this._endAnchorPoint = end;
    this._controlPoint0 = control0;
    this._controlPoint1 = control1;

    this._steps = steps;
    this._i = 1.0 / ( this._steps );
    this._curIndex = -1;
  }

  public reset(): void {
    this._curIndex = -1;
  }

  public get current(): vec2 {
    if ( this._controlPoint1 !== null ) {
      return Math2D.getCubicBezierVector( this._startAnchorPoint, this._controlPoint0, this._controlPoint1, this._endAnchorPoint, this._curIndex * this._i );
    } else {
      return Math2D.getQuadraticBezierVector( this._startAnchorPoint, this._controlPoint0, this._endAnchorPoint, this._curIndex * this._i );
    }
  }

  public moveNext(): boolean {
    this._curIndex++;
    return this._curIndex < this._steps;
  }

  public get steps(): number {
    this._i = 1.0 / this._steps;
    return this._steps;
  }

  public set steps( steps: number ) {
    this._steps = steps;
    this.reset();
  }
}