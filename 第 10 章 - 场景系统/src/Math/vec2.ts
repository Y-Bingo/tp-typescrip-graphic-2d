import { EPSILON, Math2D } from "./math2D";

export class vec2 {
  public values: Float32Array;        // 使用float32Array，不需要进行引用类型到值类型，以及值类型到引用类型的转换，效率高

  public constructor( x: number = 0, y: number = 0 ) {
    this.values = new Float32Array( [ x, y ] );
  }

  // 特殊单位向量
  public static xAxis = new vec2( 1, 0 );
  public static yAxis = new vec2( 0, 1 );
  public static nXAxis = new vec2( -1, 0 );
  public static nYAxis = new vec2( 0, -1 );

  public toString(): string {
    return " [ " + this.values[ 0 ] + " , " + this.values[ 1 ] + " ] ";
  }

  get x(): number { return this.values[ 0 ]; }
  set x( x: number ) { this.values[ 0 ] = x; }

  get y(): number { return this.values[ 1 ]; }
  set y( y: number ) { this.values[ 1 ] = y; }

  public reset( x: number = 0, y: number ): vec2 {
    this.values[ 0 ] = x;
    this.values[ 1 ] = y;
    return this;
  }

  public static create( x: number = 0, y: number = 0 ): vec2 {
    return new vec2( x, y );
  }

  // 复制当前向量到result中
  public static copy( src: vec2, result: vec2 | null = null ): vec2 {
    if ( result == null ) result = new vec2();
    result.values[ 0 ] = src.values[ 0 ];
    result.values[ 1 ] = src.values[ 1 ];
    return result;
  }

  // 避免误差使用EPSILON做容差处理
  public equals( vector: vec2 ): boolean {
    if ( Math.abs( this.values[ 0 ] - vector.values[ 0 ] ) > EPSILON )
      return false;
    if ( Math.abs( this.values[ 1 ] - vector.values[ 1 ] ) > EPSILON )
      return false;
    return true;
  }

  // 返回没有开根号的向量大小
  public get squaredLength(): number {
    let x = this.values[ 0 ];
    let y = this.values[ 1 ];
    return ( x * x + y * y );
  }

  // 返回真正的向量大小
  public get length(): number {
    return Math.sqrt( this.squaredLength );
  }

  // 修改内部的向量的x和y值，修改后的向量大小为1.0（单位向量），并返回未修改前的向量大小
  public normalize(): number {
    let len: number = this.length;
    // 对0向量的判断与处理
    if ( Math2D.isEquals( len, 0 ) ) {
      console.log( "长度为0，非方向向量，this.length = 0" );
      this.values[ 0 ] = 0;
      this.values[ 1 ] = 0;
      return 0;
    }

    // 如果是单位向量， 直接返回1.0
    if ( Math2D.isEquals( len, 1 ) ) {
      return 1.0;
    }

    // 否者计算出单位向量（也就是方向）
    this.values[ 0 ] /= len;
    this.values[ 1 ] /= len;

    return len;
  }

  // 静态方法：向量加法
  public static sum( left: vec2, right: vec2, result: vec2 | null = null ): vec2 {
    // 如果输出参数result为null，则分配内存给result
    if ( result == null ) result = new vec2();
    // x和y分量分别相加，结果仍然是一个向量
    result.values[ 0 ] = left.values[ 0 ] + right.values[ 0 ];
    result.values[ 1 ] = left.values[ 1 ] + right.values[ 1 ];

    return result;
  }

  // 实例方法：向量加法
  public add( right: vec2 ): vec2 {
    // this + right = this
    vec2.sum( this, right, this );
    return this;
  }

  // 静态减法：向量减法
  public static difference( end: vec2, start: vec2, result: vec2 | null = null ): vec2 {
    // 如果输出参数result为null，则分配内存给result变量
    if ( result == null ) result = new vec2();
    // x 和 y分量分别相减，结果仍旧为一个向量
    result.values[ 0 ] = end.values[ 0 ] - start.values[ 0 ];
    result.values[ 1 ] = end.values[ 1 ] - start.values[ 1 ];

    return result;
  }

  // 实例方法： 向量减法
  public substract( another: vec2 ): vec2 {
    // this - right = this;
    vec2.difference( this, another, this );
    return this;
  }

  // 负向量，得到一个以原来向量方向相反，大小相同的向量
  public negative(): vec2 {
    this.values[ 0 ] = -this.values[ 0 ];
    this.values[ 1 ] = -this.values[ 1 ];
    return this;
  }

  // 静态方法：向量与标量的相乘
  public static scale( direction: vec2, scalar: number, result: vec2 | null = null ): vec2 {
    if ( result == null ) result = new vec2();
    result.values[ 0 ] = direction.values[ 0 ] * scalar;
    result.values[ 1 ] = direction.values[ 1 ] * scalar;
    return result;
  }

  // 静态方法： result = start + direction * scalar; 将一个点沿着direction方向，移动scalar个单位
  public static scaleAdd( start: vec2, direction: vec2, scalar: number, result: vec2 | null = null ): vec2 {
    if ( result == null ) result = new vec2();
    vec2.scale( direction, scalar, result );

    return vec2.sum( start, result, result );
  }

  // 静态方法： 点积
  public static dotProduct( left: vec2, right: vec2 ): number {
    return left.values[ 0 ] * right.values[ 0 ] + left.values[ 1 ] * right.values[ 1 ];
  }

  // 实例方法： 內积
  public innerProduct( right: vec2 ): number {
    return vec2.dotProduct( this, right );
  }

  // 静态方法： 叉积，返回标量
  public static crossProduct( left: vec2, right: vec2 ): number {
    return left.x * right.y - left.y * right.x;
  }

  // 静态方法： 向量夹角的计算
  public static getAngle( a: vec2, b: vec2, isRadian: boolean = false ): number {
    let dot: number = vec2.dotProduct( a, b );
    let radian = Math.acos( dot / ( a.length * b.length ) );
    if ( isRadian == false )
      radian = Math2D.toDegree( radian );
    return radian;
  }

  // 静态方法：朝向，表示物体的方向
  public static getOrientation( from: vec2, to: vec2, isRadian: boolean = false ): number {
    let diff: vec2 = vec2.difference( to, from );
    let radian = Math.atan2( diff.y, diff.x );
    if ( isRadian )
      radian = Math2D.toDegree( radian );
    return radian;
  }

  // 静态方法：计算两个向量夹角的 sin 值
  public static sinAngle( a: vec2, b: vec2, norm: boolean = false ): number {
    if ( norm === true ) {
      a.normalize();
      b.normalize();
    }
    return a.x * b.y - b.x * a.y;
  }

  // 静态方法：计算两个向量夹角的 cos 值
  public static cosAngle( a: vec2, b: vec2, norm: boolean = false ): number {
    if ( norm === true ) {
      a.normalize();
      b.normalize();
    }
    return vec2.dotProduct( a, b );
  }
}